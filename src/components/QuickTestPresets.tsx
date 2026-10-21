import React from 'react';
import { CheckCircle2, PlayCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { OFFICIAL_TEST_CASES, runAutomatedTests } from '../utils/calculator';
import { TestCase } from '../types';

interface QuickTestPresetsProps {
  onSelectPreset: (tc: TestCase) => void;
  activeTestId?: string;
}

export const QuickTestPresets: React.FC<QuickTestPresetsProps> = ({
  onSelectPreset,
  activeTestId,
}) => {
  const testResults = runAutomatedTests();
  const allPassed = testResults.every((t) => t.passed);

  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/70 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Standard Benchmark Test Cases
          </h4>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Formula</span>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Tap any benchmark example to automatically populate inputs and verify calculations against the university rubric.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {OFFICIAL_TEST_CASES.map((tc, idx) => {
          const isActive = activeTestId === tc.id;
          const result = testResults[idx];

          return (
            <button
              key={tc.id}
              onClick={() => onSelectPreset(tc)}
              type="button"
              className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                  : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-200">
                  Example {idx + 1}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    tc.expectedCategory === 'Excellent'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : tc.expectedCategory === 'Good'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {tc.expectedCategory}
                </span>
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-400 font-mono">
                <div>Marks: {tc.marks}% | Att: {tc.attendance}%</div>
                <div>Assign: {tc.assignment}% | Quiz: {tc.quiz}%</div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target:</span>
                <span className="font-bold text-white font-mono">
                  {tc.expectedScore.toFixed(1)} pts
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
