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
import './ClickReveal.css';

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

  const columns = data?.columns ?? 3;
  const gridClass = `tpl-click-reveal__grid--${Math.min(columns, 3)}col`;

  return (
    <div className="tpl-click-reveal">
      {data?.title && <h3 className="tpl-click-reveal__title">{data.title}</h3>}
      {data?.instructions && (
        <p className="tpl-click-reveal__instructions">{data.instructions}</p>
      )}
      <div className={`tpl-click-reveal__grid ${gridClass}`}>
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
              className={`tpl-click-reveal__card ${isOpen ? 'tpl-click-reveal__card--revealed' : ''}`}
            >
              <div className="tpl-click-reveal__card-header">
                <div className="tpl-click-reveal__card-label">
                  {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
                  {item.label}
                </div>
                <div className="tpl-click-reveal__card-icon">{isOpen ? '▲' : '▼'}</div>
              </div>
              {isOpen && (
                <div className="tpl-click-reveal__card-content">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className={`tpl-click-reveal__progress ${revealed.size === items.length ? 'tpl-click-reveal__progress--complete' : ''}`}>
        <span className="tpl-click-reveal__progress-count">{revealed.size}</span> / {items.length} revealed
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
    <div className="tpl-click-reveal-editor">
      <div className="tpl-click-reveal-editor__field">
        <label className="tpl-click-reveal-editor__label">Title</label>
        <input
          type="text"
          className="tpl-click-reveal-editor__input"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Explore Key Concepts"
        />
      </div>

      <div className="tpl-click-reveal-editor__field">
        <label className="tpl-click-reveal-editor__label">Instructions</label>
        <input
          type="text"
          className="tpl-click-reveal-editor__input"
          value={data?.instructions ?? ''}
          onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })}
          placeholder="Click each item to learn more"
        />
      </div>

      {items.map((item, idx) => (
        <div key={item.id} className="tpl-click-reveal-editor__item">
          <div className="tpl-click-reveal-editor__item-header">
            <span className="tpl-click-reveal-editor__item-title">Item {idx + 1}</span>
            <button 
              onClick={() => removeItem(idx)} 
              className="tpl-click-reveal-editor__item-delete"
              aria-label={`Delete item ${idx + 1}`}
            >
              ×
            </button>
          </div>
          <div className="tpl-click-reveal-editor__field">
            <label className="tpl-click-reveal-editor__label">Label</label>
            <input 
              type="text" 
              className="tpl-click-reveal-editor__input"
              value={item.label} 
              onChange={(e) => updateItem(idx, 'label', e.target.value)}
              placeholder="Item title"
            />
          </div>
          <div className="tpl-click-reveal-editor__field">
            <label className="tpl-click-reveal-editor__label">Content</label>
            <textarea 
              className="tpl-click-reveal-editor__textarea"
              value={item.content} 
              onChange={(e) => updateItem(idx, 'content', e.target.value)}
              placeholder="Enter the revealed content..."
            />
          </div>
        </div>
      ))}

      <button 
        onClick={addItem}
        className="tpl-click-reveal-editor__add-button"
      >
        + Add Item
      </button>
    </div>
  );
};
