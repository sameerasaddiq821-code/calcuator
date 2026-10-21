import React from 'react';
import { ComponentBreakdown } from '../types';

interface ScoreBreakdownProps {
  breakdown: ComponentBreakdown[];
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
        <span>Component (Weight)</span>
        <span>Raw % → Score Contributed</span>
      </div>

      <div className="space-y-2.5">
        {breakdown.map((item) => {
          // Max contribution possible for this component is (100 * weight)
          const maxPossible = 100 * item.weight;
          const percentageOfCap = (item.contributedScore / maxPossible) * 100;

          return (
            <div
              key={item.label}
              className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-200">{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                    {item.weightPercent}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold text-white">
                    {item.contributedScore.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {' '}/ {maxPossible} pts
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(percentageOfCap, 100)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                <span>Input: {item.rawScore}%</span>
                <span>Formula: {item.rawScore}% × {item.weight} = {item.contributedScore.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
