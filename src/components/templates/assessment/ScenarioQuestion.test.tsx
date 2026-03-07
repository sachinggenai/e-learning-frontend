import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ScenarioQuestionPreview, ScenarioQuestionEditor } from './ScenarioQuestion';

describe('ScenarioQuestion', () => {
  const mockData = {
    scenario: 'A customer reports that they cannot access their account after a recent password reset.',
    scenarioImage: 'https://example.com/scenario.jpg',
    question: 'What should be your first action?',
    options: [
      { id: 'opt1', text: 'Reset their password again', points: 5, feedback: 'Good choice, but not the best first step.' },
      { id: 'opt2', text: 'Check if the account is locked', points: 10, feedback: 'Excellent! This is the correct first step in troubleshooting.' },
      { id: 'opt3', text: 'Ask them to create a new account', points: 0, feedback: 'This would cause loss of data and is not recommended.' },
    ],
  };

  describe('ScenarioQuestionPreview', () => {
    it('renders without errors', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);
      expect(screen.getByText(/customer reports/i)).toBeInTheDocument();
      expect(screen.getByText('What should be your first action?')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);
      expect(container.querySelector('.scenario-question')).toBeInTheDocument();
      expect(container.querySelector('.scenario-question__context')).toBeInTheDocument();
      expect(container.querySelector('.scenario-question__question')).toBeInTheDocument();
      expect(container.querySelector('.scenario-question__options')).toBeInTheDocument();
      expect(container.querySelectorAll('.scenario-question__option')).toHaveLength(3);
    });

    it('renders scenario image when provided', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);
      const image = screen.getByAltText('Scenario');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/scenario.jpg');
    });

    it('renders scenario description', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);
      expect(screen.getByText(/customer reports that they cannot access/i)).toBeInTheDocument();
    });

    it('allows user to select an option', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);
      const option = screen.getByText('Check if the account is locked').closest('button');
      
      fireEvent.click(option!);
      expect(option).toHaveClass('scenario-question__option--selected');
    });

    it('submit button disabled until option selected', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      expect(submitButton).toBeDisabled();

      const option = screen.getByText('Check if the account is locked').closest('button');
      fireEvent.click(option!);
      expect(submitButton).toBeEnabled();
    });

    it('calls onInteraction with correct payload on submit (best answer)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <ScenarioQuestionPreview
          componentId="sq-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      const option = screen.getByText('Check if the account is locked').closest('button');
      fireEvent.click(option!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'sq-1',
          interactionType: 'submit',
          interactionId: 'opt2',
          value: 'opt2',
          score: 10,
          maxScore: 10,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('sq-1');
    });

    it('calls onInteraction with partial points for suboptimal answer', () => {
      const onInteraction = jest.fn();

      render(
        <ScenarioQuestionPreview
          componentId="sq-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      const option = screen.getByText('Reset their password again').closest('button');
      fireEvent.click(option!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 5,
          maxScore: 10,
          isCorrect: false,
        })
      );
    });

    it('shows feedback after submission', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);

      const option = screen.getByText('Check if the account is locked').closest('button');
      fireEvent.click(option!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/Excellent! This is the correct first step/i)).toBeInTheDocument();
    });

    it('hides submit button after submission', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);

      const option = screen.getByText('Check if the account is locked').closest('button');
      fireEvent.click(option!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(submitButton).not.toBeInTheDocument();
    });

    it('disables options after submit', () => {
      render(<ScenarioQuestionPreview componentId="sq-1" data={mockData} />);

      const option = screen.getByText('Check if the account is locked').closest('button');
      fireEvent.click(option!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      const allOptions = screen.getAllByRole('radio');
      allOptions.forEach(opt => {
        expect(opt).toBeDisabled();
      });
    });

    it('handles missing feedback gracefully', () => {
      const dataNoFeedback = {
        ...mockData,
        options: mockData.options.map(opt => ({ ...opt, feedback: undefined })),
      };

      render(<ScenarioQuestionPreview componentId="sq-1" data={dataNoFeedback} />);

      const option = screen.getByText('Check if the account is locked').closest('button');
      fireEvent.click(option!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(screen.queryByText(/Excellent/i)).not.toBeInTheDocument();
    });
  });

  describe('ScenarioQuestionEditor', () => {
    it('renders without errors', () => {
      render(<ScenarioQuestionEditor componentId="sq-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByDisplayValue(/customer reports/i)).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<ScenarioQuestionEditor componentId="sq-1" data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.scenario-question-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.scenario-option-row')).toHaveLength(3);
    });

    it('calls onChange when scenario is updated', () => {
      const onChange = jest.fn();
      render(<ScenarioQuestionEditor componentId="sq-1" data={mockData} onChange={onChange} />);

      const scenarioInput = screen.getByDisplayValue(/customer reports/i);
      fireEvent.change(scenarioInput, { target: { value: 'Updated scenario' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when question is updated', () => {
      const onChange = jest.fn();
      render(<ScenarioQuestionEditor componentId="sq-1" data={mockData} onChange={onChange} />);

      const questionInput = screen.getByDisplayValue('What should be your first action?');
      fireEvent.change(questionInput, { target: { value: 'Updated question' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('shows add option button', () => {
      render(<ScenarioQuestionEditor componentId="sq-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByRole('button', { name: /add option/i })).toBeInTheDocument();
    });
  });
});
