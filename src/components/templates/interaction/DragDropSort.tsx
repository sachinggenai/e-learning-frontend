/**
 * DragDropSort — Drag items into correct order or categories.
 *
 * Preview: Sortable list using @hello-pangea/dnd.
 * Editor: Define items and correct order.
 *
 * Category: interaction
 */

import React, { useState, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface SortItem {
  id: string;
  text: string;
  correctOrder: number;
}

// ─── Preview ──────────────────────────────────────────────────────
export const DragDropSortPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const correctItems: SortItem[] = data?.items ?? [];

  // Shuffle on first render
  const [items, setItems] = useState<SortItem[]>(() => {
    const shuffled = [...correctItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const [submitted, setSubmitted] = useState(false);

  const isCorrect = useMemo(() => {
    return items.every((item, idx) => item.correctOrder === idx);
  }, [items]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || submitted) return;
    const updated = [...items];
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setItems(updated);
  }, [items, submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    onInteraction?.({
      interactionType: 'sort-submit',
      componentId: '',
      interactionId: 'sort',
      value: { order: items.map((i) => i.id), correct: isCorrect },
    });
    if (isCorrect) onComplete?.('');
  }, [items, isCorrect, onInteraction, onComplete]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    const shuffled = [...correctItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
  }, [correctItems]);

  return (
    <div style={{ maxWidth: 500 }}>
      {data?.title && <h3 style={{ marginBottom: 8 }}>{data.title}</h3>}
      {data?.instructions && (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{data.instructions}</p>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sort-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx} isDragDisabled={submitted}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={{
                        ...prov.draggableProps.style,
                        padding: '12px 16px',
                        marginBottom: 8,
                        borderRadius: 6,
                        border: `1px solid ${
                          submitted
                            ? item.correctOrder === idx
                              ? '#22c55e'
                              : '#ef4444'
                            : snap.isDragging
                            ? '#3b82f6'
                            : '#e2e8f0'
                        }`,
                        background: snap.isDragging
                          ? '#eff6ff'
                          : submitted
                          ? item.correctOrder === idx
                            ? '#f0fdf4'
                            : '#fef2f2'
                          : '#fff',
                        cursor: submitted ? 'default' : 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <span style={{ color: '#94a3b8', fontSize: 14 }}>⠿</span>
                      <span style={{ flex: 1 }}>{item.text}</span>
                      {submitted && (
                        <span>{item.correctOrder === idx ? '✓' : '✗'}</span>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 24px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Check Order
          </button>
        ) : (
          <>
            <span
              style={{
                padding: '10px 16px',
                fontWeight: 600,
                color: isCorrect ? '#16a34a' : '#dc2626',
              }}
            >
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </span>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 24px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const DragDropSortEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const items: SortItem[] = data?.items ?? [];

  const updateItem = (idx: number, text: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], text };
    onChange({ data: { ...data, items: updated } });
  };

  const addItem = () => {
    onChange({
      data: {
        ...data,
        items: [
          ...items,
          { id: `sort-${Date.now()}`, text: '', correctOrder: items.length },
        ],
      },
    });
  };

  const removeItem = (idx: number) => {
    const updated = items
      .filter((_, i) => i !== idx)
      .map((item, i) => ({ ...item, correctOrder: i }));
    onChange({ data: { ...data, items: updated } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Put these in order"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Instructions</label>
        <input
          type="text"
          value={data?.instructions ?? ''}
          onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })}
          placeholder="Drag items into the correct order"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
        Items listed here are in the <strong>correct</strong> order. They will be shuffled for learners.
      </p>

      {items.map((item, idx) => (
        <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#94a3b8', width: 20 }}>{idx + 1}.</span>
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItem(idx, e.target.value)}
            placeholder={`Item ${idx + 1}`}
            style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
          />
          <button
            onClick={() => removeItem(idx)}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      ))}

      <button onClick={addItem} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Item
      </button>
    </div>
  );
};
