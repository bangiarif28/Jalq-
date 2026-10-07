import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { SystemDiagram } from '../dashboard/SystemDiagram';
import { CropCard } from '../dashboard/CropCard';
import { WaterAllocationDonut } from '../dashboard/WaterAllocationDonut';
import { LiveOptimizationPipeline } from '../dashboard/LiveOptimizationPipeline';
import { KeyCorrectionCard } from '../dashboard/KeyCorrectionCard';
import { DashboardCharts } from '../dashboard/DashboardCharts';
import { RecentActivity } from '../dashboard/RecentActivity';
import { KrishnaGodavariRegionMap } from '../maps/KrishnaGodavariRegionMap';
import { WaterAllocationFlowMap } from '../maps/WaterAllocationFlowMap';
import {
  Droplets,
  Sprout,
  Percent,
  ShieldCheck,
  Award,
  Scale,
  Atom,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Waves,
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    scenario, 
    classicalSolution, 
    qaoaResult, 
    hasRunOptimization,
    runCompleteOptimization,
    resetOptimization,
    workflowState,
    setActiveTab, 
    setMathModalOpen 
  } = useApp();

  const totalDemand = scenario.crops.reduce((sum, c) => sum + c.demand, 0);
  const availableWater = scenario.reservoir.availableWater;
  const demandRatio = Math.round((totalDemand / availableWater) * 100);

  return (
    <div className="space-y-6">
      {/* ==============================================================
          1. TOP: Title + Scenario + Prominent RUN COMPLETE OPTIMIZATION
          ============================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1e47] via-[#0b1738] to-[#08112b] border border-cyan-800/40 p-6 lg:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                <Waves className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Active Scenario: {scenario.name}
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-slate-300">
                Primary Demo Region: <strong className="text-white">Krishna-Godavari Command Area, Andhra Pradesh</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              JalQ: Quantum-Powered Smart Water Allocation
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hybrid classical-quantum optimization for intelligent allocation of limited water resources across competing agricultural zones.
            </p>

            {/* Visual Conveyance Breadcrumb */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-[#091530] border border-cyan-800/40 text-cyan-200 font-semibold">
                🌊 Reservoir ({availableWater} ML)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="px-2.5 py-1 rounded-lg bg-[#091530] border border-cyan-800/40 text-cyan-200 font-semibold">
                🏞️ 2 Canals
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="px-2.5 py-1 rounded-lg bg-[#091530] border border-cyan-800/40 text-cyan-200 font-semibold">
                🌾 3 Crops ({totalDemand} ML Demand)
              </span>
            </div>
          </div>

          {/* Prominent Action Buttons matching Requirement 18 & 22 */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={runCompleteOptimization}
              disabled={workflowState.isOptimizing}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-black shadow-xl shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95 border border-cyan-400/30"
            >
              {workflowState.isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing 10 Stages...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ RUN COMPLETE OPTIMIZATION</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={resetOptimization}
                disabled={workflowState.isOptimizing}
                className="flex-1 py-2 px-3 rounded-xl bg-[#091228] hover:bg-[#101f42] border border-cyan-900/40 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Reset Optimization results to initial waiting state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setMathModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-[#091228] hover:bg-[#101f42] border border-cyan-900/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Math</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          MAP 1 — KRISHNA-GODAVARI REGION MAP
          Primary demo region context for JalQ (UC-033 Problem Context)
          ============================================================== */}
      <KrishnaGodavariRegionMap />

      {/* ==============================================================
          2. SECOND: KPI Cards (Hydrological & Optimization Invariants)
          ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Droplets className="w-5 h-5 text-cyan-400" />}
          title="Available Reservoir Water"
          value={availableWater.toLocaleString()}
          unit="ML (Units)"
          subtext={`100% capacity | Net allocatable: ${availableWater - scenario.reservoir.minReserve} ML`}
          badge={{ text: '100% Supply', type: 'info' }}
          progress={100}
          accentColor="cyan"
        />

        <MetricCard
          icon={<Sprout className="w-5 h-5 text-amber-400" />}
          title="Total Crop Demand"
          value={totalDemand.toLocaleString()}
          unit="ML (Units)"
          subtext={`Deficit of ${Math.max(0, totalDemand - availableWater)} ML across 3 crop zones`}
          badge={{ text: `${demandRatio}% of Supply`, type: 'warning' }}
          progress={demandRatio > 100 ? 100 : demandRatio}
          accentColor="amber"
        />

        <MetricCard
          icon={<Percent className="w-5 h-5 text-emerald-400" />}
          title="Effective Water Utilization"
          value={hasRunOptimization ? `${qaoaResult.waterUtilization}%` : '--'}
          subtext={hasRunOptimization ? "Optimal conveyance allocated" : "Run optimization to compute"}
          badge={{ text: hasRunOptimization ? 'Optimal Conveyance' : 'Waiting', type: hasRunOptimization ? 'positive' : 'neutral' }}
          progress={hasRunOptimization ? qaoaResult.waterUtilization : 0}
          accentColor="emerald"
        />

        <MetricCard
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          title="Constraint Violations"
          value={hasRunOptimization ? qaoaResult.constraintViolations : '--'}
          unit={hasRunOptimization ? "detected" : ""}
          subtext={hasRunOptimization ? "Canal & reservoir upper bounds honored" : "Validation pending"}
          badge={{ text: hasRunOptimization ? 'Zero Violations' : 'Pending', type: hasRunOptimization ? 'positive' : 'neutral' }}
          progress={hasRunOptimization ? 100 : 0}
          accentColor="emerald"
        />
      </div>

      {/* Secondary Row: Algorithm Objective Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Award className="w-5 h-5 text-purple-400" />}
          title="Current Objective Score"
          value={hasRunOptimization ? qaoaResult.objectiveScore : '--'}
          subtext="Multi-objective yield minus shortfall penalty"
          badge={{ text: 'Score', type: 'info' }}
          accentColor="purple"
        />

        <MetricCard
          icon={<Scale className="w-5 h-5 text-blue-400" />}
          title="Classical SQP Solution"
          value={hasRunOptimization ? classicalSolution.objectiveScore : '--'}
          subtext={hasRunOptimization ? `Solved in ${classicalSolution.executionTimeMs} ms (${classicalSolution.iterations} iters)` : "Baseline"}
          badge={{ text: 'Classical Baseline', type: 'neutral' }}
          accentColor="blue"
        />

        <MetricCard
          icon={<Atom className="w-5 h-5 text-cyan-400" />}
          title="Quantum / QAOA Solution"
          value={hasRunOptimization ? qaoaResult.objectiveScore : '--'}
          subtext={hasRunOptimization ? `Statevector p=${qaoaResult.pLayers} | ${qaoaResult.shots} shots | ${qaoaResult.executionTimeMs} ms` : "Simulator"}
          badge={{ text: 'Qiskit Simulator', type: 'info' }}
          accentColor="cyan"
        />

        <MetricCard
          icon={<HelpCircle className="w-5 h-5 text-cyan-400" />}
          title="Quantum Advantage Status"
          value="Measured — Not Assumed"
          subtext="Small instance (N=8). Classical SQP is faster (15 ms); QAOA targets combinatorial scale (>50 qubits)."
          badge={{ text: 'Empirical Baseline', type: 'info' }}
          accentColor="cyan"
        />
      </div>

      {/* ==============================================================
          3. THIRD: Large 10-Stage Optimization Pipeline (Requirement 15 & 17)
          ============================================================== */}
      <LiveOptimizationPipeline />

      {/* ==============================================================
          KEY CORRECTION: Conservation Feasibility Invariant
          ============================================================== */}
      <KeyCorrectionCard />

      {/* ==============================================================
          4. FOURTH: Main Allocation Chart & Utilization (Requirement 14)
          ============================================================== */}
      <DashboardCharts />

      {/* ==============================================================
          MAP 2 — JALQ WATER ALLOCATION MAP
          Visual flow map: Reservoir → Canals → Crop Zones with actual values
          ============================================================== */}
      <WaterAllocationFlowMap />

      {/* ==============================================================
          5. FIFTH: System Topology & Classical vs QAOA (Requirement 23)
          ============================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <SystemDiagram />
        </div>
        <div className="xl:col-span-5">
          <WaterAllocationDonut />
        </div>
      </div>

      {/* ==============================================================
          6. SIXTH: Crop Command Cards & Recent Activity
          ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Command Area Crop Allocation Cards
            </h3>
            <p className="text-xs text-slate-400">
              Individual crop command zones, constraints, and delivery status
            </p>
          </div>
          <button
            onClick={() => setActiveTab('water_scenario')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Configure Bounds →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenario.crops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              allocatedWater={hasRunOptimization ? (qaoaResult.cropAllocations[crop.id] ?? crop.minAllocation) : crop.minAllocation}
              demand={crop.demand}
              priority={crop.priority}
            />
          ))}
        </div>
      </div>

      <RecentActivity />
    </div>
  );
};
