/**
 * Carousel — Swipeable / navigable slide carousel.
 *
 * Preview: Card carousel with prev/next navigation.
 * Editor: Add/remove slides with content and images.
 *
 * Category: interaction
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface CarouselSlide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const CarouselPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const slides: CarouselSlide[] = data?.slides ?? [];
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= slides.length) return;
    setCurrent(idx);
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(idx);

      onInteraction?.({
        interactionType: 'carousel-navigate',
        componentId: '',
        interactionId: slides[idx]?.id ?? String(idx),
        value: idx,
      });

      if (next.size === slides.length) onComplete?.('');
      return next;
    });
  }, [slides, onInteraction, onComplete]);

  if (slides.length === 0) {
    return <div style={{ padding: 20, color: '#94a3b8' }}>No slides configured.</div>;
  }

  const slide = slides[current];

  return (
    <div style={{ position: 'relative' }}>
      {data?.title && <h3 style={{ marginBottom: 16 }}>{data.title}</h3>}

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff',
          minHeight: 200,
        }}
      >
        {slide.imageUrl && (
          <img
            src={slide.imageUrl}
            alt={slide.title}
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
          />
        )}
        <div style={{ padding: 24 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 16 }}>{slide.title}</h4>
          <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
            {slide.content}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          style={{
            padding: '8px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            background: '#fff',
            cursor: current === 0 ? 'not-allowed' : 'pointer',
            opacity: current === 0 ? 0.4 : 1,
          }}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 'none',
                background: idx === current ? '#3b82f6' : visited.has(idx) ? '#93c5fd' : '#e2e8f0',
                cursor: 'pointer',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === slides.length - 1}
          style={{
            padding: '8px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            background: '#fff',
            cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer',
            opacity: current === slides.length - 1 ? 0.4 : 1,
          }}
        >
          Next →
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
        {current + 1} / {slides.length} — {visited.size} visited
      </p>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const CarouselEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const slides: CarouselSlide[] = data?.slides ?? [];

  const updateSlide = (idx: number, field: keyof CarouselSlide, value: string) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, slides: updated } });
  };

  const addSlide = () => {
    onChange({
      data: {
        ...data,
        slides: [
          ...slides,
          { id: `slide-${Date.now()}`, title: '', content: '' },
        ],
      },
    });
  };

  const removeSlide = (idx: number) => {
    onChange({ data: { ...data, slides: slides.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Carousel Title"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      {slides.map((slide, idx) => (
        <div key={slide.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Slide {idx + 1}</span>
            <button onClick={() => removeSlide(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Title</label>
            <input type="text" value={slide.title} onChange={(e) => updateSlide(idx, 'title', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Content</label>
            <textarea value={slide.content} onChange={(e) => updateSlide(idx, 'content', e.target.value)} rows={3} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Image URL (optional)</label>
            <input type="text" value={slide.imageUrl ?? ''} onChange={(e) => updateSlide(idx, 'imageUrl', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addSlide} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Slide
      </button>
    </div>
  );
};
