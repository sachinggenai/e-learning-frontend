/**
 * KnowledgeCheck Component — Assessment
 *
 * A lightweight inline quiz (1-3 questions) used for informal knowledge checks
 * during a lesson. No formal scoring — shows correct/incorrect feedback only.
 */

import React, { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface KCOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface KCQuestion {
  id: string;
  question: string;
  options: KCOption[];
  explanation?: string;
}

// ─── Preview ─────────────────────────────────────────────────────
export const KnowledgeCheckPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const questions: KCQuestion[] = data.questions || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = useCallback(
    (questionId: string, optionId: string) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [submitted]
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);

    let correctCount = 0;
    for (const q of questions) {
      const selectedOpt = q.options.find((o) => o.id === answers[q.id]);
      if (selectedOpt?.isCorrect) correctCount++;
    }

    onInteraction?.({
      componentId,
      interactionType: 'submit',
      interactionId: 'knowledge-check',
      value: answers,
      score: correctCount,
      maxScore: questions.length,
      isCorrect: correctCount === questions.length,
      completed: true,
    });

    onComplete?.(componentId);
  }, [answers, questions, componentId, onInteraction, onComplete]);

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="knowledge-check" role="region" aria-label="Knowledge Check">
      <h3 className="knowledge-check__title">{data.title || 'Knowledge Check'}</h3>

      {questions.map((q, idx) => (
        <div key={q.id} className="knowledge-check__question">
          <p className="knowledge-check__question-text">
            {idx + 1}. {q.question}
          </p>
          <div className="knowledge-check__options" role="radiogroup">
            {q.options.map((opt) => {
              const isSelected = answers[q.id] === opt.id;
              let cls = '';
              if (submitted) {
                if (opt.isCorrect) cls = 'kc-option--correct';
                else if (isSelected) cls = 'kc-option--incorrect';
              }
              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={isSelected}
                  className={`kc-option ${isSelected ? 'kc-option--selected' : ''} ${cls}`}
                  onClick={() => handleSelect(q.id, opt.id)}
                  disabled={submitted}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
          {submitted && q.explanation && (
            <p className="knowledge-check__explanation">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted && (
        <button className="knowledge-check__submit" onClick={handleSubmit} disabled={!allAnswered}>
          Check Answers
        </button>
      )}

      {submitted && (
        <button className="knowledge-check__retry" onClick={() => { setSubmitted(false); setAnswers({}); }}>
          Try Again
        </button>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const KnowledgeCheckEditor: React.FC<ComponentEditorProps> = ({
  componentId,
  data,
  onChange,
}) => {
  const questions: KCQuestion[] = data.questions || [];

  const updateQuestions = (updated: KCQuestion[]) => {
    onChange({ data: { ...data, questions: updated } });
  };

  const addQuestion = () => {
    updateQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        question: '',
        options: [
          { id: `o-${Date.now()}-1`, text: '', isCorrect: true },
          { id: `o-${Date.now()}-2`, text: '', isCorrect: false },
        ],
        explanation: '',
      },
    ]);
  };

  return (
    <div className="knowledge-check-editor">
      <div className="editor-field">
        <label>Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Knowledge Check"
        />
      </div>

      {questions.map((q, qIdx) => (
        <div key={q.id} className="kc-editor__question">
          <div className="kc-editor__question-header">
            <span>Question {qIdx + 1}</span>
            <button onClick={() => updateQuestions(questions.filter((qq) => qq.id !== q.id))} title="Remove question">
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={q.question}
            onChange={(e) =>
              updateQuestions(questions.map((qq) => (qq.id === q.id ? { ...qq, question: e.target.value } : qq)))
            }
            placeholder="Question text..."
          />
          {q.options.map((opt) => (
            <div key={opt.id} className="kc-editor__option-row">
              <input
                type="radio"
                name={`correct-${q.id}`}
                checked={opt.isCorrect}
                onChange={() =>
                  updateQuestions(
                    questions.map((qq) =>
                      qq.id === q.id
                        ? { ...qq, options: qq.options.map((o) => ({ ...o, isCorrect: o.id === opt.id })) }
                        : qq
                    )
                  )
                }
                title="Mark correct"
              />
              <input
                type="text"
                value={opt.text}
                onChange={(e) =>
                  updateQuestions(
                    questions.map((qq) =>
                      qq.id === q.id
                        ? { ...qq, options: qq.options.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o)) }
                        : qq
                    )
                  )
                }
                placeholder="Option text..."
              />
            </div>
          ))}
          <textarea
            value={q.explanation || ''}
            onChange={(e) =>
              updateQuestions(questions.map((qq) => (qq.id === q.id ? { ...qq, explanation: e.target.value } : qq)))
            }
            placeholder="Explanation (shown after answering)..."
            rows={2}
          />
        </div>
      ))}

      <button onClick={addQuestion}>
        <Plus size={14} /> Add Question
      </button>
    </div>
  );
};

export default { preview: KnowledgeCheckPreview, editor: KnowledgeCheckEditor };
