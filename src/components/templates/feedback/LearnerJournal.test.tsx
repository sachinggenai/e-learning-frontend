import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  LearnerJournalData,
  LearnerJournalEditor,
  LearnerJournalPreview,
} from './LearnerJournal';

const mockData: LearnerJournalData = {
  title: 'Journal',
  prompts: ['What did I learn?', 'How will I apply it?'],
  maxEntries: 2,
};

describe('LearnerJournalPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and prompts', () => {
    render(<LearnerJournalPreview data={mockData} onInteraction={mockOnInteraction} />);

    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('What did I learn?')).toBeInTheDocument();
  });

  test('saves entry and emits interaction', () => {
    render(<LearnerJournalPreview data={mockData} onInteraction={mockOnInteraction} />);

    fireEvent.change(screen.getByLabelText('Journal Entry'), { target: { value: 'I learned X.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Entry' }));

    expect(screen.getByText('I learned X.')).toBeInTheDocument();
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'journal-entry-saved',
      value: 'I learned X.',
    }));
  });

  test('prevents adding above max entries', () => {
    render(<LearnerJournalPreview data={mockData} />);

    const input = screen.getByLabelText('Journal Entry');
    const button = screen.getByRole('button', { name: 'Save Entry' });

    fireEvent.change(input, { target: { value: 'Entry 1' } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'Entry 2' } });
    fireEvent.click(button);

    expect(screen.getByText('2/2 entries used')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});

describe('LearnerJournalEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<LearnerJournalEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Journal' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: { ...mockData, title: 'New Journal' },
    });
  });

  test('adds prompt', () => {
    render(<LearnerJournalEditor data={mockData} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Prompt' }));

    expect(mockOnChange).toHaveBeenCalledWith({
      data: { ...mockData, prompts: [...(mockData.prompts ?? []), ''] },
    });
  });
});
