/**
 * AudioSlide — Audio-based content slide with optional transcript.
 *
 * Category: media-rich
 */

import React, { useRef, useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './AudioSlide.css';

// ─── Preview ──────────────────────────────────────────────────────
export const AudioSlidePreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const listenThreshold = data?.listenThreshold ?? 0.9;

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasEnded) return;
    if (audio.currentTime / audio.duration >= listenThreshold) {
      setHasEnded(true);
      onInteraction?.({
        interactionType: 'audio-listened',
        componentId: '',
        interactionId: 'audio',
        value: true,
      });
      onComplete?.('');
    }
  }, [hasEnded, listenThreshold, onInteraction, onComplete]);

  return (
    <div className="tpl-audio-slide" role="region" aria-label="Audio content slide">
      {data?.title && <h3 className="tpl-audio-slide__title">{data.title}</h3>}
      
      {data?.description && (
        <p className="tpl-audio-slide__description">{data.description}</p>
      )}

      {data?.visualUrl && (
        <div className="tpl-audio-slide__visual">
          <img
            src={data.visualUrl}
            alt={data?.visualAlt || 'Audio content visual'}
            className="tpl-audio-slide__visual-img"
          />
        </div>
      )}

      {data?.audioUrl ? (
        <div className="tpl-audio-slide__player-container">
          <audio
            ref={audioRef}
            src={data.audioUrl}
            controls
            onTimeUpdate={handleTimeUpdate}
            className="tpl-audio-slide__player"
            aria-label={data?.title ? `Audio: ${data.title}` : 'Audio player'}
          />
        </div>
      ) : (
        <div
          className="tpl-audio-slide__placeholder"
          role="status"
          aria-label="No audio source"
        >
          <div className="tpl-audio-slide__placeholder-icon" aria-hidden="true">
            🎵
          </div>
          <div>No audio source set</div>
        </div>
      )}

      {data?.transcript && (
        <div className="tpl-audio-slide__transcript" role="complementary">
          <h4 className="tpl-audio-slide__transcript-title">Transcript</h4>
          <p className="tpl-audio-slide__transcript-text">{data.transcript}</p>
        </div>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const AudioSlideEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div className="tpl-audio-slide-editor__field">
      <label className="tpl-audio-slide-editor__label" htmlFor={`audio-slide-${key}`}>
        {label}
      </label>
      <input
        id={`audio-slide-${key}`}
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
        className="tpl-audio-slide-editor__input"
        aria-label={label}
      />
    </div>
  );

  const textareaField = (label: string, key: string, placeholder = '') => (
    <div className="tpl-audio-slide-editor__field">
      <label className="tpl-audio-slide-editor__label" htmlFor={`audio-slide-${key}`}>
        {label}
      </label>
      <textarea
        id={`audio-slide-${key}`}
        value={data?.[key] ?? ''}
        onChange={(e) =>
          onChange({
            data: {
              ...data,
              [key]: e.target.value,
            },
          })
        }
        placeholder={placeholder}
        className="tpl-audio-slide-editor__textarea"
        aria-label={label}
      />
    </div>
  );

  return (
    <div className="tpl-audio-slide-editor">
      {field('Title', 'title', 'text', 'Audio Slide Title')}
      {textareaField('Description', 'description', 'A brief description of the audio content…')}
      {field('Audio URL', 'audioUrl', 'text', 'https://…/audio.mp3')}
      {field('Visual Image URL', 'visualUrl', 'text', 'https://…/image.jpg')}
      {field('Visual Alt Text', 'visualAlt', 'text', 'Descriptive alt text')}
      {textareaField('Transcript', 'transcript', 'Full audio transcript…')}
      {field('Listen Threshold (0-1)', 'listenThreshold', 'number', '0.9')}
    </div>
  );
};
