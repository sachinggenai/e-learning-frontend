import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MatchingPreview, MatchingEditor } from './Matching';

describe('Matching', () => {
  const mockData = {
    title: 'Match Countries with Capitals',
    pairs: [
      { id: 'pair1', left: 'France', right: 'Paris' },
      { id: 'pair2', left: 'Germany', right: 'Berlin' },
      { id: 'pair3', left: 'Spain', right: 'Madrid' },
    ],
  };

  describe('MatchingPreview', () => {
    it('renders without errors', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);
      expect(screen.getByText('Match Countries with Capitals')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<MatchingPreview componentId="match-1" data={mockData} />);
      expect(container.querySelector('.matching-component')).toBeInTheDocument();
      expect(container.querySelector('.matching__columns')).toBeInTheDocument();
      expect(container.querySelector('.matching__left')).toBeInTheDocument();
      expect(container.querySelector('.matching__right')).toBeInTheDocument();
      expect(container.querySelectorAll('.matching__item')).toHaveLength(6); // 3 left + 3 right
    });

    it('renders left and right items', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);
      
      // Left items
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.getByText('Spain')).toBeInTheDocument();

      // Right items (shuffled, but all present)
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Berlin')).toBeInTheDocument();
      expect(screen.getByText('Madrid')).toBeInTheDocument();
    });

    it('allows user to select left item', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);
      
      const franceButton = screen.getByText('France').closest('button');
      fireEvent.click(franceButton!);

      expect(franceButton).toHaveClass('matching__item--selected');
    });

    it('allows user to match left item with right item', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);
      
      // Select left item
      const franceButton = screen.getByText('France').closest('button');
      fireEvent.click(franceButton!);

      // Select right item
      const parisButton = screen.getByText('Paris').closest('button');
      fireEvent.click(parisButton!);

      // Paris should now be marked as matched
      expect(parisButton).toHaveClass('matching__item--matched');
    });

    it('submit button disabled until all pairs matched', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();

      // Match first pair
      fireEvent.click(screen.getByText('France').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      expect(submitButton).toBeDisabled(); // Still disabled

      // Match second pair
      fireEvent.click(screen.getByText('Germany').closest('button')!);
      fireEvent.click(screen.getByText('Berlin').closest('button')!);
      expect(submitButton).toBeDisabled(); // Still disabled

      // Match third pair
      fireEvent.click(screen.getByText('Spain').closest('button')!);
      fireEvent.click(screen.getByText('Madrid').closest('button')!);
      expect(submitButton).toBeEnabled(); // Now enabled
    });

    it('calls onInteraction with correct payload on submit (all correct)', () => {
      const onInteraction = jest.fn();
      const onComplete = jest.fn();

      render(
        <MatchingPreview
          componentId="match-1"
          data={mockData}
          onInteraction={onInteraction}
          onComplete={onComplete}
        />
      );

      // Match all pairs correctly
      fireEvent.click(screen.getByText('France').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      
      fireEvent.click(screen.getByText('Germany').closest('button')!);
      fireEvent.click(screen.getByText('Berlin').closest('button')!);
      
      fireEvent.click(screen.getByText('Spain').closest('button')!);
      fireEvent.click(screen.getByText('Madrid').closest('button')!);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          componentId: 'match-1',
          interactionType: 'submit',
          value: { pair1: 'pair1', pair2: 'pair2', pair3: 'pair3' },
          score: 3,
          maxScore: 3,
          isCorrect: true,
          completed: true,
        })
      );
      expect(onComplete).toHaveBeenCalledWith('match-1');
    });

    it('calculates partial score for incorrect matches', () => {
      const onInteraction = jest.fn();

      render(
        <MatchingPreview
          componentId="match-1"
          data={mockData}
          onInteraction={onInteraction}
        />
      );

      // Match pairs incorrectly
      fireEvent.click(screen.getByText('France').closest('button')!);
      fireEvent.click(screen.getByText('Berlin').closest('button')!); // Wrong
      
      fireEvent.click(screen.getByText('Germany').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!); // Wrong
      
      fireEvent.click(screen.getByText('Spain').closest('button')!);
      fireEvent.click(screen.getByText('Madrid').closest('button')!); // Correct

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 1,
          maxScore: 3,
          isCorrect: false,
        })
      );
    });

    it('shows correct/incorrect visual feedback after submit', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);

      // Match one correctly, others incorrectly
      fireEvent.click(screen.getByText('France').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      
      fireEvent.click(screen.getByText('Germany').closest('button')!);
      fireEvent.click(screen.getByText('Madrid').closest('button')!);
      
      fireEvent.click(screen.getByText('Spain').closest('button')!);
      fireEvent.click(screen.getByText('Berlin').closest('button')!);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Check for correct/incorrect classes
      const leftButtons = [
        screen.getByText('France').closest('button'),
        screen.getByText('Germany').closest('button'),
        screen.getByText('Spain').closest('button'),
      ];

      expect(leftButtons[0]).toHaveClass('matching__item--correct');
      expect(leftButtons[1]).toHaveClass('matching__item--incorrect');
      expect(leftButtons[2]).toHaveClass('matching__item--incorrect');
    });

    it('hides submit button after submission', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);

      // Match all pairs
      fireEvent.click(screen.getByText('France').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      
      fireEvent.click(screen.getByText('Germany').closest('button')!);
      fireEvent.click(screen.getByText('Berlin').closest('button')!);
      
      fireEvent.click(screen.getByText('Spain').closest('button')!);
      fireEvent.click(screen.getByText('Madrid').closest('button')!);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(submitButton).not.toBeInTheDocument();
    });

    it('disables items after submit', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);

      // Match all pairs
      fireEvent.click(screen.getByText('France').closest('button')!);
      fireEvent.click(screen.getByText('Paris').closest('button')!);
      
      fireEvent.click(screen.getByText('Germany').closest('button')!);
      fireEvent.click(screen.getByText('Berlin').closest('button')!);
      
      fireEvent.click(screen.getByText('Spain').closest('button')!);
      fireEvent.click(screen.getByText('Madrid').closest('button')!);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      const allButtons = screen.getAllByRole('button');
      allButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('allows changing selection before matching', () => {
      render(<MatchingPreview componentId="match-1" data={mockData} />);
      
      const franceButton = screen.getByText('France').closest('button')!;
      const germanyButton = screen.getByText('Germany').closest('button')!;

      // Select France
      fireEvent.click(franceButton);
      expect(franceButton).toHaveClass('matching__item--selected');

      // Change to Germany
      fireEvent.click(germanyButton);
      expect(germanyButton).toHaveClass('matching__item--selected');
      expect(franceButton).not.toHaveClass('matching__item--selected');
    });
  });

  describe('MatchingEditor', () => {
    it('renders without errors', () => {
      render(<MatchingEditor data={mockData} onChange={jest.fn()} />);
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    it('applies BEM classes correctly', () => {
      const { container } = render(<MatchingEditor data={mockData} onChange={jest.fn()} />);
      expect(container.querySelector('.matching-editor')).toBeInTheDocument();
      expect(container.querySelectorAll('.matching-editor__pair-row')).toHaveLength(3);
    });

    it('calls onChange when title is updated', () => {
      const onChange = jest.fn();
      render(<MatchingEditor data={mockData} onChange={onChange} />);

      const titleInput = screen.getByDisplayValue('Match Countries with Capitals');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when left item is updated', () => {
      const onChange = jest.fn();
      render(<MatchingEditor data={mockData} onChange={onChange} />);

      const leftInputs = screen.getAllByPlaceholderText('Left item...');
      fireEvent.change(leftInputs[0], { target: { value: 'Updated Left' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when right item is updated', () => {
      const onChange = jest.fn();
      render(<MatchingEditor data={mockData} onChange={onChange} />);

      const rightInputs = screen.getAllByPlaceholderText('Right item...');
      fireEvent.change(rightInputs[0], { target: { value: 'Updated Right' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('shows add pair button and adds pair', () => {
      const onChange = jest.fn();
      render(<MatchingEditor data={mockData} onChange={onChange} />);

      const addButton = screen.getByRole('button', { name: /add pair/i });
      fireEvent.click(addButton);

      expect(onChange).toHaveBeenCalled();
    });

    it('shows remove pair button for pairs beyond minimum', () => {
      const onChange = jest.fn();
      render(<MatchingEditor data={mockData} onChange={onChange} />);

      const removeButtons = screen.getAllByRole('button', { name: '×' });
      expect(removeButtons.length).toBeGreaterThan(0);

      fireEvent.click(removeButtons[0]);
      expect(onChange).toHaveBeenCalled();
    });

    it('respects readOnly prop', () => {
      render(<MatchingEditor data={mockData} onChange={jest.fn()} readOnly />);

      const titleInput = screen.getByDisplayValue('Match Countries with Capitals');
      expect(titleInput).toBeDisabled();

      const addButton = screen.queryByRole('button', { name: /add pair/i });
      expect(addButton).not.toBeInTheDocument();
    });

    it('displays arrow between left and right inputs', () => {
      const { container } = render(<MatchingEditor data={mockData} onChange={jest.fn()} />);
      const arrows = container.querySelectorAll('.matching-editor__arrow');
      expect(arrows).toHaveLength(3);
    });
  });
});
