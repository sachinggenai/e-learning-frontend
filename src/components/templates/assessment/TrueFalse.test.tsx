import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TrueFalsePreview, TrueFalseEditor } from './TrueFalse';

describe('TrueFalse', () => {
  const mockData = {
    question: 'The Earth is flat.',
    correctAnswer: false,
    explanation: 'The Earth is approximately spherical in shape.',
    maxScore: 1,
  };

  describe('TrueFalsePreview', () => {
    it('renders without errors', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);
      expect(screen.getByText('The Earth is flat.')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<TrueFalsePreview componentId="tf-1" data={mockData} />);
      expect(container.querySelector('.tf-component')).toBeInTheDocument();
      expect(container.querySelector('.tf__question')).toBeInTheDocument();
      expect(container.querySelector('.tf__options')).toBeInTheDocument();
      expect(container.querySelectorAll('.tf__option')).toHaveLength(2);
    });

    it('allows user to select True', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);
      
      const trueButton = screen.getByRole('radio', { name: 'True' });
      fireEvent.click(trueButton);

      expect(trueButton).toHaveClass('tf__option--selected');
    });

    it('allows user to select False', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);
      
      const falseButton = screen.getByRole('radio', { name: 'False' });
      fireEvent.click(falseButton);

      expect(falseButton).toHaveClass('tf__option--selected');
    });

    it('allows user to change selection before submit', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);
      
      const trueButton = screen.getByRole('radio', { name: 'True' });
      const falseButton = screen.getByRole('radio', { name: 'False' });

      fireEvent.click(trueButton);
      expect(trueButton).toHaveClass('tf__option--selected');

      fireEvent.click(falseButton);
      expect(falseButton).toHaveClass('tf__option--selected');
      expect(trueButton).not.toHaveClass('tf__option--selected');
    });

    it('submit button disabled until answer selected', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();

      const trueButton = screen.getByRole('radio', { name: 'True' });
      fireEvent.click(trueButton);
      expect(submitButton).toBeEnabled();
    });

    it('calls onInteraction with correct payload on submit (correct answer)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <TrueFalsePreview
          componentId="tf-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      const falseButton = screen.getByRole('radio', { name: 'False' });
      fireEvent.click(falseButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'tf-1',
          interactionType: 'submit',
          value: false,
          score: 1,
          maxScore: 1,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('tf-1');
    });

    it('calls onInteraction with correct payload on submit (incorrect answer)', () => {
      const onInteraction = jest.fn();

      render(
        <TrueFalsePreview
          componentId="tf-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      const trueButton = screen.getByRole('radio', { name: 'True' });
      fireEvent.click(trueButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          value: true,
          score: 0,
          maxScore: 1,
          isCorrect: false,
        })
      );
    });

    it('shows correct/incorrect visual feedback after submit', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);

      const trueButton = screen.getByRole('radio', { name: 'True' });
      const falseButton = screen.getByRole('radio', { name: 'False' });

      // Select wrong answer
      fireEvent.click(trueButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Check visual feedback
      expect(trueButton).toHaveClass('tf__option--incorrect');
      expect(falseButton).toHaveClass('tf__option--correct');
    });

    it('displays explanation after submit', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);

      const falseButton = screen.getByRole('radio', { name: 'False' });
      fireEvent.click(falseButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/The Earth is approximately spherical in shape/i)).toBeInTheDocument();
    });

    it('disables buttons after submit', () => {
      render(<TrueFalsePreview componentId="tf-1" data={mockData} />);

      const trueButton = screen.getByRole('radio', { name: 'True' });
      fireEvent.click(trueButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(trueButton).toBeDisabled();
      const falseButton = screen.getByRole('radio', { name: 'False' });
      expect(falseButton).toBeDisabled();
    });

    it('handles missing explanation gracefully', () => {
      const dataWithoutExplanation = { ...mockData, explanation: undefined };
      render(<TrueFalsePreview componentId="tf-1" data={dataWithoutExplanation} />);

      const trueButton = screen.getByRole('radio', { name: 'True' });
      fireEvent.click(trueButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(screen.queryByText(/Explanation/i)).not.toBeInTheDocument();
    });

    it('handles True as correct answer', () => {
      const trueCorrectData = { ...mockData, question: 'The Earth orbits the Sun.', correctAnswer: true };
      const onInteraction = jest.fn();

      render(
        <TrueFalsePreview
          componentId="tf-1"
          data={trueCorrectData}
          onInteraction={onInteraction}
        />
      );

      const trueButton = screen.getByRole('radio', { name: 'True' });
      fireEvent.click(trueButton);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          isCorrect: true,
          score: 1,
        })
      );
    });
  });

  describe('TrueFalseEditor', () => {
    it('renders without errors', () => {
      render(<TrueFalseEditor data={mockData} onChange={jest.fn()} />);
      expect(screen.getByLabelText('Statement')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<TrueFalseEditor data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.tf-editor')).toBeInTheDocument();
    });

    it('calls onChange when statement is updated', () => {
      const onChange = jest.fn();
      render(<TrueFalseEditor data={mockData} onChange={onChange} />);

      const statementInput = screen.getByDisplayValue('The Earth is flat.');
      fireEvent.change(statementInput, { target: { value: 'Updated statement' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when correct answer is changed to True', () => {
      const onChange = jest.fn();
      render(<TrueFalseEditor data={mockData} onChange={onChange} />);

      const trueRadio = screen.getByLabelText('True');
      fireEvent.click(trueRadio);

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when correct answer is changed to False', () => {
      const trueCorrectData = { ...mockData, correctAnswer: true };
      const onChange = jest.fn();
      render(<TrueFalseEditor data={trueCorrectData} onChange={onChange} />);

      const falseRadio = screen.getByLabelText('False');
      fireEvent.click(falseRadio);

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when explanation is updated', () => {
      const onChange = jest.fn();
      render(<TrueFalseEditor data={mockData} onChange={onChange} />);

      const explanationInput = screen.getByDisplayValue('The Earth is approximately spherical in shape.');
      fireEvent.change(explanationInput, { target: { value: 'Updated explanation' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('respects readOnly prop', () => {
      render(<TrueFalseEditor data={mockData} onChange={jest.fn()} readOnly />);

      const statementInput = screen.getByDisplayValue('The Earth is flat.');
      expect(statementInput).toBeDisabled();

      const trueRadio = screen.getByLabelText('True');
      expect(trueRadio).toBeDisabled();

      const explanationInput = screen.getByDisplayValue('The Earth is approximately spherical in shape.');
      expect(explanationInput).toBeDisabled();
    });

    it('correctly shows selected correct answer', () => {
      render(<TrueFalseEditor data={mockData} onChange={jest.fn()} />);

      const falseRadio = screen.getByLabelText('False') as HTMLInputElement;
      expect(falseRadio.checked).toBe(true);
    });
  });
});
