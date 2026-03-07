import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { KnowledgeCheckPreview, KnowledgeCheckEditor } from './KnowledgeCheck';

describe('KnowledgeCheck', () => {
  const mockData = {
    title: 'Quick Knowledge Check',
    questions: [
      {
        id: 'q1',
        question: 'What is 2 + 2?',
        options: [
          { id: 'q1-opt1', text: '3', isCorrect: false },
          { id: 'q1-opt2', text: '4', isCorrect: true },
          { id: 'q1-opt3', text: '5', isCorrect: false },
        ],
        explanation: '2 + 2 equals 4.',
      },
      {
        id: 'q2',
        question: 'What is the capital of France?',
        options: [
          { id: 'q2-opt1', text: 'London', isCorrect: false },
          { id: 'q2-opt2', text: 'Paris', isCorrect: true },
          { id: 'q2-opt3', text: 'Berlin', isCorrect: false },
        ],
        explanation: 'Paris is the capital of France.',
      },
    ],
  };

  describe('KnowledgeCheckPreview', () => {
    it('renders without errors', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);
      expect(screen.getByText('Quick Knowledge Check')).toBeInTheDocument();
      expect(screen.getByText('1. What is 2 + 2?')).toBeInTheDocument();
      expect(screen.getByText('2. What is the capital of France?')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);
      expect(container.querySelector('.knowledge-check')).toBeInTheDocument();
      expect(container.querySelector('.knowledge-check__title')).toBeInTheDocument();
      expect(container.querySelectorAll('.knowledge-check__question')).toHaveLength(2);
      expect(container.querySelectorAll('.kc-option')).toHaveLength(6); // 3 per question
    });

    it('allows user to select options for each question', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);
      
      const option1 = screen.getByText('4').closest('button');
      fireEvent.click(option1!);
      expect(option1).toHaveClass('kc-option--selected');

      const option2 = screen.getByText('Paris').closest('button');
      fireEvent.click(option2!);
      expect(option2).toHaveClass('kc-option--selected');
    });

    it('check answers button disabled until all questions answered', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);
      const checkButton = screen.getByRole('button', { name: /check answers/i });
      expect(checkButton).toBeDisabled();

      // Answer first question
      fireEvent.click(screen.getByText('4').closest('button')!);
      expect(checkButton).toBeDisabled();

      // Answer second question
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      expect(checkButton).toBeEnabled();
    });

    it('calls onInteraction with correct payload on submit (all correct)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <KnowledgeCheckPreview
          componentId="kc-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      // Answer both questions correctly
      fireEvent.click(screen.getByText('4').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      fireEvent.click(checkButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'kc-1',
          interactionType: 'submit',
          interactionId: 'knowledge-check',
          value: { q1: 'q1-opt2', q2: 'q2-opt2' },
          score: 2,
          maxScore: 2,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('kc-1');
    });

    it('calculates partial score for mixed answers', () => {
      const onInteraction = jest.fn();

      render(
        <KnowledgeCheckPreview
          componentId="kc-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      // Answer one correct, one incorrect
      fireEvent.click(screen.getByText('4').closest('button')!);
      fireEvent.click(screen.getByText('London').closest('button')!);

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      fireEvent.click(checkButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 1,
          maxScore: 2,
          isCorrect: false,
        })
      );
    });

    it('shows correct/incorrect visual feedback after submit', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);

      // Answer one correct, one incorrect
      const incorrectOption = screen.getByText('3').closest('button')!;
      fireEvent.click(incorrectOption);
      fireEvent.click(screen.getByText('Paris').closest('button')!);

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      fireEvent.click(checkButton);

      // Check for feedback classes
      expect(incorrectOption).toHaveClass('kc-option--incorrect');
      const correctOption = screen.getByText('4').closest('button')!;
      expect(correctOption).toHaveClass('kc-option--correct');
    });

    it('displays explanations after submit', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);

      fireEvent.click(screen.getByText('4').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      fireEvent.click(checkButton);

      expect(screen.getByText('2 + 2 equals 4.')).toBeInTheDocument();
      expect(screen.getByText('Paris is the capital of France.')).toBeInTheDocument();
    });

    it('replaces check button with try again button after submit', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);

      fireEvent.click(screen.getByText('4').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      fireEvent.click(checkButton);

      expect(checkButton).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('allows retry and resets state', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);

      // Answer and submit
      fireEvent.click(screen.getByText('4').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      fireEvent.click(screen.getByRole('button', { name: /check answers/i }));

      // Click Try Again
      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);

      // Should be back to initial state
      expect(screen.getByRole('button', { name: /check answers/i })).toBeDisabled();
      expect(screen.queryByText('2 + 2 equals 4.')).not.toBeInTheDocument();
    });

    it('disables options after submit', () => {
      render(<KnowledgeCheckPreview componentId="kc-1" data={mockData} />);

      fireEvent.click(screen.getByText('4').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);

      const checkButton = screen.getByRole('button', { name: /check answers/i });
      fireEvent.click(checkButton);

      const allOptions = screen.getAllByRole('radio');
      allOptions.forEach(opt => {
        expect(opt).toBeDisabled();
      });
    });
  });

  describe('KnowledgeCheckEditor', () => {
    it('renders without errors', () => {
      render(<KnowledgeCheckEditor componentId="kc-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('Quick Knowledge Check')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<KnowledgeCheckEditor componentId="kc-1" data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.knowledge-check-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.kc-editor__question')).toHaveLength(2);
    });

    it('calls onChange when title is updated', () => {
      const onChange = jest.fn();
      render(<KnowledgeCheckEditor componentId="kc-1" data={mockData} onChange={onChange} />);

      const titleInput = screen.getByDisplayValue('Quick Knowledge Check');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('displays question numbers', () => {
      render(<KnowledgeCheckEditor componentId="kc-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    it('shows add question button', () => {
      render(<KnowledgeCheckEditor componentId="kc-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByRole('button', { name: /add question/i })).toBeInTheDocument();
    });

    it('shows remove question buttons', () => {
      render(<KnowledgeCheckEditor componentId="kc-1" data={mockData} onChange={jest.fn()} />);
      const removeButtons = screen.getAllByTitle('Remove question');
      expect(removeButtons).toHaveLength(2);
    });
  });
});
