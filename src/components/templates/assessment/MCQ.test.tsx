import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MCQPreview, MCQEditor } from './MCQ';

describe('MCQ (Multiple Choice Question)', () => {
  const mockData = {
    question: 'What is the capital of France?',
    options: [
      { id: 'opt1', text: 'London', isCorrect: false },
      { id: 'opt2', text: 'Paris', isCorrect: true },
      { id: 'opt3', text: 'Berlin', isCorrect: false },
      { id: 'opt4', text: 'Madrid', isCorrect: false },
    ],
    explanation: 'Paris is the capital and largest city of France.',
    maxScore: 1,
  };

  describe('MCQPreview', () => {
    it('renders without errors', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<MCQPreview componentId="mcq-1" data={mockData} />);
      expect(container.querySelector('.mcq-component')).toBeInTheDocument();
      expect(container.querySelector('.mcq__question')).toBeInTheDocument();
      expect(container.querySelector('.mcq__options')).toBeInTheDocument();
      expect(container.querySelectorAll('.mcq__option')).toHaveLength(4);
    });

    it('allows user to select an option', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);
      const parisOption = screen.getByText('Paris').closest('button');
      
      fireEvent.click(parisOption!);
      expect(parisOption).toHaveClass('mcq__option--selected');
    });

    it('submit button disabled until option selected', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      expect(submitButton).toBeDisabled();

      const parisOption = screen.getByText('Paris').closest('button');
      fireEvent.click(parisOption!);
      expect(submitButton).toBeEnabled();
    });

    it('calls onInteraction with correct payload on submit', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <MCQPreview
          componentId="mcq-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      const parisOption = screen.getByText('Paris').closest('button');
      fireEvent.click(parisOption!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'mcq-1',
          interactionType: 'submit',
          interactionId: 'opt2',
          value: 'opt2',
          score: 1,
          maxScore: 1,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('mcq-1');
    });

    it('shows correct/incorrect visual feedback after submit', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);

      // Select wrong answer
      const londonOption = screen.getByText('London').closest('button');
      fireEvent.click(londonOption!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      // Check visual feedback
      expect(londonOption).toHaveClass('mcq__option--incorrect');
      const parisOption = screen.getByText('Paris').closest('button');
      expect(parisOption).toHaveClass('mcq__option--correct');
    });

    it('displays explanation after submit', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);

      const parisOption = screen.getByText('Paris').closest('button');
      fireEvent.click(parisOption!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/Paris is the capital and largest city of France/i)).toBeInTheDocument();
    });

    it('shows retry button after submit and allows retry', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);

      const parisOption = screen.getByText('Paris').closest('button');
      fireEvent.click(parisOption!);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);

      // After retry, submit button should be back and disabled
      expect(screen.getByRole('button', { name: /submit answer/i })).toBeDisabled();
    });

    it('disables options after submit', () => {
      render(<MCQPreview componentId="mcq-1" data={mockData} />);

      const parisOption = screen.getByText('Paris').closest('button')!;
      fireEvent.click(parisOption);

      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      fireEvent.click(submitButton);

      const londonOption = screen.getByText('London').closest('button')!;
      expect(londonOption).toBeDisabled();
    });
  });

  describe('MCQEditor', () => {
    it('renders without errors', () => {
      render(<MCQEditor data={mockData} onChange={jest.fn()} />);
      expect(screen.getByLabelText('Question')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<MCQEditor data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.mcq-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.mcq-editor__option-row')).toHaveLength(4);
    });

    it('calls onChange when question is updated', () => {
      const onChange = jest.fn();
      render(<MCQEditor data={mockData} onChange={onChange} />);

      const questionInput = screen.getByDisplayValue('What is the capital of France?');
      fireEvent.change(questionInput, { target: { value: 'Updated question' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when option text is updated', () => {
      const onChange = jest.fn();
      render(<MCQEditor data={mockData} onChange={onChange} />);

      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/);
      fireEvent.change(optionInputs[0], { target: { value: 'Updated option' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('allows marking an option as correct', () => {
      const onChange = jest.fn();
      render(<MCQEditor data={mockData} onChange={onChange} />);

      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]); // Mark first option as correct

      expect(onChange).toHaveBeenCalled();
    });

    it('shows add option button and adds option', () => {
      const onChange = jest.fn();
      render(<MCQEditor data={mockData} onChange={onChange} />);

      const addButton = screen.getByRole('button', { name: /add option/i });
      fireEvent.click(addButton);

      expect(onChange).toHaveBeenCalled();
    });

    it('shows remove option button for options beyond minimum', () => {
      const onChange = jest.fn();
      render(<MCQEditor data={mockData} onChange={onChange} />);

      const removeButtons = screen.getAllByLabelText(/remove option/i);
      expect(removeButtons.length).toBeGreaterThan(0);

      fireEvent.click(removeButtons[0]);
      expect(onChange).toHaveBeenCalled();
    });

    it('respects readOnly prop', () => {
      render(<MCQEditor data={mockData} onChange={jest.fn()} readOnly />);

      const questionInput = screen.getByDisplayValue('What is the capital of France?');
      expect(questionInput).toBeDisabled();

      const addButton = screen.queryByRole('button', { name: /add option/i });
      expect(addButton).not.toBeInTheDocument();
    });
  });
});
