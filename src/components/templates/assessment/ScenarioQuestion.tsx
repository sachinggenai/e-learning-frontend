/**
 * ScenarioQuestion Component — Assessment
 *
 * Presents a scenario with context/backstory, then asks a question.
 * Can include an image or description of the scenario.
 */

import React, { useState, useCallback } from 'react';
import './ScenarioQuestion.css';
import { Plus, Trash2 } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface ScenarioOption {
  id: string;
  text: string;
  points: number;
  feedback?: string;
}

// ─── Preview ─────────────────────────────────────────────────────
export const ScenarioQuestionPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const options: ScenarioOption[] = data.options || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = useCallback((id: string) => {
    if (submitted) return;
    setSelectedId(id);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (!selectedId) return;
    setSubmitted(true);

    const selected = options.find((o) => o.id === selectedId);
    const maxPoints = Math.max(...options.map((o) => o.points), 1);
    const score = selected?.points ?? 0;

    onInteraction?.({
      componentId,
      interactionType: 'submit',
      interactionId: selectedId,
      value: selectedId,
      score,
      maxScore: maxPoints,
      isCorrect: score === maxPoints,
      completed: true,
    });

    onComplete?.(componentId);
  }, [selectedId, options, componentId, onInteraction, onComplete]);

  const selectedOption = submitted ? options.find((o) => o.id === selectedId) : null;

  return (
    <div className="scenario-question" role="group" aria-labelledby={`sq-${componentId}`}>
      {/* Scenario context */}
      <div className="scenario-question__context">
        {data.scenarioImage && (
          <img src={data.scenarioImage} alt="Scenario" className="scenario-question__image" />
        )}
        <div className="scenario-question__description">
          {data.scenario || 'Read the following scenario...'}
        </div>
      </div>

      <h3 id={`sq-${componentId}`} className="scenario-question__question">
        {data.question || 'What would you do?'}
      </h3>

      <div className="scenario-question__options" role="radiogroup">
        {options.map((option) => (
          <button
            key={option.id}
            role="radio"
            aria-checked={selectedId === option.id}
            className={`scenario-question__option ${selectedId === option.id ? 'scenario-question__option--selected' : ''}`}
            onClick={() => handleSelect(option.id)}
            disabled={submitted}
          >
            {option.text}
          </button>
        ))}
      </div>

      {!submitted && (
        <button className="scenario-question__submit" onClick={handleSubmit} disabled={!selectedId}>
          Submit Answer
        </button>
      )}

      {submitted && selectedOption?.feedback && (
        <div className="scenario-question__feedback">
          {selectedOption.feedback}
        </div>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const ScenarioQuestionEditor: React.FC<ComponentEditorProps> = ({
  componentId,
  data,
  onChange,
}) => {
  const options: ScenarioOption[] = data.options || [];

  const updateOptions = (newOptions: ScenarioOption[]) => {
    onChange({ data: { ...data, options: newOptions } });
  };

  return (
    <div className="scenario-question-editor">
      <div className="editor-field">
        <label>Scenario Description</label>
        <textarea
          value={data.scenario || ''}
          onChange={(e) => onChange({ data: { ...data, scenario: e.target.value } })}
          placeholder="Describe the scenario..."
          rows={4}
        />
      </div>

      <div className="editor-field">
        <label>Question</label>
        <input
          type="text"
          value={data.question || ''}
          onChange={(e) => onChange({ data: { ...data, question: e.target.value } })}
          placeholder="What should the learner decide?"
        />
      </div>

      <div className="editor-field">
        <label>Options</label>
        {options.map((opt) => (
          <div key={opt.id} className="scenario-option-row">
            <input
              type="text"
              value={opt.text}
              onChange={(e) =>
                updateOptions(options.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o)))
              }
              placeholder="Option text..."
            />
            <input
              type="number"
              value={opt.points}
              onChange={(e) =>
                updateOptions(options.map((o) => (o.id === opt.id ? { ...o, points: Number(e.target.value) } : o)))
              }
              min={0}
              title="Points"
              style={{ width: 60 }}
            />
            <input
              type="text"
              value={opt.feedback || ''}
              onChange={(e) =>
                updateOptions(options.map((o) => (o.id === opt.id ? { ...o, feedback: e.target.value } : o)))
              }
              placeholder="Feedback..."
            />
            <button onClick={() => updateOptions(options.filter((o) => o.id !== opt.id))} title="Remove">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            updateOptions([...options, { id: `opt-${Date.now()}`, text: '', points: 0, feedback: '' }])
          }
        >
          <Plus size={14} /> Add Option
        </button>
      </div>
    </div>
  );
};

export default { preview: ScenarioQuestionPreview, editor: ScenarioQuestionEditor };
