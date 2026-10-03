import React from 'react';
import { 
  Rocket, 
  MapPin, 
  CloudRain, 
  TrendingUp, 
  Cpu, 
  Globe, 
  ArrowDown, 
  Layers, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FutureScopeView: React.FC = () => {
  const { setActiveTab } = useApp();

  const roadmapItems = [
    {
      step: '01',
      title: 'Current Hackathon MVP',
      badge: 'Implemented Today',
      status: 'completed',
      icon: CheckCircle2,
      description: 'Validated 1-reservoir, 2-canal, 3-crop network with active-set SQP baseline, dynamic QUBO matrix generator, 8-qubit QAOA statevector simulation, and measurement sampling.',
    },
    {
      step: '02',
      title: 'Scale to Larger Optimization Instances',
      badge: 'Phase 1 Roadmap',
      status: 'planned',
      icon: Layers,
      description: 'Expand decision variables to 15-30 crops and multi-tiered canal sluice gates using decomposition algorithms (e.g. Benders decomposition or Quantum Tensor Networks).',
    },
    {
      step: '03',
      title: 'Real River-Basin Water Datasets',
      badge: 'Phase 1 Roadmap',
      status: 'planned',
      icon: Layers,
      description: 'Ingest empirical historical discharge telemetry from Central Water Commission (CWC) reservoirs like Bhakra-Nangal, Krishna, and Cauvery river basins.',
    },
    {
      step: '04',
      title: 'GIS & Satellite Geo-Spatial Integration',
      badge: 'Phase 2 Roadmap',
      status: 'planned',
      icon: MapPin,
      description: 'Integrate Copernicus Sentinel-2 multispectral imagery to estimate real-time soil moisture indices (NDWI, NDVI) directly across field polygons.',
    },
    {
      step: '05',
      title: 'Weather & Precipitation Forecasting',
      badge: 'Phase 2 Roadmap',
      status: 'planned',
      icon: CloudRain,
      description: 'Incorporate 14-day ensemble meteorological forecasts into the objective function to dynamically discount irrigation releases ahead of anticipated monsoon precipitation.',
    },
    {
      step: '06',
      title: 'Machine Learning Demand Prediction',
      badge: 'Phase 3 Roadmap',
      status: 'planned',
      icon: TrendingUp,
      description: 'Employ recurrent neural networks to forecast weekly farmer irrigation demand based on localized evapotranspiration (ET₀) and crop growth stages.',
    },
    {
      step: '07',
      title: 'Real Quantum Hardware Execution (QPU)',
      badge: 'Phase 3 Roadmap',
      status: 'planned',
      icon: Cpu,
      description: 'Deploy compiled QAOA circuits via IBM Quantum Platform or AWS Braket directly onto superconducting transmon or trapped-ion physical QPUs with zero-noise extrapolation (ZNE).',
    },
    {
      step: '08',
      title: 'Autonomous Large-Scale Water Grid Management',
      badge: 'Long-Term Horizon',
      status: 'planned',
      icon: Globe,
      description: 'Closed-loop SCADA integration enabling automated sluice gate actuation, inter-state quota settlements, and continent-scale river linking optimization.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-purple-950 text-purple-400 border border-purple-800/40">
              <Rocket className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Strategic Technology Roadmap
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Future Scope & Evolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From hackathon MVP prototype to physical quantum hardware and multi-basin satellite water governance
          </p>
        </div>
      </div>

      {/* Honesty Banner matching Requirement 24 */}
      <div className="p-4 rounded-2xl bg-[#091530] border border-cyan-800/50 text-xs text-slate-300 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
        <span>
          <strong>Technical Transparency Note:</strong> Items labeled "Phase 1 - 3 Roadmap" represent planned future research and engineering trajectories. Only Step 01 (MVP) is implemented in this active live demonstration.
        </span>
      </div>

      {/* Visual Roadmap Stepper matching Requirement 24 */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-cyan-900/40">
        {roadmapItems.map((item, idx) => {
          const Icon = item.icon;
          const isCurrent = item.status === 'completed';

          return (
            <div key={idx} className="relative flex items-start gap-4 group">
              {/* Node dot on timeline */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  isCurrent
                    ? 'bg-cyan-500 text-white border-white ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30'
                    : 'bg-[#091228] text-slate-400 border-cyan-900/60 group-hover:border-cyan-500'
                }`}
              >
                {isCurrent ? '✓' : item.step}
              </div>

              {/* Card */}
              <div
                className={`flex-1 p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#102454] to-[#0c183a] border-cyan-400 ring-2 ring-cyan-400/20 shadow-xl'
                    : 'bg-[#0d1733]/90 border-cyan-900/30 hover:border-cyan-700/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${
                        isCurrent ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {item.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
                      isCurrent
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : 'bg-[#091228] text-cyan-300 border border-cyan-900/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
