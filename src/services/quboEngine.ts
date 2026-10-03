import { Scenario, QUBOResult } from '../types';

/**
 * Builds the Quadratic Unconstrained Binary Optimization (QUBO) formulation
 * for the multi-crop, multi-canal constrained water allocation problem.
 * 
 * Maps continuous/discrete water quantities to binary qubits:
 *   x_i = min_i + sum_{k} w_{i,k} * q_{i,k}
 * 
 * Objective: Minimize H_cost(q) = q^T * Q * q + Constant
 */
export function generateQUBO(scenario: Scenario): QUBOResult {
  const crops = scenario.crops;
  const canals = scenario.canals;
  const netReservoirWater = Math.max(0, scenario.reservoir.availableWater - scenario.reservoir.minReserve);

  // Define binary expansion bits for each crop (2 to 3 qubits per crop => 7-8 qubits total)
  interface VariableDef {
    index: number;
    name: string;
    cropId: string;
    cropName: string;
    bitWeight: number;
    minBaseline: number;
  }

  const variables: VariableDef[] = [];
  let varIdx = 0;

  for (const crop of crops) {
    const range = Math.max(20, crop.maxAllocation - crop.minAllocation);
    // 2 or 3 binary bits per crop to represent increments
    const numBits = crop.id === 'paddy' ? 3 : crop.id === 'cotton' ? 3 : 2;
    // Step weights
    const baseStep = Math.round(range / (Math.pow(2, numBits) - 1));

    for (let b = 0; b < numBits; b++) {
      const bitWeight = Math.round(Math.pow(2, b) * baseStep);
      variables.push({
        index: varIdx,
        name: `q_${varIdx} (${crop.name.split(' ')[0]} +${bitWeight})`,
        cropId: crop.id,
        cropName: crop.name,
        bitWeight,
        minBaseline: crop.minAllocation,
      });
      varIdx++;
    }
  }

  const N = variables.length;
  // Initialize N x N matrix Q
  const matrix: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  const quadraticPairs: QUBOResult['quadraticPairs'] = [];

  const P_res = scenario.penalties.reservoirLimitPenalty * 0.08;
  const P_canal = scenario.penalties.canalCapacityPenalty * 0.09;
  const P_shortfall = scenario.penalties.shortfallPenalty * 0.05;

  // Compute baseline sums
  const baselineTotal = crops.reduce((sum, c) => sum + c.minAllocation, 0);
  const baselineExcess = baselineTotal - netReservoirWater;

  // 1. Diagonal terms (Linear terms + self-squared expansions)
  // Each bit q_k contributes:
  // - Utility: - priority * weight
  // - Shortfall reduction: - P_shortfall * 2 * (Demand - baseline) * weight + P_shortfall * weight^2
  // - Reservoir constraint: 2 * P_res * baselineExcess * weight + P_res * weight^2
  for (let i = 0; i < N; i++) {
    const vi = variables[i];
    const crop = crops.find((c) => c.id === vi.cropId)!;
    const canal = canals.find((c) => c.id === crop.canalId);
    
    // Baseline canal flow
    const canalBaseline = crops
      .filter((c) => c.canalId === crop.canalId)
      .reduce((sum, c) => sum + c.minAllocation, 0);
    const canalExcess = canal ? canalBaseline - canal.maxCapacity : 0;

    // Linear components
    const linearUtility = -crop.priority * vi.bitWeight * 2.2;
    const linearShortfall = -P_shortfall * 2 * (crop.demand - crop.minAllocation) * vi.bitWeight + P_shortfall * Math.pow(vi.bitWeight, 2);
    const linearReservoir = 2 * P_res * baselineExcess * vi.bitWeight + P_res * Math.pow(vi.bitWeight, 2);
    const linearCanal = canal ? (2 * P_canal * canalExcess * vi.bitWeight + P_canal * Math.pow(vi.bitWeight, 2)) : 0;

    const diagValue = Math.round((linearUtility + linearShortfall + linearReservoir + linearCanal) * 10) / 10;
    matrix[i][i] = diagValue;
  }

  // 2. Off-diagonal terms (Couplings / Interactions between qubits)
  // Cross-penalty between bit i and bit j:
  // - If i and j both draw from the reservoir: 2 * P_res * w_i * w_j
  // - If i and j also share the same canal: + 2 * P_canal * w_i * w_j
  // - If i and j are on the same crop: + 2 * P_shortfall * w_i * w_j
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const vi = variables[i];
      const vj = variables[j];
      let crossTerm = 0;
      let reasons: string[] = [];

      // Shared reservoir penalty
      const resCoupling = 2 * P_res * vi.bitWeight * vj.bitWeight * 0.05;
      crossTerm += resCoupling;
      reasons.push('Shared reservoir quota');

      // Shared canal penalty
      const ci = crops.find((c) => c.id === vi.cropId)!;
      const cj = crops.find((c) => c.id === vj.cropId)!;
      if (ci.canalId === cj.canalId) {
        const canalCoupling = 2 * P_canal * vi.bitWeight * vj.bitWeight * 0.06;
        crossTerm += canalCoupling;
        reasons.push(`Shared ${ci.canalId === 'canal_a' ? 'Canal A' : 'Canal B'} capacity`);
      }

      // Same crop diminishing returns / shortfall quadratic term
      if (vi.cropId === vj.cropId) {
        const cropCoupling = 2 * P_shortfall * vi.bitWeight * vj.bitWeight * 0.04;
        crossTerm += cropCoupling;
        reasons.push('Intra-crop allocation step');
      }

      const val = Math.round(crossTerm * 10) / 10;
      matrix[i][j] = val;
      matrix[j][i] = val; // Symmetric QUBO representation

      quadraticPairs.push({
        i,
        j,
        weight: val,
        reason: reasons.join(' + '),
      });
    }
  }

  const linearTerms = matrix.map((row, idx) => row[idx]);

  return {
    numQubits: N,
    variables,
    matrix,
    linearTerms,
    quadraticPairs,
    constantOffset: Math.round(P_res * Math.pow(Math.max(0, baselineExcess), 2)),
    penaltyWeights: {
      reservoir: P_res,
      canal: P_canal,
      demand: P_shortfall,
    },
  };
}
