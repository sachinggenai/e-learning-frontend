/**
 * AudioSlide Component Tests
 * Category: media-rich
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AudioSlidePreview, AudioSlideEditor } from './AudioSlide';

describe('AudioSlidePreview', () => {
  const mockOnInteraction = jest.fn();
  const mockOnComplete = jest.fn();

  const defaultData = {
    audioUrl: 'https://example.com/audio.mp3',
    title: 'Test Audio',
    description: 'Test audio description',
    visualUrl: 'https://example.com/visual.jpg',
    visualAlt: 'Test visual',
    transcript: 'This is a test transcript of the audio content.',
    listenThreshold: 0.9,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByRole('region', { name: /audio content slide/i })).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByText('Test Audio')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByText('Test audio description')).toBeInTheDocument();
  });

  test('renders audio element with correct URL', () => {
    render(<AudioSlidePreview data={defaultData} />);
    const audio = screen.getByLabelText(/audio: test audio/i);
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute('src', 'https://example.com/audio.mp3');
  });

  test('renders visual image when provided', () => {
    render(<AudioSlidePreview data={defaultData} />);
    const img = screen.getByAltText('Test visual');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/visual.jpg');
  });

  test('renders placeholder when no audio URL is provided', () => {
    const dataWithoutAudio = { ...defaultData, audioUrl: '' };
    render(<AudioSlidePreview data={dataWithoutAudio} />);
    expect(screen.getByRole('status', { name: /no audio source/i })).toBeInTheDocument();
    expect(screen.getByText('No audio source set')).toBeInTheDocument();
  });

  test('renders transcript when provided', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByText('Transcript')).toBeInTheDocument();
    expect(screen.getByText('This is a test transcript of the audio content.')).toBeInTheDocument();
  });

  test('does not render description when not provided', () => {
    const dataWithoutDescription = { ...defaultData, description: undefined };
    render(<AudioSlidePreview data={dataWithoutDescription} />);
    expect(screen.queryByText('Test audio description')).not.toBeInTheDocument();
  });

  test('does not render visual when not provided', () => {
    const dataWithoutVisual = { ...defaultData, visualUrl: undefined };
    render(<AudioSlidePreview data={dataWithoutVisual} />);
    expect(screen.queryByAltText('Test visual')).not.toBeInTheDocument();
  });

  test('does not render transcript when not provided', () => {
    const dataWithoutTranscript = { ...defaultData, transcript: undefined };
    render(<AudioSlidePreview data={dataWithoutTranscript} />);
    expect(screen.queryByText('Transcript')).not.toBeInTheDocument();
  });

  test('uses default alt text when visualAlt not provided', () => {
    const dataWithoutAlt = { ...defaultData, visualAlt: undefined };
    render(<AudioSlidePreview data={dataWithoutAlt} />);
    expect(screen.getByAltText('Audio content visual')).toBeInTheDocument();
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<AudioSlidePreview data={defaultData} />);
    expect(container.querySelector('.tpl-audio-slide')).toBeInTheDocument();
  });

  test('applies correct BEM classes for audio player', () => {
    const { container } = render(<AudioSlidePreview data={defaultData} />);
    expect(container.querySelector('.tpl-audio-slide__player-container')).toBeInTheDocument();
    expect(container.querySelector('.tpl-audio-slide__player')).toBeInTheDocument();
  });

  test('applies correct BEM classes for placeholder', () => {
    const dataWithoutAudio = { ...defaultData, audioUrl: '' };
    const { container } = render(<AudioSlidePreview data={dataWithoutAudio} />);
    expect(container.querySelector('.tpl-audio-slide__placeholder')).toBeInTheDocument();
  });

  test('applies correct BEM classes for title, description, visual, and transcript', () => {
    const { container } = render(<AudioSlidePreview data={defaultData} />);
    expect(container.querySelector('.tpl-audio-slide__title')).toBeInTheDocument();
    expect(container.querySelector('.tpl-audio-slide__description')).toBeInTheDocument();
    expect(container.querySelector('.tpl-audio-slide__visual')).toBeInTheDocument();
    expect(container.querySelector('.tpl-audio-slide__transcript')).toBeInTheDocument();
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('has proper ARIA role for main container', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  test('audio element has proper ARIA label', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByLabelText(/audio: test audio/i)).toBeInTheDocument();
  });

  test('placeholder has proper ARIA role and label', () => {
    const dataWithoutAudio = { ...defaultData, audioUrl: '' };
    render(<AudioSlidePreview data={dataWithoutAudio} />);
    expect(screen.getByRole('status', { name: /no audio source/i })).toBeInTheDocument();
  });

  test('transcript has complementary role', () => {
    render(<AudioSlidePreview data={defaultData} />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  test('placeholder icon has aria-hidden attribute', () => {
    const dataWithoutAudio = { ...defaultData, audioUrl: '' };
    const { container } = render(<AudioSlidePreview data={dataWithoutAudio} />);
    const icon = container.querySelector('.tpl-audio-slide__placeholder-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  // ─── Callback Tests ──────────────────────────────────────────

  test('calls onComplete when listen threshold is reached', () => {
    render(
      <AudioSlidePreview
        data={defaultData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const audio = screen.getByLabelText(/audio: test audio/i) as HTMLAudioElement;

    // Mock audio duration and currentTime
    Object.defineProperty(audio, 'duration', { value: 100, writable: true });
    Object.defineProperty(audio, 'currentTime', { value: 90, writable: true });

    fireEvent.timeUpdate(audio);

    expect(mockOnInteraction).toHaveBeenCalledWith({
      interactionType: 'audio-listened',
      componentId: '',
      interactionId: 'audio',
      value: true,
    });
    expect(mockOnComplete).toHaveBeenCalledWith('');
  });

  test('uses custom listen threshold when provided', () => {
    const customData = { ...defaultData, listenThreshold: 0.5 };
    render(
      <AudioSlidePreview
        data={customData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const audio = screen.getByLabelText(/audio: test audio/i) as HTMLAudioElement;

    Object.defineProperty(audio, 'duration', { value: 100, writable: true });
    Object.defineProperty(audio, 'currentTime', { value: 50, writable: true });

    fireEvent.timeUpdate(audio);

    expect(mockOnInteraction).toHaveBeenCalled();
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('does not call completion callbacks multiple times', () => {
    render(
      <AudioSlidePreview
        data={defaultData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const audio = screen.getByLabelText(/audio: test audio/i) as HTMLAudioElement;

    Object.defineProperty(audio, 'duration', { value: 100, writable: true });
    Object.defineProperty(audio, 'currentTime', { value: 95, writable: true });

    fireEvent.timeUpdate(audio);
    fireEvent.timeUpdate(audio);
    fireEvent.timeUpdate(audio);

    expect(mockOnInteraction).toHaveBeenCalledTimes(1);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });
});

describe('AudioSlideEditor', () => {
  const mockOnChange = jest.fn();

  const defaultData = {
    audioUrl: 'https://example.com/audio.mp3',
    title: 'Test Audio',
    description: 'Test description',
    visualUrl: 'https://example.com/visual.jpg',
    visualAlt: 'Test visual',
    transcript: 'Test transcript',
    listenThreshold: 0.9,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  test('renders all input fields', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Audio URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Visual Image URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Visual Alt Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Transcript')).toBeInTheDocument();
    expect(screen.getByLabelText('Listen Threshold (0-1)')).toBeInTheDocument();
  });

  test('displays current values in input fields', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('Test Audio');
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    expect(screen.getByLabelText('Audio URL')).toHaveValue('https://example.com/audio.mp3');
    expect(screen.getByLabelText('Visual Image URL')).toHaveValue('https://example.com/visual.jpg');
    expect(screen.getByLabelText('Visual Alt Text')).toHaveValue('Test visual');
    expect(screen.getByLabelText('Transcript')).toHaveValue('Test transcript');
    expect(screen.getByLabelText('Listen Threshold (0-1)')).toHaveValue(0.9);
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-audio-slide-editor')).toBeInTheDocument();
  });

  test('applies correct BEM classes for fields', () => {
    const { container } = render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelectorAll('.tpl-audio-slide-editor__field').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-audio-slide-editor__label').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-audio-slide-editor__input').length).toBeGreaterThan(0);
  });

  test('applies correct BEM classes for textarea fields', () => {
    const { container } = render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelectorAll('.tpl-audio-slide-editor__textarea').length).toBeGreaterThan(0);
  });

  // ─── Interaction Tests ───────────────────────────────────────

  test('calls onChange when title is updated', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        title: 'New Title',
      },
    });
  });

  test('calls onChange when description is updated', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    const descInput = screen.getByLabelText('Description');

    fireEvent.change(descInput, { target: { value: 'New Description' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        description: 'New Description',
      },
    });
  });

  test('calls onChange when audioUrl is updated', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    const urlInput = screen.getByLabelText('Audio URL');

    fireEvent.change(urlInput, { target: { value: 'https://new-url.com/audio.mp3' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        audioUrl: 'https://new-url.com/audio.mp3',
      },
    });
  });

  test('calls onChange when transcript is updated', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    const transcriptInput = screen.getByLabelText('Transcript');

    fireEvent.change(transcriptInput, { target: { value: 'New transcript text' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        transcript: 'New transcript text',
      },
    });
  });

  test('calls onChange when listenThreshold is updated as number', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    const thresholdInput = screen.getByLabelText('Listen Threshold (0-1)');

    fireEvent.change(thresholdInput, { target: { value: '0.5' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        listenThreshold: 0.5,
      },
    });
  });

  test('handles empty data gracefully', () => {
    render(<AudioSlideEditor data={{}} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Audio URL')).toHaveValue('');
    expect(screen.getByLabelText('Transcript')).toHaveValue('');
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('all inputs have proper labels with htmlFor', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toHaveAttribute('id', 'audio-slide-title');
  });

  test('all inputs have aria-label attributes', () => {
    render(<AudioSlideEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-label', 'Title');
    expect(screen.getByLabelText('Audio URL')).toHaveAttribute('aria-label', 'Audio URL');
    expect(screen.getByLabelText('Transcript')).toHaveAttribute('aria-label', 'Transcript');
  });
});
