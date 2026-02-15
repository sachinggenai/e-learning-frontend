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
      <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
        No scenario nodes configured.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {data?.title && <h3 style={{ marginBottom: 16 }}>{data.title}</h3>}

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {path.map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: i === path.length - 1 ? '#3b82f6' : '#93c5fd',
            }}
          />
        ))}
      </div>

      {/* Node card */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {currentNode.imageUrl && (
          <img
            src={currentNode.imageUrl}
            alt=""
            style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
          />
        )}
        <h4 style={{ margin: '0 0 8px', fontSize: 18 }}>{currentNode.title}</h4>
        <p style={{ margin: '0 0 20px', color: '#475569', lineHeight: 1.6 }}>
          {currentNode.narrative}
        </p>

        {feedback && (
          <div
            style={{
              padding: '10px 14px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
              color: '#0369a1',
            }}
          >
            {feedback}
          </div>
        )}

        {currentNode.isEnd ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#22c55e', marginBottom: 8 }}>
              {currentNode.endMessage || 'Scenario Complete!'}
            </p>
            {data?.showScore && (
              <p style={{ fontSize: 14, color: '#475569' }}>Score: {totalPoints} points</p>
            )}
            <button
              onClick={handleRestart}
              style={{
                marginTop: 12,
                padding: '10px 24px',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentNode.choices.map((c) => (
              <button
                key={c.id}
                onClick={() => handleChoice(c)}
                disabled={!!feedback}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: 8,
                  background: '#fafafa',
                  textAlign: 'left',
                  fontSize: 14,
                  cursor: feedback ? 'not-allowed' : 'pointer',
                  opacity: feedback ? 0.6 : 1,
                  transition: 'border-color 0.2s',
                }}
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
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>{label}</label>
      {multi ? (
        <textarea
          value={value}
          onChange={(e) => cb(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            fontSize: 13,
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => cb(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            fontSize: 13,
          }}
        />
      )}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
          Scenario Title
        </label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Branching Scenario"
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            fontSize: 13,
          }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12 }}>
          <input
            type="checkbox"
            checked={data?.showScore ?? false}
            onChange={(e) => onChange({ data: { ...data, showScore: e.target.checked } })}
            style={{ marginRight: 6 }}
          />
          Show score at end
        </label>
      </div>

      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            marginBottom: 10,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: expandedNode === node.id ? '#f0f9ff' : '#f9fafb',
              cursor: 'pointer',
            }}
            onClick={() =>
              setExpandedNode((prev) => (prev === node.id ? null : node.id))
            }
          >
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              {node.title || 'Untitled Node'}
              {node.isEnd ? ' 🏁' : ''}
              {data?.startNodeId === node.id ? ' (Start)' : ''}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          {expandedNode === node.id && (
            <div style={{ padding: 14 }}>
              {inp('Title', node.title, (v) => updateNode(node.id, 'title', v))}
              {inp('Narrative', node.narrative, (v) => updateNode(node.id, 'narrative', v), true)}
              {inp('Image URL', node.imageUrl ?? '', (v) =>
                updateNode(node.id, 'imageUrl', v),
              )}
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={node.isEnd ?? false}
                    onChange={(e) => updateNode(node.id, 'isEnd', e.target.checked)}
                    style={{ marginRight: 6 }}
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
                  <h5 style={{ margin: '12px 0 8px', fontSize: 13 }}>Choices</h5>
                  {node.choices.map((c, ci) => (
                    <div
                      key={c.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        padding: 10,
                        marginBottom: 8,
                        background: '#fefce8',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 500 }}>
                          Choice {ci + 1}
                        </span>
                        <button
                          onClick={() => removeChoice(node.id, ci)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                      {inp('Text', c.text, (v) =>
                        updateChoice(node.id, ci, 'text', v),
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>
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
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: '1px solid #e2e8f0',
                              borderRadius: 4,
                              fontSize: 13,
                            }}
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
                        <div style={{ width: 80 }}>
                          <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>
                            Points
                          </label>
                          <input
                            type="number"
                            value={c.points ?? 0}
                            onChange={(e) =>
                              updateChoice(node.id, ci, 'points', Number(e.target.value))
                            }
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: '1px solid #e2e8f0',
                              borderRadius: 4,
                              fontSize: 13,
                            }}
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
                    style={{
                      padding: '6px 12px',
                      border: '1px dashed #cbd5e1',
                      borderRadius: 4,
                      background: 'transparent',
                      color: '#3b82f6',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
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
        style={{
          width: '100%',
          padding: 10,
          border: '2px dashed #cbd5e1',
          borderRadius: 6,
          background: 'transparent',
          color: '#3b82f6',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        + Add Node
      </button>
    </div>
  );
};
