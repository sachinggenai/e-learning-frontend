/**
 * CircularProgress — SVG circular progress indicator.
 *
 * Displays a percentage score as an animated ring.
 * Used in ScoreSummary and assessment results.
 */

import React from 'react';

export interface CircularProgressProps {
  /** Percentage value 0-100. */
  value: number;
  /** Diameter of the circle in pixels. */
  size?: number;
  /** Stroke width in pixels. */
  strokeWidth?: number;
  /** Color of the progress arc. */
  color?: string;
  /** Color of the background track. */
  trackColor?: string;
  /** Show percentage text in center. */
  showLabel?: boolean;
  /** Custom label text (overrides percentage). */
  label?: string;
  /** Font size for the label. */
  fontSize?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  color,
  trackColor = '#e0e0e0',
  showLabel = true,
  label,
  fontSize = 24,
  className = '',
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  // Auto color based on score if not provided
  const progressColor =
    color ||
    (clampedValue >= 80
      ? 'var(--color-success, #4caf50)'
      : clampedValue >= 60
        ? 'var(--color-warning, #ff9800)'
        : 'var(--color-error, #e53935)');

  const displayLabel = label ?? `${Math.round(clampedValue)}%`;

  return (
    <div
      className={`circular-progress ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Score: ${Math.round(clampedValue)}%`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.6s ease-out',
          }}
        />
      </svg>
      {showLabel && (
        <span
          className="circular-progress__label"
          style={{
            fontSize,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 700,
            color: 'var(--color-text, #333)',
          }}
        >
          {displayLabel}
        </span>
      )}
    </div>
  );
};

export default CircularProgress;
