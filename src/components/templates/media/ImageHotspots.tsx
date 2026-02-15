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
    <div>
      {data?.title && <h3 style={{ marginBottom: 16 }}>{data.title}</h3>}
      {data?.instructions && (
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>{data.instructions}</p>
      )}
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data?.title ?? 'Interactive image'}
            style={{ width: '100%', borderRadius: 8, display: 'block' }}
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
            }}
          >
            No image set
          </div>
        )}

        {hotspots.map((hs) => (
          <React.Fragment key={hs.id}>
            <button
              onClick={() => handleClick(hs.id)}
              style={{
                position: 'absolute',
                left: `${hs.x}%`,
                top: `${hs.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: viewed.has(hs.id) ? '#22c55e' : '#3b82f6',
                color: '#fff',
                border: '3px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
              aria-label={`Hotspot: ${hs.label}`}
            >
              +
            </button>

            {activeId === hs.id && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(hs.x, 70)}%`,
                  top: `${hs.y + 4}%`,
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 16,
                  maxWidth: 250,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  zIndex: 20,
                }}
              >
                <h5 style={{ margin: '0 0 6px', fontSize: 14 }}>{hs.label}</h5>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                  {hs.content}
                </p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
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
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input type="text" value={data?.title ?? ''} onChange={(e) => onChange({ data: { ...data, title: e.target.value } })} placeholder="Image Hotspots" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Image URL</label>
        <input type="text" value={data?.imageUrl ?? ''} onChange={(e) => onChange({ data: { ...data, imageUrl: e.target.value } })} placeholder="https://..." style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Instructions</label>
        <input type="text" value={data?.instructions ?? ''} onChange={(e) => onChange({ data: { ...data, instructions: e.target.value } })} placeholder="Click the hotspots to learn more" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>

      {hotspots.map((hs, idx) => (
        <div key={hs.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Hotspot {idx + 1}</span>
            <button onClick={() => removeHotspot(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Label</label>
              <input type="text" value={hs.label} onChange={(e) => updateHotspot(idx, 'label', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ width: 70 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>X (%)</label>
              <input type="number" min={0} max={100} value={hs.x} onChange={(e) => updateHotspot(idx, 'x', Number(e.target.value))} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ width: 70 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Y (%)</label>
              <input type="number" min={0} max={100} value={hs.y} onChange={(e) => updateHotspot(idx, 'y', Number(e.target.value))} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Content</label>
            <textarea value={hs.content} onChange={(e) => updateHotspot(idx, 'content', e.target.value)} rows={2} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addHotspot} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Hotspot
      </button>
    </div>
  );
};
