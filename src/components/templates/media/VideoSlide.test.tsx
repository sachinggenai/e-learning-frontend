/**
 * VideoSlide Component Tests
 * Category: media-rich
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VideoSlidePreview, VideoSlideEditor } from './VideoSlide';

describe('VideoSlidePreview', () => {
  const mockOnInteraction = jest.fn();
  const mockOnComplete = jest.fn();

  const defaultData = {
    videoUrl: 'https://example.com/video.mp4',
    title: 'Test Video',
    description: 'Test description',
    caption: 'Test caption',
    overlayText: 'Test overlay',
    posterUrl: 'https://example.com/poster.jpg',
    watchThreshold: 0.9,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<VideoSlidePreview data={defaultData} />);
    expect(screen.getByRole('region', { name: /video content slide/i })).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(<VideoSlidePreview data={defaultData} />);
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  test('renders video element with correct URL', () => {
    render(<VideoSlidePreview data={defaultData} />);
    const video = screen.getByLabelText(/video: test video/i);
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
  });

  test('renders poster image URL when provided', () => {
    render(<VideoSlidePreview data={defaultData} />);
    const video = screen.getByLabelText(/video: test video/i);
    expect(video).toHaveAttribute('poster', 'https://example.com/poster.jpg');
  });

  test('renders placeholder when no video URL is provided', () => {
    const dataWithoutVideo = { ...defaultData, videoUrl: '' };
    render(<VideoSlidePreview data={dataWithoutVideo} />);
    expect(screen.getByRole('status', { name: /no video source/i })).toBeInTheDocument();
    expect(screen.getByText('No video source set')).toBeInTheDocument();
  });

  test('renders overlay text when provided', () => {
    render(<VideoSlidePreview data={defaultData} />);
    expect(screen.getByText('Test overlay')).toBeInTheDocument();
  });

  test('renders caption when provided', () => {
    render(<VideoSlidePreview data={defaultData} />);
    expect(screen.getByText('Test caption')).toBeInTheDocument();
  });

  test('does not render overlay when not provided', () => {
    const dataWithoutOverlay = { ...defaultData, overlayText: undefined };
    render(<VideoSlidePreview data={dataWithoutOverlay} />);
    expect(screen.queryByText('Test overlay')).not.toBeInTheDocument();
  });

  test('does not render caption when not provided', () => {
    const dataWithoutCaption = { ...defaultData, caption: undefined };
    render(<VideoSlidePreview data={dataWithoutCaption} />);
    expect(screen.queryByText('Test caption')).not.toBeInTheDocument();
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<VideoSlidePreview data={defaultData} />);
    expect(container.querySelector('.tpl-video-slide')).toBeInTheDocument();
  });

  test('applies correct BEM classes for video player', () => {
    const { container } = render(<VideoSlidePreview data={defaultData} />);
    expect(container.querySelector('.tpl-video-slide__player')).toBeInTheDocument();
  });

  test('applies correct BEM classes for placeholder', () => {
    const dataWithoutVideo = { ...defaultData, videoUrl: '' };
    const { container } = render(<VideoSlidePreview data={dataWithoutVideo} />);
    expect(container.querySelector('.tpl-video-slide__placeholder')).toBeInTheDocument();
  });

  test('applies correct BEM classes for title, overlay, and caption', () => {
    const { container } = render(<VideoSlidePreview data={defaultData} />);
    expect(container.querySelector('.tpl-video-slide__title')).toBeInTheDocument();
    expect(container.querySelector('.tpl-video-slide__overlay')).toBeInTheDocument();
    expect(container.querySelector('.tpl-video-slide__caption')).toBeInTheDocument();
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('has proper ARIA role for main container', () => {
    render(<VideoSlidePreview data={defaultData} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  test('video element has proper ARIA label', () => {
    render(<VideoSlidePreview data={defaultData} />);
    expect(screen.getByLabelText(/video: test video/i)).toBeInTheDocument();
  });

  test('placeholder has proper ARIA role and label', () => {
    const dataWithoutVideo = { ...defaultData, videoUrl: '' };
    render(<VideoSlidePreview data={dataWithoutVideo} />);
    expect(screen.getByRole('status', { name: /no video source/i })).toBeInTheDocument();
  });

  test('overlay has aria-live attribute', () => {
    const { container } = render(<VideoSlidePreview data={defaultData} />);
    const overlay = container.querySelector('.tpl-video-slide__overlay');
    expect(overlay).toHaveAttribute('aria-live', 'polite');
  });

  // ─── Callback Tests ──────────────────────────────────────────

  test('calls onComplete when watch threshold is reached', () => {
    render(
      <VideoSlidePreview
        data={defaultData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const video = screen.getByLabelText(/video: test video/i) as HTMLVideoElement;

    // Mock video duration and currentTime
    Object.defineProperty(video, 'duration', { value: 100, writable: true });
    Object.defineProperty(video, 'currentTime', { value: 90, writable: true });

    fireEvent.timeUpdate(video);

    expect(mockOnInteraction).toHaveBeenCalledWith({
      interactionType: 'video-watched',
      componentId: '',
      interactionId: 'video',
      value: true,
    });
    expect(mockOnComplete).toHaveBeenCalledWith('');
  });

  test('uses custom watch threshold when provided', () => {
    const customData = { ...defaultData, watchThreshold: 0.5 };
    render(
      <VideoSlidePreview
        data={customData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const video = screen.getByLabelText(/video: test video/i) as HTMLVideoElement;

    Object.defineProperty(video, 'duration', { value: 100, writable: true });
    Object.defineProperty(video, 'currentTime', { value: 50, writable: true });

    fireEvent.timeUpdate(video);

    expect(mockOnInteraction).toHaveBeenCalled();
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('does not call completion callbacks multiple times', () => {
    render(
      <VideoSlidePreview
        data={defaultData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const video = screen.getByLabelText(/video: test video/i) as HTMLVideoElement;

    Object.defineProperty(video, 'duration', { value: 100, writable: true });
    Object.defineProperty(video, 'currentTime', { value: 95, writable: true });

    fireEvent.timeUpdate(video);
    fireEvent.timeUpdate(video);
    fireEvent.timeUpdate(video);

    expect(mockOnInteraction).toHaveBeenCalledTimes(1);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });
});

describe('VideoSlideEditor', () => {
  const mockOnChange = jest.fn();

  const defaultData = {
    videoUrl: 'https://example.com/video.mp4',
    title: 'Test Video',
    caption: 'Test caption',
    overlayText: 'Test overlay',
    posterUrl: 'https://example.com/poster.jpg',
    watchThreshold: 0.9,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  test('renders all input fields', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Video URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Poster Image URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Overlay Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Caption')).toBeInTheDocument();
    expect(screen.getByLabelText('Watch Threshold (0-1)')).toBeInTheDocument();
  });

  test('displays current values in input fields', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('Test Video');
    expect(screen.getByLabelText('Video URL')).toHaveValue('https://example.com/video.mp4');
    expect(screen.getByLabelText('Poster Image URL')).toHaveValue('https://example.com/poster.jpg');
    expect(screen.getByLabelText('Overlay Text')).toHaveValue('Test overlay');
    expect(screen.getByLabelText('Caption')).toHaveValue('Test caption');
    expect(screen.getByLabelText('Watch Threshold (0-1)')).toHaveValue(0.9);
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-video-slide-editor')).toBeInTheDocument();
  });

  test('applies correct BEM classes for fields', () => {
    const { container } = render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelectorAll('.tpl-video-slide-editor__field').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-video-slide-editor__label').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-video-slide-editor__input').length).toBeGreaterThan(0);
  });

  // ─── Interaction Tests ───────────────────────────────────────

  test('calls onChange when title is updated', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        title: 'New Title',
      },
    });
  });

  test('calls onChange when videoUrl is updated', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    const urlInput = screen.getByLabelText('Video URL');

    fireEvent.change(urlInput, { target: { value: 'https://new-url.com/video.mp4' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        videoUrl: 'https://new-url.com/video.mp4',
      },
    });
  });

  test('calls onChange when watchThreshold is updated as number', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    const thresholdInput = screen.getByLabelText('Watch Threshold (0-1)');

    fireEvent.change(thresholdInput, { target: { value: '0.5' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        watchThreshold: 0.5,
      },
    });
  });

  test('handles empty data gracefully', () => {
    render(<VideoSlideEditor data={{}} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Video URL')).toHaveValue('');
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('all inputs have proper labels with htmlFor', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toHaveAttribute('id', 'video-slide-title');
  });

  test('all inputs have aria-label attributes', () => {
    render(<VideoSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-label', 'Title');
    expect(screen.getByLabelText('Video URL')).toHaveAttribute('aria-label', 'Video URL');
  });
});
