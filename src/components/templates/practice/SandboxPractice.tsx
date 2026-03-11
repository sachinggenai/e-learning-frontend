import React, { useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './SandboxPractice.css';

interface SandboxPracticeData {
  title?: string;
  prompt?: string;
  placeholder?: string;
  referenceAnswer?: string;
  minChars?: number;
  allowReveal?: boolean;
}

export const SandboxPracticePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as SandboxPracticeData;
  const title = d.title || 'Sandbox Practice';
  const prompt = d.prompt || '';
  const placeholder = d.placeholder || 'Type your response here...';
  const referenceAnswer = d.referenceAnswer || '';
  const minChars = Math.max(0, Number(d.minChars) || 0);
  const allowReveal = d.allowReveal !== false;

  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = value.trim().length >= minChars;

  const handleChange = (next: string) => {
    setValue(next);
    onInteraction?.({
      componentId,
      interactionType: 'sandbox_input_changed',
      value: { length: next.length },
      completed: false,
    });
  };

  const complete = (method: 'submit' | 'reveal') => {
    onInteraction?.({
      componentId,
      interactionType: 'sandbox_completed',
      value: { method, length: value.trim().length },
      completed: true,
    });
    onComplete?.(componentId);
  };

  const handleSubmit = () => {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    if (revealed || !allowReveal) {
      complete('submit');
    }
  };

  const handleReveal = () => {
    if (!allowReveal) return;
    setRevealed(true);
    onInteraction?.({
      componentId,
      interactionType: 'sandbox_reference_revealed',
      value: {},
      completed: false,
    });

    if (canSubmit) {
      complete('reveal');
    }
  };

  const handleReset = () => {
    setValue('');
    setSubmitted(false);
    setRevealed(false);
    onInteraction?.({
      componentId,
      interactionType: 'sandbox_reset',
      value: {},
      completed: false,
    });
  };

  return (
    <section className="tpl-sandbox">
      <h3 className="tpl-sandbox__title">{title}</h3>
      {prompt && <p className="tpl-sandbox__prompt">{prompt}</p>}

      <label className="tpl-sandbox__label" htmlFor={`${componentId}-sandbox-input`}>
        Your response
      </label>
      <textarea
        id={`${componentId}-sandbox-input`}
        className="tpl-sandbox__input"
        rows={7}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
      />

      <p className="tpl-sandbox__meta" aria-live="polite">
        {value.trim().length} / {minChars} minimum characters
      </p>

      <div className="tpl-sandbox__actions">
        <button type="button" onClick={handleSubmit} disabled={!canSubmit || submitted}>Submit</button>
        {allowReveal && (
          <button type="button" onClick={handleReveal} disabled={revealed || !referenceAnswer}>Reveal Reference</button>
        )}
        <button type="button" onClick={handleReset}>Reset</button>
      </div>

      {revealed && referenceAnswer && (
        <div className="tpl-sandbox__reference" role="region">
          <h4>Reference Answer</h4>
          <p>{referenceAnswer}</p>
          <ul>
            <li>Compare your structure with the reference.</li>
            <li>Check if key points are present.</li>
            <li>Revise your answer and retry if needed.</li>
          </ul>
        </div>
      )}

      {submitted && canSubmit && <p className="tpl-sandbox__submitted">Response submitted.</p>}
    </section>
  );
};

export const SandboxPracticeEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as SandboxPracticeData;
  const update = (patch: Partial<SandboxPracticeData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-sandbox-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Prompt
        <textarea rows={2} value={d.prompt ?? ''} onChange={(e) => update({ prompt: e.target.value })} />
      </label>
      <label>
        Placeholder
        <input value={d.placeholder ?? ''} onChange={(e) => update({ placeholder: e.target.value })} />
      </label>
      <label>
        Reference answer
        <textarea rows={3} value={d.referenceAnswer ?? ''} onChange={(e) => update({ referenceAnswer: e.target.value })} />
      </label>
      <label>
        Minimum characters
        <input
          type="number"
          min={0}
          value={d.minChars ?? 0}
          onChange={(e) => update({ minChars: Math.max(0, Number(e.target.value)) })}
        />
      </label>
      <label className="tpl-sandbox-editor__checkbox">
        <input type="checkbox" checked={d.allowReveal !== false} onChange={(e) => update({ allowReveal: e.target.checked })} />
        Allow reveal
      </label>
    </section>
  );
};
