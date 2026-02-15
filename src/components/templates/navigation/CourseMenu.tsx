/**
 * CourseMenu — Navigation component showing course structure.
 *
 * Category: navigation
 */

import React from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface MenuItem {
  id: string;
  label: string;
  pageId?: string;
  icon?: string;
  children?: MenuItem[];
}

// ─── Preview ──────────────────────────────────────────────────────
export const CourseMenuPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const items: MenuItem[] = data?.items ?? [];
  const currentPageId: string | undefined = data?.currentPageId;

  const renderItem = (item: MenuItem, depth: number) => {
    const isActive = item.pageId === currentPageId;
    return (
      <React.Fragment key={item.id}>
        <div
          style={{
            padding: '10px 14px',
            paddingLeft: 14 + depth * 20,
            borderRadius: 6,
            background: isActive ? '#eff6ff' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#2563eb' : '#374151',
            fontSize: 14,
            cursor: item.pageId ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
          }}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </div>
        {item.children?.map((child) => renderItem(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div>
      {data?.title && (
        <h4
          style={{
            margin: '0 0 12px',
            padding: '0 14px',
            fontSize: 16,
            color: '#1e293b',
          }}
        >
          {data.title}
        </h4>
      )}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => renderItem(item, 0))}
      </nav>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const CourseMenuEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const items: MenuItem[] = data?.items ?? [];

  const updateItem = (idx: number, field: keyof MenuItem, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, items: updated } });
  };

  const addItem = () => {
    onChange({
      data: {
        ...data,
        items: [...items, { id: `mi-${Date.now()}`, label: '', icon: '📄' }],
      },
    });
  };

  const removeItem = (idx: number) => {
    onChange({ data: { ...data, items: items.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
          Menu Title
        </label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Course Menu"
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            fontSize: 13,
          }}
        />
      </div>

      {items.map((item, idx) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 8,
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            value={item.icon ?? ''}
            onChange={(e) => updateItem(idx, 'icon', e.target.value)}
            style={{ width: 40, padding: '6px 4px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, textAlign: 'center' }}
          />
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateItem(idx, 'label', e.target.value)}
            placeholder="Menu item label"
            style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
          />
          <button
            onClick={() => removeItem(idx)}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        style={{
          width: '100%',
          padding: 10,
          border: '2px dashed #cbd5e1',
          borderRadius: 6,
          background: 'transparent',
          color: '#3b82f6',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        + Add Menu Item
      </button>
    </div>
  );
};
