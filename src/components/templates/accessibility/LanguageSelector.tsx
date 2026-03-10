import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './LanguageSelector.css';

export interface LanguageOption {
  code: string;
  label: string;
  rtl?: boolean;
}

export interface LanguageSelectorData {
  title?: string;
  options?: LanguageOption[];
  defaultCode?: string;
  fallbackCode?: string;
  persistPreference?: boolean;
}

const STORAGE_KEY = 'tpl-language-selector-pref';

export const LanguageSelectorPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as LanguageSelectorData;
  const options = d.options ?? [];
  const defaultCode = d.defaultCode?.trim() || options[0]?.code || '';

  const [selected, setSelected] = useState<string>(() => {
    if (d.persistPreference) {
      return localStorage.getItem(STORAGE_KEY) ?? defaultCode;
    }
    return defaultCode;
  });

  const currentOption = options.find((o) => o.code === selected);
  const fallback = options.find((o) => o.code === d.fallbackCode);
  const displayOption = currentOption ?? fallback;
  const usingFallback = !currentOption && Boolean(fallback);

  useEffect(() => {
    if (usingFallback && fallback) {
      onInteraction?.({
        componentId,
        interactionType: 'language_fallback_used',
        interactionId: fallback.code,
        value: fallback.code,
        completed: false,
      });
    }
  }, [usingFallback, fallback, componentId, onInteraction]);

  const handleChange = (code: string) => {
    setSelected(code);
    if (d.persistPreference) {
      localStorage.setItem(STORAGE_KEY, code);
    }
    onInteraction?.({
      componentId,
      interactionType: 'language_changed',
      interactionId: code,
      value: code,
      completed: false,
    });
    onComplete?.(componentId);
  };

  return (
    <article className="tpl-language-selector" dir={displayOption?.rtl ? 'rtl' : 'ltr'}>
      <h2 className="tpl-language-selector__title">
        <Languages size={20} aria-hidden="true" />
        {d.title?.trim() || 'Select Language'}
      </h2>

      {options.length === 0 ? (
        <p className="tpl-language-selector__empty">No languages configured yet.</p>
      ) : (
        <div className="tpl-language-selector__options" role="listbox" aria-label="Available languages">
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              aria-selected={selected === opt.code}
              className={`tpl-language-selector__option${selected === opt.code ? ' is-selected' : ''}${opt.rtl ? ' tpl-language-selector__option--rtl' : ''}`}
              onClick={() => handleChange(opt.code)}
            >
              <span className="tpl-language-selector__code">{opt.code.toUpperCase()}</span>
              <span className="tpl-language-selector__label">{opt.label}</span>
              {opt.rtl && <span className="tpl-language-selector__rtl-badge" aria-label="Right-to-left">RTL</span>}
            </button>
          ))}
        </div>
      )}

      {usingFallback && fallback && (
        <p className="tpl-language-selector__fallback" role="status" aria-live="polite">
          Selected language not available. Showing {fallback.label} instead.
        </p>
      )}

      {d.persistPreference && (
        <p className="tpl-language-selector__persist-hint">Your preference will be remembered.</p>
      )}
    </article>
  );
};

export const LanguageSelectorEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as LanguageSelectorData;
  const options = d.options ?? [];
  const update = (patch: Partial<LanguageSelectorData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-language-selector-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>
        Default Language Code
        <input value={d.defaultCode ?? ''} placeholder="en" onChange={(e) => update({ defaultCode: e.target.value })} />
      </label>
      <label>
        Fallback Language Code
        <input value={d.fallbackCode ?? ''} placeholder="en" onChange={(e) => update({ fallbackCode: e.target.value })} />
      </label>
      <label>
        <input type="checkbox" checked={d.persistPreference === true} onChange={(e) => update({ persistPreference: e.target.checked })} />
        &nbsp;Persist learner preference
      </label>

      <div className="tpl-language-selector-editor__head">
        <h3>Language Options</h3>
        <button type="button" onClick={() => update({ options: [...options, { code: '', label: '', rtl: false }] })}>+ Add Language</button>
      </div>
      {options.map((opt, idx) => (
        <div key={idx} className="tpl-language-selector-editor__row">
          <input value={opt.code} placeholder="Code (e.g. en)" onChange={(e) => update({ options: options.map((x, i) => i === idx ? { ...x, code: e.target.value } : x) })} />
          <input value={opt.label} placeholder="Label (e.g. English)" onChange={(e) => update({ options: options.map((x, i) => i === idx ? { ...x, label: e.target.value } : x) })} />
          <label style={{ whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={opt.rtl === true} onChange={(e) => update({ options: options.map((x, i) => i === idx ? { ...x, rtl: e.target.checked } : x) })} />
            &nbsp;RTL
          </label>
          <button type="button" onClick={() => update({ options: options.filter((_, i) => i !== idx) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
