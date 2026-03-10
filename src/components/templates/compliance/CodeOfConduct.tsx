import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './CodeOfConduct.css';

export interface ConductPrinciple {
  id: string;
  title: string;
  description: string;
  example?: string;
}

export interface ConductSection {
  id: string;
  title: string;
  principles: ConductPrinciple[];
}

export interface CodeOfConductData {
  title?: string;
  sections?: ConductSection[];
  requireAllSectionsViewed?: boolean;
  quickCheckEnabled?: boolean;
}

export const CodeOfConductPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as CodeOfConductData;
  const sections = d.sections ?? [];
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? '');
  const [viewedIds, setViewedIds] = useState<string[]>(sections[0]?.id ? [sections[0].id] : []);
  const [quickCheck, setQuickCheck] = useState(false);

  const active = useMemo(() => sections.find((s) => s.id === activeSectionId) ?? sections[0], [activeSectionId, sections]);
  const allViewed = sections.length > 0 && sections.every((s) => viewedIds.includes(s.id));
  const canComplete = (d.requireAllSectionsViewed !== true || allViewed) && (d.quickCheckEnabled !== true || quickCheck);

  const openSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setViewedIds((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
    onInteraction?.({
      componentId,
      interactionType: 'conduct_section_opened',
      interactionId: sectionId,
      completed: false,
    });
  };

  return (
    <article className="tpl-code-of-conduct">
      <h2 className="tpl-code-of-conduct__title"><ShieldCheck size={20} /> {d.title?.trim() || 'Code of Conduct'}</h2>

      <div className="tpl-code-of-conduct__tabs" role="tablist" aria-label="Conduct sections">
        {sections.map((section) => (
          <button
            key={section.id}
            role="tab"
            type="button"
            aria-selected={(active?.id ?? '') === section.id}
            className={(active?.id ?? '') === section.id ? 'is-active' : ''}
            onClick={() => openSection(section.id)}
          >
            {section.title}
          </button>
        ))}
      </div>

      {!active ? (
        <p className="tpl-code-of-conduct__empty">No sections configured yet.</p>
      ) : (
        <section className="tpl-code-of-conduct__panel">
          <h3>{active.title}</h3>
          {active.principles.map((principle) => (
            <button
              key={principle.id}
              type="button"
              className="tpl-code-of-conduct__principle"
              onClick={() => onInteraction?.({
                componentId,
                interactionType: 'principle_viewed',
                interactionId: principle.id,
                value: principle.title,
                completed: false,
              })}
            >
              <strong>{principle.title}</strong>
              <span>{principle.description}</span>
              {principle.example && <em>Example: {principle.example}</em>}
            </button>
          ))}
        </section>
      )}

      {d.requireAllSectionsViewed && <p className="tpl-code-of-conduct__status">Section progress: {viewedIds.length}/{sections.length}</p>}

      {d.quickCheckEnabled && (
        <label className="tpl-code-of-conduct__quick-check">
          <input type="checkbox" checked={quickCheck} onChange={(e) => setQuickCheck(e.target.checked)} />
          I understand these conduct expectations.
        </label>
      )}

      <button
        type="button"
        disabled={!canComplete}
        onClick={() => {
          onInteraction?.({
            componentId,
            interactionType: 'conduct_completed',
            interactionId: 'complete',
            value: { allViewed, quickCheck },
            completed: true,
          });
          onComplete?.(componentId);
        }}
      >
        Mark Complete
      </button>
    </article>
  );
};

export const CodeOfConductEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as CodeOfConductData;
  const sections = d.sections ?? [];
  const update = (patch: Partial<CodeOfConductData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-code-of-conduct-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label><input type="checkbox" checked={d.requireAllSectionsViewed === true} onChange={(e) => update({ requireAllSectionsViewed: e.target.checked })} /> Require all sections viewed</label>
      <label><input type="checkbox" checked={d.quickCheckEnabled === true} onChange={(e) => update({ quickCheckEnabled: e.target.checked })} /> Enable quick check</label>

      <div className="tpl-code-of-conduct-editor__head">
        <h3>Sections</h3>
        <button type="button" onClick={() => update({ sections: [...sections, { id: `sec-${Date.now()}`, title: '', principles: [] }] })}>+ Add Section</button>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="tpl-code-of-conduct-editor__section">
          <input value={section.title} placeholder="Section title" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s) })} />
          <button
            type="button"
            onClick={() => update({
              sections: sections.map((s) => s.id === section.id ? {
                ...s,
                principles: [...s.principles, { id: `p-${Date.now()}`, title: '', description: '' }],
              } : s),
            })}
          >
            + Add Principle
          </button>
          {section.principles.map((principle) => (
            <div key={principle.id} className="tpl-code-of-conduct-editor__principle">
              <input value={principle.title} placeholder="Principle title" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, principles: s.principles.map((p) => p.id === principle.id ? { ...p, title: e.target.value } : p) } : s) })} />
              <input value={principle.description} placeholder="Description" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, principles: s.principles.map((p) => p.id === principle.id ? { ...p, description: e.target.value } : p) } : s) })} />
              <input value={principle.example ?? ''} placeholder="Example" onChange={(e) => update({ sections: sections.map((s) => s.id === section.id ? { ...s, principles: s.principles.map((p) => p.id === principle.id ? { ...p, example: e.target.value } : p) } : s) })} />
            </div>
          ))}
          <button type="button" onClick={() => update({ sections: sections.filter((s) => s.id !== section.id) })}>Remove Section</button>
        </div>
      ))}
    </section>
  );
};
