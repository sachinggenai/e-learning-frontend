import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './TeamChallenge.css';

interface ChallengeStep {
  id: string;
  text: string;
  ownerRole?: string;
}

interface TeamChallengeData {
  title?: string;
  objective?: string;
  teamSize?: number;
  steps?: ChallengeStep[];
  timeboxMin?: number;
}

function normalizeSteps(raw: TeamChallengeData['steps']): ChallengeStep[] {
  return (raw ?? []).map((s, i) => ({
    id: s.id || `step-${i + 1}`,
    text: s.text || '',
    ownerRole: s.ownerRole || '',
  }));
}

export const TeamChallengePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as TeamChallengeData;
  const title = d.title || 'Team Challenge';
  const objective = d.objective || '';
  const teamSize = Math.max(1, Number(d.teamSize) || 2);
  const timeboxMin = Number(d.timeboxMin) || 0;
  const steps = useMemo(() => normalizeSteps(d.steps), [d.steps]);

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      onInteraction?.({
        componentId,
        interactionType: 'team_challenge_step_toggled',
        interactionId: id,
        value: { completed: next.has(id), totalCompleted: next.size },
        completed: false,
      });

      if (steps.length > 0 && next.size === steps.length) {
        onInteraction?.({
          componentId,
          interactionType: 'team_challenge_completed',
          value: { stepsCompleted: next.size },
          completed: true,
        });
        onComplete?.(componentId);
      }
      return next;
    });
  };

  const completedCount = checked.size;
  const total = steps.length;

  return (
    <section className="tpl-team-challenge">
      <h3 className="tpl-team-challenge__title">{title}</h3>
      {objective && <div className="tpl-team-challenge__objective">{objective}</div>}
      <div className="tpl-team-challenge__meta">
        <span>Team size: {teamSize}</span>
        {timeboxMin > 0 && <span> · {timeboxMin} min</span>}
      </div>
      <ul className="tpl-team-challenge__steps">
        {steps.map((s) => (
          <li
            key={s.id}
            className={`tpl-team-challenge__step${checked.has(s.id) ? ' is-done' : ''}`}
          >
            <label>
              <input
                type="checkbox"
                checked={checked.has(s.id)}
                onChange={() => toggle(s.id)}
              />
              <span>{s.text}</span>
              {s.ownerRole && (
                <span className="tpl-team-challenge__role">({s.ownerRole})</span>
              )}
            </label>
          </li>
        ))}
      </ul>
      {total > 0 && (
        <p className="tpl-team-challenge__progress" aria-live="polite">
          {completedCount} of {total} steps completed
        </p>
      )}
    </section>
  );
};

export const TeamChallengeEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as TeamChallengeData;
  const steps = normalizeSteps(d.steps);
  const update = (patch: Partial<TeamChallengeData>) => onChange({ data: { ...d, ...patch } });

  const updateStep = (index: number, patch: Partial<ChallengeStep>) => {
    const next = [...steps];
    next[index] = { ...next[index], ...patch };
    update({ steps: next });
  };

  return (
    <section className="tpl-team-challenge-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Objective
        <textarea
          rows={3}
          value={d.objective ?? ''}
          onChange={(e) => update({ objective: e.target.value })}
        />
      </label>
      <label>
        Team size
        <input
          type="number"
          min={1}
          value={d.teamSize ?? 2}
          onChange={(e) => update({ teamSize: Math.max(1, Number(e.target.value)) })}
        />
      </label>
      <label>
        Timebox (minutes)
        <input
          type="number"
          min={0}
          value={d.timeboxMin ?? 0}
          onChange={(e) => update({ timeboxMin: Math.max(0, Number(e.target.value)) })}
        />
      </label>
      <fieldset>
        <legend>Steps</legend>
        {steps.map((s, i) => (
          <div key={s.id} className="tpl-team-challenge-editor__row">
            <input
              value={s.text}
              placeholder="Step description"
              onChange={(e) => updateStep(i, { text: e.target.value })}
            />
            <input
              value={s.ownerRole ?? ''}
              placeholder="Owner role (optional)"
              onChange={(e) => updateStep(i, { ownerRole: e.target.value })}
            />
            <button
              type="button"
              onClick={() => update({ steps: steps.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update({
              steps: [...steps, { id: `step-${Date.now()}`, text: '', ownerRole: '' }],
            })
          }
        >
          Add Step
        </button>
      </fieldset>
    </section>
  );
};
