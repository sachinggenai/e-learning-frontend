/**
 * True/False Component — Assessment
 */

import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

export const TrueFalsePreview: React.FC<ComponentPreviewProps> = ({
  componentId, data, onInteraction, onComplete,
}) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correctAnswer = data.correctAnswer ?? true;

  const handleSubmit = useCallback(() => {
    if (answer === null) return;
    setSubmitted(true);
    const isCorrect = answer === correctAnswer;
    onInteraction?.({
      componentId, interactionType: 'submit', value: answer,
      score: isCorrect ? (data.maxScore ?? 1) : 0, maxScore: data.maxScore ?? 1,
      isCorrect, completed: true,
    });
    onComplete?.(componentId);
  }, [answer, correctAnswer, componentId, data.maxScore, onInteraction, onComplete]);

  return (
    <div className="tf-component" role="group" aria-labelledby={`tf-q-${componentId}`}>
      <h3 id={`tf-q-${componentId}`} className="tf__question">{data.question || 'True or False?'}</h3>
      <div className="tf__options">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            role="radio"
            aria-checked={answer === val}
            className={`tf__option ${answer === val ? 'tf__option--selected' : ''} ${submitted && val === correctAnswer ? 'tf__option--correct' : ''} ${submitted && answer === val && val !== correctAnswer ? 'tf__option--incorrect' : ''}`}
            onClick={() => !submitted && setAnswer(val)}
            disabled={submitted}
          >
            {val ? 'True' : 'False'}
            {submitted && val === correctAnswer && <CheckCircle size={16} />}
            {submitted && answer === val && val !== correctAnswer && <XCircle size={16} />}
          </button>
        ))}
      </div>
      {!submitted ? (
        <button className="btn btn-primary" onClick={handleSubmit} disabled={answer === null}>Submit</button>
      ) : data.explanation && (
        <div className="tf__explanation" role="alert"><strong>Explanation:</strong> {data.explanation}</div>
      )}
    </div>
  );
};

export const TrueFalseEditor: React.FC<ComponentEditorProps> = ({ data, onChange, readOnly }) => {
  const update = useCallback((updates: Record<string, any>) => {
    onChange({ data: { ...data, ...updates } });
  }, [data, onChange]);

  return (
    <div className="tf-editor">
      <div className="form-group">
        <label htmlFor="tf-question">Statement</label>
        <textarea id="tf-question" className="form-textarea" rows={3} value={data.question || ''} onChange={(e) => update({ question: e.target.value })} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label>Correct Answer</label>
        <div className="form-radio-group">
          <label className="form-radio"><input type="radio" checked={data.correctAnswer !== false} onChange={() => update({ correctAnswer: true })} disabled={readOnly} /> True</label>
          <label className="form-radio"><input type="radio" checked={data.correctAnswer === false} onChange={() => update({ correctAnswer: false })} disabled={readOnly} /> False</label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="tf-explanation">Explanation</label>
        <textarea id="tf-explanation" className="form-textarea" rows={2} value={data.explanation || ''} onChange={(e) => update({ explanation: e.target.value })} disabled={readOnly} />
      </div>
    </div>
  );
};
