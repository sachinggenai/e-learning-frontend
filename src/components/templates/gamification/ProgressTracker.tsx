/**
 * ProgressTracker — Visual course progress tracker.
 *
 * Category: gamification
 */

import React from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

interface Milestone {
  id: string;
  label: string;
  pageIndex: number;
  icon?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const ProgressTrackerPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
  const milestones: Milestone[] = data?.milestones ?? [];
  const totalPages: number = data?.totalPages ?? 10;
  const completedPages: number = data?.completedPages ?? 0;
  const pct = Math.round((completedPages / Math.max(totalPages, 1)) * 100);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {data?.title && <h3 style={{ textAlign: 'center', marginBottom: 4 }}>{data.title}</h3>}
      {data?.subtitle && (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 20 }}>
          {data.subtitle}
        </p>
      )}

      {/* Progress bar */}
      <div
        style={{
          position: 'relative',
          height: 10,
          background: '#e2e8f0',
          borderRadius: 5,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
            borderRadius: 5,
            transition: 'width 0.5s ease',
          }}
        />
        {/* Milestone markers */}
        {milestones.map((m) => {
          const left = Math.round((m.pageIndex / Math.max(totalPages, 1)) * 100);
          const reached = completedPages >= m.pageIndex;
          return (
            <div
              key={m.id}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: reached ? '#22c55e' : '#fff',
                border: `2px solid ${reached ? '#22c55e' : '#cbd5e1'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
              title={m.label}
            >
              {m.icon ?? (reached ? '✓' : '')}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>{pct}%</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Complete</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{completedPages}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Pages Done</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
            {totalPages - completedPages}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Remaining</div>
        </div>
      </div>

      {/* Milestone list */}
      {milestones.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {milestones.map((m) => {
            const reached = completedPages >= m.pageIndex;
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: reached ? '#f0fdf4' : '#f9fafb',
                  border: `1px solid ${reached ? '#bbf7d0' : '#e2e8f0'}`,
                }}
              >
                <span style={{ fontSize: 16 }}>{m.icon ?? (reached ? '✅' : '⬜')}</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: reached ? 500 : 400,
                    color: reached ? '#166534' : '#64748b',
                    textDecoration: reached ? 'line-through' : 'none',
                  }}
                >
                  {m.label}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Page {m.pageIndex}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const ProgressTrackerEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const milestones: Milestone[] = data?.milestones ?? [];

  const updateMilestone = (idx: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value } as Milestone;
    onChange({ data: { ...data, milestones: updated } });
  };

  const addMilestone = () => {
    onChange({
      data: {
        ...data,
        milestones: [
          ...milestones,
          { id: `ms-${Date.now()}`, label: '', pageIndex: 1, icon: '🏆' },
        ],
      },
    });
  };

  const removeMilestone = (idx: number) => {
    onChange({ data: { ...data, milestones: milestones.filter((_, i) => i !== idx) } });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Title</label>
        <input type="text" value={data?.title ?? ''} onChange={(e) => onChange({ data: { ...data, title: e.target.value } })} placeholder="Your Progress" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Total Pages</label>
          <input type="number" value={data?.totalPages ?? 10} onChange={(e) => onChange({ data: { ...data, totalPages: Number(e.target.value) } })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Preview: Completed</label>
          <input type="number" value={data?.completedPages ?? 0} onChange={(e) => onChange({ data: { ...data, completedPages: Number(e.target.value) } })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
        </div>
      </div>

      <h5 style={{ margin: '16px 0 10px', fontSize: 13 }}>Milestones</h5>
      {milestones.map((m, idx) => (
        <div key={m.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <input type="text" value={m.icon ?? ''} onChange={(e) => updateMilestone(idx, 'icon', e.target.value)} style={{ width: 40, padding: '6px 4px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, textAlign: 'center' }} />
          <input type="text" value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} placeholder="Milestone label" style={{ flex: 1, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          <input type="number" value={m.pageIndex} onChange={(e) => updateMilestone(idx, 'pageIndex', Number(e.target.value))} min={1} style={{ width: 60, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
          <button onClick={() => removeMilestone(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>
      ))}
      <button onClick={addMilestone} style={{ width: '100%', padding: 10, border: '2px dashed #cbd5e1', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>
        + Add Milestone
      </button>
    </div>
  );
};
