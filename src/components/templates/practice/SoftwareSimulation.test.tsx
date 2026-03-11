import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SoftwareSimulationEditor, SoftwareSimulationPreview } from './SoftwareSimulation';

describe('SoftwareSimulation', () => {
  const data = {
    title: 'Software Simulation',
    strictMode: true,
    steps: [
      {
        id: 's1',
        title: 'Open Menu',
        instruction: 'Click menu hotspot',
        imageUrl: '',
        hotspots: [
          { id: 'h1', x: 10, y: 10, w: 20, h: 12, label: 'Menu' },
          { id: 'h2', x: 40, y: 40, w: 20, h: 12, label: 'Wrong' },
        ],
      },
      {
        id: 's2',
        title: 'Save',
        instruction: 'Click save hotspot',
        imageUrl: '',
        hotspots: [{ id: 'h3', x: 10, y: 10, w: 20, h: 12, label: 'Save' }],
      },
    ],
  };

  it('strict mode blocks wrong hotspot', () => {
    render(<SoftwareSimulationPreview componentId="ss" data={data} />);
    fireEvent.click(screen.getByLabelText('Wrong'));
    expect(screen.getByText(/incorrect target/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
  });

  it('completes after valid hotspots across steps', () => {
    const onComplete = jest.fn();
    render(<SoftwareSimulationPreview componentId="ss" data={data} onComplete={onComplete} />);
    fireEvent.click(screen.getByLabelText('Menu'));
    fireEvent.click(screen.getByLabelText('Save'));
    expect(onComplete).toHaveBeenCalledWith('ss');
  });

  it('editor can add step', () => {
    const onChange = jest.fn();
    render(<SoftwareSimulationEditor data={data} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add step/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
