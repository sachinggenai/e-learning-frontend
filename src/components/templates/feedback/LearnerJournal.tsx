import React, { useState } from 'react';
import { BookOpenText, CalendarDays, Plus, CheckCircle2 } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './LearnerJournal.css';

interface JournalEntry {
  id: string;
  text: string;
  createdAt: string;
}

export interface LearnerJournalData {
  title?: string;
  prompts?: string[];
  maxEntries?: number;
}

export const LearnerJournalPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const journalData = data as LearnerJournalData;
  const [draft, setDraft] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const title = journalData.title?.trim() || 'My Learning Journal';
  const prompts = journalData.prompts?.filter(Boolean) ?? [];
  const maxEntries = Math.max(1, Number(journalData.maxEntries ?? 10));
  const canAddEntry = entries.length < maxEntries;

  const saveEntry = () => {
    const text = draft.trim();
    if (!text || !canAddEntry) {
      return;
    }

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
    };

    const next = [newEntry, ...entries];
    setEntries(next);
    setDraft('');

    onInteraction?.({
      componentId,
      interactionType: 'journal-entry-saved',
      interactionId: newEntry.id,
      value: text,
      completed: true,
    });
    onComplete?.(componentId);
  };

  return (
    <article className="tpl-learner-journal">
      <header className="tpl-learner-journal__header">
        <h2 className="tpl-learner-journal__title">
          <BookOpenText size={20} /> {title}
        </h2>
        {prompts.length > 0 ? (
          <ul className="tpl-learner-journal__prompts">
            {prompts.map((prompt, index) => (
              <li key={`${prompt}-${index}`} className="tpl-learner-journal__prompt-item">{prompt}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <label className="tpl-learner-journal__label" htmlFor="learner-journal-entry">Journal Entry</label>
      <textarea
        id="learner-journal-entry"
        className="tpl-learner-journal__textarea"
        rows={5}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write your reflection for today"
      />
      <button
        type="button"
        className="tpl-learner-journal__save-btn"
        onClick={saveEntry}
        disabled={!draft.trim() || !canAddEntry}
      >
        <Plus size={16} /> Save Entry
      </button>

      <p className="tpl-learner-journal__limit">{entries.length}/{maxEntries} entries used</p>

      {entries.length > 0 ? (
        <section className="tpl-learner-journal__entries" aria-label="Saved journal entries">
          {entries.map((entry) => (
            <article key={entry.id} className="tpl-learner-journal__entry-card">
              <p className="tpl-learner-journal__entry-text">{entry.text}</p>
              <p className="tpl-learner-journal__entry-meta">
                <CalendarDays size={14} /> {new Date(entry.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </section>
      ) : (
        <p className="tpl-learner-journal__empty">
          <CheckCircle2 size={16} /> Your saved entries will appear here.
        </p>
      )}
    </article>
  );
};

export const LearnerJournalEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const journalData = data as LearnerJournalData;
  const prompts = journalData.prompts ?? [];

  const update = (patch: Partial<LearnerJournalData>) => {
    onChange({ data: { ...journalData, ...patch } });
  };

  const updatePrompt = (index: number, value: string) => {
    const next = [...prompts];
    next[index] = value;
    update({ prompts: next });
  };

  const addPrompt = () => update({ prompts: [...prompts, ''] });
  const removePrompt = (index: number) => update({ prompts: prompts.filter((_, i) => i !== index) });

  return (
    <section className="tpl-learner-journal-editor">
      <div className="tpl-learner-journal-editor__field">
        <label className="tpl-learner-journal-editor__label" htmlFor="journal-title">Title</label>
        <input
          id="journal-title"
          className="tpl-learner-journal-editor__input"
          type="text"
          value={journalData.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="My Learning Journal"
        />
      </div>

      <div className="tpl-learner-journal-editor__field">
        <label className="tpl-learner-journal-editor__label" htmlFor="journal-max-entries">Max Entries</label>
        <input
          id="journal-max-entries"
          className="tpl-learner-journal-editor__input"
          type="number"
          min={1}
          value={journalData.maxEntries ?? 10}
          onChange={(e) => update({ maxEntries: Number(e.target.value) || 1 })}
        />
      </div>

      <div className="tpl-learner-journal-editor__field">
        <div className="tpl-learner-journal-editor__field-head">
          <label className="tpl-learner-journal-editor__label">Prompts</label>
          <button type="button" className="tpl-learner-journal-editor__add-btn" onClick={addPrompt}>Add Prompt</button>
        </div>
        {prompts.map((prompt, index) => (
          <div key={`prompt-${index}`} className="tpl-learner-journal-editor__prompt-row">
            <input
              className="tpl-learner-journal-editor__input"
              type="text"
              value={prompt}
              onChange={(e) => updatePrompt(index, e.target.value)}
              placeholder={`Prompt ${index + 1}`}
            />
            <button
              type="button"
              className="tpl-learner-journal-editor__remove-btn"
              onClick={() => removePrompt(index)}
              aria-label={`Remove prompt ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
