import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MultipleSelectPreview, MultipleSelectEditor } from './MultipleSelect';

describe('MultipleSelect', () => {
  const mockData = {
    question: 'Which of the following are programming languages?',
    options: [
      { id: 'opt1', text: 'Python', isCorrect: true },
      { id: 'opt2', text: 'HTML', isCorrect: false },
      { id: 'opt3', text: 'JavaScript', isCorrect: true },
      { id: 'opt4', text: 'CSS', isCorrect: false },
    ],
    partialCreditMode: 'proportional',
    maxScore: 2,
  };

  describe('MultipleSelectPreview', () => {
    it('renders without errors', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);
      expect(screen.getByText('Which of the following are programming languages?')).toBeInTheDocument();
      expect(screen.getByText('Select all correct answers')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);
      expect(container.querySelector('.multiple-select-component')).toBeInTheDocument();
      expect(container.querySelector('.ms__question')).toBeInTheDocument();
      expect(container.querySelector('.ms__hint')).toBeInTheDocument();
      expect(container.querySelector('.ms__options')).toBeInTheDocument();
      expect(container.querySelectorAll('.ms__option')).toHaveLength(4);
    });

    it('allows user to select multiple options', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Python
      fireEvent.click(checkboxes[2]); // JavaScript

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('allows user to toggle selections', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Select Python
      expect(checkboxes[0]).toBeChecked();

      fireEvent.click(checkboxes[0]); // Deselect Python
      expect(checkboxes[0]).not.toBeChecked();
    });

    it('submit button disabled until at least one option selected', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(submitButton).toBeEnabled();
    });

    it('calls onInteraction with correct payload on submit (proportional scoring)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <MultipleSelectPreview
          componentId="ms-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Python (correct)
      fireEvent.click(checkboxes[2]); // JavaScript (correct)

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'ms-1',
          interactionType: 'submit',
          interactionId: 'multiple-select',
          value: expect.arrayContaining(['opt1', 'opt3']),
          score: 2,
          maxScore: 2,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('ms-1');
    });

    it('calculates proportional score correctly with partial answer', () => {
      const onInteraction = jest.fn();

      render(
        <MultipleSelectPreview
          componentId="ms-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Python (correct)
      fireEvent.click(checkboxes[1]); // HTML (incorrect)

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // 1 correct - 1 incorrect = 0, 0/2 = 0 score
      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 0,
          isCorrect: false,
        })
      );
    });

    it('calculates all-or-nothing score correctly', () => {
      const allOrNothingData = { ...mockData, partialCreditMode: 'all-or-nothing' };
      const onInteraction = jest.fn();

      render(
        <MultipleSelectPreview
          componentId="ms-1"
          data={allOrNothingData}
          onInteraction={onInteraction}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Python (correct)
      // Missing JavaScript

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 0,
          isCorrect: false,
        })
      );
    });

    it('shows correct/incorrect visual feedback after submit', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Python (correct)
      fireEvent.click(checkboxes[1]); // HTML (incorrect)

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      const options = screen.getAllByRole('checkbox').map(cb => cb.closest('label'));
      expect(options[0]).toHaveClass('ms__option--correct'); // Python
      expect(options[1]).toHaveClass('ms__option--incorrect'); // HTML
      expect(options[2]).toHaveClass('ms__option--correct'); // JavaScript
    });

    it('hides submit button after submission', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(submitButton).not.toBeInTheDocument();
    });

    it('disables checkboxes after submit', () => {
      render(<MultipleSelectPreview componentId="ms-1" data={mockData} />);

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    });
  });

  describe('MultipleSelectEditor', () => {
    it('renders without errors', () => {
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('Which of the following are programming languages?')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.ms-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.ms-editor__option-row')).toHaveLength(4);
    });

    it('calls onChange when question is updated', () => {
      const onChange = jest.fn();
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={onChange} />);

      const questionInput = screen.getByDisplayValue('Which of the following are programming languages?');
      fireEvent.change(questionInput, { target: { value: 'Updated question' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when partial credit mode is changed', () => {
      const onChange = jest.fn();
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={onChange} />);

      const select = screen.getByDisplayValue('Proportional');
      fireEvent.change(select, { target: { value: 'all-or-nothing' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when option text is updated', () => {
      const onChange = jest.fn();
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={onChange} />);

      const optionInputs = screen.getAllByPlaceholderText('Option text...');
      fireEvent.change(optionInputs[0], { target: { value: 'Updated option' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('allows marking multiple options as correct', () => {
      const onChange = jest.fn();
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={onChange} />);

      const checkboxes = screen.getAllByTitle('Mark as correct');
      fireEvent.click(checkboxes[1]); // Toggle HTML to correct

      expect(onChange).toHaveBeenCalled();
    });

    it('shows add option button and adds option', () => {
      const onChange = jest.fn();
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={onChange} />);

      const addButton = screen.getByRole('button', { name: /add option/i });
      fireEvent.click(addButton);

      expect(onChange).toHaveBeenCalled();
    });

    it('shows remove option button and removes option', () => {
      const onChange = jest.fn();
      render(<MultipleSelectEditor componentId="ms-1" data={mockData} onChange={onChange} />);

      const removeButtons = screen.getAllByTitle('Remove option');
      fireEvent.click(removeButtons[0]);

      expect(onChange).toHaveBeenCalled();
    });
  });
});
