/**
 * CompletionIndicator — visual indicator overlay showing component completion status.
 *
 * Shows a green checkmark badge when component is completed.
 * Wraps around any component as a transparent overlay.
 */

import React from 'react';
import './CompletionIndicator.css';

export interface CompletionIndicatorProps {
  completed: boolean;
  /** Optional label for screen readers. */
  label?: string;
  /** Position: top-right (default), top-left, bottom-right, bottom-left */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Whether to show as a compact inline badge vs overlay. */
  inline?: boolean;
  children?: React.ReactNode;
}

const CompletionIndicator: React.FC<CompletionIndicatorProps> = ({
  completed,
  label = 'Completed',
  position = 'top-right',
  inline = false,
  children,
}) => {
  if (inline) {
    return (
      <span
        className={`completion-indicator-inline ${completed ? 'completion-indicator-inline--done' : ''}`}
        role="status"
        aria-label={completed ? label : 'Not completed'}
      >
        {completed ? '✓' : '○'}
      </span>
    );
  }

  return (
    <div className="completion-indicator-wrapper">
      {children}
      {completed && (
        <div
          className={`completion-indicator completion-indicator--${position}`}
          role="status"
          aria-label={label}
        >
          <span className="completion-indicator__badge">✓</span>
        </div>
      )}
    </div>
  );
};

export default CompletionIndicator;
