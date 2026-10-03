import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SpeedStep {
  title: string;
  tab: ActiveTab;
  secondsTarget: number;
  pitch: string;
}

const SPEED_STEPS: SpeedStep[] = [
  {
    title: 'THE WATER CRISIS (Problem)',
    tab: 'about',
    secondsTarget: 20,
    pitch: 'River basins face acute scarcity. 1,150 ML demand vs 1,000 ML supply. Manual and heuristic rationing fails tail-end farmers and breaches canal limits.',
  },
  {
    title: 'WATER SCENARIO (Inputs)',
    tab: 'water_scenario',
    secondsTarget: 20,
    pitch: 'We model the real physical network: 1 primary reservoir, 2 canals with strict discharge limits, and 3 crops with distinct agronomic priorities.',
  },
  {
    title: 'CLASSICAL BASELINE (Benchmark)',
    tab: 'classical_baseline',
    secondsTarget: 20,
    pitch: 'Active-set SQP gradient solver solves the continuous allocation in 15 ms. This establishes our benchmark for scientific credibility.',
  },
  {
    title: 'QUBO FORMULATION (Hamiltonian)',
    tab: 'qubo',
    secondsTarget: 20,
    pitch: 'We convert continuous water volume into binary qubits and expand reservoir & canal constraints into a quadratic penalty matrix Q.',
  },
  {
    title: 'QAOA PIPELINE (Ansatz)',
    tab: 'qaoa',
    secondsTarget: 20,
    pitch: 'We construct a parameterized quantum circuit with p=2 layers. Variational feedback tunes gamma and beta to find the lowest-energy state.',
  },
  {
    title: 'QUANTUM CIRCUIT (Hardware Gates)',
    tab: 'quantum_circuit',
    secondsTarget: 20,
    pitch: 'Here is the real OpenQASM circuit: Hadamards create superposition, RZZ gates entangle shared-canal crops, and measurements sample candidate solutions.',
  },
  {
    title: 'MEASUREMENT DISTRIBUTION',
    tab: 'measurement',
    secondsTarget: 20,
    pitch: 'We sample 2,048 shots on the statevector. Constructive interference amplifies the feasible low-penalty allocations.',
  },
  {
    title: 'OPTIMIZED ALLOCATION (Result)',
    tab: 'results',
    secondsTarget: 20,
    pitch: 'The decoded quantum schedule delivers 410 ML to Paddy, 340 ML to Cotton, and 220 ML to Pulses with 0 physical violations and 87% water utilization.',
  },
  {
    title: 'WHAT-IF SCARCITY (Decision Support)',
    tab: 'what_if',
    secondsTarget: 20,
    pitch: 'When drought strikes, our sensitivity sliders rebalance allocations in real-time, proving real-world resilience for irrigation boards.',
  },
];

export const ThreeMinuteDemoModal: React.FC = () => {
  const { threeMinuteDemoOpen, setThreeMinuteDemoOpen, setActiveTab, qaoaResult, scenario } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const cur = SPEED_STEPS[currentIdx];

  const pitchText = cur.title.includes('OPTIMIZED ALLOCATION') && qaoaResult?.cropAllocations
    ? `The decoded quantum schedule delivers ${scenario.crops
        .map((c) => `${qaoaResult.cropAllocations[c.id] || c.minAllocation} ML to ${c.name.split(' ')[0]}`)
        .join(', ')} with ${qaoaResult.constraintViolations} physical violations and ${qaoaResult.waterUtilization}% water utilization.`
    : cur.pitch;

  // Navigate tab
  useEffect(() => {
    if (threeMinuteDemoOpen) {
      setActiveTab(cur.tab);
    }
  }, [currentIdx, threeMinuteDemoOpen]);

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (threeMinuteDemoOpen && isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [threeMinuteDemoOpen, isTimerRunning]);

  if (!threeMinuteDemoOpen) return null;

  const totalAllowed = 180; // 3 minutes = 180s
  const remaining = Math.max(0, totalAllowed - elapsedSeconds);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-md">
      <div className="rounded-2xl bg-[#09132d]/95 backdrop-blur-xl border-2 border-cyan-400 p-5 shadow-2xl shadow-cyan-950/90 text-white space-y-3">
        {/* Header with 3-minute stopwatch */}
        <div className="flex items-center justify-between border-b border-cyan-950/80 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
                3-Minute Pitch Presentation Mode
              </h3>
              <p className="text-[11px] text-slate-300">
                Stage {currentIdx + 1} of {SPEED_STEPS.length}: {cur.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 tabular-nums">
              <span>{formatTime(remaining)} left</span>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => setThreeMinuteDemoOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Presenter Pitch Cue */}
        <div className="p-3 rounded-xl bg-[#070e24] border border-cyan-950 text-xs text-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
            What to say to Judges right now:
          </span>
          <p className="leading-relaxed font-medium">"{pitchText}"</p>
        </div>

        {/* Stepper Progress */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-[#081023] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / SPEED_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Skip / Next Controls matching Requirement 21 */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
            className="px-3 py-1.5 rounded-lg bg-[#0e1d42] hover:bg-[#14295d] disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              if (currentIdx < SPEED_STEPS.length - 1) {
                setCurrentIdx((p) => p + 1);
              } else {
                setThreeMinuteDemoOpen(false);
              }
            }}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-950"
          >
            <span>{currentIdx === SPEED_STEPS.length - 1 ? 'Wrap Up Pitch' : 'Next Pitch Section'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
