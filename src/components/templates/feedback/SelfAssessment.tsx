import React, { useMemo, useState } from 'react';
import { Gauge, CheckCircle2 } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './SelfAssessment.css';

interface AssessmentCriterion {
  id: string;
  name: string;
  description?: string;
  scale?: number;
}

export interface SelfAssessmentData {
  title?: string;
  criteria?: AssessmentCriterion[];
}

export const SelfAssessmentPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const assessmentData = data as SelfAssessmentData;
  const criteria = assessmentData.criteria ?? [];
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const allRated = criteria.length > 0 && criteria.every((criterion) => Number(ratings[criterion.id] ?? 0) > 0);

  const scoreState = useMemo(() => {
    const totalScore = criteria.reduce((sum, criterion) => sum + Number(ratings[criterion.id] ?? 0), 0);
    const maxScore = criteria.reduce((sum, criterion) => sum + Math.max(1, Number(criterion.scale ?? 5)), 0);
    return { totalScore, maxScore };
  }, [criteria, ratings]);

  const submit = () => {
    if (!allRated) {
      return;
    }

    onInteraction?.({
      componentId,
      interactionType: 'self-assessment-submitted',
      score: scoreState.totalScore,
      maxScore: scoreState.maxScore,
      value: ratings,
      completed: true,
    });
    onComplete?.(componentId);
  };

  return (
    <article className="tpl-self-assessment">
      <h2 className="tpl-self-assessment__title"><Gauge size={20} /> {assessmentData.title || 'Self-Assessment'}</h2>

      {criteria.length === 0 ? <p className="tpl-self-assessment__empty">No criteria configured.</p> : null}

      <div className="tpl-self-assessment__criteria">
        {criteria.map((criterion) => {
          const scaleMax = Math.max(1, Number(criterion.scale ?? 5));
          const selected = Number(ratings[criterion.id] ?? 0);
          return (
            <section key={criterion.id} className="tpl-self-assessment__criterion">
              <p className="tpl-self-assessment__criterion-name">{criterion.name}</p>
              {criterion.description ? <p className="tpl-self-assessment__criterion-desc">{criterion.description}</p> : null}
              <div className="tpl-self-assessment__rating-group" role="radiogroup" aria-label={`${criterion.name} rating`}>
                {Array.from({ length: scaleMax }, (_, i) => i + 1).map((value) => (
                  <label key={value} className="tpl-self-assessment__rating-option">
                    <input
                      type="radio"
                      name={`criterion-${criterion.id}`}
                      checked={selected === value}
                      onChange={() => setRatings((prev) => ({ ...prev, [criterion.id]: value }))}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <button
        type="button"
        className="tpl-self-assessment__submit-btn"
        onClick={submit}
        disabled={!allRated}
      >
        <CheckCircle2 size={16} /> Submit Self-Assessment
      </button>
    </article>
  );
};

export const SelfAssessmentEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const assessmentData = data as SelfAssessmentData;
  const criteria = assessmentData.criteria ?? [];

  const update = (patch: Partial<SelfAssessmentData>) => {
    onChange({ data: { ...assessmentData, ...patch } });
  };

  const updateCriterion = (index: number, patch: Partial<AssessmentCriterion>) => {
    const next = [...criteria];
    next[index] = { ...next[index], ...patch };
    update({ criteria: next });
  };

  const addCriterion = () => {
    update({
      criteria: [
        ...criteria,
        { id: `crit-${Date.now()}`, name: '', description: '', scale: 5 },
      ],
    });
  };

  const removeCriterion = (index: number) => {
    update({ criteria: criteria.filter((_, i) => i !== index) });
  };

  return (
    <section className="tpl-self-assessment-editor">
      <div className="tpl-self-assessment-editor__field">
        <label className="tpl-self-assessment-editor__label" htmlFor="self-assessment-title">Title</label>
        <input
          id="self-assessment-title"
          className="tpl-self-assessment-editor__input"
          type="text"
          value={assessmentData.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Self-Assessment"
        />
      </div>

      <div className="tpl-self-assessment-editor__field">
        <div className="tpl-self-assessment-editor__head">
          <label className="tpl-self-assessment-editor__label">Criteria</label>
          <button type="button" className="tpl-self-assessment-editor__action" onClick={addCriterion}>Add Criterion</button>
        </div>

        {criteria.map((criterion, index) => (
          <div key={criterion.id || `criterion-${index}`} className="tpl-self-assessment-editor__criterion-row">
            <input
              className="tpl-self-assessment-editor__input"
              type="text"
              value={criterion.name}
              placeholder="Criterion name"
              onChange={(e) => updateCriterion(index, { name: e.target.value })}
            />
            <input
              className="tpl-self-assessment-editor__input"
              type="text"
              value={criterion.description ?? ''}
              placeholder="Description"
              onChange={(e) => updateCriterion(index, { description: e.target.value })}
            />
            <input
              className="tpl-self-assessment-editor__input"
              type="number"
              min={1}
              value={criterion.scale ?? 5}
              onChange={(e) => updateCriterion(index, { scale: Number(e.target.value) || 1 })}
            />
            <button
              type="button"
              className="tpl-self-assessment-editor__action"
              onClick={() => removeCriterion(index)}
              aria-label={`Remove criterion ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
