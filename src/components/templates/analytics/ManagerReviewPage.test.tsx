import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ManagerReviewPageEditor, ManagerReviewPagePreview, ManagerReviewPageData } from './ManagerReviewPage';

const mockData: ManagerReviewPageData = {
  title: 'Manager View',
  rows: [
    { learnerId: 'l1', learnerName: 'Alice', progressPct: 90, averageScore: 88, status: 'on-track', lastActiveAt: '2026-03-01' },
    { learnerId: 'l2', learnerName: 'Bob', progressPct: 45, averageScore: 52, status: 'at-risk', lastActiveAt: '2026-03-02' },
  ],
  showActions: true,
  showExport: true,
  defaultFilter: 'all',
  defaultSort: 'name',
};

describe('ManagerReviewPagePreview', () => {
  test('renders learner rows and statuses', () => {
    render(<ManagerReviewPagePreview data={mockData} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getAllByText('on-track').length).toBeGreaterThan(0);
    expect(screen.getAllByText('at-risk').length).toBeGreaterThan(0);
  });

  test('fires learner open action', () => {
    const onInteraction = jest.fn();
    render(<ManagerReviewPagePreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Open' })[0]);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'learner_opened' }));
  });

  test('fires manager filter and export events', () => {
    const onInteraction = jest.fn();
    render(<ManagerReviewPagePreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.change(screen.getByDisplayValue('all'), { target: { value: 'at-risk' } });
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'manager_filter_changed' }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'manager_export_triggered' }));
  });

  test('shows empty state', () => {
    render(<ManagerReviewPagePreview data={{ rows: [] }} />);
    expect(screen.getByText('No learner rows configured yet.')).toBeInTheDocument();
  });
});

describe('ManagerReviewPageEditor', () => {
  test('adds row', () => {
    const onChange = jest.fn();
    render(<ManagerReviewPageEditor data={mockData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Row/i }));
    expect(onChange).toHaveBeenCalled();
  });

  test('updates default sort', () => {
    const onChange = jest.fn();
    render(<ManagerReviewPageEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('name'), { target: { value: 'progress' } });
    expect(onChange).toHaveBeenCalled();
  });
});
