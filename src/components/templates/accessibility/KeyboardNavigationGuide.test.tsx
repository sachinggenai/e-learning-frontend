import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  KeyboardNavigationGuideData,
  KeyboardNavigationGuidePreview,
  KeyboardNavigationGuideEditor,
} from './KeyboardNavigationGuide';

const mockData: KeyboardNavigationGuideData = {
  title: 'Keyboard Shortcuts',
  intro: 'Learn the key shortcuts to navigate faster.',
  shortcuts: [
    { id: 's1', combo: 'Ctrl+K', action: 'Open search', context: 'Global' },
    { id: 's2', combo: 'Ctrl+/', action: 'Toggle comment', context: 'Editor' },
  ],
  osMode: 'windows',
  showPracticeMode: true,
};

describe('KeyboardNavigationGuidePreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and intro', () => {
    render(<KeyboardNavigationGuidePreview data={mockData} />);
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText(/Learn the key shortcuts/)).toBeInTheDocument();
  });

  test('renders shortcut table entries', () => {
    render(<KeyboardNavigationGuidePreview data={mockData} />);
    expect(screen.getByText('Open search')).toBeInTheDocument();
    expect(screen.getByText('Toggle comment')).toBeInTheDocument();
  });

  test('fires shortcut_viewed on mount', () => {
    render(<KeyboardNavigationGuidePreview data={mockData} onInteraction={mockOnInteraction} />);
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'shortcut_viewed',
    }));
  });

  test('shows practice mode toggle when showPracticeMode is true', () => {
    render(<KeyboardNavigationGuidePreview data={mockData} />);
    expect(screen.getByRole('button', { name: /Practice Mode/i })).toBeInTheDocument();
  });

  test('fires practice_mode_started when practice mode is activated', () => {
    render(<KeyboardNavigationGuidePreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Practice Mode/i }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'practice_mode_started',
    }));
  });

  test('does not show practice mode button when showPracticeMode is false', () => {
    render(<KeyboardNavigationGuidePreview data={{ ...mockData, showPracticeMode: false }} />);
    expect(screen.queryByRole('button', { name: /Practice Mode/i })).not.toBeInTheDocument();
  });

  test('groups shortcuts by context', () => {
    render(<KeyboardNavigationGuidePreview data={mockData} />);
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
  });
});

describe('KeyboardNavigationGuideEditor', () => {
  test('renders title field', () => {
    const onChange = jest.fn();
    render(<KeyboardNavigationGuideEditor data={mockData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Keyboard Shortcuts')).toBeInTheDocument();
  });

  test('calls onChange when title is updated', () => {
    const onChange = jest.fn();
    render(<KeyboardNavigationGuideEditor data={mockData} onChange={onChange} />);
    const titleInput = screen.getByDisplayValue('Keyboard Shortcuts');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ title: 'Updated Title' }),
    }));
  });

  test('renders Add Shortcut button', () => {
    const onChange = jest.fn();
    render(<KeyboardNavigationGuideEditor data={mockData} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Add Shortcut/i })).toBeInTheDocument();
  });

  test('calls onChange when Add Shortcut is clicked', () => {
    const onChange = jest.fn();
    render(<KeyboardNavigationGuideEditor data={mockData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Shortcut/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
