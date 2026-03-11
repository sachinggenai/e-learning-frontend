import React, { useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './PollVote.css';

interface PollOption {
  id: string;
  label: string;
  votes?: number;
}

interface PollVoteData {
  title?: string;
  question?: string;
  options?: PollOption[];
  allowMultiple?: boolean;
  totalVotes?: number;
}

function normalizeOptions(raw: PollVoteData['options']): PollOption[] {
  return (raw ?? []).map((o, i) => ({
    id: o.id || `opt-${i + 1}`,
    label: o.label || '',
    votes: Math.max(0, Number(o.votes) || 0),
  }));
}

export const PollVotePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as PollVoteData;
  const title = d.title || 'Poll';
  const question = d.question || '';
  const allowMultiple = d.allowMultiple ?? false;
  const options = normalizeOptions(d.options);
  const seedVotes = options.reduce((sum, o) => sum + (o.votes ?? 0), 0);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [resultsOptions, setResultsOptions] = useState<PollOption[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (allowMultiple) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
    onInteraction?.({
      componentId,
      interactionType: 'poll_option_selected',
      interactionId: id,
      value: { selected: id },
      completed: false,
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0 || submitted) return;
    const newOptions = options.map((o) => ({
      ...o,
      votes: (o.votes ?? 0) + (selected.has(o.id) ? 1 : 0),
    }));
    const newTotal = seedVotes + 1;
    setResultsOptions(newOptions);
    setTotalVotes(newTotal);
    setSubmitted(true);
    onInteraction?.({
      componentId,
      interactionType: 'poll_submitted',
        value: { selectedIds: Array.from(selected) },
      completed: true,
    });
    onComplete?.(componentId);
  };

  if (submitted) {
    return (
      <section className="tpl-poll">
        <h3 className="tpl-poll__title">{title}</h3>
        {question && <p className="tpl-poll__question">{question}</p>}
        <ul className="tpl-poll__options tpl-poll__options--results">
          {resultsOptions.map((o) => {
            const pct = totalVotes > 0 ? Math.round(((o.votes ?? 0) / totalVotes) * 100) : 0;
            return (
              <li key={o.id} className="tpl-poll__result">
                <span className="tpl-poll__result-label">{o.label}</span>
                <div className="tpl-poll__bar-wrap">
                  <div className="tpl-poll__bar" style={{ width: `${pct}%` }} />
                </div>
                <span className="tpl-poll__pct">{pct}%</span>
              </li>
            );
          })}
        </ul>
        <p className="tpl-poll__meta">
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </p>
      </section>
    );
  }

  return (
    <section className="tpl-poll">
      <h3 className="tpl-poll__title">{title}</h3>
      {question && <p className="tpl-poll__question">{question}</p>}
      <fieldset className="tpl-poll__options">
        <legend className="sr-only">Poll options</legend>
        {options.map((o) => (
          <label key={o.id} className="tpl-poll__option">
            <input
              type={allowMultiple ? 'checkbox' : 'radio'}
              name={`poll-${componentId}`}
              checked={selected.has(o.id)}
              onChange={() => handleSelect(o.id)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        className="tpl-poll__submit"
        disabled={selected.size === 0}
        onClick={handleSubmit}
      >
        Vote
      </button>
    </section>
  );
};

export const PollVoteEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as PollVoteData;
  const options = normalizeOptions(d.options);
  const update = (patch: Partial<PollVoteData>) => onChange({ data: { ...d, ...patch } });

  const updateOption = (index: number, patch: Partial<PollOption>) => {
    const next = [...options];
    next[index] = { ...next[index], ...patch };
    update({ options: next });
  };

  return (
    <section className="tpl-poll-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Question
        <input value={d.question ?? ''} onChange={(e) => update({ question: e.target.value })} />
      </label>
      <label className="tpl-poll-editor__checkbox">
        <input
          type="checkbox"
          checked={d.allowMultiple ?? false}
          onChange={(e) => update({ allowMultiple: e.target.checked })}
        />
        Allow multiple selections
      </label>
      <fieldset>
        <legend>Options</legend>
        {options.map((o, i) => (
          <div key={o.id} className="tpl-poll-editor__row">
            <input
              value={o.label}
              placeholder="Option label"
              onChange={(e) => updateOption(i, { label: e.target.value })}
            />
            <button
              type="button"
              onClick={() => update({ options: options.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update({
              options: [...options, { id: `opt-${Date.now()}`, label: '', votes: 0 }],
            })
          }
        >
          Add Option
        </button>
      </fieldset>
    </section>
  );
};
