/**
 * Process Map — Swimlane-based process diagram showing parallel workflows.
 *
 * Preview: Horizontal swimlanes with steps and connections showing process flow.
 * Editor: Add/remove lanes and steps, configure actors and transitions.
 *
 * Category: process-flow
 */

import React, { useCallback, useMemo } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './ProcessMap.css';

interface ProcessMapStep {
  id: string;
  label: string;
  description?: string;
}

interface ProcessMapLane {
  id: string;
  label: string;
  actor?: string;
  steps: ProcessMapStep[];
}

interface ProcessMapConnection {
  from: string;
  to: string;
  label?: string;
}

interface ProcessMapData {
  title?: string;
  lanes: ProcessMapLane[];
  connections?: ProcessMapConnection[];
}

// ─── Preview ──────────────────────────────────────────────────────
export const ProcessMapPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  const componentData = (data ?? {}) as ProcessMapData;
  const lanes = componentData.lanes ?? [];

  // Keep hook order stable by computing derived values before any early return.
  const maxSteps = useMemo(() => {
    return Math.max(...lanes.map((l) => l.steps?.length ?? 0), 1);
  }, [lanes]);

  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  if (!lanes || lanes.length === 0) {
    return <div className="tpl-process-map__empty">No process map configured.</div>;
  }

  const svgHeight = lanes.length * 100 + 60;
  const svgWidth = Math.max(500, maxSteps * 120 + 100);

  return (
    <div className="tpl-process-map">
      {componentData.title && (
        <h3 className="tpl-process-map__title">{componentData.title}</h3>
      )}

      <div className="tpl-process-map__canvas">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="tpl-process-map__svg"
        >
          {/* Draw swimlanes and steps */}
          {lanes.map((lane, laneIdx) => {
            const laneY = laneIdx * 100 + 30;
            const steps = lane.steps ?? [];

            return (
              <g key={lane.id}>
                {/* Swimlane background */}
                <rect
                  x="10"
                  y={laneY}
                  width={svgWidth - 20}
                  height="80"
                  className="tpl-process-map__lane"
                />

                {/* Lane label */}
                <text
                  x="15"
                  y={laneY + 45}
                  className="tpl-process-map__lane-label"
                >
                  {lane.label}
                </text>

                {/* Steps in this lane */}
                {steps.map((step, stepIdx) => {
                  const stepX = 120 + stepIdx * 120;
                  const stepY = laneY + 40;

                  return (
                    <g key={step.id}>
                      {/* Step box */}
                      <rect
                        x={stepX}
                        y={stepY - 20}
                        width="80"
                        height="40"
                        rx="4"
                        className="tpl-process-map__step-box"
                      />
                      {/* Step text */}
                      <text
                        x={stepX + 40}
                        y={stepY + 5}
                        className="tpl-process-map__step-label"
                        textAnchor="middle"
                      >
                        {step.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Lanes summary */}
      <div className="tpl-process-map__lanes-summary">
        {lanes.map((lane) => (
          <div key={lane.id} className="tpl-process-map__lane-item">
            <div className="tpl-process-map__lane-item-name">{lane.label}</div>
            <div className="tpl-process-map__lane-item-steps">
              {lane.steps?.length ?? 0} step{(lane.steps?.length ?? 0) !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ProcessMapEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const componentData = (data ?? {}) as ProcessMapData;
  const lanes = componentData.lanes ?? [];

  const updateLane = useCallback(
    (laneIdx: number, field: keyof ProcessMapLane, value: string) => {
      const updated = [...lanes];
      updated[laneIdx] = { ...updated[laneIdx], [field]: value };
      onChange({ data: { ...componentData, lanes: updated } });
    },
    [lanes, componentData, onChange]
  );

  const addLane = useCallback(() => {
    onChange({
      data: {
        ...componentData,
        lanes: [
          ...lanes,
          { id: `lane-${Date.now()}`, label: '', actor: '', steps: [] },
        ],
      },
    });
  }, [lanes, componentData, onChange]);

  const removeLane = useCallback(
    (laneIdx: number) => {
      onChange({
        data: {
          ...componentData,
          lanes: lanes.filter((_, i) => i !== laneIdx),
        },
      });
    },
    [lanes, componentData, onChange]
  );

  const addStepToLane = useCallback(
    (laneIdx: number) => {
      const updated = [...lanes];
      updated[laneIdx] = {
        ...updated[laneIdx],
        steps: [
          ...(updated[laneIdx].steps ?? []),
          { id: `step-${Date.now()}`, label: '', description: '' },
        ],
      };
      onChange({ data: { ...componentData, lanes: updated } });
    },
    [lanes, componentData, onChange]
  );

  const updateStep = useCallback(
    (laneIdx: number, stepIdx: number, field: keyof ProcessMapStep, value: string) => {
      const updated = [...lanes];
      const steps = [...(updated[laneIdx].steps ?? [])];
      steps[stepIdx] = { ...steps[stepIdx], [field]: value };
      updated[laneIdx] = { ...updated[laneIdx], steps };
      onChange({ data: { ...componentData, lanes: updated } });
    },
    [lanes, componentData, onChange]
  );

  const removeStep = useCallback(
    (laneIdx: number, stepIdx: number) => {
      const updated = [...lanes];
      const steps = updated[laneIdx].steps ?? [];
      updated[laneIdx] = {
        ...updated[laneIdx],
        steps: steps.filter((_, i) => i !== stepIdx),
      };
      onChange({ data: { ...componentData, lanes: updated } });
    },
    [lanes, componentData, onChange]
  );

  return (
    <div className="tpl-process-map-editor">
      <div className="tpl-process-map-editor__field">
        <label className="tpl-process-map-editor__label" htmlFor="pm-title">
          Title
        </label>
        <input
          id="pm-title"
          type="text"
          className="tpl-process-map-editor__input"
          value={componentData.title ?? ''}
          onChange={(e) =>
            onChange({
              data: { ...componentData, title: e.target.value },
            })
          }
          placeholder="Process Map"
          disabled={readOnly}
        />
      </div>

      {lanes.map((lane, laneIdx) => (
        <div key={lane.id} className="tpl-process-map-editor__lane-card">
          <div className="tpl-process-map-editor__lane-header">
            <span className="tpl-process-map-editor__lane-label">Lane {laneIdx + 1}</span>
            <button
              onClick={() => removeLane(laneIdx)}
              className="tpl-process-map-editor__remove-btn"
              aria-label={`Remove lane ${laneIdx + 1}`}
              disabled={readOnly}
            >
              ×
            </button>
          </div>

          <div className="tpl-process-map-editor__field">
            <label
              className="tpl-process-map-editor__label"
              htmlFor={`pm-lane-name-${laneIdx}`}
            >
              Lane Name
            </label>
            <input
              id={`pm-lane-name-${laneIdx}`}
              type="text"
              className="tpl-process-map-editor__input"
              value={lane.label}
              onChange={(e) => updateLane(laneIdx, 'label', e.target.value)}
              placeholder="Actor/Department"
              disabled={readOnly}
            />
          </div>

          {/* Steps in this lane */}
          {(lane.steps ?? []).map((step, stepIdx) => (
            <div key={step.id} className="tpl-process-map-editor__step-card">
              <div className="tpl-process-map-editor__step-header">
                <span className="tpl-process-map-editor__step-number">
                  Step {stepIdx + 1}
                </span>
                <button
                  onClick={() => removeStep(laneIdx, stepIdx)}
                  className="tpl-process-map-editor__remove-btn"
                  aria-label={`Remove step ${stepIdx + 1}`}
                  disabled={readOnly}
                >
                  ×
                </button>
              </div>
              <div className="tpl-process-map-editor__field">
                <label
                  className="tpl-process-map-editor__label"
                  htmlFor={`pm-step-label-${laneIdx}-${stepIdx}`}
                >
                  Step Label
                </label>
                <input
                  id={`pm-step-label-${laneIdx}-${stepIdx}`}
                  type="text"
                  className="tpl-process-map-editor__input"
                  value={step.label}
                  onChange={(e) =>
                    updateStep(laneIdx, stepIdx, 'label', e.target.value)
                  }
                  placeholder="Step name"
                  disabled={readOnly}
                />
              </div>
            </div>
          ))}

          <button
            onClick={() => addStepToLane(laneIdx)}
            className="tpl-process-map-editor__add-step-btn"
            disabled={readOnly}
          >
            + Add Step
          </button>
        </div>
      ))}

      <button
        onClick={addLane}
        className="tpl-process-map-editor__add-lane-btn"
        disabled={readOnly}
      >
        + Add Lane
      </button>
    </div>
  );
};
