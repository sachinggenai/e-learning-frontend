/**
 * MultipleSelect Component — Assessment
 *
 * Preview: Multiple answers can be selected (checkboxes). Supports proportional or all-or-nothing scoring.
 * Editor: Question and option management with multiple correct answers.
 */

import React, { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface MSOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// ─── Preview ─────────────────────────────────────────────────────
export const MultipleSelectPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const options: MSOption[] = data.options || [];
  const partialCreditMode: string = data.partialCreditMode || 'proportional';
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = useCallback(
    (optionId: string) => {
      if (submitted) return;
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(optionId)) next.delete(optionId);
        else next.add(optionId);
        return next;
      });
    },
    [submitted]
  );

  const handleSubmit = useCallback(() => {
    if (selectedIds.size === 0) return;
    setSubmitted(true);

    const correctIds = new Set(options.filter((o) => o.isCorrect).map((o) => o.id));
    let score = 0;
    const maxScore = data.maxScore ?? 1;

    if (partialCreditMode === 'all-or-nothing') {
      const allCorrectSelected = Array.from(correctIds).every((id) => selectedIds.has(id));
      const noIncorrectSelected = Array.from(selectedIds).every((id) => correctIds.has(id));
      score = allCorrectSelected && noIncorrectSelected ? maxScore : 0;
    } else {
      // Proportional
      let hits = 0;
      let falsePositives = 0;
      Array.from(selectedIds).forEach((id) => {
        if (correctIds.has(id)) hits++;
        else falsePositives++;
      });
      const raw = Math.max(0, hits - falsePositives);
      score = correctIds.size > 0 ? Math.round((raw / correctIds.size) * maxScore) : maxScore;
    }

    const isCorrect = score === maxScore;

    onInteraction?.({
      componentId,
      interactionType: 'submit',
      interactionId: 'multiple-select',
      value: Array.from(selectedIds),
      score,
      maxScore,
      isCorrect,
      completed: true,
    });

    onComplete?.(componentId);
  }, [selectedIds, options, componentId, data.maxScore, partialCreditMode, onInteraction, onComplete]);

  return (
    <div className="multiple-select-component" role="group" aria-labelledby={`ms-q-${componentId}`}>
      <h3 id={`ms-q-${componentId}`} className="ms__question">{data.question || 'Select all that apply'}</h3>
      <p className="ms__hint">Select all correct answers</p>

      <div className="ms__options">
        {options.map((option) => {
          const checked = selectedIds.has(option.id);
          let stateClass = '';
          if (submitted) {
            if (option.isCorrect) stateClass = 'ms__option--correct';
            else if (checked && !option.isCorrect) stateClass = 'ms__option--incorrect';
          }

          return (
            <label key={option.id} className={`ms__option ${checked ? 'ms__option--selected' : ''} ${stateClass}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(option.id)}
                disabled={submitted}
                aria-label={option.text}
              />
              <span className="ms__option-text">{option.text}</span>
              {submitted && option.isCorrect && <span className="ms__correct-mark">✓</span>}
            </label>
          );
        })}
      </div>

      {!submitted && (
        <button className="ms__submit-btn" onClick={handleSubmit} disabled={selectedIds.size === 0}>
          Submit
        </button>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const MultipleSelectEditor: React.FC<ComponentEditorProps> = ({
  componentId,
  data,
  onChange,
}) => {
  const options: MSOption[] = data.options || [];

  const updateOptions = (newOptions: MSOption[]) => {
    onChange({ data: { ...data, options: newOptions } });
  };

  const addOption = () => {
    updateOptions([...options, { id: `opt-${Date.now()}`, text: '', isCorrect: false }]);
  };

  const removeOption = (id: string) => {
    updateOptions(options.filter((o) => o.id !== id));
  };

  const updateOption = (id: string, field: keyof MSOption, value: any) => {
    updateOptions(options.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  return (
    <div className="ms-editor">
      <div className="ms-editor__field">
        <label>Question</label>
        <textarea
          value={data.question || ''}
          onChange={(e) => onChange({ data: { ...data, question: e.target.value } })}
          placeholder="Enter your question..."
          rows={2}
        />
      </div>

      <div className="ms-editor__field">
        <label>Partial Credit Mode</label>
        <select
          value={data.partialCreditMode || 'proportional'}
          onChange={(e) => onChange({ data: { ...data, partialCreditMode: e.target.value } })}
        >
          <option value="proportional">Proportional</option>
          <option value="all-or-nothing">All or Nothing</option>
        </select>
      </div>

      <div className="ms-editor__options">
        <label>Options (check all correct answers)</label>
        {options.map((option) => (
          <div key={option.id} className="ms-editor__option-row">
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={(e) => updateOption(option.id, 'isCorrect', e.target.checked)}
              title="Mark as correct"
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => updateOption(option.id, 'text', e.target.value)}
              placeholder="Option text..."
              className="ms-editor__option-input"
            />
            <button onClick={() => removeOption(option.id)} className="ms-editor__remove-btn" title="Remove option">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={addOption} className="ms-editor__add-btn">
          <Plus size={14} /> Add Option
        </button>
      </div>
    </div>
  );
};

export default { preview: MultipleSelectPreview, editor: MultipleSelectEditor };
