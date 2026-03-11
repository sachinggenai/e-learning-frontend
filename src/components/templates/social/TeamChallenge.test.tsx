import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TeamChallengeEditor, TeamChallengePreview } from './TeamChallenge';

describe('TeamChallenge', () => {
  const baseData = {
    title: 'Build a Prototype',
    objective: 'Design and present a working prototype in 30 minutes.',
    teamSize: 4,
    timeboxMin: 30,
    steps: [
      { id: 's1', text: 'Define the problem', ownerRole: 'Lead' },
      { id: 's2', text: 'Sketch the solution', ownerRole: 'Designer' },
    ],
  };

  it('renders title, objective, and steps', () => {
    render(<TeamChallengePreview componentId="tc" data={baseData} />);
    expect(screen.getByText('Build a Prototype')).toBeInTheDocument();
    expect(screen.getByText(/Design and present/i)).toBeInTheDocument();
    expect(screen.getByText('Define the problem')).toBeInTheDocument();
  });

  it('toggling a step updates progress text', () => {
    render(<TeamChallengePreview componentId="tc" data={baseData} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText(/1 of 2 steps completed/i)).toBeInTheDocument();
  });

  it('calls onComplete when all steps are checked', () => {
    const onComplete = jest.fn();
    render(<TeamChallengePreview componentId="tc" data={baseData} onComplete={onComplete} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    expect(onComplete).toHaveBeenCalledWith('tc');
  });

  it('editor can add a step', () => {
    const onChange = jest.fn();
    render(<TeamChallengeEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Step/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
