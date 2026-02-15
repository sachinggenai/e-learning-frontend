/**
 * Fill in the Blanks Component — Assessment
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface BlankItem {
  id: string;
  correctAnswer: string;
  alternatives?: string[];
}

// ─── Preview ─────────────────────────────────────────────────────
export const FillBlanksPreview: React.FC<ComponentPreviewProps> = ({
  componentId, data, onInteraction, onComplete,
}) => {
  const blanks: BlankItem[] = data.blanks || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!submitted) return {};
    const r: Record<string, boolean> = {};
    blanks.forEach((blank) => {
      const userAnswer = (answers[blank.id] || '').trim().toLowerCase();
      const correct = blank.correctAnswer.trim().toLowerCase();
      const alts = (blank.alternatives || []).map((a) => a.trim().toLowerCase());
      r[blank.id] = userAnswer === correct || alts.includes(userAnswer);
    });
    return r;
  }, [submitted, blanks, answers]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const correctCount = Object.values(results).filter(Boolean).length;
    onInteraction?.({
      componentId, interactionType: 'submit', value: answers,
      score: correctCount, maxScore: blanks.length,
      isCorrect: correctCount === blanks.length, completed: true,
    });
    onComplete?.(componentId);
  }, [results, answers, blanks.length, componentId, onInteraction, onComplete]);

  // Parse template text with {{blank_id}} placeholders
  const renderedContent = useMemo(() => {
    const text: string = data.templateText || '';
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) => {
      const match = part.match(/^\{\{(.+)\}\}$/);
      if (!match) return <span key={i}>{part}</span>;
      const blankId = match[1];
      return (
        <span key={i} className="fill-blank__inline">
          <input
            type="text"
            className={`fill-blank__input ${submitted ? (results[blankId] ? 'fill-blank__input--correct' : 'fill-blank__input--incorrect') : ''}`}
            value={answers[blankId] || ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [blankId]: e.target.value }))}
            disabled={submitted}
            aria-label={`Blank ${blankId}`}
            placeholder="..."
          />
          {submitted && !results[blankId] && (
            <span className="fill-blank__correct-answer">
              {blanks.find((b) => b.id === blankId)?.correctAnswer}
            </span>
          )}
        </span>
      );
    });
  }, [data.templateText, answers, submitted, results, blanks]);

  return (
    <div className="fill-blanks-component">
      <h3 className="fill-blanks__title">{data.title || 'Fill in the Blanks'}</h3>
      <div className="fill-blanks__content">{renderedContent}</div>
      {!submitted && (
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const FillBlanksEditor: React.FC<ComponentEditorProps> = ({ data, onChange, readOnly }) => {
  const blanks: BlankItem[] = data.blanks || [];

  const update = useCallback((updates: Record<string, any>) => {
    onChange({ data: { ...data, ...updates } });
  }, [data, onChange]);

  const addBlank = useCallback(() => {
    const id = `blank-${Date.now()}`;
    update({
      blanks: [...blanks, { id, correctAnswer: '', alternatives: [] }],
      templateText: (data.templateText || '') + ` {{${id}}}`,
    });
  }, [blanks, data.templateText, update]);

  return (
    <div className="fill-blanks-editor">
      <div className="form-group">
        <label htmlFor="fb-title">Title</label>
        <input id="fb-title" className="form-input" value={data.title || ''} onChange={(e) => update({ title: e.target.value })} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="fb-template">Template Text</label>
        <p className="form-help">Use {'{{blank_id}}'} to mark blanks</p>
        <textarea id="fb-template" className="form-textarea" rows={4} value={data.templateText || ''} onChange={(e) => update({ templateText: e.target.value })} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label>Blanks</label>
        {blanks.map((blank, i) => (
          <div key={blank.id} className="fill-blanks-editor__blank-row">
            <code>{`{{${blank.id}}}`}</code>
            <input className="form-input" value={blank.correctAnswer} onChange={(e) => {
              const newBlanks = [...blanks]; newBlanks[i] = { ...blank, correctAnswer: e.target.value }; update({ blanks: newBlanks });
            }} placeholder="Correct answer..." disabled={readOnly} />
          </div>
        ))}
        {!readOnly && <button className="btn btn-sm btn-secondary" onClick={addBlank}>+ Add Blank</button>}
      </div>
    </div>
  );
};
