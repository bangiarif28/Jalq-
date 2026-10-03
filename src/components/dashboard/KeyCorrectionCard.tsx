import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle, Scale, Droplet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { validateAndEnforceFeasibility } from '../../services/waterValidation';

export const KeyCorrectionCard: React.FC = () => {
  const { scenario, qaoaResult, classicalSolution } = useApp();

  const availableWater = scenario.reservoir.availableWater;
  const totalDemand = scenario.crops.reduce((sum, c) => sum + (c.demand || 0), 0);

  // Validate QAOA allocations (or classical as fallback)
  const validation = validateAndEnforceFeasibility(
    qaoaResult?.cropAllocations || classicalSolution?.cropAllocations,
    scenario
  );

  const totalAllocated = validation.totalAllocated;
  const unmetDemand = validation.unmetDemand;
  const isFeasible = totalAllocated <= availableWater && validation.isFeasible;
  const feasibilityStatus: 'FEASIBLE' | 'INFEASIBLE' = isFeasible ? 'FEASIBLE' : 'INFEASIBLE';

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#0a1636] via-[#091530] to-[#071129] border border-cyan-500/40 p-5 shadow-xl shadow-cyan-950/20 relative overflow-hidden">
      {/* Decorative subtle ambient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500 opacity-80" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title & Rule Statement */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <Scale className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
              KEY CORRECTION
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isFeasible 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
                : 'bg-red-950/80 text-red-300 border-red-500/50'
            }`}>
              {feasibilityStatus}
            </span>
          </div>
          
          <p className="text-xs sm:text-sm font-semibold text-cyan-200">
            &ldquo;Total allocated water must never exceed available water.&rdquo;
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            Physical hydrological conservation rule: when total crop demand exceeds reservoir supply, water is distributed strictly up to available capacity, guaranteeing zero over-allocation.
          </p>
        </div>

        {/* Right: Key 5 Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-xs w-full lg:w-auto">
          {/* 1. Available Water */}
          <div className="p-2.5 rounded-xl bg-[#060d1f] border border-cyan-900/40 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-medium block">Available Water</span>
            <div className="mt-1">
              <span className="text-sm sm:text-base font-black text-cyan-300 font-mono">
                {availableWater}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">ML</span>
            </div>
          </div>

          {/* 2. Total Demand */}
          <div className="p-2.5 rounded-xl bg-[#060d1f] border border-cyan-900/40 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-medium block">Total Demand</span>
            <div className="mt-1">
              <span className="text-sm sm:text-base font-black text-slate-200 font-mono">
                {totalDemand}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">ML</span>
            </div>
          </div>

          {/* 3. Total Allocated Water */}
          <div className="p-2.5 rounded-xl bg-[#060d1f] border border-cyan-900/40 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-medium block">Total Allocated</span>
            <div className="mt-1">
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {totalAllocated}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">ML</span>
            </div>
          </div>

          {/* 4. Unmet Demand */}
          <div className="p-2.5 rounded-xl bg-[#060d1f] border border-cyan-900/40 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-medium block">Unmet Demand</span>
            <div className="mt-1">
              <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
                {unmetDemand}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">ML</span>
            </div>
          </div>

          {/* 5. Feasibility Status */}
          <div className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border flex flex-col justify-between ${
            isFeasible 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}>
            <span className="text-[10px] opacity-80 font-medium block">Feasibility Status</span>
            <div className="mt-1 flex items-center gap-1 font-mono font-black text-xs sm:text-sm">
              {isFeasible ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>FEASIBLE</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>INFEASIBLE</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Verification Bar */}
      <div className="mt-3 pt-2.5 border-t border-cyan-900/30 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Constraint Check:</span>
          <span className={totalAllocated <= availableWater ? 'text-emerald-300 font-bold' : 'text-red-400 font-bold'}>
            Total Allocated ({totalAllocated} ML) ≤ Available Water ({availableWater} ML) ✓
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Balance Identity:</span>
          <span className="text-slate-300">
            {totalAllocated} ML + {unmetDemand} ML = {totalDemand} ML (Total Demand)
          </span>
        </div>
      </div>
    </div>
  );
};
