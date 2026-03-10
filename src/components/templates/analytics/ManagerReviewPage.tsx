import React, { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './ManagerReviewPage.css';

export interface ManagerLearnerRow {
  learnerId: string;
  learnerName: string;
  progressPct: number;
  averageScore?: number;
  status: 'on-track' | 'at-risk' | 'completed';
  lastActiveAt?: string;
}

export interface ManagerReviewPageData {
  title?: string;
  rows?: ManagerLearnerRow[];
  riskThresholdPct?: number;
  showActions?: boolean;
  defaultFilter?: 'all' | 'on-track' | 'at-risk' | 'completed';
  defaultSort?: 'name' | 'progress' | 'score';
  showExport?: boolean;
}

export const ManagerReviewPagePreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const d = data as ManagerReviewPageData;
  const rows = d.rows ?? [];
  const showActions = d.showActions !== false;
  const [filter, setFilter] = useState<ManagerReviewPageData['defaultFilter']>(d.defaultFilter ?? 'all');
  const [sortBy, setSortBy] = useState<ManagerReviewPageData['defaultSort']>(d.defaultSort ?? 'name');

  const filteredAndSortedRows = useMemo(() => {
    const filtered = filter === 'all' ? rows : rows.filter((row) => row.status === filter);
    const sorted = [...filtered];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.learnerName.localeCompare(b.learnerName));
    } else if (sortBy === 'progress') {
      sorted.sort((a, b) => b.progressPct - a.progressPct);
    } else {
      sorted.sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
    }
    return sorted;
  }, [filter, rows, sortBy]);

  return (
    <article className="tpl-manager-review-page">
      <h2 className="tpl-manager-review-page__title"><Users size={20} /> {d.title?.trim() || 'Manager Review Page'}</h2>
      <div className="tpl-manager-review-page__controls">
        <label>
          Filter
          <select
            value={filter}
            onChange={(e) => {
              const nextFilter = e.target.value as ManagerReviewPageData['defaultFilter'];
              setFilter(nextFilter);
              onInteraction?.({
                componentId,
                interactionType: 'manager_filter_changed',
                interactionId: 'status-filter',
                value: nextFilter,
                completed: false,
              });
            }}
          >
            <option value="all">all</option>
            <option value="on-track">on-track</option>
            <option value="at-risk">at-risk</option>
            <option value="completed">completed</option>
          </select>
        </label>
        <label>
          Sort
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as ManagerReviewPageData['defaultSort'])}>
            <option value="name">name</option>
            <option value="progress">progress</option>
            <option value="score">score</option>
          </select>
        </label>
        {d.showExport !== false && (
          <button
            type="button"
            className="tpl-manager-review-page__export"
            onClick={() => onInteraction?.({
              componentId,
              interactionType: 'manager_export_triggered',
              interactionId: 'export',
              value: filteredAndSortedRows.length,
              completed: false,
            })}
          >
            Export
          </button>
        )}
      </div>
      {filteredAndSortedRows.length === 0 ? (
        <p className="tpl-manager-review-page__empty">No learner rows configured yet.</p>
      ) : (
        <table className="tpl-manager-review-page__table">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Progress</th>
              <th>Score</th>
              <th>Status</th>
              <th>Last Active</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRows.map((r) => (
              <tr key={r.learnerId}>
                <td>{r.learnerName}</td>
                <td>{r.progressPct}%</td>
                <td>{typeof r.averageScore === 'number' ? `${r.averageScore}%` : 'N/A'}</td>
                <td><span className={`tpl-manager-review-page__status tpl-manager-review-page__status--${r.status}`}>{r.status}</span></td>
                <td>{r.lastActiveAt ? new Date(r.lastActiveAt).toLocaleDateString() : 'N/A'}</td>
                {showActions && (
                  <td>
                    <button type="button" onClick={() => onInteraction?.({ componentId, interactionType: 'learner_opened', interactionId: r.learnerId, value: r.learnerName, completed: false })}>Open</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
};

export const ManagerReviewPageEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as ManagerReviewPageData;
  const rows = d.rows ?? [];
  const update = (patch: Partial<ManagerReviewPageData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-manager-review-page-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Risk Threshold %<input type="number" min={0} max={100} value={d.riskThresholdPct ?? 60} onChange={(e) => update({ riskThresholdPct: Number(e.target.value) })} /></label>
      <label><input type="checkbox" checked={d.showActions !== false} onChange={(e) => update({ showActions: e.target.checked })} /> Show actions</label>
      <label><input type="checkbox" checked={d.showExport !== false} onChange={(e) => update({ showExport: e.target.checked })} /> Show export</label>
      <label>
        Default Filter
        <select value={d.defaultFilter ?? 'all'} onChange={(e) => update({ defaultFilter: e.target.value as ManagerReviewPageData['defaultFilter'] })}>
          <option value="all">all</option>
          <option value="on-track">on-track</option>
          <option value="at-risk">at-risk</option>
          <option value="completed">completed</option>
        </select>
      </label>
      <label>
        Default Sort
        <select value={d.defaultSort ?? 'name'} onChange={(e) => update({ defaultSort: e.target.value as ManagerReviewPageData['defaultSort'] })}>
          <option value="name">name</option>
          <option value="progress">progress</option>
          <option value="score">score</option>
        </select>
      </label>

      <div className="tpl-manager-review-page-editor__head">
        <h3>Rows</h3>
        <button type="button" onClick={() => update({ rows: [...rows, { learnerId: `l-${Date.now()}`, learnerName: '', progressPct: 0, status: 'on-track' }] })}>+ Add Row</button>
      </div>

      {rows.map((r) => (
        <div key={r.learnerId} className="tpl-manager-review-page-editor__row">
          <input value={r.learnerName} placeholder="Learner name" onChange={(e) => update({ rows: rows.map((x) => x.learnerId === r.learnerId ? { ...x, learnerName: e.target.value } : x) })} />
          <input type="number" min={0} max={100} value={r.progressPct} onChange={(e) => update({ rows: rows.map((x) => x.learnerId === r.learnerId ? { ...x, progressPct: Number(e.target.value) } : x) })} />
          <select value={r.status} onChange={(e) => update({ rows: rows.map((x) => x.learnerId === r.learnerId ? { ...x, status: e.target.value as ManagerLearnerRow['status'] } : x) })}>
            <option value="on-track">on-track</option>
            <option value="at-risk">at-risk</option>
            <option value="completed">completed</option>
          </select>
          <button type="button" onClick={() => update({ rows: rows.filter((x) => x.learnerId !== r.learnerId) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
