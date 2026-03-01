import { fireEvent, render, screen } from '@testing-library/react';
import { ImageHotspotsPreview } from './ImageHotspots';

const hotspotsData = {
  title: 'Machine Diagram',
  instructions: 'Click the hotspots to learn more.',
  imageUrl: 'https://example.com/machine.jpg',
  hotspots: [
    { id: 'hs-1', label: 'Panel', content: 'Main control panel.', x: 20, y: 30 },
    { id: 'hs-2', label: 'Motor', content: 'Primary motor housing.', x: 60, y: 55 },
  ],
};

describe('ImageHotspotsPreview', () => {
  it('renders hotspots and image', () => {
    render(
      <ImageHotspotsPreview
        componentId="cmp-hotspots"
        componentType="image-hotspots"
        data={hotspotsData}
      />
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/machine.jpg');
    expect(screen.getByLabelText('Hotspot: Panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Hotspot: Motor')).toBeInTheDocument();
  });

  it('shows placeholder when image is missing', () => {
    render(
      <ImageHotspotsPreview
        componentId="cmp-hotspots"
        componentType="image-hotspots"
        data={{ ...hotspotsData, imageUrl: '' }}
      />
    );

    expect(screen.getByText('No image set')).toBeInTheDocument();
  });

  it('opens and closes tooltip on marker click', () => {
    render(
      <ImageHotspotsPreview
        componentId="cmp-hotspots"
        componentType="image-hotspots"
        data={hotspotsData}
      />
    );

    fireEvent.click(screen.getByLabelText('Hotspot: Panel'));
    expect(screen.getByText('Main control panel.')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Hotspot: Panel'));
    expect(screen.queryByText('Main control panel.')).not.toBeInTheDocument();
  });

  it('updates explored progress count', () => {
    render(
      <ImageHotspotsPreview
        componentId="cmp-hotspots"
        componentType="image-hotspots"
        data={hotspotsData}
      />
    );

    expect(screen.getByText('0 / 2 hotspots explored')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Hotspot: Panel'));
    expect(screen.getByText('1 / 2 hotspots explored')).toBeInTheDocument();
  });

  it('calls onComplete after all hotspots are explored', () => {
    const onComplete = jest.fn();

    render(
      <ImageHotspotsPreview
        componentId="cmp-hotspots"
        componentType="image-hotspots"
        data={hotspotsData}
        onComplete={onComplete}
      />
    );

    fireEvent.click(screen.getByLabelText('Hotspot: Panel'));
    fireEvent.click(screen.getByLabelText('Hotspot: Motor'));

    expect(onComplete).toHaveBeenCalledWith('');
  });
});
