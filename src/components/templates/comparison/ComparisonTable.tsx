/**
 * ComparisonTable — Side-by-side comparison of items.
 *
 * Preview: Responsive table with columns and feature rows.
 * Editor: Add/edit columns and row features.
 *
 * Category: comparison
 */

import React from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface ComparisonColumn {
  id: string;
  header: string;
  highlighted?: boolean;
}

interface ComparisonRow {
  id: string;
  feature: string;
  values: Record<string, string>;
}

// ─── Preview ──────────────────────────────────────────────────────
export const ComparisonTablePreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const columns: ComparisonColumn[] = data?.columns ?? [];
  const rows: ComparisonRow[] = data?.rows ?? [];

  return (
    <div>
      {data?.title && <h3 style={{ marginBottom: 16 }}>{data.title}</h3>}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: 13,
                  color: '#64748b',
                }}
              >
                Feature
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    borderBottom: '2px solid #e2e8f0',
                    background: col.highlighted ? '#eff6ff' : 'transparent',
                    color: col.highlighted ? '#1d4ed8' : '#1e293b',
                    fontWeight: 600,
                  }}
                >
                  {col.header}
                  {col.highlighted && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: 10,
                        fontWeight: 400,
                        color: '#3b82f6',
                      }}
                    >
                      Recommended
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    fontWeight: 500,
                    background: idx % 2 === 0 ? '#fafafa' : '#fff',
                  }}
                >
                  {row.feature}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.id}
                    style={{
                      textAlign: 'center',
                      padding: '10px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      background: col.highlighted
                        ? idx % 2 === 0
                          ? '#eff6ff'
                          : '#f0f7ff'
                        : idx % 2 === 0
                        ? '#fafafa'
                        : '#fff',
                    }}
                  >
                    {row.values[col.id] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ComparisonTableEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const columns: ComparisonColumn[] = data?.columns ?? [];
  const rows: ComparisonRow[] = data?.rows ?? [];

  const addColumn = () => {
    onChange({
      data: {
        ...data,
        columns: [...columns, { id: `col-${Date.now()}`, header: '' }],
      },
    });
  };

  const addRow = () => {
    onChange({
      data: {
        ...data,
        rows: [...rows, { id: `row-${Date.now()}`, feature: '', values: {} }],
      },
    });
  };

  const updateColumn = (idx: number, header: string) => {
    const updated = [...columns];
    updated[idx] = { ...updated[idx], header };
    onChange({ data: { ...data, columns: updated } });
  };

  const updateRowFeature = (idx: number, feature: string) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], feature };
    onChange({ data: { ...data, rows: updated } });
  };

  const updateCell = (rowIdx: number, colId: string, value: string) => {
    const updated = [...rows];
    updated[rowIdx] = {
      ...updated[rowIdx],
      values: { ...updated[rowIdx].values, [colId]: value },
    };
    onChange({ data: { ...data, rows: updated } });
  };

  const removeColumn = (idx: number) => {
    onChange({ data: { ...data, columns: columns.filter((_, i) => i !== idx) } });
  };

  const removeRow = (idx: number) => {
    onChange({ data: { ...data, rows: rows.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Comparison"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      <h5 style={{ fontSize: 13, marginBottom: 8 }}>Columns</h5>
      {columns.map((col, idx) => (
        <div key={col.id} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
          <input
            type="text"
            value={col.header}
            onChange={(e) => updateColumn(idx, e.target.value)}
            placeholder={`Column ${idx + 1}`}
            style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
          />
          <label style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
            <input
              type="checkbox"
              checked={col.highlighted ?? false}
              onChange={(e) => {
                const updated = [...columns];
                updated[idx] = { ...updated[idx], highlighted: e.target.checked };
                onChange({ data: { ...data, columns: updated } });
              }}
            /> Highlight
          </label>
          <button onClick={() => removeColumn(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>×</button>
        </div>
      ))}
      <button onClick={addColumn} style={{ padding: '6px 12px', border: '1px dashed #cbd5e1', borderRadius: 4, background: 'transparent', color: '#3b82f6', fontSize: 12, cursor: 'pointer', marginBottom: 16 }}>
        + Column
      </button>

      <h5 style={{ fontSize: 13, marginBottom: 8 }}>Rows</h5>
      {rows.map((row, rIdx) => (
        <div key={row.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10, marginBottom: 8, background: '#f9fafb' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
            <input
              type="text"
              value={row.feature}
              onChange={(e) => updateRowFeature(rIdx, e.target.value)}
              placeholder="Feature name"
              style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
            />
            <button onClick={() => removeRow(rIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 6 }}>
            {columns.map((col) => (
              <input
                key={col.id}
                type="text"
                value={row.values[col.id] ?? ''}
                onChange={(e) => updateCell(rIdx, col.id, e.target.value)}
                placeholder={col.header || `Col ${columns.indexOf(col) + 1}`}
                style={{ padding: '4px 6px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12 }}
              />
            ))}
          </div>
        </div>
      ))}
      <button onClick={addRow} style={{ width: '100%', padding: 8, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Row
      </button>
    </div>
  );
};
