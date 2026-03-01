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
import './Carousel.css';

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
    return <div className="tpl-carousel__empty" data-testid="carousel-empty">No slides configured.</div>;
  }

  const slide = slides[current];

  return (
    <div className="tpl-carousel" data-testid="carousel-preview">
      {data?.title && <h3 className="tpl-carousel__title" data-testid="title">{data.title}</h3>}

      <div className="tpl-carousel__slide-container" data-testid="slide-container">
        {slide.imageUrl && (
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="tpl-carousel__slide-image"
            data-testid="slide-image"
          />
        )}
        <div className="tpl-carousel__slide-content" data-testid="slide-content">
          <h4 className="tpl-carousel__slide-title" data-testid="slide-title">{slide.title}</h4>
          <p className="tpl-carousel__slide-text" data-testid="slide-text">{slide.content}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="tpl-carousel__nav" data-testid="nav-controls">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="tpl-carousel__nav-button"
          data-testid="prev-button"
        >
          ← Previous
        </button>

        <div className="tpl-carousel__indicators" data-testid="indicators">
          {slides.map((_, idx) => {
            const dotClasses = ['tpl-carousel__dot'];
            if (idx === current) dotClasses.push('tpl-carousel__dot--active');
            else if (visited.has(idx)) dotClasses.push('tpl-carousel__dot--visited');

            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={dotClasses.join(' ')}
                data-testid={`dot-${idx}`}
                data-active={idx === current}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === slides.length - 1}
          className="tpl-carousel__nav-button"
          data-testid="next-button"
        >
          Next →
        </button>
      </div>

      <p className={`tpl-carousel__progress ${visited.size === slides.length ? 'tpl-carousel__progress--complete' : ''}`} data-testid="progress">
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
    <div className="tpl-carousel-editor" data-testid="carousel-editor">
      <div className="tpl-carousel-editor__field">
        <label className="tpl-carousel-editor__label">Title</label>
        <input
          type="text"
          className="tpl-carousel-editor__input"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Carousel Title"
          data-testid="title-input"
        />
      </div>

      <div data-testid="slides-list">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="tpl-carousel-editor__slide-item" data-testid={`slide-editor-${idx}`}>
            <div className="tpl-carousel-editor__slide-header">
              <span className="tpl-carousel-editor__slide-label">Slide {idx + 1}</span>
              <button
                onClick={() => removeSlide(idx)}
                className="tpl-carousel-editor__remove-btn"
                data-testid={`remove-slide-${idx}`}
                aria-label={`Remove slide ${idx + 1}`}
              >
                ×
              </button>
            </div>
            <div className="tpl-carousel-editor__field">
              <label className="tpl-carousel-editor__label">Title</label>
              <input
                type="text"
                className="tpl-carousel-editor__input"
                value={slide.title}
                onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                data-testid={`slide-title-input-${idx}`}
              />
            </div>
            <div className="tpl-carousel-editor__field">
              <label className="tpl-carousel-editor__label">Content</label>
              <textarea
                className="tpl-carousel-editor__textarea"
                value={slide.content}
                onChange={(e) => updateSlide(idx, 'content', e.target.value)}
                data-testid={`slide-content-input-${idx}`}
              />
            </div>
            <div className="tpl-carousel-editor__field">
              <label className="tpl-carousel-editor__label">Image URL (optional)</label>
              <input
                type="text"
                className="tpl-carousel-editor__input"
                value={slide.imageUrl ?? ''}
                onChange={(e) => updateSlide(idx, 'imageUrl', e.target.value)}
                placeholder="https://..."
                data-testid={`slide-image-input-${idx}`}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSlide}
        className="tpl-carousel-editor__add-btn"
        data-testid="add-slide-button"
      >
        + Add Slide
      </button>
    </div>
  );
};
