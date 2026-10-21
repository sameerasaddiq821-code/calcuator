/**
 * Student Study Performance Calculator Logic & Validation Engine
 * 
 * Formula:
 * Performance Score = (Average Marks × 0.40) + (Attendance × 0.20) + 
 *                     (Assignment Score × 0.20) + (Quiz Score × 0.20)
 * 
 * Rounding:
 * Result is rounded to exactly one decimal place.
 */

import {
  StudentInputForm,
  FormErrors,
  PerformanceCategory,
  CategoryInfo,
  CalculationResult,
  ComponentBreakdown,
  TestCase,
} from '../types';

/**
 * Metadata and recommendations mapped strictly to the specification.
 */
export const CATEGORY_DEFINITIONS: Record<PerformanceCategory, CategoryInfo> = {
  Excellent: {
    category: 'Excellent',
    rangeLabel: '80–100%',
    colorClass: 'emerald',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    badgeText: 'text-emerald-400',
    cardBorder: 'border-emerald-500/50 shadow-emerald-500/10',
    glowColor: '#10b981',
    recommendation:
      'Maintain your current study habits and continue aiming for high performance.',
    iconName: 'Award',
  },
  'Very Good': {
    category: 'Very Good',
    rangeLabel: '70–79.9%',
    colorClass: 'sky',
    badgeBg: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
    badgeText: 'text-sky-400',
    cardBorder: 'border-sky-500/50 shadow-sky-500/10',
    glowColor: '#0ea5e9',
    recommendation:
      'Maintain your performance and focus on the areas with relatively lower scores.',
    iconName: 'TrendingUp',
  },
  Good: {
    category: 'Good',
    rangeLabel: '60–69.9%',
    colorClass: 'amber',
    badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    badgeText: 'text-amber-400',
    cardBorder: 'border-amber-500/50 shadow-amber-500/10',
    glowColor: '#f59e0b',
    recommendation:
      'Improve your weaker areas through more consistent study and practice.',
    iconName: 'CheckCircle2',
  },
  'Needs Improvement': {
    category: 'Needs Improvement',
    rangeLabel: '50–59.9%',
    colorClass: 'orange',
    badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
    badgeText: 'text-orange-400',
    cardBorder: 'border-orange-500/50 shadow-orange-500/10',
    glowColor: '#f97316',
    recommendation:
      'Increase study time, improve attendance, and seek academic support where needed.',
    iconName: 'AlertTriangle',
  },
  Critical: {
    category: 'Critical',
    rangeLabel: 'Below 50%',
    colorClass: 'rose',
    badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    badgeText: 'text-rose-400',
    cardBorder: 'border-rose-500/50 shadow-rose-500/10',
    glowColor: '#f43f5e',
    recommendation:
      'Develop an immediate improvement plan and consult your teacher/advisor for academic support.',
    iconName: 'AlertOctagon',
  },
};

/**
 * Validates a single percentage input field
 * Rules:
 * 1. Must not be empty.
 * 2. Must be a valid numeric number.
 * 3. Must be between 0 and 100 inclusive.
 */
export function validatePercentageField(
  fieldName: string,
  value: string
): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${fieldName} cannot be empty.`;
  }

  const num = Number(trimmed);

  if (isNaN(num)) {
    return `${fieldName} must be a valid number.`;
  }

  if (num < 0 || num > 100) {
    return `${fieldName} must be between 0 and 100%.`;
  }

  return null;
}

/**
 * Validates the full form before executing calculation.
 * Returns an object containing error messages for invalid fields, or empty object if valid.
 */
export function validateForm(form: StudentInputForm): FormErrors {
  const errors: FormErrors = {};

  // 1. Student Name validation
  if (!form.studentName.trim()) {
    errors.studentName = 'Student name cannot be empty.';
  } else if (form.studentName.trim().length < 2) {
    errors.studentName = 'Student name should have at least 2 characters.';
  }

  // 2. Average Marks validation (40% weight)
  const marksErr = validatePercentageField('Average Marks', form.averageMarks);
  if (marksErr) errors.averageMarks = marksErr;

  // 3. Attendance validation (20% weight)
  const attErr = validatePercentageField('Attendance', form.attendance);
  if (attErr) errors.attendance = attErr;

  // 4. Assignment Score validation (20% weight)
  const assignErr = validatePercentageField('Assignment Score', form.assignmentScore);
  if (assignErr) errors.assignmentScore = assignErr;

  // 5. Quiz Score validation (20% weight)
  const quizErr = validatePercentageField('Quiz Score', form.quizScore);
  if (quizErr) errors.quizScore = quizErr;

  return errors;
}

/**
 * Classifies a calculated score into the 5 academic tiers specified.
 * 
 * Score >= 80.0       -> Excellent
 * 70.0 <= Score < 80  -> Very Good
 * 60.0 <= Score < 70  -> Good
 * 50.0 <= Score < 60  -> Needs Improvement
 * Score < 50.0        -> Critical
 */
export function classifyPerformance(score: number): PerformanceCategory {
  // Use floating comparison with tiny epsilon tolerance if needed,
  // but score is already rounded to 1 decimal place.
  if (score >= 80.0) {
    return 'Excellent';
  } else if (score >= 70.0) {
    return 'Very Good';
  } else if (score >= 60.0) {
    return 'Good';
  } else if (score >= 50.0) {
    return 'Needs Improvement';
  } else {
    return 'Critical';
  }
}

/**
 * Calculates the overall weighted performance score and breakdown.
 * Formula:
 * Performance Score = (Average Marks × 0.40) +
 *                     (Attendance × 0.20) +
 *                     (Assignment Score × 0.20) +
 *                     (Quiz Score × 0.20)
 */
export function calculatePerformanceScore(form: StudentInputForm): CalculationResult {
  const marks = parseFloat(form.averageMarks.trim());
  const attendance = parseFloat(form.attendance.trim());
  const assignment = parseFloat(form.assignmentScore.trim());
  const quiz = parseFloat(form.quizScore.trim());

  // Weighted score computation
  const marksContributed = marks * 0.40;
  const attendanceContributed = attendance * 0.20;
  const assignmentContributed = assignment * 0.20;
  const quizContributed = quiz * 0.20;

  const rawTotal = marksContributed + attendanceContributed + assignmentContributed + quizContributed;
  
  // Format to 1 decimal place as requested
  const roundedScore = Math.round(rawTotal * 10) / 10;
  const formattedScore = roundedScore.toFixed(1);

  const category = classifyPerformance(roundedScore);
  const categoryInfo = CATEGORY_DEFINITIONS[category];

  const breakdown: ComponentBreakdown[] = [
    {
      label: 'Average Marks',
      weight: 0.40,
      weightPercent: '40%',
      rawScore: marks,
      contributedScore: Math.round(marksContributed * 10) / 10,
      color: '#6366f1', // Indigo
    },
    {
      label: 'Attendance',
      weight: 0.20,
      weightPercent: '20%',
      rawScore: attendance,
      contributedScore: Math.round(attendanceContributed * 10) / 10,
      color: '#06b6d4', // Cyan
    },
    {
      label: 'Assignment Score',
      weight: 0.20,
      weightPercent: '20%',
      rawScore: assignment,
      contributedScore: Math.round(assignmentContributed * 10) / 10,
      color: '#10b981', // Emerald
    },
    {
      label: 'Quiz Score',
      weight: 0.20,
      weightPercent: '20%',
      rawScore: quiz,
      contributedScore: Math.round(quizContributed * 10) / 10,
      color: '#f59e0b', // Amber
    },
  ];

  return {
    studentName: form.studentName.trim(),
    finalScore: roundedScore,
    formattedScore,
    category,
    categoryInfo,
    recommendation: categoryInfo.recommendation,
    breakdown,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Built-in Verification Test Cases specified in prompt:
 * Example 1: 90, 95, 85, 90 -> 90.0 (Excellent)
 * Example 2: 65, 70, 60, 65 -> 65.0 (Good)
 * Example 3: 40, 45, 50, 40 -> 43.0 (Critical)
 */
export const OFFICIAL_TEST_CASES: TestCase[] = [
  {
    id: 'test-1',
    name: 'Example 1 (High Achiever)',
    description: 'Marks: 90, Attendance: 95, Assignment: 85, Quiz: 90',
    marks: 90,
    attendance: 95,
    assignment: 85,
    quiz: 90,
    expectedScore: 90.0,
    expectedCategory: 'Excellent',
  },
  {
    id: 'test-2',
    name: 'Example 2 (Average Standing)',
    description: 'Marks: 65, Attendance: 70, Assignment: 60, Quiz: 65',
    marks: 65,
    attendance: 70,
    assignment: 60,
    quiz: 65,
    expectedScore: 65.0,
    expectedCategory: 'Good',
  },
  {
    id: 'test-3',
    name: 'Example 3 (Academic Risk)',
    description: 'Marks: 40, Attendance: 45, Assignment: 50, Quiz: 40',
    marks: 40,
    attendance: 45,
    assignment: 50,
    quiz: 40,
    expectedScore: 43.0,
    expectedCategory: 'Critical',
  },
];

/**
 * Runs validation against all official test cases to confirm mathematical correctness
 */
export function runAutomatedTests() {
  return OFFICIAL_TEST_CASES.map((tc) => {
    const dummyForm: StudentInputForm = {
      studentName: 'Test Student',
      averageMarks: tc.marks.toString(),
      attendance: tc.attendance.toString(),
      assignmentScore: tc.assignment.toString(),
      quizScore: tc.quiz.toString(),
    };
    const result = calculatePerformanceScore(dummyForm);
    const scoreMatches = Math.abs(result.finalScore - tc.expectedScore) < 0.001;
    const categoryMatches = result.category === tc.expectedCategory;
    const passed = scoreMatches && categoryMatches;

    return {
      testCase: tc,
      actualScore: result.finalScore,
      actualCategory: result.category,
      passed,
    };
  });
}
