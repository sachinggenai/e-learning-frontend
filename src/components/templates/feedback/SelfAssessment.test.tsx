import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  SelfAssessmentData,
  SelfAssessmentEditor,
  SelfAssessmentPreview,
} from './SelfAssessment';

const mockData: SelfAssessmentData = {
  title: 'Rate your skill level',
  criteria: [
    { id: 'c1', name: 'Communication', description: 'Clarity and tone', scale: 5 },
    { id: 'c2', name: 'Analysis', description: 'Problem solving', scale: 4 },
  ],
};

describe('SelfAssessmentPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders criteria', () => {
    render(<SelfAssessmentPreview data={mockData} />);

    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  test('submits score when all criteria rated', () => {
    render(<SelfAssessmentPreview data={mockData} onInteraction={mockOnInteraction} />);

    const allFour = screen.getAllByRole('radio', { name: '4' });
    fireEvent.click(allFour[0]);
    const allThree = screen.getAllByRole('radio', { name: '3' });
    fireEvent.click(allThree[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Self-Assessment' }));

    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'self-assessment-submitted',
      score: 7,
      maxScore: 9,
    }));
  });
});

describe('SelfAssessmentEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<SelfAssessmentEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Self Assessment' } });

    expect(mockOnChange).toHaveBeenCalledWith({ data: { ...mockData, title: 'My Self Assessment' } });
  });

  test('adds criterion', () => {
    render(<SelfAssessmentEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Criterion' }));

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        criteria: expect.arrayContaining([
          expect.objectContaining({ name: '' }),
        ]),
      }),
    }));
  });
});
