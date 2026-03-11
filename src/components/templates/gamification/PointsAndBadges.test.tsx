import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PointsAndBadgesEditor, PointsAndBadgesPreview } from './PointsAndBadges';

describe('PointsAndBadges', () => {
  const baseData = {
    title: 'Rewards',
    points: 30,
    maxPoints: 100,
    badges: [
      { id: 'b1', name: 'Starter', pointsRequired: 10, description: 'First steps' },
      { id: 'b2', name: 'Advanced', pointsRequired: 60, description: 'Level up' },
    ],
  };

  it('shows unlocked and locked badges', () => {
    render(<PointsAndBadgesPreview componentId="badges" data={baseData} />);
    expect(screen.getByText(/Starter/i)).toBeInTheDocument();
    expect(screen.getByText(/30 points to unlock/i)).toBeInTheDocument();
  });

  it('editor can add a badge', () => {
    const onChange = jest.fn();
    render(<PointsAndBadgesEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Badge/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
