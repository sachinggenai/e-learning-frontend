import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProgressTrackerEditor, ProgressTrackerPreview } from './ProgressTracker';

describe('ProgressTracker', () => {
  const baseData = {
    title: 'Course Progress',
    progress: 50,
    milestones: [
      { id: 'm1', label: 'Start', target: 10 },
      { id: 'm2', label: 'Mid', target: 50 },
      { id: 'm3', label: 'End', target: 100 },
    ],
  };

  it('renders progress summary', () => {
    render(<ProgressTrackerPreview componentId="progress" data={baseData} />);
    expect(screen.getByText(/50% complete/i)).toBeInTheDocument();
    expect(screen.getByText(/2 of 3 milestones reached/i)).toBeInTheDocument();
  });

  it('editor can add a milestone', () => {
    const onChange = jest.fn();
    render(<ProgressTrackerEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onChange).toHaveBeenCalled();
  });
});
