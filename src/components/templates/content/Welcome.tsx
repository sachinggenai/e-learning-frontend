/**
 * Welcome Component — Legacy migration
 */

import React, { useCallback } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

export const WelcomePreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  React.useEffect(() => {
    onComplete?.(componentId);
  }, [componentId, onComplete]);

  return (
    <section className="welcome-component" aria-label="Welcome">
      <div className="welcome__content">
        <h1 className="welcome__title">{data.title || 'Welcome'}</h1>
        {data.subtitle && <h2 className="welcome__subtitle">{data.subtitle}</h2>}
        {data.description && (
          <p className="welcome__description">{data.description}</p>
        )}
      </div>
    </section>
  );
};

export const WelcomeEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const handleChange = useCallback((field: string, value: string) => {
    onChange({ data: { ...data, [field]: value } });
  }, [data, onChange]);

  return (
    <div className="welcome-editor">
      <div className="form-group">
        <label htmlFor="welcome-title">Title</label>
        <input
          id="welcome-title"
          type="text"
          className="form-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Course title..."
          disabled={readOnly}
        />
      </div>
      <div className="form-group">
        <label htmlFor="welcome-subtitle">Subtitle</label>
        <input
          id="welcome-subtitle"
          type="text"
          className="form-input"
          value={data.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Course subtitle..."
          disabled={readOnly}
        />
      </div>
      <div className="form-group">
        <label htmlFor="welcome-description">Description</label>
        <textarea
          id="welcome-description"
          className="form-textarea"
          rows={4}
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Course description..."
          disabled={readOnly}
        />
      </div>
    </div>
  );
};
