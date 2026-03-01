import { fireEvent, render, screen } from '@testing-library/react';
import { LayeredContentPreview } from './LayeredContent';

const layeredData = {
  title: 'Layered Topics',
  layers: [
    { id: 'layer-1', label: 'Overview', content: 'Overview content' },
    { id: 'layer-2', label: 'Details', content: 'Details content' },
  ],
};

describe('LayeredContentPreview', () => {
  it('renders with first layer by default', () => {
    render(
      <LayeredContentPreview
        componentId="cmp-layered"
        componentType="layered-content"
        data={layeredData}
      />
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Overview content')).toBeInTheDocument();
  });

  it('switches layers on tab click', () => {
    render(
      <LayeredContentPreview
        componentId="cmp-layered"
        componentType="layered-content"
        data={layeredData}
      />
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Details content')).toBeInTheDocument();
  });

  it('calls onComplete after all layers are viewed', () => {
    const onComplete = jest.fn();

    render(
      <LayeredContentPreview
        componentId="cmp-layered"
        componentType="layered-content"
        data={layeredData}
        onComplete={onComplete}
      />
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

    expect(onComplete).toHaveBeenCalledWith('cmp-layered');
  });
});
