/**
 * Flowchart — Visual flowchart diagram for processes and decisions.
 *
 * Preview: Nodes connected by lines showing decision flows.
 * Editor: Add/remove/configure nodes with different shapes based on type.
 *
 * Category: process-flow
 */

import React, { useCallback, useMemo } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './Flowchart.css';

type NodeType = 'start' | 'process' | 'decision' | 'end';

interface FlowchartNode {
  id: string;
  type: NodeType;
  label: string;
}

interface FlowchartConnection {
  from: string;
  to: string;
  label?: string;
}

interface FlowchartData {
  title?: string;
  nodes: FlowchartNode[];
  connections?: FlowchartConnection[];
}

// ─── Preview ──────────────────────────────────────────────────────
export const FlowchartPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  const componentData = (data ?? {}) as FlowchartData;
  const nodes = componentData.nodes ?? [];

  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  if (!nodes || nodes.length === 0) {
    return <div className="tpl-flowchart__empty">No flowchart configured.</div>;
  }

  // Calculate grid layout for nodes
  const getNodePosition = (idx: number) => {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const x = (idx % cols) * 140 + 70;
    const y = Math.floor(idx / cols) * 120 + 60;
    return { x, y };
  };

  const svgWidth = Math.max(300, Math.ceil(Math.sqrt(nodes.length)) * 140);
  const svgHeight = Math.max(200, Math.ceil(nodes.length / Math.ceil(Math.sqrt(nodes.length))) * 120);

  const renderNodeShape = (node: FlowchartNode, pos: { x: number; y: number }) => {
    const { x, y } = pos;
    switch (node.type) {
      case 'start':
      case 'end':
        // Rounded rectangle (terminal)
        return (
          <g key={node.id}>
            <rect
              x={x - 40}
              y={y - 24}
              width="80"
              height="48"
              rx="24"
              className="tpl-flowchart__node tpl-flowchart__node--terminal"
            />
            <text x={x} y={y} className="tpl-flowchart__node-label">
              {node.label}
            </text>
          </g>
        );
      case 'decision':
        // Diamond
        return (
          <g key={node.id}>
            <polygon
              points={`${x},${y - 30} ${x + 45},${y} ${x},${y + 30} ${x - 45},${y}`}
              className="tpl-flowchart__node tpl-flowchart__node--decision"
            />
            <text x={x} y={y} className="tpl-flowchart__node-label">
              {node.label}
            </text>
          </g>
        );
      case 'process':
      default:
        // Rectangle
        return (
          <g key={node.id}>
            <rect
              x={x - 40}
              y={y - 24}
              width="80"
              height="48"
              rx="4"
              className="tpl-flowchart__node tpl-flowchart__node--process"
            />
            <text x={x} y={y} className="tpl-flowchart__node-label">
              {node.label}
            </text>
          </g>
        );
    }
  };

  return (
    <div className="tpl-flowchart">
      {componentData.title && (
        <h3 className="tpl-flowchart__title">{componentData.title}</h3>
      )}

      <div className="tpl-flowchart__canvas">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="tpl-flowchart__svg"
        >
          {/* Draw connections */}
          {(componentData.connections ?? []).map((conn, idx) => {
            const fromIdx = nodes.findIndex((n) => n.id === conn.from);
            const toIdx = nodes.findIndex((n) => n.id === conn.to);
            if (fromIdx < 0 || toIdx < 0) return null;

            const fromPos = getNodePosition(fromIdx);
            const toPos = getNodePosition(toIdx);
            return (
              <line
                key={`conn-${idx}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className="tpl-flowchart__line"
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node, idx) => renderNodeShape(node, getNodePosition(idx)))}
        </svg>
      </div>

      {/* Node legend */}
      <div className="tpl-flowchart__nodes-list">
        {nodes.map((node, idx) => (
          <div key={node.id} className="tpl-flowchart__node-item">
            <span className={`tpl-flowchart__node-type-indicator tpl-flowchart__node-type-indicator--${node.type}`}>
              {idx + 1}
            </span>
            <div>
              <div className="tpl-flowchart__node-name">{node.label}</div>
              <div className="tpl-flowchart__node-type">{node.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const FlowchartEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const componentData = (data ?? {}) as FlowchartData;
  const nodes = componentData.nodes ?? [];

  const updateNode = useCallback(
    (idx: number, field: keyof FlowchartNode, value: string) => {
      const updated = [...nodes];
      updated[idx] = { ...updated[idx], [field]: value };
      onChange({ data: { ...componentData, nodes: updated } });
    },
    [nodes, componentData, onChange]
  );

  const addNode = useCallback(() => {
    onChange({
      data: {
        ...componentData,
        nodes: [
          ...nodes,
          { id: `node-${Date.now()}`, type: 'process', label: '' },
        ],
      },
    });
  }, [nodes, componentData, onChange]);

  const removeNode = useCallback(
    (idx: number) => {
      const nodeToRemove = nodes[idx];
      onChange({
        data: {
          ...componentData,
          nodes: nodes.filter((_, i) => i !== idx),
          connections: (componentData.connections ?? []).filter(
            (c) => c.from !== nodeToRemove.id && c.to !== nodeToRemove.id
          ),
        },
      });
    },
    [nodes, componentData, onChange]
  );

  return (
    <div className="tpl-flowchart-editor">
      <div className="tpl-flowchart-editor__field">
        <label className="tpl-flowchart-editor__label" htmlFor="fc-title">
          Title
        </label>
        <input
          id="fc-title"
          type="text"
          className="tpl-flowchart-editor__input"
          value={componentData.title ?? ''}
          onChange={(e) =>
            onChange({
              data: { ...componentData, title: e.target.value },
            })
          }
          placeholder="Flowchart"
          disabled={readOnly}
        />
      </div>

      {nodes.map((node, idx) => (
        <div key={node.id} className="tpl-flowchart-editor__node-card">
          <div className="tpl-flowchart-editor__node-header">
            <span className="tpl-flowchart-editor__node-label">Node {idx + 1}</span>
            <button
              onClick={() => removeNode(idx)}
              className="tpl-flowchart-editor__remove-btn"
              aria-label={`Remove node ${idx + 1}`}
              disabled={readOnly}
            >
              ×
            </button>
          </div>
          <div className="tpl-flowchart-editor__field">
            <label
              className="tpl-flowchart-editor__label"
              htmlFor={`fc-type-${idx}`}
            >
              Type
            </label>
            <select
              id={`fc-type-${idx}`}
              className="tpl-flowchart-editor__input"
              value={node.type}
              onChange={(e) => updateNode(idx, 'type', e.target.value)}
              disabled={readOnly}
            >
              <option value="start">Start</option>
              <option value="process">Process</option>
              <option value="decision">Decision</option>
              <option value="end">End</option>
            </select>
          </div>
          <div className="tpl-flowchart-editor__field">
            <label
              className="tpl-flowchart-editor__label"
              htmlFor={`fc-label-${idx}`}
            >
              Label
            </label>
            <input
              id={`fc-label-${idx}`}
              type="text"
              className="tpl-flowchart-editor__input"
              value={node.label}
              onChange={(e) => updateNode(idx, 'label', e.target.value)}
              placeholder="Node label"
              disabled={readOnly}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addNode}
        className="tpl-flowchart-editor__add-btn"
        disabled={readOnly}
      >
        + Add Node
      </button>
    </div>
  );
};
