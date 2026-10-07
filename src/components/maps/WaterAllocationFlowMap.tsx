import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Waves, 
  Droplet, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Info,
  Sliders,
  Scale,
  Atom
} from 'lucide-react';

interface WaterAllocationFlowMapProps {
  className?: string;
}

export const WaterAllocationFlowMap: React.FC<WaterAllocationFlowMapProps> = ({ 
  className = '' 
}) => {
  const { scenario, qaoaResult, classicalSolution, hasRunOptimization } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'qaoa' | 'milp'>('qaoa');

  // Dynamically select solution based on toggle (defaults to QAOA quantum dispatched allocation)
  const isQaoa = selectedMethod === 'qaoa';
  const activeAllocations = isQaoa ? qaoaResult.cropAllocations : classicalSolution.cropAllocations;
  const activeCanalFlows = isQaoa ? qaoaResult.canalFlows : classicalSolution.canalFlows;
  const activeTotal = isQaoa ? qaoaResult.totalAllocated : classicalSolution.totalAllocated;
  const activeUtilization = isQaoa ? qaoaResult.waterUtilization : classicalSolution.waterUtilization;
  const activeViolations = isQaoa ? qaoaResult.constraintViolations : classicalSolution.constraintViolations;

  // Crops data from actual scenario
  const paddyCrop = scenario.crops.find((c) => c.id === 'paddy' || /paddy|rice/i.test(c.name)) || scenario.crops[0];
  const cottonCrop = scenario.crops.find((c) => c.id === 'cotton' || /cotton/i.test(c.name)) || scenario.crops[1];
  const pulsesCrop = scenario.crops.find((c) => c.id === 'pulses' || /pulse/i.test(c.name)) || scenario.crops[2];

  // Actual Megalitre allocations
  const paddyAlloc = activeAllocations[paddyCrop?.id || 'paddy'] ?? paddyCrop?.minAllocation ?? 0;
  const cottonAlloc = activeAllocations[cottonCrop?.id || 'cotton'] ?? cottonCrop?.minAllocation ?? 0;
  const pulsesAlloc = activeAllocations[pulsesCrop?.id || 'pulses'] ?? pulsesCrop?.minAllocation ?? 0;

  // Canals data
  const canalA = scenario.canals.find((c) => c.id === 'canal_a') || scenario.canals[0];
  const canalB = scenario.canals.find((c) => c.id === 'canal_b') || scenario.canals[1];

  const canalAFlow = activeCanalFlows[canalA?.id || 'canal_a'] ?? paddyAlloc;
  const canalBFlow = activeCanalFlows[canalB?.id || 'canal_b'] ?? (cottonAlloc + pulsesAlloc);

  const canalACap = canalA?.maxCapacity || 600;
  const canalBCap = canalB?.maxCapacity || 400;

  const canalAPct = Math.min(100, Math.round((canalAFlow / canalACap) * 100));
  const canalBPct = Math.min(100, Math.round((canalBFlow / canalBCap) * 100));

  // Reservoir
  const resCap = scenario.reservoir.availableWater;
  const resReserve = scenario.reservoir.minReserve;
  const resUsed = activeTotal;
  const resRemaining = Math.max(0, resCap - resUsed);

  // Demand satisfactions
  const paddySat = Math.round((paddyAlloc / (paddyCrop?.demand || 1)) * 100);
  const cottonSat = Math.round((cottonAlloc / (cottonCrop?.demand || 1)) * 100);
  const pulsesSat = Math.round((pulsesAlloc / (pulsesCrop?.demand || 1)) * 100);

  return (
    <div className={`rounded-2xl bg-[#0d1733]/90 border border-cyan-900/40 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Glow ambient background */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-950/70 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40 shadow-sm shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/30">
                Hydraulic Flow Architecture
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Discharge Schedule
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">
              JalQ Water Allocation Map
            </h3>
            <p className="text-xs text-slate-300">
              Current MVP: Reservoir → Dual Canals → 3 Crop Command Zones (Krishna-Godavari)
            </p>
          </div>
        </div>

        {/* Solver Selector Toggle */}
        <div className="flex items-center gap-1.5 bg-[#070f24] p-1 rounded-xl border border-cyan-950 self-start sm:self-auto">
          <button
            onClick={() => setSelectedMethod('qaoa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isQaoa
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>QAOA Quantum Flow</span>
          </button>
          <button
            onClick={() => setSelectedMethod('milp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isQaoa
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>MILP Reference</span>
          </button>
        </div>
      </div>

      {/* SVG Spatial Hydraulic Network Diagram */}
      <div className="relative my-4 w-full bg-[#050b18] rounded-xl border border-cyan-950/80 p-3 overflow-hidden shadow-inner">
        <svg 
          viewBox="0 0 740 310" 
          className="w-full h-auto select-none"
          aria-label="JalQ Hydraulic Water Allocation Flow"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="flowResGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="flowCanalAGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="flowCanalBGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <linearGradient id="paddyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="cottonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            <linearGradient id="pulsesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <g stroke="#0f2147" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4">
            <line x1="200" y1="10" x2="200" y2="300" />
            <line x1="450" y1="10" x2="450" y2="300" />
            <line x1="10" y1="155" x2="730" y2="155" />
          </g>

          {/* FLOW CONDUIT 1: Reservoir -> Canal A (North) -> Paddy Zone */}
          <path
            d="M 170 155 C 240 155, 270 80, 360 80"
            fill="none"
            stroke="#082f49"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 170 155 C 240 155, 270 80, 360 80"
            fill="none"
            stroke="url(#flowCanalAGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Animated Water Particles along Canal A */}
          <path
            d="M 170 155 C 240 155, 270 80, 360 80"
            fill="none"
            stroke="#67e8f9"
            strokeWidth="2.5"
            strokeDasharray="6,12"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* From Canal A Gate to Paddy Zone */}
          <path
            d="M 460 80 L 540 80"
            fill="none"
            stroke="#082f49"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 460 80 L 540 80"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* FLOW CONDUIT 2: Reservoir -> Canal B (South) */}
          <path
            d="M 170 155 C 240 155, 270 230, 360 230"
            fill="none"
            stroke="#082f49"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 170 155 C 240 155, 270 230, 360 230"
            fill="none"
            stroke="url(#flowCanalBGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Animated Water Particles along Canal B */}
          <path
            d="M 170 155 C 240 155, 270 230, 360 230"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2.5"
            strokeDasharray="6,12"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* From Canal B Gate to Cotton Zone (Branch 1) */}
          <path
            d="M 460 230 C 490 230, 510 185, 540 185"
            fill="none"
            stroke="#082f49"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 460 230 C 490 230, 510 185, 540 185"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* From Canal B Gate to Pulses Zone (Branch 2) */}
          <path
            d="M 460 230 C 490 230, 510 265, 540 265"
            fill="none"
            stroke="#082f49"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 460 230 C 490 230, 510 265, 540 265"
            fill="none"
            stroke="#d97706"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* ========================================================= */}
          {/* NODE 1: UPSTREAM RESERVOIR                               */}
          {/* ========================================================= */}
          <g transform="translate(30, 95)">
            <rect
              x="0"
              y="0"
              width="140"
              height="120"
              rx="14"
              fill="#091b3e"
              stroke="#0284c7"
              strokeWidth="2"
              filter="url(#glowEffect)"
            />
            {/* Water Fill Fill Ratio */}
            <rect
              x="3"
              y={117 - Math.round((activeTotal / resCap) * 114)}
              width="134"
              height={Math.round((activeTotal / resCap) * 114)}
              rx="11"
              fill="url(#flowResGrad)"
              opacity="0.35"
            />
            {/* Header */}
            <text x="12" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" letterSpacing="0.5">
              PRIMARY RESERVOIR
            </text>
            <text x="12" y="38" fill="#ffffff" fontSize="11" fontWeight="extrabold">
              {scenario.reservoir.name.split(' ')[0]} Storage
            </text>

            {/* Metrics */}
            <line x1="12" y1="46" x2="128" y2="46" stroke="#0369a1" strokeWidth="0.75" />
            <text x="12" y="60" fill="#94a3b8" fontSize="9">Total Storage:</text>
            <text x="128" y="60" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {resCap} ML
            </text>

            <text x="12" y="76" fill="#94a3b8" fontSize="9">Dispatched:</text>
            <text x="128" y="76" fill="#38bdf8" fontSize="10.5" fontWeight="black" textAnchor="end">
              {activeTotal} ML
            </text>

            <text x="12" y="92" fill="#94a3b8" fontSize="9">Safe Reserve:</text>
            <text x="128" y="92" fill="#34d399" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {resRemaining} ML
            </text>

            <rect x="12" y="100" width="116" height="5" rx="2.5" fill="#06122c" />
            <rect x="12" y="100" width={Math.min(116, Math.round((activeTotal / resCap) * 116))} height="5" rx="2.5" fill="#38bdf8" />
          </g>

          {/* ========================================================= */}
          {/* NODE 2A: CANAL A (NORTH BRANCH)                           */}
          {/* ========================================================= */}
          <g transform="translate(300, 35)">
            <rect
              x="0"
              y="0"
              width="155"
              height="90"
              rx="12"
              fill="#08183a"
              stroke="#06b6d4"
              strokeWidth="1.5"
            />
            <text x="12" y="22" fill="#67e8f9" fontSize="9.5" fontWeight="bold">
              CANAL A (NORTH BRANCH)
            </text>
            <text x="12" y="36" fill="#ffffff" fontSize="11" fontWeight="extrabold">
              Discharge: {canalAFlow} ML
            </text>
            <line x1="12" y1="44" x2="143" y2="44" stroke="#0e7490" strokeWidth="0.75" />

            <text x="12" y="58" fill="#94a3b8" fontSize="8.5">Capacity:</text>
            <text x="143" y="58" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="end">
              {canalACap} ML max
            </text>

            <text x="12" y="72" fill="#94a3b8" fontSize="8.5">Utilization:</text>
            <text x="143" y="72" fill={canalAPct <= 100 ? '#34d399' : '#f87171'} fontSize="9" fontWeight="bold" textAnchor="end">
              {canalAPct}% ({canalAPct <= 100 ? 'Within Bound' : 'Over Limit'})
            </text>

            {/* Canal A Gate flow bar */}
            <rect x="12" y="78" width="131" height="4" rx="2" fill="#042f2e" />
            <rect x="12" y="78" width={Math.min(131, Math.round((canalAFlow / canalACap) * 131))} height="4" rx="2" fill="#06b6d4" />
          </g>

          {/* ========================================================= */}
          {/* NODE 2B: CANAL B (SOUTH BRANCH)                           */}
          {/* ========================================================= */}
          <g transform="translate(300, 185)">
            <rect
              x="0"
              y="0"
              width="155"
              height="90"
              rx="12"
              fill="#08183a"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            <text x="12" y="22" fill="#93c5fd" fontSize="9.5" fontWeight="bold">
              CANAL B (SOUTH BRANCH)
            </text>
            <text x="12" y="36" fill="#ffffff" fontSize="11" fontWeight="extrabold">
              Discharge: {canalBFlow} ML
            </text>
            <line x1="12" y1="44" x2="143" y2="44" stroke="#1d4ed8" strokeWidth="0.75" />

            <text x="12" y="58" fill="#94a3b8" fontSize="8.5">Capacity:</text>
            <text x="143" y="58" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="end">
              {canalBCap} ML max
            </text>

            <text x="12" y="72" fill="#94a3b8" fontSize="8.5">Utilization:</text>
            <text x="143" y="72" fill={canalBPct <= 100 ? '#34d399' : '#f87171'} fontSize="9" fontWeight="bold" textAnchor="end">
              {canalBPct}% ({canalBPct <= 100 ? 'Within Bound' : 'Over Limit'})
            </text>

            {/* Canal B Gate flow bar */}
            <rect x="12" y="78" width="131" height="4" rx="2" fill="#1e293b" />
            <rect x="12" y="78" width={Math.min(131, Math.round((canalBFlow / canalBCap) * 131))} height="4" rx="2" fill="#3b82f6" />
          </g>

          {/* ========================================================= */}
          {/* NODE 3A: PADDY ZONE (RECEIVES FROM CANAL A)               */}
          {/* ========================================================= */}
          <g transform="translate(545, 40)">
            <rect
              x="0"
              y="0"
              width="165"
              height="80"
              rx="12"
              fill="#06251c"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <text x="12" y="20" fill="#34d399" fontSize="9" fontWeight="bold">
              CROP ZONE 1 (CANAL A)
            </text>
            <text x="12" y="35" fill="#ffffff" fontSize="11" fontWeight="extrabold">
              🌾 {paddyCrop?.name || 'Paddy (Basmati)'}
            </text>
            <line x1="12" y1="42" x2="153" y2="42" stroke="#064e3b" strokeWidth="0.75" />

            <text x="12" y="56" fill="#94a3b8" fontSize="8.5">Allocated / Demand:</text>
            <text x="153" y="56" fill="#6ee7b7" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {paddyAlloc} / {paddyCrop?.demand || 420} ML
            </text>

            <text x="12" y="70" fill="#94a3b8" fontSize="8.5">Demand Met:</text>
            <text x="153" y="70" fill="#34d399" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {paddySat}% ({paddyAlloc} ML)
            </text>
          </g>

          {/* ========================================================= */}
          {/* NODE 3B: COTTON ZONE (RECEIVES FROM CANAL B)              */}
          {/* ========================================================= */}
          <g transform="translate(545, 145)">
            <rect
              x="0"
              y="0"
              width="165"
              height="75"
              rx="12"
              fill="#081e3d"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />
            <text x="12" y="19" fill="#93c5fd" fontSize="9" fontWeight="bold">
              CROP ZONE 2 (CANAL B)
            </text>
            <text x="12" y="33" fill="#ffffff" fontSize="11" fontWeight="extrabold">
              🌱 {cottonCrop?.name || 'Cotton (Long Staple)'}
            </text>
            <line x1="12" y1="40" x2="153" y2="40" stroke="#1e3a8a" strokeWidth="0.75" />

            <text x="12" y="53" fill="#94a3b8" fontSize="8.5">Allocated / Demand:</text>
            <text x="153" y="53" fill="#93c5fd" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {cottonAlloc} / {cottonCrop?.demand || 350} ML
            </text>

            <text x="12" y="66" fill="#94a3b8" fontSize="8.5">Demand Met:</text>
            <text x="153" y="66" fill="#60a5fa" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {cottonSat}% ({cottonAlloc} ML)
            </text>
          </g>

          {/* ========================================================= */}
          {/* NODE 3C: PULSES ZONE (RECEIVES FROM CANAL B)              */}
          {/* ========================================================= */}
          <g transform="translate(545, 227)">
            <rect
              x="0"
              y="0"
              width="165"
              height="75"
              rx="12"
              fill="#251605"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text x="12" y="19" fill="#fcd34d" fontSize="9" fontWeight="bold">
              CROP ZONE 3 (CANAL B)
            </text>
            <text x="12" y="33" fill="#ffffff" fontSize="11" fontWeight="extrabold">
              🌿 {pulsesCrop?.name || 'Pulses (Chickpea/Lentil)'}
            </text>
            <line x1="12" y1="40" x2="153" y2="40" stroke="#78350f" strokeWidth="0.75" />

            <text x="12" y="53" fill="#94a3b8" fontSize="8.5">Allocated / Demand:</text>
            <text x="153" y="53" fill="#fcd34d" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {pulsesAlloc} / {pulsesCrop?.demand || 230} ML
            </text>

            <text x="12" y="66" fill="#94a3b8" fontSize="8.5">Demand Met:</text>
            <text x="153" y="66" fill="#f59e0b" fontSize="9.5" fontWeight="bold" textAnchor="end">
              {pulsesSat}% ({pulsesAlloc} ML)
            </text>
          </g>

          {/* Flow Direction Chevron Arrows */}
          {/* Upper Branch */}
          <path d="M 230 115 L 235 110 L 230 105" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
          <path d="M 500 80 L 506 76 L 500 72" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />

          {/* Lower Branch */}
          <path d="M 230 195 L 235 200 L 230 205" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
          <path d="M 500 207 L 506 203 L 500 199" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
          <path d="M 500 248 L 506 252 L 500 256" fill="none" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Summary KPI Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-[#070f24] border border-cyan-950">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reservoir Storage</span>
          <span className="text-sm font-bold text-white tabular-nums">{resCap} ML Available</span>
          <span className="text-[10px] text-cyan-400 block mt-0.5">{activeTotal} ML discharged ({activeUtilization}%)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#070f24] border border-cyan-950">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Canal A (North)</span>
          <span className="text-sm font-bold text-cyan-300 tabular-nums">{canalAFlow} ML / {canalACap} ML</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Feeds Paddy ({paddyAlloc} ML)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#070f24] border border-cyan-950">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Canal B (South)</span>
          <span className="text-sm font-bold text-blue-300 tabular-nums">{canalBFlow} ML / {canalBCap} ML</span>
          <span className="text-[10px] text-slate-300 block mt-0.5">Feeds Cotton & Pulses</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#070f24] border border-cyan-950">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Solution Invariant</span>
          <span className="text-sm font-bold text-emerald-400 tabular-nums">
            {activeViolations === 0 ? '✓ 0 Violations (Feasible)' : `${activeViolations} Violations`}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Active Mode: <strong className="text-white">{isQaoa ? 'QAOA Quantum' : 'MILP Simplex'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
