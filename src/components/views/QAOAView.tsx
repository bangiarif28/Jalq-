import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Atom, 
  Play, 
  Loader2, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  Cpu,
  Sparkles,
  Info
} from 'lucide-react';

export const QAOAView: React.FC = () => {
  const { qaoaResult, quboResult, scenario, runQaoaOnly, setActiveTab } = useApp();

  const [pLayers, setPLayers] = useState<number>(qaoaResult.pLayers || 2);
  const [shots, setShots] = useState<number>(qaoaResult.shots || 2048);
  const [optimizer, setOptimizer] = useState<string>('COBYLA (Constrained Optimization By Linear Approx)');
  const [seed, setSeed] = useState<number>(42);

  // Simulation steps progress
  const [executingStep, setExecutingStep] = useState<string | null>(null);

  const stepsList = [
    'Initializing quantum state |+⟩^N in uniform superposition',
    'Building cost Hamiltonian H_C from QUBO matrix couplings',
    'Building transverse-field mixer Hamiltonian H_M = ∑ X_i',
    'Optimizing variational parameters (γ, β) via classical feedback',
    'Executing parameterized quantum circuit on statevector simulator',
    'Sampling projective measurement bitstrings across shots',
    'Decoding bitstrings into continuous water allocations (ML)',
    'Validating hydraulic boundary constraints & computing objective',
  ];

  const handleRun = async () => {
    for (let i = 0; i < stepsList.length; i++) {
      setExecutingStep(stepsList[i]);
      await new Promise((r) => setTimeout(r, 160));
    }
    await runQaoaOnly(pLayers, shots);
    setExecutingStep(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Atom className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Variational Quantum Algorithm
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            QAOA: Quantum Approximate Optimization Algorithm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulating parameterized quantum circuits to explore optimal water allocations in 2^N Hilbert space
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={executingStep !== null}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
        >
          {executingStep !== null ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simulating Quantum Circuit...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>RUN QAOA</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Box when running */}
      {executingStep && (
        <div className="p-4 rounded-2xl bg-[#102454] border border-cyan-400 ring-2 ring-cyan-400/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Executing Quantum Pipeline:</span>
            </div>
            <span className="text-slate-300 font-mono text-[11px]">Qiskit Aer Simulator</span>
          </div>
          <p className="text-sm font-semibold text-white pl-6">
            {executingStep}
          </p>
        </div>
      )}

      {/* Workflow Diagram matching Prompt Requirement 11 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
          QAOA Algorithmic Progression Workflow
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#081023] border border-cyan-900/40 text-center min-w-[110px]">
            <span className="text-[10px] text-slate-500 block">State</span>
            <span className="font-bold text-white">|0⟩^N</span>
            <span className="text-[9px] text-slate-400 block">Ground State</span>
          </div>
          <span className="text-cyan-500 font-bold">➔</span>

          <div className="p-3 rounded-xl bg-[#081023] border border-cyan-900/40 text-center min-w-[110px]">
            <span className="text-[10px] text-cyan-400 block">Gate</span>
            <span className="font-bold text-white">H^⊗N</span>
            <span className="text-[9px] text-slate-400 block">Superposition |+⟩</span>
          </div>
          <span className="text-cyan-500 font-bold">➔</span>

          <div className="p-3 rounded-xl bg-[#081023] border border-purple-900/40 text-center min-w-[120px]">
            <span className="text-[10px] text-purple-400 block">Phase</span>
            <span className="font-bold text-white">e^(-iγ H_C)</span>
            <span className="text-[9px] text-slate-400 block">Cost Hamiltonian</span>
          </div>
          <span className="text-cyan-500 font-bold">➔</span>

          <div className="p-3 rounded-xl bg-[#081023] border border-blue-900/40 text-center min-w-[120px]">
            <span className="text-[10px] text-blue-400 block">Mixer</span>
            <span className="font-bold text-white">e^(-iβ H_M)</span>
            <span className="text-[9px] text-slate-400 block">Transverse X-field</span>
          </div>
          <span className="text-cyan-500 font-bold">➔</span>

          <div className="p-3 rounded-xl bg-[#081023] border border-emerald-900/40 text-center min-w-[120px]">
            <span className="text-[10px] text-emerald-400 block">Optimizer</span>
            <span className="font-bold text-white">min ⟨H_C⟩</span>
            <span className="text-[9px] text-slate-400 block">COBYLA Loop</span>
          </div>
          <span className="text-cyan-500 font-bold">➔</span>

          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white text-center min-w-[120px] shadow-md">
            <span className="text-[10px] text-cyan-200 block">Measurement</span>
            <span className="font-bold">Z-Basis Shots</span>
            <span className="text-[9px] text-cyan-100 block">Candidate Strings</span>
          </div>
        </div>
      </div>

      {/* Control Configuration & Result Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Controls */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-cyan-950/60">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">QAOA Hyperparameters</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>QAOA Alternating Layers (p):</span>
                <strong className="text-cyan-300 tabular-nums">p = {pLayers}</strong>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setPLayers(lvl)}
                    className={`flex-1 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      pLayers === lvl
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/50'
                        : 'bg-[#091228] border-cyan-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    p = {lvl} {lvl === 2 ? '(Recommended)' : ''}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Higher layers increase ansatz expressivity and depth at cost of circuit noise in physical QPUs.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Measurement Sampling Shots:</span>
                <strong className="text-cyan-300 tabular-nums">{shots} shots</strong>
              </div>
              <div className="flex gap-2">
                {[1024, 2048, 4096].map((s) => (
                  <button
                    key={s}
                    onClick={() => setShots(s)}
                    className={`flex-1 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      shots === s
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-[#091228] border-cyan-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s} Shots
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Classical Parameter Optimizer
              </label>
              <select
                value={optimizer}
                onChange={(e) => setOptimizer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#091228] border border-cyan-900/40 text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="COBYLA">COBYLA (Constrained Optimization By Linear Approx)</option>
                <option value="Nelder-Mead">Nelder-Mead Simplex Search</option>
                <option value="SPSA">SPSA (Simultaneous Perturbation Stochastic Approx)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Random Simulation Seed
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#091228] border border-cyan-900/40 text-white font-bold tabular-nums focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Optimized Variational Parameters & Statevector Output */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Variational Quantum Solution</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                {qaoaResult.backendName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3 text-xs">
              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Optimal Gamma [γ*]</span>
                <p className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                  [{qaoaResult.optimalGamma.join(', ')}]
                </p>
                <span className="text-[10px] text-slate-500">Cost unitary angles</span>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Optimal Beta [β*]</span>
                <p className="text-base font-bold text-purple-300 font-mono mt-0.5">
                  [{qaoaResult.optimalBeta.join(', ')}]
                </p>
                <span className="text-[10px] text-slate-500">Mixer unitary angles</span>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Expectation ⟨H_C⟩</span>
                <p className="text-base font-bold text-white tabular-nums mt-0.5">
                  {qaoaResult.bestEnergy}
                </p>
                <span className="text-[10px] text-emerald-400">Ground energy bound</span>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Best Feasible Bitstring</span>
                <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                  |{qaoaResult.bestFeasibleBitstring}⟩
                </p>
                <span className="text-[10px] text-slate-400">Valid physical schedule</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#081023] border border-cyan-950 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Decoded QAOA Water Dispatched:</span>
                <strong className="text-cyan-300 tabular-nums">{qaoaResult.totalAllocated} ML</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">QAOA Objective Score:</span>
                <strong className="text-white tabular-nums">{qaoaResult.objectiveScore}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simulator Runtime:</span>
                <strong className="text-slate-200 tabular-nums">{qaoaResult.executionTimeMs} ms</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setActiveTab('classical_optimizer')}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-800/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Classical Optimizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('measurement')}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <span>Measurement Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
