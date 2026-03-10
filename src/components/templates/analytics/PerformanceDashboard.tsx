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
}

function TrendIcon({ trend }: { trend?: number }) {
  if (typeof trend !== 'number') return <Minus size={14} />;
  if (trend > 0) return <TrendingUp size={14} />;
  if (trend < 0) return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

export const PerformanceDashboardPreview: React.FC<ComponentPreviewProps> = ({ data }) => {
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
            <section key={kpi.id} className="tpl-performance-dashboard__kpi-card">
              <p className="tpl-performance-dashboard__kpi-label">{kpi.label}</p>
              <p className="tpl-performance-dashboard__kpi-value">{kpi.value}{kpi.unit ?? ''}</p>
              <p className="tpl-performance-dashboard__kpi-trend">
                <TrendIcon trend={kpi.trendPct} />
                {typeof kpi.trendPct === 'number' ? `${kpi.trendPct}%` : 'No trend'}
              </p>
              {typeof kpi.target === 'number' && (
                <p className="tpl-performance-dashboard__kpi-target">Target: {kpi.target}{kpi.unit ?? ''}</p>
              )}
            </section>
          ))}
        </div>
      )}

      {chartSeries.length > 0 && (
        <section className="tpl-performance-dashboard__chart">
          <h3>Trend ({d.chartType ?? 'line'})</h3>
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

      <div className="tpl-performance-dashboard-editor__head">
        <h3>KPIs</h3>
        <button type="button" onClick={() => update({ kpis: [...kpis, { id: `k-${Date.now()}`, label: '', value: 0 }] })}>+ Add KPI</button>
      </div>

      {kpis.map((kpi) => (
        <div key={kpi.id} className="tpl-performance-dashboard-editor__kpi">
          <input value={kpi.label} placeholder="Label" onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, label: e.target.value } : x) })} />
          <input type="number" value={kpi.value} onChange={(e) => update({ kpis: kpis.map((x) => x.id === kpi.id ? { ...x, value: Number(e.target.value) } : x) })} />
          <button type="button" onClick={() => update({ kpis: kpis.filter((x) => x.id !== kpi.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
