/**
 * FinalAssessment Component — Assessment
 *
 * A comprehensive end-of-course assessment that aggregates multiple question types.
 * Shows results summary at the end with pass/fail status.
 */

import React, { useState, useCallback } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface FAQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank';
  question: string;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer?: string | boolean;
  points: number;
  explanation?: string;
}

// ─── Preview ─────────────────────────────────────────────────────
export const FinalAssessmentPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const questions: FAQuestion[] = data.questions || [];
  const passingScore: number = data.passingScore || 70;
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ score: number; maxScore: number; passed: boolean } | null>(null);

  const handleAnswer = useCallback((questionId: string, value: any) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);

    let totalScore = 0;
    let maxScore = 0;

    for (const q of questions) {
      maxScore += q.points;
      const answer = answers[q.id];

      switch (q.type) {
        case 'mcq': {
          const correct = q.options?.find((o) => o.isCorrect)?.id;
          if (answer === correct) totalScore += q.points;
          break;
        }
        case 'true-false': {
          if (answer === q.correctAnswer) totalScore += q.points;
          break;
        }
        case 'fill-blank': {
          const normalized = String(answer || '').trim().toLowerCase();
          const correctNorm = String(q.correctAnswer || '').trim().toLowerCase();
          if (normalized === correctNorm) totalScore += q.points;
          break;
        }
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= passingScore;
    setResults({ score: totalScore, maxScore, passed });

    onInteraction?.({
      componentId,
      interactionType: 'submit',
      interactionId: 'final-assessment',
      value: answers,
      score: totalScore,
      maxScore,
      isCorrect: passed,
      completed: true,
    });

    onComplete?.(componentId);
  }, [answers, questions, componentId, passingScore, onInteraction, onComplete]);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  return (
    <div className="final-assessment" role="region" aria-label="Final Assessment">
      <h2 className="final-assessment__title">{data.title || 'Final Assessment'}</h2>
      {data.instructions && <p className="final-assessment__instructions">{data.instructions}</p>}

      <div className="final-assessment__questions">
        {questions.map((q, idx) => (
          <div key={q.id} className="fa-question">
            <p className="fa-question__text">
              <strong>{idx + 1}.</strong> {q.question}
              <span className="fa-question__points">({q.points} pts)</span>
            </p>

            {q.type === 'mcq' && q.options && (
              <div className="fa-question__options" role="radiogroup">
                {q.options.map((opt) => {
                  let cls = '';
                  if (submitted) {
                    if (opt.isCorrect) cls = 'fa-option--correct';
                    else if (answers[q.id] === opt.id && !opt.isCorrect) cls = 'fa-option--incorrect';
                  }
                  return (
                    <label key={opt.id} className={`fa-option ${answers[q.id] === opt.id ? 'fa-option--selected' : ''} ${cls}`}>
                      <input
                        type="radio"
                        name={`fa-${q.id}`}
                        checked={answers[q.id] === opt.id}
                        onChange={() => handleAnswer(q.id, opt.id)}
                        disabled={submitted}
                      />
                      {opt.text}
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === 'true-false' && (
              <div className="fa-question__tf" role="radiogroup">
                {[true, false].map((val) => (
                  <label key={String(val)} className={`fa-option ${answers[q.id] === val ? 'fa-option--selected' : ''}`}>
                    <input
                      type="radio"
                      name={`fa-${q.id}`}
                      checked={answers[q.id] === val}
                      onChange={() => handleAnswer(q.id, val)}
                      disabled={submitted}
                    />
                    {val ? 'True' : 'False'}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'fill-blank' && (
              <input
                type="text"
                className="fa-question__fill"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder="Type your answer..."
                disabled={submitted}
              />
            )}

            {submitted && q.explanation && (
              <p className="fa-question__explanation">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <button className="final-assessment__submit" onClick={handleSubmit} disabled={!allAnswered}>
          Submit Assessment
        </button>
      )}

      {results && (
        <div className={`final-assessment__results ${results.passed ? 'fa-results--passed' : 'fa-results--failed'}`}>
          <h3>{results.passed ? 'Congratulations! You passed!' : 'You did not pass.'}</h3>
          <p>
            Score: {results.score}/{results.maxScore} ({Math.round((results.score / results.maxScore) * 100)}%)
          </p>
          <p>Passing score: {passingScore}%</p>
        </div>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const FinalAssessmentEditor: React.FC<ComponentEditorProps> = ({
  componentId,
  data,
  onChange,
}) => {
  const questions: FAQuestion[] = data.questions || [];

  const updateQuestions = (updated: FAQuestion[]) => {
    onChange({ data: { ...data, questions: updated } });
  };

  const addQuestion = (type: 'mcq' | 'true-false' | 'fill-blank') => {
    const newQ: FAQuestion = {
      id: `faq-${Date.now()}`,
      type,
      question: '',
      points: 10,
      explanation: '',
    };
    if (type === 'mcq') {
      newQ.options = [
        { id: `o-${Date.now()}-1`, text: '', isCorrect: true },
        { id: `o-${Date.now()}-2`, text: '', isCorrect: false },
      ];
    }
    if (type === 'true-false') newQ.correctAnswer = true;
    if (type === 'fill-blank') newQ.correctAnswer = '';
    updateQuestions([...questions, newQ]);
  };

  return (
    <div className="final-assessment-editor">
      <div className="editor-field">
        <label>Assessment Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Final Assessment"
        />
      </div>

      <div className="editor-field">
        <label>Instructions</label>
        <textarea
          value={data.instructions || ''}
          onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })}
          placeholder="Answer all questions to complete the assessment..."
          rows={2}
        />
      </div>

      <div className="editor-field">
        <label>Passing Score (%)</label>
        <input
          type="number"
          value={data.passingScore || 70}
          onChange={(e) => onChange({ data: { ...data, passingScore: Number(e.target.value) } })}
          min={0}
          max={100}
        />
      </div>

      <div className="editor-field">
        <label>Questions ({questions.length})</label>
        {questions.map((q, idx) => (
          <div key={q.id} className="fa-editor__question">
            <div className="fa-editor__q-header">
              <span>Q{idx + 1} ({q.type})</span>
              <button onClick={() => updateQuestions(questions.filter((qq) => qq.id !== q.id))}>Remove</button>
            </div>
            <input
              type="text"
              value={q.question}
              onChange={(e) =>
                updateQuestions(questions.map((qq) => (qq.id === q.id ? { ...qq, question: e.target.value } : qq)))
              }
              placeholder="Question text..."
            />
            <input
              type="number"
              value={q.points}
              onChange={(e) =>
                updateQuestions(questions.map((qq) => (qq.id === q.id ? { ...qq, points: Number(e.target.value) } : qq)))
              }
              min={1}
              style={{ width: 80 }}
              title="Points"
            />
          </div>
        ))}

        <div className="fa-editor__add-buttons">
          <button onClick={() => addQuestion('mcq')}>+ MCQ</button>
          <button onClick={() => addQuestion('true-false')}>+ True/False</button>
          <button onClick={() => addQuestion('fill-blank')}>+ Fill Blank</button>
        </div>
      </div>
    </div>
  );
};

export default { preview: FinalAssessmentPreview, editor: FinalAssessmentEditor };
