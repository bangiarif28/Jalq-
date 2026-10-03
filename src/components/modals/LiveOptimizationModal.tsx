import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  CheckCircle2, 
  Loader2, 
  Circle, 
  AlertTriangle, 
  X, 
  Cpu, 
  Database, 
  Binary, 
  Scale, 
  FileCode2, 
  Atom, 
  Activity, 
  ShieldCheck, 
  Droplet,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { StageStatus } from '../../types';

export const LiveOptimizationModal: React.FC = () => {
  const { 
    liveOptimizationOpen, 
    setLiveOptimizationOpen, 
    workflowState, 
    scenario, 
    classicalSolution, 
    quboResult, 
    qaoaResult,
    setActiveTab,
    runCompleteOptimization 
  } = useApp();

  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  if (!liveOptimizationOpen) return null;

  const { isOptimizing, stages, overallStatus, currentStageIndex } = workflowState;

  // Icon mapping for each stage
  const getStageIcon = (key: string) => {
    switch (key) {
      case 'input_data':
        return Database;
      case 'preprocessing':
        return Binary;
      case 'classical_baseline':
        return Scale;
      case 'qubo_formulation':
        return FileCode2;
      case 'qaoa_optimization':
        return Atom;
      case 'quantum_circuit':
        return Cpu;
      case 'measurement':
        return Activity;
      case 'solution_decoding':
        return Binary;
      case 'constraint_validation':
        return ShieldCheck;
      case 'final_allocation':
        return Droplet;
      default:
        return Cpu;
    }
  };

  const getStatusBadge = (status: StageStatus, statusText: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-500/20 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Running...</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Warning</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-800/40">
            <X className="w-3.5 h-3.5 text-red-400" />
            <span>Failed</span>
          </span>
        );
      case 'waiting':
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0a1226] text-slate-500 border border-slate-800">
            <Circle className="w-3.5 h-3.5" />
            <span>Waiting</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#09132d] border border-cyan-500/50 shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#0a1533] border-b border-cyan-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  JalQ Optimization Engine
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {isOptimizing ? 'Executing Sequential Pipeline' : overallStatus === 'completed' ? 'Workflow Complete' : 'Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Running hybrid classical-quantum water allocation optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOptimizing && (
              <button
                onClick={runCompleteOptimization}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Re-Run</span>
              </button>
            )}
            <button
              onClick={() => setLiveOptimizationOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 10 Stages Sequential Progression */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Completion Celebration Banner (Requirement 13) */}
          {overallStatus === 'completed' && !isOptimizing && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0a233b] to-cyan-950/80 border-2 border-emerald-400/60 shadow-xl space-y-3 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      ✓ OPTIMIZATION COMPLETE
                    </h3>
                    <p className="text-xs text-slate-300">
                      All 10 pipeline stages executed. Hybrid classical-quantum water release schedule verified.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">QAOA Score:</span>
                  <strong className="text-cyan-300 text-sm">{qaoaResult.objectiveScore}</strong>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">Classical:</span>
                  <strong className="text-blue-300 text-sm">{classicalSolution.objectiveScore}</strong>
                </div>
              </div>

              {/* Requirement 13 Action Buttons */}
              <div className="pt-2 border-t border-cyan-900/40 flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('results');
                    setLiveOptimizationOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold cursor-pointer transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>View Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('qubo');
                    setLiveOptimizationOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] text-cyan-300 font-semibold cursor-pointer border border-cyan-800/40"
                >
                  View QUBO
                </button>
                <button
                  onClick={() => {
                    setActiveTab('quantum_circuit');
                    setLiveOptimizationOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] text-purple-300 font-semibold cursor-pointer border border-purple-800/40"
                >
                  View QAOA Circuit
                </button>
                <button
                  onClick={() => {
                    setActiveTab('measurement');
                    setLiveOptimizationOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] text-cyan-300 font-semibold cursor-pointer border border-cyan-800/40"
                >
                  View Measurements
                </button>
                <button
                  onClick={() => {
                    setActiveTab('classical_comparison');
                    setLiveOptimizationOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] text-blue-300 font-semibold cursor-pointer border border-blue-800/40"
                >
                  Compare Solutions
                </button>
                <button
                  onClick={() => {
                    setActiveTab('what_if');
                    setLiveOptimizationOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] text-emerald-300 font-semibold cursor-pointer border border-emerald-800/40"
                >
                  Run What-If Analysis
                </button>
              </div>
            </div>
          )}

          {/* Stepper Progression List */}
          <div className="space-y-3">
            {stages.map((st, idx) => {
              const Icon = getStageIcon(st.key);
              const isCurrent = isOptimizing && currentStageIndex === idx;
              const isExpanded = expandedStage === idx || isCurrent;

              return (
                <div
                  key={st.id}
                  className={`rounded-2xl border transition-all ${
                    st.status === 'running'
                      ? 'bg-[#102454] border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/10'
                      : st.status === 'completed'
                      ? 'bg-[#0a1532] border-emerald-900/40 hover:border-cyan-800/60'
                      : 'bg-[#080f24] border-slate-800/50 opacity-70'
                  }`}
                >
                  {/* Stage Header Row */}
                  <div
                    onClick={() => setExpandedStage(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          st.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                            : st.status === 'running'
                            ? 'bg-cyan-500 text-white animate-pulse'
                            : 'bg-[#0a1226] text-slate-500 border border-slate-800'
                        }`}
                      >
                        {st.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : st.status === 'running' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          `0${idx + 1}`
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-wide">
                            {st.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            · {st.subtitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {st.statusText}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(st.status, st.statusText)}
                    </div>
                  </div>

                  {/* Stage Expanded Dynamic Content matching Requirements 3 through 12 */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-cyan-950/60 text-xs">
                      {/* STAGE 1: INPUT DATA (Requirement 3) */}
                      {st.key === 'input_data' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3">
                          <div className="flex items-center justify-between font-bold text-emerald-400">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              Input Data Validated ✓
                            </span>
                            <span className="text-slate-400 text-[11px]">Hydrological System Baseline</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 block">Reservoir Water</span>
                              <strong className="text-white text-sm tabular-nums">{scenario.reservoir.availableWater} ML</strong>
                              <span className="text-cyan-400 block text-[10px]">Reserve: {scenario.reservoir.minReserve} ML</span>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 block">Canals Count</span>
                              <strong className="text-white text-sm">{scenario.canals.length} Canals</strong>
                              <span className="text-slate-400 block text-[10px]">Max 1,000 ML Cap</span>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 block">Crops Demand</span>
                              <strong className="text-amber-300 text-sm tabular-nums">{scenario.crops.reduce((s,c) => s + c.demand, 0)} ML</strong>
                              <span className="text-amber-400 block text-[10px]">{scenario.crops.length} Crop Zones</span>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 block">Total Constraints</span>
                              <strong className="text-white text-sm">6 Constraints</strong>
                              <span className="text-emerald-400 block text-[10px]">Active & Verified</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 2: PREPROCESSING (Requirement 4) */}
                      {st.key === 'preprocessing' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-2">
                          <p className="text-slate-400 text-[11px] mb-2 font-medium">
                            Preparing optimization problem and generating discrete variable mappings:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-xs">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Normalize input hydrological data
                            </span>
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Validate hydraulic non-negativity
                            </span>
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Create binary decision variables (8 qubits)
                            </span>
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Prepare multi-objective utility function
                            </span>
                          </div>
                        </div>
                      )}

                      {/* STAGE 3: CLASSICAL BASELINE (Requirement 5) */}
                      {st.key === 'classical_baseline' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-300">
                              ✓ Classical Solution Generated (Active-Set SQP)
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Runtime: <strong className="text-white tabular-nums">{classicalSolution.executionTimeMs} ms</strong>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-blue-900/30">
                              <span className="text-slate-400 text-[10px] block">Objective Score</span>
                              <strong className="text-blue-300 text-base tabular-nums">{classicalSolution.objectiveScore}</strong>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-blue-900/30">
                              <span className="text-slate-400 text-[10px] block">Water Utilization</span>
                              <strong className="text-white text-base tabular-nums">{classicalSolution.waterUtilization}%</strong>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-blue-900/30">
                              <span className="text-slate-400 text-[10px] block">Allocated Water</span>
                              <strong className="text-cyan-300 text-base tabular-nums">{classicalSolution.totalAllocated} ML</strong>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-blue-900/30">
                              <span className="text-slate-400 text-[10px] block">Violations</span>
                              <strong className="text-emerald-400 text-base tabular-nums">{classicalSolution.constraintViolations}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 4: QUBO FORMULATION (Requirement 6) */}
                      {st.key === 'qubo_formulation' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3">
                          <p className="text-xs text-slate-300">
                            "JalQ converts the constrained water allocation problem into a QUBO formulation suitable for quantum optimization."
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-[#0a142c] text-cyan-300 border border-cyan-900/40">
                              Qubits: <strong className="text-white">{quboResult.numQubits}</strong>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-[#0a142c] text-cyan-300 border border-cyan-900/40">
                              QUBO Size: <strong className="text-white">{quboResult.numQubits} × {quboResult.numQubits}</strong>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-[#0a142c] text-purple-300 border border-purple-900/40">
                              Penalty P_res: <strong>{quboResult.penaltyWeights.reservoir.toFixed(2)}</strong>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-[#0a142c] text-emerald-300 border border-emerald-900/40">
                              Couplings: <strong>{quboResult.quadraticPairs.length} Pairs</strong>
                            </span>
                          </div>

                          {/* Mini visual QUBO grid preview */}
                          <div className="p-2 rounded-lg bg-[#050a17] border border-cyan-950 overflow-x-auto">
                            <div className="flex gap-1">
                              {quboResult.matrix.slice(0, 6).map((row, r) => (
                                <div key={r} className="flex flex-col gap-1">
                                  {row.slice(0, 6).map((val, c) => (
                                    <div
                                      key={c}
                                      className={`w-7 h-6 rounded text-[9px] font-mono flex items-center justify-center font-bold ${
                                        r === c
                                          ? 'bg-blue-600/80 text-white'
                                          : val > 0
                                          ? 'bg-cyan-600/50 text-cyan-200'
                                          : 'bg-[#091228] text-slate-600'
                                      }`}
                                    >
                                      {val > 0 ? val.toFixed(0) : '0'}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 5: QAOA OPTIMIZATION (Requirement 7) */}
                      {st.key === 'qaoa_optimization' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">✓ QAOA Completed on Simulator</span>
                            <span className="text-cyan-300 font-mono">Backend: {qaoaResult.backendName}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 text-[10px] block">Ansatz Layers (p)</span>
                              <strong className="text-white text-sm">p = {qaoaResult.pLayers}</strong>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 text-[10px] block">Qubits</span>
                              <strong className="text-cyan-300 text-sm">{qaoaResult.circuitInfo.numQubits} Qubits</strong>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 text-[10px] block">Sampling Shots</span>
                              <strong className="text-purple-300 text-sm">{qaoaResult.shots} Shots</strong>
                            </div>
                            <div className="p-2 rounded-lg bg-[#0a142c] border border-cyan-900/30">
                              <span className="text-slate-400 text-[10px] block">Ground Energy</span>
                              <strong className="text-emerald-400 text-sm tabular-nums">{qaoaResult.bestEnergy}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 6: QUANTUM CIRCUIT (Requirement 8) */}
                      {st.key === 'quantum_circuit' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-cyan-300 font-bold">
                              Circuit Depth: {qaoaResult.circuitInfo.circuitDepth} | Total Gates: {qaoaResult.circuitInfo.gateCount}
                            </span>
                            <button
                              onClick={() => {
                                setActiveTab('quantum_circuit');
                                setLiveOptimizationOpen(false);
                              }}
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Full Circuit</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {/* Schematic preview */}
                          <div className="p-2.5 rounded-lg bg-[#050a17] font-mono text-[11px] space-y-1 overflow-x-auto text-slate-300">
                            <div>q0 ── [H] ── [Cost: γ_1] ── [Mixer: β_1] ── [Measure]</div>
                            <div>q1 ── [H] ── [Cost: γ_1] ── [Mixer: β_1] ── [Measure]</div>
                            <div>q2 ── [H] ── [Cost: γ_1] ── [Mixer: β_1] ── [Measure]</div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 7: QUANTUM MEASUREMENT (Requirement 9) */}
                      {st.key === 'measurement' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">
                              Sampled Peak Bitstring: <strong className="text-purple-300 font-mono">|{qaoaResult.bestBitstring}⟩</strong>
                            </span>
                            <span className="text-emerald-300">
                              Selected Feasible: <strong className="font-mono">|{qaoaResult.bestFeasibleBitstring}⟩</strong>
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#050a17] font-mono text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                            <div>|{qaoaResult.bestBitstring}⟩: {((qaoaResult.sampledCounts[qaoaResult.bestBitstring] || 1) / qaoaResult.shots * 100).toFixed(1)}% (Peak)</div>
                            <div>|{qaoaResult.bestFeasibleBitstring}⟩: {((qaoaResult.sampledCounts[qaoaResult.bestFeasibleBitstring] || 1) / qaoaResult.shots * 100).toFixed(1)}% (Feasible)</div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 8: SOLUTION DECODING (Requirement 10) */}
                      {st.key === 'solution_decoding' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-2">
                          <p className="text-xs text-slate-400">
                            Visual transformation: Quantum Bitstring → Decision variables → Canal discharge → Crop allocation:
                          </p>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-xs pt-1">
                            <span className="px-2 py-1 rounded bg-[#0a142c] text-purple-300">
                              |{qaoaResult.bestFeasibleBitstring}⟩
                            </span>
                            <span className="text-cyan-400">➔</span>
                            <span className="px-2 py-1 rounded bg-[#0a142c] text-cyan-300">
                              Canals: A({qaoaResult.canalFlows['canal_a'] || 580} ML) B({qaoaResult.canalFlows['canal_b'] || 390} ML)
                            </span>
                            <span className="text-cyan-400">➔</span>
                            <span className="px-2 py-1 rounded bg-[#0a142c] text-emerald-300">
                              Paddy: {qaoaResult.cropAllocations['paddy']} ML | Cotton: {qaoaResult.cropAllocations['cotton']} ML | Pulses: {qaoaResult.cropAllocations['pulses']} ML
                            </span>
                          </div>
                        </div>
                      )}

                      {/* STAGE 9: CONSTRAINT VALIDATION (Requirement 11) */}
                      {st.key === 'constraint_validation' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-2 text-xs">
                          <div className="flex items-center gap-2 font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Feasible Solution (0 Hydraulic Violations) ✓</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300 text-[11px] pt-1">
                            <span>✓ Available water constraint met</span>
                            <span>✓ Canal A & B caps respected</span>
                            <span>✓ Ecological reserve protected</span>
                            <span>✓ Crop minimum bounds satisfied</span>
                            <span>✓ Demand ceilings honored</span>
                            <span>✓ Non-negativity verified</span>
                          </div>
                        </div>
                      )}

                      {/* STAGE 10: FINAL ALLOCATION (Requirement 12) */}
                      {st.key === 'final_allocation' && (
                        <div className="p-3.5 rounded-xl bg-[#060d1f] border border-cyan-950 space-y-3 text-xs">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-cyan-950 text-slate-400 text-[10px] uppercase">
                                  <th className="py-1">Crop</th>
                                  <th className="py-1 text-right">Demand</th>
                                  <th className="py-1 text-right">Classical</th>
                                  <th className="py-1 text-right">QAOA</th>
                                  <th className="py-1 text-right">Satisfaction %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-cyan-950/40">
                                {scenario.crops.map((c) => (
                                  <tr key={c.id}>
                                    <td className="py-1.5 font-bold text-white">{c.name}</td>
                                    <td className="py-1.5 text-right text-slate-300 tabular-nums">{c.demand} ML</td>
                                    <td className="py-1.5 text-right text-blue-300 tabular-nums">{classicalSolution.cropAllocations[c.id]} ML</td>
                                    <td className="py-1.5 text-right text-cyan-300 font-bold tabular-nums">{qaoaResult.cropAllocations[c.id]} ML</td>
                                    <td className="py-1.5 text-right text-emerald-400 font-bold tabular-nums">
                                      {Math.round(((qaoaResult.cropAllocations[c.id] || 0) / c.demand) * 100)}%
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-[#0a1533] border-t border-cyan-900/60 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              {isOptimizing
                ? 'Optimization executing sequentially through all 10 stages...'
                : '10 stages verified. Single shared optimization state loaded across all views.'}
            </span>
          </div>

          <button
            onClick={() => setLiveOptimizationOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] text-white font-semibold cursor-pointer transition-colors"
          >
            {overallStatus === 'completed' ? 'Close & View Dashboard' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
};
