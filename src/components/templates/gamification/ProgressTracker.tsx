import React, { useEffect, useMemo, useRef } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ProgressTracker.css';

interface Milestone {
  id: string;
  label: string;
  target: number;
}

interface ProgressTrackerData {
  title?: string;
  progress?: number;
  milestones?: Milestone[];
}

function normalizeMilestones(raw: ProgressTrackerData['milestones']): Milestone[] {
  return (raw ?? []).map((milestone, index) => ({
    id: milestone.id || `milestone-${index + 1}`,
    label: milestone.label || '',
    target: Math.min(100, Math.max(0, Number(milestone.target) || 0)),
  }));
}

export const ProgressTrackerPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as ProgressTrackerData;
  const title = d.title || 'Your Progress';
  const progress = Math.min(100, Math.max(0, Number(d.progress) || 0));
  const milestones = useMemo(() => normalizeMilestones(d.milestones), [d.milestones]);
  const reachedCount = milestones.filter((milestone) => progress >= milestone.target).length;
  const completedRef = useRef(false);

  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      onInteraction?.({
        componentId,
        interactionType: 'progress-tracker-complete',
        value: { progress: 100, reachedCount, milestoneCount: milestones.length },
        completed: true,
        score: reachedCount,
        maxScore: milestones.length,
      });
      onComplete?.(componentId);
    }
  }, [componentId, milestones.length, onComplete, onInteraction, progress, reachedCount]);

  return (
    <section className="tpl-progress-tracker">
      <h3>{title}</h3>

      <div
        className="tpl-progress-tracker__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={`Progress ${progress}%`}
      >
        <div className="tpl-progress-tracker__bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="tpl-progress-tracker__percent">{progress}% complete</p>

      <ul className="tpl-progress-tracker__milestones">
        {milestones.map((milestone) => {
          const reached = progress >= milestone.target;
          return (
            <li key={milestone.id}>
              <button
                type="button"
                className={`tpl-progress-tracker__milestone${reached ? ' is-reached' : ''}`}
                onClick={() =>
                  onInteraction?.({
                    componentId,
                    interactionType: 'progress-tracker-milestone-viewed',
                    interactionId: milestone.id,
                    value: { label: milestone.label, target: milestone.target, reached },
                    completed: false,
                  })
                }
              >
                <span>
                  {reached ? 'Reached' : 'Locked'}: {milestone.label || 'Milestone'}
                </span>
                <span>{milestone.target}%</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="tpl-progress-tracker__summary">
        {reachedCount} of {milestones.length} milestones reached
      </p>
    </section>
  );
};

export const ProgressTrackerEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as ProgressTrackerData;
  const milestones = normalizeMilestones(d.milestones);

  const update = (patch: Partial<ProgressTrackerData>) => onChange({ data: { ...d, ...patch } });

  const updateMilestone = (index: number, patch: Partial<Milestone>) => {
    const nextMilestones = [...milestones];
    nextMilestones[index] = { ...nextMilestones[index], ...patch };
    update({ milestones: nextMilestones });
  };

  return (
    <section className="tpl-progress-tracker-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(event) => update({ title: event.target.value })} />
      </label>

      <label>
        Progress ({d.progress ?? 0}%)
        <input
          type="range"
          min={0}
          max={100}
          value={d.progress ?? 0}
          onChange={(event) => update({ progress: Number(event.target.value) || 0 })}
        />
      </label>

      <div className="tpl-progress-tracker-editor__header">
        <strong>Milestones</strong>
        <button
          type="button"
          onClick={() =>
            update({
              milestones: [
                ...milestones,
                {
                  id: `milestone-${Date.now()}`,
                  label: '',
                  target: Math.min(100, (milestones.length + 1) * 20),
                },
              ],
            })
          }
        >
          Add
        </button>
      </div>

      {milestones.map((milestone, index) => (
        <article key={milestone.id} className="tpl-progress-tracker-editor__card">
          <label>
            Label
            <input
              value={milestone.label}
              onChange={(event) => updateMilestone(index, { label: event.target.value })}
            />
          </label>
          <label>
            Target %
            <input
              type="number"
              min={0}
              max={100}
              value={milestone.target}
              onChange={(event) => updateMilestone(index, { target: Number(event.target.value) || 0 })}
            />
          </label>
          <button
            type="button"
            onClick={() => update({ milestones: milestones.filter((_, i) => i !== index) })}
          >
            Remove
          </button>
        </article>
      ))}
    </section>
  );
};
