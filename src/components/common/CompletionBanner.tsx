/**
 * CompletionBanner — Page-level completion progress bar.
 *
 * Displays at the bottom of a page (or inline) showing:
 *  - Number of completed components / total
 *  - Progress bar
 *  - "Page Complete" confirmation when all criteria met
 *  - Navigation hint (e.g., "Complete all items to continue")
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import './CompletionBanner.css';

interface CompletionBannerProps {
  pageId: string;
  /** Position: 'bottom' fixed to page bottom, 'inline' in flow */
  position?: 'bottom' | 'inline';
  /** If true, show "Next" button when complete */
  showNext?: boolean;
  onNext?: () => void;
}

export const CompletionBanner: React.FC<CompletionBannerProps> = ({
  pageId,
  position = 'bottom',
  showNext = false,
  onNext,
}) => {
  const pageCompletion = useSelector(
    (state: RootState) => state.completion?.pages?.[pageId]
  );

  const { completed, total, percent, isComplete } = useMemo(() => {
    if (!pageCompletion?.components) {
      return { completed: 0, total: 0, percent: 0, isComplete: false };
    }

    const components = Object.values(pageCompletion.components);
    const total = components.length;
    const completed = components.filter((c: any) => c.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      total,
      percent,
      isComplete: pageCompletion.completed ?? (total > 0 && completed === total),
    };
  }, [pageCompletion]);

  // Don't show if there's nothing to track
  if (total === 0) return null;

  const className = [
    'completion-banner',
    `completion-banner--${position}`,
    isComplete && 'completion-banner--done',
  ].filter(Boolean).join(' ');

  return (
    <div className={className} role="status" aria-live="polite">
      <div className="completion-banner__progress">
        <div className="completion-banner__bar">
          <div
            className="completion-banner__fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="completion-banner__text">
          {isComplete ? (
            <>Page Complete</>
          ) : (
            <>
              {completed} / {total} completed ({percent}%)
            </>
          )}
        </span>
      </div>

      {isComplete && showNext && onNext && (
        <button className="completion-banner__next" onClick={onNext}>
          Continue →
        </button>
      )}

      {!isComplete && (
        <span className="completion-banner__hint">
          Complete all items to continue
        </span>
      )}
    </div>
  );
};

export default CompletionBanner;
