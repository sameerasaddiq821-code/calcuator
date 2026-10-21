/**
 * Student Study Performance Calculator
 * 
 * Android Mobile App for University Students
 * Weighted Evaluation Formula:
 * Performance Score = (Average Marks × 0.40) + (Attendance × 0.20) + 
 *                     (Assignment Score × 0.20) + (Quiz Score × 0.20)
 */

import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Calculator,
  RotateCcw,
  User,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  HelpCircle,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  WifiOff,
} from 'lucide-react';
import {
  StudentInputForm,
  FormErrors,
  CalculationResult,
  TestCase,
} from './types';
import {
  validateForm,
  validatePercentageField,
  calculatePerformanceScore,
  OFFICIAL_TEST_CASES,
} from './utils/calculator';
import { ScoreGauge } from './components/ScoreGauge';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { RecommendationCard } from './components/RecommendationCard';
import { QuickTestPresets } from './components/QuickTestPresets';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidInstructionsModal } from './components/AndroidInstructionsModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const INITIAL_FORM: StudentInputForm = {
  studentName: '',
  averageMarks: '',
  attendance: '',
  assignmentScore: '',
  quizScore: '',
};

export default function App() {
  const [form, setForm] = useState<StudentInputForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | undefined>(undefined);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);
  const [showAndroidHelp, setShowAndroidHelp] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();

  /**
   * Handle text changes in input fields
   * Automatically clears validation error for that field as the user types
   */
  const handleInputChange = (field: keyof StudentInputForm, value: string) => {
    setActiveTestId(undefined); // Clear active benchmark preset if manual edit occurs
    setForm((prev) => ({ ...prev, [field]: value }));

    // Real-time clearance of error if corrected
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /**
   * Calculation Handler
   * 1. Runs full validation across all fields.
   * 2. Halts if any field is invalid (empty, non-numeric, or outside 0-100).
   * 3. Calculates the weighted performance score rounded to 1 decimal place.
   */
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform strict validation
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear previous errors & compute score
    setErrors({});
    const calcResult = calculatePerformanceScore(form);
    setResult(calcResult);

    // Smoothly scroll to results display
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  /**
   * Reset Handler
   * Clears all inputs, removes previous score, category, recommendation,
   * and returns application to its initial state.
   */
  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setResult(null);
    setActiveTestId(undefined);
  };

  /**
   * Loads one of the 3 official benchmark examples specified in testing criteria
   */
  const handleLoadPreset = (tc: TestCase) => {
    const populatedForm: StudentInputForm = {
      studentName: `Student (${tc.expectedCategory})`,
      averageMarks: tc.marks.toString(),
      attendance: tc.attendance.toString(),
      assignmentScore: tc.assignment.toString(),
      quizScore: tc.quiz.toString(),
    };

    setForm(populatedForm);
    setErrors({});
    setActiveTestId(tc.id);

    // Calculate immediately for quick inspection
    const calcResult = calculatePerformanceScore(populatedForm);
    setResult(calcResult);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return (
    <AndroidFrame
      onOpenAndroidHelp={() => setShowAndroidHelp(true)}
      onReset={handleReset}
    >
      <div className="space-y-5 pb-6">
        {/* Offline Banner when device loses connection */}
        {!isOnline && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>Offline Mode Active: Local calculation operates without network.</span>
          </div>
        )}

        {/* Top App Header / Branding */}
        <header className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
                  Study Performance
                </h1>
                <p className="text-[11px] font-medium text-indigo-300">
                  Academic Performance Calculator
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFormulaInfo(!showFormulaInfo)}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition"
              title="View weighted formula details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Short Instruction explaining the purpose */}
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            Evaluate your overall academic performance based on marks, attendance,
            assignments, and quizzes. Get instant score classification and personalized study recommendations.
          </p>
        </header>

        {/* Formula Explainer Card (Collapsible) */}
        {showFormulaInfo && (
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-indigo-500/30 space-y-2.5 text-xs text-slate-300 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between font-semibold text-white">
              <span>Official University Weighted Formula</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                100% Total
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-[11px] text-indigo-200 border border-slate-800">
              Performance Score = (Marks × 0.40) + (Attendance × 0.20) + (Assignment × 0.20) + (Quiz × 0.20)
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>• Marks: 40% weight</div>
              <div>• Attendance: 20% weight</div>
              <div>• Assignments: 20% weight</div>
              <div>• Quizzes: 20% weight</div>
            </div>
          </div>
        )}

        {/* Quick Testing Benchmark Presets */}
        <QuickTestPresets
          onSelectPreset={handleLoadPreset}
          activeTestId={activeTestId}
        />

        {/* Input Form */}
        <form onSubmit={handleCalculate} noValidate className="space-y-4">
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-700/40 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Student Details & Scores
              </span>
              <span className="text-[11px] text-slate-400">Values 0 – 100%</span>
            </div>

            {/* 1. Student Name Input */}
            <div className="space-y-1">
              <label
                htmlFor="studentName"
                className="block text-xs font-medium text-slate-300"
              >
                Student Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="studentName"
                  type="text"
                  placeholder="e.g., Alex Johnson"
                  value={form.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-900 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                    errors.studentName
                      ? 'border-rose-500/80 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.studentName && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.studentName}</span>
                </p>
              )}
            </div>

            {/* 2. Average Marks (%) - 40% Weight */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="averageMarks"
                  className="block text-xs font-medium text-slate-300"
                >
                  Average Marks (%) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  40% Weight
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <input
                  id="averageMarks"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={form.averageMarks}
                  onChange={(e) => handleInputChange('averageMarks', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-900 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-mono transition ${
                    errors.averageMarks
                      ? 'border-rose-500/80 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 font-mono">
                  %
                </span>
              </div>
              {errors.averageMarks && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.averageMarks}</span>
                </p>
              )}
            </div>

            {/* 3. Attendance (%) - 20% Weight */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="attendance"
                  className="block text-xs font-medium text-slate-300"
                >
                  Attendance (%) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  20% Weight
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <input
                  id="attendance"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={form.attendance}
                  onChange={(e) => handleInputChange('attendance', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-900 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-mono transition ${
                    errors.attendance
                      ? 'border-rose-500/80 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                  }`}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 font-mono">
                  %
                </span>
              </div>
              {errors.attendance && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.attendance}</span>
                </p>
              )}
            </div>

            {/* 4. Assignment Score (%) - 20% Weight */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="assignmentScore"
                  className="block text-xs font-medium text-slate-300"
                >
                  Assignment Score (%) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  20% Weight
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <input
                  id="assignmentScore"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={form.assignmentScore}
                  onChange={(e) => handleInputChange('assignmentScore', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-900 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-mono transition ${
                    errors.assignmentScore
                      ? 'border-rose-500/80 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 font-mono">
                  %
                </span>
              </div>
              {errors.assignmentScore && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.assignmentScore}</span>
                </p>
              )}
            </div>

            {/* 5. Quiz Score (%) - 20% Weight */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quizScore"
                  className="block text-xs font-medium text-slate-300"
                >
                  Quiz Score (%) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  20% Weight
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <input
                  id="quizScore"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={form.quizScore}
                  onChange={(e) => handleInputChange('quizScore', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-900 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-mono transition ${
                    errors.quizScore
                      ? 'border-rose-500/80 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 font-mono">
                  %
                </span>
              </div>
              {errors.quizScore && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.quizScore}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons: Calculate Performance & Reset */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="submit"
              className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-[0.98]"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Performance</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="col-span-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-300 hover:text-white font-medium text-sm rounded-xl border border-slate-700/80 transition transform active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Visual Display of Results Section */}
        {result && (
          <div
            ref={resultRef}
            className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {/* Main Result Card */}
            <div
              className={`bg-slate-800/90 rounded-3xl p-5 border shadow-xl relative overflow-hidden ${result.categoryInfo.cardBorder}`}
            >
              {/* Subtle student name header badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-2">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Student Evaluation
                  </span>
                  <span className="text-base font-bold text-white">
                    {result.studentName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Calculated at</span>
                  <span className="text-xs font-mono text-slate-300">
                    {result.timestamp}
                  </span>
                </div>
              </div>

              {/* Large Visual Display: Score Gauge */}
              <ScoreGauge result={result} />

              {/* Score Breakdown Section */}
              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
                  Formula Component Breakdown
                </h4>
                <ScoreBreakdown breakdown={result.breakdown} />
              </div>
            </div>

            {/* Recommended Next Action Card */}
            <RecommendationCard result={result} />
          </div>
        )}

        {/* Academic Performance Tier Reference Card */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Performance Classification Rubric</span>
            <span>Category</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <span>80.0 – 100.0%</span>
              <span className="font-semibold">Excellent</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
              <span>70.0 – 79.9%</span>
              <span className="font-semibold">Very Good</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <span>60.0 – 69.9%</span>
              <span className="font-semibold">Good</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20">
              <span>50.0 – 59.9%</span>
              <span className="font-semibold">Needs Improvement</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
              <span>Below 50.0%</span>
              <span className="font-semibold">Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* APK & Android Installation Modal */}
      <AndroidInstructionsModal
        isOpen={showAndroidHelp}
        onClose={() => setShowAndroidHelp(false)}
      />
    </AndroidFrame>
  );
}
