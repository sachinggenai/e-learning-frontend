import { render, screen } from '@testing-library/react';
import { TextWithMediaPreview } from './TextWithMedia';

describe('TextWithMediaPreview', () => {
  it('renders text content and title', () => {
    render(
      <TextWithMediaPreview
        componentId="cmp-text-media"
        componentType="text-with-media"
        data={{
          title: 'Text with Media',
          body: '<p>Body content</p>',
          mediaType: 'none',
        }}
      />
    );

    expect(screen.getByText('Text with Media')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders image media when configured', () => {
    render(
      <TextWithMediaPreview
        componentId="cmp-text-media"
        componentType="text-with-media"
        data={{
          title: 'Image Example',
          body: '<p>Content</p>',
          mediaType: 'image',
          mediaUrl: 'https://example.com/media.jpg',
          mediaPosition: 'left',
        }}
      />
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/media.jpg');
    expect(screen.getByLabelText('Media section')).toBeInTheDocument();
  });

  it('renders video media when configured', () => {
    const { container } = render(
      <TextWithMediaPreview
        componentId="cmp-text-media"
        componentType="text-with-media"
        data={{
          title: 'Video Example',
          body: '<p>Content</p>',
          mediaType: 'video',
          mediaUrl: 'https://example.com/media.mp4',
        }}
      />
    );

    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('applies correct class for top placement', () => {
    const { container } = render(
      <TextWithMediaPreview
        componentId="cmp-text-media"
        componentType="text-with-media"
        data={{
          title: 'Top Placement',
          body: '<p>Content</p>',
          mediaType: 'image',
          mediaUrl: 'https://example.com/media.jpg',
          mediaPosition: 'top',
        }}
      />
    );

    expect(container.querySelector('.tpl-text-media--top')).toBeInTheDocument();
  });

  it('applies correct class for bottom placement', () => {
    const { container } = render(
      <TextWithMediaPreview
        componentId="cmp-text-media"
        componentType="text-with-media"
        data={{
          title: 'Bottom Placement',
          body: '<p>Content</p>',
          mediaType: 'image',
          mediaUrl: 'https://example.com/media.jpg',
          mediaPosition: 'bottom',
        }}
      />
    );

    expect(container.querySelector('.tpl-text-media--bottom')).toBeInTheDocument();
  });

  it('applies custom dimensions when specified', () => {
    render(
      <TextWithMediaPreview
        componentId="cmp-text-media"
        componentType="text-with-media"
        data={{
          title: 'Custom Size',
          body: '<p>Content</p>',
          mediaType: 'image',
          mediaUrl: 'https://example.com/media.jpg',
          mediaWidth: '500px',
          mediaHeight: '300px',
        }}
      />
    );

    const mediaSection = screen.getByLabelText('Media section');
    expect(mediaSection).toHaveStyle({ width: '500px', height: '300px' });
  });
});
