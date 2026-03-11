import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DiscussionPromptEditor, DiscussionPromptPreview } from './DiscussionPrompt';

describe('DiscussionPrompt', () => {
  const baseData = {
    title: 'Reflect on Today',
    prompt: 'What was the most important concept you learned?',
    placeholder: 'Type here…',
    minChars: 10,
    allowAnonymous: false,
  };

  it('renders the prompt and disables submit below min chars', () => {
    render(<DiscussionPromptPreview componentId="dp" data={baseData} />);
    expect(screen.getByText(/Reflect on Today/i)).toBeInTheDocument();
    expect(screen.getByText(/most important concept/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('enables submit once minimum characters are met', () => {
    render(<DiscussionPromptPreview componentId="dp" data={baseData} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Long enough text here' } });
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  it('shows success state and calls onComplete after submit', () => {
    const onComplete = jest.fn();
    render(
      <DiscussionPromptPreview componentId="dp" data={baseData} onComplete={onComplete} />,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Long enough text here' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onComplete).toHaveBeenCalledWith('dp');
    expect(screen.getByText(/submitted/i)).toBeInTheDocument();
  });

  it('editor renders fields', () => {
    const onChange = jest.fn();
    render(<DiscussionPromptEditor data={baseData} onChange={onChange} />);
    expect(screen.getByDisplayValue('Reflect on Today')).toBeInTheDocument();
  });
});
