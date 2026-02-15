/**
 * QuizFeedback — displays feedback for quiz/assessment responses.
 *
 * Supports three feedback modes:
 *   - immediate: show correct/incorrect right after answering
 *   - on-submit: show all feedback after quiz is submitted
 *   - end-of-course: defer feedback until course end
 *
 * Shows: correct/incorrect indicators, explanations, partial credit info.
 */

import React from 'react';
import './QuizFeedback.css';

export type FeedbackMode = 'immediate' | 'on-submit' | 'end-of-course';

export interface QuestionFeedback {
  questionId: string;
  correct: boolean;
  score: number;
  maxScore: number;
  partialCredit: boolean;
  explanation?: string;
  correctAnswer?: string;
  userAnswer?: string;
}

export interface QuizFeedbackProps {
  mode: FeedbackMode;
  /** Whether to reveal feedback (controlled by parent). */
  showFeedback: boolean;
  /** Per-question feedback data. */
  questions: QuestionFeedback[];
  /** Show correct answers when wrong? */
  showCorrectAnswers?: boolean;
  /** Overall score for the component. */
  totalScore?: number;
  maxScore?: number;
  className?: string;
}

const AnswerIndicator: React.FC<{ correct: boolean; partialCredit?: boolean }> = ({
  correct,
  partialCredit,
}) => {
  if (correct) {
    return (
      <span className="answer-indicator answer-indicator--correct" aria-label="Correct">
        ✓ Correct
      </span>
    );
  }
  if (partialCredit) {
    return (
      <span className="answer-indicator answer-indicator--partial" aria-label="Partial credit">
        ◐ Partial Credit
      </span>
    );
  }
  return (
    <span className="answer-indicator answer-indicator--incorrect" aria-label="Incorrect">
      ✗ Incorrect
    </span>
  );
};

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  mode,
  showFeedback,
  questions,
  showCorrectAnswers = true,
  totalScore,
  maxScore,
  className = '',
}) => {
  if (!showFeedback) return null;

  const correctCount = questions.filter((q) => q.correct).length;
  const partialCount = questions.filter((q) => q.partialCredit && !q.correct).length;

  return (
    <div className={`quiz-feedback quiz-feedback--${mode} ${className}`} role="region" aria-label="Quiz feedback">
      {/* Summary */}
      {totalScore !== undefined && maxScore !== undefined && (
        <div className="quiz-feedback__summary">
          <div className="quiz-feedback__score">
            <span className="quiz-feedback__score-value">
              {totalScore} / {maxScore}
            </span>
            <span className="quiz-feedback__score-percent">
              ({Math.round((totalScore / maxScore) * 100)}%)
            </span>
          </div>
          <div className="quiz-feedback__breakdown">
            <span className="quiz-feedback__stat quiz-feedback__stat--correct">
              {correctCount} correct
            </span>
            {partialCount > 0 && (
              <span className="quiz-feedback__stat quiz-feedback__stat--partial">
                {partialCount} partial
              </span>
            )}
            <span className="quiz-feedback__stat quiz-feedback__stat--incorrect">
              {questions.length - correctCount - partialCount} incorrect
            </span>
          </div>
        </div>
      )}

      {/* Per-question feedback */}
      <div className="quiz-feedback__questions">
        {questions.map((q) => (
          <div
            key={q.questionId}
            className={`quiz-feedback__question ${
              q.correct
                ? 'quiz-feedback__question--correct'
                : q.partialCredit
                  ? 'quiz-feedback__question--partial'
                  : 'quiz-feedback__question--incorrect'
            }`}
          >
            <div className="quiz-feedback__question-header">
              <AnswerIndicator correct={q.correct} partialCredit={q.partialCredit} />
              {q.partialCredit && (
                <span className="quiz-feedback__partial-score">
                  {q.score}/{q.maxScore} pts
                </span>
              )}
            </div>

            {/* Show correct answer when wrong and allowed */}
            {!q.correct && showCorrectAnswers && q.correctAnswer && (
              <div className="quiz-feedback__correct-answer">
                <strong>Correct answer:</strong> {q.correctAnswer}
              </div>
            )}

            {/* User's answer */}
            {q.userAnswer && (
              <div className="quiz-feedback__user-answer">
                <strong>Your answer:</strong> {q.userAnswer}
              </div>
            )}

            {/* Explanation */}
            {q.explanation && (
              <div className="quiz-feedback__explanation">
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { AnswerIndicator };
export default QuizFeedback;
