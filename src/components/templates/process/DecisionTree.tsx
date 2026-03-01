/**
 * Decision Tree — Hierarchical branching decision template.
 *
 * Preview: Tree with questions and branch options.
 * Editor: Configure root question and branching options.
 *
 * Category: process-flow
 */

import React, { useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './DecisionTree.css';

interface DecisionOption {
  id: string;
  label: string;
  nextNodeId?: string;
  outcome?: string;
}

interface DecisionNode {
  id: string;
  question: string;
  options: DecisionOption[];
}

interface DecisionTreeData {
  title?: string;
  rootNode: DecisionNode;
  nodes?: DecisionNode[];
}

// ─── Preview ──────────────────────────────────────────────────────
export const DecisionTreePreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  const componentData = (data ?? {}) as DecisionTreeData;
  const rootNode = componentData.rootNode;

  React.useEffect(() => {
    const timer = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(timer);
  }, [componentId, onComplete]);

  if (!rootNode || !rootNode.question) {
    return <div className="tpl-decision-tree__empty">No decision tree configured.</div>;
  }

  return (
    <div className="tpl-decision-tree">
      {componentData.title && (
        <h3 className="tpl-decision-tree__title">{componentData.title}</h3>
      )}

      <div className="tpl-decision-tree__root-node">
        <div className="tpl-decision-tree__question-card">
          <div className="tpl-decision-tree__question-label">Question</div>
          <div className="tpl-decision-tree__question-text">{rootNode.question}</div>
        </div>
      </div>

      <div className="tpl-decision-tree__branches">
        {(rootNode.options ?? []).map((option, idx) => (
          <div key={option.id} className="tpl-decision-tree__branch-item">
            <div className="tpl-decision-tree__branch-connector" />
            <div className="tpl-decision-tree__option-card">
              <div className="tpl-decision-tree__option-label">Option {idx + 1}</div>
              <div className="tpl-decision-tree__option-text">{option.label}</div>
              {option.outcome && (
                <div className="tpl-decision-tree__outcome">
                  Outcome: {option.outcome}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const DecisionTreeEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const componentData = (data ?? {}) as DecisionTreeData;
  const rootNode = componentData.rootNode ?? { id: 'root', question: '', options: [] };

  const updateRootQuestion = useCallback(
    (question: string) => {
      onChange({
        data: {
          ...componentData,
          rootNode: { ...rootNode, question },
        },
      });
    },
    [componentData, rootNode, onChange]
  );

  const updateOption = useCallback(
    (idx: number, field: keyof DecisionOption, value: string) => {
      const updated = [...(rootNode.options ?? [])];
      updated[idx] = { ...updated[idx], [field]: value };
      onChange({
        data: {
          ...componentData,
          rootNode: { ...rootNode, options: updated },
        },
      });
    },
    [componentData, rootNode, onChange]
  );

  const addOption = useCallback(() => {
    onChange({
      data: {
        ...componentData,
        rootNode: {
          ...rootNode,
          options: [
            ...(rootNode.options ?? []),
            {
              id: `option-${Date.now()}`,
              label: '',
              outcome: '',
            },
          ],
        },
      },
    });
  }, [componentData, rootNode, onChange]);

  const removeOption = useCallback(
    (idx: number) => {
      onChange({
        data: {
          ...componentData,
          rootNode: {
            ...rootNode,
            options: (rootNode.options ?? []).filter((_, i) => i !== idx),
          },
        },
      });
    },
    [componentData, rootNode, onChange]
  );

  return (
    <div className="tpl-decision-tree-editor">
      <div className="tpl-decision-tree-editor__field">
        <label className="tpl-decision-tree-editor__label" htmlFor="dt-title">
          Title
        </label>
        <input
          id="dt-title"
          type="text"
          className="tpl-decision-tree-editor__input"
          value={componentData.title ?? ''}
          onChange={(e) =>
            onChange({
              data: { ...componentData, title: e.target.value },
            })
          }
          placeholder="Decision Tree"
          disabled={readOnly}
        />
      </div>

      <div className="tpl-decision-tree-editor__field">
        <label className="tpl-decision-tree-editor__label" htmlFor="dt-question">
          Root Question
        </label>
        <textarea
          id="dt-question"
          className="tpl-decision-tree-editor__textarea"
          value={rootNode.question}
          onChange={(e) => updateRootQuestion(e.target.value)}
          placeholder="Enter the main decision question"
          disabled={readOnly}
          rows={3}
        />
      </div>

      {(rootNode.options ?? []).map((option, idx) => (
        <div key={option.id} className="tpl-decision-tree-editor__option-card">
          <div className="tpl-decision-tree-editor__option-header">
            <span className="tpl-decision-tree-editor__option-number">Option {idx + 1}</span>
            <button
              onClick={() => removeOption(idx)}
              className="tpl-decision-tree-editor__remove-btn"
              aria-label={`Remove option ${idx + 1}`}
              disabled={readOnly}
            >
              ×
            </button>
          </div>

          <div className="tpl-decision-tree-editor__field">
            <label
              className="tpl-decision-tree-editor__label"
              htmlFor={`dt-option-label-${idx}`}
            >
              Option Label
            </label>
            <input
              id={`dt-option-label-${idx}`}
              type="text"
              className="tpl-decision-tree-editor__input"
              value={option.label}
              onChange={(e) => updateOption(idx, 'label', e.target.value)}
              placeholder="Decision option"
              disabled={readOnly}
            />
          </div>

          <div className="tpl-decision-tree-editor__field">
            <label
              className="tpl-decision-tree-editor__label"
              htmlFor={`dt-option-outcome-${idx}`}
            >
              Outcome
            </label>
            <input
              id={`dt-option-outcome-${idx}`}
              type="text"
              className="tpl-decision-tree-editor__input"
              value={option.outcome ?? ''}
              onChange={(e) => updateOption(idx, 'outcome', e.target.value)}
              placeholder="Result if selected"
              disabled={readOnly}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addOption}
        className="tpl-decision-tree-editor__add-btn"
        disabled={readOnly}
      >
        + Add Option
      </button>
    </div>
  );
};
