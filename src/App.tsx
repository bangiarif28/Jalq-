/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { WaterScenarioView } from './components/views/WaterScenarioView';
import { OptimizationView } from './components/views/OptimizationView';
import { ClassicalBaselineView } from './components/views/ClassicalBaselineView';
import { QUBOView } from './components/views/QUBOView';
import { QAOAView } from './components/views/QAOAView';
import { ClassicalOptimizerView } from './components/views/ClassicalOptimizerView';
import { QuantumCircuitView } from './components/views/QuantumCircuitView';
import { MeasurementView } from './components/views/MeasurementView';
import { ResultsView } from './components/views/ResultsView';
import { ClassicalComparisonView } from './components/views/ClassicalComparisonView';
import { WhatIfView } from './components/views/WhatIfView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { AboutView } from './components/views/AboutView';
import { FutureScopeView } from './components/views/FutureScopeView';
import { JudgeDemoModal } from './components/modals/JudgeDemoModal';
import { ThreeMinuteDemoModal } from './components/modals/ThreeMinuteDemoModal';
import { MathModal } from './components/modals/MathModal';
import { LiveOptimizationModal } from './components/modals/LiveOptimizationModal';
import { OptimizationCompletionBurst } from './components/common/OptimizationCompletionBurst';
import { Menu, X, Play, Clock, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setJudgeDemoOpen, setThreeMinuteDemoOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'water_scenario':
        return <WaterScenarioView />;
      case 'optimization':
        return <OptimizationView />;
      case 'classical_baseline':
        return <ClassicalBaselineView />;
      case 'qubo':
        return <QUBOView />;
      case 'qaoa':
        return <QAOAView />;
      case 'classical_optimizer':
        return <ClassicalOptimizerView />;
      case 'quantum_circuit':
        return <QuantumCircuitView />;
      case 'measurement':
        return <MeasurementView />;
      case 'results':
        return <ResultsView />;
      case 'classical_comparison':
        return <ClassicalComparisonView />;
      case 'what_if':
        return <WhatIfView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'about':
        return <AboutView />;
      case 'future_scope':
        return <FutureScopeView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header />

      {/* Mobile Top Sub-bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#091228] border-b border-cyan-950/60 sticky top-16 z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e1d42] text-xs font-semibold text-cyan-300"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Modules Navigation</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setJudgeDemoOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500 text-white text-[11px] font-bold flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Judge Demo</span>
          </button>
          <button
            onClick={() => setThreeMinuteDemoOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#0e1d42] text-cyan-300 text-[11px] font-bold flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>3-Min</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-28 z-40 bg-black/80 backdrop-blur-sm flex">
            <div className="w-72 bg-[#091124] h-full overflow-y-auto">
              <Sidebar />
            </div>
            <div
              className="flex-1"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Demo Presentation Overlays */}
      <OptimizationCompletionBurst />
      <LiveOptimizationModal />
      <JudgeDemoModal />
      <ThreeMinuteDemoModal />
      <MathModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
