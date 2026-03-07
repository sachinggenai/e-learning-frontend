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
import './ComparisonTable.css';

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
    <div className="tpl-comparison-table">
      {data?.title && <h3 className="tpl-comparison-table__title">{data.title}</h3>}
      <div className="tpl-comparison-table__wrapper">
        <table className="tpl-comparison-table__table">
          <thead>
            <tr className="tpl-comparison-table__header-row">
              <th className="tpl-comparison-table__header-cell tpl-comparison-table__header-cell--feature">
                Feature
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`tpl-comparison-table__header-cell tpl-comparison-table__header-cell--column ${
                    col.highlighted ? 'tpl-comparison-table__header-cell--highlighted' : ''
                  }`}
                >
                  {col.header}
                  {col.highlighted && (
                    <span className="tpl-comparison-table__recommended-badge">
                      Recommended
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`tpl-comparison-table__row ${
                  idx % 2 === 0 ? 'tpl-comparison-table__row--even' : 'tpl-comparison-table__row--odd'
                }`}
              >
                <td className="tpl-comparison-table__cell tpl-comparison-table__cell--feature">
                  {row.feature}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={`tpl-comparison-table__cell tpl-comparison-table__cell--value ${
                      col.highlighted ? 'tpl-comparison-table__cell--highlighted' : ''
                    }`}
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
    <div className="tpl-comparison-table-editor">
      <div className="tpl-comparison-table-editor__title-group">
        <label className="tpl-comparison-table-editor__label">Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Comparison"
          className="tpl-comparison-table-editor__input"
        />
      </div>

      <h5 className="tpl-comparison-table-editor__section-title">Columns</h5>
      <div className="tpl-comparison-table-editor__columns">
        {columns.map((col, idx) => (
          <div key={col.id} className="tpl-comparison-table-editor__column-item">
            <input
              type="text"
              value={col.header}
              onChange={(e) => updateColumn(idx, e.target.value)}
              placeholder={`Column ${idx + 1}`}
              className="tpl-comparison-table-editor__column-input"
            />
            <label className="tpl-comparison-table-editor__highlight-label">
              <input
                type="checkbox"
                checked={col.highlighted ?? false}
                onChange={(e) => {
                  const updated = [...columns];
                  updated[idx] = { ...updated[idx], highlighted: e.target.checked };
                  onChange({ data: { ...data, columns: updated } });
                }}
                className="tpl-comparison-table-editor__highlight-checkbox"
              /> Highlight
            </label>
            <button
              onClick={() => removeColumn(idx)}
              className="tpl-comparison-table-editor__remove-btn"
              aria-label="Remove column"
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={addColumn} className="tpl-comparison-table-editor__add-column-btn">
          + Column
        </button>
      </div>

      <h5 className="tpl-comparison-table-editor__section-title">Rows</h5>
      <div className="tpl-comparison-table-editor__rows">
        {rows.map((row, rIdx) => (
          <div key={row.id} className="tpl-comparison-table-editor__row-item">
            <div className="tpl-comparison-table-editor__row-header">
              <input
                type="text"
                value={row.feature}
                onChange={(e) => updateRowFeature(rIdx, e.target.value)}
                placeholder="Feature name"
                className="tpl-comparison-table-editor__row-feature-input"
              />
              <button
                onClick={() => removeRow(rIdx)}
                className="tpl-comparison-table-editor__remove-btn"
                aria-label="Remove row"
              >
                ×
              </button>
            </div>
            <div
              className="tpl-comparison-table-editor__row-cells"
              style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            >
              {columns.map((col) => (
                <input
                  key={col.id}
                  type="text"
                  value={row.values[col.id] ?? ''}
                  onChange={(e) => updateCell(rIdx, col.id, e.target.value)}
                  placeholder={col.header || `Col ${columns.indexOf(col) + 1}`}
                  className="tpl-comparison-table-editor__cell-input"
                />
              ))}
            </div>
          </div>
        ))}
        <button onClick={addRow} className="tpl-comparison-table-editor__add-row-btn">
          + Add Row
        </button>
      </div>
    </div>
  );
};
