import React, { useEffect } from 'react';
import { Sparkles, AlertTriangle, ArrowUpCircle, Minus, ExternalLink } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './RecommendationCard.css';

export interface RecommendationItem {
  id: string;
  title: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  ctaLabel?: string;
  ctaTarget?: string;
  condition?: string;
}

export interface RecommendationCardData {
  title?: string;
  recommendations?: RecommendationItem[];
  maxVisible?: number;
}

const PRIORITY_ORDER: Record<RecommendationItem['priority'], number> = { high: 0, medium: 1, low: 2 };

function PriorityIcon({ priority }: { priority: RecommendationItem['priority'] }) {
  if (priority === 'high') return <AlertTriangle size={14} className="tpl-recommendation__priority-icon tpl-recommendation__priority-icon--high" />;
  if (priority === 'medium') return <ArrowUpCircle size={14} className="tpl-recommendation__priority-icon tpl-recommendation__priority-icon--medium" />;
  return <Minus size={14} className="tpl-recommendation__priority-icon tpl-recommendation__priority-icon--low" />;
}

export const RecommendationCardPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
}) => {
  const d = data as RecommendationCardData;
  const title = d.title?.trim() || 'Recommendations';
  const all = d.recommendations ?? [];
  const maxVisible = d.maxVisible ?? all.length;

  const sorted = [...all].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const visible = sorted.slice(0, maxVisible);

  useEffect(() => {
    visible.forEach((item) => {
      onInteraction?.({
        componentId,
        interactionType: 'recommendation_viewed',
        interactionId: item.id,
        value: item.title,
        completed: false,
      });
    });
  }, [componentId, onInteraction, visible]);

  const handleCta = (item: RecommendationItem) => {
    onInteraction?.({
      componentId,
      interactionType: 'recommendation_cta_clicked',
      interactionId: item.id,
      value: item.ctaTarget ?? item.title,
      completed: false,
    });
    if (item.ctaTarget) {
      window.open(item.ctaTarget, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="tpl-recommendation">
      <header className="tpl-recommendation__header">
        <h2 className="tpl-recommendation__title">
          <Sparkles size={20} className="tpl-recommendation__title-icon" />
          {title}
        </h2>
      </header>

      {visible.length === 0 ? (
        <p className="tpl-recommendation__empty">No recommendations configured yet.</p>
      ) : (
        <ul className="tpl-recommendation__list">
          {visible.map((item) => (
            <li key={item.id} className={`tpl-recommendation__card tpl-recommendation__card--${item.priority}`}>
              <div className="tpl-recommendation__card-header">
                <PriorityIcon priority={item.priority} />
                <h3 className="tpl-recommendation__card-title">{item.title}</h3>
                <span className={`tpl-recommendation__priority-badge tpl-recommendation__priority-badge--${item.priority}`}>
                  {item.priority}
                </span>
              </div>
              <p className="tpl-recommendation__card-reason">{item.reason}</p>
              {item.ctaLabel && (
                <button
                  type="button"
                  className="tpl-recommendation__cta"
                  onClick={() => handleCta(item)}
                >
                  <ExternalLink size={14} />
                  {item.ctaLabel}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export const RecommendationCardEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as RecommendationCardData;

  const update = (patch: Partial<RecommendationCardData>) =>
    onChange({ data: { ...d, ...patch } });

  const recommendations = d.recommendations ?? [];

  const addRec = () => {
    const newRec: RecommendationItem = {
      id: `rec-${Date.now()}`,
      title: '',
      reason: '',
      priority: 'medium',
      ctaLabel: '',
      ctaTarget: '',
    };
    update({ recommendations: [...recommendations, newRec] });
  };

  const removeRec = (id: string) =>
    update({ recommendations: recommendations.filter((r) => r.id !== id) });

  const updateRec = (id: string, patch: Partial<RecommendationItem>) =>
    update({ recommendations: recommendations.map((r) => (r.id === id ? { ...r, ...patch } : r)) });

  return (
    <section className="tpl-recommendation-editor">
      <div className="tpl-recommendation-editor__field">
        <label className="tpl-recommendation-editor__label" htmlFor="rc-title">Title</label>
        <input
          id="rc-title"
          className="tpl-recommendation-editor__input"
          type="text"
          value={d.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Recommendations"
        />
      </div>

      <div className="tpl-recommendation-editor__field">
        <label className="tpl-recommendation-editor__label" htmlFor="rc-max">Max Visible</label>
        <input
          id="rc-max"
          className="tpl-recommendation-editor__input tpl-recommendation-editor__input--short"
          type="number"
          min={1}
          value={d.maxVisible ?? ''}
          onChange={(e) => update({ maxVisible: Number(e.target.value) || undefined })}
          placeholder="All"
        />
      </div>

      <div className="tpl-recommendation-editor__cards">
        <h3 className="tpl-recommendation-editor__section-title">Recommendations ({recommendations.length})</h3>
        {recommendations.map((rec, idx) => (
          <div key={rec.id} className="tpl-recommendation-editor__card-block">
            <div className="tpl-recommendation-editor__card-head">
              <span className="tpl-recommendation-editor__card-num">#{idx + 1}</span>
              <select
                className="tpl-recommendation-editor__select"
                value={rec.priority}
                onChange={(e) => updateRec(rec.id, { priority: e.target.value as RecommendationItem['priority'] })}
                aria-label="Priority"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                type="button"
                className="tpl-recommendation-editor__remove-btn"
                onClick={() => removeRec(rec.id)}
                aria-label="Remove recommendation"
              >
                Remove
              </button>
            </div>
            <div className="tpl-recommendation-editor__field">
              <label className="tpl-recommendation-editor__label" htmlFor={`rc-title-${rec.id}`}>Recommendation Title</label>
              <input
                id={`rc-title-${rec.id}`}
                className="tpl-recommendation-editor__input"
                type="text"
                value={rec.title}
                onChange={(e) => updateRec(rec.id, { title: e.target.value })}
                placeholder="e.g. Complete JavaScript Basics"
              />
            </div>
            <div className="tpl-recommendation-editor__field">
              <label className="tpl-recommendation-editor__label" htmlFor={`rc-reason-${rec.id}`}>Reason</label>
              <textarea
                id={`rc-reason-${rec.id}`}
                className="tpl-recommendation-editor__textarea"
                rows={2}
                value={rec.reason}
                onChange={(e) => updateRec(rec.id, { reason: e.target.value })}
                placeholder="Why this recommendation?"
              />
            </div>
            <div className="tpl-recommendation-editor__field">
              <label className="tpl-recommendation-editor__label" htmlFor={`rc-cta-${rec.id}`}>CTA Label</label>
              <input
                id={`rc-cta-${rec.id}`}
                className="tpl-recommendation-editor__input"
                type="text"
                value={rec.ctaLabel ?? ''}
                onChange={(e) => updateRec(rec.id, { ctaLabel: e.target.value })}
                placeholder="e.g. Start Now"
              />
            </div>
          </div>
        ))}
        <button type="button" className="tpl-recommendation-editor__add-btn" onClick={addRec}>
          + Add Recommendation
        </button>
      </div>
    </section>
  );
};
