import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PerformanceDashboardEditor, PerformanceDashboardPreview, PerformanceDashboardData } from './PerformanceDashboard';

const mockData: PerformanceDashboardData = {
  title: 'Performance Dashboard',
  kpis: [{ id: 'k1', label: 'Avg Score', value: 82, unit: '%', trendPct: 5 }],
  chartSeries: [{ name: 'Score', points: [60, 70, 82] }],
  chartType: 'line',
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
});
