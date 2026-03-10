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
};

describe('ManagerReviewPagePreview', () => {
  test('renders learner rows and statuses', () => {
    render(<ManagerReviewPagePreview data={mockData} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('on-track')).toBeInTheDocument();
    expect(screen.getByText('at-risk')).toBeInTheDocument();
  });

  test('fires learner open action', () => {
    const onInteraction = jest.fn();
    render(<ManagerReviewPagePreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Open' })[0]);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'learner_opened' }));
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
});
