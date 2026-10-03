import React from 'react';
import { Crop } from '../../types';

interface CropCardProps {
  crop: Crop;
  allocatedWater: number;
  demand: number;
  priority: number;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  allocatedWater,
  demand,
  priority,
}) => {
  const satisfaction = Math.round((allocatedWater / demand) * 100);
  const shortfall = Math.max(0, demand - allocatedWater);

  const getCropEmoji = (type: Crop['iconType']) => {
    switch (type) {
      case 'paddy':
        return '🌾';
      case 'cotton':
        return '🌿';
      case 'pulses':
        return '🌱';
      case 'wheat':
        return '🌾';
      case 'sugarcane':
        return '🎋';
      default:
        return '🌱';
    }
  };

  const getBorderColor = () => {
    if (satisfaction >= 90) return 'border-cyan-800/40 hover:border-cyan-500/60';
    if (satisfaction >= 75) return 'border-emerald-800/40 hover:border-emerald-500/60';
    return 'border-amber-800/40 hover:border-amber-500/60';
  };

  return (
    <div
      className={`rounded-2xl bg-[#0d1733]/90 border ${getBorderColor()} p-4 transition-all shadow-lg flex flex-col justify-between`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#091124] border border-white/5 flex items-center justify-center text-2xl">
            {getCropEmoji(crop.iconType)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight leading-tight">
              {crop.name}
            </h4>
            <span className="text-[11px] text-slate-400">
              Canal: {crop.canalId === 'canal_a' ? 'Canal A (North)' : 'Canal B (South)'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Priority {priority.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            Yield: ₹{crop.economicYieldPerUnit}k/ML
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 my-3 text-xs">
        <div className="p-2 rounded-lg bg-[#091228] border border-cyan-950/60">
          <span className="text-slate-400 text-[11px]">Water Demand</span>
          <p className="text-base font-bold text-white tabular-nums">{demand} ML</p>
        </div>
        <div className="p-2 rounded-lg bg-[#091228] border border-cyan-950/60">
          <span className="text-cyan-400 text-[11px]">Allocated</span>
          <p className="text-base font-bold text-cyan-300 tabular-nums">
            {allocatedWater} ML
          </p>
        </div>
      </div>

      {/* Constraints & Satisfaction Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">
            Bounds: [{crop.minAllocation} - {crop.maxAllocation}] ML
          </span>
          <span
            className={`font-bold tabular-nums ${
              satisfaction >= 90
                ? 'text-emerald-400'
                : satisfaction >= 75
                ? 'text-cyan-400'
                : 'text-amber-400'
            }`}
          >
            {satisfaction}% Met ({shortfall > 0 ? `-${shortfall} ML` : 'Full'})
          </span>
        </div>

        <div className="w-full h-2 bg-[#081023] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              satisfaction >= 90
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                : satisfaction >= 75
                ? 'bg-cyan-400'
                : 'bg-amber-400'
            }`}
            style={{ width: `${Math.min(100, satisfaction)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
