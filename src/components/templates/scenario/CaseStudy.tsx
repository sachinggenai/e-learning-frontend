/**
 * CaseStudy — Extended scenario with context, analysis prompts and reflection.
 *
 * Category: scenario
 */

import React, { useState } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './CaseStudy.css';

interface AnalysisPrompt {
  id: string;
  question: string;
  sampleAnswer?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const CaseStudyPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const prompts: AnalysisPrompt[] = data?.prompts ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onInteraction?.({
      interactionType: 'case-study-submit',
      componentId: '',
      interactionId: 'submit',
      value: answers,
    });
    onComplete?.('');
  };

  const allAnswered = prompts.every((p) => (answers[p.id] ?? '').trim().length > 0);

  return (
    <div className="tpl-case-study" data-testid="case-study-preview">
      {data?.title && <h3 className="tpl-case-study__title">{data.title}</h3>}
      {data?.subtitle && <p className="tpl-case-study__subtitle">{data.subtitle}</p>}

      <div className="tpl-case-study__background">
        <h4 className="tpl-case-study__background-header">📋 Background</h4>
        <div className="tpl-case-study__background-text">{data?.context ?? 'No context provided.'}</div>
      </div>

      {data?.imageUrl && <img src={data.imageUrl} alt="" className="tpl-case-study__image" />}

      <div className="tpl-case-study__prompts">
        {prompts.map((p, idx) => (
          <div key={p.id} className="tpl-case-study__prompt">
            <h5 className="tpl-case-study__prompt-question">
              {idx + 1}. {p.question}
            </h5>
            <textarea
              value={answers[p.id] ?? ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [p.id]: e.target.value }))}
              placeholder="Type your analysis here…"
              rows={4}
              disabled={submitted}
              className={`tpl-case-study__prompt-input ${
                submitted ? 'tpl-case-study__prompt-input--submitted' : ''
              }`}
            />
            {submitted && p.sampleAnswer && (
              <div className="tpl-case-study__sample-container">
                <button
                  onClick={() => setShowSample((s) => ({ ...s, [p.id]: !s[p.id] }))}
                  className="tpl-case-study__sample-button"
                >
                  {showSample[p.id] ? 'Hide' : 'Show'} sample answer
                </button>
                {showSample[p.id] && (
                  <div className="tpl-case-study__sample-answer">{p.sampleAnswer}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`tpl-case-study__button tpl-case-study__button--submit ${
            !allAnswered ? 'tpl-case-study__button--disabled' : ''
          }`}
        >
          Submit Analysis
        </button>
      )}

      {submitted && (
        <div className="tpl-case-study__message tpl-case-study__message--success">
          ✓ Your analysis has been recorded. Review the sample answers above.
        </div>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const CaseStudyEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const prompts: AnalysisPrompt[] = data?.prompts ?? [];

  const updatePrompt = (idx: number, field: keyof AnalysisPrompt, value: string) => {
    const updated = [...prompts];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, prompts: updated } });
  };

  const addPrompt = () => {
    onChange({
      data: {
        ...data,
        prompts: [...prompts, { id: `p-${Date.now()}`, question: '', sampleAnswer: '' }],
      },
    });
  };

  const removePrompt = (idx: number) => {
    onChange({ data: { ...data, prompts: prompts.filter((_, i) => i !== idx) } });
  };

  const field = (label: string, key: string, multi = false, placeholder = '') => (
    <div className="tpl-case-study-editor__field">
      <label className="tpl-case-study-editor__label">{label}</label>
      {multi ? (
        <textarea
          value={data?.[key] ?? ''}
          onChange={(e) => onChange({ data: { ...data, [key]: e.target.value } })}
          placeholder={placeholder}
          rows={5}
          className="tpl-case-study-editor__textarea"
        />
      ) : (
        <input
          type="text"
          value={data?.[key] ?? ''}
          onChange={(e) => onChange({ data: { ...data, [key]: e.target.value } })}
          placeholder={placeholder}
          className="tpl-case-study-editor__input"
        />
      )}
    </div>
  );

  return (
    <div className="tpl-case-study-editor" data-testid="case-study-editor">
      {field('Title', 'title', false, 'Case Study')}
      {field('Subtitle', 'subtitle', false, 'Analyze the following scenario')}
      {field('Context / Background', 'context', true, 'Describe the case background…')}
      {field('Image URL (optional)', 'imageUrl', false, 'https://…')}

      <h5 className="tpl-case-study-editor__prompts-title">Analysis Prompts</h5>
      {prompts.map((p, idx) => (
        <div key={p.id} className="tpl-case-study-editor__prompt">
          <div className="tpl-case-study-editor__prompt-header">
            <span className="tpl-case-study-editor__prompt-name">Prompt {idx + 1}</span>
            <button onClick={() => removePrompt(idx)} className="tpl-case-study-editor__remove">
              ×
            </button>
          </div>
          <div className="tpl-case-study-editor__field">
            <label className="tpl-case-study-editor__tiny-label">Question</label>
            <input
              type="text"
              value={p.question}
              onChange={(e) => updatePrompt(idx, 'question', e.target.value)}
              className="tpl-case-study-editor__input"
            />
          </div>
          <div>
            <label className="tpl-case-study-editor__tiny-label">
              Sample Answer (shown after submission)
            </label>
            <textarea
              value={p.sampleAnswer ?? ''}
              onChange={(e) => updatePrompt(idx, 'sampleAnswer', e.target.value)}
              rows={2}
              className="tpl-case-study-editor__textarea"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addPrompt}
        className="tpl-case-study-editor__button tpl-case-study-editor__button--add"
      >
        + Add Analysis Prompt
      </button>
    </div>
  );
};
