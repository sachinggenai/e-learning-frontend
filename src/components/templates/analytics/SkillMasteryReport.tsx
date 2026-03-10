import React from 'react';
import { Target } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './SkillMasteryReport.css';

export interface SkillMasteryItem {
  id: string;
  skill: string;
  score: number;
  evidenceCount?: number;
}

export interface SkillMasteryReportData {
  title?: string;
  items?: SkillMasteryItem[];
  lowThreshold?: number;
  highThreshold?: number;
  displayMode?: 'list' | 'radar';
}

export const SkillMasteryReportPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const d = data as SkillMasteryReportData;
  const items = [...(d.items ?? [])].sort((a, b) => b.score - a.score);
  const low = d.lowThreshold ?? 50;
  const high = d.highThreshold ?? 80;

  return (
    <article className="tpl-skill-mastery-report">
      <h2 className="tpl-skill-mastery-report__title"><Target size={20} /> {d.title?.trim() || 'Skill Mastery Report'}</h2>
      <p className="tpl-skill-mastery-report__mode">Display mode: {d.displayMode ?? 'list'}</p>
      {items.length === 0 ? (
        <p className="tpl-skill-mastery-report__empty">No skills configured yet.</p>
      ) : (
        <ul className="tpl-skill-mastery-report__list">
          {items.map((i) => {
            const level = i.score >= high ? 'high' : i.score >= low ? 'medium' : 'low';
            return (
              <li key={i.id} className={`tpl-skill-mastery-report__item tpl-skill-mastery-report__item--${level}`}>
                <div className="tpl-skill-mastery-report__head">
                  <button
                    type="button"
                    className="tpl-skill-mastery-report__skill-btn"
                    onClick={() => onInteraction?.({
                      componentId,
                      interactionType: 'skill_viewed',
                      interactionId: i.id,
                      value: i.skill,
                      completed: false,
                    })}
                  >
                    {i.skill}
                  </button>
                  <strong>{i.score}%</strong>
                </div>
                <div className="tpl-skill-mastery-report__track"><div className="tpl-skill-mastery-report__fill" style={{ width: `${i.score}%` }} /></div>
                {typeof i.evidenceCount === 'number' && <small>Evidence: {i.evidenceCount}</small>}
                {level === 'low' && (
                  <button
                    type="button"
                    className="tpl-skill-mastery-report__gap-focus-btn"
                    onClick={() => onInteraction?.({
                      componentId,
                      interactionType: 'gap_focus_selected',
                      interactionId: i.id,
                      value: i.skill,
                      completed: false,
                    })}
                  >
                    Focus This Gap
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
};

export const SkillMasteryReportEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as SkillMasteryReportData;
  const items = d.items ?? [];
  const update = (patch: Partial<SkillMasteryReportData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-skill-mastery-report-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <div className="tpl-skill-mastery-report-editor__row">
        <label>Low Threshold<input type="number" min={0} max={100} value={d.lowThreshold ?? 50} onChange={(e) => update({ lowThreshold: Number(e.target.value) })} /></label>
        <label>High Threshold<input type="number" min={0} max={100} value={d.highThreshold ?? 80} onChange={(e) => update({ highThreshold: Number(e.target.value) })} /></label>
      </div>
      <label>Display Mode
        <select value={d.displayMode ?? 'list'} onChange={(e) => update({ displayMode: e.target.value as 'list' | 'radar' })}>
          <option value="list">List</option>
          <option value="radar">Radar</option>
        </select>
      </label>

      <div className="tpl-skill-mastery-report-editor__head">
        <h3>Skills</h3>
        <button type="button" onClick={() => update({ items: [...items, { id: `sm-${Date.now()}`, skill: '', score: 0 }] })}>+ Add Skill</button>
      </div>
      {items.map((i) => (
        <div key={i.id} className="tpl-skill-mastery-report-editor__item">
          <input value={i.skill} placeholder="Skill" onChange={(e) => update({ items: items.map((x) => x.id === i.id ? { ...x, skill: e.target.value } : x) })} />
          <input type="number" min={0} max={100} value={i.score} onChange={(e) => update({ items: items.map((x) => x.id === i.id ? { ...x, score: Number(e.target.value) } : x) })} />
          <button type="button" onClick={() => update({ items: items.filter((x) => x.id !== i.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
