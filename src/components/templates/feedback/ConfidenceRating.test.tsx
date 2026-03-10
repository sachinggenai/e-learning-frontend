import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ConfidenceRatingData,
  ConfidenceRatingEditor,
  ConfidenceRatingPreview,
} from './ConfidenceRating';

const mockData: ConfidenceRatingData = {
  title: 'Confidence Check',
  topics: [
    { id: 't1', name: 'Topic A', description: 'Basics' },
    { id: 't2', name: 'Topic B', description: 'Advanced' },
  ],
  scale: { min: 1, max: 5, labels: ['Low', 'High'] },
};

describe('ConfidenceRatingPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders topics', () => {
    render(<ConfidenceRatingPreview data={mockData} />);

    expect(screen.getByText('Topic A')).toBeInTheDocument();
    expect(screen.getByText('Topic B')).toBeInTheDocument();
  });

  test('submits ratings', () => {
    render(<ConfidenceRatingPreview data={mockData} onInteraction={mockOnInteraction} />);

    const allFour = screen.getAllByRole('radio', { name: '4' });
    fireEvent.click(allFour[0]);

    const allThree = screen.getAllByRole('radio', { name: '3' });
    fireEvent.click(allThree[1]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit Confidence Ratings' }));

    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'confidence-rating-submitted',
      completed: true,
    }));
  });
});

describe('ConfidenceRatingEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<ConfidenceRatingEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Confidence' } });

    expect(mockOnChange).toHaveBeenCalledWith({ data: { ...mockData, title: 'New Confidence' } });
  });

  test('adds topic', () => {
    render(<ConfidenceRatingEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Topic' }));

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        topics: expect.arrayContaining([expect.objectContaining({ name: '' })]),
      }),
    }));
  });
});
