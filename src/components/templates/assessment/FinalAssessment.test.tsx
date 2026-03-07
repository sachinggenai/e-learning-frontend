import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FinalAssessmentPreview, FinalAssessmentEditor } from './FinalAssessment';

describe('FinalAssessment', () => {
  const mockData = {
    title: 'Final Course Assessment',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'mcq' as const,
        question: 'What is the capital of France?',
        options: [
          { id: 'opt1', text: 'London', isCorrect: false },
          { id: 'opt2', text: 'Paris', isCorrect: true },
          { id: 'opt3', text: 'Berlin', isCorrect: false },
        ],
        points: 10,
      },
      {
        id: 'q2',
        type: 'true-false' as const,
        question: 'Earth is the third planet from the Sun.',
        correctAnswer: true,
        points: 10,
      },
      {
        id: 'q3',
        type: 'fill-blank' as const,
        question: 'The {{color}} of the sky is blue.',
        correctAnswer: 'color',
        points: 10,
      },
    ],
  };

  describe('FinalAssessmentPreview', () => {
    it('renders without errors', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);
      expect(screen.getByText('Final Course Assessment')).toBeInTheDocument();
      expect(screen.getByText(/what is the capital of france/i)).toBeInTheDocument();
      expect(screen.getByText(/earth is the third planet from the sun/i)).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);
      expect(container.querySelector('.final-assessment')).toBeInTheDocument();
      expect(container.querySelector('.final-assessment__title')).toBeInTheDocument();
      expect(container.querySelectorAll('.fa-question')).toHaveLength(3);
    });

    it('displays question numbers and types', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);
      expect(screen.getByText(/1\./)).toBeInTheDocument();
      expect(screen.getByText(/2\./)).toBeInTheDocument();
      expect(screen.getByText(/3\./)).toBeInTheDocument();
      expect(screen.getAllByText(/\(10 pts\)/)).toHaveLength(3);
    });

    it('submit button disabled until all questions answered', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);
      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when all questions answered', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);
      
      // Answer MCQ
      fireEvent.click(screen.getByLabelText('Paris'));
      
      // Answer True/False
      fireEvent.click(screen.getByLabelText('True'));
      
      // Answer Fill Blanks
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'color' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      expect(submitButton).toBeEnabled();
    });

    it('calculates total score correctly (all correct)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <FinalAssessmentPreview
          componentId="fa-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      // Answer all correctly
      fireEvent.click(screen.getByLabelText('Paris'));
      fireEvent.click(screen.getByLabelText('True'));
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'color' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'fa-1',
          interactionType: 'submit',
          score: 30,
          maxScore: 30,
          isCorrect: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('fa-1');
    });

    it('calculates partial score correctly', () => {
      const onInteraction = jest.fn();

      render(
        <FinalAssessmentPreview
          componentId="fa-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      // Answer one correct, two incorrect
      fireEvent.click(screen.getByLabelText('Paris'));
      fireEvent.click(screen.getByLabelText('False'));
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'wrong' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 10,
          maxScore: 30,
          isCorrect: false,
        })
      );
    });

    it('displays score and percentage after submit', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);

      // Answer all correctly
      fireEvent.click(screen.getByLabelText('Paris'));
      fireEvent.click(screen.getByLabelText('True'));
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'color' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/score: 30\/30/i)).toBeInTheDocument();
      expect(screen.getByText(/100%/i)).toBeInTheDocument();
    });

    it('shows passing message when score meets threshold', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);

      // Answer all correctly (100% > 70% passing)
      fireEvent.click(screen.getByLabelText('Paris'));
      fireEvent.click(screen.getByLabelText('True'));
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'color' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/congratulations! you passed!/i)).toBeInTheDocument();
    });

    it('shows failing message when score below threshold', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);

      // Answer only one question correctly (33.3% < 70% passing)
      fireEvent.click(screen.getByLabelText('London'));
      fireEvent.click(screen.getByLabelText('False'));
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'color' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/you did not pass\./i)).toBeInTheDocument();
    });

    it('disables all questions after submit', () => {
      render(<FinalAssessmentPreview componentId="fa-1" data={mockData} />);

      // Answer all questions
      fireEvent.click(screen.getByLabelText('Paris'));
      fireEvent.click(screen.getByLabelText('True'));
      const blankInput = screen.getByPlaceholderText('Type your answer...');
      fireEvent.change(blankInput, { target: { value: 'color' } });

      const submitButton = screen.getByRole('button', { name: /submit assessment/i });
      fireEvent.click(submitButton);

      // Check inputs are disabled
      const mcqOption = screen.getByLabelText('Paris');
      expect(mcqOption).toBeDisabled();
      
      const tfRadio = screen.getByLabelText('True');
      expect(tfRadio).toBeDisabled();
      
      expect(blankInput).toBeDisabled();
    });
  });

  describe('FinalAssessmentEditor', () => {
    it('renders without errors', () => {
      render(<FinalAssessmentEditor componentId="fa-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('Final Course Assessment')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<FinalAssessmentEditor componentId="fa-1" data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.final-assessment-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.fa-editor__question')).toHaveLength(3);
    });

    it('calls onChange when title is updated', () => {
      const onChange = jest.fn();
      render(<FinalAssessmentEditor componentId="fa-1" data={mockData} onChange={onChange} />);

      const titleInput = screen.getByDisplayValue('Final Course Assessment');
      fireEvent.change(titleInput, { target: { value: 'Updated Assessment' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('displays passing score configuration', () => {
      render(<FinalAssessmentEditor componentId="fa-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('70')).toBeInTheDocument();
    });

    it('shows add question button', () => {
      render(<FinalAssessmentEditor componentId="fa-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByRole('button', { name: /\+ mcq/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /\+ true\/false/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /\+ fill blank/i })).toBeInTheDocument();
    });

    it('displays remove question buttons', () => {
      render(<FinalAssessmentEditor componentId="fa-1" data={mockData} onChange={jest.fn()} />);
      const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
      expect(removeButtons).toHaveLength(3);
    });
  });
});
