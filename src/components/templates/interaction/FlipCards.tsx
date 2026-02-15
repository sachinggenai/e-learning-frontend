/**
 * FlipCards — Interactive card-flipping component.
 *
 * Preview: Grid of cards that flip on click to reveal back content.
 * Editor: Add/remove cards, edit front/back content.
 *
 * Category: interaction
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './FlipCards.css';

interface FlipCard {
  id: string;
  front: string;
  back: string;
  imageUrl?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const FlipCardsPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const cards: FlipCard[] = data?.cards ?? [];
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const handleFlip = useCallback((id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      onInteraction?.({
        interactionType: 'flip',
        componentId: '',
        interactionId: id,
        value: !prev.has(id),
      });

      // Complete when all cards have been flipped at least once
      if (next.size === cards.length && onComplete) {
        onComplete('');
      }
      return next;
    });
  }, [cards.length, onInteraction, onComplete]);

  return (
    <div className="flip-cards">
      {data?.title && <h3 className="flip-cards__title">{data.title}</h3>}
      <div
        className="flip-cards__grid"
        style={{ gridTemplateColumns: `repeat(${data?.columns ?? 3}, 1fr)` }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`flip-card ${flipped.has(card.id) ? 'flip-card--flipped' : ''}`}
            onClick={() => handleFlip(card.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip(card.id)}
            tabIndex={0}
            role="button"
            aria-label={`Flip card: ${card.front}`}
          >
            <div className="flip-card__inner">
              <div className="flip-card__front">
                {card.imageUrl && (
                  <img src={card.imageUrl} alt="" className="flip-card__image" />
                )}
                <p>{card.front}</p>
              </div>
              <div className="flip-card__back">
                <p>{card.back}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="flip-cards__hint">
        {flipped.size} / {cards.length} cards flipped
      </p>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const FlipCardsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const cards: FlipCard[] = data?.cards ?? [];

  const updateCard = (index: number, field: keyof FlipCard, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ data: { ...data, cards: updated } });
  };

  const addCard = () => {
    onChange({
      data: {
        ...data,
        cards: [
          ...cards,
          { id: `card-${Date.now()}`, front: '', back: '' },
        ],
      },
    });
  };

  const removeCard = (index: number) => {
    onChange({ data: { ...data, cards: cards.filter((_, i) => i !== index) } });
  };

  return (
    <div className="flip-cards-editor">
      <div className="editor-field">
        <label>Title (optional)</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Flip Cards Title"
        />
      </div>

      <div className="editor-field">
        <label>Columns</label>
        <select
          value={data?.columns ?? 3}
          onChange={(e) => onChange({ data: { ...data, columns: Number(e.target.value) } })}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      {cards.map((card, idx) => (
        <div key={card.id} className="editor-card">
          <div className="editor-card-header">
            <span>Card {idx + 1}</span>
            <button onClick={() => removeCard(idx)} className="editor-remove">×</button>
          </div>
          <div className="editor-field">
            <label>Front</label>
            <input
              type="text"
              value={card.front}
              onChange={(e) => updateCard(idx, 'front', e.target.value)}
              placeholder="Front text"
            />
          </div>
          <div className="editor-field">
            <label>Back</label>
            <textarea
              value={card.back}
              onChange={(e) => updateCard(idx, 'back', e.target.value)}
              placeholder="Back content"
              rows={3}
            />
          </div>
          <div className="editor-field">
            <label>Image URL (optional)</label>
            <input
              type="text"
              value={card.imageUrl ?? ''}
              onChange={(e) => updateCard(idx, 'imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      ))}

      <button className="editor-add" onClick={addCard}>+ Add Card</button>
    </div>
  );
};
