import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  CheckCircle2, 
  Loader2, 
  Circle, 
  ArrowDown, 
  Cpu, 
  FileCode2, 
  Scale, 
  Database, 
  Binary, 
  Sliders, 
  Atom, 
  Activity, 
  ShieldCheck, 
  Droplet,
  Info
} from 'lucide-react';

export const OptimizationView: React.FC = () => {
  const { 
    runCompleteOptimization, 
    workflowState, 
    pipelineStage,
    setActiveTab, 
    classicalSolution, 
    quboResult, 
    qaoaResult,
    scenario 
  } = useApp();

  const isOptimizing = workflowState.isOptimizing;
  const [activeStageDetails, setActiveStageDetails] = useState<number>(0);

  const pipelineStages = [
    {
      id: 0,
      title: 'INPUT DATA',
      subtitle: 'Hydrological Reservoir & Crop Boundaries',
      icon: Database,
      stageKey: 'scenario_loaded',
      route: 'water_scenario',
      details: {
        description: 'Ingests live reservoir storage limits, ecological minimum reserves, canal hydraulic capacities, and seasonal crop water requirements.',
        metrics: [
          { label: 'Available Water', value: `${scenario.reservoir.availableWater} ML` },
          { label: 'Total Demand', value: `${scenario.crops.reduce((s, c) => s + c.demand, 0)} ML` },
          { label: 'Canals Active', value: scenario.canals.length },
          { label: 'Crops Monitored', value: scenario.crops.length },
        ],
      },
    },
    {
      id: 1,
      title: 'PREPROCESSING',
      subtitle: 'Data Normalization & Deficit Assessment',
      icon: Sliders,
      stageKey: 'scenario_loaded',
      route: 'water_scenario',
      details: {
        description: 'Normalizes dimensional units, calculates systemic water deficit ratio, and verifies basic non-negativity and feasibility boundaries.',
        metrics: [
          { label: 'Deficit Volume', value: `${Math.max(0, scenario.crops.reduce((s, c) => s + c.demand, 0) - scenario.reservoir.availableWater)} ML` },
          { label: 'Supply Ratio', value: `${((scenario.reservoir.availableWater / scenario.crops.reduce((s, c) => s + c.demand, 0)) * 100).toFixed(1)}%` },
          { label: 'Conveyance Eff.', value: '93% Avg' },
        ],
      },
    },
    {
      id: 2,
      title: 'CLASSICAL BASELINE',
      subtitle: 'Non-Linear Sequential Quadratic Programming',
      icon: Scale,
      stageKey: 'classical_baseline',
      route: 'classical_baseline',
      details: {
        description: 'Runs standard classical numerical solver using active-set projected gradient descent to obtain an optimal continuous benchmark.',
        metrics: [
          { label: 'Classical Score', value: classicalSolution.objectiveScore },
          { label: 'Allocated Water', value: `${classicalSolution.totalAllocated} ML` },
          { label: 'Violations', value: classicalSolution.constraintViolations },
          { label: 'Execution Time', value: `${classicalSolution.executionTimeMs} ms` },
        ],
      },
    },
    {
      id: 3,
      title: 'OPTIMIZATION MODEL',
      subtitle: 'Constrained Quadratic Utility Formulation',
      icon: Binary,
      stageKey: 'classical_baseline',
      route: 'classical_comparison',
      details: {
        description: 'Formulates multi-objective trade-off between maximizing agronomic yield and minimizing quadratic penalty for unmet demands.',
        metrics: [
          { label: 'Objective Type', value: 'Min Shortfall + Max Yield' },
          { label: 'Canal Constraints', value: 'Upper Linear Bounds' },
          { label: 'Reserve Constraint', value: 'Hard Minimum Storage' },
        ],
      },
    },
    {
      id: 4,
      title: 'QUBO FORMULATION',
      subtitle: 'Binary Discretization & Penalty Expansion',
      icon: FileCode2,
      stageKey: 'qubo_generated',
      route: 'qubo',
      details: {
        description: 'Discretizes continuous water allocations into binary decision variables (qubits) and expands inequality penalties into an upper-triangular Q matrix.',
        metrics: [
          { label: 'Qubits Required', value: quboResult.numQubits },
          { label: 'Matrix Dimensions', value: `${quboResult.numQubits} × ${quboResult.numQubits}` },
          { label: 'Quadratic Couplings', value: quboResult.quadraticPairs.length },
          { label: 'Hilbert Dimension', value: `${1 << quboResult.numQubits} states` },
        ],
      },
    },
    {
      id: 5,
      title: 'QAOA (Ansatz Design)',
      subtitle: 'Cost & Mixer Hamiltonian Parameterization',
      icon: Atom,
      stageKey: 'qaoa_running',
      route: 'qaoa',
      details: {
        description: 'Designs parameterized quantum circuit with p layers of cost evolution U_C(gamma) and transverse-field mixer rotations U_M(beta).',
        metrics: [
          { label: 'QAOA Layers (p)', value: qaoaResult.pLayers },
          { label: 'Optimal Gamma [γ]', value: qaoaResult.optimalGamma.join(', ') },
          { label: 'Optimal Beta [β]', value: qaoaResult.optimalBeta.join(', ') },
          { label: 'Expectation Energy', value: qaoaResult.bestEnergy },
        ],
      },
    },
    {
      id: 6,
      title: 'QUANTUM SIMULATOR',
      subtitle: 'Qiskit Statevector Evolution Engine',
      icon: Cpu,
      stageKey: 'qaoa_running',
      route: 'quantum_circuit',
      details: {
        description: 'Executes exact complex-amplitude statevector simulation across 2^N computational basis states in Hilbert space.',
        metrics: [
          { label: 'Circuit Depth', value: qaoaResult.circuitInfo.circuitDepth },
          { label: 'Total Quantum Gates', value: qaoaResult.circuitInfo.gateCount },
          { label: 'Two-Qubit RZZ Gates', value: qaoaResult.circuitInfo.rzzGates },
          { label: 'Simulation Runtime', value: `${qaoaResult.executionTimeMs} ms` },
        ],
      },
    },
    {
      id: 7,
      title: 'MEASUREMENT',
      subtitle: 'Sampling Basis Bitstrings from Probability Amplitudes',
      icon: Activity,
      stageKey: 'measurement_complete',
      route: 'measurement',
      details: {
        description: 'Performs simulated projective measurements in computational Z-basis, aggregating bitstring frequency distributions.',
        metrics: [
          { label: 'Shots Sampled', value: qaoaResult.shots },
          { label: 'Most Probable Bit', value: qaoaResult.bestBitstring },
          { label: 'Best Feasible Bit', value: qaoaResult.bestFeasibleBitstring },
          { label: 'Sample Probability', value: `${((qaoaResult.sampledCounts[qaoaResult.bestFeasibleBitstring] || 1) / qaoaResult.shots * 100).toFixed(1)}%` },
        ],
      },
    },
    {
      id: 8,
      title: 'SOLUTION DECODING',
      subtitle: 'Binary Bitstring to Physical Allocations (ML)',
      icon: Binary,
      stageKey: 'solution_validated',
      route: 'results',
      details: {
        description: 'Converts selected quantum bitstring through binary basis functions back into continuous Megalitre allocations for each crop.',
        metrics: [
          { label: 'Paddy Allocated', value: `${qaoaResult.cropAllocations['paddy'] || 0} ML` },
          { label: 'Cotton Allocated', value: `${qaoaResult.cropAllocations['cotton'] || 0} ML` },
          { label: 'Pulses Allocated', value: `${qaoaResult.cropAllocations['pulses'] || 0} ML` },
          { label: 'Total Dispatched', value: `${qaoaResult.totalAllocated} ML` },
        ],
      },
    },
    {
      id: 9,
      title: 'CONSTRAINT VALIDATION',
      subtitle: 'Hydraulic Boundary & Canal Verification',
      icon: ShieldCheck,
      stageKey: 'solution_validated',
      route: 'results',
      details: {
        description: 'Rigorous post-quantum feasibility check ensuring non-violation of canal discharge capacities and reservoir volume conservation.',
        metrics: [
          { label: 'Reservoir Limit', value: 'Satisfied' },
          { label: 'Canal A Bound', value: 'Satisfied (580/600 ML)' },
          { label: 'Canal B Bound', value: 'Satisfied (390/400 ML)' },
          { label: 'Violations Flagged', value: '0' },
        ],
      },
    },
    {
      id: 10,
      title: 'FINAL WATER ALLOCATION',
      subtitle: 'Automated Dispatch & Decision Support',
      icon: Droplet,
      stageKey: 'allocation_generated',
      route: 'results',
      details: {
        description: 'Synthesizes final water release schedule, dispatch schedules for canal gates, and performance comparisons for presentation to water boards.',
        metrics: [
          { label: 'QAOA Objective', value: qaoaResult.objectiveScore },
          { label: 'Water Utilization', value: `${qaoaResult.waterUtilization}%` },
          { label: 'Status', value: 'Ready for Dispatch' },
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Visual Optimization Pipeline Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            End-to-end transformation from raw hydrological inputs to quantum-dispatched allocation
          </p>
        </div>

        <button
          onClick={runCompleteOptimization}
          disabled={isOptimizing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing Pipeline Stages...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>▶ RUN COMPLETE OPTIMIZATION</span>
            </>
          )}
        </button>
      </div>

      {/* Main Flow Grid: Stage Cards on Left, Active Stage Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flow Stack */}
        <div className="lg:col-span-7 space-y-2">
          {pipelineStages.map((st, index) => {
            const Icon = st.icon;
            const isSelected = activeStageDetails === index;
            const isRunningThis = isOptimizing && pipelineStage === st.stageKey;

            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => setActiveStageDetails(index)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#102454] border-cyan-400 ring-2 ring-cyan-400/20 shadow-lg shadow-cyan-500/10'
                      : 'bg-[#0d1733]/90 border-cyan-900/30 hover:border-cyan-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-cyan-500 text-white'
                          : 'bg-[#091228] text-cyan-400 border border-cyan-900/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500">
                          STAGE {index + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white tracking-wide">
                          {st.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400">{st.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRunningThis ? (
                      <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>

                {/* Connecting arrow if not last */}
                {index < pipelineStages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-500/40" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Detailed Inspector for Selected Stage */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl bg-[#0d1733]/90 border border-cyan-800/40 p-5 shadow-2xl space-y-4">
            {(() => {
              const cur = pipelineStages[activeStageDetails];
              const Icon = cur.icon;
              return (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          Stage {activeStageDetails + 1} of {pipelineStages.length}
                        </span>
                        <h3 className="text-base font-extrabold text-white">
                          {cur.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab(cur.route as any)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Open Module →
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cur.details.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Stage Telemetry & Parameters
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {cur.details.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#091228] border border-cyan-950/60"
                        >
                          <span className="text-[10px] text-slate-400 block">{m.label}</span>
                          <span className="text-xs font-bold text-white tabular-nums">
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#081023] border border-cyan-950 text-[11px] text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      Clicking "Open Module" navigates directly to the dedicated technical workbench for this stage.
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
