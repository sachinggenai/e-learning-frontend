import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TryItSimulationEditor, TryItSimulationPreview } from './TryItSimulation';

describe('TryItSimulation', () => {
  const data = {
    title: 'Try-It',
    prompt: 'Click in order',
    canvasLabel: 'Canvas',
    allowRetry: true,
    targets: [
      { id: 't1', label: 'First', order: 1, x: 20, y: 20, radius: 20 },
      { id: 't2', label: 'Second', order: 2, x: 40, y: 40, radius: 20 },
    ],
  };

  it('handles incorrect then correct click sequence', () => {
    render(<TryItSimulationPreview componentId="ti" data={data} />);
    fireEvent.click(screen.getByLabelText('Second'));
    expect(screen.getByText(/incorrect order/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('First'));
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
  });

  it('calls onComplete on correct full sequence', () => {
    const onComplete = jest.fn();
    render(<TryItSimulationPreview componentId="ti" data={data} onComplete={onComplete} />);
    fireEvent.click(screen.getByLabelText('First'));
    fireEvent.click(screen.getByLabelText('Second'));
    expect(onComplete).toHaveBeenCalledWith('ti');
  });

  it('editor can add target', () => {
    const onChange = jest.fn();
    render(<TryItSimulationEditor data={data} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add target/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
