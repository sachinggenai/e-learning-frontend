import React, { useEffect, useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './GuidedPractice.css';

interface GuidedStep {
  id: string;
  instruction: string;
  hint?: string;
  expectedOutcome?: string;
}

interface GuidedPracticeData {
  title?: string;
  intro?: string;
  steps?: GuidedStep[];
  showHintsByDefault?: boolean;
}

function normalizeSteps(steps: GuidedStep[] | undefined): GuidedStep[] {
  if (!Array.isArray(steps) || steps.length === 0) {
    return [
      { id: 'step-1', instruction: 'Read the task instruction and complete the first action.', hint: 'Start with the basics.', expectedOutcome: 'Step 1 completed.' },
      { id: 'step-2', instruction: 'Continue to the next action and verify your result.', hint: 'Check your output before moving on.', expectedOutcome: 'Step 2 completed.' },
    ];
  }
  return steps.map((s, i) => ({
    id: s.id || `step-${i + 1}`,
    instruction: s.instruction || `Step ${i + 1}`,
    hint: s.hint,
    expectedOutcome: s.expectedOutcome,
  }));
}

export const GuidedPracticePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as GuidedPracticeData;
  const title = d.title || 'Guided Practice';
  const intro = d.intro || '';
  const steps = useMemo(() => normalizeSteps(d.steps), [d.steps]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});

  const currentStep = steps[currentIndex];
  const allComplete = completedIds.size === steps.length;

  useEffect(() => {
    if (!currentStep) return;
    onInteraction?.({
      componentId,
      interactionType: 'guided_step_viewed',
      interactionId: currentStep.id,
      value: { stepIndex: currentIndex + 1 },
      completed: false,
    });
  }, [componentId, currentIndex, currentStep, onInteraction]);

  useEffect(() => {
    if (d.showHintsByDefault) {
      const next: Record<string, boolean> = {};
      steps.forEach((s) => {
        next[s.id] = true;
      });
      setOpenHints(next);
    }
  }, [d.showHintsByDefault, steps]);

  const toggleHint = (stepId: string) => {
    setOpenHints((prev) => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      onInteraction?.({
        componentId,
        interactionType: 'guided_step_hint_toggled',
        interactionId: stepId,
        value: { expanded: !!next[stepId] },
        completed: false,
      });
      return next;
    });
  };

  const toggleComplete = (stepId: string, checked: boolean) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(stepId);
      } else {
        next.delete(stepId);
      }

      onInteraction?.({
        componentId,
        interactionType: 'guided_step_completed',
        interactionId: stepId,
        value: { checked },
        completed: false,
      });

      if (next.size === steps.length) {
        onInteraction?.({
          componentId,
          interactionType: 'guided_practice_completed',
          value: { completedSteps: next.size, totalSteps: steps.length },
          completed: true,
        });
        onComplete?.(componentId);
      }

      return next;
    });
  };

  if (!currentStep) return null;

  return (
    <section className="tpl-guided-practice">
      <h3 className="tpl-guided-practice__title">{title}</h3>
      {intro && <p className="tpl-guided-practice__intro">{intro}</p>}

      <div className="tpl-guided-practice__stepper" aria-label="Guided practice steps">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            className={`tpl-guided-practice__step ${idx === currentIndex ? 'is-active' : ''} ${completedIds.has(step.id) ? 'is-complete' : ''}`}
            aria-label={`Step ${idx + 1}`}
            onClick={() => setCurrentIndex(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <article className="tpl-guided-practice__card">
        <h4 className="tpl-guided-practice__step-title">Step {currentIndex + 1}</h4>
        <p className="tpl-guided-practice__instruction">{currentStep.instruction}</p>

        {currentStep.hint && (
          <div className="tpl-guided-practice__hint-wrap">
            <button
              type="button"
              className="tpl-guided-practice__hint-toggle"
              aria-expanded={!!openHints[currentStep.id]}
              onClick={() => toggleHint(currentStep.id)}
            >
              {openHints[currentStep.id] ? 'Hide hint' : 'Show hint'}
            </button>
            {openHints[currentStep.id] && (
              <div className="tpl-guided-practice__hint" role="region">
                {currentStep.hint}
              </div>
            )}
          </div>
        )}

        {currentStep.expectedOutcome && (
          <p className="tpl-guided-practice__outcome">
            Expected outcome: {currentStep.expectedOutcome}
          </p>
        )}

        <label className="tpl-guided-practice__complete">
          <input
            type="checkbox"
            checked={completedIds.has(currentStep.id)}
            onChange={(e) => toggleComplete(currentStep.id, e.target.checked)}
          />
          Mark this step complete
        </label>
      </article>

      <div className="tpl-guided-practice__actions">
        <button type="button" onClick={() => setCurrentIndex((v) => Math.max(0, v - 1))} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((v) => Math.min(steps.length - 1, v + 1))}
          disabled={currentIndex === steps.length - 1}
        >
          Next
        </button>
        <span className="tpl-guided-practice__progress">{completedIds.size} / {steps.length} completed</span>
      </div>

      {allComplete && <p className="tpl-guided-practice__done" role="status">All steps complete.</p>}
    </section>
  );
};

export const GuidedPracticeEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as GuidedPracticeData;
  const steps = normalizeSteps(d.steps);

  const update = (patch: Partial<GuidedPracticeData>) => onChange({ data: { ...d, ...patch } });

  const updateStep = (idx: number, patch: Partial<GuidedStep>) => {
    const next = [...steps];
    next[idx] = { ...next[idx], ...patch };
    update({ steps: next });
  };

  const addStep = () => {
    update({
      steps: [...steps, { id: `step-${steps.length + 1}`, instruction: `Step ${steps.length + 1}`, hint: '', expectedOutcome: '' }],
    });
  };

  const removeStep = (idx: number) => {
    update({ steps: steps.filter((_, i) => i !== idx) });
  };

  return (
    <section className="tpl-guided-practice-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Intro
        <textarea rows={2} value={d.intro ?? ''} onChange={(e) => update({ intro: e.target.value })} />
      </label>
      <label className="tpl-guided-practice-editor__checkbox">
        <input
          type="checkbox"
          checked={d.showHintsByDefault ?? false}
          onChange={(e) => update({ showHintsByDefault: e.target.checked })}
        />
        Show hints by default
      </label>

      {steps.map((step, idx) => (
        <fieldset key={step.id} className="tpl-guided-practice-editor__step">
          <legend>Step {idx + 1}</legend>
          <label>
            Instruction
            <input value={step.instruction} onChange={(e) => updateStep(idx, { instruction: e.target.value })} />
          </label>
          <label>
            Hint
            <input value={step.hint ?? ''} onChange={(e) => updateStep(idx, { hint: e.target.value })} />
          </label>
          <label>
            Expected outcome
            <input value={step.expectedOutcome ?? ''} onChange={(e) => updateStep(idx, { expectedOutcome: e.target.value })} />
          </label>
          <button type="button" onClick={() => removeStep(idx)} disabled={steps.length <= 1}>Remove step</button>
        </fieldset>
      ))}

      <button type="button" onClick={addStep}>Add Step</button>
    </section>
  );
};
