import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './PreAssessment.css';

export interface DiagnosticQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'short';
  prompt: string;
  options?: string[];
  correctAnswer?: string | boolean;
  weight?: number;
}

export interface PreAssessmentData {
  title?: string;
  instructions?: string;
  questions?: DiagnosticQuestion[];
  passThreshold?: number;
  timed?: boolean;
  durationMins?: number;
}

type Answers = Record<string, string | boolean>;

export const PreAssessmentPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as PreAssessmentData;
  const title = d.title?.trim() || 'Pre-Assessment';
  const instructions = d.instructions?.trim() || 'Answer the following questions to the best of your ability.';
  const questions = d.questions ?? [];
  const passThreshold = d.passThreshold ?? 70;

  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const setAnswer = (qId: string, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    onInteraction?.({
      componentId,
      interactionType: 'pre_assessment_started',
      interactionId: 'submit',
      value: answers,
      completed: false,
    });

    let totalWeight = 0;
    let earnedWeight = 0;
    questions.forEach((q) => {
      const w = q.weight ?? 1;
      totalWeight += w;
      const given = answers[q.id];
      if (q.type !== 'short' && given !== undefined && given === q.correctAnswer) {
        earnedWeight += w;
      }
    });

    const pct = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    setScore(pct);
    setSubmitted(true);

    onInteraction?.({
      componentId,
      interactionType: 'pre_assessment_submitted',
      interactionId: 'result',
      value: { score: pct, passed: pct >= passThreshold },
      completed: true,
    });
    onComplete?.(componentId);
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  if (submitted && score !== null) {
    const passed = score >= passThreshold;
    return (
      <article className="tpl-pre-assessment">
        <header className="tpl-pre-assessment__header">
          <h2 className="tpl-pre-assessment__title">
            <ClipboardList size={20} className="tpl-pre-assessment__title-icon" />
            {title}
          </h2>
        </header>
        <div className={`tpl-pre-assessment__result tpl-pre-assessment__result--${passed ? 'pass' : 'fail'}`}>
          <CheckCircle2 size={32} className="tpl-pre-assessment__result-icon" />
          <p className="tpl-pre-assessment__result-score">Your score: {score}%</p>
          <p className="tpl-pre-assessment__result-status">
            {passed ? 'You passed the pre-assessment.' : `Pass threshold is ${passThreshold}%. Keep learning!`}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="tpl-pre-assessment">
      <header className="tpl-pre-assessment__header">
        <h2 className="tpl-pre-assessment__title">
          <ClipboardList size={20} className="tpl-pre-assessment__title-icon" />
          {title}
        </h2>
        <p className="tpl-pre-assessment__instructions">{instructions}</p>
        {d.timed && d.durationMins ? (
          <p className="tpl-pre-assessment__timer">
            <Clock size={16} /> Time limit: {d.durationMins} min
          </p>
        ) : null}
      </header>

      {questions.length === 0 ? (
        <p className="tpl-pre-assessment__empty">No questions configured yet.</p>
      ) : (
        <ol className="tpl-pre-assessment__questions">
          {questions.map((q, idx) => (
            <li key={q.id} className="tpl-pre-assessment__question">
              <p className="tpl-pre-assessment__question-prompt">
                <span className="tpl-pre-assessment__question-num">{idx + 1}.</span> {q.prompt}
              </p>

              {q.type === 'mcq' && q.options ? (
                <ul className="tpl-pre-assessment__options" role="radiogroup" aria-label={q.prompt}>
                  {q.options.map((opt) => (
                    <li key={opt} className="tpl-pre-assessment__option">
                      <label className="tpl-pre-assessment__option-label">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswer(q.id, opt)}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : q.type === 'true-false' ? (
                <ul className="tpl-pre-assessment__options" role="radiogroup" aria-label={q.prompt}>
                  {(['True', 'False'] as const).map((val) => (
                    <li key={val} className="tpl-pre-assessment__option">
                      <label className="tpl-pre-assessment__option-label">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={val}
                          checked={answers[q.id] === (val === 'True')}
                          onChange={() => setAnswer(q.id, val === 'True')}
                        />
                        {val}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <textarea
                  className="tpl-pre-assessment__short-answer"
                  rows={3}
                  placeholder="Write your answer here"
                  value={(answers[q.id] as string) ?? ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  aria-label={q.prompt}
                />
              )}
            </li>
          ))}
        </ol>
      )}

      {questions.length > 0 && (
        <button
          type="button"
          className="tpl-pre-assessment__submit"
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          Submit Assessment
        </button>
      )}
    </article>
  );
};

export const PreAssessmentEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as PreAssessmentData;

  const update = (patch: Partial<PreAssessmentData>) =>
    onChange({ data: { ...d, ...patch } });

  const questions = d.questions ?? [];

  const addQuestion = () => {
    const newQ: DiagnosticQuestion = {
      id: `q-${Date.now()}`,
      type: 'mcq',
      prompt: '',
      options: ['Option A', 'Option B'],
      correctAnswer: 'Option A',
    };
    update({ questions: [...questions, newQ] });
  };

  const removeQuestion = (id: string) =>
    update({ questions: questions.filter((q) => q.id !== id) });

  const updateQuestion = (id: string, patch: Partial<DiagnosticQuestion>) =>
    update({ questions: questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) });

  return (
    <section className="tpl-pre-assessment-editor">
      <div className="tpl-pre-assessment-editor__field">
        <label className="tpl-pre-assessment-editor__label" htmlFor="pa-title">Title</label>
        <input
          id="pa-title"
          className="tpl-pre-assessment-editor__input"
          type="text"
          value={d.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Pre-Assessment"
        />
      </div>

      <div className="tpl-pre-assessment-editor__field">
        <label className="tpl-pre-assessment-editor__label" htmlFor="pa-instructions">Instructions</label>
        <textarea
          id="pa-instructions"
          className="tpl-pre-assessment-editor__textarea"
          rows={3}
          value={d.instructions ?? ''}
          onChange={(e) => update({ instructions: e.target.value })}
          placeholder="Answer the following questions..."
        />
      </div>

      <div className="tpl-pre-assessment-editor__row">
        <div className="tpl-pre-assessment-editor__field">
          <label className="tpl-pre-assessment-editor__label" htmlFor="pa-threshold">Pass Threshold (%)</label>
          <input
            id="pa-threshold"
            className="tpl-pre-assessment-editor__input tpl-pre-assessment-editor__input--short"
            type="number"
            min={0}
            max={100}
            value={d.passThreshold ?? 70}
            onChange={(e) => update({ passThreshold: Number(e.target.value) })}
          />
        </div>

        <div className="tpl-pre-assessment-editor__field">
          <label className="tpl-pre-assessment-editor__checkbox-label" htmlFor="pa-timed">
            <input
              id="pa-timed"
              type="checkbox"
              checked={Boolean(d.timed)}
              onChange={(e) => update({ timed: e.target.checked })}
            />
            Timed assessment
          </label>
        </div>
      </div>

      {d.timed && (
        <div className="tpl-pre-assessment-editor__field">
          <label className="tpl-pre-assessment-editor__label" htmlFor="pa-duration">Duration (minutes)</label>
          <input
            id="pa-duration"
            className="tpl-pre-assessment-editor__input tpl-pre-assessment-editor__input--short"
            type="number"
            min={1}
            value={d.durationMins ?? 10}
            onChange={(e) => update({ durationMins: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="tpl-pre-assessment-editor__questions">
        <h3 className="tpl-pre-assessment-editor__section-title">Questions</h3>
        {questions.map((q, idx) => (
          <div key={q.id} className="tpl-pre-assessment-editor__question-block">
            <div className="tpl-pre-assessment-editor__question-head">
              <span className="tpl-pre-assessment-editor__question-num">Q{idx + 1}</span>
              <select
                className="tpl-pre-assessment-editor__select"
                value={q.type}
                onChange={(e) => updateQuestion(q.id, { type: e.target.value as DiagnosticQuestion['type'] })}
                aria-label="Question type"
              >
                <option value="mcq">MCQ</option>
                <option value="true-false">True / False</option>
                <option value="short">Short Answer</option>
              </select>
              <button
                type="button"
                className="tpl-pre-assessment-editor__remove-btn"
                onClick={() => removeQuestion(q.id)}
                aria-label="Remove question"
              >
                Remove
              </button>
            </div>
            <textarea
              className="tpl-pre-assessment-editor__textarea"
              rows={2}
              value={q.prompt}
              onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
              placeholder="Question prompt"
              aria-label="Question prompt"
            />
          </div>
        ))}
        <button
          type="button"
          className="tpl-pre-assessment-editor__add-btn"
          onClick={addQuestion}
        >
          + Add Question
        </button>
      </div>
    </section>
  );
};
