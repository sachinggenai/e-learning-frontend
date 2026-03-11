import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './PointsAndBadges.css';

interface Badge {
  id: string;
  name: string;
  pointsRequired: number;
  description?: string;
}

interface PointsAndBadgesData {
  title?: string;
  points?: number;
  maxPoints?: number;
  badges?: Badge[];
}

function normalizeBadges(raw: PointsAndBadgesData['badges']): Badge[] {
  return (raw ?? []).map((badge, index) => ({
    id: badge.id || `badge-${index + 1}`,
    name: badge.name || '',
    pointsRequired: Math.max(0, Number(badge.pointsRequired) || 0),
    description: badge.description || '',
  }));
}

export const PointsAndBadgesPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as PointsAndBadgesData;
  const title = d.title || 'Points and Badges';
  const points = Math.max(0, Number(d.points) || 0);
  const maxPoints = Math.max(points, Number(d.maxPoints) || 100);
  const badges = useMemo(() => normalizeBadges(d.badges), [d.badges]);
  const unlockedCount = badges.filter((badge) => points >= badge.pointsRequired).length;
  const [expanded, setExpanded] = useState<string | null>(null);

  React.useEffect(() => {
    if (badges.length > 0 && unlockedCount === badges.length) {
      onInteraction?.({
        componentId,
        interactionType: 'points-badges-complete',
        value: { points, unlockedCount, total: badges.length },
        completed: true,
        score: unlockedCount,
        maxScore: badges.length,
      });
      onComplete?.(componentId);
    }
  }, [badges.length, componentId, onComplete, onInteraction, points, unlockedCount]);

  return (
    <section className="tpl-points-badges">
      <h3>{title}</h3>
      <p>
        {points}/{maxPoints} points
      </p>
      <div className="tpl-points-badges__meter" role="progressbar" aria-valuemin={0} aria-valuemax={maxPoints} aria-valuenow={points}>
        <div className="tpl-points-badges__meter-fill" style={{ width: `${Math.min(100, (points / maxPoints) * 100)}%` }} />
      </div>

      <ul className="tpl-points-badges__list">
        {badges.map((badge) => {
          const unlocked = points >= badge.pointsRequired;
          const isExpanded = expanded === badge.id;
          const remaining = Math.max(0, badge.pointsRequired - points);
          return (
            <li key={badge.id}>
              <button
                type="button"
                className={`tpl-points-badges__badge${unlocked ? ' is-unlocked' : ''}`}
                onClick={() => {
                  setExpanded((prev) => (prev === badge.id ? null : badge.id));
                  onInteraction?.({
                    componentId,
                    interactionType: 'points-badges-badge-viewed',
                    interactionId: badge.id,
                    value: { unlocked, pointsRequired: badge.pointsRequired },
                    completed: false,
                  });
                }}
              >
                <span>{badge.name || 'Badge'}</span>
-                <span>{unlocked ? 'Unlocked' : `${badge.pointsRequired} points`}</span>
+                <span>{unlocked ? 'Unlocked' : `${remaining} points to unlock`}</span>
              </button>
              {isExpanded && badge.description ? <p>{badge.description}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export const PointsAndBadgesEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as PointsAndBadgesData;
  const badges = normalizeBadges(d.badges);

  const update = (patch: Partial<PointsAndBadgesData>) => onChange({ data: { ...d, ...patch } });

  const updateBadge = (index: number, patch: Partial<Badge>) => {
    const nextBadges = [...badges];
    nextBadges[index] = { ...nextBadges[index], ...patch };
    update({ badges: nextBadges });
  };

  return (
    <section className="tpl-points-badges-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(event) => update({ title: event.target.value })} />
      </label>
      <label>
        Current points
        <input
          type="number"
          min={0}
          value={d.points ?? 0}
          onChange={(event) => update({ points: Number(event.target.value) || 0 })}
        />
      </label>
      <label>
        Max points
        <input
          type="number"
          min={1}
          value={d.maxPoints ?? 100}
          onChange={(event) => update({ maxPoints: Number(event.target.value) || 1 })}
        />
      </label>

      {badges.map((badge, index) => (
        <article key={badge.id} className="tpl-points-badges-editor__card">
          <label>
            Name
            <input value={badge.name} onChange={(event) => updateBadge(index, { name: event.target.value })} />
          </label>
          <label>
            Points required
            <input
              type="number"
              min={0}
              value={badge.pointsRequired}
              onChange={(event) => updateBadge(index, { pointsRequired: Number(event.target.value) || 0 })}
            />
          </label>
          <label>
            Description
            <input
              value={badge.description ?? ''}
              onChange={(event) => updateBadge(index, { description: event.target.value })}
            />
          </label>
          <button
            type="button"
            onClick={() => update({ badges: badges.filter((_, badgeIndex) => badgeIndex !== index) })}
          >
            Remove
          </button>
        </article>
      ))}

      <button
        type="button"
        onClick={() =>
          update({
            badges: [
              ...badges,
              {
                id: `badge-${Date.now()}`,
                name: '',
                pointsRequired: Math.max(0, Math.round((d.maxPoints ?? 100) * 0.25)),
                description: '',
              },
            ],
          })
        }
      >
        Add Badge
      </button>
    </section>
  );
};
