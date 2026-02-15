/**
 * ResourcesDownloads — Downloadable resources and links list.
 *
 * Category: navigation
 */

import React from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'pdf' | 'doc' | 'link' | 'video' | 'image' | 'other';
  fileSize?: string;
}

const TYPE_ICONS: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  link: '🔗',
  video: '🎬',
  image: '🖼️',
  other: '📎',
};

// ─── Preview ──────────────────────────────────────────────────────
export const ResourcesDownloadsPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const resources: Resource[] = data?.resources ?? [];

  return (
    <div>
      {data?.title && <h3 style={{ marginBottom: 4 }}>{data.title}</h3>}
      {data?.description && (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{data.description}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {resources.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              textDecoration: 'none',
              color: '#1e293b',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              background: '#fff',
            }}
          >
            <span style={{ fontSize: 28 }}>{TYPE_ICONS[r.type] ?? '📎'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              {r.description && (
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {r.description}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: '#f1f5f9',
                  color: '#475569',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {r.type}
              </span>
              {r.fileSize && (
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{r.fileSize}</span>
              )}
            </div>
          </a>
        ))}
      </div>

      {resources.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>
          No resources added yet.
        </p>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ResourcesDownloadsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const resources: Resource[] = data?.resources ?? [];

  const updateResource = (idx: number, field: keyof Resource, value: string) => {
    const updated = [...resources];
    updated[idx] = { ...updated[idx], [field]: value } as Resource;
    onChange({ data: { ...data, resources: updated } });
  };

  const addResource = () => {
    onChange({
      data: {
        ...data,
        resources: [
          ...resources,
          {
            id: `res-${Date.now()}`,
            title: '',
            url: '',
            type: 'link',
          },
        ],
      },
    });
  };

  const removeResource = (idx: number) => {
    onChange({ data: { ...data, resources: resources.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input type="text" value={data?.title ?? ''} onChange={(e) => onChange({ data: { ...data, title: e.target.value } })} placeholder="Resources & Downloads" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Description</label>
        <input type="text" value={data?.description ?? ''} onChange={(e) => onChange({ data: { ...data, description: e.target.value } })} placeholder="Supplementary materials" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>

      {resources.map((r, idx) => (
        <div key={r.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Resource {idx + 1}</span>
            <button onClick={() => removeResource(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Title</label>
              <input type="text" value={r.title} onChange={(e) => updateResource(idx, 'title', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ width: 100 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Type</label>
              <select value={r.type} onChange={(e) => updateResource(idx, 'type', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}>
                <option value="pdf">PDF</option>
                <option value="doc">Doc</option>
                <option value="link">Link</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>URL</label>
            <input type="text" value={r.url} onChange={(e) => updateResource(idx, 'url', e.target.value)} placeholder="https://…" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Description</label>
              <input type="text" value={r.description ?? ''} onChange={(e) => updateResource(idx, 'description', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div style={{ width: 80 }}>
              <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Size</label>
              <input type="text" value={r.fileSize ?? ''} onChange={(e) => updateResource(idx, 'fileSize', e.target.value)} placeholder="2.4 MB" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addResource} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Resource
      </button>
    </div>
  );
};
