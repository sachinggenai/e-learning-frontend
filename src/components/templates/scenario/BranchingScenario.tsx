/**
 * BranchingScenario — Multi-path scenario with decision trees.
 *
 * Preview: Shows current node and choices; navigates tree based on user picks.
 * Editor: Add/remove nodes, each with choices pointing to another node.
 *
 * Category: scenario
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './BranchingScenario.css';

interface ScenarioChoice {
  id: string;
  text: string;
  nextNodeId: string | null; // null = end
  points?: number;
  feedback?: string;
}

interface ScenarioNode {
  id: string;
  title: string;
  narrative: string;
  imageUrl?: string;
  choices: ScenarioChoice[];
  isEnd?: boolean;
  endMessage?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const BranchingScenarioPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const nodes: ScenarioNode[] = data?.nodes ?? [];
  const startId = data?.startNodeId ?? nodes[0]?.id ?? '';
  const [currentNodeId, setCurrentNodeId] = useState<string>(startId);
  const [path, setPath] = useState<string[]>([startId]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  const handleChoice = useCallback(
    (choice: ScenarioChoice) => {
      setFeedback(choice.feedback ?? null);
      setTotalPoints((p) => p + (choice.points ?? 0));

      onInteraction?.({
        interactionType: 'scenario-choice',
        componentId: '',
        interactionId: choice.id,
        value: choice.text,
      });

      setTimeout(() => {
        setFeedback(null);
        if (choice.nextNodeId) {
          setCurrentNodeId(choice.nextNodeId);
          setPath((prev) => [...prev, choice.nextNodeId!]);
        } else {
          // Reached an end node
          onComplete?.('');
        }
      }, choice.feedback ? 2000 : 400);
    },
    [onInteraction, onComplete],
  );

  const handleRestart = () => {
    setCurrentNodeId(startId);
    setPath([startId]);
    setTotalPoints(0);
    setFeedback(null);
  };

  if (!currentNode) {
    return (
      <div className="tpl-branching-scenario__empty">
        No scenario nodes configured.
      </div>
    );
  }

  return (
    <div className="tpl-branching-scenario" data-testid="branching-scenario-preview">
      {data?.title && <h3 className="tpl-branching-scenario__main-title">{data.title}</h3>}

      <div className="tpl-branching-scenario__progress" data-testid="branching-scenario-progress">
        {path.map((_, i) => (
          <span
            key={i}
            className={`tpl-branching-scenario__progress-dot ${
              i === path.length - 1 ? 'tpl-branching-scenario__progress-dot--active' : ''
            }`}
          />
        ))}
      </div>

      <div className="tpl-branching-scenario__node" data-testid="branching-scenario-node">
        {currentNode.imageUrl && (
          <img
            src={currentNode.imageUrl}
            alt=""
            className="tpl-branching-scenario__image"
          />
        )}
        <h4 className="tpl-branching-scenario__node-title">{currentNode.title}</h4>
        <p className="tpl-branching-scenario__narrative">
          {currentNode.narrative}
        </p>

        {feedback && (
          <div className="tpl-branching-scenario__feedback" data-testid="branching-scenario-feedback">
            {feedback}
          </div>
        )}

        {currentNode.isEnd ? (
          <div className="tpl-branching-scenario__end">
            <p className="tpl-branching-scenario__end-message">
              {currentNode.endMessage || 'Scenario Complete!'}
            </p>
            {data?.showScore && (
              <p className="tpl-branching-scenario__score">Score: {totalPoints} points</p>
            )}
            <button
              onClick={handleRestart}
              className="tpl-branching-scenario__button tpl-branching-scenario__button--primary tpl-branching-scenario__button--restart"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="tpl-branching-scenario__choices">
            {currentNode.choices.map((c) => (
              <button
                key={c.id}
                onClick={() => handleChoice(c)}
                disabled={!!feedback}
                className={`tpl-branching-scenario__choice ${
                  feedback ? 'tpl-branching-scenario__choice--disabled' : ''
                }`}
              >
                {c.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const BranchingScenarioEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const nodes: ScenarioNode[] = data?.nodes ?? [];
  const [expandedNode, setExpandedNode] = useState<string | null>(nodes[0]?.id ?? null);

  const updateNode = (nodeId: string, field: string, value: any) => {
    const updated = nodes.map((n) => (n.id === nodeId ? { ...n, [field]: value } : n));
    onChange({ data: { ...data, nodes: updated } });
  };

  const updateChoice = (
    nodeId: string,
    choiceIdx: number,
    field: keyof ScenarioChoice,
    value: any,
  ) => {
    const updated = nodes.map((n) => {
      if (n.id !== nodeId) return n;
      const choices = [...n.choices];
      choices[choiceIdx] = { ...choices[choiceIdx], [field]: value };
      return { ...n, choices };
    });
    onChange({ data: { ...data, nodes: updated } });
  };

  const addNode = () => {
    const id = `node-${Date.now()}`;
    onChange({
      data: {
        ...data,
        nodes: [
          ...nodes,
          {
            id,
            title: `Node ${nodes.length + 1}`,
            narrative: '',
            choices: [],
            isEnd: false,
          },
        ],
        startNodeId: data?.startNodeId || id,
      },
    });
    setExpandedNode(id);
  };

  const removeNode = (nodeId: string) => {
    onChange({ data: { ...data, nodes: nodes.filter((n) => n.id !== nodeId) } });
  };

  const addChoice = (nodeId: string) => {
    const updated = nodes.map((n) => {
      if (n.id !== nodeId) return n;
      return {
        ...n,
        choices: [
          ...n.choices,
          { id: `ch-${Date.now()}`, text: '', nextNodeId: null, points: 0 },
        ],
      };
    });
    onChange({ data: { ...data, nodes: updated } });
  };

  const removeChoice = (nodeId: string, idx: number) => {
    const updated = nodes.map((n) => {
      if (n.id !== nodeId) return n;
      return { ...n, choices: n.choices.filter((_, i) => i !== idx) };
    });
    onChange({ data: { ...data, nodes: updated } });
  };

  const inp = (label: string, value: string, cb: (v: string) => void, multi = false) => (
    <div className="tpl-branching-scenario__field">
      <label className="tpl-branching-scenario__label">{label}</label>
      {multi ? (
        <textarea
          value={value}
          onChange={(e) => cb(e.target.value)}
          rows={3}
          className="tpl-branching-scenario__textarea"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => cb(e.target.value)}
          className="tpl-branching-scenario__input"
        />
      )}
    </div>
  );

  return (
    <div className="tpl-branching-scenario-editor" data-testid="branching-scenario-editor">
      <div className="tpl-branching-scenario-editor__section">
        <label className="tpl-branching-scenario-editor__label">
          Scenario Title
        </label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Branching Scenario"
          className="tpl-branching-scenario-editor__input"
        />
      </div>

      <div className="tpl-branching-scenario-editor__section">
        <label className="tpl-branching-scenario-editor__checkbox-label">
          <input
            type="checkbox"
            checked={data?.showScore ?? false}
            onChange={(e) => onChange({ data: { ...data, showScore: e.target.checked } })}
            className="tpl-branching-scenario-editor__checkbox"
          />
          Show score at end
        </label>
      </div>

      {nodes.map((node) => (
        <div
          key={node.id}
          className="tpl-branching-scenario-editor__node"
        >
          <div
            className={`tpl-branching-scenario-editor__node-header ${
              expandedNode === node.id ? 'tpl-branching-scenario-editor__node-header--expanded' : ''
            }`}
            onClick={() =>
              setExpandedNode((prev) => (prev === node.id ? null : node.id))
            }
          >
            <span className="tpl-branching-scenario-editor__node-title">
              {node.title || 'Untitled Node'}
              {node.isEnd ? ' 🏁' : ''}
              {data?.startNodeId === node.id ? ' (Start)' : ''}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.id);
              }}
              className="tpl-branching-scenario-editor__remove"
            >
              ×
            </button>
          </div>

          {expandedNode === node.id && (
            <div className="tpl-branching-scenario-editor__node-body">
              {inp('Title', node.title, (v) => updateNode(node.id, 'title', v))}
              {inp('Narrative', node.narrative, (v) => updateNode(node.id, 'narrative', v), true)}
              {inp('Image URL', node.imageUrl ?? '', (v) =>
                updateNode(node.id, 'imageUrl', v),
              )}
              <div className="tpl-branching-scenario-editor__field">
                <label className="tpl-branching-scenario-editor__checkbox-label">
                  <input
                    type="checkbox"
                    checked={node.isEnd ?? false}
                    onChange={(e) => updateNode(node.id, 'isEnd', e.target.checked)}
                    className="tpl-branching-scenario-editor__checkbox"
                  />
                  End Node
                </label>
              </div>
              {node.isEnd &&
                inp('End Message', node.endMessage ?? '', (v) =>
                  updateNode(node.id, 'endMessage', v),
                )}

              {!node.isEnd && (
                <>
                  <h5 className="tpl-branching-scenario-editor__choices-title">Choices</h5>
                  {node.choices.map((c, ci) => (
                    <div
                      key={c.id}
                      className="tpl-branching-scenario-editor__choice"
                    >
                      <div className="tpl-branching-scenario-editor__choice-header">
                        <span className="tpl-branching-scenario-editor__choice-title">
                          Choice {ci + 1}
                        </span>
                        <button
                          onClick={() => removeChoice(node.id, ci)}
                          className="tpl-branching-scenario-editor__remove"
                        >
                          ×
                        </button>
                      </div>
                      {inp('Text', c.text, (v) =>
                        updateChoice(node.id, ci, 'text', v),
                      )}
                      <div className="tpl-branching-scenario-editor__choice-row">
                        <div className="tpl-branching-scenario-editor__choice-col-main">
                          <label className="tpl-branching-scenario__label">
                            Next Node
                          </label>
                          <select
                            value={c.nextNodeId ?? ''}
                            onChange={(e) =>
                              updateChoice(
                                node.id,
                                ci,
                                'nextNodeId',
                                e.target.value || null,
                              )
                            }
                            className="tpl-branching-scenario__select"
                          >
                            <option value="">End (no next node)</option>
                            {nodes
                              .filter((n) => n.id !== node.id)
                              .map((n) => (
                                <option key={n.id} value={n.id}>
                                  {n.title || n.id}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="tpl-branching-scenario-editor__choice-col-points">
                          <label className="tpl-branching-scenario__label">
                            Points
                          </label>
                          <input
                            type="number"
                            value={c.points ?? 0}
                            onChange={(e) =>
                              updateChoice(node.id, ci, 'points', Number(e.target.value))
                            }
                            className="tpl-branching-scenario__input"
                          />
                        </div>
                      </div>
                      {inp('Feedback (optional)', c.feedback ?? '', (v) =>
                        updateChoice(node.id, ci, 'feedback', v),
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addChoice(node.id)}
                    className="tpl-branching-scenario-editor__button tpl-branching-scenario-editor__button--add-choice"
                  >
                    + Add Choice
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addNode}
        className="tpl-branching-scenario-editor__button tpl-branching-scenario-editor__button--add-node"
      >
        + Add Node
      </button>
    </div>
  );
};
