import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const MeasurementView: React.FC = () => {
  const { qaoaResult, quboResult, scenario, setActiveTab } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [feasibilityFilter, setFeasibilityFilter] = useState<'all' | 'feasible' | 'infeasible'>('all');

  const shots = qaoaResult.shots;
  const probs = qaoaResult.statevectorProbabilities;
  const counts = qaoaResult.sampledCounts;
  const bestBitstring = qaoaResult.bestBitstring;
  const bestFeasible = qaoaResult.bestFeasibleBitstring;

  const capA = scenario.canals.find((c) => c.id === 'canal_a')?.maxCapacity || 600;
  const capB = scenario.canals.find((c) => c.id === 'canal_b')?.maxCapacity || 400;

  // Convert all states with non-zero probability / counts into sorted list
  const stateList = Object.entries(probs)
    .map(([bitstring, prob]) => {
      const shotCount = counts[bitstring] || 0;
      const sampledProb = shots > 0 ? shotCount / shots : prob;

      // Decode physical hydraulic allocations using actual scenario inputs
      const allocs: Record<string, number> = {};
      for (const crop of scenario.crops) {
        const v = quboResult.variables.find((item) => item.cropId === crop.id);
        allocs[crop.id] = v ? v.minBaseline : crop.minAllocation;
      }
      for (let i = 0; i < quboResult.numQubits; i++) {
        if (bitstring[i] === '1') {
          const v = quboResult.variables[i];
          if (v) {
            allocs[v.cropId] = (allocs[v.cropId] || 0) + v.bitWeight;
          }
        }
      }

      let totalAlloc = 0;
      for (const crop of scenario.crops) {
        totalAlloc += allocs[crop.id];
      }

      const canalA = scenario.crops.filter((c) => c.canalId === 'canal_a').reduce((s, c) => s + allocs[c.id], 0);
      const canalB = scenario.crops.filter((c) => c.canalId === 'canal_b').reduce((s, c) => s + allocs[c.id], 0);

      // Hydraulic feasibility checks using actual scenario limits
      const resFeasible = totalAlloc <= scenario.reservoir.availableWater;
      const canalAFeasible = canalA <= capA + 0.1;
      const canalBFeasible = canalB <= capB + 0.1;
      const cropsFeasible = scenario.crops.every((c) => allocs[c.id] <= c.maxAllocation + 0.1 && allocs[c.id] >= 0);

      const isFeasible = resFeasible && canalAFeasible && canalBFeasible && cropsFeasible;

      let feasibilityReason = 'Feasible (0 Violations)';
      if (!resFeasible) {
        feasibilityReason = `Reservoir Exceeded (${totalAlloc}/${scenario.reservoir.availableWater} ML)`;
      } else if (!canalAFeasible) {
        feasibilityReason = `Canal A Exceeded (${canalA}/${capA} ML)`;
      } else if (!canalBFeasible) {
        feasibilityReason = `Canal B Exceeded (${canalB}/${capB} ML)`;
      } else if (!cropsFeasible) {
        feasibilityReason = `Crop Allocation Limit Exceeded`;
      }

      const isSelectedSolution = bitstring === bestFeasible;
      const isMostProbable = bitstring === bestBitstring;

      let statusFlag = 'Candidate State';
      if (isSelectedSolution && isMostProbable) {
        statusFlag = '★ Best Feasible (Peak Mode)';
      } else if (isSelectedSolution) {
        statusFlag = '★ Best Feasible Solution';
      } else if (isMostProbable) {
        statusFlag = 'Peak Mode (Highest |ψ|²)';
      } else if (isFeasible) {
        statusFlag = 'Feasible Candidate';
      } else {
        statusFlag = 'Infeasible Candidate';
      }

      return {
        bitstring,
        prob,
        shotCount,
        sampledProb,
        totalAlloc,
        canalA,
        canalB,
        isFeasible,
        feasibilityReason,
        isMostProbable,
        isSelectedSolution,
        statusFlag,
      };
    })
    .sort((a, b) => b.shotCount - a.shotCount || b.prob - a.prob);

  const totalFeasibleCount = stateList.filter((s) => s.isFeasible).length;
  const totalInfeasibleCount = stateList.filter((s) => !s.isFeasible).length;

  // Filtered list for table
  const filteredStates = stateList.filter((s) => {
    const matchesQuery = s.bitstring.includes(filterQuery);
    if (!matchesQuery) return false;
    if (feasibilityFilter === 'feasible') return s.isFeasible;
    if (feasibilityFilter === 'infeasible') return !s.isFeasible;
    return true;
  });

  // Top 16 states for the large bar chart
  const topChartStates = stateList.slice(0, 16);
  const maxProb = Math.max(...topChartStates.map((s) => s.sampledProb), 0.05);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Computational Z-Basis Readout
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Quantum Measurement Probability Distribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulated projective measurement histograms across {shots.toLocaleString()} shots on Qiskit Aer statevector
          </p>
        </div>

        <button
          onClick={() => setActiveTab('results')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
        >
          <span>View Final Allocation Results</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Measurement Callouts Row matching Prompt Requirement 13 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Callout 1: Most Probable Candidate */}
        <div className="p-5 rounded-2xl bg-[#0d1733]/90 border border-purple-900/40 shadow-xl flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Most Probable Measured State
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-black text-white">
                |{bestBitstring}⟩
              </span>
              <span className="text-xs text-purple-300 font-semibold tabular-nums">
                ({((counts[bestBitstring] || 0) / shots * 100).toFixed(1)}% / {counts[bestBitstring] || 0} shots)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              State with highest constructive interference amplitude in wave function.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
            Peak Mode
          </span>
        </div>

        {/* Callout 2: Selected Best Feasible Solution */}
        <div className="p-5 rounded-2xl bg-[#0d1733]/90 border border-cyan-800/50 ring-1 ring-cyan-400/20 shadow-xl flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Selected Feasible Physical Allocation
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-black text-cyan-300">
                |{bestFeasible}⟩
              </span>
              <span className="text-xs text-emerald-300 font-semibold tabular-nums">
                ({((counts[bestFeasible] || 0) / shots * 100).toFixed(1)}% / {counts[bestFeasible] || 0} shots)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Zero constraint violations. QAOA Objective Score: <strong className="text-white tabular-nums">{qaoaResult.objectiveScore}</strong>
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
            Dispatched
          </span>
        </div>
      </div>

      {/* Large Bar Chart of Measurement Probabilities matching Requirement 13 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Top Candidate Bitstrings Histogram</h3>
            <p className="text-xs text-slate-400">Sampled frequency distribution across basis states (Top 16 of {1 << quboResult.numQubits})</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-cyan-400"></span>
              Selected Feasible
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-purple-500"></span>
              Peak Mode
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-slate-600"></span>
              Other States
            </span>
          </div>
        </div>

        {/* Bar Chart Canvas */}
        <div className="h-64 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-cyan-950/60 overflow-x-auto">
          {topChartStates.map((st) => {
            const heightPct = (st.sampledProb / maxProb) * 100;
            const isSelected = st.isSelectedSolution;
            const isPeak = st.isMostProbable;

            return (
              <div
                key={st.bitstring}
                className="flex-1 min-w-[34px] flex flex-col items-center justify-end h-full group"
              >
                {/* Tooltip on hover */}
                <span className="text-[9px] font-mono font-bold text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap">
                  {(st.sampledProb * 100).toFixed(1)}%
                </span>

                {/* Vertical Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isSelected
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-lg shadow-cyan-500/20'
                      : isPeak
                      ? 'bg-gradient-to-t from-purple-700 to-purple-400'
                      : st.isFeasible
                      ? 'bg-slate-600 hover:bg-slate-500'
                      : 'bg-red-950/60 hover:bg-red-900/60'
                  }`}
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                  title={`|${st.bitstring}⟩: ${(st.sampledProb * 100).toFixed(2)}% (${st.shotCount} shots)`}
                />

                {/* X Axis Label */}
                <span className="font-mono text-[9px] text-slate-400 mt-2 -rotate-45 origin-top-left truncate w-10">
                  {st.bitstring.slice(0, 5)}..
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Measurement Table with Filter */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Full Statevector Readout Table</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-mono">
                {totalFeasibleCount} Feasible / {totalInfeasibleCount} Infeasible
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Diagnostic verification table evaluating each quantum basis state against hydraulic reservoir and canal constraints
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Feasibility Filter Tabs */}
            <div className="flex rounded-xl bg-[#091228] p-1 border border-cyan-900/40 text-xs">
              <button
                type="button"
                onClick={() => setFeasibilityFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  feasibilityFilter === 'all'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({stateList.length})
              </button>
              <button
                type="button"
                onClick={() => setFeasibilityFilter('feasible')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  feasibilityFilter === 'feasible'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/60'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                ✓ Feasible ({totalFeasibleCount})
              </button>
              <button
                type="button"
                onClick={() => setFeasibilityFilter('infeasible')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  feasibilityFilter === 'infeasible'
                    ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800/60'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                ⚠ Infeasible ({totalInfeasibleCount})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter bitstring..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#091228] border border-cyan-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-36"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="sticky top-0 bg-[#0b1329] border-b border-cyan-950/80 text-slate-400 uppercase text-[10px] tracking-wider z-10">
              <tr>
                <th className="py-2.5 px-3">Bitstring |z⟩</th>
                <th className="py-2.5 px-3 text-right">Sampled Shots</th>
                <th className="py-2.5 px-3 text-right">Sampled Prob</th>
                <th className="py-2.5 px-3 text-right">Exact |ψ|²</th>
                <th className="py-2.5 px-3 text-center">Hydraulic Feasibility</th>
                <th className="py-2.5 px-3 text-right">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/40 font-mono">
              {filteredStates.slice(0, 50).map((st) => (
                <tr
                  key={st.bitstring}
                  className={`hover:bg-[#0e1d42]/50 transition-colors ${
                    st.isSelectedSolution
                      ? 'bg-cyan-950/40 text-cyan-200 font-bold'
                      : st.isMostProbable
                      ? 'bg-purple-950/20 text-purple-200'
                      : 'text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                    <span>|{st.bitstring}⟩</span>
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {st.shotCount}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {(st.sampledProb * 100).toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-slate-400">
                    {(st.prob * 100).toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-center">
                    {st.isFeasible ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-bold inline-flex items-center gap-1">
                        <span>✓ Feasible (0 Violations)</span>
                        <span className="text-emerald-500/80 font-normal">· {st.totalAlloc} ML</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/40 inline-flex items-center gap-1 font-medium">
                        <span>⚠ {st.feasibilityReason}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {st.isSelectedSolution && st.isMostProbable && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold shadow-sm shadow-cyan-900/50">
                        ★ Best Feasible & Mode
                      </span>
                    )}
                    {st.isSelectedSolution && !st.isMostProbable && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold shadow-sm shadow-cyan-900/50">
                        ★ Selected Solution
                      </span>
                    )}
                    {st.isMostProbable && !st.isSelectedSolution && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50 font-semibold">
                        Peak Mode
                      </span>
                    )}
                    {!st.isSelectedSolution && !st.isMostProbable && st.isFeasible && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a1829] text-emerald-400 border border-emerald-900/40">
                        Feasible Candidate
                      </span>
                    )}
                    {!st.isSelectedSolution && !st.isMostProbable && !st.isFeasible && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14121a] text-slate-500 border border-slate-800/60">
                        Infeasible Candidate
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
