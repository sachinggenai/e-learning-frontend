import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './PeerReview.css';

interface ReviewCriterion {
  id: string;
  label: string;
  description?: string;
}

interface PeerReviewData {
  title?: string;
  criteria?: ReviewCriterion[];
  maxRating?: 3 | 5;
  requireComment?: boolean;
}

function normalizeCriteria(raw: PeerReviewData['criteria']): ReviewCriterion[] {
  return (raw ?? []).map((c, i) => ({
    id: c.id || `crit-${i + 1}`,
    label: c.label || '',
    description: c.description || '',
  }));
}

export const PeerReviewPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as PeerReviewData;
  const title = d.title || 'Peer Review';
  const maxRating = d.maxRating === 3 ? 3 : 5;
  const requireComment = d.requireComment ?? false;
  const criteria = useMemo(() => normalizeCriteria(d.criteria), [d.criteria]);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const allRated = criteria.length > 0 && criteria.every((c) => ratings[c.id] !== undefined);
  const canSubmit = allRated && (!requireComment || comment.trim().length > 0);
  const avgRating = allRated
    ? criteria.reduce((sum, c) => sum + (ratings[c.id] ?? 0), 0) / criteria.length
    : 0;

  const handleRate = (criterionId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [criterionId]: value }));
    onInteraction?.({
      componentId,
      interactionType: 'peer_review_rating_changed',
      interactionId: criterionId,
      value: { rating: value },
      completed: false,
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onInteraction?.({
      componentId,
      interactionType: 'peer_review_submitted',
      value: { ratings, comment, averageRating: avgRating },
      completed: true,
    });
    onComplete?.(componentId);
  };

  if (submitted) {
    return (
      <section className="tpl-peer-review">
        <h3>{title}</h3>
        <p className="tpl-peer-review__summary">
          Review submitted. Average rating: {avgRating.toFixed(1)} / {maxRating}
        </p>
      </section>
    );
  }

  return (
    <section className="tpl-peer-review">
      <h3>{title}</h3>
      <ul className="tpl-peer-review__criteria">
        {criteria.map((c) => (
          <li key={c.id} className="tpl-peer-review__criterion">
            <span className="tpl-peer-review__criterion-label">{c.label || 'Criterion'}</span>
            {c.description && (
              <span className="tpl-peer-review__criterion-desc">{c.description}</span>
            )}
            <div
              className="tpl-peer-review__rating"
              role="group"
              aria-label={`Rate ${c.label}`}
            >
              {Array.from({ length: maxRating }, (_, i) => i + 1).map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`tpl-peer-review__star${ratings[c.id] >= val ? ' is-active' : ''}`}
                  onClick={() => handleRate(c.id, val)}
                  aria-label={`${val} of ${maxRating}`}
                  aria-pressed={ratings[c.id] >= val}
                >
                  {val}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="tpl-peer-review__comment">
        <label htmlFor={`${componentId}-comment`}>
          {requireComment ? 'Comments (required)' : 'Comments (optional)'}
        </label>
        <textarea
          id={`${componentId}-comment`}
          rows={4}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            onInteraction?.({
              componentId,
              interactionType: 'peer_review_comment_changed',
              value: { length: e.target.value.length },
              completed: false,
            });
          }}
        />
      </div>
      {allRated && (
        <p className="tpl-peer-review__summary">
          Current average: {avgRating.toFixed(1)} / {maxRating}
        </p>
      )}
      <button
        type="button"
        className="tpl-peer-review__submit"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        Submit Review
      </button>
    </section>
  );
};

export const PeerReviewEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as PeerReviewData;
  const criteria = normalizeCriteria(d.criteria);
  const update = (patch: Partial<PeerReviewData>) => onChange({ data: { ...d, ...patch } });

  const updateCriterion = (index: number, patch: Partial<ReviewCriterion>) => {
    const next = [...criteria];
    next[index] = { ...next[index], ...patch };
    update({ criteria: next });
  };

  return (
    <section className="tpl-peer-review-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Max rating
        <select
          value={d.maxRating ?? 5}
          onChange={(e) => update({ maxRating: Number(e.target.value) as 3 | 5 })}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </label>
      <label className="tpl-peer-review-editor__checkbox">
        <input
          type="checkbox"
          checked={d.requireComment ?? false}
          onChange={(e) => update({ requireComment: e.target.checked })}
        />
        Require comment
      </label>
      <fieldset>
        <legend>Criteria</legend>
        {criteria.map((c, i) => (
          <div key={c.id} className="tpl-peer-review-editor__row">
            <input
              value={c.label}
              placeholder="Criterion label"
              onChange={(e) => updateCriterion(i, { label: e.target.value })}
            />
            <button
              type="button"
              onClick={() => update({ criteria: criteria.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update({
              criteria: [
                ...criteria,
                { id: `crit-${Date.now()}`, label: '', description: '' },
              ],
            })
          }
        >
          Add Criterion
        </button>
      </fieldset>
    </section>
  );
};
