/**
 * Accordion Component — Content Presentation
 *
 * Preview: Expandable/collapsible panels with per-panel audio support.
 * Editor: Panel management (add/remove/edit content).
 * Self-registers with the component registry.
 */

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

// ─── Preview Component ───────────────────────────────────────────
export const AccordionPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const panels: Array<{ id: string; title: string; body: string }> = data.panels || [];
  const allowMultipleOpen = data.allowMultipleOpen ?? false;
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());
  const [visitedPanels, setVisitedPanels] = useState<Set<string>>(new Set());

  const togglePanel = useCallback((panelId: string) => {
    setOpenPanels((prev) => {
      const next = new Set(allowMultipleOpen ? prev : []);
      if (prev.has(panelId)) {
        next.delete(panelId);
      } else {
        next.add(panelId);
      }
      return next;
    });

    setVisitedPanels((prev) => {
      const next = new Set(prev);
      next.add(panelId);
      if (next.size === panels.length && onComplete) {
        onComplete(componentId);
      }
      return next;
    });

    onInteraction?.({
      componentId,
      interactionType: 'click',
      interactionId: panelId,
      value: panelId,
    });
  }, [allowMultipleOpen, componentId, panels.length, onInteraction, onComplete]);

  if (panels.length === 0) {
    return <p className="component-empty">No accordion panels configured.</p>;
  }

  return (
    <div className="accordion-component" role="presentation">
      {panels.map((panel) => {
        const isOpen = openPanels.has(panel.id);
        return (
          <div key={panel.id} className={`accordion-panel ${isOpen ? 'accordion-panel--open' : ''}`}>
            <button
              className="accordion-panel__header"
              onClick={() => togglePanel(panel.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-body-${panel.id}`}
            >
              <span className="accordion-panel__icon" aria-hidden="true">
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
              <span className="accordion-panel__title">{panel.title}</span>
              {visitedPanels.has(panel.id) && (
                <span className="accordion-panel__visited" aria-label="Visited">✓</span>
              )}
            </button>
            <div
              id={`accordion-body-${panel.id}`}
              className="accordion-panel__body"
              role="region"
              aria-labelledby={`accordion-header-${panel.id}`}
              hidden={!isOpen}
            >
              <div dangerouslySetInnerHTML={{ __html: panel.body }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Editor Component ────────────────────────────────────────────
export const AccordionEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const panels: Array<{ id: string; title: string; body: string }> = data.panels || [];
  const allowMultipleOpen = data.allowMultipleOpen ?? false;

  const updatePanels = useCallback((newPanels: typeof panels) => {
    onChange({ data: { ...data, panels: newPanels } });
  }, [data, onChange]);

  const addPanel = useCallback(() => {
    const newPanel = {
      id: `panel-${Date.now()}`,
      title: `Panel ${panels.length + 1}`,
      body: '<p>Enter panel content here...</p>',
    };
    updatePanels([...panels, newPanel]);
  }, [panels, updatePanels]);

  const removePanel = useCallback((index: number) => {
    if (panels.length <= 1) return;
    updatePanels(panels.filter((_, i) => i !== index));
  }, [panels, updatePanels]);

  const updatePanel = useCallback((index: number, field: 'title' | 'body', value: string) => {
    const newPanels = panels.map((panel, i) =>
      i === index ? { ...panel, [field]: value } : panel
    );
    updatePanels(newPanels);
  }, [panels, updatePanels]);

  return (
    <div className="accordion-editor">
      <div className="accordion-editor__header">
        <h4>Accordion Editor</h4>
        <div className="accordion-editor__controls">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={allowMultipleOpen}
              onChange={(e) => onChange({ data: { ...data, allowMultipleOpen: e.target.checked } })}
              disabled={readOnly}
            />
            Allow multiple panels open
          </label>
          <button
            className="btn btn-sm btn-secondary"
            onClick={addPanel}
            disabled={readOnly}
            aria-label="Add new panel"
          >
            + Add Panel
          </button>
        </div>
      </div>

      {panels.map((panel, index) => (
        <div key={panel.id} className="accordion-editor__panel">
          <div className="accordion-editor__panel-header">
            <span className="accordion-editor__panel-number">{index + 1}</span>
            <input
              type="text"
              className="form-input"
              value={panel.title}
              onChange={(e) => updatePanel(index, 'title', e.target.value)}
              placeholder="Panel title"
              disabled={readOnly}
              aria-label={`Panel ${index + 1} title`}
            />
            {panels.length > 1 && !readOnly && (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => removePanel(index)}
                aria-label={`Remove panel ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
          <textarea
            className="form-textarea"
            rows={4}
            value={panel.body}
            onChange={(e) => updatePanel(index, 'body', e.target.value)}
            placeholder="Panel content..."
            disabled={readOnly}
            aria-label={`Panel ${index + 1} content`}
          />
        </div>
      ))}
    </div>
  );
};
