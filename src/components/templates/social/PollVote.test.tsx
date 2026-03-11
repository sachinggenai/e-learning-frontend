import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PollVoteEditor, PollVotePreview } from './PollVote';

describe('PollVote', () => {
  const baseData = {
    title: 'Quick Poll',
    question: 'Which learning style suits you best?',
    options: [
      { id: 'o1', label: 'Visual', votes: 5 },
      { id: 'o2', label: 'Auditory', votes: 3 },
      { id: 'o3', label: 'Kinesthetic', votes: 2 },
    ],
    allowMultiple: false,
  };

  it('renders title and options', () => {
    render(<PollVotePreview componentId="pv" data={baseData} />);
    expect(screen.getByText('Quick Poll')).toBeInTheDocument();
    expect(screen.getByText('Visual')).toBeInTheDocument();
    expect(screen.getByText('Auditory')).toBeInTheDocument();
  });

  it('vote button is disabled until an option is selected', () => {
    render(<PollVotePreview componentId="pv" data={baseData} />);
    expect(screen.getByRole('button', { name: /vote/i })).toBeDisabled();
  });

  it('shows percentage results after vote and calls onComplete', () => {
    const onComplete = jest.fn();
    render(<PollVotePreview componentId="pv" data={baseData} onComplete={onComplete} />);
    fireEvent.click(screen.getByLabelText('Visual'));
    fireEvent.click(screen.getByRole('button', { name: /vote/i }));
    expect(onComplete).toHaveBeenCalledWith('pv');
    expect(screen.getByText(/vote/i)).toBeInTheDocument();
    expect(screen.getAllByText(/%/).length).toBeGreaterThan(0);
  });

  it('editor can add an option', () => {
    const onChange = jest.fn();
    render(<PollVoteEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Option/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
