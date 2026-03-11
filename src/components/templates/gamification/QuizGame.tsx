import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './QuizGame.css';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points?: number;
}

interface QuizGameData {
  questions?: QuizQuestion[];
  maxLives?: number;
  timeLimit?: number;
}

function normalizeQuestions(raw: QuizGameData['questions']): QuizQuestion[] {
  return (raw ?? []).map((q, index) => ({
    id: q.id || `quiz-question-${index + 1}`,
    question: q.question || '',
    options: Array.isArray(q.options) ? [...q.options, '', '', '', ''].slice(0, 4) : ['', '', '', ''],
    correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
    explanation: q.explanation || '',
    points: typeof q.points === 'number' ? q.points : 10,
  }));
}

export const QuizGamePreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as QuizGameData;
  const questions = useMemo(() => normalizeQuestions(d.questions), [d.questions]);
  const maxLives = Math.max(1, Number(d.maxLives) || 3);
  const timeLimit = Math.max(0, Number(d.timeLimit) || 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [message, setMessage] = useState('');

  const completedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentIndex];

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const completeIfNeeded = useCallback((hasCompletedQuiz: boolean) => {
    if (!hasCompletedQuiz || completedRef.current) {
      return;
    }
    completedRef.current = true;
    onInteraction?.({
      componentId,
      interactionType: 'quiz-game-completed',
      interactionId: currentQuestion?.id,
      value: { score, lives, totalQuestions: questions.length },
      completed: true,
      score,
      maxScore: questions.reduce((sum, q) => sum + (q.points || 10), 0),
    });
    onComplete?.(componentId);
  }, [componentId, currentQuestion?.id, lives, onComplete, onInteraction, questions, score]);

  const proceed = useCallback((nextLives: number) => {
    const isLastQuestion = currentIndex >= questions.length - 1;
    const outOfLives = nextLives <= 0;
    const finished = isLastQuestion || outOfLives;

    if (finished) {
      setGameOver(true);
      completeIfNeeded(isLastQuestion && nextLives > 0);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setResolved(false);
    setSelectedIndex(null);
    setMessage('');
  }, [completeIfNeeded, currentIndex, questions.length]);

  const handleAnswer = useCallback((answerIndex: number, source: 'click' | 'timeout' = 'click') => {
    if (!currentQuestion || resolved || gameOver) {
      return;
    }

    clearTimers();

    const isCorrect = answerIndex === currentQuestion.correctIndex;
    const nextLives = isCorrect ? lives : Math.max(0, lives - 1);

    setResolved(true);
    setSelectedIndex(answerIndex >= 0 ? answerIndex : null);

    if (isCorrect) {
      setScore((prev) => prev + (currentQuestion.points || 10));
      setMessage('Correct answer');
    } else {
      setLives(nextLives);
      setMessage(source === 'timeout' ? 'Time is up' : 'Incorrect answer');
    }

    if (source === 'timeout') {
      onInteraction?.({
        componentId,
        interactionType: 'quiz-game-timeout',
        interactionId: currentQuestion.id,
        value: { index: currentIndex },
        completed: false,
      });
    } else {
      onInteraction?.({
        componentId,
        interactionType: 'quiz-game-answer',
        interactionId: currentQuestion.id,
        value: { index: currentIndex, answerIndex, correct: isCorrect },
        completed: false,
      });
    }

    timeoutRef.current = setTimeout(() => proceed(nextLives), 900);
  }, [componentId, currentIndex, currentQuestion, gameOver, lives, onInteraction, proceed, resolved]);

  useEffect(() => {
    clearTimers();

    if (!currentQuestion || timeLimit <= 0 || gameOver || resolved) {
      return;
    }

    setTimeLeft(timeLimit);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1, 'timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentIndex, currentQuestion, gameOver, handleAnswer, resolved, timeLimit]);

  const restart = () => {
    clearTimers();
    completedRef.current = false;
    setCurrentIndex(0);
    setScore(0);
    setLives(maxLives);
    setSelectedIndex(null);
    setResolved(false);
    setGameOver(false);
    setTimeLeft(timeLimit);
    setMessage('');
    onInteraction?.({
      componentId,
      interactionType: 'quiz-game-restart',
      value: {},
      completed: false,
    });
  };

  if (questions.length === 0) {
    return <section className="tpl-quiz-game tpl-quiz-game--empty">No quiz questions configured.</section>;
  }

  if (gameOver) {
    const passed = lives > 0;
    return (
      <section className="tpl-quiz-game tpl-quiz-game__result">
        <h3>{passed ? 'Great Job' : 'Game Over'}</h3>
        <p>Score: {score} • Lives left: {lives}</p>
        <button type="button" onClick={restart}>Play Again</button>
      </section>
    );
  }

  return (
    <section className="tpl-quiz-game">
      <header className="tpl-quiz-game__hud">
        <p>Score: {score}</p>
        <p>
          Question {currentIndex + 1}/{questions.length}
        </p>
        <p>Lives: {lives}/{maxLives}</p>
        {timeLimit > 0 ? <p aria-live="polite">Time: {timeLeft}s</p> : null}
      </header>

      <article className="tpl-quiz-game__question">
        <h4>{currentQuestion.question || `Question ${currentIndex + 1}`}</h4>
        <div className="tpl-quiz-game__options">
          {currentQuestion.options.map((option, optionIndex) => {
            const correct = resolved && optionIndex === currentQuestion.correctIndex;
            const incorrect = resolved && selectedIndex === optionIndex && optionIndex !== currentQuestion.correctIndex;
            return (
              <button
                key={`${currentQuestion.id}-${optionIndex}`}
                type="button"
                className={`tpl-quiz-game__option${correct ? ' is-correct' : ''}${incorrect ? ' is-incorrect' : ''}`}
                disabled={resolved}
                onClick={() => handleAnswer(optionIndex)}
              >
                {option || `Option ${optionIndex + 1}`}
              </button>
            );
          })}
        </div>
        {resolved ? (
          <p className="tpl-quiz-game__feedback" aria-live="polite">
            {message}{currentQuestion.explanation ? `: ${currentQuestion.explanation}` : ''}
          </p>
        ) : null}
      </article>
    </section>
  );
};

export const QuizGameEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as QuizGameData;
  const questions = normalizeQuestions(d.questions);

  const update = (patch: Partial<QuizGameData>) => onChange({ data: { ...d, ...patch } });

  const updateQuestion = (index: number, patch: Partial<QuizQuestion>) => {
    const nextQuestions = [...questions];
    nextQuestions[index] = { ...nextQuestions[index], ...patch };
    update({ questions: nextQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const nextQuestions = [...questions];
    const options = [...nextQuestions[questionIndex].options];
    options[optionIndex] = value;
    nextQuestions[questionIndex] = { ...nextQuestions[questionIndex], options };
    update({ questions: nextQuestions });
  };

  return (
    <section className="tpl-quiz-game-editor">
      <div className="tpl-quiz-game-editor__meta">
        <label>
          Lives
          <input
            type="number"
            min={1}
            value={d.maxLives ?? 3}
            onChange={(event) => update({ maxLives: Number(event.target.value) || 1 })}
          />
        </label>
        <label>
          Time limit (seconds, 0 disables)
          <input
            type="number"
            min={0}
            value={d.timeLimit ?? 0}
            onChange={(event) => update({ timeLimit: Number(event.target.value) || 0 })}
          />
        </label>
      </div>

      {questions.map((question, questionIndex) => (
        <article key={question.id} className="tpl-quiz-game-editor__card">
          <div className="tpl-quiz-game-editor__row">
            <strong>Question {questionIndex + 1}</strong>
            <button
              type="button"
              onClick={() => update({ questions: questions.filter((_, i) => i !== questionIndex) })}
            >
              Remove
            </button>
          </div>

          <label>
            Prompt
            <input
              value={question.question}
              onChange={(event) => updateQuestion(questionIndex, { question: event.target.value })}
            />
          </label>

          {question.options.map((option, optionIndex) => (
            <label key={`${question.id}-opt-${optionIndex}`} className="tpl-quiz-game-editor__option-row">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correctIndex === optionIndex}
                onChange={() => updateQuestion(questionIndex, { correctIndex: optionIndex })}
              />
              <input
                value={option}
                placeholder={`Option ${optionIndex + 1}`}
                onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
              />
            </label>
          ))}

          <label>
            Explanation
            <input
              value={question.explanation ?? ''}
              onChange={(event) => updateQuestion(questionIndex, { explanation: event.target.value })}
            />
          </label>
          <label>
            Points
            <input
              type="number"
              min={1}
              value={question.points ?? 10}
              onChange={(event) => updateQuestion(questionIndex, { points: Number(event.target.value) || 1 })}
            />
          </label>
        </article>
      ))}

      <button
        type="button"
        className="tpl-quiz-game-editor__add"
        onClick={() => update({
          questions: [...questions, { id: `quiz-question-${Date.now()}`, question: '', options: ['', '', '', ''], correctIndex: 0, points: 10 }],
        })}
      >
        Add Question
      </button>
    </section>
  );
};
