import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Atom, 
  Scale, 
  FileText, 
  User, 
  PlusCircle, 
  Play, 
  SlidersHorizontal,
  ChevronRight 
} from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const { 
    setActiveTab, 
    runClassicalOnly, 
    runQaoaOnly, 
    scenario, 
    classicalSolution, 
    qaoaResult 
  } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Activity Log */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Optimization Log
              </h4>
              <p className="text-[11px] text-slate-400">Auditable telemetry of solver runs</p>
            </div>
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">Real-time</span>
        </div>

        <div className="space-y-2.5 my-2">
          {/* Item 1 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#081126] border border-cyan-950/60">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0 mt-0.5">
              <Atom className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Quantum optimization executed</span>
                <span className="text-[10px] text-slate-500">Just now</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Score: <strong className="text-cyan-300 tabular-nums">{qaoaResult.objectiveScore}</strong> | Time: <strong className="text-slate-200 tabular-nums">{qaoaResult.executionTimeMs}ms</strong> | Shots: {qaoaResult.shots}
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#081126] border border-cyan-950/60">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Classical SQP baseline solved</span>
                <span className="text-[10px] text-slate-500">{classicalSolution.timestamp || 'Active'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Score: <strong className="text-blue-300 tabular-nums">{classicalSolution.objectiveScore}</strong> | Time: <strong className="text-slate-200 tabular-nums">{classicalSolution.executionTimeMs}ms</strong> | Active-Set iterations: {classicalSolution.iterations}
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#081126] border border-cyan-950/60">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Hydrological scenario active</span>
                <span className="text-[10px] text-slate-500">Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {scenario.name} (1 Reservoir, 2 Canals, 3 Crop Zones)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('reports')}
          className="w-full mt-2 py-1.5 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>View Full Solver History & Technical Audit</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Quick Operational Commands
          </h4>
          <span className="text-[11px] text-slate-400">One-click triggers</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 my-2">
          <button
            onClick={() => setActiveTab('water_scenario')}
            className="p-3 rounded-xl bg-[#091228] hover:bg-[#0f1f45] border border-cyan-950/60 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1">
              <PlusCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Edit Scenario</span>
            </div>
            <p className="text-[11px] text-slate-400">Adjust reservoir, canal & crop bounds</p>
          </button>

          <button
            onClick={() => {
              runClassicalOnly();
              setActiveTab('classical_baseline');
            }}
            className="p-3 rounded-xl bg-[#091228] hover:bg-[#0f1f45] border border-cyan-950/60 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Run Classical</span>
            </div>
            <p className="text-[11px] text-slate-400">Execute non-linear gradient baseline</p>
          </button>

          <button
            onClick={() => {
              runQaoaOnly();
              setActiveTab('qaoa');
            }}
            className="p-3 rounded-xl bg-[#091228] hover:bg-[#0f1f45] border border-cyan-950/60 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1">
              <Atom className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Run QAOA</span>
            </div>
            <p className="text-[11px] text-slate-400">Statevector quantum evolution</p>
          </button>

          <button
            onClick={() => setActiveTab('what_if')}
            className="p-3 rounded-xl bg-[#091228] hover:bg-[#0f1f45] border border-cyan-950/60 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">What-If Scarcity</span>
            </div>
            <p className="text-[11px] text-slate-400">Interactive stress-test simulations</p>
          </button>
        </div>

        <div className="mt-2 pt-2 border-t border-cyan-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">QPU Backend Target:</span>
          <span className="text-cyan-300 font-semibold">Qiskit Aer (Local Simulated)</span>
        </div>
      </div>
    </div>
  );
};
