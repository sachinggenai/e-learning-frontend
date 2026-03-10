import React, { useState } from 'react';
import { Lightbulb, MessageSquare, CheckCircle2 } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ReflectiveQuestion.css';

export interface ReflectiveQuestionData {
  title?: string;
  question?: string;
  promptText?: string;
  allowMultipleResponses?: boolean;
}

export const ReflectiveQuestionPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const reflectiveData = data as ReflectiveQuestionData;
  const [draftResponse, setDraftResponse] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  const title = reflectiveData.title?.trim() || 'Reflective Question';
  const question = reflectiveData.question?.trim() || 'What did you learn from this module?';
  const promptText = reflectiveData.promptText?.trim() || 'Take a moment to write your thoughts below.';
  const allowMultipleResponses = Boolean(reflectiveData.allowMultipleResponses);

  const handleSaveResponse = () => {
    const value = draftResponse.trim();
    if (!value) {
      return;
    }

    const nextResponses = allowMultipleResponses ? [...responses, value] : [value];
    setResponses(nextResponses);
    setDraftResponse(allowMultipleResponses ? '' : value);

    onInteraction?.({
      componentId,
      interactionType: 'reflection-saved',
      interactionId: `reflection-${nextResponses.length}`,
      value,
      completed: true,
    });
    onComplete?.(componentId);
  };

  const isButtonDisabled = draftResponse.trim().length === 0;

  return (
    <article className="tpl-reflective-question">
      <header className="tpl-reflective-question__header">
        <h2 className="tpl-reflective-question__title">
          <Lightbulb className="tpl-reflective-question__title-icon" size={20} />
          {title}
        </h2>
        <p className="tpl-reflective-question__question">{question}</p>
        <p className="tpl-reflective-question__prompt">{promptText}</p>
      </header>

      <div className="tpl-reflective-question__response-area">
        <label className="tpl-reflective-question__label" htmlFor="reflective-response-input">
          Your Reflection
        </label>
        <textarea
          id="reflective-response-input"
          className="tpl-reflective-question__textarea"
          value={draftResponse}
          onChange={(e) => setDraftResponse(e.target.value)}
          placeholder="Write your reflection here"
          rows={5}
        />
        <button
          type="button"
          className="tpl-reflective-question__save-btn"
          onClick={handleSaveResponse}
          disabled={isButtonDisabled}
        >
          Save Reflection
        </button>
      </div>

      {responses.length > 0 ? (
        <section className="tpl-reflective-question__responses" aria-label="Saved reflections">
          <h3 className="tpl-reflective-question__responses-title">
            <MessageSquare className="tpl-reflective-question__responses-icon" size={18} />
            Saved Reflections ({responses.length})
          </h3>
          <ul className="tpl-reflective-question__responses-list">
            {responses.map((response, index) => (
              <li key={`${response}-${index}`} className="tpl-reflective-question__response-item">
                <CheckCircle2 className="tpl-reflective-question__response-check" size={16} />
                <span>{response}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
};

export const ReflectiveQuestionEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const reflectiveData = data as ReflectiveQuestionData;

  const update = (patch: Partial<ReflectiveQuestionData>) => {
    onChange({ data: { ...reflectiveData, ...patch } });
  };

  return (
    <section className="tpl-reflective-question-editor">
      <div className="tpl-reflective-question-editor__field">
        <label className="tpl-reflective-question-editor__label" htmlFor="reflective-title">
          Title
        </label>
        <input
          id="reflective-title"
          className="tpl-reflective-question-editor__input"
          type="text"
          value={reflectiveData.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Reflective Question"
        />
      </div>

      <div className="tpl-reflective-question-editor__field">
        <label className="tpl-reflective-question-editor__label" htmlFor="reflective-question">
          Question
        </label>
        <textarea
          id="reflective-question"
          className="tpl-reflective-question-editor__textarea"
          value={reflectiveData.question ?? ''}
          onChange={(e) => update({ question: e.target.value })}
          placeholder="What did you learn from this module?"
          rows={3}
        />
      </div>

      <div className="tpl-reflective-question-editor__field">
        <label className="tpl-reflective-question-editor__label" htmlFor="reflective-prompt">
          Prompt Text
        </label>
        <textarea
          id="reflective-prompt"
          className="tpl-reflective-question-editor__textarea"
          value={reflectiveData.promptText ?? ''}
          onChange={(e) => update({ promptText: e.target.value })}
          placeholder="Take a moment to write your thoughts below."
          rows={2}
        />
      </div>

      <div className="tpl-reflective-question-editor__field tpl-reflective-question-editor__field--checkbox">
        <label className="tpl-reflective-question-editor__checkbox-label" htmlFor="reflective-allow-multiple">
          <input
            id="reflective-allow-multiple"
            className="tpl-reflective-question-editor__checkbox"
            type="checkbox"
            checked={Boolean(reflectiveData.allowMultipleResponses)}
            onChange={(e) => update({ allowMultipleResponses: e.target.checked })}
          />
          Allow multiple saved reflections
        </label>
      </div>
    </section>
  );
};
