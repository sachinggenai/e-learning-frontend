import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  PreAssessmentData,
  PreAssessmentEditor,
  PreAssessmentPreview,
} from './PreAssessment';

const mockData: PreAssessmentData = {
  title: 'Baseline Check',
  instructions: 'Answer all questions.',
  passThreshold: 70,
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      prompt: 'What is React?',
      options: ['A library', 'A framework', 'A language'],
      correctAnswer: 'A library',
    },
    {
      id: 'q2',
      type: 'true-false',
      prompt: 'JavaScript is compiled.',
      correctAnswer: false,
    },
  ],
};

describe('PreAssessmentPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and instructions', () => {
    render(<PreAssessmentPreview data={mockData} />);
    expect(screen.getByText('Baseline Check')).toBeInTheDocument();
    expect(screen.getByText('Answer all questions.')).toBeInTheDocument();
  });

  test('renders questions', () => {
    render(<PreAssessmentPreview data={mockData} />);
    expect(screen.getByText(/What is React/)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript is compiled/)).toBeInTheDocument();
  });

  test('submit button disabled until all answered', () => {
    render(<PreAssessmentPreview data={mockData} />);
    const btn = screen.getByRole('button', { name: 'Submit Assessment' });
    expect(btn).toBeDisabled();
  });

  test('submits and shows result', () => {
    render(<PreAssessmentPreview data={mockData} onInteraction={mockOnInteraction} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]); // A library
    fireEvent.click(radios[4]); // False
    fireEvent.click(screen.getByRole('button', { name: 'Submit Assessment' }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'pre_assessment_submitted',
    }));
    expect(screen.getByText(/Your score/)).toBeInTheDocument();
  });

  test('shows empty state when no questions', () => {
    render(<PreAssessmentPreview data={{ title: 'Test', questions: [] }} />);
    expect(screen.getByText('No questions configured yet.')).toBeInTheDocument();
  });
});

describe('PreAssessmentEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<PreAssessmentEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated' } });
    expect(mockOnChange).toHaveBeenCalledWith({ data: expect.objectContaining({ title: 'Updated' }) });
  });

  test('adds a question', () => {
    render(<PreAssessmentEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        questions: expect.arrayContaining([expect.objectContaining({ type: 'mcq' })]),
      }),
    }));
  });
});
