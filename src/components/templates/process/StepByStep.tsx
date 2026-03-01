/**
 * StepByStep — Guided step-by-step process.
 *
 * Preview: Numbered steps with progress tracking.
 * Editor: Add/remove steps with title, description, and optional image.
 *
 * Category: process-flow
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './StepByStep.css';

interface Step {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const StepByStepPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
  componentId,
}) => {
  const steps: Step[] = data?.steps ?? [];
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);

  const goToStep = useCallback((idx: number) => {
    if (idx < 0 || idx >= steps.length) return;
    setActiveStep(idx);
    setMaxVisited((prev) => {
      const next = Math.max(prev, idx);
      onInteraction?.({
        interactionType: 'step-navigate',
        componentId: componentId ?? '',
        interactionId: steps[idx].id,
        value: idx,
      });
      if (next === steps.length - 1) onComplete?.(componentId ?? '');
      return next;
    });
  }, [steps, onInteraction, onComplete, componentId]);

  if (steps.length === 0) {
    return <div className="tpl-step-by-step__empty">No steps configured.</div>;
  }

  const step = steps[activeStep];

  return (
    <div className="tpl-step-by-step">
      {data?.title && <h3 className="tpl-step-by-step__title">{data.title}</h3>}

      {/* Progress indicators */}
      <div className="tpl-step-by-step__progress">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => goToStep(idx)}
              className={`tpl-step-by-step__step-button ${
                idx === activeStep
                  ? 'tpl-step-by-step__step-button--active'
                  : idx <= maxVisited
                  ? 'tpl-step-by-step__step-button--visited'
                  : 'tpl-step-by-step__step-button--unvisited'
              }`}
              aria-label={`Step ${idx + 1}: ${s.title}`}
              aria-current={idx === activeStep ? 'step' : undefined}
            >
              {idx + 1}
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`tpl-step-by-step__connector ${
                  idx < maxVisited
                    ? 'tpl-step-by-step__connector--visited'
                    : 'tpl-step-by-step__connector--unvisited'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current step content */}
      <div className="tpl-step-by-step__content">
        <h4 className="tpl-step-by-step__step-title">
          Step {activeStep + 1}: {step.title}
        </h4>
        {step.imageUrl && (
          <img
            src={step.imageUrl}
            alt={step.title}
            className="tpl-step-by-step__image"
          />
        )}
        <p className="tpl-step-by-step__description">{step.description}</p>
      </div>

      {/* Navigation */}
      <div className="tpl-step-by-step__nav">
        <button
          onClick={() => goToStep(activeStep - 1)}
          disabled={activeStep === 0}
          className="tpl-step-by-step__button tpl-step-by-step__button--secondary"
        >
          ← Previous
        </button>
        <button
          onClick={() => goToStep(activeStep + 1)}
          disabled={activeStep === steps.length - 1}
          className="tpl-step-by-step__button tpl-step-by-step__button--primary"
        >
          {activeStep === steps.length - 1 ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const StepByStepEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const steps: Step[] = data?.steps ?? [];

  const updateStep = (idx: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, steps: updated } });
  };

  const addStep = () => {
    onChange({
      data: {
        ...data,
        steps: [...steps, { id: `step-${Date.now()}`, title: '', description: '' }],
      },
    });
  };

  const removeStep = (idx: number) => {
    onChange({ data: { ...data, steps: steps.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="tpl-step-by-step-editor">
      <div className="tpl-step-by-step-editor__field">
        <label className="tpl-step-by-step-editor__label" htmlFor="sbs-title">Title</label>
        <input
          id="sbs-title"
          type="text"
          className="tpl-step-by-step-editor__input"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Step-by-Step Guide"
          disabled={readOnly}
        />
      </div>

      {steps.map((step, idx) => (
        <div key={step.id} className="tpl-step-by-step-editor__step-card">
          <div className="tpl-step-by-step-editor__step-header">
            <span className="tpl-step-by-step-editor__step-label">Step {idx + 1}</span>
            <button
              onClick={() => removeStep(idx)}
              className="tpl-step-by-step-editor__remove-btn"
              aria-label={`Remove step ${idx + 1}`}
              disabled={readOnly}
            >
              ×
            </button>
          </div>
          <div className="tpl-step-by-step-editor__field">
            <label className="tpl-step-by-step-editor__label" htmlFor={`sbs-title-${idx}`}>Title</label>
            <input
              id={`sbs-title-${idx}`}
              type="text"
              className="tpl-step-by-step-editor__input"
              value={step.title}
              onChange={(e) => updateStep(idx, 'title', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div className="tpl-step-by-step-editor__field">
            <label className="tpl-step-by-step-editor__label" htmlFor={`sbs-desc-${idx}`}>Description</label>
            <textarea
              id={`sbs-desc-${idx}`}
              className="tpl-step-by-step-editor__textarea"
              value={step.description}
              onChange={(e) => updateStep(idx, 'description', e.target.value)}
              rows={3}
              disabled={readOnly}
            />
          </div>
          <div className="tpl-step-by-step-editor__field">
            <label className="tpl-step-by-step-editor__label" htmlFor={`sbs-image-${idx}`}>Image URL (optional)</label>
            <input
              id={`sbs-image-${idx}`}
              type="text"
              className="tpl-step-by-step-editor__input"
              value={step.imageUrl ?? ''}
              onChange={(e) => updateStep(idx, 'imageUrl', e.target.value)}
              placeholder="https://..."
              disabled={readOnly}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addStep}
        className="tpl-step-by-step-editor__add-btn"
        disabled={readOnly}
      >
        + Add Step
      </button>
    </div>
  );
};
