import React, { useMemo, useState } from 'react';
import { Thermometer, BarChart3 } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ConfidenceRating.css';

interface ConfidenceTopic {
  id: string;
  name: string;
  description?: string;
}

interface ConfidenceScale {
  min: number;
  max: number;
  labels?: string[];
}

export interface ConfidenceRatingData {
  title?: string;
  topics?: ConfidenceTopic[];
  scale?: ConfidenceScale;
}

export const ConfidenceRatingPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const ratingData = data as ConfidenceRatingData;
  const topics = ratingData.topics ?? [];
  const scaleMin = Number(ratingData.scale?.min ?? 1);
  const scaleMax = Math.max(scaleMin, Number(ratingData.scale?.max ?? 5));
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const rangeValues = useMemo(
    () => Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMin + i),
    [scaleMax, scaleMin]
  );

  const canSubmit = topics.length > 0 && topics.every((topic) => Number(ratings[topic.id] ?? 0) >= scaleMin);

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    onInteraction?.({
      componentId,
      interactionType: 'confidence-rating-submitted',
      value: ratings,
      completed: true,
    });
    onComplete?.(componentId);
  };

  return (
    <article className="tpl-confidence-rating">
      <h2 className="tpl-confidence-rating__title"><Thermometer size={20} /> {ratingData.title || 'Confidence Rating'}</h2>

      {topics.map((topic) => (
        <section key={topic.id} className="tpl-confidence-rating__topic">
          <p className="tpl-confidence-rating__topic-name">{topic.name}</p>
          {topic.description ? <p className="tpl-confidence-rating__topic-desc">{topic.description}</p> : null}
          <div className="tpl-confidence-rating__controls" role="radiogroup" aria-label={`${topic.name} confidence`}>
            {rangeValues.map((value) => (
              <label key={value} className="tpl-confidence-rating__option">
                <input
                  type="radio"
                  name={`confidence-${topic.id}`}
                  checked={ratings[topic.id] === value}
                  onChange={() => setRatings((prev) => ({ ...prev, [topic.id]: value }))}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </section>
      ))}

      <button
        type="button"
        className="tpl-confidence-rating__submit"
        onClick={submit}
        disabled={!canSubmit}
      >
        <BarChart3 size={16} /> Submit Confidence Ratings
      </button>
    </article>
  );
};

export const ConfidenceRatingEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const ratingData = data as ConfidenceRatingData;
  const topics = ratingData.topics ?? [];

  const update = (patch: Partial<ConfidenceRatingData>) => {
    onChange({ data: { ...ratingData, ...patch } });
  };

  const updateTopic = (index: number, patch: Partial<ConfidenceTopic>) => {
    const next = [...topics];
    next[index] = { ...next[index], ...patch };
    update({ topics: next });
  };

  const addTopic = () => {
    update({ topics: [...topics, { id: `topic-${Date.now()}`, name: '', description: '' }] });
  };

  const removeTopic = (index: number) => {
    update({ topics: topics.filter((_, i) => i !== index) });
  };

  return (
    <section className="tpl-confidence-rating-editor">
      <div className="tpl-confidence-rating-editor__field">
        <label className="tpl-confidence-rating-editor__label" htmlFor="confidence-title">Title</label>
        <input
          id="confidence-title"
          className="tpl-confidence-rating-editor__input"
          type="text"
          value={ratingData.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Confidence Rating"
        />
      </div>

      <div className="tpl-confidence-rating-editor__field tpl-confidence-rating-editor__field--scale">
        <label className="tpl-confidence-rating-editor__label" htmlFor="confidence-scale-min">Scale Min</label>
        <input
          id="confidence-scale-min"
          className="tpl-confidence-rating-editor__input"
          type="number"
          value={ratingData.scale?.min ?? 1}
          onChange={(e) => update({ scale: { ...(ratingData.scale ?? { min: 1, max: 5 }), min: Number(e.target.value) || 1 } })}
        />
        <label className="tpl-confidence-rating-editor__label" htmlFor="confidence-scale-max">Scale Max</label>
        <input
          id="confidence-scale-max"
          className="tpl-confidence-rating-editor__input"
          type="number"
          value={ratingData.scale?.max ?? 5}
          onChange={(e) => update({ scale: { ...(ratingData.scale ?? { min: 1, max: 5 }), max: Number(e.target.value) || 1 } })}
        />
      </div>

      <div className="tpl-confidence-rating-editor__field">
        <div className="tpl-confidence-rating-editor__head">
          <label className="tpl-confidence-rating-editor__label">Topics</label>
          <button type="button" className="tpl-confidence-rating-editor__action" onClick={addTopic}>Add Topic</button>
        </div>

        {topics.map((topic, index) => (
          <div key={topic.id || `topic-${index}`} className="tpl-confidence-rating-editor__topic-row">
            <input
              className="tpl-confidence-rating-editor__input"
              type="text"
              value={topic.name}
              placeholder="Topic name"
              onChange={(e) => updateTopic(index, { name: e.target.value })}
            />
            <input
              className="tpl-confidence-rating-editor__input"
              type="text"
              value={topic.description ?? ''}
              placeholder="Topic description"
              onChange={(e) => updateTopic(index, { description: e.target.value })}
            />
            <button
              type="button"
              className="tpl-confidence-rating-editor__action"
              onClick={() => removeTopic(index)}
              aria-label={`Remove topic ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
