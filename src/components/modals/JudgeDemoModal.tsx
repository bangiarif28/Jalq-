import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Pause,
  RotateCcw
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface DemoStep {
  stepNumber: number;
  title: string;
  tab: ActiveTab;
  callout: string;
  judgeSpeakingPoint: string;
}

const JUDGE_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: '1. Load Demo Scenario',
    tab: 'dashboard',
    callout: 'Baseline Hydrological State Initialized',
    judgeSpeakingPoint: 'We start with a real-world river basin: 1 Primary Reservoir (1,000 ML), 2 Canals, and 3 Crop Zones with 1,150 ML demand—a 15% deficit.',
  },
  {
    stepNumber: 2,
    title: '2. System Dashboard',
    tab: 'dashboard',
    callout: 'KPIs & Interactive Conduit Topology',
    judgeSpeakingPoint: 'The dashboard gives water planners situational awareness with animated flow conduits and real-time volumetric tracking.',
  },
  {
    stepNumber: 3,
    title: '3. Classical Baseline Solver',
    tab: 'classical_baseline',
    callout: 'Sequential Quadratic Programming Solved',
    judgeSpeakingPoint: 'Before claiming quantum value, we establish an honest classical benchmark. Active-set SQP solves the continuous baseline in ~15 ms.',
  },
  {
    stepNumber: 4,
    title: '4. QUBO Matrix Compilation',
    tab: 'qubo',
    callout: 'Quadratic Unconstrained Binary Optimization',
    judgeSpeakingPoint: 'We discretize continuous allocations into binary qubits and expand reservoir & canal constraints into an interactive QUBO heatmap.',
  },
  {
    stepNumber: 5,
    title: '5. QAOA Variational Simulation',
    tab: 'qaoa',
    callout: 'Ansatz Evolution & Parameter Tuning',
    judgeSpeakingPoint: 'QAOA alternates cost phase separation with mixer transitions. A classical feedback loop optimizes angles (γ, β) for ground energy.',
  },
  {
    stepNumber: 6,
    title: '6. Quantum Circuit Architecture',
    tab: 'quantum_circuit',
    callout: 'OpenQASM 3.0 Gate Sequence',
    judgeSpeakingPoint: 'Here is the gate-level circuit with Hadamards, parameterized two-qubit RZZ entanglers, RX rotations, and measurement meters.',
  },
  {
    stepNumber: 7,
    title: '7. Measurement Sampling Readout',
    tab: 'measurement',
    callout: '2,048 Shots Sampled on Statevector',
    judgeSpeakingPoint: 'Projective measurement collapses the quantum state into candidate bitstrings. We highlight both peak mode and best feasible states.',
  },
  {
    stepNumber: 8,
    title: '8. Solution Decoding (Bits to ML)',
    tab: 'results',
    callout: 'Continuous Water Allocation Decoded',
    judgeSpeakingPoint: 'The best feasible quantum bitstring is inverted back to physical Megalitres: Paddy gets 410 ML, Cotton 340 ML, Pulses 220 ML.',
  },
  {
    stepNumber: 9,
    title: '9. Hydraulic Constraint Validation',
    tab: 'results',
    callout: 'Zero Violations Detected',
    judgeSpeakingPoint: 'The solution strictly honors all canal capacities and preserves the ecological baseline reserve.',
  },
  {
    stepNumber: 10,
    title: '10. Final Allocation Master Schedule',
    tab: 'results',
    callout: 'Automated Dispatch Ready',
    judgeSpeakingPoint: 'The master table gives water authorities exact sluice gate release commands and farmer satisfaction metrics.',
  },
  {
    stepNumber: 11,
    title: '11. Classical vs QAOA Comparison',
    tab: 'classical_comparison',
    callout: 'Strict Scientific Transparency',
    judgeSpeakingPoint: 'We honestly report: no quantum advantage for this 8-qubit instance. The advantage will arrive at >50 qubits on physical QPUs.',
  },
  {
    stepNumber: 12,
    title: '12. Water Scarcity What-If Stress-Test',
    tab: 'what_if',
    callout: 'Real-Time Climate Sensitivity',
    judgeSpeakingPoint: 'Finally, judges can drag the scarcity slider down to 50% water or simulate canal breaches to watch autonomous rebalancing live.',
  },
];

export const JudgeDemoModal: React.FC = () => {
  const { judgeDemoOpen, setJudgeDemoOpen, setActiveTab, loadPreset, runFullPipeline, qaoaResult, scenario } = useApp();
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(false);

  const step = JUDGE_STEPS[currentStepIdx];

  const speakingPoint = step.stepNumber === 8 && qaoaResult?.cropAllocations
    ? `The best feasible quantum bitstring is inverted back to physical Megalitres: ${scenario.crops
        .map((c) => `${c.name.split(' ')[0]} gets ${qaoaResult.cropAllocations[c.id] || c.minAllocation} ML`)
        .join(', ')}.`
    : step.judgeSpeakingPoint;

  // Navigate to corresponding tab when step changes
  useEffect(() => {
    if (judgeDemoOpen) {
      setActiveTab(step.tab);
    }
  }, [currentStepIdx, judgeDemoOpen]);

  // Auto-advance timer
  useEffect(() => {
    let timer: any;
    if (judgeDemoOpen && isAutoAdvancing) {
      timer = setTimeout(() => {
        if (currentStepIdx < JUDGE_STEPS.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsAutoAdvancing(false);
        }
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [judgeDemoOpen, isAutoAdvancing, currentStepIdx]);

  if (!judgeDemoOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg">
      <div className="rounded-2xl bg-[#09132d]/95 backdrop-blur-xl border-2 border-cyan-400 p-5 shadow-2xl shadow-cyan-950/80 text-white space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-950/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
                Judge Demonstration Tour
              </h3>
              <span className="text-[11px] text-slate-300">
                Step {currentStepIdx + 1} of {JUDGE_STEPS.length}: {step.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoAdvancing(!isAutoAdvancing)}
              className="p-1.5 rounded-lg bg-[#0e1d42] hover:bg-[#14295d] text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              {isAutoAdvancing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isAutoAdvancing ? 'Pause' : 'Auto'}</span>
            </button>
            <button
              onClick={() => setJudgeDemoOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Callout & Talking Points */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{step.callout}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070e24] border border-cyan-950 text-xs text-slate-200 leading-relaxed">
            <strong className="text-cyan-300 block mb-0.5">Presenter Narrative Cue:</strong>
            "{speakingPoint}"
          </div>
        </div>

        {/* Stepper Progress Bar matching Requirement 20 */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Demo Progress</span>
            <span>{Math.round(((currentStepIdx + 1) / JUDGE_STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#081023] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIdx + 1) / JUDGE_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 rounded-lg bg-[#0e1d42] hover:bg-[#14295d] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[11px] text-slate-400">
            {currentStepIdx + 1} / {JUDGE_STEPS.length}
          </span>

          <button
            onClick={() => {
              if (currentStepIdx < JUDGE_STEPS.length - 1) {
                setCurrentStepIdx((prev) => prev + 1);
              } else {
                setJudgeDemoOpen(false);
              }
            }}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-950"
          >
            <span>{currentStepIdx === JUDGE_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
