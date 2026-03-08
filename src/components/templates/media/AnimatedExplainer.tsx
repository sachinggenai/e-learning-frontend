/**
 * AnimatedExplainer — Step-by-step animated content with visual storytelling.
 *
 * Category: media-rich
 */

import React, { useState, useCallback, useEffect } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './AnimatedExplainer.css';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const AnimatedExplainerPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const steps: Step[] = data?.steps ?? [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStep = steps[currentStepIndex];

  const handleStepClick = useCallback(
    (index: number) => {
      setCurrentStepIndex(index);
      onInteraction?.({
        interactionType: 'step-viewed',
        componentId: '',
        interactionId: `step-${index}`,
        value: index,
      });

      // Mark step as completed
      setCompletedSteps((prev) => new Set(Array.from(prev).concat(index)));
    },
    [onInteraction]
  );

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      handleStepClick(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length, handleStepClick]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      handleStepClick(currentStepIndex - 1);
    }
  }, [currentStepIndex, handleStepClick]);

  // Complete when all steps viewed
  useEffect(() => {
    if (steps.length > 0 && completedSteps.size === steps.length) {
      onComplete?.('');
    }
  }, [completedSteps, steps.length, onComplete]);

  if (steps.length === 0) {
    return (
      <div className="tpl-animated-explainer" role="region" aria-label="Animated explainer">
        <div className="tpl-animated-explainer__media" role="status">
          <div className="tpl-animated-explainer__media-icon" aria-hidden="true">
            ✨
          </div>
          <p className="tpl-animated-explainer__media-text">No steps configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tpl-animated-explainer" role="region" aria-label="Animated explainer">
      {data?.title && <h3 className="tpl-animated-explainer__title">{data.title}</h3>}

      <div className="tpl-animated-explainer__media" role="img" aria-label={currentStep?.title || 'Step visualization'}>
        {currentStep?.icon && (
          <div className="tpl-animated-explainer__media-icon" key={currentStepIndex} aria-hidden="true">
            {currentStep.icon}
          </div>
        )}
        {currentStep?.title && (
          <p className="tpl-animated-explainer__media-text" key={`text-${currentStepIndex}`}>
            {currentStep.title}
          </p>
        )}
      </div>

      <div className="tpl-animated-explainer__steps" role="list">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`tpl-animated-explainer__step ${
              index === currentStepIndex ? 'tpl-animated-explainer__step--active' : ''
            }`}
            onClick={() => handleStepClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStepClick(index);
              }
            }}
            role="listitem"
            tabIndex={0}
            aria-label={`Step ${index + 1}: ${step.title}`}
            aria-current={index === currentStepIndex ? 'step' : undefined}
          >
            <div className="tpl-animated-explainer__step-number">{index + 1}</div>
            <div className="tpl-animated-explainer__step-content">
              <h4 className="tpl-animated-explainer__step-title">{step.title}</h4>
              <p className="tpl-animated-explainer__step-description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="tpl-animated-explainer__controls" role="navigation" aria-label="Step navigation">
        <button
          className="tpl-animated-explainer__control-btn"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          aria-label="Previous step"
          type="button"
        >
          ← Previous
        </button>
        <button
          className="tpl-animated-explainer__control-btn tpl-animated-explainer__control-btn--primary"
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          aria-label="Next step"
          type="button"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const AnimatedExplainerEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
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
        steps: [
          ...steps,
          {
            id: `step-${Date.now()}`,
            title: '',
            description: '',
            icon: '⭐',
          },
        ],
      },
    });
  };

  const removeStep = (idx: number) => {
    onChange({ data: { ...data, steps: steps.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="tpl-animated-explainer-editor">
      <div className="tpl-animated-explainer-editor__field">
        <label htmlFor="explainer-title" className="tpl-animated-explainer-editor__label">
          Title
        </label>
        <input
          id="explainer-title"
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Explainer Title"
          className="tpl-animated-explainer-editor__input"
          aria-label="Title"
        />
      </div>

      {steps.map((step, idx) => (
        <div key={step.id} className="tpl-animated-explainer-editor__step-card">
          <div className="tpl-animated-explainer-editor__step-header">
            <span className="tpl-animated-explainer-editor__step-title">Step {idx + 1}</span>
            <button
              onClick={() => removeStep(idx)}
              className="tpl-animated-explainer-editor__remove-btn"
              aria-label={`Remove step ${idx + 1}`}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="tpl-animated-explainer-editor__field">
            <label
              htmlFor={`step-${idx}-icon`}
              className="tpl-animated-explainer-editor__small-label"
            >
              Icon (emoji)
            </label>
            <input
              id={`step-${idx}-icon`}
              type="text"
              value={step.icon}
              onChange={(e) => updateStep(idx, 'icon', e.target.value)}
              className="tpl-animated-explainer-editor__input"
              placeholder="⭐"
            />
          </div>

          <div className="tpl-animated-explainer-editor__field">
            <label
              htmlFor={`step-${idx}-title`}
              className="tpl-animated-explainer-editor__small-label"
            >
              Step Title
            </label>
            <input
              id={`step-${idx}-title`}
              type="text"
              value={step.title}
              onChange={(e) => updateStep(idx, 'title', e.target.value)}
              className="tpl-animated-explainer-editor__input"
              placeholder="Step title"
            />
          </div>

          <div className="tpl-animated-explainer-editor__field">
            <label
              htmlFor={`step-${idx}-description`}
              className="tpl-animated-explainer-editor__small-label"
            >
              Description
            </label>
            <textarea
              id={`step-${idx}-description`}
              value={step.description}
              onChange={(e) => updateStep(idx, 'description', e.target.value)}
              className="tpl-animated-explainer-editor__textarea"
              placeholder="Step description"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addStep}
        className="tpl-animated-explainer-editor__add-btn"
        aria-label="Add new step"
        type="button"
      >
        + Add Step
      </button>
    </div>
  );
};
