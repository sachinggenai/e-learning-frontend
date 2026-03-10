import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  AccessibilityTipCardData,
  AccessibilityTipCardPreview,
  AccessibilityTipCardEditor,
} from './AccessibilityTipCard';

const mockData: AccessibilityTipCardData = {
  title: 'Use High Contrast',
  tip: 'Enable high contrast mode in your OS settings for better visibility.',
  category: 'vision',
  linkLabel: 'How to enable',
  linkUrl: 'https://example.com',
  dismissible: true,
  emphasis: false,
};

describe('AccessibilityTipCardPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and tip text', () => {
    render(<AccessibilityTipCardPreview data={mockData} />);
    expect(screen.getByText('Use High Contrast')).toBeInTheDocument();
    expect(screen.getByText(/Enable high contrast mode/)).toBeInTheDocument();
  });

  test('fires tip_viewed on mount', () => {
    render(<AccessibilityTipCardPreview data={mockData} onInteraction={mockOnInteraction} />);
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'tip_viewed',
      value: 'vision',
    }));
  });

  test('renders learn more link when linkUrl provided', () => {
    render(<AccessibilityTipCardPreview data={mockData} />);
    expect(screen.getByRole('link', { name: /How to enable/i })).toBeInTheDocument();
  });

  test('fires tip_link_clicked when link is clicked', () => {
    render(<AccessibilityTipCardPreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.click(screen.getByRole('link', { name: /How to enable/i }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'tip_link_clicked',
    }));
  });

  test('renders dismiss button when dismissible is true', () => {
    render(<AccessibilityTipCardPreview data={mockData} />);
    expect(screen.getByRole('button', { name: /Dismiss tip/i })).toBeInTheDocument();
  });

  test('dismiss button hides the card and fires tip_dismissed', () => {
    render(<AccessibilityTipCardPreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Dismiss tip/i }));
    expect(screen.queryByText('Use High Contrast')).not.toBeInTheDocument();
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'tip_dismissed',
    }));
  });

  test('does not render dismiss button when dismissible is false', () => {
    render(<AccessibilityTipCardPreview data={{ ...mockData, dismissible: false }} />);
    expect(screen.queryByRole('button', { name: /Dismiss tip/i })).not.toBeInTheDocument();
  });

  test('uses default title when title is missing', () => {
    render(<AccessibilityTipCardPreview data={{ ...mockData, title: '' }} />);
    expect(screen.getByText('Accessibility Tip')).toBeInTheDocument();
  });
});

describe('AccessibilityTipCardEditor', () => {
  test('renders all editor fields', () => {
    const onChange = jest.fn();
    render(<AccessibilityTipCardEditor data={mockData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Use High Contrast')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Enable high contrast mode/)).toBeInTheDocument();
  });

  test('calls onChange when title is updated', () => {
    const onChange = jest.fn();
    render(<AccessibilityTipCardEditor data={mockData} onChange={onChange} />);
    const titleInput = screen.getByDisplayValue('Use High Contrast');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ title: 'New Title' }),
    }));
  });

  test('calls onChange when dismissible checkbox is toggled', () => {
    const onChange = jest.fn();
    render(<AccessibilityTipCardEditor data={mockData} onChange={onChange} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalled();
  });
});
