import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CarouselPreview, CarouselEditor } from './Carousel';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

describe('Carousel Component', () => {
  const mockData = {
    title: 'Course Content Carousel',
    slides: [
      { id: 'slide-1', title: 'Introduction', content: 'Welcome to the course', imageUrl: '' },
      { id: 'slide-2', title: 'Module 1', content: 'Learn the basics', imageUrl: '' },
      { id: 'slide-3', title: 'Module 2', content: 'Advanced concepts', imageUrl: '' },
      { id: 'slide-4', title: 'Conclusion', content: 'Summary and recap', imageUrl: '' },
    ],
  };

  const basePreviewProps: ComponentPreviewProps = {
    data: mockData,
    componentId: 'test-carousel',
    componentType: 'carousel',
  };

  const createPreviewProps = (data: Record<string, any> = mockData): ComponentPreviewProps => ({
    ...basePreviewProps,
    data,
    onInteraction: jest.fn(),
    onComplete: jest.fn(),
  });

  const createEditorProps = (
    data = mockData,
    onChange = jest.fn()
  ): ComponentEditorProps => ({
    data,
    onChange,
    componentId: 'test-carousel',
    componentType: 'carousel',
  });

  // ─── Preview Tests ────────────────────────────────────────

  describe('CarouselPreview - Basic Render', () => {
    it('should render title', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('title')).toHaveTextContent('Course Content Carousel');
    });

    it('should render slide container', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('slide-container')).toBeInTheDocument();
    });

    it('should render first slide content by default', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('slide-title')).toHaveTextContent('Introduction');
      expect(screen.getByTestId('slide-text')).toHaveTextContent('Welcome to the course');
    });

    it('should render navigation controls', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('nav-controls')).toBeInTheDocument();
      expect(screen.getByTestId('prev-button')).toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });

    it('should render dot indicators for each slide', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      const dots = screen.getAllByTestId(/^dot-/);
      expect(dots.length).toBe(4);
    });

    it('should render slide image when provided', () => {
      const dataWithImage = {
        ...mockData,
        slides: [
          {
            id: 'slide-1',
            title: 'Title',
            content: 'Content',
            imageUrl: 'https://example.com/image.jpg',
          },
        ],
      };

      const props = createPreviewProps(dataWithImage);

      render(<CarouselPreview {...props} />);

      const image = screen.getByTestId('slide-image') as HTMLImageElement;
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render progress indicator', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('progress')).toHaveTextContent('1 / 4');
    });

    it('should show empty state when no slides', () => {
      const props = createPreviewProps({ title: 'Empty', slides: [] });

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('carousel-empty')).toHaveTextContent('No slides configured');
    });
  });

  describe('CarouselPreview - Navigation', () => {
    it('should navigate to next slide', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('next-button'));

      expect(screen.getByTestId('slide-title')).toHaveTextContent('Module 1');
    });

    it('should navigate to previous slide', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('prev-button'));

      expect(screen.getByTestId('slide-title')).toHaveTextContent('Introduction');
    });

    it('should navigate via dot indicators', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('dot-2'));

      expect(screen.getByTestId('slide-title')).toHaveTextContent('Module 2');
    });

    it('should disable prev button on first slide', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('prev-button')).toBeDisabled();
    });

    it('should disable next button on last slide', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('next-button'));

      expect(screen.getByTestId('next-button')).toBeDisabled();
    });

    it('should call onInteraction when navigating', async () => {
      const mockOnInteraction = jest.fn();
      const props: ComponentPreviewProps = {
        ...basePreviewProps,
        data: mockData,
        onInteraction: mockOnInteraction,
        onComplete: jest.fn(),
      };

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(mockOnInteraction).toHaveBeenCalledWith(
          expect.objectContaining({
            interactionType: 'carousel-navigate',
            value: 1,
          })
        );
      });
    });

    it('should update progress when navigating', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('next-button'));

      expect(screen.getByTestId('progress')).toHaveTextContent('2 / 4 — 2 visited');
    });

    it('should call onComplete when all slides visited', async () => {
      const mockOnComplete = jest.fn();
      const props: ComponentPreviewProps = {
        ...basePreviewProps,
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: mockOnComplete,
      };

      render(<CarouselPreview {...props} />);

      // Visit all slides
      fireEvent.click(screen.getByTestId('dot-1'));
      fireEvent.click(screen.getByTestId('dot-2'));
      fireEvent.click(screen.getByTestId('dot-3'));

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith('');
      });
    });
  });

  // ─── Editor Tests ──────────────────────────────────────────

  describe('CarouselEditor - Basic Render', () => {
    it('should render title input', () => {
      const props = createEditorProps();

      render(<CarouselEditor {...props} />);

      const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
      expect(titleInput).toBeInTheDocument();
      expect(titleInput.value).toBe('Course Content Carousel');
    });

    it('should render all slide editors', () => {
      const props = createEditorProps();

      render(<CarouselEditor {...props} />);

      expect(screen.getByTestId('slide-editor-0')).toBeInTheDocument();
      expect(screen.getByTestId('slide-editor-1')).toBeInTheDocument();
      expect(screen.getByTestId('slide-editor-2')).toBeInTheDocument();
      expect(screen.getByTestId('slide-editor-3')).toBeInTheDocument();
    });

    it('should render add slide button', () => {
      const props = createEditorProps();

      render(<CarouselEditor {...props} />);

      expect(screen.getByTestId('add-slide-button')).toHaveTextContent('+ Add Slide');
    });
  });

  describe('CarouselEditor - Slide Management', () => {
    it('should add new slide', () => {
      const onChange = jest.fn();
      const props = createEditorProps(mockData, onChange);

      render(<CarouselEditor {...props} />);

      fireEvent.click(screen.getByTestId('add-slide-button'));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slides: expect.arrayContaining([
              expect.objectContaining({ title: '', content: '' }),
            ]),
          }),
        })
      );
    });

    it('should remove slide', () => {
      const onChange = jest.fn();
      const props = createEditorProps(mockData, onChange);

      render(<CarouselEditor {...props} />);

      fireEvent.click(screen.getByTestId('remove-slide-0'));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slides: expect.not.arrayContaining([
              expect.objectContaining({ title: 'Introduction' }),
            ]),
          }),
        })
      );
    });

    it('should update slide title', () => {
      const onChange = jest.fn();
      const props = createEditorProps(mockData, onChange);

      render(<CarouselEditor {...props} />);

      const titleInput = screen.getByTestId('slide-title-input-0') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slides: expect.arrayContaining([
              expect.objectContaining({ title: 'New Title' }),
            ]),
          }),
        })
      );
    });

    it('should update slide content', () => {
      const onChange = jest.fn();
      const props = createEditorProps(mockData, onChange);

      render(<CarouselEditor {...props} />);

      const contentInput = screen.getByTestId('slide-content-input-0') as HTMLTextAreaElement;
      fireEvent.change(contentInput, { target: { value: 'New Content' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slides: expect.arrayContaining([
              expect.objectContaining({ content: 'New Content' }),
            ]),
          }),
        })
      );
    });

    it('should update slide image URL', () => {
      const onChange = jest.fn();
      const props = createEditorProps(mockData, onChange);

      render(<CarouselEditor {...props} />);

      const imageInput = screen.getByTestId('slide-image-input-0') as HTMLInputElement;
      fireEvent.change(imageInput, { target: { value: 'https://example.com/img.jpg' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slides: expect.arrayContaining([
              expect.objectContaining({ imageUrl: 'https://example.com/img.jpg' }),
            ]),
          }),
        })
      );
    });

    it('should update carousel title', () => {
      const onChange = jest.fn();
      const props = createEditorProps(mockData, onChange);

      render(<CarouselEditor {...props} />);

      const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'New Carousel Title' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'New Carousel Title',
          }),
        })
      );
    });
  });

  // ─── CSS & Styling Tests ──────────────────────────────────

  describe('Carousel - Styling', () => {
    it('should apply carousel CSS class', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('carousel-preview')).toHaveClass('tpl-carousel');
    });

    it('should apply slide container CSS class', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('slide-container')).toHaveClass('tpl-carousel__slide-container');
    });

    it('should apply editor CSS class', () => {
      const props = createEditorProps();

      render(<CarouselEditor {...props} />);

      expect(screen.getByTestId('carousel-editor')).toHaveClass('tpl-carousel-editor');
    });

    it('should apply nav controls CSS class', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('nav-controls')).toHaveClass('tpl-carousel__nav');
    });

    it('should mark active dot indicator', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      const activeDot = screen.getByTestId('dot-0');
      expect(activeDot).toHaveClass('tpl-carousel__dot--active');
    });

    it('should mark visited dot indicators', () => {
      const props = createPreviewProps();

      render(<CarouselPreview {...props} />);

      fireEvent.click(screen.getByTestId('next-button'));

      const dot0 = screen.getByTestId('dot-0');
      expect(dot0).toHaveClass('tpl-carousel__dot--visited');
    });
  });

  // ─── Edge Cases & Additional Tests ────────────────────────

  describe('Carousel - Edge Cases', () => {
    it('should handle single slide', () => {
      const props = createPreviewProps({
        title: 'Single Slide',
        slides: [{ id: 'slide-1', title: 'Content', content: 'Text', imageUrl: '' }],
      });

      render(<CarouselPreview {...props} />);

      expect(screen.getByTestId('slide-title')).toHaveTextContent('Content');
      expect(screen.getByTestId('prev-button')).toBeDisabled();
      expect(screen.getByTestId('next-button')).toBeDisabled();
    });

    it('should handle missing title', () => {
      const props = createPreviewProps({ slides: mockData.slides });

      render(<CarouselPreview {...props} />);

      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
    });
  });
});




