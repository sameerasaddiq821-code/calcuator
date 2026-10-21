/**
 * Core type definitions for Student Study Performance Calculator
 */

export interface StudentInputForm {
  studentName: string;
  averageMarks: string;
  attendance: string;
  assignmentScore: string;
  quizScore: string;
}

export interface FormErrors {
  studentName?: string;
  averageMarks?: string;
  attendance?: string;
  assignmentScore?: string;
  quizScore?: string;
}

export type PerformanceCategory =
  | 'Excellent'
  | 'Very Good'
  | 'Good'
  | 'Needs Improvement'
  | 'Critical';

export interface CategoryInfo {
  category: PerformanceCategory;
  rangeLabel: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  cardBorder: string;
  glowColor: string;
  recommendation: string;
  iconName: string;
}

export interface ComponentBreakdown {
  label: string;
  weight: number;
  weightPercent: string;
  rawScore: number;
  contributedScore: number;
  color: string;
}

export interface CalculationResult {
  studentName: string;
  finalScore: number;
  formattedScore: string;
  category: PerformanceCategory;
  categoryInfo: CategoryInfo;
  recommendation: string;
  breakdown: ComponentBreakdown[];
  timestamp: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  marks: number;
  attendance: number;
  assignment: number;
  quiz: number;
  expectedScore: number;
  expectedCategory: PerformanceCategory;
}
