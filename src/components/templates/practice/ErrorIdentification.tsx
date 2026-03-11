import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ErrorIdentification.css';

interface ErrorToken {
  id: string;
  text: string;
  isError: boolean;
  explanation?: string;
}

interface ErrorIdentificationData {
  title?: string;
  instructions?: string;
  tokens?: ErrorToken[];
  maxSelections?: number;
  showExplanations?: boolean;
}

function normalizeTokens(tokens: ErrorToken[] | undefined): ErrorToken[] {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return [
      { id: 'tok-1', text: 'Always share your password with teammates.', isError: true, explanation: 'Passwords must never be shared.' },
      { id: 'tok-2', text: 'Use a unique passphrase for each account.', isError: false },
      { id: 'tok-3', text: 'Enable multi-factor authentication when possible.', isError: false },
      { id: 'tok-4', text: 'Write your PIN on a sticky note attached to the monitor.', isError: true, explanation: 'PINs should be private and securely managed.' },
    ];
  }

  return tokens.map((t, i) => ({
    id: t.id || `tok-${i + 1}`,
    text: t.text || `Token ${i + 1}`,
    isError: !!t.isError,
    explanation: t.explanation,
  }));
}

export const ErrorIdentificationPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as ErrorIdentificationData;
  const title = d.title || 'Error Identification';
  const instructions = d.instructions || '';
  const tokens = useMemo(() => normalizeTokens(d.tokens), [d.tokens]);
  const maxSelections = Math.max(1, Number(d.maxSelections) || tokens.length);
  const showExplanations = d.showExplanations !== false;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [result, setResult] = useState<{ truePos: number; falsePos: number; missed: number } | null>(null);

  const errorIds = useMemo(() => new Set(tokens.filter((t) => t.isError).map((t) => t.id)), [tokens]);

  const toggleToken = (tokenId: string) => {
    if (submitted) return;

    setSelected((prev) => {
      const next = new Set(prev);
      const alreadySelected = next.has(tokenId);

      if (alreadySelected) {
        next.delete(tokenId);
        onInteraction?.({
          componentId,
          interactionType: 'error_token_deselected',
          interactionId: tokenId,
          value: { selectedCount: next.size },
          completed: false,
        });
        return next;
      }

      if (next.size >= maxSelections) {
        return next;
      }

      next.add(tokenId);
      onInteraction?.({
        componentId,
        interactionType: 'error_token_selected',
        interactionId: tokenId,
        value: { selectedCount: next.size },
        completed: false,
      });
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;

    const selectedArray = Array.from(selected);
    const truePos = selectedArray.filter((id) => errorIds.has(id)).length;
    const falsePos = selectedArray.length - truePos;
    const missed = Array.from(errorIds).filter((id) => !selected.has(id)).length;

    const precision = selectedArray.length === 0 ? 0 : truePos / selectedArray.length;
    const recall = errorIds.size === 0 ? 1 : truePos / errorIds.size;
    const computedScore = Math.round(((precision + recall) / 2) * 100);

    setSubmitted(true);
    setScore(computedScore);
    setResult({ truePos, falsePos, missed });

    onInteraction?.({
      componentId,
      interactionType: 'error_identification_submitted',
      value: { truePos, falsePos, missed, score: computedScore },
      completed: true,
    });

    onInteraction?.({
      componentId,
      interactionType: 'error_identification_completed',
      value: { score: computedScore },
      completed: true,
    });
    onComplete?.(componentId);
  };

  return (
    <section className="tpl-error-id">
      <h3 className="tpl-error-id__title">{title}</h3>
      {instructions && <p className="tpl-error-id__instructions">{instructions}</p>}

      <div className="tpl-error-id__tokens" role="group" aria-label="Selectable tokens">
        {tokens.map((token) => {
          const isSelected = selected.has(token.id);
          return (
            <button
              key={token.id}
              type="button"
              className={`tpl-error-id__token ${isSelected ? 'is-selected' : ''}`}
              onClick={() => toggleToken(token.id)}
              aria-pressed={isSelected}
              disabled={submitted || (!isSelected && selected.size >= maxSelections)}
            >
              {token.text}
            </button>
          );
        })}
      </div>

      <div className="tpl-error-id__actions">
        <p>Selected {selected.size} / {maxSelections}</p>
        <button type="button" onClick={submit} disabled={submitted}>Submit</button>
      </div>

      {submitted && (
        <div className="tpl-error-id__results" role="status">
          <p>Score: {score}%</p>
          <p>Correct picks: {result?.truePos}</p>
          <p>False positives: {result?.falsePos}</p>
          <p>Missed errors: {result?.missed}</p>
        </div>
      )}

      {submitted && showExplanations && (
        <div className="tpl-error-id__explanation">
          <h4>Explanations</h4>
          <ul>
            {tokens.filter((t) => t.isError).map((token) => (
              <li key={token.id}>
                <strong>{token.text}</strong>
                <p>{token.explanation || 'This token is marked as an error.'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export const ErrorIdentificationEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as ErrorIdentificationData;
  const tokens = normalizeTokens(d.tokens);

  const update = (patch: Partial<ErrorIdentificationData>) => onChange({ data: { ...d, ...patch } });

  const updateToken = (idx: number, patch: Partial<ErrorToken>) => {
    const next = [...tokens];
    next[idx] = { ...next[idx], ...patch };
    update({ tokens: next });
  };

  const addToken = () => {
    update({
      tokens: [...tokens, { id: `tok-${tokens.length + 1}`, text: `Token ${tokens.length + 1}`, isError: false, explanation: '' }],
    });
  };

  const removeToken = (idx: number) => {
    update({ tokens: tokens.filter((_, i) => i !== idx) });
  };

  return (
    <section className="tpl-error-id-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label>
        Instructions
        <textarea rows={2} value={d.instructions ?? ''} onChange={(e) => update({ instructions: e.target.value })} />
      </label>
      <label>
        Max selections
        <input
          type="number"
          min={1}
          value={d.maxSelections ?? tokens.length}
          onChange={(e) => update({ maxSelections: Math.max(1, Number(e.target.value)) })}
        />
      </label>
      <label className="tpl-error-id-editor__checkbox">
        <input
          type="checkbox"
          checked={d.showExplanations !== false}
          onChange={(e) => update({ showExplanations: e.target.checked })}
        />
        Show explanations
      </label>

      {tokens.map((token, idx) => (
        <fieldset key={token.id} className="tpl-error-id-editor__token">
          <legend>Token {idx + 1}</legend>
          <label>
            Text
            <input value={token.text} onChange={(e) => updateToken(idx, { text: e.target.value })} />
          </label>
          <label className="tpl-error-id-editor__checkbox">
            <input type="checkbox" checked={token.isError} onChange={(e) => updateToken(idx, { isError: e.target.checked })} />
            Is error
          </label>
          <label>
            Explanation
            <input value={token.explanation ?? ''} onChange={(e) => updateToken(idx, { explanation: e.target.value })} />
          </label>
          <button type="button" onClick={() => removeToken(idx)} disabled={tokens.length <= 1}>Remove token</button>
        </fieldset>
      ))}

      <button type="button" onClick={addToken}>Add Token</button>
    </section>
  );
};
