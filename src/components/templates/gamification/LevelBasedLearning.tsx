import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './LevelBasedLearning.css';

interface Level {
  id: string;
  title: string;
  requirement: number;
  description?: string;
}

interface LevelBasedLearningData {
  title?: string;
  points?: number;
  levels?: Level[];
}

function normalizeLevels(raw: LevelBasedLearningData['levels']): Level[] {
  return (raw ?? []).map((level, index) => ({
    id: level.id || `level-${index + 1}`,
    title: level.title || '',
    requirement: Math.max(0, Number(level.requirement) || 0),
    description: level.description || '',
  }));
}

export const LevelBasedLearningPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as LevelBasedLearningData;
  const title = d.title || 'Level Based Learning';
  const points = Math.max(0, Number(d.points) || 0);
  const levels = useMemo(() => normalizeLevels(d.levels).sort((a, b) => a.requirement - b.requirement), [d.levels]);
  const activeIndex = Math.max(
    0,
    levels.reduce((idx, level, levelIndex) => (points >= level.requirement ? levelIndex : idx), 0),
  );
  const [expandedId, setExpandedId] = useState<string | null>(levels[activeIndex]?.id ?? null);

  React.useEffect(() => {
    if (levels.length > 0 && activeIndex === levels.length - 1 && points >= levels[levels.length - 1].requirement) {
      onInteraction?.({
        componentId,
        interactionType: 'level-learning-complete',
        value: { points, level: levels[activeIndex].title, levelIndex: activeIndex },
        completed: true,
        score: activeIndex + 1,
        maxScore: levels.length,
      });
      onComplete?.(componentId);
    }
  }, [activeIndex, componentId, levels, onComplete, onInteraction, points]);

  return (
    <section className="tpl-level-learning">
      <h3>{title}</h3>
      <p>Current points: {points}</p>

      <ol className="tpl-level-learning__path">
        {levels.map((level, index) => {
          const unlocked = points >= level.requirement;
          const active = index === activeIndex;
          const expanded = expandedId === level.id;
          return (
            <li key={level.id} className={`tpl-level-learning__node${active ? ' is-active' : ''}${unlocked ? ' is-unlocked' : ''}`}>
              <button
                type="button"
                onClick={() => {
                  setExpandedId((prev) => (prev === level.id ? null : level.id));
                  onInteraction?.({
                    componentId,
                    interactionType: 'level-learning-level-viewed',
                    interactionId: level.id,
                    value: { unlocked, requirement: level.requirement, index },
                    completed: false,
                  });
                }}
              >
                <span>{level.title || `Level ${index + 1}`}</span>
                <span>{unlocked ? 'Unlocked' : `Need ${level.requirement}`}</span>
              </button>
              {expanded && level.description ? <p>{level.description}</p> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export const LevelBasedLearningEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as LevelBasedLearningData;
  const levels = normalizeLevels(d.levels);

  const update = (patch: Partial<LevelBasedLearningData>) => onChange({ data: { ...d, ...patch } });

  const updateLevel = (index: number, patch: Partial<Level>) => {
    const nextLevels = [...levels];
    nextLevels[index] = { ...nextLevels[index], ...patch };
    update({ levels: nextLevels });
  };

  return (
    <section className="tpl-level-learning-editor">
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

      {levels.map((level, index) => (
        <article key={level.id} className="tpl-level-learning-editor__card">
          <label>
            Level title
            <input value={level.title} onChange={(event) => updateLevel(index, { title: event.target.value })} />
          </label>
          <label>
            Points requirement
            <input
              type="number"
              min={0}
              value={level.requirement}
              onChange={(event) => updateLevel(index, { requirement: Number(event.target.value) || 0 })}
            />
          </label>
          <label>
            Description
            <input
              value={level.description ?? ''}
              onChange={(event) => updateLevel(index, { description: event.target.value })}
            />
          </label>
          <button
            type="button"
            onClick={() => update({ levels: levels.filter((_, levelIndex) => levelIndex !== index) })}
          >
            Remove
          </button>
        </article>
      ))}

      <button
        type="button"
        onClick={() =>
          update({
            levels: [
              ...levels,
              {
                id: `level-${Date.now()}`,
                title: '',
                requirement: levels.length > 0 ? levels[levels.length - 1].requirement + 25 : 25,
                description: '',
              },
            ],
          })
        }
      >
        Add Level
      </button>
    </section>
  );
};
