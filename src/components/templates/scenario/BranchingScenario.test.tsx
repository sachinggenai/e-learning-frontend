import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { BranchingScenarioPreview, BranchingScenarioEditor } from './BranchingScenario';

describe('BranchingScenario', () => {
  const mockData = {
    title: 'Incident Response',
    showScore: true,
    startNodeId: 'n1',
    nodes: [
      {
        id: 'n1',
        title: 'Initial Alert',
        narrative: 'You receive a high-priority security alert.',
        choices: [
          {
            id: 'c1',
            text: 'Investigate immediately',
            nextNodeId: 'n2',
            points: 5,
            feedback: 'Good first action',
          },
          {
            id: 'c2',
            text: 'Ignore and continue work',
            nextNodeId: null,
            points: 0,
            feedback: 'Risky action',
          },
        ],
      },
      {
        id: 'n2',
        title: 'Containment',
        narrative: 'You isolate the affected system and stop spread.',
        isEnd: true,
        endMessage: 'Scenario Complete!',
        choices: [],
      },
    ],
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders themed root and title', () => {
    render(<BranchingScenarioPreview data={mockData} />);

    expect(screen.getByTestId('branching-scenario-preview')).toHaveClass('tpl-branching-scenario');
    expect(screen.getByText('Incident Response')).toBeInTheDocument();
  });

  it('renders empty state when nodes are missing', () => {
    render(<BranchingScenarioPreview data={{ title: 'Empty', nodes: [] }} />);

    expect(screen.getByText('No scenario nodes configured.')).toHaveClass('tpl-branching-scenario__empty');
  });

  it('calls onInteraction and navigates to next node', () => {
    const onInteraction = jest.fn();
    render(<BranchingScenarioPreview data={mockData} onInteraction={onInteraction} />);

    fireEvent.click(screen.getByText('Investigate immediately'));

    expect(onInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        interactionType: 'scenario-choice',
        interactionId: 'c1',
        value: 'Investigate immediately',
      })
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Containment')).toBeInTheDocument();
  });

  it('shows feedback during delay and applies feedback class', () => {
    render(<BranchingScenarioPreview data={mockData} />);

    fireEvent.click(screen.getByText('Investigate immediately'));
    expect(screen.getByTestId('branching-scenario-feedback')).toHaveClass('tpl-branching-scenario__feedback');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.queryByTestId('branching-scenario-feedback')).not.toBeInTheDocument();
  });

  it('calls onComplete when an end choice is selected', () => {
    const onComplete = jest.fn();
    render(<BranchingScenarioPreview data={mockData} onComplete={onComplete} />);

    fireEvent.click(screen.getByText('Ignore and continue work'));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledWith('');
  });

  it('renders editor themed root and add node button', () => {
    render(<BranchingScenarioEditor data={mockData} onChange={jest.fn()} />);

    expect(screen.getByTestId('branching-scenario-editor')).toHaveClass('tpl-branching-scenario-editor');
    expect(screen.getByText('+ Add Node')).toBeInTheDocument();
  });

  it('editor add node triggers onChange', () => {
    const onChange = jest.fn();
    render(<BranchingScenarioEditor data={mockData} onChange={onChange} />);

    fireEvent.click(screen.getByText('+ Add Node'));

    expect(onChange).toHaveBeenCalled();
  });
});
