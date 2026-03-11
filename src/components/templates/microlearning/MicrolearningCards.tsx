import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './MicrolearningCards.css';

interface MicroCard {
  id: string;
  title: string;
  body: string;
  icon?: string;
  accentColor?: string;
}

interface MicrolearningCardsData {
  heading?: string;
  intro?: string;
  cards?: MicroCard[];
  shuffle?: boolean;
  autoAdvanceSec?: number;
  showProgress?: boolean;
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

function normalizeCards(cards?: MicroCard[]): MicroCard[] {
  return (cards ?? []).map((card, index) => ({
    id: card.id || `micro-card-${index + 1}`,
    title: card.title || '',
    body: card.body || '',
    icon: card.icon || '',
    accentColor: card.accentColor || '',
  }));
}

export const MicrolearningCardsPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as MicrolearningCardsData;
  const orderedCards = useMemo(() => {
    const cards = normalizeCards(d.cards);
    return d.shuffle ? shuffleOnce(cards) : cards;
  }, [d.cards, d.shuffle]);

  const [index, setIndex] = useState(0);
  const completedRef = useRef(false);

  const current = orderedCards[index];
  const isLast = index === orderedCards.length - 1;

  useEffect(() => {
    if (!current) {
      return;
    }
    onInteraction?.({
      componentId,
      interactionType: 'micro_card_viewed',
      interactionId: current.id,
      value: { index },
      completed: false,
    });
  }, [componentId, current, index, onInteraction]);

  useEffect(() => {
    if (!d.autoAdvanceSec || d.autoAdvanceSec <= 0 || isLast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, orderedCards.length - 1));
    }, d.autoAdvanceSec * 1000);

    return () => window.clearTimeout(timeout);
  }, [d.autoAdvanceSec, isLast, orderedCards.length, index]);

  if (orderedCards.length === 0) {
    return <section className="tpl-micro-cards tpl-micro-cards--empty">No cards configured.</section>;
  }

  const complete = () => {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;
    onInteraction?.({
      componentId,
      interactionType: 'micro_cards_completed',
      interactionId: current.id,
      value: { index },
      completed: true,
    });
    onComplete?.(componentId);
  };

  const next = () => {
    onInteraction?.({
      componentId,
      interactionType: 'micro_card_next_clicked',
      interactionId: current.id,
      value: { index },
      completed: false,
    });

    if (isLast) {
      complete();
      return;
    }

    setIndex((prev) => Math.min(prev + 1, orderedCards.length - 1));
  };

  const previous = () => {
    onInteraction?.({
      componentId,
      interactionType: 'micro_card_prev_clicked',
      interactionId: current.id,
      value: { index },
      completed: false,
    });
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section
      className="tpl-micro-cards"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          next();
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          previous();
        }
      }}
    >
      <header className="tpl-micro-cards__header">
        <h3>{d.heading || 'Microlearning Cards'}</h3>
        {d.intro ? <p>{d.intro}</p> : null}
      </header>

      <article
        className="tpl-micro-cards__card"
        style={current.accentColor ? { borderLeftColor: current.accentColor } : undefined}
      >
        <h4>
          {current.icon ? <span aria-hidden="true">{current.icon} </span> : null}
          {current.title || 'Untitled card'}
        </h4>
        <p>{current.body || 'No content yet.'}</p>
      </article>

      <div className="tpl-micro-cards__actions">
        <button type="button" onClick={previous} disabled={index === 0}>Previous</button>
        {d.showProgress !== false ? (
          <p className="tpl-micro-cards__progress" aria-live="polite">
            {index + 1}/{orderedCards.length}
          </p>
        ) : null}
        <button type="button" onClick={next}>{isLast ? 'Finish' : 'Next'}</button>
      </div>
    </section>
  );
};

export const MicrolearningCardsEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as MicrolearningCardsData;
  const cards = normalizeCards(d.cards);

  const update = (patch: Partial<MicrolearningCardsData>) => onChange({ data: { ...d, ...patch } });

  const updateCard = (index: number, patch: Partial<MicroCard>) => {
    const nextCards = [...cards];
    nextCards[index] = { ...nextCards[index], ...patch };
    update({ cards: nextCards });
  };

  const moveCard = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= cards.length) {
      return;
    }
    const nextCards = [...cards];
    const temp = nextCards[index];
    nextCards[index] = nextCards[target];
    nextCards[target] = temp;
    update({ cards: nextCards });
  };

  return (
    <section className="tpl-micro-cards-editor">
      <label>
        Heading
        <input value={d.heading ?? ''} onChange={(event) => update({ heading: event.target.value })} />
      </label>
      <label>
        Intro
        <textarea rows={2} value={d.intro ?? ''} onChange={(event) => update({ intro: event.target.value })} />
      </label>

      <label>
        <input type="checkbox" checked={d.shuffle === true} onChange={(event) => update({ shuffle: event.target.checked })} />
        &nbsp;Shuffle cards
      </label>
      <label>
        Auto-advance seconds
        <input
          type="number"
          min={0}
          value={d.autoAdvanceSec ?? 0}
          onChange={(event) => update({ autoAdvanceSec: Number(event.target.value) || 0 })}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={d.showProgress !== false}
          onChange={(event) => update({ showProgress: event.target.checked })}
        />
        &nbsp;Show progress
      </label>

      {cards.map((card, index) => (
        <article className="tpl-micro-cards-editor__card" key={card.id}>
          <div className="tpl-micro-cards-editor__row">
            <strong>Card {index + 1}</strong>
            <div>
              <button type="button" onClick={() => moveCard(index, -1)} aria-label="Move card up">Up</button>
              <button type="button" onClick={() => moveCard(index, 1)} aria-label="Move card down">Down</button>
              <button type="button" onClick={() => update({ cards: cards.filter((_, cardIndex) => cardIndex !== index) })}>Remove</button>
            </div>
          </div>
          <label>
            Title
            <input value={card.title} onChange={(event) => updateCard(index, { title: event.target.value })} />
          </label>
          <label>
            Body
            <textarea rows={3} value={card.body} onChange={(event) => updateCard(index, { body: event.target.value })} />
          </label>
          <label>
            Icon
            <input value={card.icon ?? ''} onChange={(event) => updateCard(index, { icon: event.target.value })} />
          </label>
          <label>
            Accent color
            <input value={card.accentColor ?? ''} onChange={(event) => updateCard(index, { accentColor: event.target.value })} placeholder="#0ea5e9" />
          </label>
        </article>
      ))}

      <button
        type="button"
        className="tpl-micro-cards-editor__add"
        onClick={() => update({ cards: [...cards, { id: `micro-card-${Date.now()}`, title: '', body: '' }] })}
      >
        Add Card
      </button>
      {cards.length === 0 ? <p className="tpl-micro-cards-editor__warning">Add at least one card.</p> : null}
    </section>
  );
};
