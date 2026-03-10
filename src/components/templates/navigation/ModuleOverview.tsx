import React from 'react';
import { BookOpen, CheckCircle, Clock, List, AlertCircle, Circle } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ModuleOverview.css';

interface ModuleObjective {
  id: string;
  text: string;
}

interface Prerequisite {
  id: string;
  text: string;
  completed?: boolean;
}

interface ModuleTopic {
  id: string;
  title: string;
  description?: string;
}

interface ModuleOverviewData {
  title?: string;
  description?: string;
  estimatedDuration?: number;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  coverImage?: string;
  objectives?: ModuleObjective[] | string[];
  prerequisites?: Prerequisite[];
  topics?: ModuleTopic[];
  showStartButton?: boolean;
}

const normalizeObjectives = (objectives: ModuleOverviewData['objectives']): ModuleObjective[] => {
  if (!objectives || objectives.length === 0) {
    return [];
  }

  if (typeof objectives[0] === 'string') {
    return (objectives as string[]).map((text, idx) => ({ id: `obj-${idx + 1}`, text }));
  }

  return objectives as ModuleObjective[];
};

export const ModuleOverviewPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const moduleData = data as ModuleOverviewData;
  const objectives = normalizeObjectives(moduleData.objectives);
  const prerequisites = moduleData.prerequisites ?? [];
  const topics = moduleData.topics ?? [];

  const difficultyClass = moduleData.difficultyLevel
    ? `tpl-module-overview__difficulty-badge--${moduleData.difficultyLevel}`
    : '';

  return (
    <article className="tpl-module-overview">
      {objectives.length === 0 ? (
        <p className="tpl-module-overview__empty">Module overview not configured.</p>
      ) : null}

      {moduleData.coverImage ? (
        <img
          className="tpl-module-overview__cover-image"
          src={moduleData.coverImage}
          alt="Module cover"
        />
      ) : null}

      <header className="tpl-module-overview__header">
        {moduleData.title ? <h2 className="tpl-module-overview__title">{moduleData.title}</h2> : null}

        <div className="tpl-module-overview__metadata">
          {moduleData.estimatedDuration ? (
            <span
              className="tpl-module-overview__duration-badge"
              aria-label={`Estimated duration: ${moduleData.estimatedDuration} minutes`}
            >
              <Clock size={16} /> {moduleData.estimatedDuration} min
            </span>
          ) : null}

          {moduleData.difficultyLevel ? (
            <span
              className={`tpl-module-overview__difficulty-badge ${difficultyClass}`}
              aria-label={`Difficulty level: ${moduleData.difficultyLevel}`}
            >
              {moduleData.difficultyLevel}
            </span>
          ) : null}
        </div>

        {moduleData.description ? (
          <p className="tpl-module-overview__description">{moduleData.description}</p>
        ) : null}
      </header>

      {objectives.length > 0 ? (
        <section className="tpl-module-overview__section tpl-module-overview__objectives">
          <h3 className="tpl-module-overview__section-title">
            <BookOpen className="tpl-module-overview__section-icon" size={20} /> Learning Objectives
          </h3>
          <ul>
            {objectives.map((obj) => (
              <li key={obj.id} className="tpl-module-overview__objective-item">
                <CheckCircle className="tpl-module-overview__objective-icon" size={18} />
                <span className="tpl-module-overview__objective-text">{obj.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {prerequisites.length > 0 ? (
        <section className="tpl-module-overview__section tpl-module-overview__prerequisites">
          <h3 className="tpl-module-overview__section-title">
            <AlertCircle className="tpl-module-overview__section-icon" size={20} /> Prerequisites
          </h3>
          <ul>
            {prerequisites.map((item) => (
              <li key={item.id} className="tpl-module-overview__prerequisite-item">
                {item.completed ? (
                  <CheckCircle className="tpl-module-overview__prerequisite-icon tpl-module-overview__prerequisite-icon--completed" size={18} />
                ) : (
                  <Circle className="tpl-module-overview__prerequisite-icon" size={18} />
                )}
                <span className="tpl-module-overview__prerequisite-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {topics.length > 0 ? (
        <section className="tpl-module-overview__section tpl-module-overview__topics">
          <h3 className="tpl-module-overview__section-title">
            <List className="tpl-module-overview__section-icon" size={20} /> Topics
          </h3>
          <div className="tpl-module-overview__topics-grid">
            {topics.map((topic) => (
              <article key={topic.id} className="tpl-module-overview__topic-card">
                <h4 className="tpl-module-overview__topic-title">{topic.title}</h4>
                {topic.description ? (
                  <p className="tpl-module-overview__topic-description">{topic.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {moduleData.showStartButton ? (
        <button
          type="button"
          className="tpl-module-overview__start-button"
          onClick={() =>
            onInteraction?.({
              componentId,
              interactionType: 'start-module',
              interactionId: 'start-module',
              value: true,
            })
          }
        >
          Start Module
        </button>
      ) : null}
    </article>
  );
};

export const ModuleOverviewEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const moduleData = data as ModuleOverviewData;
  const objectives = normalizeObjectives(moduleData.objectives);

  const update = (patch: Partial<ModuleOverviewData>) => {
    onChange({ data: { ...moduleData, ...patch } });
  };

  const updateObjective = (idx: number, text: string) => {
    const next = [...objectives];
    next[idx] = { ...next[idx], text };
    update({ objectives: next });
  };

  const addObjective = () => {
    update({ objectives: [...objectives, { id: `obj-${Date.now()}`, text: '' }] });
  };

  const removeObjective = (idx: number) => {
    update({ objectives: objectives.filter((_, i) => i !== idx) });
  };

  return (
    <section className="tpl-module-overview-editor">
      <div className="tpl-module-overview-editor__field">
        <label className="tpl-module-overview-editor__label" htmlFor="module-overview-title">Title</label>
        <input
          id="module-overview-title"
          className="tpl-module-overview-editor__input"
          type="text"
          value={moduleData.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Module Overview"
        />
      </div>

      <div className="tpl-module-overview-editor__field">
        <label className="tpl-module-overview-editor__label" htmlFor="module-overview-description">Description</label>
        <textarea
          id="module-overview-description"
          className="tpl-module-overview-editor__textarea"
          value={moduleData.description ?? ''}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Add module description"
        />
      </div>

      <div className="tpl-module-overview-editor__field">
        <label className="tpl-module-overview-editor__label" htmlFor="module-overview-duration">Estimated Duration (min)</label>
        <input
          id="module-overview-duration"
          className="tpl-module-overview-editor__number-input"
          type="number"
          min={1}
          value={moduleData.estimatedDuration ?? ''}
          onChange={(e) => update({ estimatedDuration: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <div className="tpl-module-overview-editor__field">
        <label className="tpl-module-overview-editor__label" htmlFor="module-overview-difficulty">Difficulty</label>
        <select
          id="module-overview-difficulty"
          className="tpl-module-overview-editor__select"
          value={moduleData.difficultyLevel ?? ''}
          onChange={(e) => update({ difficultyLevel: (e.target.value || undefined) as ModuleOverviewData['difficultyLevel'] })}
        >
          <option value="">Select difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="tpl-module-overview-editor__list">
        <h4 className="tpl-module-overview-editor__header">Objectives</h4>
        {objectives.map((item, idx) => (
          <div key={item.id} className="tpl-module-overview-editor__list-item">
            <input
              className="tpl-module-overview-editor__list-item-input"
              type="text"
              value={item.text}
              onChange={(e) => updateObjective(idx, e.target.value)}
              placeholder={`Objective ${idx + 1}`}
            />
            <button
              type="button"
              className="tpl-module-overview-editor__remove-btn"
              onClick={() => removeObjective(idx)}
              aria-label={`Remove objective ${idx + 1}`}
            >
              ×
            </button>
          </div>
        ))}

        <button type="button" className="tpl-module-overview-editor__add-btn" onClick={addObjective}>
          + Add Objective
        </button>
      </div>

      <label className="tpl-module-overview-editor__checkbox">
        <input
          type="checkbox"
          checked={Boolean(moduleData.showStartButton)}
          onChange={(e) => update({ showStartButton: e.target.checked })}
        />
        Show Start Button
      </label>
    </section>
  );
};
