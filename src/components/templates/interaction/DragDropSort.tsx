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
import './DragDropSort.css';

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
    <div className="tpl-drag-drop-sort" data-testid="drag-drop-sort-preview">
      {data?.title && <h3 className="tpl-drag-drop-sort__title" data-testid="title">{data.title}</h3>}
      {data?.instructions && (
        <p className="tpl-drag-drop-sort__instructions" data-testid="instructions">{data.instructions}</p>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sort-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="tpl-drag-drop-sort__list" data-testid="sortable-list">
              {items.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx} isDragDisabled={submitted}>
                  {(prov, snap) => {
                    const baseClasses = ['tpl-drag-drop-sort__item'];
                    if (snap.isDragging) baseClasses.push('tpl-drag-drop-sort__item--dragging');
                    if (submitted) {
                      baseClasses.push('tpl-drag-drop-sort__item--submitted');
                      if (item.correctOrder === idx) {
                        baseClasses.push('tpl-drag-drop-sort__item--correct');
                      } else {
                        baseClasses.push('tpl-drag-drop-sort__item--incorrect');
                      }
                    }

                    return (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className={baseClasses.join(' ')}
                        data-testid={`sort-item-${idx}`}
                        data-item-id={item.id}
                        data-correct={item.correctOrder === idx}
                        style={prov.draggableProps.style}
                      >
                        <span className="tpl-drag-drop-sort__item-drag-handle" aria-hidden="true">⠿</span>
                        <span className="tpl-drag-drop-sort__item-text">{item.text}</span>
                        {submitted && (
                          <span className="tpl-drag-drop-sort__item-result" data-testid={`item-result-${idx}`}>
                            {item.correctOrder === idx ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isCorrect && submitted && (
        <div className="tpl-drag-drop-sort__feedback tpl-drag-drop-sort__feedback--success" data-testid="success-feedback">
          Correct! You've sorted the items in the right order.
        </div>
      )}
      {!isCorrect && submitted && (
        <div className="tpl-drag-drop-sort__feedback tpl-drag-drop-sort__feedback--error" data-testid="error-feedback">
          Not quite right. Try again to get the order correct.
        </div>
      )}

      <div className="tpl-drag-drop-sort__actions" data-testid="actions">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="tpl-drag-drop-sort__button tpl-drag-drop-sort__button--primary"
            data-testid="submit-button"
          >
            Check Order
          </button>
        ) : (
          <>
            <div className={`tpl-drag-drop-sort__progress ${isCorrect ? 'tpl-drag-drop-sort__progress--complete' : ''}`} data-testid="progress-text">
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </div>
            <button
              onClick={handleReset}
              className="tpl-drag-drop-sort__button tpl-drag-drop-sort__button--secondary"
              data-testid="reset-button"
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
    <div className="tpl-drag-drop-sort-editor" data-testid="drag-drop-sort-editor">
      <div className="tpl-drag-drop-sort-editor__field">
        <label className="tpl-drag-drop-sort-editor__label">Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Put these in order"
          className="tpl-drag-drop-sort-editor__input"
          data-testid="title-input"
        />
      </div>

      <div className="tpl-drag-drop-sort-editor__field">
        <label className="tpl-drag-drop-sort-editor__label">Instructions</label>
        <input
          type="text"
          value={data?.instructions ?? ''}
          onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })}
          placeholder="Drag items into the correct order"
          className="tpl-drag-drop-sort-editor__input"
          data-testid="instructions-input"
        />
      </div>

      <div style={{ fontSize: 12, color: 'var(--theme-text-secondary, #64748b)', marginBottom: 8 }}>
        Items listed here are in the <strong>correct</strong> order. They will be shuffled for learners.
      </div>

      <div data-testid="items-list">
        {items.map((item, idx) => (
          <div key={item.id} className="tpl-drag-drop-sort-editor__item-card" data-testid={`item-editor-${idx}`}>
            <div className="tpl-drag-drop-sort-editor__item-header">
              <span className="tpl-drag-drop-sort-editor__item-label">Item {idx + 1}</span>
              <button
                onClick={() => removeItem(idx)}
                className="tpl-drag-drop-sort-editor__remove-btn"
                data-testid={`remove-item-${idx}`}
                aria-label={`Remove item ${idx + 1}`}
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder={`Item ${idx + 1} text`}
              className="tpl-drag-drop-sort-editor__input"
              data-testid={`item-text-${idx}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="tpl-drag-drop-sort-editor__add-btn"
        data-testid="add-item-button"
        style={{
          width: '100%',
          padding: 10,
          border: '2px dashed var(--theme-border, #e2e8f0)',
          borderRadius: 6,
          background: 'transparent',
          color: 'var(--theme-primary, #3b82f6)',
          fontWeight: 500,
          cursor: 'pointer',
          marginTop: 12,
        }}
      >
        + Add Item
      </button>
    </div>
  );
};
