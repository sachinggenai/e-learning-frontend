/**
 * ContentVideo Component — Legacy migration
 */

import React, { useCallback, useRef, useState } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

export const ContentVideoPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watched, setWatched] = useState(false);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || watched) return;
    if (video.currentTime / video.duration >= 0.9) {
      setWatched(true);
      onComplete?.(componentId);
      onInteraction?.({
        componentId,
        interactionType: 'view',
        completed: true,
      });
    }
  }, [componentId, watched, onComplete, onInteraction]);

  return (
    <article className="content-video-component">
      {data.title && <h2 className="content-video__title">{data.title}</h2>}
      {data.videoUrl ? (
        <div className="content-video__wrapper">
          <video
            ref={videoRef}
            src={data.videoUrl}
            controls
            className="content-video__player"
            onTimeUpdate={handleTimeUpdate}
            preload="metadata"
            aria-label={data.title || 'Course video'}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="content-video__placeholder">
          <p>No video URL configured.</p>
        </div>
      )}
      {data.body && <div className="content-video__body" dangerouslySetInnerHTML={{ __html: data.body }} />}
    </article>
  );
};

export const ContentVideoEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const handleChange = useCallback((field: string, value: string) => {
    onChange({ data: { ...data, [field]: value } });
  }, [data, onChange]);

  return (
    <div className="content-video-editor">
      <div className="form-group">
        <label htmlFor="video-title">Title</label>
        <input id="video-title" type="text" className="form-input" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="video-url">Video URL</label>
        <input id="video-url" type="url" className="form-input" value={data.videoUrl || ''} onChange={(e) => handleChange('videoUrl', e.target.value)} placeholder="https://..." disabled={readOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="video-body">Description</label>
        <textarea id="video-body" className="form-textarea" rows={4} value={data.body || ''} onChange={(e) => handleChange('body', e.target.value)} disabled={readOnly} />
      </div>
      {data.videoUrl && (
        <div className="content-video__preview">
          <h5>Preview</h5>
          <video src={data.videoUrl} controls style={{ maxWidth: '100%', maxHeight: '200px' }} preload="metadata" />
        </div>
      )}
    </div>
  );
};
