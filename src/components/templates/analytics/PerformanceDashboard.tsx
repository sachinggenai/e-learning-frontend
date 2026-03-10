import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './PerformanceDashboard.css';

export interface DashboardKPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trendPct?: number;
  target?: number;
}

export interface PerformanceDashboardData {
  title?: string;
  kpis?: DashboardKPI[];
  chartSeries?: Array<{ name: string; points: number[] }>;
  chartLabels?: string[];
  chartType?: 'line' | 'bar';
  filterSummary?: string;
  showLegend?: boolean;
}

function TrendIcon({ trend }: { trend?: number }) {
  if (typeof trend !== 'number') return <Minus size={14} />;
  if (trend > 0) return <TrendingUp size={14} />;
  if (trend < 0) return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

export const PerformanceDashboardPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const d = data as PerformanceDashboardData;
  const kpis = d.kpis ?? [];
  const chartSeries = d.chartSeries ?? [];

  return (
    <article className="tpl-performance-dashboard">
      <h2 className="tpl-performance-dashboard__title">{d.title?.trim() || 'Performance Dashboard'}</h2>

      {kpis.length === 0 ? (
        <p className="tpl-performance-dashboard__empty">No KPI metrics configured yet.</p>
      ) : (
        <div className="tpl-performance-dashboard__kpis">
          {kpis.map((kpi) => (
            <button
              key={kpi.id}
              type="button"
              className="tpl-performance-dashboard__kpi-card"
              onClick={() => onInteraction?.({
                componentId,
                interactionType: 'kpi_opened',
                interactionId: kpi.id,
                value: kpi.label,
                completed: false,
              })}
            >
              <p className="tpl-performance-dashboard__kpi-label">{kpi.label}</p>
              <p className="tpl-performance-dashboard__kpi-value">{kpi.value}{kpi.unit ?? ''}</p>
              <p className="tpl-performance-dashboard__kpi-trend">
                <TrendIcon trend={kpi.trendPct} />
                {typeof kpi.trendPct === 'number' ? `${kpi.trendPct}%` : 'No trend'}
              </p>
              {typeof kpi.target === 'number' && (
                <p className="tpl-performance-dashboard__kpi-target">Target: {kpi.target}{kpi.unit ?? ''}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {chartSeries.length > 0 && (
        <section className="tpl-performance-dashboard__chart">
          <h3>Trend ({d.chartType ?? 'line'})</h3>
          {d.filterSummary && <p className="tpl-performance-dashboard__filter">{d.filterSummary}</p>}
          {d.showLegend !== false && (
            <p className="tpl-performance-dashboard__legend">Legend: {chartSeries.map((s) => s.name).join(', ')}</p>
          )}
          <button
            type="button"
            className="tpl-performance-dashboard__filter-btn"
            onClick={() => onInteraction?.({
              componentId,
              interactionType: 'chart_filtered',
              interactionId: 'chart-filter',
              value: d.filterSummary ?? 'default',
              completed: false,
            })}
          >
            Apply Chart Filter
          </button>
          <ul>
            {chartSeries.map((s) => (
              <li key={s.name}>{s.name}: {s.points.join(', ')}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};

export const PerformanceDashboardEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as PerformanceDashboardData;
  const kpis = d.kpis ?? [];
  const update = (patch: Partial<PerformanceDashboardData>) => onChange({ data: { ...d, ...patch } });

  const moveKpi = (index: number, direction: -1 | 1) => {
    const next = [...kpis];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= next.length) {
      return;
    }
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    update({ kpis: next });
  };

  return (
    <section className="tpl-performance-dashboard-editor">
      <label>
        Title
        <input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} />
      </label>

      <label>
        Chart Type
        <select value={d.chartType ?? 'line'} onChange={(e) => update({ chartType: e.target.value as 'line' | 'bar' })}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      </label>

      <label>
        Filter Summary
        <input value={d.filterSummary ?? ''} onChange={(e) => update({ filterSummary: e.target.value })} placeholder="Date range: Last 30 days" />
      </label>

      <label className="tpl-performance-dashboard-editor__checkbox">
        <input type="checkbox" checked={d.showLegend !== false} onChange={(e) => update({ showLegend: e.target.checked })} />
        Show legend
      </label>

      <div className="tpl-performance-dashboard-editor__head">
        <h3>KPIs</h3>
        <button type="button" onClick={() => update({ kpis: [...kpis, { id: `k-${Date.now()}`, label: '', value: 0 }] })}>+ Add KPI</button>
      </div>

      {kpis.map((kpi) => (
        <div key={kpi.id} className="tpl-performance-dashboard-editor__kpi">
          <input value={kpi.label} placeholder="Label" onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, label: e.target.value } : x) })} />
          <input type="number" value={kpi.value} onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, value: Number(e.target.value) } : x) })} />
          <input value={kpi.unit ?? ''} placeholder="Unit" onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, unit: e.target.value } : x) })} />
          <input type="number" value={kpi.trendPct ?? 0} onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, trendPct: Number(e.target.value) } : x) })} />
          <input type="number" value={kpi.target ?? 0} onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, target: Number(e.target.value) } : x) })} />
          <button type="button" onClick={() => moveKpi(kpis.findIndex((x) => x.id === kpi.id), -1)} aria-label="Move KPI up">Up</button>
          <button type="button" onClick={() => moveKpi(kpis.findIndex((x) => x.id === kpi.id), 1)} aria-label="Move KPI down">Down</button>
          <button type="button" onClick={() => update({ kpis: kpis.filter((x) => x.id !== kpi.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
