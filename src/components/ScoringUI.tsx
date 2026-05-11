/**
 * Scoring UI Components
 *
 * QuizFeedback  — inline feedback for individual assessment components
 * ScoreSummary  — page/course-level score overview
 * CircularProgress — SVG circular progress indicator
 */

import React, { useMemo } from "react";
import "./ScoringUI.css";

/* ═══════════════════════════════════════════════════════════════
 *  CircularProgress
 * ═══════════════════════════════════════════════════════════════ */

interface CircularProgressProps {
  /** 0 – 100 */
  value: number;
  /** Diameter in px */
  size?: number;
  /** Stroke width in px */
  strokeWidth?: number;
  /** Track color */
  trackColor?: string;
  /** Fill color */
  fillColor?: string;
  /** Show percentage text */
  showLabel?: boolean;
  /** ARIA label */
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = React.memo(
  ({
    value,
    size = 64,
    strokeWidth = 5,
    trackColor = "#e2e8f0",
    fillColor,
    showLabel = true,
    label,
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, value));
    const offset = circumference - (clamped / 100) * circumference;

    const resolvedFill =
      fillColor ??
      (clamped >= 80 ? "#22c55e" : clamped >= 50 ? "#f59e0b" : "#ef4444");

    return (
      <div
        className="circular-progress"
        style={{ width: size, height: size }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `${clamped}% complete`}
      >
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={resolvedFill}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        {showLabel && (
          <span
            className="circular-progress__label"
            style={{ color: resolvedFill }}
          >
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = "CircularProgress";

/* ═══════════════════════════════════════════════════════════════
 *  QuizFeedback
 * ═══════════════════════════════════════════════════════════════ */

interface QuizFeedbackProps {
  isCorrect: boolean;
  explanation?: string;
  /** User's answer (for display) */
  userAnswer?: string;
  /** Correct answer (for display) */
  correctAnswer?: string;
  /** Show retry button? */
  canRetry?: boolean;
  onRetry?: () => void;
}

export const QuizFeedback: React.FC<QuizFeedbackProps> = React.memo(
  ({
    isCorrect,
    explanation,
    userAnswer,
    correctAnswer,
    canRetry = false,
    onRetry,
  }) => {
    return (
      <div
        className={`quiz-feedback ${isCorrect ? "quiz-feedback--correct" : "quiz-feedback--incorrect"}`}
        role="alert"
      >
        <div className="quiz-feedback__header">
          <span className="quiz-feedback__icon">{isCorrect ? "✓" : "✗"}</span>
          <strong className="quiz-feedback__title">
            {isCorrect ? "Correct!" : "Incorrect"}
          </strong>
        </div>

        {(userAnswer || correctAnswer) && (
          <div className="quiz-feedback__answers">
            {userAnswer && (
              <div className="quiz-feedback__answer-row">
                <span className="quiz-feedback__answer-label">
                  Your answer:
                </span>
                <span className="quiz-feedback__answer-value">
                  {userAnswer}
                </span>
              </div>
            )}
            {!isCorrect && correctAnswer && (
              <div className="quiz-feedback__answer-row">
                <span className="quiz-feedback__answer-label">
                  Correct answer:
                </span>
                <span className="quiz-feedback__answer-value quiz-feedback__answer-value--correct">
                  {correctAnswer}
                </span>
              </div>
            )}
          </div>
        )}

        {explanation && (
          <p className="quiz-feedback__explanation">{explanation}</p>
        )}

        {canRetry && !isCorrect && onRetry && (
          <button className="quiz-feedback__retry" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  },
);

QuizFeedback.displayName = "QuizFeedback";

/* ═══════════════════════════════════════════════════════════════
 *  ScoreSummary
 * ═══════════════════════════════════════════════════════════════ */

interface ScoreSummaryProps {
  /** earned / total */
  earned: number;
  total: number;
  /** Pass threshold percentage (0-100) */
  passThreshold?: number;
  /** Label above the score */
  title?: string;
  /** Breakdown by section */
  sections?: Array<{
    name: string;
    earned: number;
    total: number;
  }>;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = React.memo(
  ({ earned, total, passThreshold = 80, title = "Your Score", sections }) => {
    const percentage = useMemo(
      () => (total > 0 ? Math.round((earned / total) * 100) : 0),
      [earned, total],
    );

    const passed = percentage >= passThreshold;

    return (
      <div
        className={`score-summary ${passed ? "score-summary--pass" : "score-summary--fail"}`}
      >
        <h3 className="score-summary__title">{title}</h3>

        <div className="score-summary__main">
          <CircularProgress value={percentage} size={80} strokeWidth={6} />
          <div className="score-summary__details">
            <span className="score-summary__fraction">
              {earned} / {total}
            </span>
            <span
              className={`score-summary__status ${passed ? "score-summary__status--pass" : "score-summary__status--fail"}`}
            >
              {passed ? "Passed" : "Not Passed"}
            </span>
            {passThreshold > 0 && (
              <span className="score-summary__threshold">
                Passing: {passThreshold}%
              </span>
            )}
          </div>
        </div>

        {sections && sections.length > 0 && (
          <div className="score-summary__sections">
            <h4 className="score-summary__sections-title">Breakdown</h4>
            {sections.map((s, i) => {
              const pct =
                s.total > 0 ? Math.round((s.earned / s.total) * 100) : 0;
              return (
                <div key={i} className="score-summary__section">
                  <span className="score-summary__section-name">{s.name}</span>
                  <div className="score-summary__section-bar-track">
                    <div
                      className="score-summary__section-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="score-summary__section-score">
                    {s.earned}/{s.total}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

ScoreSummary.displayName = "ScoreSummary";
