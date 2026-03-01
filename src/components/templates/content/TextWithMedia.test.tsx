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
});
