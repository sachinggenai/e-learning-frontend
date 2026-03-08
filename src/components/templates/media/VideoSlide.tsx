/**
 * VideoSlide — Video-based content slide with optional overlay text.
 *
 * Category: media-rich
 */

import React, { useRef, useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './VideoSlide.css';

// ─── Preview ──────────────────────────────────────────────────────
export const VideoSlidePreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const watchThreshold = data?.watchThreshold ?? 0.9;

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || hasEnded) return;
    if (v.currentTime / v.duration >= watchThreshold) {
      setHasEnded(true);
      onInteraction?.({
        interactionType: 'video-watched',
        componentId: '',
        interactionId: 'video',
        value: true,
      });
      onComplete?.('');
    }
  }, [hasEnded, watchThreshold, onInteraction, onComplete]);

  return (
    <div className="tpl-video-slide" role="region" aria-label="Video content slide">
      {data?.title && <h3 className="tpl-video-slide__title">{data.title}</h3>}
      {data?.videoUrl ? (
        <video
          ref={videoRef}
          src={data.videoUrl}
          poster={data.posterUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="tpl-video-slide__player"
          aria-label={data?.title ? `Video: ${data.title}` : 'Video player'}
        />
      ) : (
        <div className="tpl-video-slide__placeholder" role="status" aria-label="No video source">
          No video source set
        </div>
      )}
      {data?.overlayText && (
        <div className="tpl-video-slide__overlay" aria-live="polite">
          {data.overlayText}
        </div>
      )}
      {data?.caption && (
        <p className="tpl-video-slide__caption">
          {data.caption}
        </p>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const VideoSlideEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div className="tpl-video-slide-editor__field">
      <label className="tpl-video-slide-editor__label" htmlFor={`video-slide-${key}`}>
        {label}
      </label>
      <input
        id={`video-slide-${key}`}
        type={type}
        value={data?.[key] ?? ''}
        onChange={(e) =>
          onChange({
            data: {
              ...data,
              [key]: type === 'number' ? Number(e.target.value) : e.target.value,
            },
          })
        }
        placeholder={placeholder}
        className="tpl-video-slide-editor__input"
        aria-label={label}
      />
    </div>
  );

  return (
    <div className="tpl-video-slide-editor">
      {field('Title', 'title', 'text', 'Video Slide')}
      {field('Video URL', 'videoUrl', 'text', 'https://…/video.mp4')}
      {field('Poster Image URL', 'posterUrl', 'text', 'https://…/poster.jpg')}
      {field('Overlay Text', 'overlayText', 'text', 'Key takeaway…')}
      {field('Caption', 'caption', 'text', 'A short caption')}
      {field('Watch Threshold (0-1)', 'watchThreshold', 'number', '0.9')}
    </div>
  );
};
