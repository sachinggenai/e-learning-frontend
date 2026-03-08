/**
 * Infographic — Visual data presentation with sections.
 *
 * Category: media-rich
 */

import React, { useState } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './Infographic.css';

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
    <div className="tpl-infographic" role="region" aria-label="Infographic content">
      {data?.title && (
        <h3 className="tpl-infographic__title">{data.title}</h3>
      )}
      {data?.subtitle && (
        <p className="tpl-infographic__subtitle">
          {data.subtitle}
        </p>
      )}

      <div
        className={`tpl-infographic__sections ${layout === 'grid' ? 'tpl-infographic__sections--grid' : ''}`}
        role="list"
      >
        {sections.map((s, idx) => (
          <div
            key={s.id}
            className="tpl-infographic__section"
            role="listitem"
            tabIndex={0}
            aria-label={`Section ${idx + 1}: ${s.heading}`}
            style={{
              borderColor: s.color || undefined,
            }}
          >
            {s.icon && <div className="tpl-infographic__icon" aria-hidden="true">{s.icon}</div>}
            {s.statValue && (
              <div 
                className="tpl-infographic__stat-value"
                style={{ color: s.color || undefined }}
              >
                {s.statValue}
              </div>
            )}
            {s.statLabel && (
              <div className="tpl-infographic__stat-label">
                {s.statLabel}
              </div>
            )}
            <h4 className="tpl-infographic__heading">{s.heading}</h4>
            <p className="tpl-infographic__body">
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
    <div className="tpl-infographic-editor">
      <div className="tpl-infographic-editor__field">
        <label htmlFor="infographic-title" className="tpl-infographic-editor__label">
          Title
        </label>
        <input
          id="infographic-title"
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Infographic Title"
          className="tpl-infographic-editor__input"
          aria-label="Title"
        />
      </div>

      <div className="tpl-infographic-editor__field">
        <label htmlFor="infographic-subtitle" className="tpl-infographic-editor__label">
          Subtitle
        </label>
        <input
          id="infographic-subtitle"
          type="text"
          value={data?.subtitle ?? ''}
          onChange={(e) => onChange({ data: { ...data, subtitle: e.target.value } })}
          placeholder="A brief subtitle"
          className="tpl-infographic-editor__input"
          aria-label="Subtitle"
        />
      </div>

      <div className="tpl-infographic-editor__field">
        <label htmlFor="infographic-layout" className="tpl-infographic-editor__label">
          Layout
        </label>
        <select
          id="infographic-layout"
          value={data?.layout ?? 'vertical'}
          onChange={(e) => onChange({ data: { ...data, layout: e.target.value } })}
          className="tpl-infographic-editor__select"
          aria-label="Layout"
        >
          <option value="vertical">Vertical</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      {sections.map((s, idx) => (
        <div key={s.id} className="tpl-infographic-editor__section-card">
          <div className="tpl-infographic-editor__section-header">
            <span className="tpl-infographic-editor__section-title">Section {idx + 1}</span>
            <button
              onClick={() => removeSection(idx)}
              className="tpl-infographic-editor__remove-btn"
              aria-label={`Remove section ${idx + 1}`}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="tpl-infographic-editor__row">
            <div className="tpl-infographic-editor__row--icon">
              <label htmlFor={`section-${idx}-icon`} className="tpl-infographic-editor__small-label">
                Icon
              </label>
              <input
                id={`section-${idx}-icon`}
                type="text"
                value={s.icon}
                onChange={(e) => updateSection(idx, 'icon', e.target.value)}
                className="tpl-infographic-editor__input"
              />
            </div>
            <div className="tpl-infographic-editor__row--flex">
              <label htmlFor={`section-${idx}-heading`} className="tpl-infographic-editor__small-label">
                Heading
              </label>
              <input
                id={`section-${idx}-heading`}
                type="text"
                value={s.heading}
                onChange={(e) => updateSection(idx, 'heading', e.target.value)}
                className="tpl-infographic-editor__input"
              />
            </div>
            <div className="tpl-infographic-editor__row--color">
              <label htmlFor={`section-${idx}-color`} className="tpl-infographic-editor__small-label">
                Color
              </label>
              <input
                id={`section-${idx}-color`}
                type="color"
                value={s.color || '#3b82f6'}
                onChange={(e) => updateSection(idx, 'color', e.target.value)}
                className="tpl-infographic-editor__color-input"
              />
            </div>
          </div>

          <div className="tpl-infographic-editor__row">
            <div className="tpl-infographic-editor__row--flex">
              <label htmlFor={`section-${idx}-stat-value`} className="tpl-infographic-editor__small-label">
                Stat Value
              </label>
              <input
                id={`section-${idx}-stat-value`}
                type="text"
                value={s.statValue ?? ''}
                onChange={(e) => updateSection(idx, 'statValue', e.target.value)}
                placeholder="42%"
                className="tpl-infographic-editor__input"
              />
            </div>
            <div className="tpl-infographic-editor__row--flex">
              <label htmlFor={`section-${idx}-stat-label`} className="tpl-infographic-editor__small-label">
                Stat Label
              </label>
              <input
                id={`section-${idx}-stat-label`}
                type="text"
                value={s.statLabel ?? ''}
                onChange={(e) => updateSection(idx, 'statLabel', e.target.value)}
                placeholder="Increase"
                className="tpl-infographic-editor__input"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`section-${idx}-body`} className="tpl-infographic-editor__small-label">
              Body
            </label>
            <textarea
              id={`section-${idx}-body`}
              value={s.body}
              onChange={(e) => updateSection(idx, 'body', e.target.value)}
              rows={2}
              className="tpl-infographic-editor__textarea"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addSection}
        className="tpl-infographic-editor__add-btn"
        aria-label="Add new section"
        type="button"
      >
        + Add Section
      </button>
    </div>
  );
};
