import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { GuidedPracticeEditor, GuidedPracticePreview } from './GuidedPractice';

describe('GuidedPractice', () => {
  const data = {
    title: 'Guided Practice',
    intro: 'Follow the steps',
    steps: [
      { id: 's1', instruction: 'Step 1', hint: 'Hint 1', expectedOutcome: 'Done 1' },
      { id: 's2', instruction: 'Step 2', hint: 'Hint 2', expectedOutcome: 'Done 2' },
    ],
    showHintsByDefault: false,
  };

  it('navigates between steps', () => {
    render(<GuidedPracticePreview componentId="gp" data={data} />);
    expect(screen.getByRole('heading', { name: /step 1/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('heading', { name: /step 2/i })).toBeInTheDocument();
  });

  it('toggles hint visibility', () => {
    render(<GuidedPracticePreview componentId="gp" data={data} />);
    expect(screen.queryByText('Hint 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show hint/i }));
    expect(screen.getByText('Hint 1')).toBeInTheDocument();
  });

  it('completes only after all steps are checked', () => {
    const onComplete = jest.fn();
    render(<GuidedPracticePreview componentId="gp" data={data} onComplete={onComplete} />);

    fireEvent.click(screen.getByLabelText(/mark this step complete/i));
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByLabelText(/mark this step complete/i));
    expect(onComplete).toHaveBeenCalledWith('gp');
  });

  it('editor can add step', () => {
    const onChange = jest.fn();
    render(<GuidedPracticeEditor data={data} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add step/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
