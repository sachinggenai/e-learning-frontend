/**
 * ClickReveal — Click-to-reveal interactive component.
 *
 * Preview: Grid of clickable hotspots/cards that reveal hidden content.
 * Editor: Add/remove items, configure text and reveal content.
 *
 * Category: interaction (aliased under content-presentation as well)
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface RevealItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const ClickRevealPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const items: RevealItem[] = data?.items ?? [];
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      onInteraction?.({
        interactionType: 'reveal',
        componentId: '',
        interactionId: id,
        value: !prev.has(id),
      });

      if (next.size === items.length) onComplete?.('');
      return next;
    });
  }, [items.length, onInteraction, onComplete]);

  return (
    <div className="click-reveal">
      {data?.title && <h3 style={{ marginBottom: 16 }}>{data.title}</h3>}
      {data?.instructions && (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{data.instructions}</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data?.columns ?? 2}, 1fr)`, gap: 12 }}>
        {items.map((item) => {
          const isOpen = revealed.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(item.id)}
              tabIndex={0}
              role="button"
              aria-expanded={isOpen}
              style={{
                border: `1px solid ${isOpen ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: 8,
                padding: 16,
                cursor: 'pointer',
                background: isOpen ? '#eff6ff' : '#fff',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: isOpen ? 8 : 0 }}>
                {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                {item.label}
                <span style={{ float: 'right', color: '#94a3b8' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
        {revealed.size} / {items.length} revealed
      </p>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ClickRevealEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const items: RevealItem[] = data?.items ?? [];

  const updateItem = (idx: number, field: keyof RevealItem, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, items: updated } });
  };

  const addItem = () => {
    onChange({
      data: {
        ...data,
        items: [...items, { id: `reveal-${Date.now()}`, label: '', content: '' }],
      },
    });
  };

  const removeItem = (idx: number) => {
    onChange({ data: { ...data, items: items.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Click to Reveal"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Instructions</label>
        <input
          type="text"
          value={data?.instructions ?? ''}
          onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })}
          placeholder="Click each item to learn more"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      {items.map((item, idx) => (
        <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Item {idx + 1}</span>
            <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Label</label>
            <input type="text" value={item.label} onChange={(e) => updateItem(idx, 'label', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Content</label>
            <textarea value={item.content} onChange={(e) => updateItem(idx, 'content', e.target.value)} rows={3} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addItem} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Item
      </button>
    </div>
  );
};
