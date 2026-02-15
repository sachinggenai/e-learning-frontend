/**
 * VideoSlide — Video-based content slide with optional overlay text.
 *
 * Category: media-rich
 */

import React, { useRef, useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

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
    <div style={{ position: 'relative' }}>
      {data?.title && <h3 style={{ marginBottom: 12 }}>{data.title}</h3>}
      {data?.videoUrl ? (
        <video
          ref={videoRef}
          src={data.videoUrl}
          poster={data.posterUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          style={{ width: '100%', borderRadius: 8 }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: 300,
            background: '#f1f5f9',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: 14,
          }}
        >
          No video source set
        </div>
      )}
      {data?.overlayText && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 16,
            right: 16,
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {data.overlayText}
        </div>
      )}
      {data?.caption && (
        <p style={{ marginTop: 8, fontSize: 13, color: '#64748b', textAlign: 'center' }}>
          {data.caption}
        </p>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const VideoSlideEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </label>
      <input
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
        style={{
          width: '100%',
          padding: '6px 8px',
          border: '1px solid #e2e8f0',
          borderRadius: 4,
          fontSize: 13,
        }}
      />
    </div>
  );

  return (
    <div>
      {field('Title', 'title', 'text', 'Video Slide')}
      {field('Video URL', 'videoUrl', 'text', 'https://…/video.mp4')}
      {field('Poster Image URL', 'posterUrl', 'text', 'https://…/poster.jpg')}
      {field('Overlay Text', 'overlayText', 'text', 'Key takeaway…')}
      {field('Caption', 'caption', 'text', 'A short caption')}
      {field('Watch Threshold (0-1)', 'watchThreshold', 'number', '0.9')}
    </div>
  );
};
