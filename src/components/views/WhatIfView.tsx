import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  SlidersHorizontal, 
  Droplet, 
  ArrowRight, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const WhatIfView: React.FC = () => {
  const { 
    scenario,
    classicalSolution,
    qaoaResult,
    whatIfWaterPercent,
    setWhatIfWaterPercent,
    whatIfCanalReductionPercent,
    setWhatIfCanalReductionPercent,
    whatIfDemandSurgePercent,
    setWhatIfDemandSurgePercent,
    whatIfClassicalResult,
    whatIfQaoaResult,
    setActiveTab
  } = useApp();

  const resetSliders = () => {
    setWhatIfWaterPercent(100);
    setWhatIfCanalReductionPercent(0);
    setWhatIfDemandSurgePercent(0);
  };

  const waterLevels = [100, 90, 75, 50, 25];

  const beforeTotalWater = scenario.reservoir.availableWater;
  const afterTotalWater = Math.round(beforeTotalWater * (whatIfWaterPercent / 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Stress-Testing & Climate Resilience
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Water Scarcity What-If Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-variable sensitivity analysis simulating drought cycles, canal bottlenecks, and agricultural demand surges
          </p>
        </div>

        <button
          onClick={resetSliders}
          className="px-3.5 py-1.5 rounded-xl bg-[#091228] hover:bg-[#0f1f45] border border-cyan-900/40 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Stress Variables</span>
        </button>
      </div>

      {/* Sliders Control Panel matching Requirement 17 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Hydraulic Stress Controls (Real-Time Live Recalculation)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Available Water (Scarcity) */}
          <div className="space-y-3 p-4 rounded-xl bg-[#091228] border border-cyan-950/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-cyan-400" />
                Available Reservoir Water
              </span>
              <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
                {whatIfWaterPercent}% ({afterTotalWater} ML)
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-1.5">
              {waterLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setWhatIfWaterPercent(lvl)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    whatIfWaterPercent === lvl
                      ? 'bg-cyan-500 text-white shadow'
                      : 'bg-[#0e1d42] text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}%
                </button>
              ))}
            </div>

            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={whatIfWaterPercent}
              onChange={(e) => setWhatIfWaterPercent(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              Simulates monsoon deficit or upstream storage curtailment.
            </span>
          </div>

          {/* Slider 2: Canal Capacity Reduction */}
          <div className="space-y-3 p-4 rounded-xl bg-[#091228] border border-cyan-950/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Canal Capacity Curtailment
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                -{whatIfCanalReductionPercent}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={whatIfCanalReductionPercent}
              onChange={(e) => setWhatIfCanalReductionPercent(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer mt-4"
            />
            <span className="text-[10px] text-slate-400 block">
              Simulates canal breach, silt accumulation, or gate maintenance outages.
            </span>
          </div>

          {/* Slider 3: Demand Increase */}
          <div className="space-y-3 p-4 rounded-xl bg-[#091228] border border-cyan-950/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Crop Demand Surge
              </span>
              <span className="text-xs font-mono font-bold text-purple-300 tabular-nums">
                +{whatIfDemandSurgePercent}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={whatIfDemandSurgePercent}
              onChange={(e) => setWhatIfDemandSurgePercent(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer mt-4"
            />
            <span className="text-[10px] text-slate-400 block">
              Simulates heatwaves, evapotranspiration spikes, or command area expansion.
            </span>
          </div>
        </div>
      </div>

      {/* Before vs After Impact Comparison matching Requirement 17 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Baseline (Before) */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0d1733]/90 border border-cyan-950/60 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Baseline State</span>
              <h3 className="text-sm font-bold text-white">BEFORE Scarcity Event</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700/40">
              100% Water Supply
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Total Available Water</span>
              <p className="text-lg font-bold text-white tabular-nums">{beforeTotalWater} ML</p>
            </div>
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Water Utilization</span>
              <p className="text-lg font-bold text-cyan-300 tabular-nums">{qaoaResult.waterUtilization}%</p>
            </div>
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Unmet Crop Demand</span>
              <p className="text-lg font-bold text-amber-300 tabular-nums">{qaoaResult.unmetDemand} ML</p>
            </div>
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Objective Score</span>
              <p className="text-lg font-bold text-purple-300 tabular-nums">{qaoaResult.objectiveScore}</p>
            </div>
          </div>

          {/* Crop breakdown */}
          <div className="space-y-2 pt-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Crop Allocations (Before)
            </h4>
            {scenario.crops.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#091228]">
                <span className="text-white">{c.name}</span>
                <span className="font-bold text-cyan-300 tabular-nums">
                  {qaoaResult.cropAllocations[c.id] || 0} ML ({Math.round(((qaoaResult.cropAllocations[c.id] || 0) / c.demand) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stressed (After) */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0d1733]/90 border-2 border-emerald-500/40 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Simulated State</span>
              <h3 className="text-sm font-bold text-white">AFTER What-If Stress Event</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              Live Recalculated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Total Available Water</span>
              <p className="text-lg font-bold text-cyan-300 tabular-nums">{afterTotalWater} ML</p>
            </div>
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Water Utilization</span>
              <p className="text-lg font-bold text-cyan-300 tabular-nums">{whatIfQaoaResult.waterUtilization}%</p>
            </div>
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Unmet Crop Demand</span>
              <p className="text-lg font-bold text-amber-300 tabular-nums">{whatIfQaoaResult.unmetDemand} ML</p>
            </div>
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Objective Score</span>
              <p className="text-lg font-bold text-purple-300 tabular-nums">{whatIfQaoaResult.objectiveScore}</p>
            </div>
          </div>

          {/* Crop breakdown with Delta indicators */}
          <div className="space-y-2 pt-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Crop Allocations (After Dynamic Rebalancing)
            </h4>
            {scenario.crops.map((c) => {
              const beforeAlloc = qaoaResult.cropAllocations[c.id] || 0;
              const afterAlloc = whatIfQaoaResult.cropAllocations[c.id] || 0;
              const delta = afterAlloc - beforeAlloc;

              return (
                <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#091228]">
                  <span className="text-white font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tabular-nums">
                      {afterAlloc} ML
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        delta < 0 ? 'text-amber-400' : delta > 0 ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta} ML
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decision Support Insights Footer */}
      <div className="p-5 rounded-2xl bg-[#081126] border border-cyan-950 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Autonomous Adaptation Policy
        </h4>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Under water scarcity, JalQ's hybrid solver automatically prioritizes high-value and food-security crops (e.g. Paddy priority 1.25) 
          while safely adjusting lower-priority or drought-tolerant crops (Cotton/Pulses) within their agronomic minimum bounds, avoiding catastrophic field abandonment.
        </p>
      </div>
    </div>
  );
};
