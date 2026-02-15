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
    <div style={{ padding: '16px 0' }}>
      {data?.title && <h3 style={{ marginBottom: 24 }}>{data.title}</h3>}
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 0,
            bottom: 0,
            width: 2,
            background: '#e2e8f0',
          }}
        />

        {events.map((event, idx) => {
          const isOpen = expanded.has(event.id);
          return (
            <div key={event.id} style={{ position: 'relative', marginBottom: 24 }}>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: -33,
                  top: 4,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: isOpen ? '#3b82f6' : '#94a3b8',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 2px ' + (isOpen ? '#3b82f6' : '#e2e8f0'),
                  transition: 'all 0.2s',
                }}
              />

              <div
                onClick={() => toggleEvent(event.id)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && toggleEvent(event.id)
                }
                tabIndex={0}
                role="button"
                aria-expanded={isOpen}
                style={{
                  border: `1px solid ${isOpen ? '#3b82f6' : '#e2e8f0'}`,
                  borderRadius: 8,
                  padding: 16,
                  cursor: 'pointer',
                  background: isOpen ? '#f8fafc' : '#fff',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 4 }}>
                  {event.date}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                  {event.title}
                  <span style={{ float: 'right', color: '#94a3b8' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: 12 }}>
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt=""
                        style={{ width: '100%', borderRadius: 6, marginBottom: 8 }}
                      />
                    )}
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
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
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Timeline Title"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      {events.map((event, idx) => (
        <div key={event.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Event {idx + 1}</span>
            <button onClick={() => removeEvent(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Date</label>
              <input type="text" value={event.date} onChange={(e) => updateEvent(idx, 'date', e.target.value)} placeholder="2024" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Title</label>
              <input type="text" value={event.title} onChange={(e) => updateEvent(idx, 'title', e.target.value)} placeholder="Event title" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Description</label>
            <textarea value={event.description} onChange={(e) => updateEvent(idx, 'description', e.target.value)} rows={3} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addEvent} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Event
      </button>
    </div>
  );
};
