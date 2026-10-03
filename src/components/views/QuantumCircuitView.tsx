import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';

export const QuantumCircuitView: React.FC = () => {
  const { qaoaResult, quboResult, setActiveTab } = useApp();
  const [explainOpen, setExplainOpen] = useState(true);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const N = quboResult.numQubits;
  const p = qaoaResult.pLayers;
  const circuit = qaoaResult.circuitInfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Qiskit OpenQASM Gate Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Quantum Circuit Visualization
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Parameterized quantum gates implementing U_C(γ) phase separation and U_M(β) mixer transitions
          </p>
        </div>

        <button
          onClick={() => setActiveTab('measurement')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
        >
          <span>View Measurement Outcomes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Circuit Hardware Specs Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Qubits Count</span>
          <p className="text-2xl font-black text-white tabular-nums mt-0.5">{circuit.numQubits}</p>
          <span className="text-[10px] text-cyan-400 font-mono">q[0] - q[{circuit.numQubits - 1}]</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Circuit Depth</span>
          <p className="text-2xl font-black text-cyan-300 tabular-nums mt-0.5">{circuit.circuitDepth}</p>
          <span className="text-[10px] text-slate-400">Critical gate layers</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Gate Count</span>
          <p className="text-2xl font-black text-purple-300 tabular-nums mt-0.5">{circuit.gateCount}</p>
          <span className="text-[10px] text-slate-400">{circuit.rzzGates} Two-Qubit Entanglers</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">QAOA Layers (p)</span>
          <p className="text-2xl font-black text-emerald-400 tabular-nums mt-0.5">{p}</p>
          <span className="text-[10px] text-slate-400">p={p} (2γ, 2β angles)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Shots Sampled</span>
          <p className="text-2xl font-black text-blue-400 tabular-nums mt-0.5">{qaoaResult.shots}</p>
          <span className="text-[10px] text-slate-400">Projective readout</span>
        </div>
      </div>

      {/* Circuit Diagram Canvas */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
          <div>
            <h3 className="text-sm font-bold text-white">Quantum Wire Schematic (OpenQASM 3.0 Standard)</h3>
            <p className="text-xs text-slate-400">Interactive gate diagram with parameterized unitary transformations</p>
          </div>

          {/* Gate Legend matching Prompt Requirement 12 */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-5 h-5 rounded bg-blue-600/80 text-white font-mono text-[10px] flex items-center justify-center font-bold">H</span>
              Hadamard
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-5 h-5 rounded bg-purple-600/80 text-white font-mono text-[9px] flex items-center justify-center font-bold">Cost</span>
              Cost U_C(γ)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-5 h-5 rounded bg-cyan-600/80 text-white font-mono text-[9px] flex items-center justify-center font-bold">Mix</span>
              Mixer U_M(β)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-5 h-5 rounded bg-emerald-600/80 text-white font-mono text-[10px] flex items-center justify-center font-bold">M</span>
              Measurement
            </span>
          </div>
        </div>

        {/* Quantum Register Wires */}
        <div className="overflow-x-auto py-2">
          <div className="min-w-[650px] space-y-3">
            {quboResult.variables.map((v, i) => (
              <div key={i} className="flex items-center gap-2 group">
                {/* Qubit Wire Header */}
                <div className="w-24 shrink-0 font-mono text-xs">
                  <span className="font-bold text-cyan-300">q[{i}]</span>
                  <span className="text-[10px] text-slate-500 block truncate" title={v.name}>
                    {v.cropName.split(' ')[0]} +{v.bitWeight}ML
                  </span>
                </div>

                {/* Circuit Track Line */}
                <div className="flex-1 flex items-center relative">
                  {/* Base Wire Line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-cyan-900/50 z-0"></div>

                  {/* Wire Gate Sequence */}
                  <div className="flex items-center gap-4 z-10 w-full justify-between pr-4">
                    {/* Stage 0: Initial state |0> */}
                    <div className="px-2 py-1 rounded bg-[#091228] border border-cyan-900/60 font-mono text-[11px] text-slate-400">
                      |0⟩
                    </div>

                    {/* Stage 1: Hadamard Gate H */}
                    <button
                      onClick={() =>
                        setSelectedGate(
                          `Hadamard Gate on q[${i}]: Creates equal superposition state (|0⟩ + |1⟩) / √2.`
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow cursor-pointer transition-all hover:scale-105"
                      title="Hadamard Gate (Superposition)"
                    >
                      H
                    </button>

                    {/* Stage 2..2p: Alternating Cost and Mixer Blocks for each layer */}
                    {Array.from({ length: p }).map((_, layerIdx) => (
                      <React.Fragment key={layerIdx}>
                        {/* Cost Hamiltonian Gate Block */}
                        <button
                          onClick={() =>
                            setSelectedGate(
                              `Cost Unitary U_C(γ_${layerIdx + 1}) on q[${i}]: Angle γ = ${
                                qaoaResult.optimalGamma[layerIdx] || 0.4
                              }. Phase shift encoding linear bias Q[${i},${i}] and entangling RZZ couplings.`
                            )
                          }
                          className="px-2.5 h-9 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow cursor-pointer transition-all hover:scale-105"
                          title={`Cost Hamiltonian layer ${layerIdx + 1}`}
                        >
                          Cost (γ_{layerIdx + 1})
                        </button>

                        {/* Mixer Hamiltonian Gate Block */}
                        <button
                          onClick={() =>
                            setSelectedGate(
                              `Mixer Unitary U_M(β_${layerIdx + 1}) on q[${i}]: Angle β = ${
                                qaoaResult.optimalBeta[layerIdx] || 0.6
                              }. Single-qubit Pauli-X rotation R_X(2β) promoting state transitions.`
                            )
                          }
                          className="px-2.5 h-9 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow cursor-pointer transition-all hover:scale-105"
                          title={`Mixer Hamiltonian layer ${layerIdx + 1}`}
                        >
                          Mix (β_{layerIdx + 1})
                        </button>
                      </React.Fragment>
                    ))}

                    {/* Stage Final: Measurement Gate */}
                    <button
                      onClick={() =>
                        setSelectedGate(
                          `Computational Measurement Gate M on q[${i}]: Collapses quantum superposition into classical bit c[${i}] ∈ {0, 1} across ${qaoaResult.shots} shots.`
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow cursor-pointer transition-all hover:scale-105"
                      title="Computational Z-basis Measurement"
                    >
                      M
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Gate Inspector Tooltip */}
        {selectedGate && (
          <div className="p-3.5 rounded-xl bg-[#091530] border border-cyan-800/50 text-xs flex items-center justify-between text-cyan-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{selectedGate}</span>
            </div>
            <button
              onClick={() => setSelectedGate(null)}
              className="text-slate-400 hover:text-white ml-2 text-[11px] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Expandable Explanation Section matching Prompt Requirement 12 */}
        <div className="pt-2 border-t border-cyan-950/60">
          <button
            onClick={() => setExplainOpen(!explainOpen)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-white uppercase tracking-wider hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>What is happening inside this circuit?</span>
            </div>
            {explainOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {explainOpen && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-3 text-xs">
              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-1">
                <span className="font-mono text-cyan-400 font-bold block">1. Superposition</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Qubits begin in equal superposition |+⟩^N via Hadamard gates, granting simultaneous access to all 256 water allocation combinations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-1">
                <span className="font-mono text-purple-400 font-bold block">2. Cost Hamiltonian</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The cost operator e^(-iγ H_C) encodes the QUBO matrix, applying phase rotations that penalize canal overdrafts and reward high-priority crops.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-1">
                <span className="font-mono text-cyan-400 font-bold block">3. Mixer Transitions</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The mixer operator e^(-iβ H_M) induces quantum tunneling across Hamming neighbors, searching candidate allocations without getting trapped in local minima.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-1">
                <span className="font-mono text-emerald-400 font-bold block">4. Measurement</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Sampling in the Z-basis collapses the wave function into discrete candidate bitstrings with constructive interference amplifying high-utility solutions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-1">
                <span className="font-mono text-blue-400 font-bold block">5. Classical Decoding</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The best feasible bitstring is decoded into Megalitre water flows and validated against canal limits to generate decision support dispatch commands.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
