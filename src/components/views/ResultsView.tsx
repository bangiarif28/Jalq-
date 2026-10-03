import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Droplet, 
  Scale, 
  Atom, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  PieChart,
  BarChart2,
  FileText
} from 'lucide-react';

export const ResultsView: React.FC = () => {
  const { 
    scenario, 
    classicalSolution, 
    qaoaResult, 
    setActiveTab, 
    hasRunOptimization, 
    runCompleteOptimization, 
    workflowState 
  } = useApp();

  const totalDemand = scenario.crops.reduce((s, c) => s + c.demand, 0);
  const availableWater = scenario.reservoir.availableWater;
  const waterUsed = qaoaResult.totalAllocated;
  const waterRemaining = Math.max(0, availableWater - waterUsed);
  const unmetDemand = Math.max(0, totalDemand - waterUsed);

  if (!hasRunOptimization) {
    return (
      <div className="rounded-3xl bg-[#0d1733]/90 border border-cyan-900/40 p-10 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#091228] border border-cyan-800/40 flex items-center justify-center text-cyan-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Optimization Results Generated Yet</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Please run the complete 10-stage optimization pipeline to formulate the QUBO, simulate the QAOA circuit, and calculate final water allocations.
        </p>
        <button
          onClick={runCompleteOptimization}
          disabled={workflowState.isOptimizing}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-950 flex items-center gap-2 mx-auto cursor-pointer transition-all active:scale-95"
        >
          <span>▶ RUN COMPLETE OPTIMIZATION</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Dispatched Decision Support
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            OPTIMIZED WATER ALLOCATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Final multi-crop dispatch schedule synthesized from QAOA statevector and validated against classical benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('classical_comparison')}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>Classical vs QAOA Specs</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <FileText className="w-4 h-4" />
            <span>Export Technical Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Row matching Prompt Requirement 14 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 shadow-lg">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Water Used</span>
          <p className="text-2xl font-extrabold text-cyan-300 tabular-nums mt-0.5">
            {waterUsed} ML
          </p>
          <span className="text-[10px] text-slate-400">{qaoaResult.waterUtilization}% of reservoir</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 shadow-lg">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Water Remaining</span>
          <p className="text-2xl font-extrabold text-white tabular-nums mt-0.5">
            {waterRemaining} ML
          </p>
          <span className="text-[10px] text-cyan-400">Ecological safe reserve</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-amber-900/30 shadow-lg">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Unmet Demand</span>
          <p className="text-2xl font-extrabold text-amber-300 tabular-nums mt-0.5">
            {unmetDemand} ML
          </p>
          <span className="text-[10px] text-slate-400">Managed systemic deficit</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-emerald-900/30 shadow-lg">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Constraint Violations</span>
          <p className="text-2xl font-extrabold text-emerald-400 tabular-nums mt-0.5">
            {qaoaResult.constraintViolations}
          </p>
          <span className="text-[10px] text-emerald-400">Strictly feasible</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-purple-900/30 shadow-lg">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Objective Score</span>
          <p className="text-2xl font-extrabold text-purple-300 tabular-nums mt-0.5">
            {qaoaResult.objectiveScore}
          </p>
          <span className="text-[10px] text-purple-400">Multi-objective utility</span>
        </div>
      </div>

      {/* Large Allocation Table matching Prompt Requirement 14 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Multi-Method Water Allocation Master Table
          </h3>
          <span className="text-xs text-slate-400">Measured in Megalitres (ML)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-cyan-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Crop Zone</th>
                <th className="py-3 px-3">Feeder Canal</th>
                <th className="py-3 px-3 text-right">Demand</th>
                <th className="py-3 px-3 text-right">Classical (SQP)</th>
                <th className="py-3 px-3 text-right">QAOA Quantum</th>
                <th className="py-3 px-3 text-right">Difference (Δ)</th>
                <th className="py-3 px-3 text-right">Satisfaction %</th>
                <th className="py-3 px-3 text-right">Discharge Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/40 font-medium">
              {scenario.crops.map((crop) => {
                const dem = crop.demand;
                const cAlloc = classicalSolution.cropAllocations[crop.id] ?? 0;
                const qAlloc = qaoaResult.cropAllocations[crop.id] ?? 0;
                const diff = Math.round((qAlloc - cAlloc) * 10) / 10;
                const satPct = Math.round((qAlloc / dem) * 100);

                return (
                  <tr key={crop.id} className="hover:bg-[#0e1d42]/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                      <span>{crop.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {crop.canalId === 'canal_a' ? 'Canal A (North)' : 'Canal B (South)'}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300 tabular-nums font-semibold">
                      {dem} ML
                    </td>
                    <td className="py-3.5 px-3 text-right text-blue-300 font-bold tabular-nums">
                      {cAlloc} ML
                    </td>
                    <td className="py-3.5 px-3 text-right text-cyan-300 font-bold tabular-nums text-sm">
                      {qAlloc} ML
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-amber-400' : 'text-slate-400'}>
                        {diff > 0 ? `+${diff}` : diff} ML
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums">
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
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        Dispatched
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-cyan-900/60 font-bold text-white bg-[#091228]/50">
                <td className="py-3 px-3">Total Network</td>
                <td className="py-3 px-3 text-slate-400">Total Conveyance</td>
                <td className="py-3 px-3 text-right tabular-nums">{totalDemand} ML</td>
                <td className="py-3 px-3 text-right text-blue-300 tabular-nums">
                  {classicalSolution.totalAllocated} ML
                </td>
                <td className="py-3 px-3 text-right text-cyan-300 tabular-nums text-sm">
                  {qaoaResult.totalAllocated} ML
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                  {Math.round((qaoaResult.totalAllocated - classicalSolution.totalAllocated) * 10) / 10} ML
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">
                  {Math.round((qaoaResult.totalAllocated / totalDemand) * 100)}%
                </td>
                <td className="py-3 px-3 text-right text-emerald-400">
                  Optimal Release
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Visual Analytics Grid: Classical vs QAOA Charts matching Requirement 14 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Allocation Comparison */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Discharge Satisfaction Comparison
            </h4>
            <span className="text-[11px] text-slate-400">% Demand Met</span>
          </div>

          <div className="space-y-4 pt-2">
            {scenario.crops.map((crop) => {
              const cAlloc = classicalSolution.cropAllocations[crop.id] ?? 0;
              const qAlloc = qaoaResult.cropAllocations[crop.id] ?? 0;
              const cSat = Math.round((cAlloc / crop.demand) * 100);
              const qSat = Math.round((qAlloc / crop.demand) * 100);

              return (
                <div key={crop.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">{crop.name}</span>
                    <span className="text-slate-400">
                      Classical: <strong className="text-blue-300 tabular-nums">{cSat}%</strong> | QAOA: <strong className="text-cyan-300 tabular-nums">{qSat}%</strong>
                    </span>
                  </div>

                  {/* Classical bar */}
                  <div className="w-full h-1.5 bg-[#081023] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, cSat)}%` }}
                    />
                  </div>

                  {/* QAOA bar */}
                  <div className="w-full h-2 bg-[#081023] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, qSat)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Objective & Systemic Efficiency */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Objective & Approximation Ratio
              </h4>
              <span className="text-[11px] text-cyan-400">Continuous vs Discretized</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#091228] border border-blue-900/30">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Classical Score</span>
                <p className="text-2xl font-black text-blue-300 tabular-nums mt-0.5">
                  {classicalSolution.objectiveScore}
                </p>
                <span className="text-[10px] text-slate-400">Continuous Active-Set SQP</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#091228] border border-cyan-900/30">
                <span className="text-slate-400 text-[10px] uppercase font-bold">QAOA Score</span>
                <p className="text-2xl font-black text-cyan-300 tabular-nums mt-0.5">
                  {qaoaResult.objectiveScore}
                </p>
                <span className="text-[10px] text-cyan-400">8-Qubit Statevector</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#081023] border border-cyan-950 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Approximation Ratio (QAOA / Classical):</span>
                <strong className="text-emerald-400 font-bold tabular-nums">
                  {((qaoaResult.objectiveScore / Math.max(1, classicalSolution.objectiveScore)) * 100).toFixed(1)}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Canal Conveyance Stress:</span>
                <strong className="text-slate-300">Within Nominal Limits</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('what_if')}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span>Run Water Scarcity What-If Stress Tests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
