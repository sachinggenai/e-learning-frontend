import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SandboxPracticeEditor, SandboxPracticePreview } from './SandboxPractice';

describe('SandboxPractice', () => {
  const data = {
    title: 'Sandbox Practice',
    prompt: 'Write your answer',
    placeholder: 'Type here',
    referenceAnswer: 'Reference text',
    minChars: 10,
    allowReveal: true,
  };

  it('enforces min chars for submit', () => {
    render(<SandboxPracticePreview componentId="sp" data={data} />);
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/your response/i), { target: { value: 'enough chars here' } });
    expect(submit).toBeEnabled();
  });

  it('reveals reference panel', () => {
    render(<SandboxPracticePreview componentId="sp" data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /reveal reference/i }));
    expect(screen.getByText('Reference text')).toBeInTheDocument();
  });

  it('calls onComplete when submitted after reveal with min chars', () => {
    const onComplete = jest.fn();
    render(<SandboxPracticePreview componentId="sp" data={data} onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText(/your response/i), { target: { value: 'enough chars here' } });
    fireEvent.click(screen.getByRole('button', { name: /reveal reference/i }));
    expect(onComplete).toHaveBeenCalledWith('sp');
  });

  it('editor updates through input changes', () => {
    const onChange = jest.fn();
    render(<SandboxPracticeEditor data={data} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalled();
  });
});
