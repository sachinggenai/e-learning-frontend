/**
 * CaseStudy — Extended scenario with context, analysis prompts and reflection.
 *
 * Category: scenario
 */

import React, { useState } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface AnalysisPrompt {
  id: string;
  question: string;
  sampleAnswer?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const CaseStudyPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const prompts: AnalysisPrompt[] = data?.prompts ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onInteraction?.({
      interactionType: 'case-study-submit',
      componentId: '',
      interactionId: 'submit',
      value: answers,
    });
    onComplete?.('');
  };

  const allAnswered = prompts.every((p) => (answers[p.id] ?? '').trim().length > 0);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {data?.title && <h3 style={{ marginBottom: 4 }}>{data.title}</h3>}
      {data?.subtitle && (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{data.subtitle}</p>
      )}

      {/* Context section */}
      <div
        style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 10,
          padding: 20,
          marginBottom: 24,
          lineHeight: 1.7,
          fontSize: 14,
          color: '#1e3a5f',
        }}
      >
        <h4 style={{ margin: '0 0 8px', fontSize: 15 }}>📋 Background</h4>
        <div style={{ whiteSpace: 'pre-wrap' }}>{data?.context ?? 'No context provided.'}</div>
      </div>

      {data?.imageUrl && (
        <img
          src={data.imageUrl}
          alt=""
          style={{ width: '100%', borderRadius: 8, marginBottom: 20 }}
        />
      )}

      {/* Analysis prompts */}
      {prompts.map((p, idx) => (
        <div
          key={p.id}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 16,
            marginBottom: 14,
          }}
        >
          <h5 style={{ margin: '0 0 8px', fontSize: 14 }}>
            {idx + 1}. {p.question}
          </h5>
          <textarea
            value={answers[p.id] ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [p.id]: e.target.value }))}
            placeholder="Type your analysis here…"
            rows={4}
            disabled={submitted}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 13,
              resize: 'vertical',
              lineHeight: 1.5,
              background: submitted ? '#f8fafc' : '#fff',
            }}
          />
          {submitted && p.sampleAnswer && (
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() =>
                  setShowSample((s) => ({ ...s, [p.id]: !s[p.id] }))
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {showSample[p.id] ? 'Hide' : 'Show'} sample answer
              </button>
              {showSample[p.id] && (
                <div
                  style={{
                    marginTop: 6,
                    padding: '10px 12px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#166534',
                    lineHeight: 1.5,
                  }}
                >
                  {p.sampleAnswer}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            width: '100%',
            padding: 14,
            background: allAnswered ? '#3b82f6' : '#cbd5e1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            cursor: allAnswered ? 'pointer' : 'not-allowed',
          }}
        >
          Submit Analysis
        </button>
      )}

      {submitted && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            padding: 16,
            background: '#f0fdf4',
            borderRadius: 8,
            color: '#166534',
            fontWeight: 500,
          }}
        >
          ✓ Your analysis has been recorded. Review the sample answers above.
        </div>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const CaseStudyEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const prompts: AnalysisPrompt[] = data?.prompts ?? [];

  const updatePrompt = (idx: number, field: keyof AnalysisPrompt, value: string) => {
    const updated = [...prompts];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, prompts: updated } });
  };

  const addPrompt = () => {
    onChange({
      data: {
        ...data,
        prompts: [...prompts, { id: `p-${Date.now()}`, question: '', sampleAnswer: '' }],
      },
    });
  };

  const removePrompt = (idx: number) => {
    onChange({ data: { ...data, prompts: prompts.filter((_, i) => i !== idx) } });
  };

  const field = (label: string, key: string, multi = false, placeholder = '') => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </label>
      {multi ? (
        <textarea
          value={data?.[key] ?? ''}
          onChange={(e) => onChange({ data: { ...data, [key]: e.target.value } })}
          placeholder={placeholder}
          rows={5}
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
          value={data?.[key] ?? ''}
          onChange={(e) => onChange({ data: { ...data, [key]: e.target.value } })}
          placeholder={placeholder}
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
      {field('Title', 'title', false, 'Case Study')}
      {field('Subtitle', 'subtitle', false, 'Analyze the following scenario')}
      {field('Context / Background', 'context', true, 'Describe the case background…')}
      {field('Image URL (optional)', 'imageUrl', false, 'https://…')}

      <h5 style={{ margin: '16px 0 10px', fontSize: 13, fontWeight: 600 }}>
        Analysis Prompts
      </h5>
      {prompts.map((p, idx) => (
        <div
          key={p.id}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: 12,
            marginBottom: 10,
            background: '#f9fafb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Prompt {idx + 1}</span>
            <button
              onClick={() => removePrompt(idx)}
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
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Question</label>
            <input
              type="text"
              value={p.question}
              onChange={(e) => updatePrompt(idx, 'question', e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                fontSize: 13,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>
              Sample Answer (shown after submission)
            </label>
            <textarea
              value={p.sampleAnswer ?? ''}
              onChange={(e) => updatePrompt(idx, 'sampleAnswer', e.target.value)}
              rows={2}
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
      ))}
      <button
        onClick={addPrompt}
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
        + Add Analysis Prompt
      </button>
    </div>
  );
};
