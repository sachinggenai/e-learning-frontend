import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { LevelBasedLearningEditor, LevelBasedLearningPreview } from './LevelBasedLearning';

describe('LevelBasedLearning', () => {
  const baseData = {
    title: 'Level Path',
    points: 45,
    levels: [
      { id: 'l1', title: 'Level 1', requirement: 10, description: 'Basics' },
      { id: 'l2', title: 'Level 2', requirement: 40, description: 'Practice' },
      { id: 'l3', title: 'Level 3', requirement: 80, description: 'Mastery' },
    ],
  };

  it('renders level statuses', () => {
    render(<LevelBasedLearningPreview componentId="levels" data={baseData} />);
    expect(screen.getByText(/Current points: 45/i)).toBeInTheDocument();
    expect(screen.getByText(/Need 80/i)).toBeInTheDocument();
  });

  it('editor can add a level', () => {
    const onChange = jest.fn();
    render(<LevelBasedLearningEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Level/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
