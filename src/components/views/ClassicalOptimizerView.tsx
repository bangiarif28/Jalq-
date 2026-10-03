import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingDown, 
  Cpu, 
  Atom, 
  Activity, 
  RefreshCw,
  Sparkles,
  Layers,
  FileCode2,
  Info
} from 'lucide-react';
import { ClassicalOptimizerPanel } from '../qaoa/ClassicalOptimizerPanel';

export const ClassicalOptimizerView: React.FC = () => {
  const { qaoaResult, quboResult, scenario, runQaoaOnly, setActiveTab, workflowState } = useApp();

  const isOptimizing = workflowState.isOptimizing;
  const opt = qaoaResult?.optimizerInfo;
  const bestBeta = qaoaResult?.optimalBeta || [0.618, 0.412];
  const bestGamma = qaoaResult?.optimalGamma || [0.382, 0.718];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Hybrid Variational Feedback
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Classical Optimizer: COBYLA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Gradient-free parameter update loop tuning QAOA variational angles (β, γ) through quantum circuit expectation feedback
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('qaoa')}
            className="px-3.5 py-2 rounded-xl bg-[#0e1b3d] hover:bg-[#142857] text-slate-300 text-xs font-semibold border border-cyan-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>QAOA Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('quantum_circuit')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <span>Quantum Circuit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* 1. Optimizer & Method */}
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Classical Optimizer</span>
          <p className="text-xl font-black text-cyan-300 font-mono mt-0.5">COBYLA</p>
          <span className="text-[10px] text-slate-400">Constrained Linear Approx</span>
        </div>

        {/* 2. Iterations / Convergence */}
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Optimization Status</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            {isOptimizing ? 'Updating...' : 'Converged ✓'}
          </p>
          <span className="text-[10px] text-slate-400">
            {opt?.currentIteration ?? 10} / {opt?.maxIterations ?? 10} iterations completed
          </span>
        </div>

        {/* 3. Optimal β Vector */}
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Optimal Beta [β*]</span>
          <p className="text-lg font-black text-purple-300 font-mono mt-0.5">
            [{bestBeta.join(', ')}]
          </p>
          <span className="text-[10px] text-slate-400">Mixer unitary rotation angles</span>
        </div>

        {/* 4. Optimal γ Vector */}
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Optimal Gamma [γ*]</span>
          <p className="text-lg font-black text-blue-300 font-mono mt-0.5">
            [{bestGamma.join(', ')}]
          </p>
          <span className="text-[10px] text-slate-400">Phase separation angles</span>
        </div>
      </div>

      {/* Main Core Component: Classical Optimizer Panel */}
      <ClassicalOptimizerPanel />

      {/* Informational Architecture Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Card 1: How COBYLA Interacts with QAOA */}
        <div className="p-5 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-cyan-950/80">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">
              How COBYLA Updates β and γ
            </h4>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            QAOA operates as a <strong>variational quantum-classical hybrid</strong>. In every iteration, the quantum processor (or statevector simulator) prepares state |γ, β⟩ and computes expectation ⟨H_C⟩.
          </p>
          <p className="text-slate-300 text-xs leading-relaxed">
            The <strong>classical COBYLA algorithm</strong> evaluates this objective value, constructs linear approximations inside a shrinking trust region, and determines optimal directional updates for β and γ without requiring numerical quantum gradients.
          </p>
          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950 font-mono text-[11px] text-cyan-300">
            Current Scenario: {scenario.name} • Available Water: {scenario.reservoir.availableWater} ML
          </div>
        </div>

        {/* Card 2: Hybrid Pipeline Flow */}
        <div className="p-5 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-cyan-950/80">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">
              End-to-End Pipeline Position
            </h4>
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#081229] border border-cyan-950 text-slate-400">
              <span>QUBO Formulation</span>
              <span className="text-slate-500">→</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#081229] border border-cyan-950 text-slate-400">
              <span>QAOA Pipeline</span>
              <span className="text-slate-500">→</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-400 text-cyan-200 font-bold">
              <span>★ Classical Optimizer (COBYLA)</span>
              <span className="text-cyan-400">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#081229] border border-cyan-950 text-slate-400">
              <span>Quantum Circuit (OpenQASM)</span>
              <span className="text-slate-500">→</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#081229] border border-cyan-950 text-slate-400">
              <span>Measurement & Final Allocation</span>
              <span className="text-slate-500">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
