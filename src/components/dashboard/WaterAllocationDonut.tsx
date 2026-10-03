import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, CheckCircle, Info, ShieldCheck, Droplet } from 'lucide-react';

export const WaterAllocationDonut: React.FC = () => {
  const { scenario, qaoaResult } = useApp();

  const alloc = qaoaResult.cropAllocations;
  const paddyCrop = scenario.crops.find((c) => c.id === 'paddy' || /paddy|rice/i.test(c.name));
  const cottonCrop = scenario.crops.find((c) => c.id === 'cotton' || /cotton/i.test(c.name));
  const pulsesCrop = scenario.crops.find((c) => c.id === 'pulses' || /pulse/i.test(c.name));

  const paddy = (paddyCrop && alloc[paddyCrop.id] !== undefined) ? alloc[paddyCrop.id] : (paddyCrop?.minAllocation ?? 0);
  const cotton = (cottonCrop && alloc[cottonCrop.id] !== undefined) ? alloc[cottonCrop.id] : (cottonCrop?.minAllocation ?? 0);
  const pulses = (pulsesCrop && alloc[pulsesCrop.id] !== undefined) ? alloc[pulsesCrop.id] : (pulsesCrop?.minAllocation ?? 0);

  const totalAllocated = paddy + cotton + pulses;
  const totalWater = scenario.reservoir.availableWater;
  const remaining = Math.max(0, totalWater - totalAllocated);

  const paddyPct = Math.round((paddy / totalWater) * 100);
  const cottonPct = Math.round((cotton / totalWater) * 100);
  const pulsesPct = Math.round((pulses / totalWater) * 100);
  const remainingPct = Math.max(0, 100 - paddyPct - cottonPct - pulsesPct);

  // SVG Donut calculation: circumference = 2 * PI * r
  const r = 58;
  const c = 2 * Math.PI * r;

  const paddyLen = (paddy / totalWater) * c;
  const cottonLen = (cotton / totalWater) * c;
  const pulsesLen = (pulses / totalWater) * c;
  const remainingLen = (remaining / totalWater) * c;

  const paddyOffset = 0;
  const cottonOffset = -paddyLen;
  const pulsesOffset = -(paddyLen + cottonLen);
  const remainingOffset = -(paddyLen + cottonLen + pulsesLen);

  return (
    <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Water Allocation Overview
            </h3>
            <p className="text-xs text-slate-400">Quantum-dispatched distribution across crops</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-cyan-400 tabular-nums">
          Total: {totalWater} ML
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart with Center Label */}
        <div className="flex items-center justify-center relative">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#091226"
              strokeWidth="18"
            />
            {/* Paddy Segment (Emerald/Green) */}
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="18"
              strokeDasharray={`${paddyLen} ${c - paddyLen}`}
              strokeDashoffset={paddyOffset}
              className="transition-all duration-700"
            />
            {/* Cotton Segment (Amber/Orange) */}
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="18"
              strokeDasharray={`${cottonLen} ${c - cottonLen}`}
              strokeDashoffset={cottonOffset}
              className="transition-all duration-700"
            />
            {/* Pulses Segment (Purple/Violet) */}
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#8b5cf6"
              strokeWidth="18"
              strokeDasharray={`${pulsesLen} ${c - pulsesLen}`}
              strokeDashoffset={pulsesOffset}
              className="transition-all duration-700"
            />
            {/* Remaining Reserve (Cyan/Slate) */}
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="transparent"
              stroke="#0ea5e9"
              strokeWidth="18"
              strokeDasharray={`${remainingLen} ${c - remainingLen}`}
              strokeDashoffset={remainingOffset}
              className="transition-all duration-700 opacity-60"
            />
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-white tabular-nums">
              {totalAllocated}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              ML Allocated
            </span>
          </div>
        </div>

        {/* Legend & Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#091228] border border-emerald-900/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span className="text-white font-medium">Paddy (Basmati)</span>
            </div>
            <span className="font-bold text-emerald-400 tabular-nums">
              {paddy} ML ({paddyPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#091228] border border-amber-900/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500"></span>
              <span className="text-white font-medium">Cotton (Long Staple)</span>
            </div>
            <span className="font-bold text-amber-400 tabular-nums">
              {cotton} ML ({cottonPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#091228] border border-purple-900/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-purple-500"></span>
              <span className="text-white font-medium">Pulses (Chickpea)</span>
            </div>
            <span className="font-bold text-purple-400 tabular-nums">
              {pulses} ML ({pulsesPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#091228] border border-cyan-900/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-cyan-500"></span>
              <span className="text-slate-300 font-medium">Ecological Reserve</span>
            </div>
            <span className="font-bold text-cyan-400 tabular-nums">
              {remaining} ML ({remainingPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Key Insights Box matching image */}
      <div className="mt-4 pt-3 border-t border-cyan-950/60 bg-[#081023]/60 rounded-xl p-3">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Key Optimization Insights
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5">
          <li className="flex items-center gap-2">
            <Droplet className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Water utilization is <strong className="text-cyan-300 tabular-nums">{(totalAllocated / totalWater * 100).toFixed(1)}%</strong> of available reservoir capacity.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              No physical canal or reservoir constraint violations detected in feasible solution.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Paddy holds highest allocation volume ({paddyPct}%) conforming to minimum flooding criteria.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
