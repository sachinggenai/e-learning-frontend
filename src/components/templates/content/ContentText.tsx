/**
 * ContentText Component
 *
 * Text Content template — typeId: "content-text".
 * Backend contract: data.content (HTML string).
 * SCORM export: contentRenderer reads data.content → renders inside .rt-content__body.
 *
 * Field mapping:
 *   component.title  → <h2> heading
 *   data.content     → HTML body (backend field name, SCORM renderer reads this)
 *
 * Note: Legacy slides may have data.body instead of data.content.
 *       Preview falls back to data.body for backward compatibility.
 *       Editor always writes to data.content (the canonical backend field).
 */

import React, { useCallback } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import '../TemplateStyles.css';

// ─── Preview ─────────────────────────────────────────────────────
export const ContentTextPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  React.useEffect(() => {
    // View-based completion: mark complete after 1 s (matches SCORM cmi.completion_status)
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  // Canonical field is data.content; fall back to data.body for legacy slides
  const htmlBody: string = data.content || data.body || '';

  return (
    <article className="tpl-preview tpl-content-text-preview">
      {data.title && (
        <h2 className="tpl-content-text-preview__title">{data.title}</h2>
      )}
      <div
        className="tpl-content-text-preview__body"
        // Backend sanitizes via renderRichHTML() on SCORM export.
        // Preview content is author-supplied only (not end-user input).
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />
    </article>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const ContentTextEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  // Always write to data.content — the canonical backend field.
  const handleTitle = useCallback(
    (value: string) => onChange({ data: { ...data, title: value } }),
    [data, onChange],
  );

  const handleContent = useCallback(
    (value: string) => onChange({ data: { ...data, content: value } }),
    [data, onChange],
  );

  // Read from data.content; fall back to data.body for legacy slides
  const bodyValue: string = data.content ?? data.body ?? '';

  return (
    <div className="tpl-editor">
      <div className="tpl-field">
        <label className="tpl-field__label" htmlFor="ct-title">
          Title
        </label>
        <input
          id="ct-title"
          type="text"
          className="tpl-field__input"
          value={data.title || ''}
          onChange={(e) => handleTitle(e.target.value)}
          placeholder="Enter slide title..."
          maxLength={200}
          disabled={readOnly}
        />
      </div>

      <div className="tpl-field">
        <label className="tpl-field__label" htmlFor="ct-content">
          Content (HTML)
        </label>
        <textarea
          id="ct-content"
          className="tpl-field__textarea"
          rows={14}
          value={bodyValue}
          onChange={(e) => handleContent(e.target.value)}
          placeholder="Paste or type HTML content here. Supported tags: <p> <h2> <h3> <ul> <ol> <li> <strong> <em> <a> <img> <table>"
          disabled={readOnly}
          style={{ fontFamily: 'monospace', fontSize: '13px' }}
        />
        <span style={{ fontSize: '12px', color: 'var(--theme-text-secondary, #64748b)', marginTop: '4px' }}>
          HTML is rendered directly. Backend sanitizes on SCORM export.
        </span>
      </div>
    </div>
  );
};
