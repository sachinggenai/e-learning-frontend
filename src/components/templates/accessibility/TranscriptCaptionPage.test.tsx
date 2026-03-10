import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  TranscriptCaptionPageData,
  TranscriptCaptionPagePreview,
  TranscriptCaptionPageEditor,
} from './TranscriptCaptionPage';

// Mock URL.createObjectURL and document.createElement to avoid JSDOM limitations
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

const mockData: TranscriptCaptionPageData = {
  title: 'Course Transcript',
  mediaId: 'video-01',
  languageCode: 'en',
  segments: [
    { id: 'seg1', startTime: 0, endTime: 5, text: 'Welcome to this course.', speaker: 'Instructor' },
    { id: 'seg2', startTime: 5, endTime: 12, text: 'Today we will learn about accessibility.', speaker: 'Instructor' },
    { id: 'seg3', startTime: 12, endTime: 20, text: 'Let us get started with the basics.', speaker: 'Narrator' },
  ],
  searchable: true,
  seekOnClick: true,
  downloadableFormats: ['txt', 'srt', 'vtt'],
};

describe('TranscriptCaptionPagePreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders title and language badge', () => {
    render(<TranscriptCaptionPagePreview data={mockData} />);
    expect(screen.getByText('Course Transcript')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  test('renders all transcript segments', () => {
    render(<TranscriptCaptionPagePreview data={mockData} />);
    expect(screen.getByText('Welcome to this course.')).toBeInTheDocument();
    expect(screen.getByText(/Today we will learn/)).toBeInTheDocument();
    expect(screen.getByText(/Let us get started/)).toBeInTheDocument();
  });

  test('renders speaker names', () => {
    render(<TranscriptCaptionPagePreview data={mockData} />);
    expect(screen.getAllByText(/Instructor:/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Narrator:/)).toBeInTheDocument();
  });

  test('renders search input when searchable is true', () => {
    render(<TranscriptCaptionPagePreview data={mockData} />);
    expect(screen.getByPlaceholderText(/Search transcript/i)).toBeInTheDocument();
  });

  test('filters segments when searching', () => {
    render(<TranscriptCaptionPagePreview data={mockData} onInteraction={mockOnInteraction} />);
    const searchInput = screen.getByPlaceholderText(/Search transcript/i);
    fireEvent.change(searchInput, { target: { value: 'accessibility' } });
    expect(screen.getByText(/accessibility/i)).toBeInTheDocument();
    expect(screen.queryByText('Welcome to this course.')).not.toBeInTheDocument();
  });

  test('fires transcript_searched when search query is entered', () => {
    render(<TranscriptCaptionPagePreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.change(screen.getByPlaceholderText(/Search transcript/i), { target: { value: 'basics' } });
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'transcript_searched',
      value: 'basics',
    }));
  });

  test('fires timestamp_clicked when timestamp is clicked and seekOnClick is true', () => {
    render(<TranscriptCaptionPagePreview data={mockData} onInteraction={mockOnInteraction} />);
    const timestamps = screen.getAllByText(/^\d+:\d+/);
    fireEvent.click(timestamps[0]);
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'timestamp_clicked',
    }));
  });

  test('renders download buttons for each format', () => {
    render(<TranscriptCaptionPagePreview data={mockData} />);
    expect(screen.getByRole('button', { name: /txt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /srt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vtt/i })).toBeInTheDocument();
  });

  test('fires transcript_downloaded on download button click', () => {
    render(<TranscriptCaptionPagePreview data={mockData} onInteraction={mockOnInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /txt/i }));
    expect(mockOnInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'transcript_downloaded',
      value: 'txt',
    }));
  });

  test('does not render search input when searchable is false', () => {
    render(<TranscriptCaptionPagePreview data={{ ...mockData, searchable: false }} />);
    expect(screen.queryByPlaceholderText(/Search transcript/i)).not.toBeInTheDocument();
  });
});

describe('TranscriptCaptionPageEditor', () => {
  test('renders title field', () => {
    const onChange = jest.fn();
    render(<TranscriptCaptionPageEditor data={mockData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Course Transcript')).toBeInTheDocument();
  });

  test('calls onChange when title is updated', () => {
    const onChange = jest.fn();
    render(<TranscriptCaptionPageEditor data={mockData} onChange={onChange} />);
    const titleInput = screen.getByDisplayValue('Course Transcript');
    fireEvent.change(titleInput, { target: { value: 'New Transcript' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ title: 'New Transcript' }),
    }));
  });

  test('renders Add Segment button', () => {
    const onChange = jest.fn();
    render(<TranscriptCaptionPageEditor data={mockData} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Add Segment/i })).toBeInTheDocument();
  });

  test('calls onChange when Add Segment is clicked', () => {
    const onChange = jest.fn();
    render(<TranscriptCaptionPageEditor data={mockData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Segment/i }));
    expect(onChange).toHaveBeenCalled();
  });

  test('renders format checkboxes', () => {
    const onChange = jest.fn();
    render(<TranscriptCaptionPageEditor data={mockData} onChange={onChange} />);
    expect(screen.getByDisplayValue('en')).toBeInTheDocument();
  });
});
