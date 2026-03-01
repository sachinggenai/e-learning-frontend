import React, { useCallback } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './TextWithMedia.css';

type MediaType = 'none' | 'image' | 'video';
type MediaPosition = 'left' | 'right';

interface TextWithMediaData {
  title?: string;
  body?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  mediaPosition?: MediaPosition;
}

export const TextWithMediaPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  const componentData = (data ?? {}) as TextWithMediaData;
  const mediaType = componentData.mediaType ?? 'none';
  const mediaPosition = componentData.mediaPosition ?? 'right';

  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  const hasMedia = mediaType !== 'none' && Boolean(componentData.mediaUrl);

  return (
    <article className={`tpl-text-media tpl-text-media--${mediaPosition}`}>
      <div className="tpl-text-media__text">
        {componentData.title && <h3 className="tpl-text-media__title">{componentData.title}</h3>}
        <div
          className="tpl-text-media__body"
          dangerouslySetInnerHTML={{ __html: componentData.body || '' }}
        />
      </div>

      {hasMedia && (
        <div className="tpl-text-media__media" aria-label="Media section">
          {mediaType === 'image' ? (
            <img src={componentData.mediaUrl} alt="" className="tpl-text-media__image" />
          ) : (
            <video className="tpl-text-media__video" controls>
              <source src={componentData.mediaUrl} />
            </video>
          )}
        </div>
      )}
    </article>
  );
};

export const TextWithMediaEditor: React.FC<ComponentEditorProps> = ({ data, onChange, readOnly }) => {
  const componentData = (data ?? {}) as TextWithMediaData;

  const updateField = useCallback(
    (field: keyof TextWithMediaData, value: string) => {
      onChange({ data: { ...componentData, [field]: value } });
    },
    [componentData, onChange]
  );

  return (
    <div className="tpl-text-media-editor">
      <div className="tpl-text-media-editor__field">
        <label className="tpl-text-media-editor__label" htmlFor="twm-title">
          Title
        </label>
        <input
          id="twm-title"
          className="tpl-text-media-editor__input"
          type="text"
          value={componentData.title ?? ''}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="Text with Media"
          disabled={readOnly}
        />
      </div>

      <div className="tpl-text-media-editor__field">
        <label className="tpl-text-media-editor__label" htmlFor="twm-body">
          Content
        </label>
        <textarea
          id="twm-body"
          className="tpl-text-media-editor__textarea"
          rows={8}
          value={componentData.body ?? ''}
          onChange={(event) => updateField('body', event.target.value)}
          placeholder="Enter your content..."
          disabled={readOnly}
        />
      </div>

      <div className="tpl-text-media-editor__grid">
        <div className="tpl-text-media-editor__field">
          <label className="tpl-text-media-editor__label" htmlFor="twm-media-type">
            Media Type
          </label>
          <select
            id="twm-media-type"
            className="tpl-text-media-editor__input"
            value={componentData.mediaType ?? 'none'}
            onChange={(event) => updateField('mediaType', event.target.value)}
            disabled={readOnly}
          >
            <option value="none">None</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="tpl-text-media-editor__field">
          <label className="tpl-text-media-editor__label" htmlFor="twm-media-position">
            Media Position
          </label>
          <select
            id="twm-media-position"
            className="tpl-text-media-editor__input"
            value={componentData.mediaPosition ?? 'right'}
            onChange={(event) => updateField('mediaPosition', event.target.value)}
            disabled={readOnly}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="tpl-text-media-editor__field">
        <label className="tpl-text-media-editor__label" htmlFor="twm-media-url">
          Media URL
        </label>
        <input
          id="twm-media-url"
          className="tpl-text-media-editor__input"
          type="text"
          value={componentData.mediaUrl ?? ''}
          onChange={(event) => updateField('mediaUrl', event.target.value)}
          placeholder="https://..."
          disabled={readOnly}
        />
      </div>
    </div>
  );
};
