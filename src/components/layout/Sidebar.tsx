import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Droplet,
  Sliders,
  Scale,
  FileCode2,
  Atom,
  Cpu,
  Activity,
  CheckCircle,
  GitCompare,
  SlidersHorizontal,
  Workflow,
  TrendingUp,
  FileText,
  Info,
  Rocket,
  Play,
  Clock,
  Sparkles,
  Waves,
  RefreshCw
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'water_scenario', label: 'Water Scenario', icon: Droplet },
  { id: 'optimization', label: 'Optimization', icon: Sliders },
  { id: 'classical_baseline', label: 'Classical Baseline', icon: Scale },
  { id: 'qubo', label: 'QUBO Formulation', icon: FileCode2, tag: 'Ising' },
  { id: 'qaoa', label: 'QAOA Pipeline', icon: Atom, tag: 'Qiskit' },
  { id: 'classical_optimizer', label: 'Classical Optimizer', icon: RefreshCw, tag: 'COBYLA' },
  { id: 'quantum_circuit', label: 'Quantum Circuit', icon: Cpu },
  { id: 'measurement', label: 'Measurement', icon: Activity },
  { id: 'results', label: 'Results', icon: CheckCircle },
  { id: 'classical_comparison', label: 'Classical Comparison', icon: GitCompare },
  { id: 'what_if', label: 'What-If Scarcity', icon: SlidersHorizontal },
  { id: 'architecture', label: 'Architecture', icon: Workflow },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'about', label: 'About JalQ', icon: Info },
  { id: 'future_scope', label: 'Future Scope', icon: Rocket },
];

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setJudgeDemoOpen, 
    setThreeMinuteDemoOpen 
  } = useApp();

  return (
    <aside className="w-64 bg-[#091124] border-r border-cyan-950/40 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0 select-none overflow-y-auto">
      {/* Navigation List */}
      <div className="p-3 space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1">
          Navigation Modules
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/70 text-cyan-300 border-l-3 border-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1b3d]/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action Cards & Landscape Banner */}
      <div className="p-3 space-y-2 border-t border-cyan-950/40 bg-[#070d1d]">
        <button
          onClick={() => setJudgeDemoOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Judge Demo</span>
        </button>

        <button
          onClick={() => setThreeMinuteDemoOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-[#0e1a38] hover:bg-[#142552] border border-cyan-800/40 text-cyan-200 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Start 3-Minute Demo</span>
        </button>

        {/* Landscape Decorative Footer Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#0e1a36] to-[#070e22] border border-cyan-900/30 p-2.5 mt-2">
          {/* Subtle river/field vector illustration */}
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Waves className="w-4 h-4" />
            <span className="text-[11px] font-bold tracking-tight text-white">
              Smarter Water, Brighter Future
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Conserving every megalitre with hybrid quantum intelligence.
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[9px] text-cyan-500">
            <Sparkles className="w-3 h-3" />
            <span>Ready for Hackathon Jury</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
