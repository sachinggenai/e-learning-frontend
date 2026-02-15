/**
 * Summary Component — Legacy migration
 */

import React, { useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

export const SummaryPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onComplete,
}) => {
  React.useEffect(() => {
    onComplete?.(componentId);
  }, [componentId, onComplete]);

  const keyPoints: string[] = data.keyPoints || [];

  return (
    <section className="summary-component" aria-label="Summary">
      <h2 className="summary__title">{data.title || 'Summary'}</h2>
      {keyPoints.length > 0 ? (
        <ul className="summary__key-points" role="list">
          {keyPoints.map((point, i) => (
            <li key={i} className="summary__point">
              <CheckCircle size={16} className="summary__point-icon" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="component-empty">No key points added.</p>
      )}
    </section>
  );
};

export const SummaryEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const keyPoints: string[] = data.keyPoints || [];

  const handleChange = useCallback((field: string, value: any) => {
    onChange({ data: { ...data, [field]: value } });
  }, [data, onChange]);

  const addPoint = useCallback(() => {
    handleChange('keyPoints', [...keyPoints, '']);
  }, [keyPoints, handleChange]);

  const removePoint = useCallback((index: number) => {
    handleChange('keyPoints', keyPoints.filter((_, i) => i !== index));
  }, [keyPoints, handleChange]);

  const updatePoint = useCallback((index: number, value: string) => {
    const newPoints = [...keyPoints];
    newPoints[index] = value;
    handleChange('keyPoints', newPoints);
  }, [keyPoints, handleChange]);

  return (
    <div className="summary-editor">
      <div className="form-group">
        <label htmlFor="summary-title">Title</label>
        <input
          id="summary-title"
          type="text"
          className="form-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          disabled={readOnly}
        />
      </div>

      <div className="form-group">
        <label>Key Points</label>
        {keyPoints.map((point, index) => (
          <div key={index} className="summary-editor__point-row">
            <input
              type="text"
              className="form-input"
              value={point}
              onChange={(e) => updatePoint(index, e.target.value)}
              placeholder={`Key point ${index + 1}...`}
              disabled={readOnly}
              aria-label={`Key point ${index + 1}`}
            />
            {!readOnly && (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => removePoint(index)}
                aria-label={`Remove key point ${index + 1}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button className="btn btn-sm btn-secondary" onClick={addPoint}>
            + Add Key Point
          </button>
        )}
      </div>
    </div>
  );
};
