import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  RecommendationCardData,
  RecommendationCardEditor,
  RecommendationCardPreview,
} from './RecommendationCard';

const mockData: RecommendationCardData = {
  title: 'Your Recommendations',
  recommendations: [
    {
      id: 'r1',
      title: 'Complete JavaScript Basics',
      reason: 'Your diagnostic shows a gap in JS fundamentals.',
      priority: 'high',
      ctaLabel: 'Start Now',
      ctaTarget: '',
    },
    {
      id: 'r2',
      title: 'Review CSS Layouts',
      reason: 'Moderate gap in layout skills.',
      priority: 'medium',
    },
    {
      id: 'r3',
      title: 'Explore Advanced APIs',
      reason: 'Optional enrichment module.',
      priority: 'low',
    },
  ],
};

describe('RecommendationCardPreview', () => {
  test('renders title and recommendations', () => {
    render(<RecommendationCardPreview data={mockData} />);
    expect(screen.getByText('Your Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Complete JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByText('Review CSS Layouts')).toBeInTheDocument();
    expect(screen.getByText('Explore Advanced APIs')).toBeInTheDocument();
  });

  test('renders priority badges', () => {
    render(<RecommendationCardPreview data={mockData} />);
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
  });

  test('renders CTA button for items with ctaLabel', () => {
    render(<RecommendationCardPreview data={mockData} />);
    expect(screen.getByRole('button', { name: /Start Now/i })).toBeInTheDocument();
  });

  test('fires interaction on CTA click', () => {
    const onInteraction = jest.fn();
    render(<RecommendationCardPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Start Now/i }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'recommendation_cta_clicked',
      interactionId: 'r1',
    }));
  });

  test('sorts high priority first', () => {
    render(<RecommendationCardPreview data={mockData} />);
    const cards = screen.getAllByRole('listitem');
    expect(cards[0]).toHaveTextContent('Complete JavaScript Basics');
  });

  test('shows empty state', () => {
    render(<RecommendationCardPreview data={{ recommendations: [] }} />);
    expect(screen.getByText('No recommendations configured yet.')).toBeInTheDocument();
  });
});

describe('RecommendationCardEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<RecommendationCardEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Recs' } });
    expect(mockOnChange).toHaveBeenCalledWith({ data: expect.objectContaining({ title: 'New Recs' }) });
  });

  test('adds a recommendation', () => {
    render(<RecommendationCardEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Recommendation/i }));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        recommendations: expect.arrayContaining([expect.objectContaining({ priority: 'medium' })]),
      }),
    }));
  });
});
