/**
 * ContentImage Component — Legacy migration
 */

import React, { useCallback } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

export const ContentImagePreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  return (
    <article className="content-image-component">
      {data.title && <h2 className="content-image__title">{data.title}</h2>}
      {data.imageUrl && (
        <figure className="content-image__figure">
          <img
            src={data.imageUrl}
            alt={data.altText || data.title || 'Course image'}
            className="content-image__img"
            loading="lazy"
          />
          {data.caption && <figcaption className="content-image__caption">{data.caption}</figcaption>}
        </figure>
      )}
      {data.body && <div className="content-image__body" dangerouslySetInnerHTML={{ __html: data.body }} />}
    </article>
  );
};

export const ContentImageEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const handleChange = useCallback((field: string, value: string) => {
    onChange({ data: { ...data, [field]: value } });
  }, [data, onChange]);

  return (
    <div className="content-image-editor">
      <div className="form-group">
        <label htmlFor="img-title">Title</label>
        <input id="img-title" type="text" className="form-input" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="img-url">Image URL</label>
        <input id="img-url" type="url" className="form-input" value={data.imageUrl || ''} onChange={(e) => handleChange('imageUrl', e.target.value)} placeholder="https://..." disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="img-alt">Alt Text</label>
        <input id="img-alt" type="text" className="form-input" value={data.altText || ''} onChange={(e) => handleChange('altText', e.target.value)} placeholder="Describe the image..." disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="img-caption">Caption</label>
        <input id="img-caption" type="text" className="form-input" value={data.caption || ''} onChange={(e) => handleChange('caption', e.target.value)} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="img-body">Description</label>
        <textarea id="img-body" className="form-textarea" rows={4} value={data.body || ''} onChange={(e) => handleChange('body', e.target.value)} disabled={readOnly} />
      </div>
    </div>
  );
};
