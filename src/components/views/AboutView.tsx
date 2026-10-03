import React from 'react';
import { 
  Droplet, 
  Atom, 
  Users, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1e47] via-[#0b1738] to-[#08112b] border border-cyan-800/40 p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Droplet className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Project Brief & Vision
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            JalQ: Quantum-Powered Smart Water Allocation
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            A hybrid classical-quantum decision-support system designed to solve complex multi-crop, multi-canal water allocation under acute scarcity and strict hydraulic boundary constraints.
          </p>
        </div>
      </div>

      {/* Problem Statement & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Droplet className="w-4 h-4 text-cyan-400" />
            The Core Problem
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Limited reservoir water must be allocated among competing crop command areas subject to non-linear agronomic damage curves, canal conveyance throughput caps, minimum ecological reserves, and physical non-negativity constraints.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            During drought cycles, sub-optimal classical heuristics often lead to inequitable rationing, tail-end farm abandonment, and canal overtopping breaches.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Atom className="w-4 h-4 text-purple-400" />
            The Quantum Solution (QAOA + QUBO)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            JalQ bridges hydrology and quantum information science. We formulate the constrained allocation problem as an Ising spin Hamiltonian (QUBO) and simulate variational state evolution via the Quantum Approximate Optimization Algorithm (QAOA).
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            This creates an architecture ready to unlock polynomial quantum speedups as physical quantum computers (QPUs) scale to hundreds of noisy intermediate-scale qubits.
          </p>
        </div>
      </div>

      {/* Target Users & MVP Scope matching Requirement 23 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Users */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Target Institutional Users
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2 p-2 rounded-lg bg-[#091228] border border-cyan-950">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span><strong>State Water Resources & Irrigation Departments</strong> (Rationing schedules)</span>
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-[#091228] border border-cyan-950">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span><strong>Irrigation Planning Boards & Water Councils</strong> (Canal maintenance & releases)</span>
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-[#091228] border border-cyan-950">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span><strong>Inter-State River Basin Authorities</strong> (Cross-boundary dispute mitigation)</span>
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-[#091228] border border-cyan-950">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span><strong>Agricultural Drought Relief Taskforces</strong> (Emergency famine prevention)</span>
            </li>
          </ul>
        </div>

        {/* MVP Scope Definition */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Current Hackathon MVP Architecture
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex justify-between">
              <span>Primary Reservoir:</span>
              <strong className="text-white">1 Storage Hub (1,000 ML Available)</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex justify-between">
              <span>Conveyance Canals:</span>
              <strong className="text-white">2 Networks (Canal A: 600 ML, Canal B: 400 ML)</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex justify-between">
              <span>Monitored Crops:</span>
              <strong className="text-white">3 Crop Zones (Paddy, Cotton, Pulses)</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#091228] border border-cyan-950 flex justify-between">
              <span>Deficit Stress:</span>
              <strong className="text-amber-400">115% Total Demand vs Available Water</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid matching Requirement 23 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          Technical Stack & Algorithmic Foundation
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Quantum SDK</span>
            <p className="text-sm font-bold text-white mt-1">Qiskit (IBM Quantum)</p>
            <span className="text-[10px] text-cyan-400">OpenQASM 3.0 Standard</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Quantum Algorithm</span>
            <p className="text-sm font-bold text-white mt-1">QAOA (p=1 to 3)</p>
            <span className="text-[10px] text-purple-400">Variational Ansatz</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Mathematical Model</span>
            <p className="text-sm font-bold text-white mt-1">QUBO / Ising Spin</p>
            <span className="text-[10px] text-emerald-400">Quadratic Penalties</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Classical Solver</span>
            <p className="text-sm font-bold text-white mt-1">Active-Set SQP</p>
            <span className="text-[10px] text-blue-400">Projected Gradient</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Frontend Engine</span>
            <p className="text-sm font-bold text-white mt-1">React 19 & TypeScript</p>
            <span className="text-[10px] text-cyan-400">Vite + ESNext</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Visual Design</span>
            <p className="text-sm font-bold text-white mt-1">Tailwind CSS</p>
            <span className="text-[10px] text-cyan-400">Deep Navy Enterprise</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Simulator Engine</span>
            <p className="text-sm font-bold text-white mt-1">Statevector Engine</p>
            <span className="text-[10px] text-emerald-400">2^N Complex Amplitudes</span>
          </div>

          <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Runtime Platform</span>
            <p className="text-sm font-bold text-white mt-1">Node.js / Web Client</p>
            <span className="text-[10px] text-cyan-400">Responsive Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
