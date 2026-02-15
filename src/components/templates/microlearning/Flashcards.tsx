/**
 * Flashcards — Study-style flashcard deck.
 *
 * Preview: Card stack with front/back flip and progress tracking.
 * Editor: Add/remove flashcards with term and definition.
 *
 * Category: microlearning
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const FlashcardsPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const cards: Flashcard[] = data?.cards ?? [];
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  const flip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const next = useCallback(() => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.add(current);
      if (next.size === cards.length) onComplete?.('');
      return next;
    });
    if (current < cards.length - 1) {
      setCurrent((c) => c + 1);
      setFlipped(false);
    }
    onInteraction?.({
      interactionType: 'flashcard-next',
      componentId: '',
      interactionId: cards[current]?.id ?? '',
      value: current,
    });
  }, [current, cards, onInteraction, onComplete]);

  const prev = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setFlipped(false);
    }
  }, [current]);

  if (cards.length === 0) {
    return <div style={{ padding: 20, color: '#94a3b8' }}>No flashcards configured.</div>;
  }

  const card = cards[current];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {data?.title && <h3 style={{ marginBottom: 16, textAlign: 'center' }}>{data.title}</h3>}

      <div
        onClick={flip}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && flip()}
        tabIndex={0}
        role="button"
        aria-label="Flip card"
        style={{
          perspective: 800,
          cursor: 'pointer',
          minHeight: 200,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 200,
            transition: 'transform 0.5s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              background: '#fff',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 600,
              color: '#1e293b',
            }}
          >
            {card.term}
            <span style={{ position: 'absolute', bottom: 12, fontSize: 11, color: '#94a3b8' }}>
              Click to flip
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              border: '1px solid #3b82f6',
              borderRadius: 12,
              background: '#eff6ff',
              textAlign: 'center',
              fontSize: 15,
              color: '#334155',
              lineHeight: 1.6,
            }}
          >
            {card.definition}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            padding: '8px 20px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            background: '#fff',
            cursor: current === 0 ? 'not-allowed' : 'pointer',
            opacity: current === 0 ? 0.4 : 1,
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {current + 1} / {cards.length} — {reviewed.size} reviewed
        </span>
        <button
          onClick={next}
          disabled={current === cards.length - 1}
          style={{
            padding: '8px 20px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: current === cards.length - 1 ? 'not-allowed' : 'pointer',
            opacity: current === cards.length - 1 ? 0.4 : 1,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const FlashcardsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const cards: Flashcard[] = data?.cards ?? [];

  const updateCard = (idx: number, field: keyof Flashcard, value: string) => {
    const updated = [...cards];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, cards: updated } });
  };

  const addCard = () => {
    onChange({
      data: {
        ...data,
        cards: [...cards, { id: `fc-${Date.now()}`, term: '', definition: '' }],
      },
    });
  };

  const removeCard = (idx: number) => {
    onChange({ data: { ...data, cards: cards.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Flashcard Set"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      {cards.map((card, idx) => (
        <div key={card.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Card {idx + 1}</span>
            <button onClick={() => removeCard(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Term</label>
            <input type="text" value={card.term} onChange={(e) => updateCard(idx, 'term', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Definition</label>
            <textarea value={card.definition} onChange={(e) => updateCard(idx, 'definition', e.target.value)} rows={3} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addCard} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Flashcard
      </button>
    </div>
  );
};
