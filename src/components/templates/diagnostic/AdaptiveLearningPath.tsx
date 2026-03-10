import React from 'react';
import { Map, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './AdaptiveLearningPath.css';

export interface PathNode {
  id: string;
  title: string;
  moduleId?: string;
  required: boolean;
  estimatedMins?: number;
  prerequisites?: string[];
}

export interface AdaptiveLearningPathData {
  title?: string;
  nodes?: PathNode[];
  currentNodeId?: string;
}

export const AdaptiveLearningPathPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
}) => {
  const d = data as AdaptiveLearningPathData;
  const title = d.title?.trim() || 'Adaptive Learning Path';
  const nodes = d.nodes ?? [];
  const currentNodeId = d.currentNodeId;

  const completedIds = new Set<string>();
  let passedCurrent = false;
  for (const node of nodes) {
    if (node.id === currentNodeId) { passedCurrent = true; }
    if (!passedCurrent) completedIds.add(node.id);
  }

  const handleNodeClick = (node: PathNode) => {
    const isLocked = (node.prerequisites ?? []).some((pid) => !completedIds.has(pid));
    if (isLocked) return;

    onInteraction?.({
      componentId,
      interactionType: 'path_node_opened',
      interactionId: node.id,
      value: node.moduleId ?? node.id,
      completed: false,
    });
  };

  return (
    <article className="tpl-adaptive-path">
      <header className="tpl-adaptive-path__header">
        <h2 className="tpl-adaptive-path__title">
          <Map size={20} className="tpl-adaptive-path__title-icon" />
          {title}
        </h2>
      </header>

      {nodes.length === 0 ? (
        <p className="tpl-adaptive-path__empty">No path nodes configured yet.</p>
      ) : (
        <ol className="tpl-adaptive-path__nodes">
          {nodes.map((node, idx) => {
            const isCompleted = completedIds.has(node.id);
            const isCurrent = node.id === currentNodeId;
            const isLocked = (node.prerequisites ?? []).some((pid) => !completedIds.has(pid));
            const isLast = idx === nodes.length - 1;

            return (
              <li
                key={node.id}
                className={[
                  'tpl-adaptive-path__node',
                  isCompleted ? 'tpl-adaptive-path__node--completed' : '',
                  isCurrent ? 'tpl-adaptive-path__node--current' : '',
                  isLocked ? 'tpl-adaptive-path__node--locked' : '',
                ].join(' ').trim()}
              >
                <div className="tpl-adaptive-path__node-icon">
                  {isCompleted
                    ? <CheckCircle2 size={20} />
                    : isLocked
                    ? <Lock size={20} />
                    : <span className="tpl-adaptive-path__node-num">{idx + 1}</span>}
                </div>

                <div className="tpl-adaptive-path__node-content">
                  <h3 className="tpl-adaptive-path__node-title">{node.title}</h3>
                  <div className="tpl-adaptive-path__node-meta">
                    {node.required && (
                      <span className="tpl-adaptive-path__badge tpl-adaptive-path__badge--required">Required</span>
                    )}
                    {!node.required && (
                      <span className="tpl-adaptive-path__badge tpl-adaptive-path__badge--optional">Optional</span>
                    )}
                    {node.estimatedMins && (
                      <span className="tpl-adaptive-path__badge tpl-adaptive-path__badge--time">
                        ~{node.estimatedMins} min
                      </span>
                    )}
                  </div>
                </div>

                {!isLocked && !isLast && (
                  <button
                    type="button"
                    className="tpl-adaptive-path__open-btn"
                    onClick={() => handleNodeClick(node)}
                    aria-label={`Open ${node.title}`}
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
};

export const AdaptiveLearningPathEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as AdaptiveLearningPathData;

  const update = (patch: Partial<AdaptiveLearningPathData>) =>
    onChange({ data: { ...d, ...patch } });

  const nodes = d.nodes ?? [];

  const addNode = () => {
    const newNode: PathNode = {
      id: `node-${Date.now()}`,
      title: '',
      required: true,
      estimatedMins: 15,
    };
    update({ nodes: [...nodes, newNode] });
  };

  const removeNode = (id: string) =>
    update({ nodes: nodes.filter((n) => n.id !== id) });

  const updateNode = (id: string, patch: Partial<PathNode>) =>
    update({ nodes: nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) });

  return (
    <section className="tpl-adaptive-path-editor">
      <div className="tpl-adaptive-path-editor__field">
        <label className="tpl-adaptive-path-editor__label" htmlFor="alp-title">Title</label>
        <input
          id="alp-title"
          className="tpl-adaptive-path-editor__input"
          type="text"
          value={d.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Adaptive Learning Path"
        />
      </div>

      <div className="tpl-adaptive-path-editor__nodes">
        <h3 className="tpl-adaptive-path-editor__section-title">Path Nodes ({nodes.length})</h3>
        {nodes.map((node, idx) => (
          <div key={node.id} className="tpl-adaptive-path-editor__node-block">
            <div className="tpl-adaptive-path-editor__node-head">
              <span className="tpl-adaptive-path-editor__node-num">Node {idx + 1}</span>
              <button
                type="button"
                className="tpl-adaptive-path-editor__remove-btn"
                onClick={() => removeNode(node.id)}
                aria-label="Remove node"
              >
                Remove
              </button>
            </div>
            <div className="tpl-adaptive-path-editor__field">
              <label className="tpl-adaptive-path-editor__label" htmlFor={`alp-node-title-${node.id}`}>
                Node Title
              </label>
              <input
                id={`alp-node-title-${node.id}`}
                className="tpl-adaptive-path-editor__input"
                type="text"
                value={node.title}
                onChange={(e) => updateNode(node.id, { title: e.target.value })}
                placeholder="Module or step title"
              />
            </div>
            <div className="tpl-adaptive-path-editor__node-row">
              <div className="tpl-adaptive-path-editor__field">
                <label className="tpl-adaptive-path-editor__label" htmlFor={`alp-mins-${node.id}`}>Est. Minutes</label>
                <input
                  id={`alp-mins-${node.id}`}
                  className="tpl-adaptive-path-editor__input tpl-adaptive-path-editor__input--short"
                  type="number"
                  min={1}
                  value={node.estimatedMins ?? ''}
                  onChange={(e) => updateNode(node.id, { estimatedMins: Number(e.target.value) || undefined })}
                />
              </div>
              <label className="tpl-adaptive-path-editor__checkbox-label">
                <input
                  type="checkbox"
                  checked={node.required}
                  onChange={(e) => updateNode(node.id, { required: e.target.checked })}
                />
                Required
              </label>
            </div>
          </div>
        ))}
        <button type="button" className="tpl-adaptive-path-editor__add-btn" onClick={addNode}>
          + Add Node
        </button>
      </div>
    </section>
  );
};
