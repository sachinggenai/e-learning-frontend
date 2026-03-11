import React, { useEffect, useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './SoftwareSimulation.css';

interface SoftwareHotspot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

interface SoftwareStep {
  id: string;
  title: string;
  instruction: string;
  imageUrl: string;
  hotspots: SoftwareHotspot[];
}

interface SoftwareSimulationData {
  title?: string;
  steps?: SoftwareStep[];
  strictMode?: boolean;
}

function normalizeSteps(steps: SoftwareStep[] | undefined): SoftwareStep[] {
  if (!Array.isArray(steps) || steps.length === 0) {
    return [
      {
        id: 'step-1',
        title: 'Open the menu',
        instruction: 'Click the menu hotspot to continue.',
        imageUrl: '',
        hotspots: [{ id: 'hs-1', x: 20, y: 25, w: 22, h: 14, label: 'Menu button' }],
      },
      {
        id: 'step-2',
        title: 'Save changes',
        instruction: 'Click save to complete the simulation.',
        imageUrl: '',
        hotspots: [{ id: 'hs-2', x: 62, y: 70, w: 24, h: 14, label: 'Save button' }],
      },
    ];
  }

  return steps.map((s, i) => ({
    id: s.id || `step-${i + 1}`,
    title: s.title || `Step ${i + 1}`,
    instruction: s.instruction || '',
    imageUrl: s.imageUrl || '',
    hotspots: Array.isArray(s.hotspots) && s.hotspots.length > 0
      ? s.hotspots.map((h, hIdx) => ({
          id: h.id || `hs-${i + 1}-${hIdx + 1}`,
          x: Number(h.x) || 0,
          y: Number(h.y) || 0,
          w: Number(h.w) || 12,
          h: Number(h.h) || 12,
          label: h.label || `Hotspot ${hIdx + 1}`,
        }))
      : [{ id: `hs-${i + 1}-1`, x: 20, y: 20, w: 20, h: 12, label: 'Primary target' }],
  }));
}

export const SoftwareSimulationPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as SoftwareSimulationData;
  const title = d.title || 'Software Simulation';
  const strictMode = d.strictMode === true;
  const steps = useMemo(() => normalizeSteps(d.steps), [d.steps]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState(false);

  const currentStep = steps[currentIndex];
  const expectedHotspot = currentStep?.hotspots[0];

  useEffect(() => {
    if (!currentStep) return;
    onInteraction?.({
      componentId,
      interactionType: 'software_step_viewed',
      interactionId: currentStep.id,
      value: { stepIndex: currentIndex + 1 },
      completed: false,
    });
  }, [componentId, currentIndex, currentStep, onInteraction]);

  const advanceStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((v) => v + 1);
      setMessage('Correct. Moving to the next step.');
      return;
    }

    setFinished(true);
    setMessage('Simulation complete.');
    onInteraction?.({
      componentId,
      interactionType: 'software_simulation_completed',
      value: { totalSteps: steps.length },
      completed: true,
    });
    onComplete?.(componentId);
  };

  const handleHotspotClick = (hotspot: SoftwareHotspot) => {
    if (!currentStep || finished) return;

    onInteraction?.({
      componentId,
      interactionType: 'software_hotspot_clicked',
      interactionId: hotspot.id,
      value: { label: hotspot.label, expected: expectedHotspot?.id },
      completed: false,
    });

    if (expectedHotspot && hotspot.id === expectedHotspot.id) {
      onInteraction?.({
        componentId,
        interactionType: 'software_step_completed',
        interactionId: currentStep.id,
        value: { hotspotId: hotspot.id },
        completed: false,
      });
      advanceStep();
      return;
    }

    if (strictMode) {
      setMessage('Incorrect target. Select the highlighted action for this step.');
      return;
    }

    onInteraction?.({
      componentId,
      interactionType: 'software_step_completed',
      interactionId: currentStep.id,
      value: { hotspotId: hotspot.id, bypassed: true },
      completed: false,
    });
    setMessage('Accepted in non-strict mode. Continuing.');
    advanceStep();
  };

  if (!currentStep) return null;

  return (
    <section className="tpl-software-sim">
      <h3 className="tpl-software-sim__title">{title}</h3>

      <div className="tpl-software-sim__viewer">
        <div className="tpl-software-sim__image" role="img" aria-label={`${currentStep.title} screenshot`}>
          {currentStep.imageUrl ? (
            <img src={currentStep.imageUrl} alt={`${currentStep.title} screenshot`} />
          ) : (
            <div className="tpl-software-sim__placeholder">Screenshot placeholder</div>
          )}

          {!finished && currentStep.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className={`tpl-software-sim__hotspot ${expectedHotspot?.id === hotspot.id ? 'is-primary' : ''}`}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.w}%`,
                height: `${hotspot.h}%`,
              }}
              aria-label={hotspot.label}
              onClick={() => handleHotspotClick(hotspot)}
            >
              {hotspot.label}
            </button>
          ))}
        </div>

        <aside className="tpl-software-sim__instructions">
          <h4>{currentStep.title}</h4>
          <p>{currentStep.instruction}</p>
          <p>Step {currentIndex + 1} / {steps.length}</p>
          <ul>
            {currentStep.hotspots.map((hotspot) => (
              <li key={hotspot.id}>
                <button type="button" onClick={() => handleHotspotClick(hotspot)} disabled={finished}>
                  {hotspot.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <p className="tpl-software-sim__message" aria-live="polite">{message}</p>
      {finished && <p className="tpl-software-sim__done" role="status">All steps completed.</p>}
    </section>
  );
};

export const SoftwareSimulationEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as SoftwareSimulationData;
  const steps = normalizeSteps(d.steps);

  const update = (patch: Partial<SoftwareSimulationData>) => onChange({ data: { ...d, ...patch } });

  const updateStep = (idx: number, patch: Partial<SoftwareStep>) => {
    const next = [...steps];
    next[idx] = { ...next[idx], ...patch };
    update({ steps: next });
  };

  const addStep = () => {
    update({
      steps: [
        ...steps,
        {
          id: `step-${steps.length + 1}`,
          title: `Step ${steps.length + 1}`,
          instruction: '',
          imageUrl: '',
          hotspots: [{ id: `hs-${steps.length + 1}-1`, x: 20, y: 20, w: 20, h: 12, label: 'Primary target' }],
        },
      ],
    });
  };

  const removeStep = (idx: number) => {
    update({ steps: steps.filter((_, i) => i !== idx) });
  };

  return (
    <section className="tpl-software-sim-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>
      <label className="tpl-software-sim-editor__checkbox">
        <input type="checkbox" checked={d.strictMode ?? false} onChange={(e) => update({ strictMode: e.target.checked })} />
        Strict mode
      </label>

      {steps.map((step, idx) => (
        <fieldset key={step.id} className="tpl-software-sim-editor__step">
          <legend>Step {idx + 1}</legend>
          <label>
            Title
            <input value={step.title} onChange={(e) => updateStep(idx, { title: e.target.value })} />
          </label>
          <label>
            Instruction
            <textarea rows={2} value={step.instruction} onChange={(e) => updateStep(idx, { instruction: e.target.value })} />
          </label>
          <label>
            Image URL
            <input value={step.imageUrl} onChange={(e) => updateStep(idx, { imageUrl: e.target.value })} />
          </label>
          <button type="button" onClick={() => removeStep(idx)} disabled={steps.length <= 1}>Remove step</button>
        </fieldset>
      ))}

      <button type="button" onClick={addStep}>Add Step</button>
    </section>
  );
};
