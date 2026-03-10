import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LearningProgressSummaryEditor, LearningProgressSummaryPreview, LearningProgressSummaryData } from './LearningProgressSummary';

const mockData: LearningProgressSummaryData = {
  title: 'Progress Snapshot',
  totalUnits: 10,
  completedUnits: 4,
  milestones: [{ id: 'm1', label: 'Start', threshold: 25, reached: true }],
  estimatedTimeRemainingMins: 30,
};

describe('LearningProgressSummaryPreview', () => {
  test('renders progress headline and counts', () => {
    render(<LearningProgressSummaryPreview data={mockData} />);
    expect(screen.getByText('Progress Snapshot')).toBeInTheDocument();
    expect(screen.getByText('40% Complete')).toBeInTheDocument();
    expect(screen.getByText(/Completed 4 of 10 units/)).toBeInTheDocument();
  });

  test('handles totalUnits=0 edge case', () => {
    render(<LearningProgressSummaryPreview data={{ totalUnits: 0, completedUnits: 0 }} />);
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  test('fires milestone interaction', () => {
    const onInteraction = jest.fn();
    render(<LearningProgressSummaryPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Start/ }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'milestone_viewed' }));
  });
});

describe('LearningProgressSummaryEditor', () => {
  test('updates title', () => {
    const onChange = jest.fn();
    render(<LearningProgressSummaryEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('Progress Snapshot'), { target: { value: 'Updated Progress' } });
    expect(onChange).toHaveBeenCalled();
  });
});
