import React, { useEffect, useState } from 'react';
import { FileSearch, CheckCircle2, BarChart2 } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './DiagnosticQuiz.css';

export interface TopicQuestion {
  id: string;
  type: 'mcq' | 'true-false';
  topic: string;
  prompt: string;
  options?: string[];
  correctAnswer?: string | boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ProficiencyBand {
  label: string;
  min: number;
  max: number;
}

export interface DiagnosticQuizData {
  title?: string;
  topics?: string[];
  questions?: TopicQuestion[];
  proficiencyBands?: ProficiencyBand[];
  allowRetry?: boolean;
}

type Answers = Record<string, string | boolean>;

function getBand(score: number, bands: ProficiencyBand[]): string {
  const match = bands.find((b) => score >= b.min && score <= b.max);
  return match?.label ?? 'Unknown';
}

export const DiagnosticQuizPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as DiagnosticQuizData;
  const title = d.title?.trim() || 'Diagnostic Quiz';
  const questions = d.questions ?? [];
  const topics = d.topics ?? [];
  const bands = d.proficiencyBands ?? [
    { label: 'Beginner', min: 0, max: 49 },
    { label: 'Intermediate', min: 50, max: 79 },
    { label: 'Advanced', min: 80, max: 100 },
  ];

  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [topicScores, setTopicScores] = useState<Record<string, number>>({});

  const setAnswer = (qId: string, value: string | boolean) =>
    setAnswers((prev) => ({ ...prev, [qId]: value }));

  useEffect(() => {
    onInteraction?.({
      componentId,
      interactionType: 'topic_quiz_started',
      interactionId: 'start',
      value: topics,
      completed: false,
    });
  }, [componentId, onInteraction, topics]);

  const handleSubmit = () => {
    const scores: Record<string, { earned: number; total: number }> = {};
    questions.forEach((q) => {
      if (!scores[q.topic]) scores[q.topic] = { earned: 0, total: 0 };
      scores[q.topic].total += 1;
      if (answers[q.id] !== undefined && answers[q.id] === q.correctAnswer) {
        scores[q.topic].earned += 1;
      }
    });

    const pcts: Record<string, number> = {};
    Object.entries(scores).forEach(([topic, { earned, total }]) => {
      pcts[topic] = Math.round((earned / total) * 100);
    });

    Object.entries(pcts).forEach(([topic, score]) => {
      onInteraction?.({
        componentId,
        interactionType: 'topic_completed',
        interactionId: topic,
        value: score,
        completed: false,
      });
    });

    setTopicScores(pcts);
    setSubmitted(true);

    onInteraction?.({
      componentId,
      interactionType: 'diagnostic_quiz_finished',
      interactionId: 'result',
      value: pcts,
      completed: true,
    });
    onComplete?.(componentId);
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  if (submitted) {
    return (
      <article className="tpl-diagnostic-quiz">
        <header className="tpl-diagnostic-quiz__header">
          <h2 className="tpl-diagnostic-quiz__title">
            <FileSearch size={20} className="tpl-diagnostic-quiz__title-icon" />
            {title} — Results
          </h2>
        </header>
        <ul className="tpl-diagnostic-quiz__results">
          {Object.entries(topicScores).map(([topic, score]) => (
            <li key={topic} className="tpl-diagnostic-quiz__result-row">
              <BarChart2 size={16} className="tpl-diagnostic-quiz__result-icon" />
              <span className="tpl-diagnostic-quiz__topic-name">{topic}</span>
              <span className="tpl-diagnostic-quiz__topic-score">{score}%</span>
              <span className="tpl-diagnostic-quiz__topic-band">{getBand(score, bands)}</span>
            </li>
          ))}
        </ul>
        {d.allowRetry && (
          <button
            type="button"
            className="tpl-diagnostic-quiz__retry"
            onClick={() => { setAnswers({}); setSubmitted(false); }}
          >
            Retry Quiz
          </button>
        )}
      </article>
    );
  }

  return (
    <article className="tpl-diagnostic-quiz">
      <header className="tpl-diagnostic-quiz__header">
        <h2 className="tpl-diagnostic-quiz__title">
          <FileSearch size={20} className="tpl-diagnostic-quiz__title-icon" />
          {title}
        </h2>
        {topics.length > 0 && (
          <div className="tpl-diagnostic-quiz__topics">
            {topics.map((t) => (
              <span key={t} className="tpl-diagnostic-quiz__topic-tag">{t}</span>
            ))}
          </div>
        )}
      </header>

      {questions.length === 0 ? (
        <p className="tpl-diagnostic-quiz__empty">No questions configured yet.</p>
      ) : (
        <ol className="tpl-diagnostic-quiz__questions">
          {questions.map((q, idx) => (
            <li key={q.id} className="tpl-diagnostic-quiz__question">
              <p className="tpl-diagnostic-quiz__question-prompt">
                <span className="tpl-diagnostic-quiz__question-num">{idx + 1}.</span> {q.prompt}
                {q.difficulty && (
                  <span className={`tpl-diagnostic-quiz__difficulty tpl-diagnostic-quiz__difficulty--${q.difficulty}`}>
                    {q.difficulty}
                  </span>
                )}
              </p>

              {q.type === 'mcq' && q.options ? (
                <ul className="tpl-diagnostic-quiz__options" role="radiogroup" aria-label={q.prompt}>
                  {q.options.map((opt) => (
                    <li key={opt} className="tpl-diagnostic-quiz__option">
                      <label className="tpl-diagnostic-quiz__option-label">
                        <input
                          type="radio"
                          name={`dq-${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswer(q.id, opt)}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="tpl-diagnostic-quiz__options" role="radiogroup" aria-label={q.prompt}>
                  {(['True', 'False'] as const).map((val) => (
                    <li key={val} className="tpl-diagnostic-quiz__option">
                      <label className="tpl-diagnostic-quiz__option-label">
                        <input
                          type="radio"
                          name={`dq-${q.id}`}
                          value={val}
                          checked={answers[q.id] === (val === 'True')}
                          onChange={() => setAnswer(q.id, val === 'True')}
                        />
                        {val}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}

      {questions.length > 0 && (
        <button
          type="button"
          className="tpl-diagnostic-quiz__submit"
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          <CheckCircle2 size={16} />
          Submit Quiz
        </button>
      )}
    </article>
  );
};

export const DiagnosticQuizEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as DiagnosticQuizData;

  const update = (patch: Partial<DiagnosticQuizData>) =>
    onChange({ data: { ...d, ...patch } });

  const questions = d.questions ?? [];
  const topics = d.topics ?? [];

  const addQuestion = () => {
    const newQ: TopicQuestion = {
      id: `dq-${Date.now()}`,
      type: 'mcq',
      topic: topics[0] ?? 'General',
      prompt: '',
      options: ['Option A', 'Option B'],
      correctAnswer: 'Option A',
      difficulty: 'medium',
    };
    update({ questions: [...questions, newQ] });
  };

  const removeQuestion = (id: string) =>
    update({ questions: questions.filter((q) => q.id !== id) });

  const addTopic = () =>
    update({ topics: [...topics, `Topic ${topics.length + 1}`] });

  const updateTopic = (idx: number, val: string) => {
    const next = [...topics];
    next[idx] = val;
    update({ topics: next });
  };

  const removeTopic = (idx: number) =>
    update({ topics: topics.filter((_, i) => i !== idx) });

  return (
    <section className="tpl-diagnostic-quiz-editor">
      <div className="tpl-diagnostic-quiz-editor__field">
        <label className="tpl-diagnostic-quiz-editor__label" htmlFor="dq-title">Title</label>
        <input
          id="dq-title"
          className="tpl-diagnostic-quiz-editor__input"
          type="text"
          value={d.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Diagnostic Quiz"
        />
      </div>

      <div className="tpl-diagnostic-quiz-editor__field">
        <span className="tpl-diagnostic-quiz-editor__label">Topics</span>
        {topics.map((t, i) => (
          <div key={i} className="tpl-diagnostic-quiz-editor__topic-row">
            <input
              className="tpl-diagnostic-quiz-editor__input"
              type="text"
              value={t}
              onChange={(e) => updateTopic(i, e.target.value)}
              placeholder="Topic name"
              aria-label={`Topic ${i + 1}`}
            />
            <button
              type="button"
              className="tpl-diagnostic-quiz-editor__remove-btn"
              onClick={() => removeTopic(i)}
              aria-label="Remove topic"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="tpl-diagnostic-quiz-editor__add-btn" onClick={addTopic}>
          + Add Topic
        </button>
      </div>

      <div className="tpl-diagnostic-quiz-editor__field">
        <label className="tpl-diagnostic-quiz-editor__checkbox-label" htmlFor="dq-retry">
          <input
            id="dq-retry"
            type="checkbox"
            checked={Boolean(d.allowRetry)}
            onChange={(e) => update({ allowRetry: e.target.checked })}
          />
          Allow retry
        </label>
      </div>

      <div className="tpl-diagnostic-quiz-editor__questions">
        <h3 className="tpl-diagnostic-quiz-editor__section-title">Questions ({questions.length})</h3>
        {questions.map((q, idx) => (
          <div key={q.id} className="tpl-diagnostic-quiz-editor__question-block">
            <div className="tpl-diagnostic-quiz-editor__question-head">
              <span className="tpl-diagnostic-quiz-editor__question-num">Q{idx + 1}</span>
              <button
                type="button"
                className="tpl-diagnostic-quiz-editor__remove-btn"
                onClick={() => removeQuestion(q.id)}
                aria-label="Remove question"
              >
                Remove
              </button>
            </div>
            <textarea
              className="tpl-diagnostic-quiz-editor__textarea"
              rows={2}
              value={q.prompt}
              onChange={(e) => {
                const questions2 = questions.map((x) =>
                  x.id === q.id ? { ...x, prompt: e.target.value } : x
                );
                update({ questions: questions2 });
              }}
              placeholder="Question prompt"
              aria-label="Question prompt"
            />
          </div>
        ))}
        <button type="button" className="tpl-diagnostic-quiz-editor__add-btn" onClick={addQuestion}>
          + Add Question
        </button>
      </div>
    </section>
  );
};
