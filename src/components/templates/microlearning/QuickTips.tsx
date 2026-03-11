import React, { useMemo, useRef, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './QuickTips.css';

interface QuickTip {
  id: string;
  title: string;
  detail?: string;
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface QuickTipsData {
  heading?: string;
  subtitle?: string;
  tips?: QuickTip[];
  allowMarkDone?: boolean;
  showPriorityBadge?: boolean;
}

function normalizeTips(tips?: QuickTip[]): QuickTip[] {
  return (tips ?? []).map((tip, index) => ({
    id: tip.id || `quick-tip-${index + 1}`,
    title: tip.title || (tip as any).text || '',
    detail: tip.detail || '',
    icon: tip.icon || '',
    priority: tip.priority || 'medium',
  }));
}

export const QuickTipsPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as QuickTipsData;
  const tips = useMemo(() => normalizeTips(d.tips), [d.tips]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const completedRef = useRef(false);

  const maybeComplete = (nextDoneIds: Set<string>, nextOpenedIds: Set<string>) => {
    if (completedRef.current || tips.length === 0) {
      return;
    }

    const isDone = d.allowMarkDone
      ? nextDoneIds.size === tips.length
      : nextOpenedIds.size === tips.length;

    if (!isDone) {
      return;
    }

    completedRef.current = true;
    onInteraction?.({
      componentId,
      interactionType: 'quick_tips_completed',
      value: { total: tips.length },
      completed: true,
    });
    onComplete?.(componentId);
  };

  if (tips.length === 0) {
    return <section className="tpl-quick-tips tpl-quick-tips--empty">No tips configured.</section>;
  }

  return (
    <section className="tpl-quick-tips">
      <header>
        <h3>{d.heading || 'Quick Tips'}</h3>
        {d.subtitle ? <p>{d.subtitle}</p> : null}
      </header>

      <ul className="tpl-quick-tips__list">
        {tips.map((tip, index) => {
          const isOpen = openIds.has(tip.id);
          const isDone = doneIds.has(tip.id);
          const detailId = `quick-tip-detail-${tip.id}`;
          return (
            <li key={tip.id} className={`tpl-quick-tips__item${isDone ? ' is-done' : ''}`}>
              <div className="tpl-quick-tips__header">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                  onClick={() => {
                    const nextOpenIds = new Set(openIds);
                    const nextOpenedIds = new Set(openedIds);
                    nextOpenedIds.add(tip.id);

                    if (isOpen) {
                      nextOpenIds.delete(tip.id);
                      onInteraction?.({
                        componentId,
                        interactionType: 'quick_tip_closed',
                        interactionId: tip.id,
                        value: { index },
                        completed: false,
                      });
                    } else {
                      nextOpenIds.add(tip.id);
                      onInteraction?.({
                        componentId,
                        interactionType: 'quick_tip_opened',
                        interactionId: tip.id,
                        value: { index },
                        completed: false,
                      });
                    }

                    setOpenIds(nextOpenIds);
                    setOpenedIds(nextOpenedIds);
                    maybeComplete(doneIds, nextOpenedIds);
                  }}
                >
                  <span>
                    {tip.icon ? <span aria-hidden="true">{tip.icon} </span> : null}
                    {tip.title || `Tip ${index + 1}`}
                  </span>
                  {d.showPriorityBadge ? (
                    <span className={`tpl-quick-tips__badge tpl-quick-tips__badge--${tip.priority}`}>{tip.priority}</span>
                  ) : null}
                </button>

                {d.allowMarkDone ? (
                  <label>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(event) => {
                        const nextDoneIds = new Set(doneIds);
                        if (event.target.checked) {
                          nextDoneIds.add(tip.id);
                        } else {
                          nextDoneIds.delete(tip.id);
                        }
                        setDoneIds(nextDoneIds);
                        onInteraction?.({
                          componentId,
                          interactionType: 'quick_tip_marked_done',
                          interactionId: tip.id,
                          value: { done: event.target.checked, index },
                          completed: false,
                        });
                        maybeComplete(nextDoneIds, openedIds);
                      }}
                    />
                    Done
                  </label>
                ) : null}
              </div>

              {isOpen && tip.detail ? (
                <p id={detailId} className="tpl-quick-tips__detail">
                  {tip.detail}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export const QuickTipsEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as QuickTipsData;
  const tips = normalizeTips(d.tips);

  const update = (patch: Partial<QuickTipsData>) => onChange({ data: { ...d, ...patch } });
  const updateTip = (index: number, patch: Partial<QuickTip>) => {
    const nextTips = [...tips];
    nextTips[index] = { ...nextTips[index], ...patch };
    update({ tips: nextTips });
  };

  return (
    <section className="tpl-quick-tips-editor">
      <label>
        Heading
        <input value={d.heading ?? ''} onChange={(event) => update({ heading: event.target.value })} />
      </label>
      <label>
        Subtitle
        <input value={d.subtitle ?? ''} onChange={(event) => update({ subtitle: event.target.value })} />
      </label>
      <label>
        <input
          type="checkbox"
          checked={d.allowMarkDone === true}
          onChange={(event) => update({ allowMarkDone: event.target.checked })}
        />
        &nbsp;Allow mark done
      </label>
      <label>
        <input
          type="checkbox"
          checked={d.showPriorityBadge === true}
          onChange={(event) => update({ showPriorityBadge: event.target.checked })}
        />
        &nbsp;Show priority badge
      </label>

      {tips.map((tip, index) => (
        <article className="tpl-quick-tips-editor__tip" key={tip.id}>
          <div className="tpl-quick-tips-editor__row">
            <strong>Tip {index + 1}</strong>
            <button type="button" onClick={() => update({ tips: tips.filter((_, tipIndex) => tipIndex !== index) })}>Remove</button>
          </div>
          <label>
            Title
            <input value={tip.title} onChange={(event) => updateTip(index, { title: event.target.value })} />
          </label>
          <label>
            Detail
            <textarea rows={2} value={tip.detail ?? ''} onChange={(event) => updateTip(index, { detail: event.target.value })} />
          </label>
          <label>
            Icon
            <input value={tip.icon ?? ''} onChange={(event) => updateTip(index, { icon: event.target.value })} />
          </label>
          <label>
            Priority
            <select value={tip.priority ?? 'medium'} onChange={(event) => updateTip(index, { priority: event.target.value as QuickTip['priority'] })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </article>
      ))}

      <button
        type="button"
        className="tpl-quick-tips-editor__add"
        onClick={() => update({ tips: [...tips, { id: `quick-tip-${Date.now()}`, title: '', detail: '', priority: 'medium' }] })}
      >
        Add Tip
      </button>
    </section>
  );
};
