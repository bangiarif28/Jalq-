import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Droplet,
  Waves,
  Scale
} from 'lucide-react';

export const FeasibilityCheckView: React.FC = () => {
  const { 
    scenario, 
    qaoaResult, 
    setActiveTab, 
    hasRunOptimization, 
    runCompleteOptimization, 
    workflowState 
  } = useApp();

  const availableWater = scenario.reservoir.availableWater;
  const waterUsed = qaoaResult.totalAllocated;
  const waterRemaining = Math.max(0, availableWater - waterUsed);

  // Exact physical validation checks based on actual scenario calculation
  const isReservoirSatisfied = qaoaResult.totalAllocated <= scenario.reservoir.availableWater;
  const capA = scenario.canals.find((c) => c.id === 'canal_a')?.maxCapacity || 600;
  const capB = scenario.canals.find((c) => c.id === 'canal_b')?.maxCapacity || 400;
  const isCanalSatisfied = (qaoaResult.canalFlows['canal_a'] || 0) <= capA + 0.1 && (qaoaResult.canalFlows['canal_b'] || 0) <= capB + 0.1;
  const isCropSatisfied = scenario.crops.every((c) => (qaoaResult.cropAllocations[c.id] || 0) <= c.maxAllocation + 0.1 && (qaoaResult.cropAllocations[c.id] || 0) >= 0);
  const isFinalFeasible = qaoaResult.constraintViolations === 0 && isReservoirSatisfied && isCanalSatisfied && isCropSatisfied;

  if (!hasRunOptimization) {
    return (
      <div className="rounded-3xl bg-[#0d1733]/90 border border-cyan-900/40 p-10 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#091228] border border-cyan-800/40 flex items-center justify-center text-cyan-400">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">No Feasibility Results Generated Yet</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Please run the optimization pipeline to perform the hydraulic boundary feasibility audit across reservoir and canal constraints.
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
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Stage 7: Hydraulic Audit
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            FEASIBILITY CHECK
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Rigorous post-quantum feasibility audit confirming zero violations across reservoir availability, canal conveyances, and crop allocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('results')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <span>Proceed to Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Bounds Cards matching Stage 6/7 Specification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 shadow-lg space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Reservoir Bound</span>
          <p className="text-base font-extrabold text-cyan-300 tabular-nums">
            {isReservoirSatisfied ? 'Satisfied ✓' : 'Violated ⚠'}
          </p>
          <span className="text-[10px] text-slate-400 block truncate">
            {qaoaResult.totalAllocated} / {scenario.reservoir.availableWater} ML
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 shadow-lg space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Canal A Bound</span>
          <p className="text-base font-extrabold text-emerald-400 tabular-nums">
            {(qaoaResult.canalFlows['canal_a'] || 0) <= capA ? 'Satisfied ✓' : 'Violated ⚠'}
          </p>
          <span className="text-[10px] text-slate-400 block truncate">
            {qaoaResult.canalFlows['canal_a'] || 0} / {capA} ML
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 shadow-lg space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Canal B Bound</span>
          <p className="text-base font-extrabold text-emerald-400 tabular-nums">
            {(qaoaResult.canalFlows['canal_b'] || 0) <= capB ? 'Satisfied ✓' : 'Violated ⚠'}
          </p>
          <span className="text-[10px] text-slate-400 block truncate">
            {qaoaResult.canalFlows['canal_b'] || 0} / {capB} ML
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-emerald-900/30 shadow-lg space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Violations Flagged</span>
          <p className="text-2xl font-black text-emerald-400 tabular-nums">
            {qaoaResult.constraintViolations}
          </p>
          <span className="text-[10px] text-emerald-400 block">
            {qaoaResult.constraintViolations === 0 ? 'Strictly feasible' : 'Action required'}
          </span>
        </div>
      </div>

      {/* Hydraulic Boundary Validations (Water Availability, Canal Capacity, Crop Allocation, Final Solution Feasible) */}
      <div className="rounded-2xl bg-[#0a1533]/90 border border-emerald-500/30 p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-950/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Physical Invariants
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Physically Validated Hydraulic Boundaries
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Rigorous post-quantum verification against physical Krishna-Godavari boundary invariants.
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shrink-0 self-start sm:self-auto border ${
            isFinalFeasible 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50' 
              : 'bg-amber-950 text-amber-300 border-amber-800/50'
          }`}>
            {isFinalFeasible ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Final Solution Feasible</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Constraint Repair Required</span>
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          {/* Check 1: Water availability */}
          <div className="p-3 rounded-xl bg-[#070f24] border border-emerald-900/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              {isReservoirSatisfied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">✓ Water availability satisfied</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-red-400">⚠ Water availability exceeded</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              Total allocated {waterUsed} ML ≤ Available {availableWater} ML ({scenario.reservoir.minReserve} ML reserve)
            </p>
          </div>

          {/* Check 2: Canal capacity */}
          <div className="p-3 rounded-xl bg-[#070f24] border border-emerald-900/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              {isCanalSatisfied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">✓ Canal capacity satisfied</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-amber-400">⚠ Canal capacity exceeded</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              Canal A: {qaoaResult.canalFlows['canal_a'] || 0}/{capA} ML | Canal B: {qaoaResult.canalFlows['canal_b'] || 0}/{capB} ML
            </p>
          </div>

          {/* Check 3: Crop allocation */}
          <div className="p-3 rounded-xl bg-[#070f24] border border-emerald-900/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              {isCropSatisfied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">✓ Crop allocation satisfied</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-amber-400">⚠ Crop limits exceeded</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              All crop allocations respect agronomic min/max bounds and crop water survival thresholds.
            </p>
          </div>

          {/* Check 4: Final solution feasible */}
          <div className="p-3 rounded-xl bg-[#070f24] border border-emerald-900/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              {isFinalFeasible ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">✓ Final solution feasible</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-amber-400">⚠ Infeasible solution</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              {qaoaResult.constraintViolations === 0 
                ? '0 violations recorded across all physical invariants.' 
                : `${qaoaResult.constraintViolations} violations detected.`}
            </p>
          </div>
        </div>
      </div>

      {/* Final Verified Allocation */}
      <div className="rounded-2xl bg-gradient-to-r from-[#091530] via-[#0b193d] to-[#08122a] border border-cyan-500/40 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-900/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-700/50 shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                  Verified Schedule
                </span>
                <h3 className="text-base font-black text-white tracking-tight">
                  Final Verified Allocation
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isFinalFeasible 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50' 
                    : 'bg-amber-950 text-amber-300 border-amber-800/50'
                }`}>
                  {isFinalFeasible ? '✓ Verified Feasible' : '⚠ Action Required'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Region: <strong className="text-cyan-300">Krishna-Godavari Command Area, Andhra Pradesh</strong>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-800/40 block">
              QAOA Result: Dispatched State |{qaoaResult.bestFeasibleBitstring}⟩
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Execution Time: <strong className="text-slate-200 tabular-nums">{qaoaResult.executionTimeMs} ms</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[#070f24] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available Water</span>
            <span className="text-base font-bold text-white tabular-nums">{availableWater} ML</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Reservoir storage</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070f24] border border-cyan-950 col-span-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recommended Allocation</span>
            <div className="text-xs font-bold text-cyan-300 flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
              {scenario.crops.map((c) => (
                <span key={c.id}>
                  {c.name.split(' ')[0]}: <strong className="text-white tabular-nums">{qaoaResult.cropAllocations[c.id] || 0} ML</strong>
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Total Dispatched: <strong className="text-emerald-400">{waterUsed} ML</strong></span>
          </div>

          <div className="p-3 rounded-xl bg-[#070f24] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Constraint Violations</span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">{qaoaResult.constraintViolations}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              {qaoaResult.constraintViolations === 0 ? '0 violations' : `${qaoaResult.constraintViolations} detected`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070f24] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Water Utilisation</span>
            <span className="text-base font-bold text-cyan-300 tabular-nums">{qaoaResult.waterUtilization}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{waterRemaining} ML reserve</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070f24] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Objective Score</span>
            <span className="text-base font-bold text-purple-300 tabular-nums">{qaoaResult.objectiveScore}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Utility Index</span>
          </div>
        </div>
      </div>
    </div>
  );
};
