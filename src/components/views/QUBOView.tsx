import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCode2, 
  HelpCircle, 
  Plus, 
  ArrowDown, 
  Layers, 
  Grid, 
  Info,
  Sliders,
  CheckCircle2,
  Atom,
  ArrowRight
} from 'lucide-react';

export const QUBOView: React.FC = () => {
  const { quboResult, setMathModalOpen, setActiveTab, runQuboOnly, scenario } = useApp();
  const [selectedCell, setSelectedCell] = useState<{ i: number; j: number } | null>({ i: 0, j: 0 });

  const N = quboResult.numQubits;
  const matrix = quboResult.matrix;
  const variables = quboResult.variables;

  // Find max value in matrix for heatmap scaling
  let maxAbs = 1;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (Math.abs(matrix[i][j]) > maxAbs) {
        maxAbs = Math.abs(matrix[i][j]);
      }
    }
  }

  // Get cell color based on value
  const getCellColor = (val: number, isDiag: boolean) => {
    if (isDiag) {
      // Linear term (usually negative utility or positive baseline)
      return val < 0
        ? 'bg-blue-600/60 text-blue-100 hover:bg-blue-500'
        : 'bg-indigo-600/60 text-indigo-100 hover:bg-indigo-500';
    }
    if (val === 0) return 'bg-[#091228] text-slate-600 hover:bg-[#11234a]';
    // Positive coupling penalty (shared constraint)
    const intensity = Math.min(1, Math.abs(val) / maxAbs);
    if (intensity > 0.6) return 'bg-cyan-500/70 text-cyan-100 hover:bg-cyan-400';
    if (intensity > 0.3) return 'bg-cyan-700/50 text-cyan-200 hover:bg-cyan-600';
    return 'bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800';
  };

  const selectedVal = selectedCell ? matrix[selectedCell.i][selectedCell.j] : null;
  const isDiagSelected = selectedCell ? selectedCell.i === selectedCell.j : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <FileCode2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Ising Model Formulation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            QUBO FORMULATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Converting constrained water allocation into a quadratic unconstrained binary optimization problem.
          </p>
        </div>

        <button
          onClick={() => setMathModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#0f214f] hover:bg-[#152e6e] border border-cyan-700/40 text-cyan-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>View Mathematical Formulation</span>
        </button>
      </div>

      {/* Conceptual Pipeline Diagram matching Prompt Requirement 10:
          OBJECTIVE + PENALTY FOR WATER + PENALTY FOR CANAL + PENALTY FOR LIMITS -> QUBO */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d1c3f] via-[#091530] to-[#0d1c3f] border border-cyan-900/40 p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
          Quadratic Hamiltonian Derivation Architecture
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-[#0b1736] border border-blue-500/40 text-center min-w-[140px]">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Term 1</span>
            <span className="text-xs font-extrabold text-white">AGRONOMIC OBJECTIVE</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">- ∑ w_i · x_i + Shortfall</span>
          </div>

          <span className="text-cyan-400 font-bold text-lg">+</span>

          <div className="p-3 rounded-xl bg-[#0b1736] border border-cyan-500/40 text-center min-w-[140px]">
            <span className="text-[10px] font-bold text-cyan-400 uppercase block">Term 2</span>
            <span className="text-xs font-extrabold text-white">RESERVOIR PENALTY</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">P_res · (∑ x_i - W_net)²</span>
          </div>

          <span className="text-cyan-400 font-bold text-lg">+</span>

          <div className="p-3 rounded-xl bg-[#0b1736] border border-purple-500/40 text-center min-w-[140px]">
            <span className="text-[10px] font-bold text-purple-400 uppercase block">Term 3</span>
            <span className="text-xs font-extrabold text-white">CANAL PENALTIES</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">∑ P_c · (∑ x_k - C_c)²</span>
          </div>

          <span className="text-cyan-400 font-bold text-lg">+</span>

          <div className="p-3 rounded-xl bg-[#0b1736] border border-emerald-500/40 text-center min-w-[140px]">
            <span className="text-[10px] font-bold text-emerald-400 uppercase block">Term 4</span>
            <span className="text-xs font-extrabold text-white">BOUNDARY SLACKS</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">x_i ∈ [Min_i, Max_i]</span>
          </div>

          <div className="flex items-center gap-2 pl-2">
            <span className="text-cyan-400 font-extrabold text-xl">➔</span>
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white text-center font-black text-sm px-5 shadow-lg shadow-cyan-900/50">
              QUBO MATRIX (Q)
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Qubits (Variables)</span>
          <p className="text-xl font-extrabold text-white tabular-nums mt-0.5">
            {quboResult.numQubits} Qubits
          </p>
          <span className="text-[10px] text-cyan-400">Binary decision bits</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold">QUBO Matrix Size</span>
          <p className="text-xl font-extrabold text-white tabular-nums mt-0.5">
            {N} × {N} ({N * N} entries)
          </p>
          <span className="text-[10px] text-cyan-400">Symmetric upper triangle</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Penalty Multipliers</span>
          <p className="text-base font-bold text-white tabular-nums mt-0.5">
            P_res: {scenario.penalties.reservoirLimitPenalty} | P_c: {scenario.penalties.canalCapacityPenalty}
          </p>
          <span className="text-[10px] text-cyan-400">Inequality multipliers</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1733]/90 border border-cyan-900/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Hilbert State Space</span>
          <p className="text-xl font-extrabold text-white tabular-nums mt-0.5">
            {1 << N} States
          </p>
          <span className="text-[10px] text-emerald-400">2^{N} superposition states</span>
        </div>
      </div>

      {/* Main QUBO Heatmap Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Matrix */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Interactive QUBO Matrix Heatmap (Q_ij)</h3>
              <p className="text-xs text-slate-400">Click any matrix cell to inspect linear bias or physical coupling penalty</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                Diagonal (Linear)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
                Coupling (Penalty)
              </span>
            </div>
          </div>

          {/* Matrix Grid Canvas */}
          <div className="overflow-x-auto pb-2">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-[10px] text-slate-500 font-mono">Q_ij</th>
                  {variables.map((v, colIdx) => (
                    <th key={colIdx} className="p-1.5 text-center">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                        q_{colIdx}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="p-1.5 text-right">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 block pr-1">
                        q_{rowIdx}
                      </span>
                    </td>
                    {row.map((val, colIdx) => {
                      const isSelected = selectedCell?.i === rowIdx && selectedCell?.j === colIdx;
                      const isDiag = rowIdx === colIdx;

                      return (
                        <td key={colIdx} className="p-1">
                          <button
                            onClick={() => setSelectedCell({ i: rowIdx, j: colIdx })}
                            className={`w-11 h-10 sm:w-13 sm:h-11 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${getCellColor(
                              val,
                              isDiag
                            )} ${
                              isSelected
                                ? 'ring-2 ring-white scale-105 z-10 shadow-lg'
                                : 'border border-white/5'
                            }`}
                            title={`Q[${rowIdx},${colIdx}] = ${val}`}
                          >
                            {val.toFixed(1)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Cell Inspector */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-800/40 p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Matrix Cell Inspector
                </h4>
              </div>
              {selectedCell && (
                <span className="font-mono text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">
                  Q[{selectedCell.i}, {selectedCell.j}]
                </span>
              )}
            </div>

            {selectedCell !== null ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#091228] border border-cyan-950/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Coefficient Magnitude
                  </span>
                  <p className="text-2xl font-mono font-black text-white tabular-nums mt-0.5">
                    {selectedVal?.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-cyan-400 mt-1 block">
                    {isDiagSelected ? 'Linear Diagonal Bias' : 'Quadratic Interaction Coupling'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#081023] border border-cyan-950">
                    <span className="text-[10px] text-slate-400">Row Variable:</span>
                    <p className="font-bold text-white">
                      {variables[selectedCell.i]?.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Crop: {variables[selectedCell.i]?.cropName} (+{variables[selectedCell.i]?.bitWeight} ML)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#081023] border border-cyan-950">
                    <span className="text-[10px] text-slate-400">Column Variable:</span>
                    <p className="font-bold text-white">
                      {variables[selectedCell.j]?.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Crop: {variables[selectedCell.j]?.cropName} (+{variables[selectedCell.j]?.bitWeight} ML)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#091530] border border-cyan-900/30 text-[11px] text-slate-300 space-y-1">
                  <strong className="text-cyan-300 block">Physical Meaning:</strong>
                  {isDiagSelected ? (
                    <p>
                      Represents the individual marginal utility of allocating water to {variables[selectedCell.i]?.cropName} balanced against its baseline shortfall reduction.
                    </p>
                  ) : (
                    <p>
                      Coupling penalty enforcing shared resource conservation. When both qubits turn ON, this energy penalty penalizes simultaneous overdraft from the shared reservoir or canal.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click any matrix cell above to inspect its physical meaning.</p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('qaoa')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span>Proceed to QAOA Quantum Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
