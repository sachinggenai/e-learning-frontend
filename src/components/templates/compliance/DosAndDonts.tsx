import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './DosAndDonts.css';

export interface DosDontsItem {
  id: string;
  text: string;
  rationale?: string;
  reference?: string;
}

export interface DosAndDontsData {
  title?: string;
  dos?: DosDontsItem[];
  donts?: DosDontsItem[];
  layout?: 'columns' | 'stacked';
}

function ItemCard({ item, componentId, onInteraction }: { item: DosDontsItem; componentId?: string; onInteraction?: ComponentPreviewProps['onInteraction'] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="tpl-dos-and-donts__item">
      <p>{item.text}</p>
      {(item.rationale || item.reference) && (
        <button
          type="button"
          onClick={() => {
            const next = !expanded;
            setExpanded(next);
            if (next) {
              onInteraction?.({
                componentId,
                interactionType: 'item_expanded',
                interactionId: item.id,
                value: item.text,
                completed: false,
              });
            }
          }}
        >
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      )}
      {expanded && (
        <div className="tpl-dos-and-donts__details">
          {item.rationale && <p>{item.rationale}</p>}
          {item.reference && <p>Ref: {item.reference}</p>}
        </div>
      )}
    </li>
  );
}

export const DosAndDontsPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const d = data as DosAndDontsData;
  const dos = d.dos ?? [];
  const donts = d.donts ?? [];

  // Validation: at least one item per section
  const isValid = dos.length > 0 && donts.length > 0;

  return (
    <article className={`tpl-dos-and-donts tpl-dos-and-donts--${d.layout ?? 'columns'}`}>
      <h2 className="tpl-dos-and-donts__title">{d.title?.trim() || "Do's and Don'ts"}</h2>

      {!isValid && <p style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>⚠️ At least one Do and one Do Not item is required.</p>}

      <section className="tpl-dos-and-donts__section" aria-label="Do section">
        <header className="tpl-dos-and-donts__section-title">
          <ThumbsUp size={18} />
          <h3>Do</h3>
        </header>
        {dos.length === 0 ? (
          <p className="tpl-dos-and-donts__empty">Add at least one Do item.</p>
        ) : (
          <ul
            onMouseEnter={() => onInteraction?.({ componentId, interactionType: 'dos_section_viewed', interactionId: 'dos', completed: false })}
            onFocus={() => onInteraction?.({ componentId, interactionType: 'dos_section_viewed', interactionId: 'dos', completed: false })}
          >
            {dos.map((item) => <ItemCard key={item.id} item={item} componentId={componentId} onInteraction={onInteraction} />)}
          </ul>
        )}
      </section>

      <section className="tpl-dos-and-donts__section" aria-label="Do not section">
        <header className="tpl-dos-and-donts__section-title">
          <ThumbsDown size={18} />
          <h3>Do Not</h3>
        </header>
        {donts.length === 0 ? (
          <p className="tpl-dos-and-donts__empty">Add at least one Do Not item.</p>
        ) : (
          <ul
            onMouseEnter={() => onInteraction?.({ componentId, interactionType: 'donts_section_viewed', interactionId: 'donts', completed: false })}
            onFocus={() => onInteraction?.({ componentId, interactionType: 'donts_section_viewed', interactionId: 'donts', completed: false })}
          >
            {donts.map((item) => <ItemCard key={item.id} item={item} componentId={componentId} onInteraction={onInteraction} />)}
          </ul>
        )}
      </section>
    </article>
  );
};

export const DosAndDontsEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as DosAndDontsData;
  const dos = d.dos ?? [];
  const donts = d.donts ?? [];

  const update = (patch: Partial<DosAndDontsData>) => onChange({ data: { ...d, ...patch } });
  
  const isValid = dos.length > 0 && donts.length > 0;

  return (
    <section className="tpl-dos-and-donts-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>
        Layout
        <select value={d.layout ?? 'columns'} onChange={(e) => update({ layout: e.target.value as DosAndDontsData['layout'] })}>
          <option value="columns">Columns</option>
          <option value="stacked">Stacked</option>
        </select>
      </label>

      {!isValid && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          ⚠️ Validation: At least one Do item and one Do Not item required
        </div>
      )}

      <div className="tpl-dos-and-donts-editor__head">
        <h3>Do Items {dos.length > 0 ? `(${dos.length})` : <span style={{ color: '#ef4444' }}>*required</span>}</h3>
        <button type="button" onClick={() => update({ dos: [...dos, { id: `do-${Date.now()}`, text: '' }] })}>+ Add Do</button>
      </div>
      {dos.map((item) => (
        <div key={item.id} className="tpl-dos-and-donts-editor__row">
          <input value={item.text} placeholder="Item" onChange={(e) => update({ dos: dos.map((x) => x.id === item.id ? { ...x, text: e.target.value } : x) })} />
          <input value={item.rationale ?? ''} placeholder="Rationale" onChange={(e) => update({ dos: dos.map((x) => x.id === item.id ? { ...x, rationale: e.target.value } : x) })} />
          <input value={item.reference ?? ''} placeholder="Reference" onChange={(e) => update({ dos: dos.map((x) => x.id === item.id ? { ...x, reference: e.target.value } : x) })} />
          <button type="button" onClick={() => update({ dos: dos.filter((x) => x.id !== item.id) })}>Remove</button>
        </div>
      ))}

      <div className="tpl-dos-and-donts-editor__head">
        <h3>Do Not Items {donts.length > 0 ? `(${donts.length})` : <span style={{ color: '#ef4444' }}>*required</span>}</h3>
        <button type="button" onClick={() => update({ donts: [...donts, { id: `dont-${Date.now()}`, text: '' }] })}>+ Add Do Not</button>
      </div>
      {donts.map((item) => (
        <div key={item.id} className="tpl-dos-and-donts-editor__row">
          <input value={item.text} placeholder="Item" onChange={(e) => update({ donts: donts.map((x) => x.id === item.id ? { ...x, text: e.target.value } : x) })} />
          <input value={item.rationale ?? ''} placeholder="Rationale" onChange={(e) => update({ donts: donts.map((x) => x.id === item.id ? { ...x, rationale: e.target.value } : x) })} />
          <input value={item.reference ?? ''} placeholder="Reference" onChange={(e) => update({ donts: donts.map((x) => x.id === item.id ? { ...x, reference: e.target.value } : x) })} />
          <button type="button" onClick={() => update({ donts: donts.filter((x) => x.id !== item.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
