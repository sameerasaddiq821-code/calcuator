import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { CalculationResult } from '../types';

interface RecommendationCardProps {
  result: CalculationResult;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  // Find lowest component to suggest targeted focus
  const sortedBreakdown = [...result.breakdown].sort((a, b) => a.rawScore - b.rawScore);
  const lowestComponent = sortedBreakdown[0];

  const handleCopyReport = () => {
    const textReport = `🎓 STUDENT STUDY PERFORMANCE EVALUATION
Student Name: ${result.studentName}
Overall Performance Score: ${result.formattedScore} / 100
Category: ${result.category}
Calculation Date: ${new Date().toLocaleDateString()} at ${result.timestamp}

📊 COMPONENT BREAKDOWN:
• Average Marks (40%): ${result.breakdown[0].rawScore}% → ${result.breakdown[0].contributedScore} pts
• Attendance (20%): ${result.breakdown[1].rawScore}% → ${result.breakdown[1].contributedScore} pts
• Assignment Score (20%): ${result.breakdown[2].rawScore}% → ${result.breakdown[2].contributedScore} pts
• Quiz Score (20%): ${result.breakdown[3].rawScore}% → ${result.breakdown[3].contributedScore} pts

📌 RECOMMENDED NEXT ACTION:
${result.recommendation}

Target Area for Growth:
${lowestComponent.label} is currently lowest at ${lowestComponent.rawScore}%. Prioritizing this area will yield the highest performance gains.`;

    navigator.clipboard.writeText(textReport).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-lg space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Recommended Next Action</h3>
            <p className="text-xs text-slate-400">Personalized Academic Guidance</p>
          </div>
        </div>

        <button
          onClick={handleCopyReport}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/70 hover:bg-slate-700 rounded-lg transition active:scale-95"
          title="Copy evaluation summary"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Main Recommended Action Callout - verbatim as required by spec */}
      <div className="bg-slate-900/80 rounded-xl p-3.5 border border-indigo-500/20 text-slate-200">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5 flex-shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              {result.category} Directive
            </span>
            <p className="text-sm font-medium text-white leading-relaxed">
              "{result.recommendation}"
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Focus insight */}
      <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/40 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>Strategic Improvement Priority:</span>
        </div>
        <p className="text-slate-400 leading-normal">
          <strong className="text-slate-200">{lowestComponent.label}</strong> is your lowest score ({lowestComponent.rawScore}%).
          {lowestComponent.label === 'Average Marks' && ' Marks carry 40% weight—improving exam prep directly shifts your final GPA tier.'}
          {lowestComponent.label === 'Attendance' && ' Full class participation gives consistent foundation and instructor feedback.'}
          {lowestComponent.label === 'Assignment Score' && ' Submitting projects early and seeking feedback before final deadlines will boost your score.'}
          {lowestComponent.label === 'Quiz Score' && ' Daily flashcard spaced repetition will strengthen recall for weekly quizzes.'}
        </p>
      </div>
    </div>
  );
};
