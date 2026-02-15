/**
 * Scoring Type Definitions
 *
 * Quiz scoring, weighted results, attempt tracking, and SCORM reporting.
 * Re-exports core scoring types from course.ts and adds UI-specific ones.
 */

export type {
  ComponentScoreConfig,
  ScormObjective,
  ScormReportingConfig,
  ScoringConfig,
  QuestionResponse,
  ComponentAnswer,
  ScoreCalculateRequest,
  QuestionResult,
  ComponentResult,
  ScoreCalculateResponse,
} from './course';

// ─── Feedback Modes ──────────────────────────────────────────────
export type FeedbackMode = 'immediate' | 'on-submit' | 'end';

// ─── Scoring Context State ───────────────────────────────────────
export interface ComponentScoreState {
  componentId: string;
  componentType: string;
  score: number;
  maxScore: number;
  weight: number;
  weightedScore: number;
  attemptNumber: number;
  isCorrect: boolean;
  partialCredit: boolean;
}

export interface ScoringContextValue {
  /** Per-component score states */
  scores: Record<string, ComponentScoreState>;
  /** Total course score */
  totalScore: number;
  /** Max possible score */
  maxScore: number;
  /** Score percentage 0..100 */
  percentage: number;
  /** Whether overall score meets passing threshold */
  passed: boolean;
  /** Submit answers for a component */
  submitAnswers: (componentId: string, answers: import('./course').ComponentAnswer) => Promise<import('./course').ComponentResult>;
  /** Calculate full course score */
  calculateCourseScore: () => Promise<import('./course').ScoreCalculateResponse>;
  /** Current feedback mode */
  feedbackMode: FeedbackMode;
}
