import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3 } from 'lucide-react';

export const AllocationComparisonBarChart: React.FC = () => {
  const { scenario, classicalSolution, qaoaResult } = useApp();

  const crops = scenario.crops;
  const maxVal = Math.max(...crops.map((c) => c.demand)) * 1.15; // scale height

  return (
    <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Allocation Comparison: Demand vs Classical vs QAOA
            </h3>
            <p className="text-xs text-slate-400">
              Crop-level discharge analysis (units in Megalitres / ML)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-500"></span>
            <span className="text-slate-300">Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500"></span>
            <span className="text-slate-300">Classical (SQP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-400"></span>
            <span className="text-slate-300">Quantum (QAOA)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-3 gap-6 items-end h-56 px-4 border-b border-cyan-950/60">
          {crops.map((crop) => {
            const demand = crop.demand;
            const classical = classicalSolution.cropAllocations[crop.id] ?? 0;
            const quantum = qaoaResult.cropAllocations[crop.id] ?? 0;

            const demandHeightPct = (demand / maxVal) * 100;
            const classicalHeightPct = (classical / maxVal) * 100;
            const quantumHeightPct = (quantum / maxVal) * 100;

            return (
              <div key={crop.id} className="flex flex-col items-center h-full justify-end group">
                {/* 3 grouped bars */}
                <div className="flex items-end gap-1.5 w-full justify-center h-48">
                  {/* Demand Bar */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {demand}
                    </span>
                    <div
                      className="w-5 sm:w-7 bg-slate-600/70 hover:bg-slate-500 rounded-t-md transition-all duration-500"
                      style={{ height: `${demandHeightPct}%` }}
                      title={`Demand: ${demand} ML`}
                    />
                  </div>

                  {/* Classical Bar */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-blue-300 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {classical}
                    </span>
                    <div
                      className="w-5 sm:w-7 bg-blue-600 hover:bg-blue-500 rounded-t-md transition-all duration-500"
                      style={{ height: `${classicalHeightPct}%` }}
                      title={`Classical Allocation: ${classical} ML`}
                    />
                  </div>

                  {/* Quantum Bar */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-cyan-300 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {quantum}
                    </span>
                    <div
                      className="w-5 sm:w-7 bg-cyan-400 hover:bg-cyan-300 rounded-t-md transition-all duration-500"
                      style={{ height: `${quantumHeightPct}%` }}
                      title={`QAOA Allocation: ${quantum} ML`}
                    />
                  </div>
                </div>

                {/* X Axis Label */}
                <div className="mt-3 text-center">
                  <span className="text-xs font-bold text-white block">
                    {crop.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    [{crop.minAllocation} - {crop.maxAllocation}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Water allocation values displayed in Megalitres (ML)</span>
        <span className="text-cyan-400 font-medium">Both methods strictly respect canal thresholds</span>
      </div>
    </div>
  );
};
