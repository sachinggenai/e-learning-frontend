/**
 * StepByStep — Guided step-by-step process.
 *
 * Preview: Numbered steps with progress tracking.
 * Editor: Add/remove steps with title, description, and optional image.
 *
 * Category: process-flow
 */

import React, { useState, useCallback } from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface Step {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const StepByStepPreview: React.FC<ComponentPreviewProps> = ({
  data,
  onInteraction,
  onComplete,
}) => {
  const steps: Step[] = data?.steps ?? [];
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);

  const goToStep = useCallback((idx: number) => {
    if (idx < 0 || idx >= steps.length) return;
    setActiveStep(idx);
    setMaxVisited((prev) => {
      const next = Math.max(prev, idx);
      onInteraction?.({
        interactionType: 'step-navigate',
        componentId: '',
        interactionId: steps[idx].id,
        value: idx,
      });
      if (next === steps.length - 1) onComplete?.('');
      return next;
    });
  }, [steps, onInteraction, onComplete]);

  if (steps.length === 0) {
    return <div style={{ padding: 20, color: '#94a3b8' }}>No steps configured.</div>;
  }

  const step = steps[activeStep];

  return (
    <div>
      {data?.title && <h3 style={{ marginBottom: 16 }}>{data.title}</h3>}

      {/* Progress indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => goToStep(idx)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background:
                  idx === activeStep
                    ? '#3b82f6'
                    : idx <= maxVisited
                    ? '#93c5fd'
                    : '#e2e8f0',
                color: idx === activeStep ? '#fff' : idx <= maxVisited ? '#1e40af' : '#94a3b8',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
              aria-label={`Step ${idx + 1}: ${s.title}`}
              aria-current={idx === activeStep ? 'step' : undefined}
            >
              {idx + 1}
            </button>
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: idx < maxVisited ? '#93c5fd' : '#e2e8f0',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current step content */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 24,
          background: '#fff',
        }}
      >
        <h4 style={{ margin: '0 0 8px', fontSize: 16 }}>
          Step {activeStep + 1}: {step.title}
        </h4>
        {step.imageUrl && (
          <img
            src={step.imageUrl}
            alt={step.title}
            style={{ width: '100%', borderRadius: 6, marginBottom: 12 }}
          />
        )}
        <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
          {step.description}
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button
          onClick={() => goToStep(activeStep - 1)}
          disabled={activeStep === 0}
          style={{
            padding: '8px 20px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            background: '#fff',
            cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
            opacity: activeStep === 0 ? 0.4 : 1,
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => goToStep(activeStep + 1)}
          disabled={activeStep === steps.length - 1}
          style={{
            padding: '8px 20px',
            background: activeStep === steps.length - 1 ? '#e2e8f0' : '#3b82f6',
            color: activeStep === steps.length - 1 ? '#94a3b8' : '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          {activeStep === steps.length - 1 ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const StepByStepEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
}) => {
  const steps: Step[] = data?.steps ?? [];

  const updateStep = (idx: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...data, steps: updated } });
  };

  const addStep = () => {
    onChange({
      data: {
        ...data,
        steps: [...steps, { id: `step-${Date.now()}`, title: '', description: '' }],
      },
    });
  };

  const removeStep = (idx: number) => {
    onChange({ data: { ...data, steps: steps.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input
          type="text"
          value={data?.title ?? ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          placeholder="Step-by-Step Guide"
          style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
        />
      </div>

      {steps.map((step, idx) => (
        <div key={step.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 10, background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Step {idx + 1}</span>
            <button onClick={() => removeStep(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Title</label>
            <input type="text" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Description</label>
            <textarea value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)} rows={3} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, marginBottom: 3 }}>Image URL (optional)</label>
            <input type="text" value={step.imageUrl ?? ''} onChange={(e) => updateStep(idx, 'imageUrl', e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          </div>
        </div>
      ))}

      <button onClick={addStep} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Step
      </button>
    </div>
  );
};
