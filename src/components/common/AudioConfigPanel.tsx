/**
 * AudioConfigPanel — Page-level audio management panel.
 *
 * Allows course authors to:
 *  - Upload audio files per page / per component
 *  - Configure trigger behaviour (on load, on click, on interaction)
 *  - Set autoplay and completion requirements
 *  - Preview audio inline
 *
 * Uses AudioService for upload / CRUD operations.
 */

import React, { useState, useCallback, useRef } from 'react';
import { audioService } from '../../services/AudioService';
import { AudioConfig, AudioItem } from '../../types/course';
import './AudioConfigPanel.css';

interface AudioConfigPanelProps {
  courseId: string;
  pageId: string;
  /** Optional component ID — when set, configures per-component audio */
  componentId?: string;
  config: AudioConfig;
  onChange: (config: AudioConfig) => void;
  /** Labels for interaction-specific triggers (e.g., tab titles) */
  interactionLabels?: { id: string; label: string }[];
}

export const AudioConfigPanel: React.FC<AudioConfigPanelProps> = ({
  courseId,
  config,
  onChange,
  interactionLabels = [],
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = useCallback(() => {
    onChange({ ...config, enabled: !config.enabled });
  }, [config, onChange]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file (mp3, wav, ogg)');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File must be under 50 MB');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const result = await audioService.uploadAudio(file, courseId);
      const newItem: AudioItem = {
        audioId: result.audioId,
        audioUrl: result.audioUrl,
        triggerOn: 'load',
        autoplay: false,
        requiredForCompletion: false,
        duration: result.duration ?? undefined,
      };
      onChange({
        ...config,
        enabled: true,
        audioItems: [...config.audioItems, newItem],
      });
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [courseId, config, onChange]);

  const updateItem = useCallback((idx: number, updates: Partial<AudioItem>) => {
    const items = [...config.audioItems];
    items[idx] = { ...items[idx], ...updates };
    onChange({ ...config, audioItems: items });
  }, [config, onChange]);

  const removeItem = useCallback((idx: number) => {
    onChange({
      ...config,
      audioItems: config.audioItems.filter((_, i) => i !== idx),
    });
  }, [config, onChange]);

  return (
    <div className="audio-config-panel">
      <div className="acp-header">
        <h4>Audio Narration</h4>
        <label className="acp-toggle">
          <input type="checkbox" checked={config.enabled} onChange={handleToggle} />
          <span>{config.enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </div>

      {config.enabled && (
        <div className="acp-body">
          {config.audioItems.map((item, idx) => (
            <div key={idx} className="acp-item">
              <div className="acp-item-header">
                <span className="acp-item-label">
                  {item.audioId ? `Audio ${idx + 1}` : 'Pending upload'}
                </span>
                <button className="acp-remove" onClick={() => removeItem(idx)} aria-label="Remove">
                  ×
                </button>
              </div>

              {/* Mini player preview */}
              {item.audioUrl && (
                <audio controls preload="metadata" className="acp-player">
                  <source src={item.audioUrl} />
                </audio>
              )}

              <div className="acp-field">
                <label>Trigger</label>
                <select
                  value={item.triggerOn}
                  onChange={(e) =>
                    updateItem(idx, { triggerOn: e.target.value as AudioItem['triggerOn'] })
                  }
                >
                  <option value="load">On page load</option>
                  <option value="click">On click</option>
                  <option value="interaction">On interaction</option>
                </select>
              </div>

              {item.triggerOn === 'interaction' && interactionLabels.length > 0 && (
                <div className="acp-field">
                  <label>Target Interaction</label>
                  <select
                    value={item.targetInteractionId ?? ''}
                    onChange={(e) =>
                      updateItem(idx, { targetInteractionId: e.target.value || null })
                    }
                  >
                    <option value="">Select...</option>
                    {interactionLabels.map((il) => (
                      <option key={il.id} value={il.id}>
                        {il.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="acp-toggles">
                <label>
                  <input
                    type="checkbox"
                    checked={item.autoplay}
                    onChange={(e) => updateItem(idx, { autoplay: e.target.checked })}
                  />
                  Autoplay
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={item.requiredForCompletion}
                    onChange={(e) =>
                      updateItem(idx, { requiredForCompletion: e.target.checked })
                    }
                  />
                  Required for completion
                </label>
              </div>
            </div>
          ))}

          {/* Upload button */}
          <div className="acp-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            <button
              className="acp-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : '+ Upload Audio'}
            </button>
          </div>

          {error && <p className="acp-error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AudioConfigPanel;
