import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PerformanceDashboardEditor, PerformanceDashboardPreview, PerformanceDashboardData } from './PerformanceDashboard';

const mockData: PerformanceDashboardData = {
  title: 'Performance Dashboard',
  kpis: [{ id: 'k1', label: 'Avg Score', value: 82, unit: '%', trendPct: 5 }],
  chartSeries: [{ name: 'Score', points: [60, 70, 82] }],
  chartType: 'line',
  filterSummary: 'Last 30 days',
  showLegend: true,
};

describe('PerformanceDashboardPreview', () => {
  test('renders KPI cards', () => {
    render(<PerformanceDashboardPreview data={mockData} />);
    expect(screen.getByText('Avg Score')).toBeInTheDocument();
    expect(screen.getByText('82%')).toBeInTheDocument();
  });

  test('renders chart summary when series exists', () => {
    render(<PerformanceDashboardPreview data={mockData} />);
    expect(screen.getByText(/Trend/)).toBeInTheDocument();
    expect(screen.getByText(/Score: 60, 70, 82/)).toBeInTheDocument();
  });

  test('fires kpi_opened and chart_filtered events', () => {
    const onInteraction = jest.fn();
    render(<PerformanceDashboardPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Avg Score/ }));
    fireEvent.click(screen.getByRole('button', { name: /Apply Chart Filter/ }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'kpi_opened' }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'chart_filtered' }));
  });

  test('shows empty state', () => {
    render(<PerformanceDashboardPreview data={{ kpis: [] }} />);
    expect(screen.getByText('No KPI metrics configured yet.')).toBeInTheDocument();
  });
});

describe('PerformanceDashboardEditor', () => {
  test('adds KPI row', () => {
    const onChange = jest.fn();
    render(<PerformanceDashboardEditor data={mockData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add KPI/i }));
    expect(onChange).toHaveBeenCalled();
  });

  test('updates filter summary', () => {
    const onChange = jest.fn();
    render(<PerformanceDashboardEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Date range: Last 30 days'), { target: { value: 'Last 7 days' } });
    expect(onChange).toHaveBeenCalled();
  });
});
