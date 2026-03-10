import React, { useState } from 'react';
import { AudioLines, ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ScreenReaderGuide.css';

export interface ScreenReaderStep {
  id: string;
  step: string;
  expectedResult?: string;
  toolNotes?: string;
}

export interface TroubleshootingEntry {
  issue: string;
  fix: string;
}

export interface ScreenReaderGuideData {
  title?: string;
  intro?: string;
  steps?: ScreenReaderStep[];
  supportedTools?: string[];
  activeTool?: string;
  troubleshooting?: TroubleshootingEntry[];
}

const DEFAULT_TOOLS = ['NVDA', 'JAWS', 'VoiceOver'];

export const ScreenReaderGuidePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as ScreenReaderGuideData;
  const tools = d.supportedTools?.length ? d.supportedTools : DEFAULT_TOOLS;
  const steps = d.steps ?? [];
  const [activeTool, setActiveTool] = useState(d.activeTool?.trim() || tools[0] || '');
  const [openIssues, setOpenIssues] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const allDone = steps.length > 0 && steps.every((s) => completedSteps.has(s.id));

  const toggleIssue = (idx: number) =>
    setOpenIssues((prev) => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });

  const markStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const n = new Set(prev);
      n.add(stepId);
      const step = steps.find((s) => s.id === stepId);
      onInteraction?.({
        componentId,
        interactionType: 'sr_step_opened',
        interactionId: stepId,
        value: step?.step ?? '',
        completed: false,
      });
      return n;
    });
  };

  return (
    <article className="tpl-sr-guide">
      <h2 className="tpl-sr-guide__title">
        <AudioLines size={20} aria-hidden="true" />
        {d.title?.trim() || 'Screen Reader Guide'}
      </h2>

      {d.intro?.trim() && <p className="tpl-sr-guide__intro">{d.intro}</p>}

      {tools.length > 1 && (
        <div className="tpl-sr-guide__tool-tabs" role="tablist" aria-label="Screen reader tools">
          {tools.map((tool) => (
            <button
              key={tool}
              type="button"
              role="tab"
              aria-selected={activeTool === tool}
              className={`tpl-sr-guide__tool-tab${activeTool === tool ? ' is-active' : ''}`}
              onClick={() => {
                setActiveTool(tool);
                onInteraction?.({
                  componentId,
                  interactionType: 'sr_tool_switched',
                  interactionId: tool,
                  value: tool,
                  completed: false,
                });
              }}
            >
              {tool}
            </button>
          ))}
        </div>
      )}

      {steps.length === 0 ? (
        <p className="tpl-sr-guide__empty">No steps configured yet.</p>
      ) : (
        <ol className="tpl-sr-guide__steps">
          {steps.map((s, idx) => (
            <li
              key={s.id}
              className={`tpl-sr-guide__step${completedSteps.has(s.id) ? ' tpl-sr-guide__step--done' : ''}`}
            >
              <div className="tpl-sr-guide__step-header">
                <span className="tpl-sr-guide__step-num" aria-hidden="true">{idx + 1}</span>
                <p className="tpl-sr-guide__step-text">{s.step}</p>
                <button
                  type="button"
                  className="tpl-sr-guide__step-check"
                  aria-label={completedSteps.has(s.id) ? `Step ${idx + 1} done` : `Mark step ${idx + 1} done`}
                  onClick={() => markStep(s.id)}
                  disabled={completedSteps.has(s.id)}
                >
                  {completedSteps.has(s.id) ? '✓' : 'Done'}
                </button>
              </div>
              {s.expectedResult && <p className="tpl-sr-guide__step-expected">Expected: {s.expectedResult}</p>}
              {s.toolNotes && activeTool && (
                <p className="tpl-sr-guide__step-notes"><strong>{activeTool}:</strong> {s.toolNotes}</p>
              )}
            </li>
          ))}
        </ol>
      )}

      {allDone && (
        <button
          type="button"
          className="tpl-sr-guide__complete-btn"
          onClick={() => {
            onInteraction?.({ componentId, interactionType: 'sr_guide_completed', interactionId: 'complete', value: activeTool, completed: true });
            onComplete?.(componentId);
          }}
        >
          Mark Complete
        </button>
      )}

      {d.troubleshooting && d.troubleshooting.length > 0 && (
        <section className="tpl-sr-guide__troubleshoot">
          <h3>Troubleshooting</h3>
          {d.troubleshooting.map((entry, idx) => (
            <div key={idx} className="tpl-sr-guide__issue">
              <button
                type="button"
                className="tpl-sr-guide__issue-toggle"
                aria-expanded={openIssues.has(idx)}
                onClick={() => toggleIssue(idx)}
              >
                {entry.issue}
                {openIssues.has(idx) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openIssues.has(idx) && <p className="tpl-sr-guide__issue-fix">{entry.fix}</p>}
            </div>
          ))}
        </section>
      )}
    </article>
  );
};

export const ScreenReaderGuideEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as ScreenReaderGuideData;
  const steps = d.steps ?? [];
  const troubleshooting = d.troubleshooting ?? [];
  const tools = d.supportedTools ?? [];
  const update = (patch: Partial<ScreenReaderGuideData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-sr-guide-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Introduction<textarea rows={2} value={d.intro ?? ''} onChange={(e) => update({ intro: e.target.value })} /></label>
      <label>
        Supported Tools (comma-separated)
        <input
          value={tools.join(', ')}
          placeholder="NVDA, JAWS, VoiceOver"
          onChange={(e) => update({ supportedTools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
        />
      </label>

      <div className="tpl-sr-guide-editor__head">
        <h3>Steps</h3>
        <button type="button" onClick={() => update({ steps: [...steps, { id: `s-${Date.now()}`, step: '', expectedResult: '' }] })}>+ Add Step</button>
      </div>
      {steps.map((s, idx) => (
        <div key={s.id} className="tpl-sr-guide-editor__row">
          <span className="tpl-sr-guide-editor__num">{idx + 1}</span>
          <input value={s.step} placeholder="Step instruction" onChange={(e) => update({ steps: steps.map((x) => x.id === s.id ? { ...x, step: e.target.value } : x) })} />
          <input value={s.expectedResult ?? ''} placeholder="Expected result" onChange={(e) => update({ steps: steps.map((x) => x.id === s.id ? { ...x, expectedResult: e.target.value } : x) })} />
          <input value={s.toolNotes ?? ''} placeholder="Tool-specific notes" onChange={(e) => update({ steps: steps.map((x) => x.id === s.id ? { ...x, toolNotes: e.target.value } : x) })} />
          <button type="button" onClick={() => update({ steps: steps.filter((x) => x.id !== s.id) })}>Remove</button>
        </div>
      ))}

      <div className="tpl-sr-guide-editor__head">
        <h3>Troubleshooting</h3>
        <button type="button" onClick={() => update({ troubleshooting: [...troubleshooting, { issue: '', fix: '' }] })}>+ Add Issue</button>
      </div>
      {troubleshooting.map((entry, idx) => (
        <div key={idx} className="tpl-sr-guide-editor__row">
          <input value={entry.issue} placeholder="Issue description" onChange={(e) => update({ troubleshooting: troubleshooting.map((x, i) => i === idx ? { ...x, issue: e.target.value } : x) })} />
          <input value={entry.fix} placeholder="Solution / fix" onChange={(e) => update({ troubleshooting: troubleshooting.map((x, i) => i === idx ? { ...x, fix: e.target.value } : x) })} />
          <button type="button" onClick={() => update({ troubleshooting: troubleshooting.filter((_, i) => i !== idx) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
