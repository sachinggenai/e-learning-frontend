/**
 * ContentText Component — Legacy migration
 *
 * Wraps the existing content-text template type in the registry pattern.
 */

import React, { useCallback } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

// ─── Preview ─────────────────────────────────────────────────────
export const ContentTextPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  React.useEffect(() => {
    // View-based completion: mark complete after render
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  return (
    <article className="content-text-component">
      {data.title && <h2 className="content-text__title">{data.title}</h2>}
      <div
        className="content-text__body"
        dangerouslySetInnerHTML={{ __html: data.body || data.content || '' }}
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
  const handleChange = useCallback((field: string, value: string) => {
    onChange({ data: { ...data, [field]: value } });
  }, [data, onChange]);

  return (
    <div className="content-text-editor">
      <div className="form-group">
        <label htmlFor="content-text-title">Title</label>
        <input
          id="content-text-title"
          type="text"
          className="form-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter title..."
          disabled={readOnly}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content-text-body">Content</label>
        <textarea
          id="content-text-body"
          className="form-textarea"
          rows={10}
          value={data.body || data.content || ''}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Enter your content here..."
          disabled={readOnly}
        />
      </div>
    </div>
  );
};
