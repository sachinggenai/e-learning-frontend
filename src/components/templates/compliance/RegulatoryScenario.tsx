import React, { useMemo, useState } from 'react';
import { Gavel } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './RegulatoryScenario.css';

export interface RegulatoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface RegulatoryScenarioData {
  title?: string;
  scenarioText?: string;
  choices?: RegulatoryChoice[];
  explanation?: string;
  maxAttempts?: number;
  requireCorrectToComplete?: boolean;
  selectionMode?: 'single' | 'multiple';
}

export const RegulatoryScenarioPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as RegulatoryScenarioData;
  const choices = d.choices ?? [];
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState<boolean | null>(null);

  const maxAttempts = d.maxAttempts ?? 2;
  const selectionMode = d.selectionMode ?? 'single';
  const canRetry = attempts < maxAttempts;

  const correctIds = useMemo(() => choices.filter((c) => c.isCorrect).map((c) => c.id).sort(), [choices]);

  const isCorrect = useMemo(() => {
    if (selected.length === 0) {
      return false;
    }
    return [...selected].sort().join('|') === correctIds.join('|');
  }, [correctIds, selected]);

  const toggleChoice = (id: string) => {
    if (selectionMode === 'single') {
      setSelected([id]);
      return;
    }
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setLastResult(isCorrect);

    onInteraction?.({
      componentId,
      interactionType: 'scenario_answered',
      interactionId: `attempt-${nextAttempts}`,
      value: { selected, isCorrect },
      completed: false,
    });

    const completed = isCorrect || d.requireCorrectToComplete !== true || nextAttempts >= maxAttempts;
    if (completed) {
      onInteraction?.({
        componentId,
        interactionType: 'scenario_completed',
        interactionId: 'complete',
        value: { attempts: nextAttempts, passed: isCorrect },
        completed: true,
      });
      onComplete?.(componentId);
    }
  };

  return (
    <article className="tpl-regulatory-scenario">
      <h2 className="tpl-regulatory-scenario__title"><Gavel size={20} /> {d.title?.trim() || 'Regulatory Scenario'}</h2>
      <p className="tpl-regulatory-scenario__prompt">{d.scenarioText?.trim() || 'Scenario text is not configured yet.'}</p>

      <ul className="tpl-regulatory-scenario__choices">
        {choices.map((choice) => (
          <li key={choice.id}>
            <label>
              <input
                type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                name="regulatory-choice"
                checked={selected.includes(choice.id)}
                onChange={() => toggleChoice(choice.id)}
              />
              {choice.text}
            </label>
          </li>
        ))}
      </ul>

      <div className="tpl-regulatory-scenario__actions">
        <button type="button" onClick={submit} disabled={selected.length === 0}>Submit Answer</button>
        {lastResult === false && canRetry && (
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              onInteraction?.({ componentId, interactionType: 'scenario_retry', interactionId: `retry-${attempts}`, completed: false });
            }}
          >
            Retry
          </button>
        )}
      </div>

      <p className="tpl-regulatory-scenario__attempts">Attempts: {attempts}/{maxAttempts}</p>
      {lastResult !== null && (
        <div className={`tpl-regulatory-scenario__feedback tpl-regulatory-scenario__feedback--${lastResult ? 'correct' : 'incorrect'}`}>
          <p>{lastResult ? 'Correct decision.' : 'That choice is not compliant.'}</p>
          {d.explanation && <p>{d.explanation}</p>}
          {lastResult === false && selected.map((choiceId) => {
            const choice = choices.find((c) => c.id === choiceId);
            return choice?.feedback ? <p key={choiceId}>{choice.feedback}</p> : null;
          })}
        </div>
      )}
    </article>
  );
};

export const RegulatoryScenarioEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as RegulatoryScenarioData;
  const choices = d.choices ?? [];
  const update = (patch: Partial<RegulatoryScenarioData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-regulatory-scenario-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Scenario Text<textarea rows={4} value={d.scenarioText ?? ''} onChange={(e) => update({ scenarioText: e.target.value })} /></label>
      <label>Explanation<textarea rows={3} value={d.explanation ?? ''} onChange={(e) => update({ explanation: e.target.value })} /></label>
      <label>
        Selection Mode
        <select value={d.selectionMode ?? 'single'} onChange={(e) => update({ selectionMode: e.target.value as RegulatoryScenarioData['selectionMode'] })}>
          <option value="single">Single choice</option>
          <option value="multiple">Multiple choice</option>
        </select>
      </label>
      <label>Max Attempts<input type="number" min={1} value={d.maxAttempts ?? 2} onChange={(e) => update({ maxAttempts: Number(e.target.value) })} /></label>
      <label><input type="checkbox" checked={d.requireCorrectToComplete === true} onChange={(e) => update({ requireCorrectToComplete: e.target.checked })} /> Require correct answer to complete</label>

      <div className="tpl-regulatory-scenario-editor__head">
        <h3>Choices</h3>
        <button type="button" onClick={() => update({ choices: [...choices, { id: `c-${Date.now()}`, text: '', isCorrect: false }] })}>+ Add Choice</button>
      </div>
      {choices.map((choice) => (
        <div key={choice.id} className="tpl-regulatory-scenario-editor__row">
          <input value={choice.text} placeholder="Choice text" onChange={(e) => update({ choices: choices.map((x) => x.id === choice.id ? { ...x, text: e.target.value } : x) })} />
          <input value={choice.feedback ?? ''} placeholder="Feedback" onChange={(e) => update({ choices: choices.map((x) => x.id === choice.id ? { ...x, feedback: e.target.value } : x) })} />
          <label><input type="checkbox" checked={choice.isCorrect} onChange={(e) => update({ choices: choices.map((x) => x.id === choice.id ? { ...x, isCorrect: e.target.checked } : x) })} /> Correct</label>
          <button type="button" onClick={() => update({ choices: choices.filter((x) => x.id !== choice.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
