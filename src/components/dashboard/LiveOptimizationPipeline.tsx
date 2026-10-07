import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  ArrowDown, 
  Play, 
  RefreshCw,
  Waves,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { StageStatus } from '../../types';

export const LiveOptimizationPipeline: React.FC = () => {
  const { workflowState, runCompleteOptimization, setLiveOptimizationOpen, hasRunOptimization } = useApp();
  const { stages, isOptimizing, overallStatus, currentStageIndex } = workflowState;

  const getStatusBadge = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete</span>
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Running</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warning</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
            <X className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
      case 'waiting':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
            <Circle className="w-3.5 h-3.5" />
            <span>Waiting</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/40 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              JalQ Complete Optimization Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential hybrid classical-quantum solver progression: Water Scenario → Validation → Classical Baseline → QUBO Formulation → QAOA → Measurement → Feasibility Check → Final Allocation → Classical Comparison
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveOptimizationOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0a1532] hover:bg-[#10224d] border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Live Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runCompleteOptimization}
            disabled={isOptimizing}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶ Run Complete Optimization</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 9-Stage Visual Grid with Connected Cards matching Requirement 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 sm:gap-2.5">
        {stages.map((st, idx) => {
          const isCurrent = isOptimizing && currentStageIndex === idx;

          return (
            <div
              key={st.id}
              onClick={() => setLiveOptimizationOpen(true)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                st.status === 'running'
                  ? 'bg-[#102454] border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20'
                  : st.status === 'completed'
                  ? 'bg-[#0a1532] border-emerald-900/40 hover:border-cyan-700/60'
                  : 'bg-[#080f24] border-slate-800/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  {getStatusBadge(st.status)}
                </div>
                <h5 className="text-[11px] font-bold text-white leading-tight">
                  {st.name}
                </h5>
              </div>

              <div className="mt-2 pt-1 border-t border-white/5">
                <span className="text-[9px] text-slate-400 line-clamp-1">
                  {st.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Data Flow Visualization matching Requirement 17:
          RESERVOIR → WATER DATA → OPTIMIZATION ENGINE → [CLASSICAL SOLVER] + [QUBO + QAOA] → QUANTUM MEASUREMENT → VALIDATION → CROP ALLOCATION */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#070e24] via-[#091530] to-[#070e24] border border-cyan-950/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Live Data Conveyance Flow
            </span>
          </div>
          {isOptimizing ? (
            <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Optimization Data In-Flight
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-mono">
              Status: {hasRunOptimization ? 'Optimal Allocations Locked' : 'Waiting to Run'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-slate-300 pt-1">
          <span className="px-2.5 py-1 rounded-lg bg-[#0c183a] border border-cyan-900/40 text-cyan-200">
            🌊 RESERVOIR
          </span>
          <ArrowRight className={`w-3.5 h-3.5 ${isOptimizing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
          <span className="px-2.5 py-1 rounded-lg bg-[#0c183a] border border-cyan-900/40 text-cyan-200">
            💧 WATER DATA
          </span>
          <ArrowRight className={`w-3.5 h-3.5 ${isOptimizing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
          <span className="px-2.5 py-1 rounded-lg bg-[#0c183a] border border-cyan-900/40 text-cyan-200">
            ⚙️ OPTIMIZATION ENGINE
          </span>
          <ArrowRight className={`w-3.5 h-3.5 ${isOptimizing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#102454] border border-cyan-500/40 text-cyan-300 shadow">
            <span>⚖️ SQP</span>
            <span className="text-slate-500">+</span>
            <span>⚛️ QAOA</span>
          </div>
          <ArrowRight className={`w-3.5 h-3.5 ${isOptimizing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
          <span className="px-2.5 py-1 rounded-lg bg-[#0c183a] border border-cyan-900/40 text-purple-200">
            📊 MEASUREMENT
          </span>
          <ArrowRight className={`w-3.5 h-3.5 ${isOptimizing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
          <span className="px-2.5 py-1 rounded-lg bg-[#0c183a] border border-emerald-900/40 text-emerald-200">
            🛡️ VALIDATION
          </span>
          <ArrowRight className={`w-3.5 h-3.5 ${isOptimizing ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold">
            🌾 ALLOCATION
          </span>
        </div>
      </div>
    </div>
  );
};
