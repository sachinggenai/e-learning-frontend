import React from 'react';
import { BarChart3, Clock3, Flag } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './LearningProgressSummary.css';

export interface ProgressMilestone {
  id: string;
  label: string;
  threshold: number;
  reached: boolean;
}

export interface LearningProgressSummaryData {
  title?: string;
  totalUnits?: number;
  completedUnits?: number;
  percentage?: number;
  milestones?: ProgressMilestone[];
  estimatedTimeRemainingMins?: number;
}

export const LearningProgressSummaryPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const d = data as LearningProgressSummaryData;
  const totalUnits = Math.max(0, d.totalUnits ?? 0);
  const completedUnits = Math.max(0, d.completedUnits ?? 0);
  const computedPct = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
  const percentage = d.percentage ?? computedPct;
  const milestones = d.milestones ?? [];

  return (
    <article className="tpl-learning-progress-summary">
      <header className="tpl-learning-progress-summary__header">
        <h2 className="tpl-learning-progress-summary__title">
          <BarChart3 size={20} className="tpl-learning-progress-summary__title-icon" />
          {d.title?.trim() || 'Learning Progress Summary'}
        </h2>
        <p className="tpl-learning-progress-summary__headline">{percentage}% Complete</p>
      </header>

      <div className="tpl-learning-progress-summary__bar-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <div className="tpl-learning-progress-summary__bar-fill" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} />
      </div>

      <p className="tpl-learning-progress-summary__counts">Completed {completedUnits} of {totalUnits} units</p>

      {typeof d.estimatedTimeRemainingMins === 'number' && (
        <p className="tpl-learning-progress-summary__eta"><Clock3 size={14} /> Estimated time remaining: {d.estimatedTimeRemainingMins} mins</p>
      )}

      {milestones.length > 0 && (
        <ul className="tpl-learning-progress-summary__milestones">
          {milestones.map((m) => (
            <li key={m.id} className={`tpl-learning-progress-summary__milestone ${m.reached ? 'tpl-learning-progress-summary__milestone--reached' : ''}`}>
              <button
                type="button"
                className="tpl-learning-progress-summary__milestone-btn"
                onClick={() => onInteraction?.({ componentId, interactionType: 'milestone_viewed', interactionId: m.id, value: m.label, completed: false })}
              >
                <Flag size={14} /> {m.label} ({m.threshold}%)
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export const LearningProgressSummaryEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as LearningProgressSummaryData;
  const milestones = d.milestones ?? [];

  const update = (patch: Partial<LearningProgressSummaryData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-learning-progress-summary-editor">
      <label className="tpl-learning-progress-summary-editor__field">
        <span>Title</span>
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>

      <div className="tpl-learning-progress-summary-editor__row">
        <label className="tpl-learning-progress-summary-editor__field">
          <span>Total Units</span>
          <input type="number" min={0} value={d.totalUnits ?? 0} onChange={(e) => update({ totalUnits: Number(e.target.value) })} />
        </label>
        <label className="tpl-learning-progress-summary-editor__field">
          <span>Completed Units</span>
          <input type="number" min={0} value={d.completedUnits ?? 0} onChange={(e) => update({ completedUnits: Number(e.target.value) })} />
        </label>
      </div>

      <label className="tpl-learning-progress-summary-editor__field">
        <span>ETA (mins)</span>
        <input type="number" min={0} value={d.estimatedTimeRemainingMins ?? 0} onChange={(e) => update({ estimatedTimeRemainingMins: Number(e.target.value) })} />
      </label>

      <div className="tpl-learning-progress-summary-editor__milestones">
        <div className="tpl-learning-progress-summary-editor__head">
          <h3>Milestones</h3>
          <button type="button" onClick={() => update({ milestones: [...milestones, { id: `m-${Date.now()}`, label: '', threshold: 50, reached: false }] })}>+ Add</button>
        </div>
        {milestones.map((m) => (
          <div key={m.id} className="tpl-learning-progress-summary-editor__milestone">
            <input value={m.label} placeholder="Label" onChange={(e) => update({ milestones: milestones.map((x) => x.id === m.id ? { ...x, label: e.target.value } : x) })} />
            <input type="number" min={0} max={100} value={m.threshold} onChange={(e) => update({ milestones: milestones.map((x) => x.id === m.id ? { ...x, threshold: Number(e.target.value) } : x) })} />
            <label>
              <input type="checkbox" checked={m.reached} onChange={(e) => update({ milestones: milestones.map((x) => x.id === m.id ? { ...x, reached: e.target.checked } : x) })} />
              Reached
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};
