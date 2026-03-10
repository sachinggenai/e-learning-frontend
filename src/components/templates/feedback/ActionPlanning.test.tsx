import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ActionPlanningData,
  ActionPlanningEditor,
  ActionPlanningPreview,
} from './ActionPlanning';

const mockData: ActionPlanningData = {
  title: 'Action Plan',
  goals: [
    {
      id: 'g1',
      description: 'Practice listening techniques',
      deadline: '2026-03-30',
      actions: ['Schedule a mock call', 'Ask for feedback'],
    },
  ],
};

describe('ActionPlanningPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders goals and actions', () => {
    render(<ActionPlanningPreview data={mockData} />);

    expect(screen.getByText('Practice listening techniques')).toBeInTheDocument();
    expect(screen.getByText('Ask for feedback')).toBeInTheDocument();
  });

  test('submits selected goals', () => {
    render(<ActionPlanningPreview data={mockData} onInteraction={mockOnInteraction} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit Action Plan' }));

    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'action-plan-submitted',
      value: ['g1'],
    }));
  });
});

describe('ActionPlanningEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<ActionPlanningEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Plan' } });

    expect(mockOnChange).toHaveBeenCalledWith({ data: { ...mockData, title: 'Updated Plan' } });
  });

  test('adds goal', () => {
    render(<ActionPlanningEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Add Goal/i }));

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        goals: expect.arrayContaining([expect.objectContaining({ description: '' })]),
      }),
    }));
  });
});
