import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegulatoryScenarioEditor, RegulatoryScenarioPreview, RegulatoryScenarioData } from './RegulatoryScenario';

const mockData: RegulatoryScenarioData = {
  title: 'Regulatory Scenario',
  scenarioText: 'A customer asks for confidential data.',
  explanation: 'You must deny and escalate.',
  maxAttempts: 2,
  requireCorrectToComplete: true,
  choices: [
    { id: 'a', text: 'Share the data', isCorrect: false, feedback: 'Violates policy' },
    { id: 'b', text: 'Deny and escalate', isCorrect: true },
  ],
};

describe('RegulatoryScenarioPreview', () => {
  test('emits scenario_answered and scenario_completed', () => {
    const onInteraction = jest.fn();
    render(<RegulatoryScenarioPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByLabelText('Deny and escalate'));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'scenario_answered' }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'scenario_completed' }));
  });

  test('shows retry for incorrect answer', () => {
    const onInteraction = jest.fn();
    render(<RegulatoryScenarioPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByLabelText('Share the data'));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});

describe('RegulatoryScenarioEditor', () => {
  test('updates title', () => {
    const onChange = jest.fn();
    render(<RegulatoryScenarioEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('Regulatory Scenario'), { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalled();
  });
});
