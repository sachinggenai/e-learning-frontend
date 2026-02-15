/**
 * MCQ (Multiple Choice Question) Component — Assessment
 *
 * Preview: Renders question with selectable options, feedback, scoring.
 * Editor: Question and option management with correct answer marking.
 */

import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// ─── Preview ─────────────────────────────────────────────────────
export const MCQPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const options: MCQOption[] = data.options || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = useCallback((optionId: string) => {
    if (submitted) return;
    setSelectedId(optionId);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (!selectedId) return;
    setSubmitted(true);
    setShowExplanation(true);

    const selectedOption = options.find((o) => o.id === selectedId);
    const isCorrect = selectedOption?.isCorrect ?? false;

    onInteraction?.({
      componentId,
      interactionType: 'submit',
      interactionId: selectedId,
      value: selectedId,
      score: isCorrect ? (data.maxScore ?? 1) : 0,
      maxScore: data.maxScore ?? 1,
      isCorrect,
      completed: true,
    });

    onComplete?.(componentId);
  }, [selectedId, options, componentId, data.maxScore, onInteraction, onComplete]);

  const handleRetry = useCallback(() => {
    setSelectedId(null);
    setSubmitted(false);
    setShowExplanation(false);
  }, []);

  return (
    <div className="mcq-component" role="group" aria-labelledby={`mcq-question-${componentId}`}>
      <h3 id={`mcq-question-${componentId}`} className="mcq__question">{data.question || 'Question'}</h3>

      <div className="mcq__options" role="radiogroup" aria-label="Answer options">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          let stateClass = '';
          if (submitted) {
            if (option.isCorrect) stateClass = 'mcq__option--correct';
            else if (isSelected && !option.isCorrect) stateClass = 'mcq__option--incorrect';
          }

          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              className={`mcq__option ${isSelected ? 'mcq__option--selected' : ''} ${stateClass}`}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
            >
              <span className="mcq__option-indicator">
                {submitted && option.isCorrect && <CheckCircle size={18} className="icon-correct" />}
                {submitted && isSelected && !option.isCorrect && <XCircle size={18} className="icon-incorrect" />}
              </span>
              <span className="mcq__option-text">{option.text}</span>
            </button>
          );
        })}
      </div>

      <div className="mcq__actions">
        {!submitted ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!selectedId}
          >
            Submit Answer
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleRetry}>
            Try Again
          </button>
        )}
      </div>

      {showExplanation && data.explanation && (
        <div className="mcq__explanation" role="alert">
          <strong>Explanation:</strong> {data.explanation}
        </div>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const MCQEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const options: MCQOption[] = data.options || [];

  const updateData = useCallback((updates: Record<string, any>) => {
    onChange({ data: { ...data, ...updates } });
  }, [data, onChange]);

  const addOption = useCallback(() => {
    const newOption: MCQOption = {
      id: `opt-${Date.now()}`,
      text: '',
      isCorrect: false,
    };
    updateData({ options: [...options, newOption] });
  }, [options, updateData]);

  const removeOption = useCallback((index: number) => {
    if (options.length <= 2) return; // minimum 2 options
    updateData({ options: options.filter((_, i) => i !== index) });
  }, [options, updateData]);

  const updateOption = useCallback((index: number, updates: Partial<MCQOption>) => {
    const newOptions = options.map((opt, i) => {
      if (i !== index) {
        // If setting this option as correct, uncheck others (single correct)
        if (updates.isCorrect === true) {
          return { ...opt, isCorrect: false };
        }
        return opt;
      }
      return { ...opt, ...updates };
    });
    updateData({ options: newOptions });
  }, [options, updateData]);

  return (
    <div className="mcq-editor">
      <div className="form-group">
        <label htmlFor="mcq-question">Question</label>
        <textarea
          id="mcq-question"
          className="form-textarea"
          rows={3}
          value={data.question || ''}
          onChange={(e) => updateData({ question: e.target.value })}
          placeholder="Enter your question..."
          disabled={readOnly}
        />
      </div>

      <div className="form-group">
        <label>Options</label>
        <p className="form-help">Check the radio button to mark the correct answer.</p>
        {options.map((option, index) => (
          <div key={option.id} className="mcq-editor__option-row">
            <input
              type="radio"
              name="correct-answer"
              checked={option.isCorrect}
              onChange={() => updateOption(index, { isCorrect: true })}
              disabled={readOnly}
              aria-label={`Mark option ${index + 1} as correct`}
            />
            <input
              type="text"
              className="form-input"
              value={option.text}
              onChange={(e) => updateOption(index, { text: e.target.value })}
              placeholder={`Option ${index + 1}...`}
              disabled={readOnly}
              aria-label={`Option ${index + 1} text`}
            />
            {options.length > 2 && !readOnly && (
              <button
                className="btn btn-sm btn-icon btn-danger"
                onClick={() => removeOption(index)}
                aria-label={`Remove option ${index + 1}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button className="btn btn-sm btn-secondary" onClick={addOption}>
            <Plus size={14} /> Add Option
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mcq-explanation">Explanation (shown after answer)</label>
        <textarea
          id="mcq-explanation"
          className="form-textarea"
          rows={2}
          value={data.explanation || ''}
          onChange={(e) => updateData({ explanation: e.target.value })}
          placeholder="Explain the correct answer..."
          disabled={readOnly}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="mcq-max-score">Max Score</label>
          <input
            id="mcq-max-score"
            type="number"
            className="form-input"
            value={data.maxScore ?? 1}
            onChange={(e) => updateData({ maxScore: parseInt(e.target.value, 10) || 1 })}
            min={1}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
};
