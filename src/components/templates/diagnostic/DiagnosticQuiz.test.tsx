import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DiagnosticQuizData,
  DiagnosticQuizEditor,
  DiagnosticQuizPreview,
} from './DiagnosticQuiz';

const mockData: DiagnosticQuizData = {
  title: 'JavaScript Diagnostic',
  topics: ['Basics', 'Functions'],
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      topic: 'Basics',
      prompt: 'What does DOM stand for?',
      options: ['Document Object Model', 'Data Object Method'],
      correctAnswer: 'Document Object Model',
      difficulty: 'easy',
    },
    {
      id: 'q2',
      type: 'true-false',
      topic: 'Functions',
      prompt: 'Arrow functions have their own `this`.',
      correctAnswer: false,
    },
  ],
  allowRetry: true,
};

describe('DiagnosticQuizPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and topics', () => {
    render(<DiagnosticQuizPreview data={mockData} />);
    expect(screen.getByText('JavaScript Diagnostic')).toBeInTheDocument();
    expect(screen.getByText('Basics')).toBeInTheDocument();
  });

  test('renders questions', () => {
    render(<DiagnosticQuizPreview data={mockData} />);
    expect(screen.getByText(/What does DOM stand for/)).toBeInTheDocument();
    expect(screen.getByText(/Arrow functions/)).toBeInTheDocument();
  });

  test('submit disabled until all answered', () => {
    render(<DiagnosticQuizPreview data={mockData} />);
    expect(screen.getByRole('button', { name: 'Submit Quiz' })).toBeDisabled();
  });

  test('submits and shows results', () => {
    render(<DiagnosticQuizPreview data={mockData} onInteraction={mockOnInteraction} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]); // Document Object Model
    fireEvent.click(radios[3]); // False
    fireEvent.click(screen.getByRole('button', { name: 'Submit Quiz' }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'diagnostic_quiz_finished',
    }));
    expect(screen.getByText(/Results/)).toBeInTheDocument();
  });

  test('shows empty state when no questions', () => {
    render(<DiagnosticQuizPreview data={{ title: 'Test', questions: [] }} />);
    expect(screen.getByText('No questions configured yet.')).toBeInTheDocument();
  });
});

describe('DiagnosticQuizEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<DiagnosticQuizEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Quiz' } });
    expect(mockOnChange).toHaveBeenCalledWith({ data: expect.objectContaining({ title: 'Updated Quiz' }) });
  });

  test('adds a question', () => {
    render(<DiagnosticQuizEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        questions: expect.arrayContaining([expect.objectContaining({ type: 'mcq' })]),
      }),
    }));
  });
});
