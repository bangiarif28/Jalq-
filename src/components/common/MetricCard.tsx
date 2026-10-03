import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  badge?: {
    text: string;
    type: 'positive' | 'warning' | 'neutral' | 'info';
  };
  progress?: number; // 0 - 100
  accentColor?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  unit,
  subtext,
  badge,
  progress,
  accentColor = 'cyan',
}) => {
  const colorMap = {
    cyan: 'border-cyan-900/30 hover:border-cyan-700/50 bg-[#0d1733]/90 text-cyan-400',
    blue: 'border-blue-900/30 hover:border-blue-700/50 bg-[#0d1733]/90 text-blue-400',
    emerald: 'border-emerald-900/30 hover:border-emerald-700/50 bg-[#0d1733]/90 text-emerald-400',
    amber: 'border-amber-900/30 hover:border-amber-700/50 bg-[#0d1733]/90 text-amber-400',
    purple: 'border-purple-900/30 hover:border-purple-700/50 bg-[#0d1733]/90 text-purple-400',
  };

  const progressColorMap = {
    cyan: 'bg-cyan-400',
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    purple: 'bg-purple-400',
  };

  return (
    <div
      className={`rounded-2xl border p-4.5 transition-all shadow-lg ${colorMap[accentColor]} flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#091124] border border-white/5">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400">{title}</h4>
          </div>
        </div>
        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              badge.type === 'positive'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40'
                : badge.type === 'warning'
                ? 'bg-amber-950 text-amber-300 border-amber-800/40'
                : badge.type === 'info'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800/40'
                : 'bg-slate-900 text-slate-400 border-slate-700/40'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-slate-400">{unit}</span>
          )}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-[#081023] rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColorMap[accentColor]} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
