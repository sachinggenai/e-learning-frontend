/**
 * ProsCons — Two-column pros and cons comparison.
 *
 * Preview: Side-by-side pros/cons lists with icons.
 * Editor: Add/edit pros and cons items.
 *
 * Category: comparison
 */

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './ProsCons.css';

// ─── Preview ──────────────────────────────────────────────────────
export const ProsConsPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const title: string = data?.title ?? '';
  const topic: string = data?.topic ?? '';
  const pros: string[] = data?.pros ?? [];
  const cons: string[] = data?.cons ?? [];

  return (
    <div className="tpl-pros-cons">
      {title && <h3 className="tpl-pros-cons__title">{title}</h3>}
      {topic && <p className="tpl-pros-cons__topic">{topic}</p>}

      <div className="tpl-pros-cons__container">
        {/* Pros Column */}
        <div className="tpl-pros-cons__column">
          <h4 className="tpl-pros-cons__column-header tpl-pros-cons__column-header--pro">
            Pros
          </h4>
          {pros.length > 0 ? (
            pros.map((pro, idx) => (
              <div key={idx} className="tpl-pros-cons__item tpl-pros-cons__item--pro">
                <CheckCircle className="tpl-pros-cons__item-icon tpl-pros-cons__item-icon--pro" />
                <span className="tpl-pros-cons__item-text">{pro}</span>
              </div>
            ))
          ) : (
            <div className="tpl-pros-cons__empty">No pros added yet</div>
          )}
        </div>

        {/* Cons Column */}
        <div className="tpl-pros-cons__column">
          <h4 className="tpl-pros-cons__column-header tpl-pros-cons__column-header--con">
            Cons
          </h4>
          {cons.length > 0 ? (
            cons.map((con, idx) => (
              <div key={idx} className="tpl-pros-cons__item tpl-pros-cons__item--con">
                <XCircle className="tpl-pros-cons__item-icon tpl-pros-cons__item-icon--con" />
                <span className="tpl-pros-cons__item-text">{con}</span>
              </div>
            ))
          ) : (
            <div className="tpl-pros-cons__empty">No cons added yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ProsConsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const title: string = data?.title ?? '';
  const topic: string = data?.topic ?? '';
  const pros: string[] = data?.pros ?? [];
  const cons: string[] = data?.cons ?? [];

  const addPro = () => {
    onChange({
      data: {
        ...data,
        pros: [...pros, ''],
      },
    });
  };

  const addCon = () => {
    onChange({
      data: {
        ...data,
        cons: [...cons, ''],
      },
    });
  };

  const updatePro = (idx: number, value: string) => {
    const updated = [...pros];
    updated[idx] = value;
    onChange({ data: { ...data, pros: updated } });
  };

  const updateCon = (idx: number, value: string) => {
    const updated = [...cons];
    updated[idx] = value;
    onChange({ data: { ...data, cons: updated } });
  };

  const removePro = (idx: number) => {
    onChange({ data: { ...data, pros: pros.filter((_, i) => i !== idx) } });
  };

  const removeCon = (idx: number) => {
    onChange({ data: { ...data, cons: cons.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="tpl-pros-cons-editor">
      {/* Title */}
      <div className="tpl-pros-cons-editor__group">
        <label className="tpl-pros-cons-editor__label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="e.g., Should we adopt this technology?"
          className="tpl-pros-cons-editor__input"
        />
      </div>

      {/* Topic */}
      <div className="tpl-pros-cons-editor__group">
        <label className="tpl-pros-cons-editor__label">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onChange({ data: { ...data, topic: e.target.value } })}
          placeholder="e.g., React vs Vue for our project"
          className="tpl-pros-cons-editor__input"
        />
      </div>

      {/* Pros Section */}
      <h5 className="tpl-pros-cons-editor__section-title tpl-pros-cons-editor__section-title--pro">
        <CheckCircle className="tpl-pros-cons-editor__section-icon" />
        Pros
      </h5>
      <div className="tpl-pros-cons-editor__items">
        {pros.map((pro, idx) => (
          <div key={idx} className="tpl-pros-cons-editor__item">
            <input
              type="text"
              value={pro}
              onChange={(e) => updatePro(idx, e.target.value)}
              placeholder={`Pro ${idx + 1}`}
              className="tpl-pros-cons-editor__item-input"
            />
            <button
              onClick={() => removePro(idx)}
              className="tpl-pros-cons-editor__remove-btn"
              aria-label="Remove pro"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addPro}
        className="tpl-pros-cons-editor__add-btn tpl-pros-cons-editor__add-btn--pro"
      >
        + Add Pro
      </button>

      {/* Cons Section */}
      <h5 className="tpl-pros-cons-editor__section-title tpl-pros-cons-editor__section-title--con">
        <XCircle className="tpl-pros-cons-editor__section-icon" />
        Cons
      </h5>
      <div className="tpl-pros-cons-editor__items">
        {cons.map((con, idx) => (
          <div key={idx} className="tpl-pros-cons-editor__item">
            <input
              type="text"
              value={con}
              onChange={(e) => updateCon(idx, e.target.value)}
              placeholder={`Con ${idx + 1}`}
              className="tpl-pros-cons-editor__item-input"
            />
            <button
              onClick={() => removeCon(idx)}
              className="tpl-pros-cons-editor__remove-btn"
              aria-label="Remove con"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addCon}
        className="tpl-pros-cons-editor__add-btn tpl-pros-cons-editor__add-btn--con"
      >
        + Add Con
      </button>
    </div>
  );
};
