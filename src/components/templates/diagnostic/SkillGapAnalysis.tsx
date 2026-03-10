import React from 'react';
import { Target, TrendingUp, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './SkillGapAnalysis.css';

export interface SkillGapItem {
  id: string;
  skill: string;
  currentLevel: number;
  targetLevel: number;
  remediationLink?: string;
}

export interface SkillGapAnalysisData {
  title?: string;
  items?: SkillGapItem[];
  highGapThreshold?: number;
  showRecommendations?: boolean;
}

function gapSeverity(gap: number, threshold: number): 'high' | 'medium' | 'low' {
  if (gap >= threshold) return 'high';
  if (gap >= threshold / 2) return 'medium';
  return 'low';
}

export const SkillGapAnalysisPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
}) => {
  const d = data as SkillGapAnalysisData;
  const title = d.title?.trim() || 'Skill Gap Analysis';
  const items = d.items ?? [];
  const threshold = d.highGapThreshold ?? 30;
  const showRecs = d.showRecommendations ?? true;

  const handleRemediationClick = (item: SkillGapItem) => {
    onInteraction?.({
      componentId,
      interactionType: 'remediation_opened',
      interactionId: item.id,
      value: item.remediationLink,
      completed: false,
    });
    if (item.remediationLink) {
      window.open(item.remediationLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="tpl-skill-gap">
      <header className="tpl-skill-gap__header">
        <h2 className="tpl-skill-gap__title">
          <Target size={20} className="tpl-skill-gap__title-icon" />
          {title}
        </h2>
      </header>

      {items.length === 0 ? (
        <p className="tpl-skill-gap__empty">No skills configured yet.</p>
      ) : (
        <ul className="tpl-skill-gap__list">
          {items.map((item) => {
            const gap = Math.max(0, item.targetLevel - item.currentLevel);
            const severity = gapSeverity(gap, threshold);

            return (
              <li
                key={item.id}
                className={`tpl-skill-gap__item tpl-skill-gap__item--${severity}`}
                onMouseEnter={() => onInteraction?.({
                  componentId,
                  interactionType: 'gap_item_viewed',
                  interactionId: item.id,
                  value: item.skill,
                  completed: false,
                })}
              >
                <div className="tpl-skill-gap__item-header">
                  <span className="tpl-skill-gap__skill-name">{item.skill}</span>
                  {severity === 'high' && (
                    <span className="tpl-skill-gap__badge tpl-skill-gap__badge--high">
                      <AlertTriangle size={12} /> High Priority
                    </span>
                  )}
                  {severity === 'medium' && (
                    <span className="tpl-skill-gap__badge tpl-skill-gap__badge--medium">Medium</span>
                  )}
                  {severity === 'low' && (
                    <span className="tpl-skill-gap__badge tpl-skill-gap__badge--low">Low</span>
                  )}
                </div>

                <div className="tpl-skill-gap__bar-group">
                  <div className="tpl-skill-gap__bar-label">
                    <span>Current</span>
                    <span>{item.currentLevel}%</span>
                  </div>
                  <div className="tpl-skill-gap__bar-track" role="progressbar" aria-valuenow={item.currentLevel} aria-valuemin={0} aria-valuemax={100}>
                    <div
                      className="tpl-skill-gap__bar-fill tpl-skill-gap__bar-fill--current"
                      style={{ width: `${item.currentLevel}%` }}
                    />
                  </div>

                  <div className="tpl-skill-gap__bar-label">
                    <span>Target</span>
                    <span>{item.targetLevel}%</span>
                  </div>
                  <div className="tpl-skill-gap__bar-track">
                    <div
                      className="tpl-skill-gap__bar-fill tpl-skill-gap__bar-fill--target"
                      style={{ width: `${item.targetLevel}%` }}
                    />
                  </div>
                </div>

                <p className="tpl-skill-gap__gap-text">
                  <TrendingUp size={14} /> Gap: {gap}%
                </p>

                {showRecs && item.remediationLink && (
                  <button
                    type="button"
                    className="tpl-skill-gap__remediation"
                    onClick={() => handleRemediationClick(item)}
                  >
                    <LinkIcon size={14} /> View Recommended Resource
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
};

export const SkillGapAnalysisEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as SkillGapAnalysisData;

  const update = (patch: Partial<SkillGapAnalysisData>) =>
    onChange({ data: { ...d, ...patch } });

  const items = d.items ?? [];

  const addItem = () => {
    const newItem: SkillGapItem = {
      id: `skill-${Date.now()}`,
      skill: '',
      currentLevel: 40,
      targetLevel: 80,
    };
    update({ items: [...items, newItem] });
  };

  const removeItem = (id: string) =>
    update({ items: items.filter((i) => i.id !== id) });

  const updateItem = (id: string, patch: Partial<SkillGapItem>) =>
    update({ items: items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  return (
    <section className="tpl-skill-gap-editor">
      <div className="tpl-skill-gap-editor__field">
        <label className="tpl-skill-gap-editor__label" htmlFor="sga-title">Title</label>
        <input
          id="sga-title"
          className="tpl-skill-gap-editor__input"
          type="text"
          value={d.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Skill Gap Analysis"
        />
      </div>

      <div className="tpl-skill-gap-editor__row">
        <div className="tpl-skill-gap-editor__field">
          <label className="tpl-skill-gap-editor__label" htmlFor="sga-threshold">High Gap Threshold (%)</label>
          <input
            id="sga-threshold"
            className="tpl-skill-gap-editor__input tpl-skill-gap-editor__input--short"
            type="number"
            min={0}
            max={100}
            value={d.highGapThreshold ?? 30}
            onChange={(e) => update({ highGapThreshold: Number(e.target.value) })}
          />
        </div>

        <div className="tpl-skill-gap-editor__field">
          <label className="tpl-skill-gap-editor__checkbox-label" htmlFor="sga-recs">
            <input
              id="sga-recs"
              type="checkbox"
              checked={d.showRecommendations !== false}
              onChange={(e) => update({ showRecommendations: e.target.checked })}
            />
            Show recommendations
          </label>
        </div>
      </div>

      <div className="tpl-skill-gap-editor__skills">
        <h3 className="tpl-skill-gap-editor__section-title">Skills ({items.length})</h3>
        {items.map((item, idx) => (
          <div key={item.id} className="tpl-skill-gap-editor__skill-block">
            <div className="tpl-skill-gap-editor__skill-head">
              <span className="tpl-skill-gap-editor__skill-num">#{idx + 1}</span>
              <button
                type="button"
                className="tpl-skill-gap-editor__remove-btn"
                onClick={() => removeItem(item.id)}
                aria-label="Remove skill"
              >
                Remove
              </button>
            </div>
            <div className="tpl-skill-gap-editor__field">
              <label className="tpl-skill-gap-editor__label" htmlFor={`sga-skill-${item.id}`}>Skill Name</label>
              <input
                id={`sga-skill-${item.id}`}
                className="tpl-skill-gap-editor__input"
                type="text"
                value={item.skill}
                onChange={(e) => updateItem(item.id, { skill: e.target.value })}
                placeholder="e.g. Communication"
              />
            </div>
            <div className="tpl-skill-gap-editor__levels">
              <div className="tpl-skill-gap-editor__field">
                <label className="tpl-skill-gap-editor__label" htmlFor={`sga-current-${item.id}`}>Current (%)</label>
                <input
                  id={`sga-current-${item.id}`}
                  className="tpl-skill-gap-editor__input tpl-skill-gap-editor__input--short"
                  type="number"
                  min={0}
                  max={100}
                  value={item.currentLevel}
                  onChange={(e) => updateItem(item.id, { currentLevel: Number(e.target.value) })}
                />
              </div>
              <div className="tpl-skill-gap-editor__field">
                <label className="tpl-skill-gap-editor__label" htmlFor={`sga-target-${item.id}`}>Target (%)</label>
                <input
                  id={`sga-target-${item.id}`}
                  className="tpl-skill-gap-editor__input tpl-skill-gap-editor__input--short"
                  type="number"
                  min={0}
                  max={100}
                  value={item.targetLevel}
                  onChange={(e) => updateItem(item.id, { targetLevel: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="tpl-skill-gap-editor__field">
              <label className="tpl-skill-gap-editor__label" htmlFor={`sga-link-${item.id}`}>
                Remediation Link
              </label>
              <input
                id={`sga-link-${item.id}`}
                className="tpl-skill-gap-editor__input"
                type="url"
                value={item.remediationLink ?? ''}
                onChange={(e) =>
                  updateItem(item.id, { remediationLink: e.target.value || undefined })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
        <button type="button" className="tpl-skill-gap-editor__add-btn" onClick={addItem}>
          + Add Skill
        </button>
      </div>
    </section>
  );
};
