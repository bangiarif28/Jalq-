import React, { useState } from 'react';
import { MapPin, Navigation, Droplets, Compass, Layers, Info } from 'lucide-react';

interface KrishnaGodavariRegionMapProps {
  className?: string;
  compact?: boolean;
}

export const KrishnaGodavariRegionMap: React.FC<KrishnaGodavariRegionMapProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className={`rounded-2xl bg-[#091530]/95 border border-cyan-900/40 p-4 sm:p-5 shadow-xl relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Glow ambient background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Region Identification */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-cyan-950/70 relative z-10">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40 shadow-sm shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/30">
                Regional Context
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Basin Model
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight mt-0.5">
              Krishna-Godavari Command Area
            </h3>
            <p className="text-xs font-semibold text-slate-300">
              Andhra Pradesh
            </p>
            <p className="text-[11px] text-cyan-300/80 italic mt-0.5">
              Primary demo region for JalQ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[10px] text-slate-400 bg-[#070f24] px-2.5 py-1.5 rounded-xl border border-cyan-950">
          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>Coordinates: ~16.5° N, 81.0° E</span>
        </div>
      </div>

      {/* Map SVG Canvas */}
      <div className="relative my-3 w-full bg-[#050b18] rounded-xl border border-cyan-950/80 p-2 overflow-hidden shadow-inner">
        <svg 
          viewBox="0 0 540 260" 
          className="w-full h-auto max-h-[240px] select-none"
          aria-label="Krishna-Godavari Command Area Map"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b1738" />
              <stop offset="100%" stopColor="#081024" />
            </linearGradient>

            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#061b3d" />
              <stop offset="100%" stopColor="#030c1d" />
            </linearGradient>

            <linearGradient id="commandDeltaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#065f46" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.55" />
            </linearGradient>

            <linearGradient id="godavariGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="krishnaGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>

            {/* Pattern for Command Area Croplands */}
            <pattern id="cropPattern" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 0 6 L 12 6 M 6 0 L 6 12" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.25" />
            </pattern>
          </defs>

          {/* Background Grid Lines */}
          <g stroke="#0f2147" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.6">
            <line x1="80" y1="20" x2="80" y2="240" />
            <line x1="180" y1="20" x2="180" y2="240" />
            <line x1="280" y1="20" x2="280" y2="240" />
            <line x1="380" y1="20" x2="380" y2="240" />
            <line x1="480" y1="20" x2="480" y2="240" />
            <line x1="20" y1="60" x2="520" y2="60" />
            <line x1="20" y1="120" x2="520" y2="120" />
            <line x1="20" y1="180" x2="520" y2="180" />
          </g>

          {/* Bay of Bengal (Ocean water area on right) */}
          <path
            d="M 370 20 C 390 60, 380 90, 410 130 C 430 160, 420 200, 460 250 L 530 250 L 530 20 Z"
            fill="url(#oceanGradient)"
            stroke="#0ea5e9"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />

          {/* Subtle ocean waves */}
          <path d="M 440 60 Q 455 55 470 60 T 500 60" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M 430 110 Q 445 105 460 110 T 490 110" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M 460 170 Q 475 165 490 170 T 520 170" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />

          {/* Andhra Pradesh Mainland Polygon */}
          <path
            d="M 30 50 Q 80 30, 160 30 Q 250 25, 330 20 L 370 20 C 390 60, 380 90, 410 130 C 430 160, 420 200, 460 250 L 180 250 C 130 230, 90 200, 50 180 Q 20 120, 30 50 Z"
            fill="url(#landGradient)"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />

          {/* Coastal Coastline Edge Highlight */}
          <path
            d="M 370 20 C 390 60, 380 90, 410 130 C 430 160, 420 200, 460 250"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeOpacity="0.7"
          />

          {/* Krishna-Godavari Command Area Delta Fill */}
          <path
            d="M 270 85 C 330 80, 380 95, 410 130 C 425 155, 380 185, 300 170 C 260 155, 240 120, 270 85 Z"
            fill="url(#commandDeltaGrad)"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4,2"
            className="cursor-pointer transition-opacity hover:opacity-90"
            onMouseEnter={() => setHoveredFeature('command')}
            onMouseLeave={() => setHoveredFeature(null)}
          />
          <path
            d="M 270 85 C 330 80, 380 95, 410 130 C 425 155, 380 185, 300 170 C 260 155, 240 120, 270 85 Z"
            fill="url(#cropPattern)"
            className="pointer-events-none"
          />

          {/* River 1: Godavari River Basin (North Channel) */}
          <g 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredFeature('godavari')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <path
              d="M 40 40 Q 120 45, 180 60 T 280 80 T 350 95 Q 380 100, 410 115"
              fill="none"
              stroke="#082f49"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 40 40 Q 120 45, 180 60 T 280 80 T 350 95 Q 380 100, 410 115"
              fill="none"
              stroke="url(#godavariGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Delta distributary mouths */}
            <path d="M 350 95 Q 385 105, 415 125" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 330 90 Q 360 85, 395 90" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
          </g>

          {/* River 2: Krishna River Basin (South Channel) */}
          <g 
            className="cursor-pointer"
            onMouseEnter={() => setHoveredFeature('krishna')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <path
              d="M 60 145 Q 120 150, 190 140 T 280 155 T 350 175 Q 390 185, 430 205"
              fill="none"
              stroke="#082f49"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 60 145 Q 120 150, 190 140 T 280 155 T 350 175 Q 390 185, 430 205"
              fill="none"
              stroke="url(#krishnaGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Krishna Delta distributaries */}
            <path d="M 350 175 Q 380 195, 410 220" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <path d="M 320 165 Q 360 160, 400 175" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,2" />
          </g>

          {/* Canal Feeder Links Connecting Basins to Command Zone */}
          <path
            d="M 280 80 Q 295 110, 310 130"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.75"
            strokeDasharray="4,2"
          />
          <path
            d="M 280 155 Q 295 140, 310 130"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.75"
            strokeDasharray="4,2"
          />

          {/* Barrages & Critical Hydraulic Nodes */}
          {/* 1. Rajahmundry Barrage (Godavari) */}
          <g transform="translate(340, 93)">
            <circle r="5" fill="#38bdf8" stroke="#082f49" strokeWidth="2" />
            <circle r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" className="animate-ping" />
          </g>

          {/* 2. Prakasam Barrage / Vijayawada (Krishna) */}
          <g transform="translate(290, 153)">
            <circle r="5" fill="#22d3ee" stroke="#082f49" strokeWidth="2" />
            <circle r="8" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.6" className="animate-ping" />
          </g>

          {/* 3. Command Central Hub */}
          <g transform="translate(325, 130)">
            <rect x="-4" y="-4" width="8" height="8" fill="#10b981" stroke="#052e16" strokeWidth="1.5" transform="rotate(45)" />
          </g>

          {/* Text Labels */}
          {/* Bay of Bengal label */}
          <text x="465" y="140" fill="#38bdf8" fontSize="10" fontWeight="bold" letterSpacing="1" opacity="0.75" transform="rotate(30, 465, 140)">
            BAY OF BENGAL
          </text>

          {/* Godavari Basin Label */}
          <text x="80" y="45" fill="#bae6fd" fontSize="10" fontWeight="bold">
            GODAVARI RIVER BASIN
          </text>
          <text x="348" y="83" fill="#ffffff" fontSize="9" fontWeight="600">
            Rajahmundry
          </text>

          {/* Krishna Basin Label */}
          <text x="75" y="170" fill="#bae6fd" fontSize="10" fontWeight="bold">
            KRISHNA RIVER BASIN
          </text>
          <text x="250" y="175" fill="#ffffff" fontSize="9" fontWeight="600">
            Vijayawada
          </text>

          {/* Command Area Central Label */}
          <g transform="translate(270, 125)">
            <rect x="0" y="0" width="125" height="22" rx="6" fill="#06221d" stroke="#10b981" strokeWidth="1" opacity="0.95" />
            <text x="62" y="14" fill="#34d399" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              K-G Delta Command
            </text>
          </g>

          {/* Compass Rose in Corner */}
          <g transform="translate(495, 40)">
            <circle r="12" fill="#091530" stroke="#0ea5e9" strokeWidth="0.75" />
            <path d="M 0 -9 L 2.5 0 L 0 9 L -2.5 0 Z" fill="#38bdf8" />
            <path d="M 0 -9 L 2.5 0 L 0 -1 Z" fill="#ffffff" />
            <text x="0" y="-12" fill="#bae6fd" fontSize="7" fontWeight="bold" textAnchor="middle">N</text>
          </g>
        </svg>

        {/* Hover Feature Tooltip Banner */}
        <div className="mt-1 px-2.5 py-1 rounded-lg bg-[#071228] border border-cyan-950 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>
              {hoveredFeature === 'godavari'
                ? 'Godavari Basin: Upper perennial inflows feeding Dowleswaram/Rajahmundry system'
                : hoveredFeature === 'krishna'
                ? 'Krishna Basin: Southern inflows managed via Prakasam Barrage storage'
                : hoveredFeature === 'command'
                ? 'Krishna-Godavari Command Area: Fertile dual-basin delta irrigation command'
                : 'Interactive Basin Map: Hover over rivers and command zone for hydraulic details'}
            </span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono hidden sm:inline">
            Andhra Pradesh, India
          </span>
        </div>
      </div>

      {/* Map Legend & Agricultural Context */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-slate-300">
        <div className="p-2 rounded-lg bg-[#070f24] border border-cyan-950 flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-cyan-400 shrink-0" />
          <span className="text-[11px] truncate">Godavari Basin</span>
        </div>

        <div className="p-2 rounded-lg bg-[#070f24] border border-cyan-950 flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-blue-400 shrink-0" />
          <span className="text-[11px] truncate">Krishna Basin</span>
        </div>

        <div className="p-2 rounded-lg bg-[#070f24] border border-cyan-950 flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-[11px] truncate">Command Zone</span>
        </div>

        <div className="p-2 rounded-lg bg-[#070f24] border border-cyan-950 flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-purple-400 shrink-0" />
          <span className="text-[11px] truncate">Canal Interlinks</span>
        </div>
      </div>

      {/* Agricultural Context Subtext */}
      <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/30 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The Krishna-Godavari command area in Andhra Pradesh represents one of India's most productive multi-crop delta systems. JalQ optimizes seasonal allocation between upstream reservoir storage, dual canal branches, and Basmati Paddy, Long Staple Cotton, and Pulses.
        </p>
      </div>
    </div>
  );
};
