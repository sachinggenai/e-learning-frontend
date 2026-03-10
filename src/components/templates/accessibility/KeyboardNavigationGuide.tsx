import React, { useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './KeyboardNavigationGuide.css';

export interface ShortcutItem {
  id: string;
  combo: string;
  action: string;
  context?: string;
}

export interface KeyboardNavigationGuideData {
  title?: string;
  intro?: string;
  shortcuts?: ShortcutItem[];
  osMode?: 'auto' | 'windows' | 'mac';
  showPracticeMode?: boolean;
}

function resolveCombo(combo: string, osMode: 'auto' | 'windows' | 'mac'): string {
  const isMac = osMode === 'mac' || (osMode === 'auto' && typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform));
  return isMac ? combo.replace(/\bCtrl\b/g, 'Cmd').replace(/\bAlt\b/g, 'Option') : combo;
}

function groupByContext(shortcuts: ShortcutItem[]): Record<string, ShortcutItem[]> {
  return shortcuts.reduce<Record<string, ShortcutItem[]>>((acc, s) => {
    const key = s.context?.trim() || 'General';
    (acc[key] = acc[key] ?? []).push(s);
    return acc;
  }, {});
}

export const KeyboardNavigationGuidePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as KeyboardNavigationGuideData;
  const shortcuts = d.shortcuts ?? [];
  const osMode = d.osMode ?? 'auto';
  const [practiceActive, setPracticeActive] = useState(false);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceResult, setPracticeResult] = useState<'correct' | 'wrong' | null>(null);
  const grouped = groupByContext(shortcuts);

  useEffect(() => {
    onInteraction?.({
      componentId,
      interactionType: 'shortcut_viewed',
      interactionId: 'guide',
      value: shortcuts.length,
      completed: false,
    });
  }, [componentId, shortcuts.length, onInteraction]);

  const currentTarget = shortcuts[practiceIndex];

  const handlePracticeCheck = () => {
    if (!currentTarget) return;
    const expected = resolveCombo(currentTarget.combo, osMode).toLowerCase();
    const isCorrect = practiceInput.trim().toLowerCase() === expected;
    setPracticeResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      const nextIndex = practiceIndex + 1;
      if (nextIndex >= shortcuts.length) {
        onInteraction?.({
          componentId,
          interactionType: 'practice_mode_completed',
          interactionId: 'practice',
          value: shortcuts.length,
          completed: true,
        });
        onComplete?.(componentId);
      } else {
        setTimeout(() => {
          setPracticeIndex(nextIndex);
          setPracticeInput('');
          setPracticeResult(null);
        }, 700);
      }
    }
  };

  return (
    <article className="tpl-keyboard-guide">
      <h2 className="tpl-keyboard-guide__title">
        <Keyboard size={20} aria-hidden="true" />
        {d.title?.trim() || 'Keyboard Navigation Guide'}
      </h2>
      {d.intro?.trim() && <p className="tpl-keyboard-guide__intro">{d.intro}</p>}

      {shortcuts.length === 0 ? (
        <p className="tpl-keyboard-guide__empty">No shortcuts configured yet.</p>
      ) : (
        Object.entries(grouped).map(([ctx, items]) => (
          <section key={ctx} className="tpl-keyboard-guide__group">
            <h3 className="tpl-keyboard-guide__group-title">{ctx}</h3>
            <table className="tpl-keyboard-guide__table" role="table">
              <thead>
                <tr>
                  <th scope="col">Shortcut</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <kbd className="tpl-keyboard-guide__kbd">{resolveCombo(s.combo, osMode)}</kbd>
                    </td>
                    <td>{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}

      {d.showPracticeMode && shortcuts.length > 0 && (
        <div className="tpl-keyboard-guide__practice">
          {!practiceActive ? (
            <button
              type="button"
              className="tpl-keyboard-guide__practice-btn"
              onClick={() => {
                setPracticeActive(true);
                setPracticeIndex(0);
                setPracticeInput('');
                setPracticeResult(null);
                onInteraction?.({
                  componentId,
                  interactionType: 'practice_mode_started',
                  interactionId: 'practice',
                  value: shortcuts.length,
                  completed: false,
                });
              }}
            >
              Start Practice Mode
            </button>
          ) : (
            <div className="tpl-keyboard-guide__practice-panel">
              {practiceIndex < shortcuts.length ? (
                <>
                  <p className="tpl-keyboard-guide__practice-prompt">
                    Type the shortcut for: <strong>{currentTarget?.action}</strong>
                  </p>
                  <input
                    className="tpl-keyboard-guide__practice-input"
                    value={practiceInput}
                    onChange={(e) => { setPracticeInput(e.target.value); setPracticeResult(null); }}
                    placeholder={`e.g. ${resolveCombo('Ctrl+C', osMode)}`}
                    aria-label={`Enter shortcut for ${currentTarget?.action}`}
                  />
                  <button type="button" onClick={handlePracticeCheck}>Check</button>
                  {practiceResult === 'correct' && <span className="tpl-keyboard-guide__practice-ok" role="status">✓ Correct!</span>}
                  {practiceResult === 'wrong' && <span className="tpl-keyboard-guide__practice-err" role="alert">✗ Try again. Expected: {resolveCombo(currentTarget.combo, osMode)}</span>}
                  <p className="tpl-keyboard-guide__practice-progress">{practiceIndex + 1} / {shortcuts.length}</p>
                </>
              ) : (
                <p role="status" className="tpl-keyboard-guide__practice-done">Practice complete!</p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export const KeyboardNavigationGuideEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as KeyboardNavigationGuideData;
  const shortcuts = d.shortcuts ?? [];
  const update = (patch: Partial<KeyboardNavigationGuideData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-keyboard-guide-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Introduction<textarea rows={2} value={d.intro ?? ''} onChange={(e) => update({ intro: e.target.value })} /></label>
      <label>
        OS Mode
        <select value={d.osMode ?? 'auto'} onChange={(e) => update({ osMode: e.target.value as KeyboardNavigationGuideData['osMode'] })}>
          <option value="auto">Auto-detect</option>
          <option value="windows">Windows (Ctrl)</option>
          <option value="mac">macOS (Cmd)</option>
        </select>
      </label>
      <label>
        <input type="checkbox" checked={d.showPracticeMode === true} onChange={(e) => update({ showPracticeMode: e.target.checked })} />
        &nbsp;Enable practice mode
      </label>

      <div className="tpl-keyboard-guide-editor__head">
        <h3>Shortcuts</h3>
        <button type="button" onClick={() => update({ shortcuts: [...shortcuts, { id: `sc-${Date.now()}`, combo: '', action: '', context: '' }] })}>+ Add Shortcut</button>
      </div>

      {shortcuts.map((s) => (
        <div key={s.id} className="tpl-keyboard-guide-editor__row">
          <input value={s.combo} placeholder="Ctrl+S" onChange={(e) => update({ shortcuts: shortcuts.map((x) => x.id === s.id ? { ...x, combo: e.target.value } : x) })} />
          <input value={s.action} placeholder="Action description" onChange={(e) => update({ shortcuts: shortcuts.map((x) => x.id === s.id ? { ...x, action: e.target.value } : x) })} />
          <input value={s.context ?? ''} placeholder="Context (e.g. Global)" onChange={(e) => update({ shortcuts: shortcuts.map((x) => x.id === s.id ? { ...x, context: e.target.value } : x) })} />
          <button type="button" onClick={() => update({ shortcuts: shortcuts.filter((x) => x.id !== s.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
