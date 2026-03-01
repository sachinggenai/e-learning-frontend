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
    <div className="tpl-flip-cards" data-testid="flip-cards-preview">
      {data?.title && <h3 className="tpl-flip-cards__title" data-testid="title">{data.title}</h3>}
      <div
        className="tpl-flip-cards__grid"
        style={{ gridTemplateColumns: `repeat(${data?.columns ?? 3}, 1fr)` }}
        data-testid="cards-grid"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`tpl-flip-cards__card ${flipped.has(card.id) ? 'tpl-flip-cards__card--flipped' : ''}`}
            onClick={() => handleFlip(card.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip(card.id)}
            tabIndex={0}
            role="button"
            aria-label={`Flip card: ${card.front}`}
            data-testid={`flip-card-${card.id}`}
            data-flipped={flipped.has(card.id)}
          >
            <div className="tpl-flip-cards__card-inner">
              <div className="tpl-flip-cards__card-front" data-testid={`card-front-${card.id}`}>
                {card.imageUrl && (
                  <img src={card.imageUrl} alt="" className="tpl-flip-cards__card-image" />
                )}
                <p>{card.front}</p>
              </div>
              <div className="tpl-flip-cards__card-back" data-testid={`card-back-${card.id}`}>
                <p>{card.back}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className={`tpl-flip-cards__progress ${flipped.size === cards.length ? 'tpl-flip-cards__progress--complete' : ''}`} data-testid="flip-progress">
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
    <div className="tpl-flip-cards-editor" data-testid="flip-cards-editor">
      <div className="tpl-flip-cards-editor__field">
        <label className="tpl-flip-cards-editor__label">Title (optional)</label>
        <input
          type="text"
          className="tpl-flip-cards-editor__input"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Flip Cards Title"
          data-testid="title-input"
        />
      </div>

      <div className="tpl-flip-cards-editor__field">
        <label className="tpl-flip-cards-editor__label">Columns</label>
        <select
          className="tpl-flip-cards-editor__select"
          value={data?.columns ?? 3}
          onChange={(e) => onChange({ data: { ...data, columns: Number(e.target.value) } })}
          data-testid="columns-select"
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      <div data-testid="cards-list">
        {cards.map((card, idx) => (
          <div key={card.id} className="tpl-flip-cards-editor__card-item" data-testid={`card-editor-${idx}`}>
            <div className="tpl-flip-cards-editor__card-header">
              <span className="tpl-flip-cards-editor__card-label">Card {idx + 1}</span>
              <button
                onClick={() => removeCard(idx)}
                className="tpl-flip-cards-editor__remove-btn"
                data-testid={`remove-card-${idx}`}
                aria-label={`Remove card ${idx + 1}`}
              >
                ×
              </button>
            </div>
            <div className="tpl-flip-cards-editor__field">
              <label className="tpl-flip-cards-editor__label">Front</label>
              <input
                type="text"
                className="tpl-flip-cards-editor__input"
                value={card.front}
                onChange={(e) => updateCard(idx, 'front', e.target.value)}
                placeholder="Front text"
                data-testid={`card-front-input-${idx}`}
              />
            </div>
            <div className="tpl-flip-cards-editor__field">
              <label className="tpl-flip-cards-editor__label">Back</label>
              <textarea
                className="tpl-flip-cards-editor__textarea"
                value={card.back}
                onChange={(e) => updateCard(idx, 'back', e.target.value)}
                placeholder="Back content"
                data-testid={`card-back-input-${idx}`}
              />
            </div>
            <div className="tpl-flip-cards-editor__field">
              <label className="tpl-flip-cards-editor__label">Image URL (optional)</label>
              <input
                type="text"
                className="tpl-flip-cards-editor__input"
                value={card.imageUrl ?? ''}
                onChange={(e) => updateCard(idx, 'imageUrl', e.target.value)}
                placeholder="https://..."
                data-testid={`card-image-input-${idx}`}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="tpl-flip-cards-editor__add-btn"
        onClick={addCard}
        data-testid="add-card-button"
      >
        + Add Card
      </button>
    </div>
  );
};
