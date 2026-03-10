import React, { useMemo, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './AuditChecklist.css';

export interface AuditChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed: boolean;
  notes?: string;
  evidenceUrl?: string;
  completedAt?: string;
}

export interface AuditChecklistData {
  title?: string;
  items?: AuditChecklistItem[];
  completionPct?: number;
  reviewerName?: string;
  reviewedAt?: string;
}

interface AuditLogEntry {
  id: string;
  text: string;
  at: string;
}

export const AuditChecklistPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction, onComplete }) => {
  const d = data as AuditChecklistData;
  const [items, setItems] = useState<AuditChecklistItem[]>(d.items ?? []);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const requiredItems = items.filter((i) => i.required);
  const requiredComplete = requiredItems.filter((i) => i.completed).length;
  const completionPct = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }
    return Math.round((items.filter((i) => i.completed).length / items.length) * 100);
  }, [items]);

  const addLog = (text: string) => {
    setLogs((prev) => [{ id: `log-${Date.now()}`, text, at: new Date().toISOString() }, ...prev]);
  };

  const toggleItem = (itemId: string, checked: boolean) => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((item) => item.id === itemId ? { ...item, completed: checked, completedAt: checked ? now : undefined } : item));
    onInteraction?.({
      componentId,
      interactionType: 'checklist_item_toggled',
      interactionId: itemId,
      value: checked,
      completed: false,
    });
    addLog(`Item ${itemId} set to ${checked ? 'complete' : 'pending'}`);
  };

  const updateNote = (itemId: string, notes: string) => {
    setItems((prev) => prev.map((item) => item.id === itemId ? { ...item, notes } : item));
    onInteraction?.({
      componentId,
      interactionType: 'checklist_note_added',
      interactionId: itemId,
      value: notes,
      completed: false,
    });
    addLog(`Note updated for ${itemId}`);
  };

  const canSubmit = requiredItems.every((item) => item.completed);

  return (
    <article className="tpl-audit-checklist">
      <h2 className="tpl-audit-checklist__title"><ClipboardCheck size={20} /> {d.title?.trim() || 'Audit Checklist'}</h2>
      <p className="tpl-audit-checklist__summary">Completion: {completionPct}% ({requiredComplete}/{requiredItems.length} required completed)</p>

      <div className="tpl-audit-checklist__grid">
        <section className="tpl-audit-checklist__items">
          {items.length === 0 ? (
            <p className="tpl-audit-checklist__empty">No checklist items configured yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="tpl-audit-checklist__item">
                <label>
                  <input type="checkbox" checked={item.completed} onChange={(e) => toggleItem(item.id, e.target.checked)} />
                  <span>{item.label}</span>
                  {item.required && <span className="tpl-audit-checklist__required">required</span>}
                </label>
                <input
                  type="url"
                  placeholder="Evidence URL"
                  value={item.evidenceUrl ?? ''}
                  onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, evidenceUrl: e.target.value } : x))}
                />
                <textarea
                  rows={2}
                  placeholder="Reviewer notes"
                  value={item.notes ?? ''}
                  onChange={(e) => updateNote(item.id, e.target.value)}
                />
                {item.completedAt && <small>Completed: {new Date(item.completedAt).toLocaleString()}</small>}
              </div>
            ))
          )}
        </section>

        <aside className="tpl-audit-checklist__trail">
          <h3>Audit Trail</h3>
          {logs.length === 0 ? <p>No interactions logged yet.</p> : (
            <ul>
              {logs.map((log) => <li key={log.id}>{new Date(log.at).toLocaleTimeString()} - {log.text}</li>)}
            </ul>
          )}
        </aside>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => {
          const submittedAt = new Date().toISOString();
          onInteraction?.({
            componentId,
            interactionType: 'checklist_submitted',
            interactionId: 'submit',
            value: { reviewerName: d.reviewerName, submittedAt, completionPct, items },
            completed: true,
          });
          onComplete?.(componentId);
          addLog('Checklist submitted');
        }}
      >
        Submit Checklist
      </button>
    </article>
  );
};

export const AuditChecklistEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as AuditChecklistData;
  const items = d.items ?? [];
  const update = (patch: Partial<AuditChecklistData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-audit-checklist-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Reviewer Name<input value={d.reviewerName ?? ''} onChange={(e) => update({ reviewerName: e.target.value })} /></label>
      <label>Reviewed At<input type="datetime-local" value={d.reviewedAt ?? ''} onChange={(e) => update({ reviewedAt: e.target.value })} /></label>

      <div className="tpl-audit-checklist-editor__head">
        <h3>Checklist Items</h3>
        <button type="button" onClick={() => update({ items: [...items, { id: `item-${Date.now()}`, label: '', required: true, completed: false }] })}>+ Add Item</button>
      </div>

      {items.map((item) => (
        <div key={item.id} className="tpl-audit-checklist-editor__row">
          <input value={item.label} placeholder="Item label" onChange={(e) => update({ items: items.map((x) => x.id === item.id ? { ...x, label: e.target.value } : x) })} />
          <label><input type="checkbox" checked={item.required} onChange={(e) => update({ items: items.map((x) => x.id === item.id ? { ...x, required: e.target.checked } : x) })} /> Required</label>
          <button type="button" onClick={() => update({ items: items.filter((x) => x.id !== item.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
