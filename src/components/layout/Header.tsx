import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Droplets, 
  Cpu, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    scenario, 
    loadPreset, 
    allPresets, 
    notifications, 
    markNotificationsRead,
    runCompleteOptimization,
    workflowState,
    logout
  } = useApp();

  const isOptimizing = workflowState.isOptimizing;

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-[#0b1329]/95 backdrop-blur border-b border-cyan-950/40 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              JalQ
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              v1.0 Hackathon MVP
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Quantum-Powered Smart Water Allocation
          </p>
        </div>
      </div>

      {/* Center / Right Control Zone */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Backend & Operational Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1938] border border-cyan-900/30 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">System Operational</span>
          <span className="text-slate-600">|</span>
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300 font-medium">Backend: Qiskit Simulator</span>
        </div>

        {/* Fast Trigger */}
        <button
          onClick={runCompleteOptimization}
          disabled={isOptimizing}
          title="Run complete 10-stage hybrid optimization"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700/40 text-cyan-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : '▶ Run Complete Optimization'}</span>
        </button>

        {/* Current Scenario Selector */}
        <div className="relative">
          <label htmlFor="scenario-select" className="sr-only">Current Scenario</label>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1d40] border border-cyan-900/40 text-xs text-slate-200">
            <span className="text-slate-400 hidden md:inline">Scenario:</span>
            <select
              id="scenario-select"
              value={scenario.id}
              onChange={(e) => loadPreset(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {allPresets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0b1329] text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              if (!notificationOpen) markNotificationsRead();
            }}
            className="p-2 rounded-lg bg-[#0f1d40] hover:bg-[#152756] border border-cyan-900/30 text-slate-300 relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0d1836] border border-cyan-800/40 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-900/40 font-semibold text-slate-200">
                <span>System Notifications</span>
                <span className="text-[10px] text-cyan-400">All Systems Nominal</span>
              </div>
              <div className="py-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded bg-[#091126] border border-cyan-950 flex flex-col gap-0.5">
                    <span className="text-slate-200 font-medium">{n.title}</span>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-[#0f1d40] hover:bg-[#152756] border border-cyan-900/30 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-white leading-tight">Demo User</p>
              <p className="text-[10px] text-cyan-400 leading-tight">Judge / Water Planner</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0d1836] border border-cyan-800/40 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2">
              <div className="pb-2 border-b border-cyan-900/40">
                <p className="font-semibold text-white">Active Session</p>
                <p className="text-slate-400 text-[11px]">Role: Hackathon Evaluation Judge</p>
                <p className="text-cyan-400 text-[10px]">Permission: Full Simulation & QUBO Access</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-red-950/40 text-red-400 transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={logout}
          title="Logout from JalQ"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0f1d40] hover:bg-red-950/40 border border-cyan-900/30 hover:border-red-800/40 text-slate-300 hover:text-red-400 transition-colors cursor-pointer text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};
