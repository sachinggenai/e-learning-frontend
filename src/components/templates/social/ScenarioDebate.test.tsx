import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ScenarioDebateEditor, ScenarioDebatePreview } from './ScenarioDebate';

describe('ScenarioDebate', () => {
  const baseData = {
    title: 'Remote vs Office',
    scenario: 'Your company is deciding whether to go fully remote or return to the office.',
    positionA: 'Stay Remote',
    positionB: 'Return to Office',
    showOpposing: true,
    minChars: 20,
  };

  it('renders title and position buttons', () => {
    render(<ScenarioDebatePreview componentId="sd" data={baseData} />);
    expect(screen.getByText('Remote vs Office')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stay Remote' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Return to Office' })).toBeInTheDocument();
  });

  it('rationale field appears after side is selected', () => {
    render(<ScenarioDebatePreview componentId="sd" data={baseData} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stay Remote' }));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('submit is disabled below min chars', () => {
    render(<ScenarioDebatePreview componentId="sd" data={baseData} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stay Remote' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'short' } });
    expect(screen.getByRole('button', { name: /submit position/i })).toBeDisabled();
  });

  it('calls onComplete on valid submit', () => {
    const onComplete = jest.fn();
    render(<ScenarioDebatePreview componentId="sd" data={baseData} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stay Remote' }));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'I strongly believe remote work is the future of collaboration.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit position/i }));
    expect(onComplete).toHaveBeenCalledWith('sd');
  });

  it('editor renders fields', () => {
    const onChange = jest.fn();
    render(<ScenarioDebateEditor data={baseData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Remote vs Office')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Stay Remote')).toBeInTheDocument();
  });
});
