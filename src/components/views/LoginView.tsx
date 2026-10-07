import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERNAME, DEMO_PASSWORD } from '../../config/authConfig';
import { Droplets, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, Cpu } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Call login with username and password
    const result = login(username, password);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid username or password.');
    }
  };

  const handleFillDemo = () => {
    setUsername(DEMO_USERNAME);
    setPassword(DEMO_PASSWORD);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#09132c]/95 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl">
        {/* Header / Brand */}
        <div className="text-center space-y-2.5 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-cyan-500/30">
            <Droplets className="w-8 h-8 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              JalQ
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Quantum-Powered Smart Water Allocation
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/40 text-[11px] font-semibold text-cyan-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hybrid QAOA Decision Support System</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-700/80 text-red-200 text-xs flex items-center gap-2.5 shadow-md"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="admin"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060c1d] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-[#09132c] transition-all duration-150 shadow-inner"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="jalq2026"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#060c1d] border border-cyan-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-[#09132c] transition-all duration-150 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-400 focus:outline-none focus:text-cyan-400 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-6 pt-4 border-t border-cyan-950/70 text-center">
          <div 
            onClick={handleFillDemo}
            className="p-3 rounded-xl bg-[#060d1f] hover:bg-[#08122c] border border-cyan-900/40 hover:border-cyan-700/60 text-[11px] text-slate-400 space-y-1.5 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFillDemo();
                }}
                className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer font-bold"
              >
                Auto-fill
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 font-mono text-[10px] text-slate-400">
              <span>Username: <strong className="text-white">{DEMO_USERNAME}</strong></span>
              <span>•</span>
              <span>Password: <strong className="text-white">{DEMO_PASSWORD}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-6 text-center text-xs text-slate-500">
        JalQ Quantum Water Allocation • Prototype Decision Support System
      </div>
    </div>
  );
};
