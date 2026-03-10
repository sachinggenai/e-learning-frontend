import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './CodeOfConduct.css';

export interface ConductPrinciple {
  id: string;
  title: string;
  description: string;
  example?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options?: string[];
}

export interface ConductSection {
  id: string;
  title: string;
  principles: ConductPrinciple[];
  quizQuestions?: QuizQuestion[];
}

export interface CodeOfConductData {
  title?: string;
  sections?: ConductSection[];
  requireAllSectionsViewed?: boolean;
  quickCheckEnabled?: boolean;
  quizEnabled?: boolean;
  quizPassThreshold?: number;
}

export const CodeOfConductPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as CodeOfConductData;
  const sections = d.sections ?? [];
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? '');
  const [viewedIds, setViewedIds] = useState<string[]>(sections[0]?.id ? [sections[0].id] : []);
  const [quickCheck, setQuickCheck] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const active = useMemo(() => sections.find((s) => s.id === activeSectionId) ?? sections[0], [activeSectionId, sections]);
  const allViewed = sections.length > 0 && sections.every((s) => viewedIds.includes(s.id));

  // Calculate quiz score
  const allQuizQuestions = sections.flatMap((s) => s.quizQuestions ?? []);
  const correctAnswers = allQuizQuestions.filter((q) => quizAnswers[q.id] === q.correctAnswer).length;
  const scorePercentage = allQuizQuestions.length > 0 ? Math.round((correctAnswers / allQuizQuestions.length) * 100) : 0;
  const passingScore = d.quizPassThreshold ?? 80;
  const quizPassed = scorePercentage >= passingScore;

  const canComplete =
    (d.requireAllSectionsViewed !== true || allViewed) &&
    (!d.quickCheckEnabled || quickCheck) &&
    (!d.quizEnabled || !allQuizQuestions.length || quizPassed);

  const openSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setViewedIds((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
    onInteraction?.({
      componentId,
      interactionType: 'conduct_section_opened',
      interactionId: sectionId,
      completed: false,
    });
  };

  const handleQuizAnswerChange = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    onInteraction?.({
      componentId,
      interactionType: 'conduct_quiz_submitted',
      interactionId: 'quiz',
      value: { score: scorePercentage, passed: quizPassed, threshold: passingScore },
      completed: quizPassed,
    });
  };

  return (
    <article className="tpl-code-of-conduct">
      <h2 className="tpl-code-of-conduct__title"><ShieldCheck size={20} /> {d.title?.trim() || 'Code of Conduct'}</h2>

      <div className="tpl-code-of-conduct__tabs" role="tablist" aria-label="Conduct sections">
        {sections.map((section) => (
          <button
            key={section.id}
            role="tab"
            type="button"
            aria-selected={(active?.id ?? '') === section.id}
            className={(active?.id ?? '') === section.id ? 'is-active' : ''}
            onClick={() => openSection(section.id)}
          >
            {section.title}
          </button>
        ))}
      </div>

      {!active ? (
        <p className="tpl-code-of-conduct__empty">No sections configured yet.</p>
      ) : (
        <section className="tpl-code-of-conduct__panel">
          <h3>{active.title}</h3>
          {active.principles.map((principle) => (
            <button
              key={principle.id}
              type="button"
              className="tpl-code-of-conduct__principle"
              onClick={() => onInteraction?.({
                componentId,
                interactionType: 'principle_viewed',
                interactionId: principle.id,
                value: principle.title,
                completed: false,
              })}
            >
              <strong>{principle.title}</strong>
              <span>{principle.description}</span>
              {principle.example && <em>Example: {principle.example}</em>}
            </button>
          ))}

          {active.quizQuestions && active.quizQuestions.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h4>Section Quiz</h4>
              {active.quizQuestions.map((q) => (
                <div key={q.id} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {q.question}
                  </label>
                  {q.options ? (
                    q.options.map((option) => (
                      <label key={option} style={{ display: 'block', marginBottom: '0.25rem' }}>
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={quizAnswers[q.id] === option}
                          onChange={(e) => handleQuizAnswerChange(q.id, e.target.value)}
                          disabled={quizSubmitted}
                        />
                        {option}
                      </label>
                    ))
                  ) : (
                    <input
                      type="text"
                      value={quizAnswers[q.id] ?? ''}
                      onChange={(e) => handleQuizAnswerChange(q.id, e.target.value)}
                      placeholder="Enter answer"
                      disabled={quizSubmitted}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  )}
                </div>
              ))}
              {!quizSubmitted && (
                <button type="button" onClick={submitQuiz} style={{ marginTop: '0.5rem' }}>
                  Submit Quiz Answer
                </button>
              )}
              {quizSubmitted && (
                <p style={{ marginTop: '0.5rem', fontWeight: '600', color: quizPassed ? '#10b981' : '#ef4444' }}>
                  Score: {scorePercentage}% {quizPassed ? '✓ Passed' : `✗ Failed (need ${passingScore}%)`}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {d.requireAllSectionsViewed && <p className="tpl-code-of-conduct__status">Section progress: {viewedIds.length}/{sections.length}</p>}

      {d.quickCheckEnabled && !d.quizEnabled && (
        <label className="tpl-code-of-conduct__quick-check">
          <input type="checkbox" checked={quickCheck} onChange={(e) => setQuickCheck(e.target.checked)} />
          I understand these conduct expectations.
        </label>
      )}

      <button
        type="button"
        disabled={!canComplete}
        onClick={() => {
          onInteraction?.({
            componentId,
            interactionType: 'conduct_completed',
            interactionId: 'complete',
            value: { allViewed, quickCheck, quizScore: scorePercentage },
            completed: true,
          });
          onComplete?.(componentId);
        }}
      >
        Mark Complete
      </button>
    </article>
  );
};

export const CodeOfConductEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as CodeOfConductData;
  const sections = d.sections ?? [];
  const update = (patch: Partial<CodeOfConductData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-code-of-conduct-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label><input type="checkbox" checked={d.requireAllSectionsViewed === true} onChange={(e) => update({ requireAllSectionsViewed: e.target.checked })} /> Require all sections viewed</label>
      <label><input type="checkbox" checked={d.quickCheckEnabled === true} onChange={(e) => update({ quickCheckEnabled: e.target.checked })} /> Enable quick check</label>
      <label><input type="checkbox" checked={d.quizEnabled === true} onChange={(e) => update({ quizEnabled: e.target.checked })} /> Enable quiz</label>
      {d.quizEnabled && (
        <label>
          Quiz Pass Threshold (%)
          <input
            type="number"
            min="0"
            max="100"
            value={d.quizPassThreshold ?? 80}
            onChange={(e) => update({ quizPassThreshold: Number(e.target.value) })}
          />
        </label>
      )}

      <div className="tpl-code-of-conduct-editor__head">
        <h3>Sections</h3>
        <button type="button" onClick={() => update({ sections: [...sections, { id: `sec-${Date.now()}`, title: '', principles: [] }] })}>+ Add Section</button>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="tpl-code-of-conduct-editor__section">
          <input value={section.title} placeholder="Section title" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s) })} />
          <button
            type="button"
            onClick={() => update({
              sections: sections.map((s) => s.id === section.id ? {
                ...s,
                principles: [...s.principles, { id: `p-${Date.now()}`, title: '', description: '' }],
              } : s),
            })}
          >
            + Add Principle
          </button>
          {section.principles.map((principle) => (
            <div key={principle.id} className="tpl-code-of-conduct-editor__principle">
              <input value={principle.title} placeholder="Principle title" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, principles: s.principles.map((p) => p.id === principle.id ? { ...p, title: e.target.value } : p) } : s) })} />
              <input value={principle.description} placeholder="Description" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, principles: s.principles.map((p) => p.id === principle.id ? { ...p, description: e.target.value } : p) } : s) })} />
              <input value={principle.example ?? ''} placeholder="Example" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, principles: s.principles.map((p) => p.id === principle.id ? { ...p, example: e.target.value } : p) } : s) })} />
            </div>
          ))}

          {d.quizEnabled && (
            <>
              <button
                type="button"
                onClick={() => update({
                  sections: sections.map((s) => s.id === section.id ? {
                    ...s,
                    quizQuestions: [...(s.quizQuestions ?? []), { id: `q-${Date.now()}`, question: '', correctAnswer: '' }],
                  } : s),
                })}
              >
                + Add Quiz Question
              </button>
              {section.quizQuestions?.map((question) => (
                <div key={question.id} style={{ marginLeft: '1rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '0.5rem' }}>
                  <input
                    value={question.question}
                    placeholder="Question"
                    onChange={(e) => update({
                      sections: sections.map((s) => s.id === section.id ? {
                        ...s,
                        quizQuestions: (s.quizQuestions ?? []).map((q) => q.id === question.id ? { ...q, question: e.target.value } : q),
                      } : s),
                    })}
                    style={{ width: '100%', marginBottom: '0.25rem' }}
                  />
                  <input
                    value={question.correctAnswer}
                    placeholder="Correct answer"
                    onChange={(e) => update({
                      sections: sections.map((s) => s.id === section.id ? {
                        ...s,
                        quizQuestions: (s.quizQuestions ?? []).map((q) => q.id === question.id ? { ...q, correctAnswer: e.target.value } : q),
                      } : s),
                    })}
                    style={{ width: '100%', marginBottom: '0.25rem' }}
                  />
                  <textarea
                    value={(question.options ?? []).join('\n')}
                    placeholder="Options (one per line, leave blank for text)"
                    onChange={(e) => update({
                      sections: sections.map((s) => s.id === section.id ? {
                        ...s,
                        quizQuestions: (s.quizQuestions ?? []).map((q) => q.id === question.id ? {
                          ...q,
                          options: e.target.value.trim() ? e.target.value.split('\n') : undefined,
                        } : q),
                      } : s),
                    })}
                    rows={2}
                    style={{ width: '100%', marginBottom: '0.25rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => update({
                      sections: sections.map((s) => s.id === section.id ? {
                        ...s,
                        quizQuestions: (s.quizQuestions ?? []).filter((q) => q.id !== question.id),
                      } : s),
                    })}
                  >
                    Remove Question
                  </button>
                </div>
              ))}
            </>
          )}

          <button type="button" onClick={() => update({ sections: sections.filter((s) => s.id !== section.id) })}>Remove Section</button>
        </div>
      ))}
    </section>
  );
};
