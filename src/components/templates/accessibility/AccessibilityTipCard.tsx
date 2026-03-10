import React, { useEffect, useState } from 'react';
import { Lightbulb, Eye, Ear, Hand, Brain, Info, ExternalLink, X } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './AccessibilityTipCard.css';

export interface AccessibilityTipCardData {
  title?: string;
  tip?: string;
  category?: 'vision' | 'hearing' | 'mobility' | 'cognitive' | 'general';
  icon?: string;
  linkLabel?: string;
  linkUrl?: string;
  dismissible?: boolean;
  emphasis?: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  vision: <Eye size={20} />,
  hearing: <Ear size={20} />,
  mobility: <Hand size={20} />,
  cognitive: <Brain size={20} />,
  general: <Lightbulb size={20} />,
};

const CATEGORY_LABELS: Record<string, string> = {
  vision: 'Vision',
  hearing: 'Hearing',
  mobility: 'Mobility',
  cognitive: 'Cognitive',
  general: 'General',
};

export const AccessibilityTipCardPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
}) => {
  const d = data as AccessibilityTipCardData;
  const [dismissed, setDismissed] = useState(false);
  const category = d.category ?? 'general';

  useEffect(() => {
    onInteraction?.({
      componentId,
      interactionType: 'tip_viewed',
      interactionId: 'tip',
      value: category,
      completed: false,
    });
  }, [componentId, category, onInteraction]);

  if (dismissed) return null;

  return (
    <article
      className={`tpl-tip-card tpl-tip-card--${category}${d.emphasis ? ' tpl-tip-card--emphasis' : ''}`}
      role="note"
      aria-label={`Accessibility tip: ${d.title ?? 'Tip'}`}
    >
      <div className="tpl-tip-card__header">
        <span className="tpl-tip-card__icon" aria-hidden="true">
          {CATEGORY_ICONS[category]}
        </span>
        <div className="tpl-tip-card__titles">
          <span className="tpl-tip-card__badge">{CATEGORY_LABELS[category]}</span>
          <h3 className="tpl-tip-card__title">{d.title?.trim() || 'Accessibility Tip'}</h3>
        </div>
        {d.dismissible && (
          <button
            type="button"
            className="tpl-tip-card__dismiss"
            aria-label="Dismiss tip"
            onClick={() => {
              setDismissed(true);
              onInteraction?.({
                componentId,
                interactionType: 'tip_dismissed',
                interactionId: 'dismiss',
                value: category,
                completed: false,
              });
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <p className="tpl-tip-card__body">{d.tip?.trim() || 'Accessibility guidance will appear here.'}</p>

      {d.linkUrl?.trim() && (
        <a
          className="tpl-tip-card__link"
          href={d.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onInteraction?.({
            componentId,
            interactionType: 'tip_link_clicked',
            interactionId: 'learn-more',
            value: d.linkUrl,
            completed: false,
          })}
        >
          <ExternalLink size={14} aria-hidden="true" />
          {d.linkLabel?.trim() || 'Learn more'}
        </a>
      )}
    </article>
  );
};

export const AccessibilityTipCardEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as AccessibilityTipCardData;
  const update = (patch: Partial<AccessibilityTipCardData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-tip-card-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} placeholder="Tip title" />
      </label>
      <label>
        Tip Text
        <textarea rows={3} value={d.tip ?? ''} onChange={(e) => update({ tip: e.target.value })} placeholder="Concise actionable guidance" />
      </label>
      <label>
        Category
        <select value={d.category ?? 'general'} onChange={(e) => update({ category: e.target.value as AccessibilityTipCardData['category'] })}>
          <option value="general">General</option>
          <option value="vision">Vision</option>
          <option value="hearing">Hearing</option>
          <option value="mobility">Mobility</option>
          <option value="cognitive">Cognitive</option>
        </select>
      </label>
      <label>
        Learn More Label
        <input value={d.linkLabel ?? ''} onChange={(e) => update({ linkLabel: e.target.value })} placeholder="Learn more" />
      </label>
      <label>
        Learn More URL
        <input type="url" value={d.linkUrl ?? ''} onChange={(e) => update({ linkUrl: e.target.value })} placeholder="https://..." />
      </label>
      <label>
        <input type="checkbox" checked={d.dismissible === true} onChange={(e) => update({ dismissible: e.target.checked })} />
        &nbsp;Allow learner to dismiss this tip
      </label>
      <label>
        <input type="checkbox" checked={d.emphasis === true} onChange={(e) => update({ emphasis: e.target.checked })} />
        &nbsp;Emphasize (highlight border)
      </label>
    </section>
  );
};
