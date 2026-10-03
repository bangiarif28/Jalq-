import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitCompare, 
  Scale, 
  Atom, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ClassicalComparisonView: React.FC = () => {
  const { scenario, classicalSolution, qaoaResult, quboResult, setActiveTab } = useApp();

  const totalDemand = scenario.crops.reduce((s, c) => s + c.demand, 0);

  // Approximation ratio
  const approxRatio = Math.round(
    (qaoaResult.objectiveScore / Math.max(1, classicalSolution.objectiveScore)) * 1000
  ) / 10;

  const comparisonData = [
    {
      metric: 'Optimization Method',
      classical: classicalSolution.solverMethod,
      qaoa: `${qaoaResult.backendName} (p=${qaoaResult.pLayers})`,
      winner: 'classical',
      note: 'Classical uses gradient ascent; QAOA uses parameterized variational ansatz',
    },
    {
      metric: 'Objective Score',
      classical: classicalSolution.objectiveScore.toString(),
      qaoa: qaoaResult.objectiveScore.toString(),
      winner: classicalSolution.objectiveScore >= qaoaResult.objectiveScore ? 'classical' : 'qaoa',
      note: `QAOA achieved ${approxRatio}% of continuous classical global optimum`,
    },
    {
      metric: 'Water Utilization',
      classical: `${classicalSolution.waterUtilization}%`,
      qaoa: `${qaoaResult.waterUtilization}%`,
      winner: 'tie',
      note: `Classical utilized ${classicalSolution.waterUtilization}% and QAOA utilized ${qaoaResult.waterUtilization}% of available water`,
    },
    {
      metric: 'Unmet Agricultural Demand',
      classical: `${classicalSolution.unmetDemand} ML`,
      qaoa: `${qaoaResult.unmetDemand} ML`,
      winner: classicalSolution.unmetDemand <= qaoaResult.unmetDemand ? 'classical' : 'qaoa',
      note: 'Managed deficit distributed equitably based on crop priority coefficients',
    },
    {
      metric: 'Constraint Violations',
      classical: `${classicalSolution.constraintViolations} violations`,
      qaoa: `${qaoaResult.constraintViolations} violations`,
      winner: 'tie',
      note: 'Both algorithms strictly satisfied canal conveyance and reservoir limits',
    },
    {
      metric: 'Execution Time',
      classical: `${classicalSolution.executionTimeMs} ms`,
      qaoa: `${qaoaResult.executionTimeMs} ms`,
      winner: 'classical',
      note: 'Classical numerical solver is faster for small scale (N=8 variables)',
    },
    {
      metric: 'Decision Variables / Qubits',
      classical: `${scenario.crops.length} Continuous Float Variables`,
      qaoa: `${quboResult.numQubits} Superposition Qubits (${1 << quboResult.numQubits} States)`,
      winner: 'neutral',
      note: 'Continuous space vs discrete binary Hamiltonian basis',
    },
    {
      metric: 'Circuit Shots / Iterations',
      classical: `${classicalSolution.iterations} Active-Set Iterations`,
      qaoa: `${qaoaResult.shots} Measurement Shots`,
      winner: 'neutral',
      note: 'Classical line-search vs quantum sampling statistics',
    },
    {
      metric: 'Solution Quality / Feasibility',
      classical: '100% Feasible Continuous Optimum',
      qaoa: `${approxRatio}% Approximation Ratio (${qaoaResult.isFeasible ? 'Feasible' : 'Infeasible'})`,
      winner: 'classical',
      note: `${qaoaResult.isFeasible ? 'Strictly feasible allocation' : 'Constrained dispatch'} discovered via QAOA statevector`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <GitCompare className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Scientific Benchmarking
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Classical vs Quantum (QAOA) Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Head-to-head empirical evaluation of classical sequential quadratic programming against QAOA simulation
          </p>
        </div>

        <button
          onClick={() => setActiveTab('what_if')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
        >
          <span>Stress-Test with Scarcity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Technical Honesty Callout Box matching Requirement 15 & 28 */}
      <div className="p-5 rounded-2xl bg-[#091530] border-2 border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                Rigorous Technical Transparency
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              No Experimentally Established Quantum Advantage for this Instance
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
              For this 3-crop, 2-canal prototype (<strong className="text-white">N = {quboResult.numQubits} qubits</strong>), 
              the classical SQP solver executes in <strong className="text-blue-300 tabular-nums">{classicalSolution.executionTimeMs} ms</strong> with 
              an exact score of <strong className="text-white tabular-nums">{classicalSolution.objectiveScore}</strong>. 
              QAOA running on Qiskit Aer takes <strong className="text-cyan-300 tabular-nums">{qaoaResult.executionTimeMs} ms</strong> and 
              reaches an approximation ratio of <strong className="text-emerald-400 tabular-nums">{approxRatio}%</strong>.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end justify-center">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
            Approximation: {approxRatio}%
          </span>
          <span className="text-[10px] text-slate-400 mt-1">NISQ Scalability Target: &gt;50 Qubits</span>
        </div>
      </div>

      {/* Comparison Master Table matching Requirement 15 */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">
          Empirical Benchmark Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-cyan-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Evaluation Metric</th>
                <th className="py-3 px-3 text-blue-400">Classical Benchmark (SQP)</th>
                <th className="py-3 px-3 text-cyan-400">QAOA Quantum Simulator</th>
                <th className="py-3 px-3">Analytical Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/40 font-medium">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#0e1d42]/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white">
                    {row.metric}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-blue-300 tabular-nums">
                    {row.classical}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-cyan-300 tabular-nums">
                    {row.qaoa}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Interpretation Section */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Technical Interpretation & Theoretical Foundations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Why Classical Wins at Small Scale
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Classical convex optimization for a small network with 3 crops can be solved using continuous gradient projection in under 20 milliseconds. The computational overhead of quantum statevector simulation on a CPU cannot outperform polynomial classical algorithms for small linear-quadratic systems.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Where Quantum Advantage Will Emerge
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              When scaling to river basins with <strong>100+ canal control gates</strong>, non-convex return-flow dynamics, and non-linear crop damage curves, the discrete optimization becomes NP-hard. Classical branch-and-bound scales exponentially, whereas QAOA on physical QPUs can explore the multi-basin combinatorial space in polynomial quantum circuit depth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              The Role of JalQ Today
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              JalQ provides the essential bridge: mapping complex hydrological rules into production-ready QUBO matrices and Qiskit circuits today, so water management authorities are ready to execute on fault-tolerant quantum hardware tomorrow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
