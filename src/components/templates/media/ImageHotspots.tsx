/**
 * ImageHotspots — Interactive image with clickable hotspots.
 *
 * Preview: Image with positioned hotspot markers that reveal info.
 * Editor: Upload/set image, add hotspots with position and content.
 *
 * Category: media-rich
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './ImageHotspots.css';

interface Hotspot {
  id: string;
  label: string;
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// ─── Preview ──────────────────────────────────────────────────────
export const ImageHotspotsPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const hotspots: Hotspot[] = data?.hotspots ?? [];
  const imageUrl: string = data?.imageUrl ?? '';
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  const handleClick = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(id);
      onInteraction?.({
        interactionType: 'hotspot-click',
        componentId: '',
        interactionId: id,
        value: true,
      });
      if (next.size === hotspots.length) onComplete?.('');
      return next;
    });
  }, [hotspots.length, onInteraction, onComplete]);

  return (
    <div className="tpl-image-hotspots">
      {data?.title && <h3 className="tpl-image-hotspots__title">{data.title}</h3>}
      {data?.instructions && (
        <p className="tpl-image-hotspots__instructions">{data.instructions}</p>
      )}
      <div className="tpl-image-hotspots__stage">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data?.title ?? 'Interactive image'}
            className="tpl-image-hotspots__image"
          />
        ) : (
          <div className="tpl-image-hotspots__placeholder">
            No image set
          </div>
        )}

        {hotspots.map((hs) => (
          <React.Fragment key={hs.id}>
            <button
              onClick={() => handleClick(hs.id)}
              className={`tpl-image-hotspots__marker ${viewed.has(hs.id) ? 'tpl-image-hotspots__marker--viewed' : ''} ${activeId === hs.id ? 'tpl-image-hotspots__marker--active' : ''}`}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              aria-label={`Hotspot: ${hs.label}`}
            >
              +
            </button>

            {activeId === hs.id && (
              <div
                className="tpl-image-hotspots__tooltip"
                style={{ left: `${Math.min(hs.x, 70)}%`, top: `${Math.min(hs.y + 6, 90)}%` }}
              >
                <h5 className="tpl-image-hotspots__tooltip-title">{hs.label}</h5>
                <p className="tpl-image-hotspots__tooltip-content">
                  {hs.content}
                </p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className={`tpl-image-hotspots__progress ${viewed.size === hotspots.length && hotspots.length > 0 ? 'tpl-image-hotspots__progress--complete' : ''}`}>
        {viewed.size} / {hotspots.length} hotspots explored
      </p>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ImageHotspotsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const hotspots: Hotspot[] = data?.hotspots ?? [];

  const updateHotspot = (idx: number, field: keyof Hotspot, value: string | number) => {
    const updated = [...hotspots];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, hotspots: updated } });
  };

  const addHotspot = () => {
    onChange({
      data: {
        ...data,
        hotspots: [
          ...hotspots,
          { id: `hs-${Date.now()}`, label: '', content: '', x: 50, y: 50 },
        ],
      },
    });
  };

  const removeHotspot = (idx: number) => {
    onChange({ data: { ...data, hotspots: hotspots.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="tpl-image-hotspots-editor">
      <div className="tpl-image-hotspots-editor__field">
        <label className="tpl-image-hotspots-editor__label">Title</label>
        <input
          type="text"
          className="tpl-image-hotspots-editor__input"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Image Hotspots"
        />
      </div>

      <div className="tpl-image-hotspots-editor__field">
        <label className="tpl-image-hotspots-editor__label">Image URL</label>
        <input
          type="text"
          className="tpl-image-hotspots-editor__input"
          value={data?.imageUrl ?? ''}
          onChange={(e) => onChange({ data: { ...data, imageUrl: e.target.value } })}
          placeholder="https://..."
        />
      </div>

      <div className="tpl-image-hotspots-editor__field">
        <label className="tpl-image-hotspots-editor__label">Instructions</label>
        <input
          type="text"
          className="tpl-image-hotspots-editor__input"
          value={data?.instructions ?? ''}
          onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })}
          placeholder="Click the hotspots to learn more"
        />
      </div>

      {hotspots.map((hs, idx) => (
        <div key={hs.id} className="tpl-image-hotspots-editor__hotspot">
          <div className="tpl-image-hotspots-editor__hotspot-header">
            <span className="tpl-image-hotspots-editor__hotspot-title">Hotspot {idx + 1}</span>
            <button
              onClick={() => removeHotspot(idx)}
              className="tpl-image-hotspots-editor__delete"
              aria-label={`Delete hotspot ${idx + 1}`}
            >
              ×
            </button>
          </div>
          <div className="tpl-image-hotspots-editor__hotspot-grid">
            <div className="tpl-image-hotspots-editor__field">
              <label className="tpl-image-hotspots-editor__label">Label</label>
              <input
                type="text"
                className="tpl-image-hotspots-editor__input"
                value={hs.label}
                onChange={(e) => updateHotspot(idx, 'label', e.target.value)}
              />
            </div>
            <div className="tpl-image-hotspots-editor__coords">
              <label className="tpl-image-hotspots-editor__label">X (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className="tpl-image-hotspots-editor__input"
                value={hs.x}
                onChange={(e) => updateHotspot(idx, 'x', Number(e.target.value))}
              />
            </div>
            <div className="tpl-image-hotspots-editor__coords">
              <label className="tpl-image-hotspots-editor__label">Y (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className="tpl-image-hotspots-editor__input"
                value={hs.y}
                onChange={(e) => updateHotspot(idx, 'y', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="tpl-image-hotspots-editor__field">
            <label className="tpl-image-hotspots-editor__label">Content</label>
            <textarea
              className="tpl-image-hotspots-editor__textarea"
              value={hs.content}
              onChange={(e) => updateHotspot(idx, 'content', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}

      <button onClick={addHotspot} className="tpl-image-hotspots-editor__add-button">
        + Add Hotspot
      </button>
    </div>
  );
};
