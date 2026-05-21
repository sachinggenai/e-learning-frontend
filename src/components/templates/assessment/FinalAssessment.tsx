/**
 * FinalAssessment Component — Assessment
 */

import React, { useCallback, useMemo, useState } from 'react';
import './FinalAssessment.css';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import {
  normalizeComponentType,
  buildScoringPayload,
  validateFinalAssessmentData,
} from '../../../utils/assessmentUtils';

interface FAOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

type FAQuestionType = 'mcq' | 'multiple-select' | 'true-false' | 'fill-in-blank' | 'fill-blank';

export interface FAQuestion {
  id: string;
  type: FAQuestionType;
  question: string;
  options?: FAOption[];
  correctAnswer?: string | boolean | null;
  correctAnswers?: string[];
  caseSensitive?: boolean;
  points: number;
  explanation?: string;
  partialCreditMode?: 'proportional' | 'all-or-nothing';
}

const TYPE_LABELS: Record<string, string> = {
  mcq: 'MCQ',
  'multiple-select': 'Multi Select',
  'true-false': 'True/False',
  'fill-in-blank': 'Fill in the Blank',
};

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toCanonicalQuestionType(type: string): 'mcq' | 'multiple-select' | 'true-false' | 'fill-in-blank' {
  const normalized = normalizeComponentType(type);
  if (normalized === 'multiple-select') return 'multiple-select';
  if (normalized === 'true-false') return 'true-false';
  if (normalized === 'fill-in-blank') return 'fill-in-blank';
  return 'mcq';
}

function ensureQuestionDefaults(question: FAQuestion): FAQuestion {
  const canonical = toCanonicalQuestionType(question.type);
  const base: FAQuestion = {
    ...question,
    type: canonical,
    points: typeof question.points === 'number' && question.points > 0 ? question.points : 10,
    question: question.question || '',
  };

  if (canonical === 'mcq') {
    const options = Array.isArray(base.options) && base.options.length >= 2
      ? base.options.map((opt, idx) => ({
          id: opt.id || makeId(`opt-${idx + 1}`),
          text: opt.text || '',
          isCorrect: Boolean(opt.isCorrect),
        }))
      : [
          { id: makeId('opt'), text: '', isCorrect: true },
          { id: makeId('opt'), text: '', isCorrect: false },
        ];

    const firstCorrect = options.findIndex((opt) => opt.isCorrect);
    const normalizedOptions = options.map((opt, idx) => ({
      ...opt,
      isCorrect: firstCorrect === -1 ? idx === 0 : idx === firstCorrect,
    }));

    return { ...base, options: normalizedOptions, correctAnswer: undefined, correctAnswers: undefined };
  }

  if (canonical === 'multiple-select') {
    const options = Array.isArray(base.options) && base.options.length >= 2
      ? base.options.map((opt) => ({
          id: opt.id || makeId('opt'),
          text: opt.text || '',
          isCorrect: Boolean(opt.isCorrect),
        }))
      : [
          { id: makeId('opt'), text: '', isCorrect: true },
          { id: makeId('opt'), text: '', isCorrect: false },
        ];

    if (!options.some((opt) => opt.isCorrect)) {
      options[0].isCorrect = true;
    }

    return {
      ...base,
      options,
      correctAnswer: undefined,
      correctAnswers: undefined,
      partialCreditMode: base.partialCreditMode || 'proportional',
    };
  }

  if (canonical === 'true-false') {
    return {
      ...base,
      correctAnswer: typeof base.correctAnswer === 'boolean' ? base.correctAnswer : true,
      options: undefined,
      correctAnswers: undefined,
    };
  }

  const answers = Array.isArray(base.correctAnswers) && base.correctAnswers.length > 0
    ? base.correctAnswers
    : base.correctAnswer != null
      ? [String(base.correctAnswer)]
      : [''];

  return {
    ...base,
    type: 'fill-in-blank',
    options: undefined,
    correctAnswer: undefined,
    correctAnswers: answers,
  };
}

function scoreMultipleSelect(
  selected: string[],
  correct: string[],
  points: number,
  mode: 'proportional' | 'all-or-nothing',
): number {
  const selectedSet = new Set(selected);
  const correctSet = new Set(correct);

  if (mode === 'all-or-nothing') {
    const exactMatch =
      selectedSet.size === correctSet.size &&
      Array.from(selectedSet).every((id) => correctSet.has(id));
    return exactMatch ? points : 0;
  }

  if (correctSet.size === 0) {
    return points;
  }

  let hits = 0;
  let falsePositives = 0;

  selectedSet.forEach((id) => {
    if (correctSet.has(id)) hits += 1;
    else falsePositives += 1;
  });

  const raw = Math.max(0, hits - falsePositives);
  return Math.round((raw / correctSet.size) * points);
}

function checkFillInBlank(userInput: string, question: FAQuestion): boolean {
  const expected = question.correctAnswers?.length
    ? question.correctAnswers
    : question.correctAnswer != null
    ? [String(question.correctAnswer)]
    : [];

  const raw = userInput.trim();
  return expected.some((item) => {
    const normalizedItem = item.trim();
    if (question.caseSensitive) {
      return normalizedItem === raw;
    }
    return normalizedItem.toLowerCase() === raw.toLowerCase();
  });
}

export const FinalAssessmentPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const resolvedComponentId = componentId || data.id || 'final-assessment';
  const questions: FAQuestion[] = data.questions || [];
  const passingScore = data.passingScore ?? 80;
  const maxAttempts = data.maxAttempts ?? 1;
  const showCorrectAnswers = data.showCorrectAnswers ?? true;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [results, setResults] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  const normalizedQuestions = useMemo(
    () => questions.map((question) => ensureQuestionDefaults(question)),
    [questions],
  );

  const allAnswered = useMemo(() => {
    return normalizedQuestions.every((q) => {
      const value = answers[q.id];
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });
  }, [normalizedQuestions, answers]);

  const handleAnswer = useCallback(
    (questionId: string, value: any) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [submitted],
  );

  const handleSubmit = useCallback(() => {
    let score = 0;
    let maxScoreValue = 0;

    normalizedQuestions.forEach((q) => {
      const points = typeof q.points === 'number' && q.points > 0 ? q.points : 1;
      maxScoreValue += points;
      const qType = normalizeComponentType(q.type);
      const answer = answers[q.id];

      if (qType === 'mcq') {
        const correct = q.options?.find((o) => o.isCorrect)?.id;
        if (answer === correct) score += points;
        return;
      }

      if (qType === 'multiple-select') {
        const selectedIds = Array.isArray(answer) ? answer.map(String) : [];
        const correctIds = (q.options || []).filter((opt) => opt.isCorrect).map((opt) => opt.id);
        score += scoreMultipleSelect(selectedIds, correctIds, points, q.partialCreditMode || 'proportional');
        return;
      }

      if (qType === 'true-false') {
        if (answer === q.correctAnswer) score += points;
        return;
      }

      if (qType === 'fill-in-blank') {
        if (checkFillInBlank(String(answer ?? ''), q)) score += points;
      }
    });

    const percentage = maxScoreValue > 0 ? Math.round((score / maxScoreValue) * 100) : 0;
    const passed = percentage >= passingScore;
    const attempts = attemptsUsed + 1;

    setAttemptsUsed(attempts);
    setSubmitted(true);
    setResults({ score, maxScore: maxScoreValue, percentage, passed });

    const payload = buildScoringPayload(
      resolvedComponentId,
      'final-assessment',
      answers,
      normalizedQuestions,
    );

    onInteraction?.({
      componentId: resolvedComponentId,
      interactionType: 'submit',
      interactionId: 'final-assessment',
      value: payload,
      score,
      maxScore: maxScoreValue,
      isCorrect: passed,
      completed: true,
    });

    onComplete?.(resolvedComponentId);
  }, [
    answers,
    attemptsUsed,
    onComplete,
    onInteraction,
    passingScore,
    normalizedQuestions,
    resolvedComponentId,
  ]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  }, []);

  const remainingAttempts = maxAttempts - attemptsUsed;
  const canRetry = !results?.passed && results !== null && remainingAttempts > 0;

  return (
    <div className="final-assessment" role="region" aria-label="Final Assessment">
      {data.introText && <p className="final-assessment__intro">{data.introText}</p>}
      <h2 className="final-assessment__title">{data.title || 'Final Assessment'}</h2>
      {data.instructions && <p className="final-assessment__instructions">{data.instructions}</p>}
      <p className="final-assessment__attempts-info">
        Passing score: {passingScore}% | Max attempts: {maxAttempts}
      </p>

      <div className="final-assessment__questions">
        {normalizedQuestions.map((q, index) => {
          const qType = normalizeComponentType(q.type);
          const answer = answers[q.id];

          return (
            <div key={q.id} className="fa-question">
              <p className="fa-question__text">
                <strong>{index + 1}.</strong> {q.question}
                <span className="fa-question__points">({q.points} pts)</span>
              </p>

              {qType === 'mcq' && q.options && (
                <div className="fa-question__options" role="radiogroup">
                  {q.options.map((opt) => {
                    let optionClass = '';
                    if (submitted && showCorrectAnswers) {
                      if (opt.isCorrect) optionClass = 'fa-option--correct';
                      if (answer === opt.id && !opt.isCorrect) optionClass = 'fa-option--incorrect';
                    }
                    return (
                      <label
                        key={opt.id}
                        className={`fa-option ${answer === opt.id ? 'fa-option--selected' : ''} ${optionClass}`}
                      >
                        <input
                          type="radio"
                          name={`fa-${q.id}`}
                          checked={answer === opt.id}
                          onChange={() => handleAnswer(q.id, opt.id)}
                          disabled={submitted}
                        />
                        {opt.text}
                      </label>
                    );
                  })}
                </div>
              )}

              {qType === 'multiple-select' && q.options && (
                <div className="fa-question__options" role="group" aria-label={`Multiple select question ${index + 1}`}>
                  {q.options.map((opt) => {
                    const selectedIds = Array.isArray(answer) ? answer : [];
                    const checked = selectedIds.includes(opt.id);
                    let optionClass = '';
                    if (submitted && showCorrectAnswers) {
                      if (opt.isCorrect) optionClass = 'fa-option--correct';
                      if (checked && !opt.isCorrect) optionClass = 'fa-option--incorrect';
                    }
                    return (
                      <label
                        key={opt.id}
                        className={`fa-option ${checked ? 'fa-option--selected' : ''} ${optionClass}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = Array.isArray(answer) ? answer : [];
                            const next = current.includes(opt.id)
                              ? current.filter((id) => id !== opt.id)
                              : [...current, opt.id];
                            handleAnswer(q.id, next);
                          }}
                          disabled={submitted}
                        />
                        {opt.text}
                      </label>
                    );
                  })}
                </div>
              )}

              {qType === 'true-false' && (
                <div className="fa-question__tf" role="radiogroup">
                  {[{ label: 'True', value: true }, { label: 'False', value: false }].map((item) => {
                    let optionClass = '';
                    if (submitted && showCorrectAnswers) {
                      if (item.value === q.correctAnswer) optionClass = 'fa-option--correct';
                      if (answer === item.value && item.value !== q.correctAnswer) {
                        optionClass = 'fa-option--incorrect';
                      }
                    }
                    return (
                      <label
                        key={item.label}
                        className={`fa-option ${answer === item.value ? 'fa-option--selected' : ''} ${optionClass}`}
                      >
                        <input
                          type="radio"
                          name={`fa-${q.id}`}
                          checked={answer === item.value}
                          onChange={() => handleAnswer(q.id, item.value)}
                          disabled={submitted}
                        />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              )}

              {qType === 'fill-in-blank' && (
                <div className="fa-question__fill-wrapper">
                  <input
                    type="text"
                    className={`fa-question__fill${
                      submitted
                        ? checkFillInBlank(String(answer ?? ''), q)
                          ? ' fa-fill--correct'
                          : ' fa-fill--incorrect'
                        : ''
                    }`}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    aria-label={`Answer for question ${index + 1}`}
                    disabled={submitted}
                  />
                  {submitted && showCorrectAnswers && !checkFillInBlank(String(answer ?? ''), q) && (
                    <span className="fa-fill__correct-answer">
                      Accepted:{' '}
                      {(q.correctAnswers?.length
                        ? q.correctAnswers
                        : q.correctAnswer != null
                        ? [String(q.correctAnswer)]
                        : []
                      ).join(', ')}
                    </span>
                  )}
                </div>
              )}

              {submitted && q.explanation && (
                <p className="fa-question__explanation">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          className="final-assessment__submit btn btn-primary"
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          Submit Assessment
        </button>
      )}

      {results && (
        <div
          className={`final-assessment__results ${results.passed ? 'fa-results--passed' : 'fa-results--failed'}`}
          role="alert"
        >
          <h3>{results.passed ? 'Congratulations! You passed!' : 'You did not pass.'}</h3>
          <p>
            Score: {results.score}/{results.maxScore} ({results.percentage}%)
          </p>
          <p>Passing score: {passingScore}%</p>
          {maxAttempts > 1 && (
            <p>
              Attempt {attemptsUsed} of {maxAttempts}
            </p>
          )}
          {canRetry && (
            <button className="btn btn-secondary" onClick={handleRetry}>
              Try Again ({remainingAttempts} attempt{remainingAttempts === 1 ? '' : 's'} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const FinalAssessmentEditor: React.FC<ComponentEditorProps> = ({
  componentId: _componentId,
  data,
  onChange,
  readOnly,
}) => {
  const questions: FAQuestion[] = useMemo(
    () => (Array.isArray(data.questions) ? data.questions.map((q: FAQuestion) => ensureQuestionDefaults(q)) : []),
    [data.questions],
  );
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const updateData = useCallback(
    (updates: Record<string, any>) => {
      onChange({ data: { ...data, ...updates } });
    },
    [data, onChange],
  );

  const updateQuestions = useCallback(
    (nextQuestions: FAQuestion[]) => {
      updateData({ questions: nextQuestions });
    },
    [updateData],
  );

  const addQuestion = useCallback(
    (type: 'mcq' | 'multiple-select' | 'true-false' | 'fill-in-blank') => {
      const question = ensureQuestionDefaults({
        id: makeId('faq'),
        type,
        question: '',
        points: 10,
      } as FAQuestion);

      updateQuestions([...questions, question]);
      setExpandedIds((prev) => [...prev, question.id]);
    },
    [questions, updateQuestions],
  );

  const switchQuestionType = useCallback((question: FAQuestion, targetType: 'mcq' | 'multiple-select' | 'true-false' | 'fill-in-blank') => {
    const next = ensureQuestionDefaults({ ...question, type: targetType });
    updateQuestions(questions.map((item) => (item.id === question.id ? next : item)));
  }, [questions, updateQuestions]);

  const updateQuestion = useCallback((questionId: string, updates: Partial<FAQuestion>) => {
    updateQuestions(
      questions.map((item) =>
        item.id === questionId ? ensureQuestionDefaults({ ...item, ...updates }) : item,
      ),
    );
  }, [questions, updateQuestions]);

  const removeQuestion = useCallback((questionId: string) => {
    updateQuestions(questions.filter((item) => item.id !== questionId));
    setExpandedIds((prev) => prev.filter((id) => id !== questionId));
  }, [questions, updateQuestions]);

  const moveQuestion = useCallback((index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;

    const next = [...questions];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    updateQuestions(next);
  }, [questions, updateQuestions]);

  const toggleExpanded = useCallback((questionId: string) => {
    setExpandedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    );
  }, []);

  const updateOption = useCallback((questionId: string, optionId: string, updates: Partial<FAOption>) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        const options = (question.options || []).map((option) =>
          option.id === optionId ? { ...option, ...updates } : option,
        );
        return { ...question, options };
      }),
    );
  }, [questions, updateQuestions]);

  const toggleOptionCorrect = useCallback((questionId: string, optionId: string, checked: boolean) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        const qType = toCanonicalQuestionType(question.type);
        const options = (question.options || []).map((option) => {
          if (qType === 'mcq') {
            return { ...option, isCorrect: option.id === optionId ? checked : false };
          }
          if (option.id === optionId) {
            return { ...option, isCorrect: checked };
          }
          return option;
        });
        return { ...question, options };
      }),
    );
  }, [questions, updateQuestions]);

  const addOption = useCallback((questionId: string) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        const options = question.options || [];
        return {
          ...question,
          options: [...options, { id: makeId('opt'), text: '', isCorrect: false }],
        };
      }),
    );
  }, [questions, updateQuestions]);

  const removeOption = useCallback((questionId: string, optionId: string) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        const options = (question.options || []).filter((option) => option.id !== optionId);
        return ensureQuestionDefaults({ ...question, options });
      }),
    );
  }, [questions, updateQuestions]);

  const updateAcceptedAnswer = useCallback((questionId: string, answerIndex: number, value: string) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        const correctAnswers = [...(question.correctAnswers || [''])];
        correctAnswers[answerIndex] = value;
        return { ...question, correctAnswers };
      }),
    );
  }, [questions, updateQuestions]);

  const addAcceptedAnswer = useCallback((questionId: string) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        return { ...question, correctAnswers: [...(question.correctAnswers || []), ''] };
      }),
    );
  }, [questions, updateQuestions]);

  const removeAcceptedAnswer = useCallback((questionId: string, answerIndex: number) => {
    updateQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        const current = question.correctAnswers || [];
        const next = current.filter((_, idx) => idx !== answerIndex);
        return { ...question, correctAnswers: next.length > 0 ? next : [''] };
      }),
    );
  }, [questions, updateQuestions]);

  const errors = useMemo(
    () =>
      validateFinalAssessmentData({
        questions,
        passingScore: data.passingScore,
        maxAttempts: data.maxAttempts,
      }),
    [data.maxAttempts, data.passingScore, questions],
  );

  const findFieldError = (field: string) => errors.find((err) => err.field === field)?.message;
  const getQuestionErrors = (index: number) => errors.filter((err) => err.field.startsWith(`questions[${index}]`));

  return (
    <div className="final-assessment-editor">
      <div className="editor-field">
        <label>Assessment Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Final Assessment"
          disabled={readOnly}
        />
      </div>

      <div className="editor-field">
        <label>Intro Text</label>
        <textarea
          value={data.introText || ''}
          onChange={(e) => updateData({ introText: e.target.value })}
          placeholder="Optional introductory text"
          rows={2}
          disabled={readOnly}
        />
      </div>

      <div className="editor-field">
        <label>Instructions</label>
        <textarea
          value={data.instructions || ''}
          onChange={(e) => updateData({ instructions: e.target.value })}
          placeholder="Optional instructions for learners"
          rows={3}
          disabled={readOnly}
        />
      </div>

      <div className="editor-field editor-field--row">
        <div>
          <label>Passing Score (%)</label>
          <input
            type="number"
            value={data.passingScore ?? 80}
            onChange={(e) => updateData({ passingScore: Number(e.target.value) })}
            min={0}
            max={100}
            disabled={readOnly}
          />
          {findFieldError('passingScore') && (
            <span className="editor-field__error">{findFieldError('passingScore')}</span>
          )}
        </div>

        <div>
          <label>Max Attempts</label>
          <input
            type="number"
            value={data.maxAttempts ?? 1}
            onChange={(e) => updateData({ maxAttempts: Number(e.target.value) })}
            min={1}
            disabled={readOnly}
          />
          {findFieldError('maxAttempts') && (
            <span className="editor-field__error">{findFieldError('maxAttempts')}</span>
          )}
        </div>

        <label className="fa-editor__checkbox-row">
          <input
            type="checkbox"
            checked={data.showCorrectAnswers ?? true}
            onChange={(e) => updateData({ showCorrectAnswers: e.target.checked })}
            disabled={readOnly}
          />
          Show correct answers after submit
        </label>
      </div>

      <div className="editor-field">
        <label>Questions ({questions.length})</label>
        {findFieldError('questions') && (
          <span className="editor-field__error">{findFieldError('questions')}</span>
        )}
        {questions.map((q, index) => (
          <div key={q.id} className="fa-editor__question">
            <div className="fa-editor__q-header">
              <span>
                Q{index + 1} - {TYPE_LABELS[toCanonicalQuestionType(q.type)]} - {q.question?.trim() || 'Untitled question'} ({q.points} pts)
              </span>
              <div className="fa-editor__q-actions">
                <button onClick={() => moveQuestion(index, -1)} disabled={readOnly || index === 0}>Up</button>
                <button onClick={() => moveQuestion(index, 1)} disabled={readOnly || index === questions.length - 1}>Down</button>
                <button onClick={() => toggleExpanded(q.id)}>{expandedIds.includes(q.id) ? 'Collapse' : 'Expand'}</button>
                <button onClick={() => removeQuestion(q.id)} disabled={readOnly}>Remove</button>
              </div>
            </div>

            {expandedIds.includes(q.id) && (
              <div className="fa-editor__q-body">
                <div className="editor-field">
                  <label>Question prompt</label>
                  <textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                    rows={3}
                    disabled={readOnly}
                  />
                </div>

                <div className="editor-field editor-field--row">
                  <div>
                    <label>Question type</label>
                    <select
                      value={toCanonicalQuestionType(q.type)}
                      onChange={(e) => switchQuestionType(q, e.target.value as 'mcq' | 'multiple-select' | 'true-false' | 'fill-in-blank')}
                      disabled={readOnly}
                    >
                      <option value="mcq">MCQ</option>
                      <option value="multiple-select">Multi Select</option>
                      <option value="true-false">True/False</option>
                      <option value="fill-in-blank">Fill in the Blank</option>
                    </select>
                  </div>

                  <div>
                    <label>Points</label>
                    <input
                      type="number"
                      value={q.points}
                      min={1}
                      onChange={(e) => updateQuestion(q.id, { points: Number(e.target.value) })}
                      disabled={readOnly}
                    />
                  </div>
                </div>

                {(toCanonicalQuestionType(q.type) === 'mcq' || toCanonicalQuestionType(q.type) === 'multiple-select') && (
                  <div className="editor-field">
                    <label>Options</label>
                    <div className="fa-editor__options">
                      {(q.options || []).map((opt) => (
                        <div key={opt.id} className="fa-editor__option-row">
                          <input
                            type={toCanonicalQuestionType(q.type) === 'mcq' ? 'radio' : 'checkbox'}
                            checked={opt.isCorrect}
                            onChange={(e) => toggleOptionCorrect(q.id, opt.id, e.target.checked)}
                            name={`fa-option-correct-${q.id}`}
                            disabled={readOnly}
                          />
                          <input
                            type="text"
                            value={opt.text}
                            placeholder="Option text"
                            onChange={(e) => updateOption(q.id, opt.id, { text: e.target.value })}
                            disabled={readOnly}
                          />
                          <button onClick={() => removeOption(q.id, opt.id)} disabled={readOnly}>Remove</button>
                        </div>
                      ))}
                    </div>

                    {toCanonicalQuestionType(q.type) === 'multiple-select' && (
                      <div className="fa-editor__inline-control">
                        <label>Scoring mode</label>
                        <select
                          value={q.partialCreditMode || 'proportional'}
                          onChange={(e) => updateQuestion(q.id, { partialCreditMode: e.target.value as 'proportional' | 'all-or-nothing' })}
                          disabled={readOnly}
                        >
                          <option value="proportional">Proportional</option>
                          <option value="all-or-nothing">All or nothing</option>
                        </select>
                      </div>
                    )}

                    <button onClick={() => addOption(q.id)} disabled={readOnly}>Add option</button>
                  </div>
                )}

                {toCanonicalQuestionType(q.type) === 'true-false' && (
                  <div className="editor-field">
                    <label>Correct answer</label>
                    <div className="fa-editor__inline-control">
                      <label>
                        <input
                          type="radio"
                          checked={q.correctAnswer !== false}
                          onChange={() => updateQuestion(q.id, { correctAnswer: true })}
                          disabled={readOnly}
                        />
                        True
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={q.correctAnswer === false}
                          onChange={() => updateQuestion(q.id, { correctAnswer: false })}
                          disabled={readOnly}
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}

                {toCanonicalQuestionType(q.type) === 'fill-in-blank' && (
                  <div className="editor-field">
                    <label>Accepted answers</label>
                    {(q.correctAnswers || ['']).map((answerValue, answerIdx) => (
                      <div key={`${q.id}-answer-${answerIdx}`} className="fa-editor__answer-row">
                        <input
                          type="text"
                          value={answerValue}
                          placeholder="Accepted answer"
                          onChange={(e) => updateAcceptedAnswer(q.id, answerIdx, e.target.value)}
                          disabled={readOnly}
                        />
                        <button onClick={() => removeAcceptedAnswer(q.id, answerIdx)} disabled={readOnly}>Remove</button>
                      </div>
                    ))}
                    <div className="fa-editor__inline-control">
                      <button onClick={() => addAcceptedAnswer(q.id)} disabled={readOnly}>Add accepted answer</button>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(q.caseSensitive)}
                          onChange={(e) => updateQuestion(q.id, { caseSensitive: e.target.checked })}
                          disabled={readOnly}
                        />
                        Case sensitive
                      </label>
                    </div>
                  </div>
                )}

                <div className="editor-field">
                  <label>Explanation (optional)</label>
                  <textarea
                    value={q.explanation || ''}
                    onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                    rows={2}
                    disabled={readOnly}
                  />
                </div>

                {getQuestionErrors(index).length > 0 && (
                  <ul className="fa-editor__error-list" role="alert">
                    {getQuestionErrors(index).map((errorItem) => (
                      <li key={`${q.id}-${errorItem.field}`}>{errorItem.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fa-editor__add-buttons">
        <button onClick={() => addQuestion('mcq')} disabled={readOnly}>+ MCQ</button>
        <button onClick={() => addQuestion('multiple-select')} disabled={readOnly}>+ Multi Select</button>
        <button onClick={() => addQuestion('true-false')} disabled={readOnly}>+ True/False</button>
        <button onClick={() => addQuestion('fill-in-blank')} aria-label="+ Fill Blank" disabled={readOnly}>+ Fill in the Blank</button>
      </div>
    </div>
  );
};

export default { preview: FinalAssessmentPreview, editor: FinalAssessmentEditor };
