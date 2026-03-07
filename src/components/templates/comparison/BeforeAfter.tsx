/**
 * BeforeAfter — Side-by-side before and after comparison.
 *
 * Preview: Two cards showing before/after states with arrow divider.
 * Editor: Edit labels and content for before/after sections.
 *
 * Category: comparison
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './BeforeAfter.css';

// ─── Preview ──────────────────────────────────────────────────────
export const BeforeAfterPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const title: string = data?.title ?? '';
  const beforeLabel: string = data?.beforeLabel ?? 'Before';
  const afterLabel: string = data?.afterLabel ?? 'After';
  const beforeContent: string = data?.beforeContent ?? '';
  const afterContent: string = data?.afterContent ?? '';

  const hasContent = beforeContent || afterContent;

  return (
    <div className="tpl-before-after">
      {title && <h3 className="tpl-before-after__title">{title}</h3>}

      {hasContent ? (
        <div className="tpl-before-after__container">
          {/* Before Card */}
          <div className="tpl-before-after__card">
            <h4 className="tpl-before-after__card-label tpl-before-after__card-label--before">
              {beforeLabel}
            </h4>
            <div className="tpl-before-after__card-content">
              {beforeContent || <em>No content yet</em>}
            </div>
          </div>

          {/* Arrow Divider */}
          <ArrowRight className="tpl-before-after__arrow" />

          {/* After Card */}
          <div className="tpl-before-after__card">
            <h4 className="tpl-before-after__card-label tpl-before-after__card-label--after">
              {afterLabel}
            </h4>
            <div className="tpl-before-after__card-content">
              {afterContent || <em>No content yet</em>}
            </div>
          </div>
        </div>
      ) : (
        <div className="tpl-before-after__empty">
          Add before and after content to compare
        </div>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const BeforeAfterEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const title: string = data?.title ?? '';
  const beforeLabel: string = data?.beforeLabel ?? 'Before';
  const afterLabel: string = data?.afterLabel ?? 'After';
  const beforeContent: string = data?.beforeContent ?? '';
  const afterContent: string = data?.afterContent ?? '';

  return (
    <div className="tpl-before-after-editor">
      {/* Title */}
      <div className="tpl-before-after-editor__group">
        <label className="tpl-before-after-editor__label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="e.g., Process Improvement"
          className="tpl-before-after-editor__input"
        />
      </div>

      {/* Before Section */}
      <div className="tpl-before-after-editor__section-header">
        <h5 className="tpl-before-after-editor__section-title tpl-before-after-editor__section-title--before">
          Before
        </h5>
      </div>

      <div className="tpl-before-after-editor__group">
        <label className="tpl-before-after-editor__label">Before Label</label>
        <input
          type="text"
          value={beforeLabel}
          onChange={(e) => onChange({ data: { ...data, beforeLabel: e.target.value } })}
          placeholder="Before"
          className="tpl-before-after-editor__input"
        />
      </div>

      <div className="tpl-before-after-editor__group">
        <label className="tpl-before-after-editor__label">Before Content</label>
        <textarea
          value={beforeContent}
          onChange={(e) => onChange({ data: { ...data, beforeContent: e.target.value } })}
          placeholder="Describe the initial state or old process..."
          className="tpl-before-after-editor__textarea"
        />
      </div>

      {/* After Section */}
      <div className="tpl-before-after-editor__section-header">
        <h5 className="tpl-before-after-editor__section-title tpl-before-after-editor__section-title--after">
          After
        </h5>
      </div>

      <div className="tpl-before-after-editor__group">
        <label className="tpl-before-after-editor__label">After Label</label>
        <input
          type="text"
          value={afterLabel}
          onChange={(e) => onChange({ data: { ...data, afterLabel: e.target.value } })}
          placeholder="After"
          className="tpl-before-after-editor__input"
        />
      </div>

      <div className="tpl-before-after-editor__group">
        <label className="tpl-before-after-editor__label">After Content</label>
        <textarea
          value={afterContent}
          onChange={(e) => onChange({ data: { ...data, afterContent: e.target.value } })}
          placeholder="Describe the improved state or new process..."
          className="tpl-before-after-editor__textarea"
        />
      </div>
    </div>
  );
};
