/**
 * QuizGame — Gamified quiz with timer, lives, and score.
 *
 * Category: gamification
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points?: number;
}

// ─── Preview ──────────────────────────────────────────────────────
export const QuizGamePreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const questions: QuizQuestion[] = data?.questions ?? [];
  const maxLives: number = data?.maxLives ?? 3;
  const timeLimitSec: number = data?.timeLimit ?? 0; // 0 = no timer

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitSec);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[idx];

  // Timer
  useEffect(() => {
    if (timeLimitSec <= 0 || gameOver) return;
    setTimeLeft(timeLimitSec);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // time out = wrong answer
          handleAnswer(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, gameOver]);

  const handleAnswer = useCallback(
    (optIdx: number) => {
      if (!q || showResult) return;
      if (timerRef.current) clearInterval(timerRef.current);

      setSelected(optIdx);
      setShowResult(true);

      const correct = optIdx === q.correctIndex;
      if (correct) {
        setScore((s) => s + (q.points ?? 10));
      } else {
        setLives((l) => l - 1);
      }

      onInteraction?.({
        interactionType: 'quiz-game-answer',
        componentId: '',
        interactionId: q.id,
        value: { optIdx, correct },
      });

      setTimeout(() => {
        setSelected(null);
        setShowResult(false);

        if (!correct && lives - 1 <= 0) {
          setGameOver(true);
          return;
        }

        if (idx + 1 >= questions.length) {
          setGameOver(true);
          onComplete?.('');
        } else {
          setIdx((i) => i + 1);
        }
      }, 1800);
    },
    [q, showResult, lives, idx, questions.length, onInteraction, onComplete],
  );

  const restart = () => {
    setIdx(0);
    setScore(0);
    setLives(maxLives);
    setSelected(null);
    setShowResult(false);
    setGameOver(false);
  };

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
        No quiz questions configured.
      </div>
    );
  }

  if (gameOver) {
    const passed = lives > 0;
    return (
      <div style={{ textAlign: 'center', padding: 30 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{passed ? '🎉' : '💔'}</div>
        <h3 style={{ marginBottom: 4 }}>{passed ? 'Great Job!' : 'Game Over'}</h3>
        <p style={{ color: '#64748b', marginBottom: 16 }}>
          Score: {score} points &bull; {idx + (lives > 0 ? 1 : 0)}/{questions.length} answered
        </p>
        <button
          onClick={restart}
          style={{
            padding: '12px 28px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* HUD */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          padding: '8px 14px',
          background: '#f1f5f9',
          borderRadius: 10,
          fontSize: 14,
        }}
      >
        <span>⭐ {score}</span>
        <span>
          Q {idx + 1}/{questions.length}
        </span>
        <span>{'❤️'.repeat(lives)}{'🖤'.repeat(maxLives - lives)}</span>
        {timeLimitSec > 0 && (
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
            ⏱ {timeLeft}s
          </span>
        )}
      </div>

      {/* Question */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          background: '#fff',
        }}
      >
        <h4 style={{ margin: '0 0 18px', fontSize: 17 }}>{q.question}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, oi) => {
            let bg = '#fafafa';
            let border = '#e2e8f0';
            if (showResult && oi === q.correctIndex) {
              bg = '#f0fdf4';
              border = '#22c55e';
            }
            if (showResult && oi === selected && oi !== q.correctIndex) {
              bg = '#fef2f2';
              border = '#ef4444';
            }
            return (
              <button
                key={oi}
                onClick={() => handleAnswer(oi)}
                disabled={showResult}
                style={{
                  padding: '12px 16px',
                  border: `2px solid ${border}`,
                  borderRadius: 8,
                  background: bg,
                  textAlign: 'left',
                  fontSize: 14,
                  cursor: showResult ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {showResult && q.explanation && (
          <p
            style={{
              marginTop: 14,
              padding: '10px 12px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 6,
              fontSize: 13,
              color: '#0369a1',
            }}
          >
            {q.explanation}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const QuizGameEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const questions: QuizQuestion[] = data?.questions ?? [];

  const updateQuestion = (idx: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, questions: updated } });
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    const opts = [...updated[qIdx].options];
    opts[oIdx] = value;
    updated[qIdx] = { ...updated[qIdx], options: opts };
    onChange({ data: { ...data, questions: updated } });
  };

  const addQuestion = () => {
    onChange({
      data: {
        ...data,
        questions: [
          ...questions,
          {
            id: `qq-${Date.now()}`,
            question: '',
            options: ['', '', '', ''],
            correctIndex: 0,
            points: 10,
          },
        ],
      },
    });
  };

  const removeQuestion = (idx: number) => {
    onChange({ data: { ...data, questions: questions.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Lives</label>
          <input type="number" value={data?.maxLives ?? 3} min={1} onChange={(e) => onChange({ data: { ...data, maxLives: Number(e.target.value) } })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Time Limit (s, 0=off)</label>
          <input type="number" value={data?.timeLimit ?? 0} min={0} onChange={(e) => onChange({ data: { ...data, timeLimit: Number(e.target.value) } })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
        </div>
      </div>

      {questions.map((q, qi) => (
        <div key={q.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 12, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Question {qi + 1}</span>
            <button onClick={() => removeQuestion(qi)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Question</label>
            <input type="text" value={q.question} onChange={(e) => updateQuestion(qi, 'question', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          {q.options.map((opt, oi) => (
            <div key={oi} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
              <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === oi} onChange={() => updateQuestion(qi, 'correctIndex', oi)} />
              <input type="text" value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Explanation</label>
              <input type="text" value={q.explanation ?? ''} onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ width: 70 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Points</label>
              <input type="number" value={q.points ?? 10} onChange={(e) => updateQuestion(qi, 'points', Number(e.target.value))} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addQuestion} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Question
      </button>
    </div>
  );
};
