import React, { useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ScenarioDebate.css';

interface ScenarioDebateData {
  title?: string;
  scenario?: string;
  positionA?: string;
  positionB?: string;
  showOpposing?: boolean;
  minChars?: number;
}

export const ScenarioDebatePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as ScenarioDebateData;
  const title = d.title || 'Scenario Debate';
  const scenario = d.scenario || '';
  const positionA = d.positionA || 'Position A';
  const positionB = d.positionB || 'Position B';
  const showOpposing = d.showOpposing ?? false;
  const minChars = Math.max(0, Number(d.minChars) || 0);

  const [side, setSide] = useState<'A' | 'B' | null>(null);
  const [rationale, setRationale] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showOpp, setShowOpp] = useState(false);

  const canSubmit = side !== null && rationale.trim().length >= minChars;

  const handleSide = (chosen: 'A' | 'B') => {
    setSide(chosen);
    onInteraction?.({
      componentId,
      interactionType: 'scenario_debate_side_selected',
      value: { side: chosen },
      completed: false,
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onInteraction?.({
      componentId,
      interactionType: 'scenario_debate_submitted',
      value: { side, rationale },
      completed: true,
    });
    onComplete?.(componentId);
  };

  if (submitted) {
    return (
      <section className="tpl-scenario-debate">
        <h3>{title}</h3>
        <p className="tpl-scenario-debate__success">
          Your position ({side === 'A' ? positionA : positionB}) has been submitted.
        </p>
        {showOpposing && (
          <div className="tpl-scenario-debate__opposing" role="region" aria-label="Opposing view">
            <h4>Opposing view</h4>
            <p>{side === 'A' ? positionB : positionA}</p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="tpl-scenario-debate">
      <h3>{title}</h3>
      {scenario && <div className="tpl-scenario-debate__scenario">{scenario}</div>}
      <div
        className="tpl-scenario-debate__sides"
        role="group"
        aria-label="Choose a position"
      >
        <button
          type="button"
          className={`tpl-scenario-debate__side${side === 'A' ? ' is-selected' : ''}`}
          onClick={() => handleSide('A')}
          aria-pressed={side === 'A'}
        >
          {positionA}
        </button>
        <button
          type="button"
          className={`tpl-scenario-debate__side${side === 'B' ? ' is-selected' : ''}`}
          onClick={() => handleSide('B')}
          aria-pressed={side === 'B'}
        >
          {positionB}
        </button>
      </div>
      {side !== null && (
        <div className="tpl-scenario-debate__rationale">
          <label htmlFor={`${componentId}-rationale`}>
            Your rationale{minChars > 0 ? ` (min ${minChars} characters)` : ''}
          </label>
          <textarea
            id={`${componentId}-rationale`}
            rows={5}
            value={rationale}
            onChange={(e) => {
              setRationale(e.target.value);
              onInteraction?.({
                componentId,
                interactionType: 'scenario_debate_rationale_changed',
                value: { length: e.target.value.length },
                completed: false,
              });
            }}
          />
          {minChars > 0 && (
            <p className="tpl-scenario-debate__char-count" aria-live="polite">
              {rationale.length} / {minChars} minimum
            </p>
          )}
        </div>
      )}
      {showOpposing && side !== null && !showOpp && (
        <button
          type="button"
          className="tpl-scenario-debate__view-opposing"
          onClick={() => {
            setShowOpp(true);
            onInteraction?.({
              componentId,
              interactionType: 'scenario_debate_rationale_changed',
              value: { viewedOpposing: true },
              completed: false,
            });
          }}
        >
          View opposing argument
        </button>
      )}
      {showOpp && (
        <div className="tpl-scenario-debate__opposing" role="region" aria-label="Opposing view">
          <h4>Opposing view</h4>
          <p>{side === 'A' ? positionB : positionA}</p>
        </div>
      )}
      <button
        type="button"
        className="tpl-scenario-debate__submit"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        Submit Position
      </button>
    </section>
  );
};

export const ScenarioDebateEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as ScenarioDebateData;
  const update = (patch: Partial<ScenarioDebateData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-scenario-debate-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Scenario
        <textarea
          rows={4}
          value={d.scenario ?? ''}
          onChange={(e) => update({ scenario: e.target.value })}
        />
      </label>
      <label>
        Position A
        <input value={d.positionA ?? ''} onChange={(e) => update({ positionA: e.target.value })} />
      </label>
      <label>
        Position B
        <input value={d.positionB ?? ''} onChange={(e) => update({ positionB: e.target.value })} />
      </label>
      <label>
        Minimum characters for rationale
        <input
          type="number"
          min={0}
          value={d.minChars ?? 0}
          onChange={(e) => update({ minChars: Math.max(0, Number(e.target.value)) })}
        />
      </label>
      <label className="tpl-scenario-debate-editor__checkbox">
        <input
          type="checkbox"
          checked={d.showOpposing ?? false}
          onChange={(e) => update({ showOpposing: e.target.checked })}
        />
        Show opposing argument cues
      </label>
    </section>
  );
};
