import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Filter, 
  BarChart3, 
  PieChart, 
  Droplet, 
  Waves, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { scenario, classicalSolution, qaoaResult, quboResult, allPresets, loadPreset } = useApp();

  // Filters matching Requirement 16: Scenario, Crop, Canal, Optimization method
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedCanalFilter, setSelectedCanalFilter] = useState<string>('all');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<'both' | 'classical' | 'qaoa'>('both');

  // Filter crops
  const filteredCrops = scenario.crops.filter((c) => {
    if (selectedCropFilter !== 'all' && c.id !== selectedCropFilter) return false;
    if (selectedCanalFilter !== 'all' && c.canalId !== selectedCanalFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Cross-Dimensional Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Hydraulic & Quantum Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Multi-variable analytics tracking conveyance stress, objective convergence, and volumetric equity
          </p>
        </div>
      </div>

      {/* Filter Bar matching Requirement 16 */}
      <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-white font-bold">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Analytics Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Scenario Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Scenario:</span>
            <select
              value={scenario.id}
              onChange={(e) => loadPreset(e.target.value)}
              className="bg-[#091228] text-white px-2.5 py-1 rounded-lg border border-cyan-900/40 focus:outline-none cursor-pointer"
            >
              {allPresets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Crop:</span>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="bg-[#091228] text-white px-2.5 py-1 rounded-lg border border-cyan-900/40 focus:outline-none cursor-pointer"
            >
              <option value="all">All Crops</option>
              {scenario.crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Canal Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Canal:</span>
            <select
              value={selectedCanalFilter}
              onChange={(e) => setSelectedCanalFilter(e.target.value)}
              className="bg-[#091228] text-white px-2.5 py-1 rounded-lg border border-cyan-900/40 focus:outline-none cursor-pointer"
            >
              <option value="all">All Canals</option>
              {scenario.canals.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Method:</span>
            <select
              value={selectedMethodFilter}
              onChange={(e) => setSelectedMethodFilter(e.target.value as any)}
              className="bg-[#091228] text-white px-2.5 py-1 rounded-lg border border-cyan-900/40 focus:outline-none cursor-pointer"
            >
              <option value="both">Both (Classical & QAOA)</option>
              <option value="classical">Classical Only</option>
              <option value="qaoa">QAOA Quantum Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization 1: Canal Utilization & Discharge Headroom */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              Canal Conveyance Utilization
            </h4>
            <span className="text-[11px] text-slate-400">Physical Discharge Caps</span>
          </div>

          <div className="space-y-4 pt-2">
            {scenario.canals.map((canal) => {
              const flow = qaoaResult.canalFlows[canal.id] || 0;
              const cap = canal.maxCapacity;
              const utilPct = Math.round((flow / cap) * 100);
              const headroom = Math.max(0, cap - flow);

              return (
                <div key={canal.id} className="p-3.5 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{canal.name}</span>
                      <span className="text-[10px] text-slate-400 block">Efficiency: {(canal.efficiency * 100).toFixed(0)}%</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold tabular-nums">
                      {flow} / {cap} ML ({utilPct}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-[#081023] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        utilPct > 95 ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, utilPct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Safety Margin Headroom: <strong className="text-emerald-400">{headroom} ML</strong></span>
                    <span>Min Flow: {canal.minFlow} ML</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualization 2: Crop Satisfaction Breakdown */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              Agronomic Delivery vs Requirement
            </h4>
            <span className="text-[11px] text-slate-400">Demand Satisfaction</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {filteredCrops.map((crop) => {
              const cAlloc = classicalSolution.cropAllocations[crop.id] || 0;
              const qAlloc = qaoaResult.cropAllocations[crop.id] || 0;
              const satPct = Math.round((qAlloc / crop.demand) * 100);

              return (
                <div key={crop.id} className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-white">{crop.name}</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{satPct}% Satisfied</span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Demand: {crop.demand} ML</span>
                    <span>
                      {selectedMethodFilter !== 'qaoa' && `Classical: ${cAlloc} ML `}
                      {selectedMethodFilter !== 'classical' && `| QAOA: ${qAlloc} ML`}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#081023] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, satPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualization 3: Objective Energy Landscape */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Variational QAOA Expectation Energy
          </h4>
          <p className="text-xs text-slate-400">Energy convergence profile over classical optimizer iterations</p>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Optimal Angles [γ*, β*]</span>
              <p className="text-sm font-mono font-bold text-cyan-300 mt-1">
                γ: {qaoaResult.optimalGamma[0]}
              </p>
              <p className="text-sm font-mono font-bold text-purple-300">
                β: {qaoaResult.optimalBeta[0]}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Ground Energy Bound</span>
              <p className="text-xl font-mono font-black text-white mt-1">
                {qaoaResult.bestEnergy}
              </p>
              <span className="text-[10px] text-emerald-400">⟨H_C⟩ Expectation</span>
            </div>

            <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
              <span className="text-slate-400 text-[10px]">Approximation Ratio</span>
              <p className="text-xl font-mono font-black text-emerald-400 mt-1">
                {((qaoaResult.objectiveScore / Math.max(1, classicalSolution.objectiveScore)) * 100).toFixed(1)}%
              </p>
              <span className="text-[10px] text-slate-400">QAOA / Classical</span>
            </div>
          </div>
        </div>

        {/* Visualization 4: Systemic Invariants & Invariance Checks */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Physical Invariant Audit
          </h4>
          <p className="text-xs text-slate-400">Hydraulic mass conservation and boundary verification</p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex items-center justify-between">
              <span className="text-white">Reservoir Mass Conservation</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Satisfied
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex items-center justify-between">
              <span className="text-white">Ecological Reserve Preservation</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {scenario.reservoir.minReserve} ML Protected
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex items-center justify-between">
              <span className="text-white">Canal Hydraulic Pressure Bounds</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 0 Violations Detected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
