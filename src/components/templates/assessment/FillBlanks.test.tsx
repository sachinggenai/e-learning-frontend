import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FillBlanksPreview, FillBlanksEditor } from './FillBlanks';

describe('FillBlanks (Fill in the Blanks)', () => {
  const mockData = {
    title: 'Complete the Sentence',
    templateText: 'The capital of France is {{capital}} and the currency is {{currency}}.',
    blanks: [
      { id: 'capital', correctAnswer: 'Paris', alternatives: ['paris'] },
      { id: 'currency', correctAnswer: 'Euro', alternatives: ['euro', 'EUR'] },
    ],
  };

  describe('FillBlanksPreview', () => {
    it('renders without errors', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);
      expect(screen.getByText('Complete the Sentence')).toBeInTheDocument();
      expect(screen.getByText(/The capital of France is/i)).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<FillBlanksPreview componentId="fb-1" data={mockData} />);
      expect(container.querySelector('.fill-blanks-component')).toBeInTheDocument();
      expect(container.querySelector('.fill-blanks__title')).toBeInTheDocument();
      expect(container.querySelector('.fill-blanks__content')).toBeInTheDocument();
      expect(container.querySelectorAll('.fill-blank__input')).toHaveLength(2);
    });

    it('renders input fields for each blank', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);
      const inputs = screen.getAllByPlaceholderText('...');
      expect(inputs).toHaveLength(2);
    });

    it('allows user to type in blank inputs', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);
      const inputs = screen.getAllByPlaceholderText('...');
      
      fireEvent.change(inputs[0], { target: { value: 'Paris' } });
      expect(inputs[0]).toHaveValue('Paris');

      fireEvent.change(inputs[1], { target: { value: 'Euro' } });
      expect(inputs[1]).toHaveValue('Euro');
    });

    it('calls onInteraction with correct payload on submit (all correct)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <FillBlanksPreview
          componentId="fb-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'Paris' } });
      fireEvent.change(inputs[1], { target: { value: 'Euro' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'fb-1',
          interactionType: 'submit',
          value: { capital: 'Paris', currency: 'Euro' },
          score: 2,
          maxScore: 2,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('fb-1');
    });

    it('accepts alternative answers (case-insensitive)', () => {
      const onInteraction = jest.fn();

      render(
        <FillBlanksPreview
          componentId="fb-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'paris' } }); // lowercase alternative
      fireEvent.change(inputs[1], { target: { value: 'euro' } }); // lowercase alternative

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 2,
          maxScore: 2,
          isCorrect: true,
        })
      );
    });

    it('calculates partial score correctly', () => {
      const onInteraction = jest.fn();

      render(
        <FillBlanksPreview
          componentId="fb-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'Paris' } }); // correct
      fireEvent.change(inputs[1], { target: { value: 'Dollar' } }); // incorrect

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 1,
          maxScore: 2,
          isCorrect: false,
        })
      );
    });

    it('shows correct/incorrect visual feedback after submit', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'Paris' } }); // correct
      fireEvent.change(inputs[1], { target: { value: 'Dollar' } }); // incorrect

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(inputs[0]).toHaveClass('fill-blank__input--correct');
      expect(inputs[1]).toHaveClass('fill-blank__input--incorrect');
    });

    it('displays correct answer for incorrect blanks', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'Paris' } });
      fireEvent.change(inputs[1], { target: { value: 'Wrong' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Should show the correct answer for the incorrect blank
      expect(screen.getByText('Euro')).toHaveClass('fill-blank__correct-answer');
    });

    it('hides submit button after submission', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'Paris' } });
      fireEvent.change(inputs[1], { target: { value: 'Euro' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(submitButton).not.toBeInTheDocument();
    });

    it('disables inputs after submit', () => {
      render(<FillBlanksPreview componentId="fb-1" data={mockData} />);

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: 'Paris' } });
      fireEvent.change(inputs[1], { target: { value: 'Euro' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      inputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });

    it('trims whitespace from answers', () => {
      const onInteraction = jest.fn();

      render(
        <FillBlanksPreview
          componentId="fb-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      const inputs = screen.getAllByPlaceholderText('...');
      fireEvent.change(inputs[0], { target: { value: '  Paris  ' } });
      fireEvent.change(inputs[1], { target: { value: '  Euro  ' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 2,
          isCorrect: true,
        })
      );
    });
  });

  describe('FillBlanksEditor', () => {
    it('renders without errors', () => {
      render(<FillBlanksEditor data={mockData} onChange={jest.fn()} />);
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Template Text')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<FillBlanksEditor data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.fill-blanks-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.fill-blanks-editor__blank-row')).toHaveLength(2);
    });

    it('calls onChange when title is updated', () => {
      const onChange = jest.fn();
      render(<FillBlanksEditor data={mockData} onChange={onChange} />);

      const titleInput = screen.getByDisplayValue('Complete the Sentence');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when template text is updated', () => {
      const onChange = jest.fn();
      render(<FillBlanksEditor data={mockData} onChange={onChange} />);

      const templateInput = screen.getByDisplayValue(/The capital of France is/);
      fireEvent.change(templateInput, { target: { value: 'Updated template {{blank1}}' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('displays blank IDs correctly', () => {
      render(<FillBlanksEditor data={mockData} onChange={jest.fn()} />);
      expect(screen.getByText('{{capital}}')).toBeInTheDocument();
      expect(screen.getByText('{{currency}}')).toBeInTheDocument();
    });

    it('calls onChange when blank answer is updated', () => {
      const onChange = jest.fn();
      render(<FillBlanksEditor data={mockData} onChange={onChange} />);

      const answerInputs = screen.getAllByPlaceholderText('Correct answer...');
      fireEvent.change(answerInputs[0], { target: { value: 'Updated Answer' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('shows add blank button and adds blank', () => {
      const onChange = jest.fn();
      render(<FillBlanksEditor data={mockData} onChange={onChange} />);

      const addButton = screen.getByRole('button', { name: /add blank/i });
      fireEvent.click(addButton);

      expect(onChange).toHaveBeenCalled();
    });

    it('respects readOnly prop', () => {
      render(<FillBlanksEditor data={mockData} onChange={jest.fn()} readOnly />);

      const titleInput = screen.getByDisplayValue('Complete the Sentence');
      expect(titleInput).toBeDisabled();

      const addButton = screen.queryByRole('button', { name: /add blank/i });
      expect(addButton).not.toBeInTheDocument();
    });
  });
});
