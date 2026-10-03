import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Play, 
  Cpu, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { PipelineStage } from '../../types';

export const LivePipelineWidget: React.FC = () => {
  const { pipelineStage, isOptimizing, runFullPipeline, qaoaResult } = useApp();

  const stages: Array<{
    id: PipelineStage;
    label: string;
    sublabel: string;
  }> = [
    { id: 'scenario_loaded', label: 'Scenario Loaded', sublabel: 'Hydrological inputs active' },
    { id: 'classical_baseline', label: 'Classical Baseline', sublabel: 'Non-linear SQP solved' },
    { id: 'qubo_generated', label: 'QUBO Generated', sublabel: 'Ising Hamiltonian built' },
    { id: 'qaoa_running', label: 'QAOA Running', sublabel: 'Parameterized circuit evolution' },
    { id: 'measurement_complete', label: 'Measurement Complete', sublabel: `${qaoaResult.shots} shots sampled` },
    { id: 'solution_validated', label: 'Solution Validated', sublabel: '0 constraint violations' },
    { id: 'allocation_generated', label: 'Final Allocation', sublabel: 'Decision support dispatched' },
  ];

  // Helper to determine stage status
  const getStageStatus = (stageId: PipelineStage) => {
    const stageOrder: PipelineStage[] = [
      'idle',
      'scenario_loaded',
      'classical_baseline',
      'qubo_generated',
      'qaoa_running',
      'measurement_complete',
      'solution_validated',
      'allocation_generated',
    ];

    const currentIndex = stageOrder.indexOf(pipelineStage);
    const targetIndex = stageOrder.indexOf(stageId);

    if (pipelineStage === 'allocation_generated') return 'completed';
    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return isOptimizing ? 'running' : 'completed';
    return 'pending';
  };

  return (
    <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Optimization Pipeline Execution
            </h3>
            <p className="text-xs text-slate-400">
              End-to-end hybrid classical-quantum solver state progression
            </p>
          </div>
        </div>

        <button
          onClick={runFullPipeline}
          disabled={isOptimizing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Horizontal / Wrapped Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((st, index) => {
          const status = getStageStatus(st.id);
          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                status === 'completed'
                  ? 'bg-[#091530] border-emerald-800/40'
                  : status === 'running'
                  ? 'bg-[#102454] border-cyan-400 ring-2 ring-cyan-400/20 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#091024] border-cyan-950/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-500">0{index + 1}</span>
                {status === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {status === 'running' && (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                )}
                {status === 'pending' && (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{st.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  {st.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
