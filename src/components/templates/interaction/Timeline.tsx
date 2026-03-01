/**
 * Timeline — Interactive chronological timeline.
 *
 * Preview: Vertical or horizontal timeline with expandable events.
 * Editor: Add/remove events with date, title, and description.
 *
 * Category: content-presentation / process-flow
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './Timeline.css';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const TimelinePreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const events: TimelineEvent[] = data?.events ?? [];
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleEvent = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      onInteraction?.({
        interactionType: 'timeline-expand',
        componentId: '',
        interactionId: id,
        value: !prev.has(id),
      });

      if (next.size === events.length) onComplete?.('');
      return next;
    });
  }, [events.length, onInteraction, onComplete]);

  return (
    <div className="tpl-timeline">
      {data?.title && <h3 className="tpl-timeline__title">{data.title}</h3>}
      <div className="tpl-timeline__list-wrap">
        <div className="tpl-timeline__axis" />

        {events.map((event, idx) => {
          const isOpen = expanded.has(event.id);
          return (
            <div key={event.id} className="tpl-timeline__item">
              <div className={`tpl-timeline__dot ${isOpen ? 'tpl-timeline__dot--open' : ''}`} />

              <div
                onClick={() => toggleEvent(event.id)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && toggleEvent(event.id)
                }
                tabIndex={0}
                role="button"
                aria-expanded={isOpen}
                className={`tpl-timeline__card ${isOpen ? 'tpl-timeline__card--open' : ''}`}
              >
                <div className="tpl-timeline__date">{event.date}</div>
                <div className="tpl-timeline__card-header">
                  <span className="tpl-timeline__event-title">{event.title}</span>
                  <span className="tpl-timeline__toggle-icon">{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && (
                  <div className="tpl-timeline__details">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt=""
                        className="tpl-timeline__image"
                      />
                    )}
                    <p className="tpl-timeline__description">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const TimelineEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const events: TimelineEvent[] = data?.events ?? [];

  const updateEvent = (idx: number, field: keyof TimelineEvent, value: string) => {
    const updated = [...events];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, events: updated } });
  };

  const addEvent = () => {
    onChange({
      data: {
        ...data,
        events: [
          ...events,
          { id: `evt-${Date.now()}`, date: '', title: '', description: '' },
        ],
      },
    });
  };

  const removeEvent = (idx: number) => {
    onChange({ data: { ...data, events: events.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="tpl-timeline-editor">
      <div className="tpl-timeline-editor__field">
        <label className="tpl-timeline-editor__label">Title</label>
        <input
          type="text"
          className="tpl-timeline-editor__input"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Timeline Title"
        />
      </div>

      {events.map((event, idx) => (
        <div key={event.id} className="tpl-timeline-editor__event">
          <div className="tpl-timeline-editor__event-header">
            <span className="tpl-timeline-editor__event-title">Event {idx + 1}</span>
            <button
              onClick={() => removeEvent(idx)}
              className="tpl-timeline-editor__delete"
              aria-label={`Delete event ${idx + 1}`}
            >
              ×
            </button>
          </div>
          <div className="tpl-timeline-editor__event-grid">
            <div className="tpl-timeline-editor__field">
              <label className="tpl-timeline-editor__label">Date</label>
              <input
                type="text"
                className="tpl-timeline-editor__input"
                value={event.date}
                onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                placeholder="2024"
              />
            </div>
            <div className="tpl-timeline-editor__field">
              <label className="tpl-timeline-editor__label">Title</label>
              <input
                type="text"
                className="tpl-timeline-editor__input"
                value={event.title}
                onChange={(e) => updateEvent(idx, 'title', e.target.value)}
                placeholder="Event title"
              />
            </div>
          </div>
          <div className="tpl-timeline-editor__field">
            <label className="tpl-timeline-editor__label">Description</label>
            <textarea
              className="tpl-timeline-editor__textarea"
              value={event.description}
              onChange={(e) => updateEvent(idx, 'description', e.target.value)}
              rows={3}
            />
          </div>
          <div className="tpl-timeline-editor__field">
            <label className="tpl-timeline-editor__label">Image URL (optional)</label>
            <input
              type="text"
              className="tpl-timeline-editor__input"
              value={event.imageUrl ?? ''}
              onChange={(e) => updateEvent(idx, 'imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      ))}

      <button onClick={addEvent} className="tpl-timeline-editor__add-button">
        + Add Event
      </button>
    </div>
  );
};
