import React, { useState } from 'react';
import { CalendarCheck2, CheckSquare, Plus } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ActionPlanning.css';

interface PlanGoal {
  id: string;
  description: string;
  deadline?: string;
  actions?: string[];
}

export interface ActionPlanningData {
  title?: string;
  goals?: PlanGoal[];
}

export const ActionPlanningPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const planData = data as ActionPlanningData;
  const goals = planData.goals ?? [];
  const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({});

  const toggleGoal = (goalId: string) => {
    setCheckedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const submit = () => {
    const completedGoalIds = goals.filter((goal) => checkedGoals[goal.id]).map((goal) => goal.id);

    onInteraction?.({
      componentId,
      interactionType: 'action-plan-submitted',
      value: completedGoalIds,
      completed: completedGoalIds.length > 0,
    });
    onComplete?.(componentId);
  };

  return (
    <article className="tpl-action-planning">
      <h2 className="tpl-action-planning__title"><CalendarCheck2 size={20} /> {planData.title || 'My Action Plan'}</h2>

      {goals.length === 0 ? <p className="tpl-action-planning__empty">No goals configured.</p> : null}

      <div className="tpl-action-planning__goals">
        {goals.map((goal) => (
          <section key={goal.id} className="tpl-action-planning__goal">
            <label className="tpl-action-planning__goal-head">
              <input
                type="checkbox"
                checked={Boolean(checkedGoals[goal.id])}
                onChange={() => toggleGoal(goal.id)}
              />
              <span className="tpl-action-planning__goal-text">{goal.description}</span>
            </label>
            {goal.deadline ? <p className="tpl-action-planning__deadline">Target date: {goal.deadline}</p> : null}
            {(goal.actions ?? []).length > 0 ? (
              <ul className="tpl-action-planning__actions">
                {(goal.actions ?? []).map((action, index) => (
                  <li key={`${goal.id}-action-${index}`}>{action}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <button type="button" className="tpl-action-planning__submit" onClick={submit}>
        <CheckSquare size={16} /> Submit Action Plan
      </button>
    </article>
  );
};

export const ActionPlanningEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const planData = data as ActionPlanningData;
  const goals = planData.goals ?? [];

  const update = (patch: Partial<ActionPlanningData>) => {
    onChange({ data: { ...planData, ...patch } });
  };

  const updateGoal = (index: number, patch: Partial<PlanGoal>) => {
    const next = [...goals];
    next[index] = { ...next[index], ...patch };
    update({ goals: next });
  };

  const updateAction = (goalIndex: number, actionIndex: number, value: string) => {
    const goal = goals[goalIndex];
    const nextActions = [...(goal.actions ?? [])];
    nextActions[actionIndex] = value;
    updateGoal(goalIndex, { actions: nextActions });
  };

  const addGoal = () => {
    update({ goals: [...goals, { id: `goal-${Date.now()}`, description: '', deadline: '', actions: [''] }] });
  };

  const removeGoal = (index: number) => {
    update({ goals: goals.filter((_, i) => i !== index) });
  };

  const addAction = (goalIndex: number) => {
    const goal = goals[goalIndex];
    updateGoal(goalIndex, { actions: [...(goal.actions ?? []), ''] });
  };

  return (
    <section className="tpl-action-planning-editor">
      <div className="tpl-action-planning-editor__field">
        <label className="tpl-action-planning-editor__label" htmlFor="action-plan-title">Title</label>
        <input
          id="action-plan-title"
          className="tpl-action-planning-editor__input"
          type="text"
          value={planData.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="My Action Plan"
        />
      </div>

      <div className="tpl-action-planning-editor__field">
        <div className="tpl-action-planning-editor__head">
          <label className="tpl-action-planning-editor__label">Goals</label>
          <button type="button" className="tpl-action-planning-editor__action" onClick={addGoal}>
            <Plus size={14} /> Add Goal
          </button>
        </div>

        {goals.map((goal, goalIndex) => (
          <div key={goal.id || `goal-${goalIndex}`} className="tpl-action-planning-editor__goal-row">
            <input
              className="tpl-action-planning-editor__input"
              type="text"
              value={goal.description}
              placeholder="Goal description"
              onChange={(e) => updateGoal(goalIndex, { description: e.target.value })}
            />
            <input
              className="tpl-action-planning-editor__input"
              type="date"
              value={goal.deadline ?? ''}
              onChange={(e) => updateGoal(goalIndex, { deadline: e.target.value })}
            />

            {(goal.actions ?? []).map((action, actionIndex) => (
              <input
                key={`${goal.id}-action-${actionIndex}`}
                className="tpl-action-planning-editor__input"
                type="text"
                value={action}
                placeholder={`Action ${actionIndex + 1}`}
                onChange={(e) => updateAction(goalIndex, actionIndex, e.target.value)}
              />
            ))}

            <div className="tpl-action-planning-editor__buttons">
              <button
                type="button"
                className="tpl-action-planning-editor__action"
                onClick={() => addAction(goalIndex)}
              >
                Add Action
              </button>
              <button
                type="button"
                className="tpl-action-planning-editor__action"
                onClick={() => removeGoal(goalIndex)}
                aria-label={`Remove goal ${goalIndex + 1}`}
              >
                Remove Goal
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
