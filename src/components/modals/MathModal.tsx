import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, FileCode2, Layers, Binary, ShieldCheck } from 'lucide-react';

export const MathModal: React.FC = () => {
  const { mathModalOpen, setMathModalOpen, quboResult, scenario } = useApp();

  if (!mathModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#09132d] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Mathematical Model & QUBO Formulation
              </h2>
              <p className="text-xs text-slate-400">
                Rigorous derivation from continuous non-linear water allocation to Ising spin Hamiltonian
              </p>
            </div>
          </div>

          <button
            onClick={() => setMathModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: The Continuous Allocation Problem */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            01. Continuous Primal Optimization Problem
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Let x_i ≥ 0 denote the volume of water allocated to crop zone i ∈ &#123;1, ..., M&#125;. The multi-objective utility function balances agricultural yield against quadratic shortfall penalties:
          </p>
          <div className="p-4 rounded-xl bg-[#060c1e] border border-cyan-950 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
            <div>max_x &nbsp; J(x) = ∑_(i=1)^M [ w_i · x_i ] - λ_shortfall · ∑_(i=1)^M [ (D_i - x_i)² / (2 · D_i) ]</div>
            <div className="mt-2 text-slate-400">subject to:</div>
            <div className="pl-4 text-cyan-300">• Total Water Constraint: ∑_(i=1)^M x_i ≤ W_available - W_reserve</div>
            <div className="pl-4 text-cyan-300">• Canal Capacities: ∑_(i ∈ Canal_c) x_i ≤ C_c &nbsp; ∀ c ∈ &#123;A, B&#125;</div>
            <div className="pl-4 text-cyan-300">• Crop Command Bounds: Min_i ≤ x_i ≤ Max_i &nbsp; ∀ i</div>
          </div>
        </div>

        {/* Section 2: Binary Discretization */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            02. Binary Qubit Expansion
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To map continuous variables onto discrete qubits, each crop allocation is discretized from its minimum viable baseline using a binary basis:
          </p>
          <div className="p-3.5 rounded-xl bg-[#060c1e] border border-cyan-950 font-mono text-xs text-purple-200 overflow-x-auto">
            x_i = Min_i + ∑_(k=0)^(K_i - 1) [ 2^k · Δ_i · q_(i,k) ], &nbsp; q_(i,k) ∈ &#123;0, 1&#125;
          </div>
          <p className="text-xs text-slate-400">
            In our MVP model with 3 crops, this yields exactly <strong>N = {quboResult.numQubits} binary qubits</strong>, representing {1 << quboResult.numQubits} discrete states.
          </p>
        </div>

        {/* Section 3: Quadratic Penalty Unconstrained Transformation */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            03. Penalty Hamiltonian Derivation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Inequality constraints are incorporated via quadratic penalty terms:
          </p>
          <div className="p-3.5 rounded-xl bg-[#060c1e] border border-cyan-950 font-mono text-xs text-emerald-200 overflow-x-auto leading-relaxed">
            <div>H_cost(q) = -J(x(q)) + P_res · (∑_i x_i(q) - W_net)² + ∑_c P_c · (∑_(i ∈ c) x_i(q) - C_c)²</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Expanding the squared terms and using the binary identity q_k² = q_k yields the standard QUBO matrix formulation:
          </p>
          <div className="p-3.5 rounded-xl bg-[#060c1e] border border-cyan-950 font-mono text-xs text-cyan-300 overflow-x-auto">
            H_cost(q) = ∑_(i=0)^(N-1) Q_ii · q_i + ∑_(i &lt; j) 2 · Q_ij · q_i · q_j + Constant
          </div>
        </div>

        {/* Section 4: QAOA Quantum Circuit Evolution */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            04. QAOA Variational Statevector Evolution
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The quantum algorithm initializes an equal superposition |+⟩^(⊗N) and applies p layers of alternating unitaries:
          </p>
          <div className="p-3.5 rounded-xl bg-[#060c1e] border border-cyan-950 font-mono text-xs text-blue-200 overflow-x-auto">
            |ψ(γ, β)⟩ = ∏_(l=1)^p [ exp(-i · β_l · ∑_k X_k) · exp(-i · γ_l · H_cost) ] |+⟩^(⊗N)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The classical co-processor optimizes the parameters (γ, β) to minimize the expectation value ⟨ψ | H_cost | ψ⟩, culminating in computational Z-basis measurement.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setMathModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
