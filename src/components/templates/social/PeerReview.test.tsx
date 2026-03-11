import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PeerReviewEditor, PeerReviewPreview } from './PeerReview';

describe('PeerReview', () => {
  const baseData = {
    title: 'Review Your Peer',
    criteria: [
      { id: 'c1', label: 'Clarity', description: 'Was the explanation clear?' },
      { id: 'c2', label: 'Depth', description: 'Was adequate depth provided?' },
    ],
    maxRating: 5 as 5,
    requireComment: false,
  };

  it('renders title and criteria', () => {
    render(<PeerReviewPreview componentId="pr" data={baseData} />);
    expect(screen.getByText('Review Your Peer')).toBeInTheDocument();
    expect(screen.getByText('Clarity')).toBeInTheDocument();
    expect(screen.getByText('Depth')).toBeInTheDocument();
  });

  it('submit is disabled until all criteria are rated', () => {
    render(<PeerReviewPreview componentId="pr" data={baseData} />);
    expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled();
  });

  it('rates a criterion and shows average, calls onComplete after submit', () => {
    const onComplete = jest.fn();
    render(<PeerReviewPreview componentId="pr" data={baseData} onComplete={onComplete} />);

    // Rate both criteria
    const ratingGroups = screen.getAllByRole('group');
    fireEvent.click(screen.getAllByLabelText('3 of 5')[0]);
    fireEvent.click(screen.getAllByLabelText('4 of 5')[1]);

    expect(screen.getByText(/Current average/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
    expect(onComplete).toHaveBeenCalledWith('pr');
  });

  it('editor renders and can add a criterion', () => {
    const onChange = jest.fn();
    render(<PeerReviewEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Criterion/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
