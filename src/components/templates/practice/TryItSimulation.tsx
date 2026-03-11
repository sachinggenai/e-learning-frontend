import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './TryItSimulation.css';

interface TryItTarget {
  id: string;
  label: string;
  order: number;
  x: number;
  y: number;
  radius?: number;
  feedback?: string;
}

interface TryItSimulationData {
  title?: string;
  prompt?: string;
  canvasLabel?: string;
  targets?: TryItTarget[];
  allowRetry?: boolean;
}

function normalizeTargets(targets: TryItTarget[] | undefined): TryItTarget[] {
  const list = Array.isArray(targets) && targets.length > 0 ? targets : [
    { id: 't-1', label: 'First target', order: 1, x: 25, y: 40, radius: 22, feedback: 'Good start.' },
    { id: 't-2', label: 'Second target', order: 2, x: 60, y: 55, radius: 22, feedback: 'Great, continue.' },
  ];

  return list
    .map((t, i) => ({
      id: t.id || `target-${i + 1}`,
      label: t.label || `Target ${i + 1}`,
      order: Number(t.order) || i + 1,
      x: Number(t.x) || 0,
      y: Number(t.y) || 0,
      radius: Number(t.radius) || 20,
      feedback: t.feedback,
    }))
    .sort((a, b) => a.order - b.order);
}

export const TryItSimulationPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as TryItSimulationData;
  const title = d.title || 'Try-It Simulation';
  const prompt = d.prompt || '';
  const canvasLabel = d.canvasLabel || 'Simulation canvas';
  const allowRetry = d.allowRetry !== false;
  const targets = useMemo(() => normalizeTargets(d.targets), [d.targets]);

  const [nextIndex, setNextIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const expectedTarget = targets[nextIndex];
  const done = completedIds.size === targets.length;

  const handleTargetClick = (target: TryItTarget) => {
    if (done || locked) return;

    onInteraction?.({
      componentId,
      interactionType: 'tryit_target_clicked',
      interactionId: target.id,
      value: { label: target.label, order: target.order, attempts: attempts + 1 },
      completed: false,
    });

    if (expectedTarget && target.id === expectedTarget.id) {
      const nextDone = new Set(completedIds);
      nextDone.add(target.id);
      setCompletedIds(nextDone);
      setNextIndex((v) => v + 1);
      setFeedback(target.feedback || 'Correct. Continue.');

      onInteraction?.({
        componentId,
        interactionType: 'tryit_step_correct',
        interactionId: target.id,
        value: { expectedOrder: expectedTarget.order },
        completed: false,
      });

      if (nextDone.size === targets.length) {
        onInteraction?.({
          componentId,
          interactionType: 'tryit_simulation_completed',
          value: { attempts: attempts + 1, successCount: nextDone.size },
          completed: true,
        });
        onComplete?.(componentId);
      }
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback('Incorrect order. Try the required target first.');

    onInteraction?.({
      componentId,
      interactionType: 'tryit_step_incorrect',
      interactionId: target.id,
      value: {
        expectedTargetId: expectedTarget?.id,
        selectedTargetId: target.id,
      },
      completed: false,
    });

    if (!allowRetry) {
      setLocked(true);
    }
  };

  return (
    <section className="tpl-tryit">
      <h3 className="tpl-tryit__title">{title}</h3>
      {prompt && <p className="tpl-tryit__prompt">{prompt}</p>}

      <div className="tpl-tryit__canvas" role="group" aria-label={canvasLabel}>
        {targets.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tpl-tryit__target ${completedIds.has(t.id) ? 'is-complete' : ''}`}
            style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${t.radius || 20}px`, height: `${t.radius || 20}px` }}
            onClick={() => handleTargetClick(t)}
            aria-label={t.label}
            disabled={completedIds.has(t.id) || done || locked}
          >
            {t.order}
          </button>
        ))}
      </div>

      <div className="tpl-tryit__legend">
        <p>Next required target: {expectedTarget ? expectedTarget.label : 'Completed'}</p>
        <ul>
          {targets.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => handleTargetClick(t)} disabled={completedIds.has(t.id) || done || locked}>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="tpl-tryit__feedback" aria-live="polite">{feedback}</div>

      {done && <p className="tpl-tryit__done" role="status">Simulation complete.</p>}
      {locked && !done && <p className="tpl-tryit__locked">Simulation locked after incorrect attempt.</p>}
    </section>
  );
};

export const TryItSimulationEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as TryItSimulationData;
  const targets = normalizeTargets(d.targets);

  const update = (patch: Partial<TryItSimulationData>) => onChange({ data: { ...d, ...patch } });

  const updateTarget = (idx: number, patch: Partial<TryItTarget>) => {
    const next = [...targets];
    next[idx] = { ...next[idx], ...patch };
    update({ targets: next });
  };

  const addTarget = () => {
    update({
      targets: [
        ...targets,
        {
          id: `target-${targets.length + 1}`,
          label: `Target ${targets.length + 1}`,
          order: targets.length + 1,
          x: 50,
          y: 50,
          radius: 20,
          feedback: '',
        },
      ],
    });
  };

  const removeTarget = (idx: number) => {
    update({ targets: targets.filter((_, i) => i !== idx) });
  };

  return (
    <section className="tpl-tryit-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Prompt
        <textarea rows={2} value={d.prompt ?? ''} onChange={(e) => update({ prompt: e.target.value })} />
      </label>
      <label>
        Canvas label
        <input value={d.canvasLabel ?? ''} onChange={(e) => update({ canvasLabel: e.target.value })} />
      </label>
      <label className="tpl-tryit-editor__checkbox">
        <input type="checkbox" checked={d.allowRetry !== false} onChange={(e) => update({ allowRetry: e.target.checked })} />
        Allow retry
      </label>

      {targets.map((t, idx) => (
        <fieldset key={t.id} className="tpl-tryit-editor__target">
          <legend>Target {idx + 1}</legend>
          <label>
            Label
            <input value={t.label} onChange={(e) => updateTarget(idx, { label: e.target.value })} />
          </label>
          <label>
            Order
            <input type="number" min={1} value={t.order} onChange={(e) => updateTarget(idx, { order: Number(e.target.value) || 1 })} />
          </label>
          <label>
            X (%)
            <input type="number" value={t.x} onChange={(e) => updateTarget(idx, { x: Number(e.target.value) || 0 })} />
          </label>
          <label>
            Y (%)
            <input type="number" value={t.y} onChange={(e) => updateTarget(idx, { y: Number(e.target.value) || 0 })} />
          </label>
          <label>
            Radius (px)
            <input type="number" min={8} value={t.radius ?? 20} onChange={(e) => updateTarget(idx, { radius: Number(e.target.value) || 20 })} />
          </label>
          <label>
            Feedback
            <input value={t.feedback ?? ''} onChange={(e) => updateTarget(idx, { feedback: e.target.value })} />
          </label>
          <button type="button" onClick={() => removeTarget(idx)} disabled={targets.length <= 1}>Remove target</button>
        </fieldset>
      ))}

      <button type="button" onClick={addTarget}>Add Target</button>
    </section>
  );
};
