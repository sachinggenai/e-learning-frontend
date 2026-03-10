import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ScreenReaderGuideData,
  ScreenReaderGuidePreview,
  ScreenReaderGuideEditor,
} from './ScreenReaderGuide';

const mockData: ScreenReaderGuideData = {
  title: 'Screen Reader Guide',
  intro: 'Follow each step to navigate with your screen reader.',
  steps: [
    { id: 'step1', step: 'Open NVDA', expectedResult: 'NVDA starts speaking', toolNotes: 'NVDA only' },
    { id: 'step2', step: 'Navigate to main content', expectedResult: 'Focus moves to main area' },
  ],
  supportedTools: ['NVDA', 'JAWS'],
  activeTool: 'NVDA',
  troubleshooting: [
    { issue: 'No audio output', fix: 'Check speaker volume and NVDA settings.' },
  ],
};

describe('ScreenReaderGuidePreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and intro', () => {
    render(<ScreenReaderGuidePreview data={mockData} />);
    expect(screen.getByText('Screen Reader Guide')).toBeInTheDocument();
    expect(screen.getByText(/Follow each step/)).toBeInTheDocument();
  });

  test('renders tool tabs', () => {
    render(<ScreenReaderGuidePreview data={mockData} />);
    expect(screen.getByRole('tab', { name: 'NVDA' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'JAWS' })).toBeInTheDocument();
  });

  test('switches active tool on tab click and fires sr_tool_switched', () => {
    render(<ScreenReaderGuidePreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.click(screen.getByRole('tab', { name: 'JAWS' }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'sr_tool_switched',
      value: 'JAWS',
    }));
  });

  test('renders step list', () => {
    render(<ScreenReaderGuidePreview data={mockData} />);
    expect(screen.getByText('Open NVDA')).toBeInTheDocument();
    expect(screen.getByText('Navigate to main content')).toBeInTheDocument();
  });

  test('marks step done and fires sr_step_opened', () => {
    render(<ScreenReaderGuidePreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Mark step 1 done/i }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'sr_step_opened',
      interactionId: 'step1',
    }));
  });

  test('shows Mark Complete only after all steps are done', () => {
    render(<ScreenReaderGuidePreview data={mockData} onInteraction={mockOnInteraction} />);
    expect(screen.queryByRole('button', { name: /Mark Complete/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mark step 1 done/i }));
    fireEvent.click(screen.getByRole('button', { name: /Mark step 2 done/i }));
    expect(screen.getByRole('button', { name: /Mark Complete/i })).toBeInTheDocument();
  });

  test('fires sr_guide_completed on Mark Complete click', () => {
    const onComplete = jest.fn();
    render(<ScreenReaderGuidePreview data={mockData} onInteraction={mockOnInteraction} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /Mark step 1 done/i }));
    fireEvent.click(screen.getByRole('button', { name: /Mark step 2 done/i }));
    fireEvent.click(screen.getByRole('button', { name: /Mark Complete/i }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'sr_guide_completed',
    }));
    expect(onComplete).toHaveBeenCalled();
  });

  test('renders troubleshooting section', () => {
    render(<ScreenReaderGuidePreview data={mockData} />);
    expect(screen.getByText('No audio output')).toBeInTheDocument();
  });

  test('expands troubleshooting entry on toggle', () => {
    render(<ScreenReaderGuidePreview data={mockData} />);
    fireEvent.click(screen.getByText('No audio output'));
    expect(screen.getByText(/Check speaker volume/)).toBeInTheDocument();
  });
});

describe('ScreenReaderGuideEditor', () => {
  test('renders title field', () => {
    const onChange = jest.fn();
    render(<ScreenReaderGuideEditor data={mockData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Screen Reader Guide')).toBeInTheDocument();
  });

  test('calls onChange when title is updated', () => {
    const onChange = jest.fn();
    render(<ScreenReaderGuideEditor data={mockData} onChange={onChange} />);
    const titleInput = screen.getByDisplayValue('Screen Reader Guide');
    fireEvent.change(titleInput, { target: { value: 'Updated Guide' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ title: 'Updated Guide' }),
    }));
  });

  test('renders Add Step button', () => {
    const onChange = jest.fn();
    render(<ScreenReaderGuideEditor data={mockData} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Add Step/i })).toBeInTheDocument();
  });
});
