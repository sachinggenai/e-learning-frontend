/**
 * CycleDiagram — Circular process diagram showing repeating stages.
 *
 * Preview: Stages arranged in a circle with connecting lines.
 * Editor: Add/remove/rename stages with descriptions.
 *
 * Category: process-flow
 */

import React, { useCallback, useMemo } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './CycleDiagram.css';

interface Stage {
  id: string;
  label: string;
  description?: string;
}

interface CycleDiagramData {
  title?: string;
  stages: Stage[];
}

// ─── Preview ──────────────────────────────────────────────────────
export const CycleDiagramPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  const componentData = (data ?? {}) as CycleDiagramData;
  const stages = componentData.stages ?? [];

  // Hooks must stay above early returns so render order remains stable.
  const positions = useMemo(() => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    return stages.map((_, idx) => {
      const angle = (idx / stages.length) * 2 * Math.PI - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [stages]);

  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  if (!stages || stages.length === 0) {
    return <div className="tpl-cycle-diagram__empty">No stages configured.</div>;
  }

  // SVG dimensions and setup
  const svgWidth = 300;
  const svgHeight = 300;

  return (
    <div className="tpl-cycle-diagram">
      {componentData.title && (
        <h3 className="tpl-cycle-diagram__title">{componentData.title}</h3>
      )}

      <div className="tpl-cycle-diagram__canvas">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="tpl-cycle-diagram__svg"
        >
          {/* Draw connecting arrows between stages */}
          {stages.map((_, idx) => {
            const current = positions[idx];
            const next = positions[(idx + 1) % stages.length];
            const angle = Math.atan2(next.y - current.y, next.x - current.x);
            const arrowSize = 8;
            const endX = next.x - arrowSize * Math.cos(angle);
            const endY = next.y - arrowSize * Math.sin(angle);
            return (
              <g key={`line-${idx}`}>
                <line
                  x1={current.x}
                  y1={current.y}
                  x2={endX}
                  y2={endY}
                  className="tpl-cycle-diagram__line"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="tpl-cycle-diagram__arrow" />
            </marker>
          </defs>

          {/* Draw stage nodes */}
          {stages.map((stage, idx) => (
            <g key={stage.id}>
              <circle
                cx={positions[idx].x}
                cy={positions[idx].y}
                r={30}
                className="tpl-cycle-diagram__node"
              />
              <text
                x={positions[idx].x}
                y={positions[idx].y}
                className="tpl-cycle-diagram__node-label"
              >
                {idx + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stage descriptions */}
      <div className="tpl-cycle-diagram__stages">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="tpl-cycle-diagram__stage-item">
            <div className="tpl-cycle-diagram__stage-badge">{idx + 1}</div>
            <div>
              <h4 className="tpl-cycle-diagram__stage-label">{stage.label}</h4>
              {stage.description && (
                <p className="tpl-cycle-diagram__stage-description">
                  {stage.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const CycleDiagramEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const componentData = (data ?? {}) as CycleDiagramData;
  const stages = componentData.stages ?? [];

  const updateStage = useCallback(
    (idx: number, field: keyof Stage, value: string) => {
      const updated = [...stages];
      updated[idx] = { ...updated[idx], [field]: value };
      onChange({ data: { ...componentData, stages: updated } });
    },
    [stages, componentData, onChange]
  );

  const addStage = useCallback(() => {
    onChange({
      data: {
        ...componentData,
        stages: [
          ...stages,
          { id: `stage-${Date.now()}`, label: '', description: '' },
        ],
      },
    });
  }, [stages, componentData, onChange]);

  const removeStage = useCallback(
    (idx: number) => {
      onChange({
        data: {
          ...componentData,
          stages: stages.filter((_, i) => i !== idx),
        },
      });
    },
    [stages, componentData, onChange]
  );

  return (
    <div className="tpl-cycle-diagram-editor">
      <div className="tpl-cycle-diagram-editor__field">
        <label className="tpl-cycle-diagram-editor__label" htmlFor="cd-title">
          Title
        </label>
        <input
          id="cd-title"
          type="text"
          className="tpl-cycle-diagram-editor__input"
          value={componentData.title ?? ''}
          onChange={(e) =>
            onChange({
              data: { ...componentData, title: e.target.value },
            })
          }
          placeholder="Cycle Diagram"
          disabled={readOnly}
        />
      </div>

      {stages.map((stage, idx) => (
        <div key={stage.id} className="tpl-cycle-diagram-editor__stage-card">
          <div className="tpl-cycle-diagram-editor__stage-header">
            <span className="tpl-cycle-diagram-editor__stage-label">
              Stage {idx + 1}
            </span>
            <button
              onClick={() => removeStage(idx)}
              className="tpl-cycle-diagram-editor__remove-btn"
              aria-label={`Remove stage ${idx + 1}`}
              disabled={readOnly}
            >
              ×
            </button>
          </div>
          <div className="tpl-cycle-diagram-editor__field">
            <label
              className="tpl-cycle-diagram-editor__label"
              htmlFor={`cd-label-${idx}`}
            >
              Label
            </label>
            <input
              id={`cd-label-${idx}`}
              type="text"
              className="tpl-cycle-diagram-editor__input"
              value={stage.label}
              onChange={(e) => updateStage(idx, 'label', e.target.value)}
              placeholder="Stage name"
              disabled={readOnly}
            />
          </div>
          <div className="tpl-cycle-diagram-editor__field">
            <label
              className="tpl-cycle-diagram-editor__label"
              htmlFor={`cd-desc-${idx}`}
            >
              Description
            </label>
            <textarea
              id={`cd-desc-${idx}`}
              className="tpl-cycle-diagram-editor__textarea"
              value={stage.description ?? ''}
              onChange={(e) => updateStage(idx, 'description', e.target.value)}
              rows={2}
              placeholder="Stage description (optional)"
              disabled={readOnly}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addStage}
        className="tpl-cycle-diagram-editor__add-btn"
        disabled={readOnly || stages.length >= 8}
        title={stages.length >= 8 ? 'Maximum 8 stages' : 'Add new stage'}
      >
        + Add Stage
      </button>
    </div>
  );
};
