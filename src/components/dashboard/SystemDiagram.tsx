import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Waves, 
  Droplet, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Maximize2
} from 'lucide-react';

export const SystemDiagram: React.FC = () => {
  const { scenario, classicalSolution, qaoaResult } = useApp();
  const [selectedNode, setSelectedNode] = useState<string | null>('reservoir');

  // Currently displayed allocations (defaults to QAOA or classical)
  const alloc = qaoaResult.cropAllocations;
  const canalFlows = qaoaResult.canalFlows;

  const paddyCrop = scenario.crops.find((c) => c.id === 'paddy' || /paddy|rice/i.test(c.name));
  const cottonCrop = scenario.crops.find((c) => c.id === 'cotton' || /cotton/i.test(c.name));
  const pulsesCrop = scenario.crops.find((c) => c.id === 'pulses' || /pulse/i.test(c.name));

  const paddyAlloc = (paddyCrop && alloc[paddyCrop.id] !== undefined) ? alloc[paddyCrop.id] : (paddyCrop?.minAllocation ?? 0);
  const cottonAlloc = (cottonCrop && alloc[cottonCrop.id] !== undefined) ? alloc[cottonCrop.id] : (cottonCrop?.minAllocation ?? 0);
  const pulsesAlloc = (pulsesCrop && alloc[pulsesCrop.id] !== undefined) ? alloc[pulsesCrop.id] : (pulsesCrop?.minAllocation ?? 0);

  const canalAFlow = canalFlows['canal_a'] ?? paddyAlloc;
  const canalBFlow = canalFlows['canal_b'] ?? (cottonAlloc + pulsesAlloc);

  const resCapacity = scenario.reservoir.availableWater;
  const resUsed = paddyAlloc + cottonAlloc + pulsesAlloc;
  const resPct = Math.round((resUsed / resCapacity) * 100);

  const canalACap = scenario.canals.find((c) => c.id === 'canal_a')?.maxCapacity || 600;
  const canalBCap = scenario.canals.find((c) => c.id === 'canal_b')?.maxCapacity || 400;

  const canalAPct = Math.round((canalAFlow / canalACap) * 100);
  const canalBPct = Math.round((canalBFlow / canalBCap) * 100);

  return (
    <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Interactive River-Canal Network Topology
            </h3>
            <p className="text-xs text-slate-400">
              Real-time physical conveyance network and quantum-dispatched discharge
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Dynamic Flow Simulation
          </span>
        </div>
      </div>

      {/* SVG Flow Canvas & Interactive HTML Nodes */}
      <div className="relative py-4 px-2 min-h-[360px] flex flex-col items-center justify-between">
        {/* Animated Water Conduits (SVG Layer) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 700 360"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Conduit 1: Reservoir to Canal A */}
          <path
            d="M 350,75 C 350,110 200,115 200,150"
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth="4"
            className="water-flow-active"
            filter="url(#glowFilter)"
          />

          {/* Conduit 2: Reservoir to Canal B */}
          <path
            d="M 350,75 C 350,110 500,115 500,150"
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth="4"
            className="water-flow-active"
            filter="url(#glowFilter)"
          />

          {/* Conduit 3: Canal A to Paddy */}
          <path
            d="M 200,210 C 200,240 150,245 150,275"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            className="water-flow-active"
          />

          {/* Conduit 4: Canal B to Cotton */}
          <path
            d="M 500,210 C 500,240 450,245 450,275"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            className="water-flow-active"
          />

          {/* Conduit 5: Canal B to Pulses */}
          <path
            d="M 500,210 C 500,240 580,245 580,275"
            fill="none"
            stroke="#a855f7"
            strokeWidth="3.5"
            className="water-flow-active"
          />
        </svg>

        {/* Level 1: Primary Reservoir Node */}
        <div className="z-10 w-full flex justify-center">
          <div
            onClick={() => setSelectedNode('reservoir')}
            className={`group cursor-pointer rounded-2xl border transition-all p-3 w-72 text-center shadow-xl ${
              selectedNode === 'reservoir'
                ? 'bg-gradient-to-b from-[#102454] to-[#0c183a] border-cyan-400 ring-2 ring-cyan-400/30'
                : 'bg-[#0f1d40] border-cyan-900/40 hover:border-cyan-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xl">🌊</span>
              <span className="font-extrabold text-sm text-white tracking-wide">
                PRIMARY RESERVOIR
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <span className="text-cyan-300 font-semibold tabular-nums">
                Available: {resCapacity} ML
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-semibold tabular-nums">
                Used: {resUsed} ML ({resPct}%)
              </span>
            </div>
            {/* Reservoir Water Level Bar */}
            <div className="w-full h-1.5 bg-[#081023] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${resPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Level 2: Secondary Canals Row */}
        <div className="z-10 w-full flex justify-around px-2 my-6">
          {/* Canal A */}
          <div
            onClick={() => setSelectedNode('canal_a')}
            className={`group cursor-pointer rounded-xl border transition-all p-3 w-56 text-center shadow-lg ${
              selectedNode === 'canal_a'
                ? 'bg-gradient-to-b from-[#102454] to-[#0c183a] border-cyan-400 ring-2 ring-cyan-400/30'
                : 'bg-[#0e1a38] border-cyan-900/40 hover:border-cyan-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-cyan-300">CANAL A (North)</span>
              <span className="text-[10px] text-slate-400">Eff. 94%</span>
            </div>
            <div className="text-left text-xs space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Discharge:</span>
                <span className="font-semibold text-white tabular-nums">{canalAFlow} ML</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity:</span>
                <span className="font-semibold text-slate-300 tabular-nums">{canalACap} ML</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#081023] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  canalAPct > 95 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${canalAPct}%` }}
              />
            </div>
          </div>

          {/* Canal B */}
          <div
            onClick={() => setSelectedNode('canal_b')}
            className={`group cursor-pointer rounded-xl border transition-all p-3 w-56 text-center shadow-lg ${
              selectedNode === 'canal_b'
                ? 'bg-gradient-to-b from-[#102454] to-[#0c183a] border-cyan-400 ring-2 ring-cyan-400/30'
                : 'bg-[#0e1a38] border-cyan-900/40 hover:border-cyan-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-blue-300">CANAL B (South)</span>
              <span className="text-[10px] text-slate-400">Eff. 92%</span>
            </div>
            <div className="text-left text-xs space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Discharge:</span>
                <span className="font-semibold text-white tabular-nums">{canalBFlow} ML</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity:</span>
                <span className="font-semibold text-slate-300 tabular-nums">{canalBCap} ML</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#081023] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  canalBPct > 95 ? 'bg-amber-400' : 'bg-blue-400'
                }`}
                style={{ width: `${canalBPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Level 3: Agricultural Crop Command Zones */}
        <div className="z-10 w-full flex justify-between gap-3 px-2">
          {/* Paddy */}
          <div
            onClick={() => setSelectedNode('paddy')}
            className={`flex-1 cursor-pointer rounded-xl border p-2.5 text-center transition-all shadow-md ${
              selectedNode === 'paddy'
                ? 'bg-[#102454] border-cyan-400 ring-2 ring-cyan-400/30'
                : 'bg-[#0a142e] border-cyan-900/30 hover:border-cyan-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">🌾</span>
              <span className="font-bold text-xs text-white">Paddy</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Demand:</span>
                <span className="tabular-nums">420 ML</span>
              </div>
              <div className="flex justify-between text-cyan-300 font-semibold">
                <span>Allocated:</span>
                <span className="tabular-nums">{paddyAlloc} ML</span>
              </div>
              <div className="text-emerald-400 font-bold text-[10px]">
                {Math.round((paddyAlloc / 420) * 100)}% Fulfilled
              </div>
            </div>
          </div>

          {/* Cotton */}
          <div
            onClick={() => setSelectedNode('cotton')}
            className={`flex-1 cursor-pointer rounded-xl border p-2.5 text-center transition-all shadow-md ${
              selectedNode === 'cotton'
                ? 'bg-[#102454] border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-[#0a142e] border-emerald-900/30 hover:border-emerald-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">🌿</span>
              <span className="font-bold text-xs text-white">Cotton</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Demand:</span>
                <span className="tabular-nums">350 ML</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-semibold">
                <span>Allocated:</span>
                <span className="tabular-nums">{cottonAlloc} ML</span>
              </div>
              <div className="text-emerald-400 font-bold text-[10px]">
                {Math.round((cottonAlloc / 350) * 100)}% Fulfilled
              </div>
            </div>
          </div>

          {/* Pulses */}
          <div
            onClick={() => setSelectedNode('pulses')}
            className={`flex-1 cursor-pointer rounded-xl border p-2.5 text-center transition-all shadow-md ${
              selectedNode === 'pulses'
                ? 'bg-[#102454] border-purple-400 ring-2 ring-purple-400/30'
                : 'bg-[#0a142e] border-purple-900/30 hover:border-purple-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">🌱</span>
              <span className="font-bold text-xs text-white">Pulses</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Demand:</span>
                <span className="tabular-nums">230 ML</span>
              </div>
              <div className="flex justify-between text-purple-300 font-semibold">
                <span>Allocated:</span>
                <span className="tabular-nums">{pulsesAlloc} ML</span>
              </div>
              <div className="text-emerald-400 font-bold text-[10px]">
                {Math.round((pulsesAlloc / 230) * 100)}% Fulfilled
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Context Inspector Bar */}
      <div className="mt-4 pt-3 border-t border-cyan-950/60 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {selectedNode === 'reservoir' &&
              `Reservoir state: 1,000 ML available water minus 100 ML ecological reserve = 900 ML allocatable.`}
            {selectedNode === 'canal_a' &&
              `Canal A North carries ${canalAFlow} ML to Paddy fields (Max: 600 ML, currently ${canalAPct}% capacity).`}
            {selectedNode === 'canal_b' &&
              `Canal B South distributes ${canalBFlow} ML across Cotton and Pulses (Max: 400 ML, currently ${canalBPct}% capacity).`}
            {selectedNode === 'paddy' &&
              `Paddy requires continuous ponding; allocated ${paddyAlloc} ML out of 420 ML demand.`}
            {selectedNode === 'cotton' &&
              `Cotton is drought-tolerant; allocated ${cottonAlloc} ML with optimized drip schedule.`}
            {selectedNode === 'pulses' &&
              `Pulses are nitrogen-fixing short-duration crops; allocated ${pulsesAlloc} ML.`}
          </span>
        </div>
        <span className="text-[11px] text-cyan-400 font-medium">Click any node to inspect</span>
      </div>
    </div>
  );
};
