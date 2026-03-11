import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './Flashcards.css';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

interface FlashcardsData {
  title?: string;
  cards?: Flashcard[];
  shuffle?: boolean;
  requireFlipBeforeNext?: boolean;
}

function normalizeCards(raw: FlashcardsData['cards']): Flashcard[] {
  return (raw ?? []).map((card, index) => ({
    id: card.id || `flashcard-${index + 1}`,
    front: card.front || (card as any).term || '',
    back: card.back || (card as any).definition || '',
    hint: card.hint || '',
  }));
}

function shuffleOnce<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export const FlashcardsPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as FlashcardsData;
  const sourceCards = useMemo(() => normalizeCards(d.cards), [d.cards]);
  const cards = useMemo(() => (d.shuffle ? shuffleOnce(sourceCards) : sourceCards), [d.shuffle, sourceCards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flippedAtLeastOnce, setFlippedAtLeastOnce] = useState<Set<number>>(new Set());
  const completedRef = useRef(false);

  const isLast = currentIndex === cards.length - 1;
  const current = cards[currentIndex];

  const flip = useCallback(() => {
    setFlipped((prev) => !prev);
    setFlippedAtLeastOnce((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });
    onInteraction?.({
      componentId,
      interactionType: 'flashcard_flipped',
      interactionId: current?.id,
      value: { index: currentIndex, isBackVisible: !flipped },
      completed: false,
    });
  }, [componentId, current?.id, currentIndex, flipped, onInteraction]);

  const previous = useCallback(() => {
    if (currentIndex === 0) {
      return;
    }
    const nextIndex = currentIndex - 1;
    setCurrentIndex(nextIndex);
    setFlipped(false);
    onInteraction?.({
      componentId,
      interactionType: 'flashcard_prev',
      interactionId: cards[nextIndex]?.id,
      value: { index: nextIndex },
      completed: false,
    });
  }, [cards, componentId, currentIndex, onInteraction]);

  const next = useCallback(() => {
    if (d.requireFlipBeforeNext && !flippedAtLeastOnce.has(currentIndex)) {
      return;
    }

    if (!isLast) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setFlipped(false);
      onInteraction?.({
        componentId,
        interactionType: 'flashcard_next',
        interactionId: cards[nextIndex]?.id,
        value: { index: nextIndex },
        completed: false,
      });
      return;
    }

    if (!flippedAtLeastOnce.has(currentIndex) || completedRef.current) {
      return;
    }

    completedRef.current = true;
    onInteraction?.({
      componentId,
      interactionType: 'flashcards_completed',
      interactionId: current?.id,
      value: { index: currentIndex },
      completed: true,
    });
    onComplete?.(componentId);
  }, [cards, componentId, current?.id, currentIndex, d.requireFlipBeforeNext, flippedAtLeastOnce, isLast, onComplete, onInteraction]);

  if (cards.length === 0) {
    return <div className="tpl-flashcards tpl-flashcards--empty">No flashcards configured.</div>;
  }

  const nextDisabled = d.requireFlipBeforeNext
    ? !flippedAtLeastOnce.has(currentIndex)
    : isLast && !flippedAtLeastOnce.has(currentIndex);

  return (
    <section
      className="tpl-flashcards"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          flip();
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          previous();
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          next();
        }
      }}
    >
      {d.title ? <h3 className="tpl-flashcards__title">{d.title}</h3> : null}

      <button
        type="button"
        className={`tpl-flashcards__card${flipped ? ' is-flipped' : ''}`}
        onClick={flip}
        aria-label={`Flip card, currently showing ${flipped ? 'answer' : 'prompt'}`}
      >
        <div className="tpl-flashcards__face tpl-flashcards__face--front">
          <span className="tpl-flashcards__label">Prompt</span>
          <p>{current.front}</p>
          {current.hint ? <small className="tpl-flashcards__hint">Hint: {current.hint}</small> : null}
        </div>
        <div className="tpl-flashcards__face tpl-flashcards__face--back">
          <span className="tpl-flashcards__label">Answer</span>
          <p>{current.back}</p>
        </div>
      </button>

      <div className="tpl-flashcards__controls">
        <button type="button" onClick={previous} disabled={currentIndex === 0}>Previous</button>
        <p className="tpl-flashcards__meta" aria-live="polite">
          {currentIndex + 1} / {cards.length}
        </p>
        <button type="button" onClick={next} disabled={nextDisabled}>
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </section>
  );
};

export const FlashcardsEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as FlashcardsData;
  const cards = normalizeCards(d.cards);

  const update = (patch: Partial<FlashcardsData>) => {
    onChange({ data: { ...d, ...patch } });
  };

  const updateCard = (index: number, patch: Partial<Flashcard>) => {
    const nextCards = [...cards];
    nextCards[index] = { ...nextCards[index], ...patch };
    update({ cards: nextCards });
  };

  const addCard = () => {
    update({
      cards: [...cards, { id: `flashcard-${Date.now()}`, front: '', back: '', hint: '' }],
    });
  };

  const removeCard = (index: number) => {
    update({ cards: cards.filter((_, cardIndex) => cardIndex !== index) });
  };

  return (
    <section className="tpl-flashcards-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(event) => update({ title: event.target.value })} placeholder="Flashcard Set" />
      </label>

      <label>
        <input
          type="checkbox"
          checked={d.shuffle === true}
          onChange={(event) => update({ shuffle: event.target.checked })}
        />
        &nbsp;Shuffle deck on open
      </label>

      <label>
        <input
          type="checkbox"
          checked={d.requireFlipBeforeNext === true}
          onChange={(event) => update({ requireFlipBeforeNext: event.target.checked })}
        />
        &nbsp;Require flip before next
      </label>

      {cards.map((card, index) => (
        <article className="tpl-flashcards-editor__card" key={card.id}>
          <div className="tpl-flashcards-editor__row">
            <strong>Card {index + 1}</strong>
            <button type="button" onClick={() => removeCard(index)}>Remove</button>
          </div>
          <label>
            Front
            <input
              value={card.front}
              onChange={(event) => updateCard(index, { front: event.target.value })}
              placeholder="Question or prompt"
            />
          </label>
          <label>
            Back
            <textarea
              rows={3}
              value={card.back}
              onChange={(event) => updateCard(index, { back: event.target.value })}
              placeholder="Answer"
            />
          </label>
          <label>
            Hint
            <input
              value={card.hint ?? ''}
              onChange={(event) => updateCard(index, { hint: event.target.value })}
              placeholder="Optional hint"
            />
          </label>
        </article>
      ))}

      <button type="button" className="tpl-flashcards-editor__add" onClick={addCard}>Add Flashcard</button>
    </section>
  );
};
