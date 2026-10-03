import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Scenario, Crop, Canal } from '../../types';
import { 
  Droplet, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Waves,
  Sliders,
  Play,
  Loader2
} from 'lucide-react';

export const WaterScenarioView: React.FC = () => {
  const { scenario, setScenario, allPresets, loadPreset, runCompleteOptimization, workflowState } = useApp();

  // Local draft state
  const [draft, setDraft] = useState<Scenario>(JSON.parse(JSON.stringify(scenario)));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState<boolean>(true); // starts true for baseline demo

  // Sync if scenario changes from outside
  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(scenario)));
    setValidationErrors([]);
    setValidationSuccess(null);
    setIsValidated(true);
  }, [scenario]);

  const handleResetToCurrent = () => {
    setDraft(JSON.parse(JSON.stringify(scenario)));
    setValidationErrors([]);
    setValidationSuccess(null);
    setIsValidated(true);
  };

  // Validation Engine
  const validateScenario = (sc: Scenario): string[] => {
    const errors: string[] = [];

    if (!sc.name.trim()) {
      errors.push('Scenario Name cannot be empty.');
    }

    if (sc.reservoir.availableWater <= 0) {
      errors.push('Available Water must be greater than zero.');
    }

    if (sc.reservoir.minReserve < 0) {
      errors.push('Minimum Reserve cannot be negative.');
    }

    if (sc.reservoir.minReserve >= sc.reservoir.availableWater) {
      errors.push('Minimum Reserve cannot exceed or equal Available Water.');
    }

    sc.canals.forEach((canal) => {
      if (canal.maxCapacity <= 0) {
        errors.push(`Canal "${canal.name}" capacity must be strictly positive.`);
      }
      if (canal.minFlow < 0) {
        errors.push(`Canal "${canal.name}" minimum flow cannot be negative.`);
      }
      if (canal.minFlow > canal.maxCapacity) {
        errors.push(`Canal "${canal.name}" minimum flow exceeds its maximum capacity.`);
      }
    });

    if (sc.crops.length === 0) {
      errors.push('Scenario must contain at least one crop.');
    }

    sc.crops.forEach((crop) => {
      if (!crop.name.trim()) {
        errors.push('All crops must have a valid name.');
      }
      if (crop.demand <= 0) {
        errors.push(`Crop "${crop.name}" demand must be greater than zero.`);
      }
      if (crop.minAllocation < 0) {
        errors.push(`Crop "${crop.name}" minimum allocation cannot be negative.`);
      }
      if (crop.maxAllocation < crop.minAllocation) {
        errors.push(`Crop "${crop.name}" max allocation cannot be less than its minimum allocation.`);
      }
      if (crop.priority <= 0) {
        errors.push(`Crop "${crop.name}" priority must be positive.`);
      }
      const canalExists = sc.canals.some((c) => c.id === crop.canalId);
      if (!canalExists) {
        errors.push(`Crop "${crop.name}" is assigned to a non-existent canal.`);
      }
    });

    // Check if total minimum demand exceeds net available water
    const totalMinCrop = sc.crops.reduce((sum, c) => sum + c.minAllocation, 0);
    const netWater = sc.reservoir.availableWater - sc.reservoir.minReserve;
    if (totalMinCrop > netWater) {
      errors.push(
        `Infeasible constraint: Sum of minimum crop allocations (${totalMinCrop} ML) exceeds net available water (${netWater} ML).`
      );
    }

    return errors;
  };

  const handleValidate = () => {
    const errors = validateScenario(draft);
    setValidationErrors(errors);
    if (errors.length === 0) {
      setIsValidated(true);
      setValidationSuccess('Scenario validation passed! All hydrological and physical constraints are sound. You may now run Complete Optimization.');
    } else {
      setIsValidated(false);
      setValidationSuccess(null);
    }
  };

  const handleSave = () => {
    const errors = validateScenario(draft);
    setValidationErrors(errors);
    if (errors.length === 0) {
      setIsValidated(true);
      setScenario(draft);
      setValidationSuccess('Scenario successfully applied and saved!');
    } else {
      setIsValidated(false);
      setValidationSuccess(null);
    }
  };

  const handleRunCompleteOptimization = async () => {
    const errors = validateScenario(draft);
    setValidationErrors(errors);
    if (errors.length > 0) {
      setIsValidated(false);
      setValidationSuccess(null);
      return;
    }
    setIsValidated(true);
    setScenario(draft);
    await runCompleteOptimization();
  };

  // Add Crop
  const handleAddCrop = () => {
    const newCrop: Crop = {
      id: `crop_${Date.now()}`,
      name: 'Sunflower / Mustard',
      demand: 280,
      minAllocation: 120,
      maxAllocation: 300,
      priority: 1.1,
      canalId: draft.canals[0]?.id || 'canal_a',
      iconType: 'wheat',
      economicYieldPerUnit: 2.6,
    };
    setDraft({ ...draft, crops: [...draft.crops, newCrop] });
  };

  // Remove Crop
  const handleRemoveCrop = (id: string) => {
    if (draft.crops.length <= 1) {
      alert('Scenario must maintain at least one crop zone.');
      return;
    }
    setDraft({ ...draft, crops: draft.crops.filter((c) => c.id !== id) });
  };

  // Add Canal
  const handleAddCanal = () => {
    const newCanal: Canal = {
      id: `canal_${Date.now()}`,
      name: `Canal ${String.fromCharCode(65 + draft.canals.length)} (Feeder)`,
      maxCapacity: 350,
      minFlow: 25,
      efficiency: 0.9,
    };
    setDraft({ ...draft, canals: [...draft.canals, newCanal] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Water Scenario Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Define hydrological capacities, environmental reserves, canal conveyance, and agricultural priorities
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetToCurrent}
            className="px-3 py-1.5 rounded-xl bg-[#091228] hover:bg-[#101f42] border border-cyan-900/40 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>
          <button
            onClick={handleValidate}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validate Scenario</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-[#0e1d42] hover:bg-[#14295d] border border-cyan-700/40 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleRunCompleteOptimization}
            disabled={workflowState.isOptimizing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            title="Run the complete 10-stage optimization workflow"
          >
            {workflowState.isOptimizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶ RUN COMPLETE OPTIMIZATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Feedback Messages */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-400 mb-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Validation Identified {validationErrors.length} Issue(s):</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {validationSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{validationSuccess}</span>
        </div>
      )}

      {/* Preset Fast Picker */}
      <div className="p-4 rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-white block">Load Standard Hydrological Preset</span>
          <span className="text-slate-400">Quickly test diverse climate and operational conditions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allPresets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setDraft(JSON.parse(JSON.stringify(p)));
                setValidationErrors([]);
                setValidationSuccess(`Preset "${p.name}" loaded into editor!`);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                draft.id === p.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-[#091228] text-slate-300 border-cyan-950 hover:border-cyan-800'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservoir & General Settings */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-cyan-950/60">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Primary Reservoir Configuration</h3>
              <p className="text-[11px] text-slate-400">Water storage and ecological baseline reserve</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Scenario Label</label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#091228] border border-cyan-900/40 text-white font-medium focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Available Water (ML)
                </label>
                <input
                  type="number"
                  value={draft.reservoir.availableWater}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      reservoir: {
                        ...draft.reservoir,
                        availableWater: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#091228] border border-cyan-900/40 text-white font-bold tabular-nums focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Minimum Reserve (ML)
                </label>
                <input
                  type="number"
                  value={draft.reservoir.minReserve}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      reservoir: {
                        ...draft.reservoir,
                        minReserve: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#091228] border border-cyan-900/40 text-white font-bold tabular-nums focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#081023] border border-cyan-950/60 text-slate-300 text-[11px] flex justify-between">
              <span>Net Allocatable Discharge:</span>
              <strong className="text-cyan-300 tabular-nums">
                {Math.max(0, draft.reservoir.availableWater - draft.reservoir.minReserve)} ML
              </strong>
            </div>
          </div>

          {/* Penalty Coefficients */}
          <div className="pt-3 border-t border-cyan-950/60">
            <h4 className="text-xs font-bold text-white mb-2">QUBO Optimization Penalty Weights</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px]">Reservoir (P_res)</span>
                <input
                  type="number"
                  step="0.5"
                  value={draft.penalties.reservoirLimitPenalty}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      penalties: {
                        ...draft.penalties,
                        reservoirLimitPenalty: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full mt-1 bg-transparent text-cyan-300 font-bold tabular-nums focus:outline-none"
                />
              </div>

              <div className="p-2 rounded-lg bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px]">Canal (P_canal)</span>
                <input
                  type="number"
                  step="0.5"
                  value={draft.penalties.canalCapacityPenalty}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      penalties: {
                        ...draft.penalties,
                        canalCapacityPenalty: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full mt-1 bg-transparent text-cyan-300 font-bold tabular-nums focus:outline-none"
                />
              </div>

              <div className="p-2 rounded-lg bg-[#091228] border border-cyan-950">
                <span className="text-slate-400 text-[10px]">Shortfall (P_short)</span>
                <input
                  type="number"
                  step="0.5"
                  value={draft.penalties.shortfallPenalty}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      penalties: {
                        ...draft.penalties,
                        shortfallPenalty: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full mt-1 bg-transparent text-cyan-300 font-bold tabular-nums focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Canals Manager */}
        <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Canal Network Distribution</h3>
                <p className="text-[11px] text-slate-400">Physical conveyance capacity thresholds</p>
              </div>
            </div>

            <button
              onClick={handleAddCanal}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Canal</span>
            </button>
          </div>

          <div className="space-y-3">
            {draft.canals.map((canal, idx) => (
              <div
                key={canal.id}
                className="p-3.5 rounded-xl bg-[#091228] border border-cyan-950/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={canal.name}
                    onChange={(e) => {
                      const updated = [...draft.canals];
                      updated[idx].name = e.target.value;
                      setDraft({ ...draft, canals: updated });
                    }}
                    className="font-bold text-white bg-transparent border-b border-transparent hover:border-cyan-800 focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Efficiency: {(canal.efficiency * 100).toFixed(0)}%</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Max Capacity (ML)</label>
                    <input
                      type="number"
                      value={canal.maxCapacity}
                      onChange={(e) => {
                        const updated = [...draft.canals];
                        updated[idx].maxCapacity = Number(e.target.value);
                        setDraft({ ...draft, canals: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#081023] border border-cyan-900/30 text-white font-bold tabular-nums focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Min Flow (ML)</label>
                    <input
                      type="number"
                      value={canal.minFlow}
                      onChange={(e) => {
                        const updated = [...draft.canals];
                        updated[idx].minFlow = Number(e.target.value);
                        setDraft({ ...draft, canals: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#081023] border border-cyan-900/30 text-white font-bold tabular-nums focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crops Manager Section */}
      <div className="rounded-2xl bg-[#0d1733]/90 border border-cyan-900/30 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
          <div>
            <h3 className="text-sm font-bold text-white">Crop Command Areas & Agronomic Priorities</h3>
            <p className="text-[11px] text-slate-400">Individual agricultural zones, water demands, bounds, and canal feeder routing</p>
          </div>

          <button
            onClick={handleAddCrop}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Crop Zone</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {draft.crops.map((crop, idx) => (
            <div
              key={crop.id}
              className="p-4 rounded-xl bg-[#091228] border border-cyan-950/60 flex flex-col justify-between space-y-3 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <input
                    type="text"
                    value={crop.name}
                    onChange={(e) => {
                      const updated = [...draft.crops];
                      updated[idx].name = e.target.value;
                      setDraft({ ...draft, crops: updated });
                    }}
                    className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-cyan-800 focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="mt-1">
                    <label className="text-[10px] text-slate-400 mr-2">Feeder Canal:</label>
                    <select
                      value={crop.canalId}
                      onChange={(e) => {
                        const updated = [...draft.crops];
                        updated[idx].canalId = e.target.value;
                        setDraft({ ...draft, crops: updated });
                      }}
                      className="bg-[#081023] text-cyan-300 text-xs px-2 py-0.5 rounded border border-cyan-900/40 focus:outline-none cursor-pointer"
                    >
                      {draft.canals.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#091228] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveCrop(crop.id)}
                  title="Remove crop zone"
                  className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Numerical Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Demand (ML)</label>
                  <input
                    type="number"
                    value={crop.demand}
                    onChange={(e) => {
                      const updated = [...draft.crops];
                      updated[idx].demand = Number(e.target.value);
                      setDraft({ ...draft, crops: updated });
                    }}
                    className="w-full px-2 py-1 rounded-lg bg-[#081023] border border-cyan-900/30 text-white font-bold tabular-nums focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Priority Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    value={crop.priority}
                    onChange={(e) => {
                      const updated = [...draft.crops];
                      updated[idx].priority = Number(e.target.value);
                      setDraft({ ...draft, crops: updated });
                    }}
                    className="w-full px-2 py-1 rounded-lg bg-[#081023] border border-cyan-900/30 text-cyan-300 font-bold tabular-nums focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Min Allocation (ML)</label>
                  <input
                    type="number"
                    value={crop.minAllocation}
                    onChange={(e) => {
                      const updated = [...draft.crops];
                      updated[idx].minAllocation = Number(e.target.value);
                      setDraft({ ...draft, crops: updated });
                    }}
                    className="w-full px-2 py-1 rounded-lg bg-[#081023] border border-cyan-900/30 text-white tabular-nums focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Max Allocation (ML)</label>
                  <input
                    type="number"
                    value={crop.maxAllocation}
                    onChange={(e) => {
                      const updated = [...draft.crops];
                      updated[idx].maxAllocation = Number(e.target.value);
                      setDraft({ ...draft, crops: updated });
                    }}
                    className="w-full px-2 py-1 rounded-lg bg-[#081023] border border-cyan-900/30 text-white tabular-nums focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Footer Bar matching Requirement 19 */}
        <div className="pt-4 mt-2 border-t border-cyan-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className={`w-4 h-4 ${isValidated ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>
              {isValidated
                ? 'Hydrological boundaries verified. System ready for complete hybrid optimization.'
                : 'Please validate scenario before running complete optimization.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleValidate}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validate Scenario</span>
            </button>

            <button
              onClick={handleRunCompleteOptimization}
              disabled={workflowState.isOptimizing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-cyan-950 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {workflowState.isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running Complete Optimization...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ RUN COMPLETE OPTIMIZATION</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
