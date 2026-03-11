import React, { useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './DiscussionPrompt.css';

interface DiscussionPromptData {
  title?: string;
  prompt?: string;
  placeholder?: string;
  minChars?: number;
  allowAnonymous?: boolean;
}

export const DiscussionPromptPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as DiscussionPromptData;
  const title = d.title || 'Discussion Prompt';
  const prompt = d.prompt || '';
  const placeholder = d.placeholder || 'Share your thoughts…';
  const minChars = Math.max(0, Number(d.minChars) || 0);

  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (value: string) => {
    setText(value);
    onInteraction?.({
      componentId,
      interactionType: 'discussion_input_changed',
      value: { length: value.length },
      completed: false,
    });
  };

  const handleSubmit = () => {
    if (text.trim().length < minChars) return;
    setSubmitted(true);
    onInteraction?.({
      componentId,
      interactionType: 'discussion_submitted',
      value: { response: text },
      completed: true,
    });
    onComplete?.(componentId);
  };

  if (submitted) {
    return (
      <section className="tpl-discussion">
        <h3 className="tpl-discussion__title">{title}</h3>
        <div className="tpl-discussion__success" role="status">
          <p>Your response has been submitted. Thank you!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="tpl-discussion">
      <h3 className="tpl-discussion__title">{title}</h3>
      {prompt && <div className="tpl-discussion__prompt">{prompt}</div>}
      <div className="tpl-discussion__input">
        <label htmlFor={`${componentId}-textarea`} className="tpl-discussion__label">
          Your response
        </label>
        <textarea
          id={`${componentId}-textarea`}
          className="tpl-discussion__textarea"
          rows={5}
          placeholder={placeholder}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          aria-describedby={minChars > 0 ? `${componentId}-hint` : undefined}
        />
        {minChars > 0 && (
          <p
            id={`${componentId}-hint`}
            className="tpl-discussion__meta"
            aria-live="polite"
          >
            {text.length} / {minChars} characters minimum
          </p>
        )}
      </div>
      <button
        type="button"
        className="tpl-discussion__submit"
        disabled={text.trim().length < minChars}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </section>
  );
};

export const DiscussionPromptEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as DiscussionPromptData;
  const update = (patch: Partial<DiscussionPromptData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-discussion-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Prompt
        <textarea rows={3} value={d.prompt ?? ''} onChange={(e) => update({ prompt: e.target.value })} />
      </label>
      <label>
        Placeholder text
        <input value={d.placeholder ?? ''} onChange={(e) => update({ placeholder: e.target.value })} />
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
      <label className="tpl-discussion-editor__checkbox">
        <input
          type="checkbox"
          checked={d.allowAnonymous ?? false}
          onChange={(e) => update({ allowAnonymous: e.target.checked })}
        />
        Allow anonymous responses
      </label>
    </section>
  );
};
