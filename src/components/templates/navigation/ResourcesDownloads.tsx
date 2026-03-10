/**
 * ResourcesDownloads — Downloadable resources and links list.
 *
 * Category: navigation
 */

import React from 'react';
import { FileText, Image, Link, Paperclip, Video } from 'lucide-react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './ResourcesDownloads.css';

interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'pdf' | 'doc' | 'link' | 'video' | 'image' | 'other';
  fileSize?: string;
}

interface ResourcesDownloadsData {
  title?: string;
  description?: string;
  resources?: Resource[];
}

const TYPE_ICONS = {
  pdf: FileText,
  doc: FileText,
  link: Link,
  video: Video,
  image: Image,
  other: Paperclip,
} as const;

const TYPE_VALUES: Array<Resource['type']> = ['pdf', 'doc', 'link', 'video', 'image', 'other'];

const getResourceType = (type: string | undefined): Resource['type'] => {
  if (!type || !TYPE_VALUES.includes(type as Resource['type'])) {
    return 'other';
  }

  return type as Resource['type'];
};

// ─── Preview ──────────────────────────────────────────────────────
export const ResourcesDownloadsPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const resourcesData = data as ResourcesDownloadsData;
  const resources: Resource[] = resourcesData?.resources ?? [];

  return (
    <section className="tpl-resources-downloads">
      {(resourcesData?.title || resourcesData?.description) ? (
        <header className="tpl-resources-downloads__header">
          {resourcesData?.title && <h3 className="tpl-resources-downloads__title">{resourcesData.title}</h3>}
          {resourcesData?.description && (
            <p className="tpl-resources-downloads__description">{resourcesData.description}</p>
          )}
        </header>
      ) : null}

      <div className="tpl-resources-downloads__list">
        {resources.map((r) => (
          (() => {
            const safeType = getResourceType(r.type);
            const Icon = TYPE_ICONS[safeType];

            return (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tpl-resources-downloads__resource"
                aria-label={`Download ${r.title} (opens in new tab)`}
              >
                <span className="tpl-resources-downloads__resource-icon" aria-hidden="true">
                  <Icon size={28} />
                </span>
                <div className="tpl-resources-downloads__resource-content">
                  <div className="tpl-resources-downloads__resource-title">{r.title}</div>
                  {r.description ? (
                    <div className="tpl-resources-downloads__resource-description">{r.description}</div>
                  ) : null}
                </div>

                <div className="tpl-resources-downloads__resource-meta">
                  <span
                    className={`tpl-resources-downloads__type-badge tpl-resources-downloads__type-badge--${safeType}`}
                    aria-label={`${safeType} file type`}
                  >
                    {safeType}
                  </span>
                  {r.fileSize ? (
                    <span className="tpl-resources-downloads__file-size">{r.fileSize}</span>
                  ) : null}
                </div>
              </a>
            );
          })()
        ))}
      </div>

      {resources.length === 0 ? (
        <p className="tpl-resources-downloads__empty">
          No resources added yet.
        </p>
      ) : null}
    </section>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ResourcesDownloadsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const resourcesData = data as ResourcesDownloadsData;
  const resources: Resource[] = resourcesData?.resources ?? [];

  const updateResource = (idx: number, field: keyof Resource, value: string) => {
    const updated = [...resources];
    const nextValue = field === 'type' ? getResourceType(value) : value;
    updated[idx] = { ...updated[idx], [field]: nextValue } as Resource;
    onChange({ data: { ...resourcesData, resources: updated } });
  };

  const addResource = () => {
    onChange({
      data: {
        ...resourcesData,
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
    onChange({ data: { ...resourcesData, resources: resources.filter((_, i) => i !== idx) } });
  };

  return (
    <section className="tpl-resources-downloads-editor">
      <div className="tpl-resources-downloads-editor__header">
        <div className="tpl-resources-downloads-editor__field">
          <label className="tpl-resources-downloads-editor__label" htmlFor="resources-title">Title</label>
          <input
            id="resources-title"
            className="tpl-resources-downloads-editor__input"
            type="text"
            value={resourcesData?.title ?? ''}
            onChange={(e) => onChange({ data: { ...resourcesData, title: e.target.value } })}
            placeholder="Resources & Downloads"
          />
        </div>
        <div className="tpl-resources-downloads-editor__field">
          <label className="tpl-resources-downloads-editor__label" htmlFor="resources-description">Description</label>
          <input
            id="resources-description"
            className="tpl-resources-downloads-editor__input"
            type="text"
            value={resourcesData?.description ?? ''}
            onChange={(e) => onChange({ data: { ...resourcesData, description: e.target.value } })}
            placeholder="Supplementary materials"
          />
        </div>
      </div>

      <div className="tpl-resources-downloads-editor__resources">
        {resources.map((r, idx) => (
          <div key={r.id} className="tpl-resources-downloads-editor__resource-card">
            <div className="tpl-resources-downloads-editor__resource-header">
              <span className="tpl-resources-downloads-editor__resource-number">Resource {idx + 1}</span>
              <button
                type="button"
                className="tpl-resources-downloads-editor__remove-btn"
                onClick={() => removeResource(idx)}
                aria-label={`Remove resource ${idx + 1}`}
              >
                ×
              </button>
            </div>

            <div className="tpl-resources-downloads-editor__resource-fields">
              <div className="tpl-resources-downloads-editor__field">
                <label className="tpl-resources-downloads-editor__label" htmlFor={`resource-title-${r.id}`}>Title</label>
                <input
                  id={`resource-title-${r.id}`}
                  className="tpl-resources-downloads-editor__input"
                  type="text"
                  value={r.title}
                  onChange={(e) => updateResource(idx, 'title', e.target.value)}
                />
              </div>

              <div className="tpl-resources-downloads-editor__field tpl-resources-downloads-editor__field--type">
                <label className="tpl-resources-downloads-editor__label" htmlFor={`resource-type-${r.id}`}>Type</label>
                <select
                  id={`resource-type-${r.id}`}
                  className="tpl-resources-downloads-editor__type-selector"
                  value={r.type}
                  onChange={(e) => updateResource(idx, 'type', e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Doc</option>
                  <option value="link">Link</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="tpl-resources-downloads-editor__field tpl-resources-downloads-editor__field--full">
                <label className="tpl-resources-downloads-editor__label" htmlFor={`resource-url-${r.id}`}>URL</label>
                <input
                  id={`resource-url-${r.id}`}
                  className="tpl-resources-downloads-editor__input"
                  type="text"
                  value={r.url}
                  onChange={(e) => updateResource(idx, 'url', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="tpl-resources-downloads-editor__field tpl-resources-downloads-editor__field--full">
                <label className="tpl-resources-downloads-editor__label" htmlFor={`resource-description-${r.id}`}>Description</label>
                <input
                  id={`resource-description-${r.id}`}
                  className="tpl-resources-downloads-editor__input"
                  type="text"
                  value={r.description ?? ''}
                  onChange={(e) => updateResource(idx, 'description', e.target.value)}
                />
              </div>

              <div className="tpl-resources-downloads-editor__field tpl-resources-downloads-editor__field--size">
                <label className="tpl-resources-downloads-editor__label" htmlFor={`resource-size-${r.id}`}>Size</label>
                <input
                  id={`resource-size-${r.id}`}
                  className="tpl-resources-downloads-editor__input"
                  type="text"
                  value={r.fileSize ?? ''}
                  onChange={(e) => updateResource(idx, 'fileSize', e.target.value)}
                  placeholder="2.4 MB"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="tpl-resources-downloads-editor__add-btn" onClick={addResource}>
        + Add Resource
      </button>
    </section>
  );
};
