import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CalculationResult } from '../types';

interface ScoreGaugeProps {
  result: CalculationResult;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ result }) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Trigger celebration confetti for high achievement (Excellent)
  useEffect(() => {
    if (result.category === 'Excellent') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#6EE7B7', '#FBBF24', '#6366F1'],
        });
      } catch {
        // Safe fallback if confetti canvas is restricted
      }
    }
  }, [result]);

  // Animate score count-up smoothly
  useEffect(() => {
    let start = 0;
    const end = result.finalScore;
    const duration = 650;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Number((eased * end).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setAnimatedScore(end);
      }
    };

    requestAnimationFrame(step);
  }, [result.finalScore]);

  // SVG Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.finalScore / 100) * circumference;

  // Category specific styles
  const getGradientColors = () => {
    switch (result.category) {
      case 'Excellent':
        return { start: '#10B981', end: '#34D399', text: 'text-emerald-400', bg: 'bg-emerald-500/15' };
      case 'Very Good':
        return { start: '#0284C7', end: '#38BDF8', text: 'text-sky-400', bg: 'bg-sky-500/15' };
      case 'Good':
        return { start: '#D97706', end: '#FBBF24', text: 'text-amber-400', bg: 'bg-amber-500/15' };
      case 'Needs Improvement':
        return { start: '#EA580C', end: '#FB923C', text: 'text-orange-400', bg: 'bg-orange-500/15' };
      case 'Critical':
        return { start: '#E11D48', end: '#FB7185', text: 'text-rose-400', bg: 'bg-rose-500/15' };
      default:
        return { start: '#6366F1', end: '#818CF8', text: 'text-indigo-400', bg: 'bg-indigo-500/15' };
    }
  };

  const theme = getGradientColors();

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center">
        {/* Glow behind the gauge */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-700"
          style={{ backgroundColor: result.categoryInfo.glowColor }}
        />

        <svg width={size} height={size} className="rotate-[-90deg] drop-shadow-md">
          <defs>
            <linearGradient id={`gauge-grad-${result.category}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.start} />
              <stop offset="100%" stopColor={theme.end} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80"
          />

          {/* Animated Value Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#gauge-grad-${result.category})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Overall Score
          </span>
          <div className="flex items-baseline gap-0.5 my-0.5">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {animatedScore.toFixed(1)}
            </span>
            <span className="text-lg font-semibold text-slate-400">/100</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {result.categoryInfo.rangeLabel}
          </span>
        </div>
      </div>

      {/* Visual Badge for Category */}
      <div className="mt-4 flex flex-col items-center">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold tracking-wide ${result.categoryInfo.badgeBg}`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: result.categoryInfo.glowColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: result.categoryInfo.glowColor }}
            />
          </span>
          <span>{result.category}</span>
        </div>
      </div>
    </div>
  );
};
