/**
 * Matching Component — Assessment
 * Learner matches items from two columns.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

// ─── Preview ─────────────────────────────────────────────────────
export const MatchingPreview: React.FC<ComponentPreviewProps> = ({
  componentId, data, onInteraction, onComplete,
}) => {
  const pairs: MatchPair[] = data.pairs || [];
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Shuffle right side once when pairs change
  const shuffledRight = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5),
    [pairs]
  );

  const handleLeftClick = useCallback((leftId: string) => {
    if (submitted) return;
    setSelectedLeft(leftId);
  }, [submitted]);

  const handleRightClick = useCallback((rightId: string) => {
    if (submitted || !selectedLeft) return;
    setSelections((prev) => ({ ...prev, [selectedLeft]: rightId }));
    setSelectedLeft(null);
  }, [submitted, selectedLeft]);

  const results = useMemo(() => {
    if (!submitted) return {};
    const r: Record<string, boolean> = {};
    pairs.forEach((pair) => { r[pair.id] = selections[pair.id] === pair.id; });
    return r;
  }, [submitted, pairs, selections]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const correctCount = pairs.filter((p) => selections[p.id] === p.id).length;
    onInteraction?.({
      componentId, interactionType: 'submit', value: selections,
      score: correctCount, maxScore: pairs.length,
      isCorrect: correctCount === pairs.length, completed: true,
    });
    onComplete?.(componentId);
  }, [pairs, selections, componentId, onInteraction, onComplete]);

  return (
    <div className="matching-component">
      <h3>{data.title || 'Match the items'}</h3>
      <div className="matching__columns">
        <div className="matching__left">
          {pairs.map((pair) => (
            <button
              key={pair.id}
              className={`matching__item ${selectedLeft === pair.id ? 'matching__item--selected' : ''} ${submitted ? (results[pair.id] ? 'matching__item--correct' : 'matching__item--incorrect') : ''}`}
              onClick={() => handleLeftClick(pair.id)}
              disabled={submitted}
            >
              {pair.left}
              {selections[pair.id] && !submitted && <span className="matching__linked">→</span>}
            </button>
          ))}
        </div>
        <div className="matching__right">
          {shuffledRight.map((pair) => (
            <button
              key={pair.id}
              className={`matching__item ${Object.values(selections).includes(pair.id) ? 'matching__item--matched' : ''}`}
              onClick={() => handleRightClick(pair.id)}
              disabled={submitted}
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>
      {!submitted && (
        <button className="btn btn-primary" onClick={handleSubmit} disabled={Object.keys(selections).length < pairs.length}>
          Submit
        </button>
      )}
    </div>
  );
};

// ─── Editor ──────────────────────────────────────────────────────
export const MatchingEditor: React.FC<ComponentEditorProps> = ({ data, onChange, readOnly }) => {
  const pairs: MatchPair[] = data.pairs || [];

  const update = useCallback((key: string, value: any) => {
    onChange({ data: { ...data, [key]: value } });
  }, [data, onChange]);

  const addPair = useCallback(() => {
    update('pairs', [...pairs, { id: `pair-${Date.now()}`, left: '', right: '' }]);
  }, [pairs, update]);

  const updatePair = useCallback((index: number, field: 'left' | 'right', value: string) => {
    const newPairs = pairs.map((p, i) => i === index ? { ...p, [field]: value } : p);
    update('pairs', newPairs);
  }, [pairs, update]);

  const removePair = useCallback((index: number) => {
    if (pairs.length <= 2) return;
    update('pairs', pairs.filter((_, i) => i !== index));
  }, [pairs, update]);

  return (
    <div className="matching-editor">
      <div className="form-group">
        <label htmlFor="match-title">Title</label>
        <input id="match-title" className="form-input" value={data.title || ''} onChange={(e) => update('title', e.target.value)} disabled={readOnly} />
      </div>
      <div className="form-group">
        <label>Match Pairs</label>
        {pairs.map((pair, i) => (
          <div key={pair.id} className="matching-editor__pair-row">
            <input className="form-input" value={pair.left} onChange={(e) => updatePair(i, 'left', e.target.value)} placeholder="Left item..." disabled={readOnly} />
            <span className="matching-editor__arrow">↔</span>
            <input className="form-input" value={pair.right} onChange={(e) => updatePair(i, 'right', e.target.value)} placeholder="Right item..." disabled={readOnly} />
            {pairs.length > 2 && !readOnly && (
              <button className="btn btn-sm btn-danger" onClick={() => removePair(i)}>×</button>
            )}
          </div>
        ))}
        {!readOnly && <button className="btn btn-sm btn-secondary" onClick={addPair}>+ Add Pair</button>}
      </div>
    </div>
  );
};
