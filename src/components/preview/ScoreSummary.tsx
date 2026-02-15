/**
 * ScoreSummary — course-level score summary with progress visualization.
 *
 * Shows: overall score ring, per-component breakdown table,
 * pass/fail indicator, attempt history.
 */

import React from 'react';
import CircularProgress from '../common/CircularProgress';
import { ComponentResult, ScoreCalculateResponse } from '../../types/course';
import { AttemptRecord } from '../../store/slices/scoringSlice';
import './ScoreSummary.css';

export interface ScoreSummaryProps {
  result: ScoreCalculateResponse;
  attempts?: AttemptRecord[];
  passingScore: number;
  className?: string;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  result,
  attempts = [],
  passingScore,
  className = '',
}) => {
  const { totalScore, maxScore, percentage, passed, componentResults, attemptNumber, remainingAttempts } = result;

  return (
    <div className={`score-summary ${className}`} role="region" aria-label="Score summary">
      {/* Header with circular progress */}
      <div className="score-summary__header">
        <CircularProgress value={percentage} size={140} strokeWidth={10} />
        <div className="score-summary__overview">
          <h2 className="score-summary__title">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          <div className={`score-summary__status score-summary__status--${passed ? 'passed' : 'failed'}`}>
            {passed ? '✓ Passed' : '✗ Not Passed'}
          </div>
          <div className="score-summary__score-detail">
            <span className="score-summary__score-raw">
              {totalScore} / {maxScore} points
            </span>
            <span className="score-summary__score-threshold">
              Passing score: {passingScore}%
            </span>
          </div>
          {remainingAttempts !== null && remainingAttempts !== undefined && (
            <div className="score-summary__attempts-remaining">
              {remainingAttempts > 0
                ? `${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining`
                : 'No more attempts available'}
            </div>
          )}
        </div>
      </div>

      {/* Component breakdown */}
      {componentResults.length > 0 && (
        <div className="score-summary__breakdown">
          <h3 className="score-summary__section-title">Score Breakdown</h3>
          <table className="score-summary__table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Type</th>
                <th>Score</th>
                <th>Weight</th>
                <th>Weighted</th>
              </tr>
            </thead>
            <tbody>
              {componentResults.map((cr: ComponentResult) => (
                <tr key={cr.componentId}>
                  <td>{cr.componentId.substring(0, 8)}...</td>
                  <td className="score-summary__type-cell">{cr.componentType}</td>
                  <td>
                    {cr.score}/{cr.maxScore}
                  </td>
                  <td>{Math.round(cr.weight * 100)}%</td>
                  <td className="score-summary__weighted-cell">
                    {cr.weightedScore.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attempt history */}
      {attempts.length > 1 && (
        <div className="score-summary__history">
          <h3 className="score-summary__section-title">Attempt History</h3>
          <div className="score-summary__attempt-list">
            {attempts.map((attempt) => (
              <div
                key={attempt.attemptNumber}
                className={`score-summary__attempt ${
                  attempt.attemptNumber === attemptNumber ? 'score-summary__attempt--current' : ''
                }`}
              >
                <span className="score-summary__attempt-num">
                  Attempt {attempt.attemptNumber}
                </span>
                <span className="score-summary__attempt-score">
                  {attempt.percentage}%
                </span>
                <span
                  className={`score-summary__attempt-status ${
                    attempt.passed ? 'score-summary__attempt-status--passed' : 'score-summary__attempt-status--failed'
                  }`}
                >
                  {attempt.passed ? 'Passed' : 'Failed'}
                </span>
                <span className="score-summary__attempt-date">
                  {new Date(attempt.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreSummary;
