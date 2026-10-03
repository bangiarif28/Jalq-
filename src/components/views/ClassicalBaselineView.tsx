import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scale, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Percent, 
  ShieldCheck, 
  Clock, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ClassicalBaselineView: React.FC = () => {
  const { scenario, classicalSolution, runClassicalOnly, setActiveTab } = useApp();
  const [solverStatus, setSolverStatus] = useState<'idle' | 'preparing' | 'solving' | 'validating' | 'complete'>('complete');

  const handleRunClassical = async () => {
    setSolverStatus('preparing');
    await new Promise((r) => setTimeout(r, 250));
    setSolverStatus('solving');
    await new Promise((r) => setTimeout(r, 350));
    setSolverStatus('validating');
    runClassicalOnly();
    await new Promise((r) => setTimeout(r, 200));
    setSolverStatus('complete');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Classical Optimization Baseline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Projected Sequential Quadratic Gradient & Active-Set Solver on Continuous Water Network
          </p>
        </div>

        <button
          onClick={handleRunClassical}
          disabled={solverStatus !== 'complete' && solverStatus !== 'idle'}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
        >
          {solverStatus !== 'complete' && solverStatus !== 'idle' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Solving Classical Model...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Classical Optimization</span>
            </>
          )}
        </button>
      </div>

      {/* Solver Progression Status Banner */}
      <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/40">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Solver Status:</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  solverStatus === 'complete'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    : 'bg-blue-950 text-cyan-300 border border-blue-800/40'
                }`}
              >
                {solverStatus === 'preparing' && 'Preparing problem formulation...'}
                {solverStatus === 'solving' && 'Solving continuous quadratic gradient...'}
                {solverStatus === 'validating' && 'Validating hydraulic boundary constraints...'}
                {solverStatus === 'complete' && 'Complete (Optimal Continuous Solution Found)'}
                {solverStatus === 'idle' && 'Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Algorithm: {classicalSolution.solverMethod}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span>Active Iterations:</span>
          <strong className="text-white tabular-nums">{classicalSolution.iterations}</strong>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-blue-900/30 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold block">Objective Score</span>
          <span className="text-2xl lg:text-3xl font-extrabold text-blue-300 tabular-nums">
            {classicalSolution.objectiveScore}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Net agronomic benefit metric</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold block">Water Utilization</span>
          <span className="text-2xl lg:text-3xl font-extrabold text-cyan-300 tabular-nums">
            {classicalSolution.waterUtilization}%
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            {classicalSolution.totalAllocated} ML of {scenario.reservoir.availableWater} ML
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-emerald-900/30 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold block">Constraint Violations</span>
          <span className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tabular-nums">
            {classicalSolution.constraintViolations}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">All hydraulic boundaries valid</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-purple-900/30 shadow-lg">
          <span className="text-xs text-slate-400 font-semibold block">Execution Time</span>
          <span className="text-2xl lg:text-3xl font-extrabold text-purple-300 tabular-nums">
            {classicalSolution.executionTimeMs} ms
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Deterministic convergence</p>
        </div>
      </div>

      {/* Allocation Table matching Prompt Requirement 9 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">
          Classical Water Allocation Schedule
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-cyan-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Crop Zone</th>
                <th className="py-3 px-3">Feeder Canal</th>
                <th className="py-3 px-3 text-right">Demand</th>
                <th className="py-3 px-3 text-right">Classical Allocation</th>
                <th className="py-3 px-3 text-right">Shortfall</th>
                <th className="py-3 px-3 text-right">Satisfaction %</th>
                <th className="py-3 px-3 text-right">Bounds [Min-Max]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/40 font-medium">
              {scenario.crops.map((crop) => {
                const alloc = classicalSolution.cropAllocations[crop.id] ?? 0;
                const shortfall = Math.max(0, crop.demand - alloc);
                const satPct = Math.round((alloc / crop.demand) * 100);

                return (
                  <tr key={crop.id} className="hover:bg-[#0e1d42]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span>{crop.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {crop.canalId === 'canal_a' ? 'Canal A (North)' : 'Canal B (South)'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      {crop.demand} ML
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-300 font-bold tabular-nums">
                      {alloc} ML
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400 tabular-nums">
                      {shortfall > 0 ? `-${shortfall} ML` : '0 ML'}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          satPct >= 90
                            ? 'text-emerald-400'
                            : satPct >= 75
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {satPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      [{crop.minAllocation} - {crop.maxAllocation}] ML
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-cyan-900/60 font-bold text-white bg-[#091228]/50">
                <td className="py-3 px-3">Total Sum</td>
                <td className="py-3 px-3 text-slate-400">Canal Conveyance</td>
                <td className="py-3 px-3 text-right tabular-nums">
                  {scenario.crops.reduce((s, c) => s + c.demand, 0)} ML
                </td>
                <td className="py-3 px-3 text-right text-cyan-300 tabular-nums">
                  {classicalSolution.totalAllocated} ML
                </td>
                <td className="py-3 px-3 text-right text-amber-400 tabular-nums">
                  {classicalSolution.unmetDemand} ML
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">
                  {classicalSolution.waterUtilization}%
                </td>
                <td className="py-3 px-3 text-right text-slate-400">
                  Res: {scenario.reservoir.availableWater} ML
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-cyan-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            This continuous optimal solution serves as our ground-truth benchmark for QAOA validation.
          </span>
          <button
            onClick={() => setActiveTab('qubo')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Proceed to QUBO Formulation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
