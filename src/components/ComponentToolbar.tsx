/**
 * ComponentToolbar
 *
 * Inline toolbar rendered above/alongside each component slot.
 * Provides move, duplicate, delete, and settings actions.
 * Accessible with keyboard shortcuts and ARIA labels.
 */

import React from "react";
import "./ComponentToolbar.css";

export interface ComponentToolbarProps {
  componentId: string;
  label: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings?: () => void;
}

export const ComponentToolbar: React.FC<ComponentToolbarProps> = React.memo(
  ({
    label,
    index,
    total,
    onMoveUp,
    onMoveDown,
    onDuplicate,
    onDelete,
    onSettings,
  }) => {
    return (
      <div
        className="comp-toolbar"
        role="toolbar"
        aria-label={`Actions for ${label}`}
      >
        <span className="comp-toolbar__label" title={label}>
          {label}
        </span>

        <div className="comp-toolbar__actions">
          <button
            className="comp-toolbar__btn"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move up"
            title="Move up"
          >
            ▲
          </button>
          <button
            className="comp-toolbar__btn"
            onClick={onMoveDown}
            disabled={index >= total - 1}
            aria-label="Move down"
            title="Move down"
          >
            ▼
          </button>
          <button
            className="comp-toolbar__btn"
            onClick={onDuplicate}
            aria-label="Duplicate"
            title="Duplicate"
          >
            ⧉
          </button>
          {onSettings && (
            <button
              className="comp-toolbar__btn"
              onClick={onSettings}
              aria-label="Settings"
              title="Settings"
            >
              ⚙
            </button>
          )}
          <button
            className="comp-toolbar__btn comp-toolbar__btn--danger"
            onClick={onDelete}
            aria-label="Delete"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    );
  },
);

ComponentToolbar.displayName = "ComponentToolbar";
