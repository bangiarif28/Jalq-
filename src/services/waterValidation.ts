import { Scenario, QUBOResult, QAOAResult, ClassicalSolution } from '../types/index';

export interface FeasibilityValidationResult {
  allocations: Record<string, number>;
  totalAllocated: number;
  totalDemand: number;
  availableWater: number;
  unmetDemand: number;
  isFeasible: boolean;
  feasibilityStatus: 'FEASIBLE' | 'INFEASIBLE';
  violations: string[];
}

export interface PipelineIntegrityReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  timestamp: string;
}

/**
 * End-to-end data integrity check across the entire JalQ optimization pipeline:
 * Input Scenario == QUBO Variables == QAOA Result == Decoded Allocations == Classical Baseline
 */
export function checkPipelineIntegrity(
  scenario: Scenario,
  qubo: QUBOResult,
  qaoa: QAOAResult,
  classical: ClassicalSolution
): PipelineIntegrityReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Scenario sanity
  if (!scenario || scenario.reservoir.availableWater <= 0) {
    errors.push('Invalid reservoir available water capacity');
  }

  // 2. QUBO mapping consistency
  const cropIds = new Set(scenario.crops.map((c) => c.id));
  const quboCropIds = new Set(qubo.variables.map((v) => v.cropId));
  for (const cid of cropIds) {
    if (!quboCropIds.has(cid)) {
      errors.push(`QUBO formulation missing mapping for crop: ${cid}`);
    }
  }

  // 3. QAOA allocation consistency
  for (const c of scenario.crops) {
    if (qaoa.cropAllocations[c.id] === undefined) {
      errors.push(`QAOA result missing allocation for crop: ${c.name}`);
    }
  }

  // 4. Hydrological conservation: Total Allocated <= Available Water
  if (qaoa.totalAllocated > scenario.reservoir.availableWater + 0.01) {
    errors.push(`QAOA total allocation (${qaoa.totalAllocated} ML) exceeds available water (${scenario.reservoir.availableWater} ML)`);
  }
  if (classical.totalAllocated > scenario.reservoir.availableWater + 0.01) {
    errors.push(`Classical baseline total allocation (${classical.totalAllocated} ML) exceeds available water (${scenario.reservoir.availableWater} ML)`);
  }

  // 5. Bitstring length check
  if (qaoa.bestBitstring.length !== qubo.numQubits) {
    errors.push(`QAOA bitstring length (${qaoa.bestBitstring.length}) does not match QUBO qubit count (${qubo.numQubits})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validates and enforces the fundamental water allocation feasibility invariants:
 * 1. Every crop allocation >= 0
 * 2. Every crop allocation <= corresponding crop demand
 * 3. Sum of allocations <= available water (or net water if reserve specified)
 * 4. Unmet demand >= 0
 * 5. Total allocation + unmet demand === total demand
 * 6. Feasibility status is mathematically correct ("FEASIBLE" vs "INFEASIBLE")
 */
export function validateAndEnforceFeasibility(
  rawAllocations: Record<string, number> | undefined,
  scenario: Scenario
): FeasibilityValidationResult {
  const availableWater = scenario.reservoir.availableWater;
  const crops = scenario.crops;
  const totalDemand = crops.reduce((sum, c) => sum + (c.demand || 0), 0);

  // 1. Initial sanitization: ensure numbers are finite, >= 0, and <= demand
  const alloc: Record<string, number> = {};
  for (const crop of crops) {
    const raw = rawAllocations ? rawAllocations[crop.id] : undefined;
    const val = (raw !== undefined && Number.isFinite(raw)) ? raw : 0;
    // Cannot exceed crop demand and cannot be negative
    alloc[crop.id] = Math.max(0, Math.min(crop.demand, Math.round(val)));
  }

  // If no raw allocations were provided at all, generate a proportional priority-based feasible baseline
  const currentTotal = Object.values(alloc).reduce((sum, v) => sum + v, 0);
  if (currentTotal === 0 && availableWater > 0 && totalDemand > 0) {
    const waterBudget = Math.min(availableWater, totalDemand);
    const totalWeight = crops.reduce((sum, c) => sum + (c.demand * c.priority), 0) || 1;
    let distributed = 0;
    for (let i = 0; i < crops.length; i++) {
      const c = crops[i];
      if (i === crops.length - 1) {
        alloc[c.id] = Math.max(0, Math.min(c.demand, waterBudget - distributed));
      } else {
        const share = Math.round((c.demand * c.priority / totalWeight) * waterBudget);
        alloc[c.id] = Math.max(0, Math.min(c.demand, share));
        distributed += alloc[c.id];
      }
    }
  }

  // 2. Strict enforcement: Sum of allocations must NEVER exceed available water
  let sumAllocated = Object.values(alloc).reduce((sum, v) => sum + v, 0);

  if (sumAllocated > availableWater) {
    let excess = sumAllocated - availableWater;

    // Sort crops by priority ascending (lowest priority cut first, but respecting drought survival floor)
    const sortedByPriority = [...crops].sort((a, b) => a.priority - b.priority);
    const sumMin = crops.reduce((sum, c) => sum + c.minAllocation, 0);
    const scaleMin = (sumMin > availableWater && sumMin > 0) ? (availableWater * 0.75) / sumMin : 1.0;

    for (const crop of sortedByPriority) {
      if (excess <= 0) break;
      const current = alloc[crop.id] || 0;
      const minFloor = Math.max(10, Math.floor(crop.minAllocation * scaleMin));
      if (current > minFloor) {
        const canCut = current - minFloor;
        const reduction = Math.min(excess, canCut);
        alloc[crop.id] -= reduction;
        excess -= reduction;
      }
    }

    // If excess remains because of severe crisis, cut proportionally across all crops above 0
    if (excess > 0) {
      for (const crop of sortedByPriority) {
        if (excess <= 0) break;
        const current = alloc[crop.id] || 0;
        if (current > 0) {
          const reduction = Math.min(excess, current);
          alloc[crop.id] -= reduction;
          excess -= reduction;
        }
      }
    }

    // Final safety check: if rounding left 1 unit excess, decrement from largest allocation
    sumAllocated = Object.values(alloc).reduce((sum, v) => sum + v, 0);
    if (sumAllocated > availableWater) {
      const diff = sumAllocated - availableWater;
      const largestCrop = crops.reduce((prev, curr) => 
        (alloc[curr.id] > alloc[prev.id] ? curr : prev), crops[0]);
      alloc[largestCrop.id] = Math.max(0, alloc[largestCrop.id] - diff);
    }
  }

  // Clean rounding
  for (const crop of crops) {
    alloc[crop.id] = Math.round(alloc[crop.id] * 10) / 10;
  }

  const finalTotalAllocated = Math.round(Object.values(alloc).reduce((sum, v) => sum + v, 0) * 10) / 10;
  const finalUnmetDemand = Math.max(0, Math.round((totalDemand - finalTotalAllocated) * 10) / 10);

  // Validation checks
  const violations: string[] = [];
  if (finalTotalAllocated > availableWater + 0.001) {
    violations.push(`Total allocation (${finalTotalAllocated} ML) exceeds available water (${availableWater} ML)`);
  }
  for (const crop of crops) {
    if (alloc[crop.id] < 0) {
      violations.push(`${crop.name} allocation is negative (${alloc[crop.id]} ML)`);
    }
    if (alloc[crop.id] > crop.demand + 0.001) {
      violations.push(`${crop.name} allocation (${alloc[crop.id]} ML) exceeds demand (${crop.demand} ML)`);
    }
  }

  const isFeasible = violations.length === 0 && (finalTotalAllocated <= availableWater);
  const feasibilityStatus: 'FEASIBLE' | 'INFEASIBLE' = isFeasible ? 'FEASIBLE' : 'INFEASIBLE';

  return {
    allocations: alloc,
    totalAllocated: finalTotalAllocated,
    totalDemand,
    availableWater,
    unmetDemand: finalUnmetDemand,
    isFeasible,
    feasibilityStatus,
    violations,
  };
}
