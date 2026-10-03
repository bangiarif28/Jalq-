export interface Canal {
  id: string;
  name: string;
  maxCapacity: number; // e.g. 600 units
  minFlow: number;      // e.g. 50 units
  currentFlow?: number;
  efficiency: number;   // 0.85 - 0.98 conveyance efficiency
}

export interface Crop {
  id: string;
  name: string;
  demand: number;         // e.g. 420 units
  minAllocation: number;  // e.g. 250 units
  maxAllocation: number;  // e.g. 450 units
  priority: number;       // weight, e.g. 1.2
  canalId: string;        // routed through Canal A or B
  iconType: 'paddy' | 'cotton' | 'pulses' | 'wheat' | 'sugarcane';
  economicYieldPerUnit: number; // in $/unit or ₹/unit
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  reservoir: {
    name: string;
    availableWater: number; // e.g. 1000 units
    minReserve: number;     // e.g. 100 units
  };
  canals: Canal[];
  crops: Crop[];
  penalties: {
    reservoirLimitPenalty: number;
    canalCapacityPenalty: number;
    shortfallPenalty: number;
  };
}

export interface ClassicalSolution {
  cropAllocations: Record<string, number>;
  canalFlows: Record<string, number>;
  totalAllocated: number;
  unmetDemand: number;
  waterUtilization: number;
  objectiveScore: number;
  constraintViolations: number;
  executionTimeMs: number;
  iterations: number;
  solverMethod: string;
  timestamp: string;
}

export interface QUBOResult {
  numQubits: number;
  variables: Array<{
    index: number;
    name: string;
    cropId: string;
    cropName: string;
    bitWeight: number; // units of water this bit represents
    minBaseline: number;
  }>;
  matrix: number[][]; // N x N matrix Q
  linearTerms: number[];
  quadraticPairs: Array<{
    i: number;
    j: number;
    weight: number;
    reason: string;
  }>;
  constantOffset: number;
  penaltyWeights: {
    reservoir: number;
    canal: number;
    demand: number;
  };
}

export interface OptimizerHistoryEntry {
  iteration: number;
  beta: number;
  gamma: number;
  cost: number;
}

export interface ClassicalOptimizerInfo {
  name: string;
  maxIterations: number;
  currentIteration: number;
  initialCost: number;
  currentCost: number;
  bestCost: number;
  currentBeta: number;
  currentGamma: number;
  nextBeta: number;
  nextGamma: number;
  status: string;
  objectiveDirection: 'decreasing' | 'increasing';
  history: OptimizerHistoryEntry[];
}

export interface QAOAResult {
  pLayers: number;
  shots: number;
  optimalGamma: number[];
  optimalBeta: number[];
  bestBitstring: string;
  bestFeasibleBitstring: string;
  bestEnergy: number;
  cropAllocations: Record<string, number>;
  canalFlows: Record<string, number>;
  totalAllocated: number;
  unmetDemand: number;
  waterUtilization: number;
  objectiveScore: number;
  constraintViolations: number;
  executionTimeMs: number;
  isFeasible: boolean;
  statevectorProbabilities: Record<string, number>;
  sampledCounts: Record<string, number>;
  circuitInfo: {
    numQubits: number;
    circuitDepth: number;
    gateCount: number;
    hadamardGates: number;
    rzzGates: number;
    rzGates: number;
    rxGates: number;
    measurementGates: number;
  };
  optimizerInfo?: ClassicalOptimizerInfo;
  backendName: string;
  timestamp: string;
}

export type StageStatus = 'waiting' | 'running' | 'completed' | 'warning' | 'failed';

export type PipelineStage = 
  | 'idle'
  | 'scenario_loaded'
  | 'classical_baseline'
  | 'qubo_generated'
  | 'qaoa_running'
  | 'measurement_complete'
  | 'solution_validated'
  | 'allocation_generated';

export interface WorkflowStageInfo {
  id: number;
  key: string;
  name: string;
  title: string;
  subtitle: string;
  status: StageStatus;
  statusText: string;
  startTime?: number;
  endTime?: number;
  durationMs?: number;
  details?: Record<string, any>;
}

export interface OptimizationWorkflowState {
  hasRun: boolean;
  isOptimizing: boolean;
  currentStageIndex: number; // 0 to 9, or -1 when idle/complete
  overallStatus: 'idle' | 'running' | 'completed' | 'failed';
  stages: WorkflowStageInfo[];
  completedAt?: string;
  error?: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'water_scenario'
  | 'optimization'
  | 'classical_baseline'
  | 'qubo'
  | 'qaoa'
  | 'classical_optimizer'
  | 'quantum_circuit'
  | 'measurement'
  | 'results'
  | 'classical_comparison'
  | 'what_if'
  | 'architecture'
  | 'analytics'
  | 'reports'
  | 'about'
  | 'future_scope';
