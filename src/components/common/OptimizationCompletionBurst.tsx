import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

// Pre-computed particle trajectory specifications for smooth, lightweight 60fps burst
const PARTICLES = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * 2 * Math.PI + ((i % 3) * 0.15);
  const distance = 45 + ((i * 23) % 115); // Expands 45px to 160px outward
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  const size = 5 + (i % 5) * 2; // 5px to 13px bubbles
  const delay = (i % 4) * 0.03; // 0s to 0.09s slight stagger
  const duration = 1.35 + (i % 3) * 0.15; // 1.35s to 1.65s
  return { id: i, tx, ty, size, delay, duration };
});

export const OptimizationCompletionBurst: React.FC = () => {
  const { showCompletionBurst } = useApp();

  if (!showCompletionBurst) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center justify-center select-none"
    >
      <style>{`
        @keyframes jalqBadgePop {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          18% {
            transform: scale(1.06);
            opacity: 1;
          }
          32% {
            transform: scale(1);
            opacity: 1;
          }
          82% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.92);
            opacity: 0;
          }
        }

        @keyframes jalqBubbleBurst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.4), calc(var(--ty) * 0.4)) scale(1.3);
          }
          75% {
            opacity: 0.85;
          }
          100% {
            transform: translate(var(--tx), calc(var(--ty) - 38px)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>

      {/* Floating Particles / Bubbles Burst radiating outward */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '9999px',
              background: 'radial-gradient(circle at 32% 32%, #e0f2fe, #06b6d4 50%, #0369a1 90%)',
              border: '1px solid rgba(165, 243, 252, 0.85)',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.85), inset 0 0 4px rgba(255, 255, 255, 0.8)',
              animation: `jalqBubbleBurst ${p.duration}s cubic-bezier(0.15, 0.85, 0.35, 1) forwards`,
              animationDelay: `${p.delay}s`,
              ['--tx' as any]: `${p.tx}px`,
              ['--ty' as any]: `${p.ty}px`,
            }}
          />
        ))}
      </div>

      {/* Completion Status Badge */}
      <div
        className="relative z-10 px-5 py-2.5 rounded-full bg-[#081533]/95 border-2 border-cyan-400 text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.65)] backdrop-blur-md flex items-center gap-2.5 font-black text-xs uppercase tracking-wider"
        style={{ animation: 'jalqBadgePop 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <span>OPTIMISATION COMPLETE • Solution Ready</span>
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
      </div>
    </div>
  );
};
