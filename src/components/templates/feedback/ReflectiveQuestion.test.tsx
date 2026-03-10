import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ReflectiveQuestionData,
  ReflectiveQuestionEditor,
  ReflectiveQuestionPreview,
} from './ReflectiveQuestion';

const mockData: ReflectiveQuestionData = {
  title: 'Reflection Time',
  question: 'What changed in your understanding after this lesson?',
  promptText: 'Write 2-3 sentences with concrete examples.',
  allowMultipleResponses: false,
};

describe('ReflectiveQuestionPreview', () => {
  const mockOnInteraction = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
    mockOnComplete.mockClear();
  });

  test('renders title and question', () => {
    render(<ReflectiveQuestionPreview data={mockData} onInteraction={mockOnInteraction} />);

    expect(screen.getByText('Reflection Time')).toBeInTheDocument();
    expect(screen.getByText('What changed in your understanding after this lesson?')).toBeInTheDocument();
  });

  test('disables save button for empty response', () => {
    render(<ReflectiveQuestionPreview data={mockData} />);

    expect(screen.getByRole('button', { name: 'Save Reflection' })).toBeDisabled();
  });

  test('saves response and emits interaction', () => {
    render(
      <ReflectiveQuestionPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    fireEvent.change(screen.getByLabelText('Your Reflection'), {
      target: { value: 'I now understand how to apply the process on real projects.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Reflection' }));

    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'reflection-saved',
      interactionId: 'reflection-1',
      value: 'I now understand how to apply the process on real projects.',
      completed: true,
    });
    expect(mockOnComplete).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('Saved Reflections (1)')).toBeInTheDocument();
  });

  test('keeps multiple responses when enabled', () => {
    const dataWithMultiple = { ...mockData, allowMultipleResponses: true };
    render(<ReflectiveQuestionPreview data={dataWithMultiple} />);

    const input = screen.getByLabelText('Your Reflection');
    const button = screen.getByRole('button', { name: 'Save Reflection' });

    fireEvent.change(input, { target: { value: 'First reflection' } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'Second reflection' } });
    fireEvent.click(button);

    expect(screen.getByText('Saved Reflections (2)')).toBeInTheDocument();
    expect(screen.getByText('First reflection')).toBeInTheDocument();
    expect(screen.getByText('Second reflection')).toBeInTheDocument();
  });
});

describe('ReflectiveQuestionEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders editable fields', () => {
    render(<ReflectiveQuestionEditor data={mockData} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Question')).toBeInTheDocument();
    expect(screen.getByLabelText('Prompt Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Allow multiple saved reflections')).toBeInTheDocument();
  });

  test('updates title field', () => {
    render(<ReflectiveQuestionEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: { ...mockData, title: 'New title' },
    });
  });

  test('updates allowMultipleResponses field', () => {
    render(<ReflectiveQuestionEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Allow multiple saved reflections'));

    expect(mockOnChange).toHaveBeenCalledWith({
      data: { ...mockData, allowMultipleResponses: true },
    });
  });
});
