/**
 * Infographic — Visual data presentation with sections.
 *
 * Category: media-rich
 */

import React, { useState } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface Section {
  id: string;
  icon: string;
  heading: string;
  body: string;
  statValue?: string;
  statLabel?: string;
  color?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const InfographicPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const sections: Section[] = data?.sections ?? [];
  const layout = data?.layout ?? 'vertical'; // vertical | grid

  return (
    <div>
      {data?.title && (
        <h3 style={{ textAlign: 'center', marginBottom: 8 }}>{data.title}</h3>
      )}
      {data?.subtitle && (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          {data.subtitle}
        </p>
      )}

      <div
        style={{
          display: layout === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(200px, 1fr))' : undefined,
          flexDirection: layout === 'vertical' ? 'column' : undefined,
          gap: 20,
        }}
      >
        {sections.map((s, idx) => (
          <div
            key={s.id}
            style={{
              background: '#fff',
              border: `2px solid ${s.color || '#e2e8f0'}`,
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
              transition: 'transform 0.2s',
            }}
          >
            {s.icon && <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>}
            {s.statValue && (
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color || '#3b82f6' }}>
                {s.statValue}
              </div>
            )}
            {s.statLabel && (
              <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                {s.statLabel}
              </div>
            )}
            <h4 style={{ margin: '8px 0 4px', fontSize: 16 }}>{s.heading}</h4>
            <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const InfographicEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const sections: Section[] = data?.sections ?? [];

  const updateSection = (idx: number, field: keyof Section, value: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, sections: updated } });
  };

  const addSection = () => {
    onChange({
      data: {
        ...data,
        sections: [
          ...sections,
          { id: `sec-${Date.now()}`, icon: '📊', heading: '', body: '', color: '#3b82f6' },
        ],
      },
    });
  };

  const removeSection = (idx: number) => {
    onChange({ data: { ...data, sections: sections.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input type="text" value={data?.title ?? ''} onChange={(e) => onChange({ data: { ...data, title: e.target.value } })} placeholder="Infographic Title" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Subtitle</label>
        <input type="text" value={data?.subtitle ?? ''} onChange={(e) => onChange({ data: { ...data, subtitle: e.target.value } })} placeholder="A brief subtitle" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Layout</label>
        <select value={data?.layout ?? 'vertical'} onChange={(e) => onChange({ data: { ...data, layout: e.target.value } })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}>
          <option value="vertical">Vertical</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      {sections.map((s, idx) => (
        <div key={s.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Section {idx + 1}</span>
            <button onClick={() => removeSection(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 60 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Icon</label>
              <input type="text" value={s.icon} onChange={(e) => updateSection(idx, 'icon', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Heading</label>
              <input type="text" value={s.heading} onChange={(e) => updateSection(idx, 'heading', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ width: 80 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Color</label>
              <input type="color" value={s.color || '#3b82f6'} onChange={(e) => updateSection(idx, 'color', e.target.value)} style={{ width: '100%', height: 30, padding: 0, border: '1px solid #e2e8f0', borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Stat Value</label>
              <input type="text" value={s.statValue ?? ''} onChange={(e) => updateSection(idx, 'statValue', e.target.value)} placeholder="42%" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Stat Label</label>
              <input type="text" value={s.statLabel ?? ''} onChange={(e) => updateSection(idx, 'statLabel', e.target.value)} placeholder="Increase" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Body</label>
            <textarea value={s.body} onChange={(e) => updateSection(idx, 'body', e.target.value)} rows={2} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addSection} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Section
      </button>
    </div>
  );
};
