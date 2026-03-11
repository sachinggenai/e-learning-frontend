import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorIdentificationEditor, ErrorIdentificationPreview } from './ErrorIdentification';

describe('ErrorIdentification', () => {
  const data = {
    title: 'Error Identification',
    instructions: 'Select incorrect statements',
    maxSelections: 2,
    showExplanations: true,
    tokens: [
      { id: 't1', text: 'Incorrect statement', isError: true, explanation: 'This is wrong.' },
      { id: 't2', text: 'Correct statement', isError: false },
      { id: 't3', text: 'Another incorrect statement', isError: true, explanation: 'Also wrong.' },
    ],
  };

  it('toggles token selections', () => {
    render(<ErrorIdentificationPreview componentId="ei" data={data} />);
    const token = screen.getByRole('button', { name: 'Incorrect statement' });
    fireEvent.click(token);
    expect(token).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(token);
    expect(token).toHaveAttribute('aria-pressed', 'false');
  });

  it('enforces max selection limit', () => {
    render(<ErrorIdentificationPreview componentId="ei" data={data} />);
    fireEvent.click(screen.getByRole('button', { name: 'Incorrect statement' }));
    fireEvent.click(screen.getByRole('button', { name: 'Correct statement' }));
    const third = screen.getByRole('button', { name: 'Another incorrect statement' });
    expect(third).toBeDisabled();
  });

  it('submits score and explanations and calls onComplete', () => {
    const onComplete = jest.fn();
    render(<ErrorIdentificationPreview componentId="ei" data={data} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: 'Incorrect statement' }));
    fireEvent.click(screen.getByRole('button', { name: 'Another incorrect statement' }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/score:/i)).toBeInTheDocument();
    expect(screen.getByText('This is wrong.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledWith('ei');
  });

  it('editor can add token', () => {
    const onChange = jest.fn();
    render(<ErrorIdentificationEditor data={data} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add token/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
