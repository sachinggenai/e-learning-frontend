/**
 * MatrixGrid — Flexible grid/matrix with row and column headers.
 *
 * Preview: Grid layout with labeled rows and columns.
 * Editor: Edit headers and cells in a grid structure.
 *
 * Category: comparison
 */

import React from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './MatrixGrid.css';

// ─── Preview ──────────────────────────────────────────────────────
export const MatrixGridPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const title: string = data?.title ?? '';
  const rowHeaders: string[] = data?.rowHeaders ?? [];
  const columnHeaders: string[] = data?.columnHeaders ?? [];
  const cells: string[][] = data?.cells ?? [];

  const hasContent = rowHeaders.length > 0 && columnHeaders.length > 0;

  if (!hasContent) {
    return (
      <div className="tpl-matrix-grid">
        {title && <h3 className="tpl-matrix-grid__title">{title}</h3>}
        <div className="tpl-matrix-grid__empty">
          Add row and column headers to create the matrix
        </div>
      </div>
    );
  }

  // Grid template: corner cell + column headers + data rows
  const gridTemplateColumns = `auto repeat(${columnHeaders.length}, 1fr)`;

  return (
    <div className="tpl-matrix-grid">
      {title && <h3 className="tpl-matrix-grid__title">{title}</h3>}
      <div className="tpl-matrix-grid__wrapper">
        <div
          className="tpl-matrix-grid__grid"
          style={{ gridTemplateColumns }}
        >
          {/* Corner cell (empty) */}
          <div className="tpl-matrix-grid__header-cell tpl-matrix-grid__header-cell--corner"></div>

          {/* Column headers */}
          {columnHeaders.map((header, idx) => (
            <div key={`col-${idx}`} className="tpl-matrix-grid__header-cell">
              {header}
            </div>
          ))}

          {/* Rows with data */}
          {rowHeaders.map((rowHeader, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              {/* Row header */}
              <div className="tpl-matrix-grid__cell tpl-matrix-grid__cell--row-header">
                {rowHeader}
              </div>

              {/* Data cells */}
              {columnHeaders.map((_, colIdx) => (
                <div key={`cell-${rowIdx}-${colIdx}`} className="tpl-matrix-grid__cell">
                  {cells[rowIdx]?.[colIdx] ?? '—'}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const MatrixGridEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const title: string = data?.title ?? '';
  const rowHeaders: string[] = data?.rowHeaders ?? [];
  const columnHeaders: string[] = data?.columnHeaders ?? [];
  const cells: string[][] = data?.cells ?? [];

  const addColumnHeader = () => {
    const newColumnHeaders = [...columnHeaders, ''];
    const newCells = cells.map((row) => [...row, '']);
    onChange({
      data: {
        ...data,
        columnHeaders: newColumnHeaders,
        cells: newCells,
      },
    });
  };

  const addRowHeader = () => {
    const newRowHeaders = [...rowHeaders, ''];
    const newCells = [...cells, Array(columnHeaders.length).fill('')];
    onChange({
      data: {
        ...data,
        rowHeaders: newRowHeaders,
        cells: newCells,
      },
    });
  };

  const updateColumnHeader = (idx: number, value: string) => {
    const updated = [...columnHeaders];
    updated[idx] = value;
    onChange({ data: { ...data, columnHeaders: updated } });
  };

  const updateRowHeader = (idx: number, value: string) => {
    const updated = [...rowHeaders];
    updated[idx] = value;
    onChange({ data: { ...data, rowHeaders: updated } });
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const updated = cells.map((row) => [...row]);
    if (!updated[rowIdx]) {
      updated[rowIdx] = [];
    }
    updated[rowIdx][colIdx] = value;
    onChange({ data: { ...data, cells: updated } });
  };

  const removeColumnHeader = (idx: number) => {
    const newColumnHeaders = columnHeaders.filter((_, i) => i !== idx);
    const newCells = cells.map((row) => row.filter((_, i) => i !== idx));
    onChange({
      data: {
        ...data,
        columnHeaders: newColumnHeaders,
        cells: newCells,
      },
    });
  };

  const removeRowHeader = (idx: number) => {
    const newRowHeaders = rowHeaders.filter((_, i) => i !== idx);
    const newCells = cells.filter((_, i) => i !== idx);
    onChange({
      data: {
        ...data,
        rowHeaders: newRowHeaders,
        cells: newCells,
      },
    });
  };

  const gridTemplateColumns =
    columnHeaders.length > 0 ? `repeat(${columnHeaders.length}, 1fr)` : '1fr';

  return (
    <div className="tpl-matrix-grid-editor">
      {/* Title */}
      <div className="tpl-matrix-grid-editor__group">
        <label className="tpl-matrix-grid-editor__label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="e.g., Skills Matrix"
          className="tpl-matrix-grid-editor__input"
        />
      </div>

      {/* Column Headers */}
      <h5 className="tpl-matrix-grid-editor__section-title">Column Headers</h5>
      <div className="tpl-matrix-grid-editor__headers">
        {columnHeaders.map((header, idx) => (
          <div key={idx} className="tpl-matrix-grid-editor__header-item">
            <input
              type="text"
              value={header}
              onChange={(e) => updateColumnHeader(idx, e.target.value)}
              placeholder={`Column ${idx + 1}`}
              className="tpl-matrix-grid-editor__header-input"
            />
            <button
              onClick={() => removeColumnHeader(idx)}
              className="tpl-matrix-grid-editor__remove-btn"
              aria-label="Remove column"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addColumnHeader}
        className="tpl-matrix-grid-editor__add-btn"
      >
        + Add Column
      </button>

      {/* Row Headers */}
      <h5 className="tpl-matrix-grid-editor__section-title">Row Headers</h5>
      <div className="tpl-matrix-grid-editor__headers">
        {rowHeaders.map((header, idx) => (
          <div key={idx} className="tpl-matrix-grid-editor__header-item">
            <input
              type="text"
              value={header}
              onChange={(e) => updateRowHeader(idx, e.target.value)}
              placeholder={`Row ${idx + 1}`}
              className="tpl-matrix-grid-editor__header-input"
            />
            <button
              onClick={() => removeRowHeader(idx)}
              className="tpl-matrix-grid-editor__remove-btn"
              aria-label="Remove row"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button onClick={addRowHeader} className="tpl-matrix-grid-editor__add-btn">
        + Add Row
      </button>

      {/* Data Grid */}
      {rowHeaders.length > 0 && columnHeaders.length > 0 && (
        <div className="tpl-matrix-grid-editor__data-section">
          <h5 className="tpl-matrix-grid-editor__section-title">Cell Data</h5>
          <p className="tpl-matrix-grid-editor__help-text">
            Fill in values for each cell in the grid
          </p>
          {rowHeaders.map((rowHeader, rowIdx) => (
            <div key={rowIdx} style={{ marginBottom: 12 }}>
              <label className="tpl-matrix-grid-editor__label">{rowHeader}</label>
              <div
                className="tpl-matrix-grid-editor__data-grid"
                style={{ gridTemplateColumns }}
              >
                {columnHeaders.map((colHeader, colIdx) => (
                  <input
                    key={`${rowIdx}-${colIdx}`}
                    type="text"
                    value={cells[rowIdx]?.[colIdx] ?? ''}
                    onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                    placeholder={colHeader || `Col ${colIdx + 1}`}
                    className="tpl-matrix-grid-editor__cell-input"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
