/**
 * AnimatedExplainer Component Tests
 * Category: media-rich
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnimatedExplainerPreview, AnimatedExplainerEditor } from './AnimatedExplainer';

describe('AnimatedExplainerPreview', () => {
  const mockOnInteraction = jest.fn();
  const mockOnComplete = jest.fn();

  const defaultData = {
    title: 'Test Explainer',
    steps: [
      {
        id: 'step1',
        title: 'Step 1 Title',
        description: 'Step 1 description text',
        icon: '🎯',
      },
      {
        id: 'step2',
        title: 'Step 2 Title',
        description: 'Step 2 description text',
        icon: '🚀',
      },
      {
        id: 'step3',
        title: 'Step 3 Title',
        description: 'Step 3 description text',
        icon: '✨',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByRole('region', { name: /animated explainer/i })).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByText('Test Explainer')).toBeInTheDocument();
  });

  test('renders all steps', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getAllByText('Step 1 Title').length).toBeGreaterThan(0);
    expect(screen.getByText('Step 2 Title')).toBeInTheDocument();
    expect(screen.getByText('Step 3 Title')).toBeInTheDocument();
  });

  test('renders step descriptions', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByText('Step 1 description text')).toBeInTheDocument();
    expect(screen.getByText('Step 2 description text')).toBeInTheDocument();
  });

  test('renders step icons', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    // The current step icon is shown in the media area
    const mediaIcon = container.querySelector('.tpl-animated-explainer__media-icon');
    expect(mediaIcon).toBeInTheDocument();
    expect(mediaIcon).toHaveTextContent('🎯'); // First step icon
  });

  test('renders navigation controls', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByLabelText('Previous step')).toBeInTheDocument();
    expect(screen.getByLabelText('Next step')).toBeInTheDocument();
  });

  test('renders placeholder when no steps provided', () => {
    const emptyData = { title: 'Test', steps: [] };
    render(<AnimatedExplainerPreview data={emptyData} />);
    expect(screen.getByText('No steps configured')).toBeInTheDocument();
  });

  test('first step is active by default', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    const activeStep = container.querySelector('.tpl-animated-explainer__step--active');
    expect(activeStep).toBeInTheDocument();
    expect(activeStep).toHaveTextContent('Step 1 Title');
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    expect(container.querySelector('.tpl-animated-explainer')).toBeInTheDocument();
  });

  test('applies correct BEM classes for media area', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    expect(container.querySelector('.tpl-animated-explainer__media')).toBeInTheDocument();
    expect(container.querySelector('.tpl-animated-explainer__media-icon')).toBeInTheDocument();
    expect(container.querySelector('.tpl-animated-explainer__media-text')).toBeInTheDocument();
  });

  test('applies correct BEM classes for steps', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    expect(container.querySelector('.tpl-animated-explainer__steps')).toBeInTheDocument();
    expect(container.querySelectorAll('.tpl-animated-explainer__step').length).toBe(3);
    expect(container.querySelector('.tpl-animated-explainer__step-number')).toBeInTheDocument();
    expect(container.querySelector('.tpl-animated-explainer__step-title')).toBeInTheDocument();
  });

  test('applies correct BEM classes for controls', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    expect(container.querySelector('.tpl-animated-explainer__controls')).toBeInTheDocument();
    expect(container.querySelectorAll('.tpl-animated-explainer__control-btn').length).toBe(2);
  });

  test('applies active modifier class to current step', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    const activeStep = container.querySelector('.tpl-animated-explainer__step--active');
    expect(activeStep).toBeInTheDocument();
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('has proper ARIA role for main container', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  test('steps container has list role', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('each step has listitem role', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    const listitems = screen.getAllByRole('listitem');
    expect(listitems.length).toBe(3);
  });

  test('steps have proper ARIA labels', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByLabelText('Step 1: Step 1 Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Step 2: Step 2 Title')).toBeInTheDocument();
  });

  test('steps are keyboard accessible (tabIndex)', () => {
    const { container } = render(<AnimatedExplainerPreview data={defaultData} />);
    const steps = container.querySelectorAll('.tpl-animated-explainer__step');
    steps.forEach((step) => {
      expect(step).toHaveAttribute('tabIndex', '0');
    });
  });

  test('active step has aria-current attribute', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    const firstStep = screen.getByLabelText('Step 1: Step 1 Title');
    expect(firstStep).toHaveAttribute('aria-current', 'step');
  });

  test('controls have navigation role', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    expect(screen.getByRole('navigation', { name: /step navigation/i })).toBeInTheDocument();
  });

  test('buttons have proper type attribute', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    const prevButton = screen.getByLabelText('Previous step');
    const nextButton = screen.getByLabelText('Next step');
    expect(prevButton).toHaveAttribute('type', 'button');
    expect(nextButton).toHaveAttribute('type', 'button');
  });

  // ─── Interaction Tests ───────────────────────────────────────

  test('clicking step navigates to that step', () => {
    render(<AnimatedExplainerPreview data={defaultData} onInteraction={mockOnInteraction} />);
    const step2 = screen.getByLabelText('Step 2: Step 2 Title');

    fireEvent.click(step2);

    expect(mockOnInteraction).toHaveBeenCalledWith({
      interactionType: 'step-viewed',
      componentId: '',
      interactionId: 'step-1',
      value: 1,
    });
  });

  test('next button navigates to next step', () => {
    render(<AnimatedExplainerPreview data={defaultData} onInteraction={mockOnInteraction} />);
    const nextButton = screen.getByLabelText('Next step');

    fireEvent.click(nextButton);

    expect(mockOnInteraction).toHaveBeenCalled();
  });

  test('previous button navigates to previous step', () => {
    render(<AnimatedExplainerPreview data={defaultData} onInteraction={mockOnInteraction} />);
    const nextButton = screen.getByLabelText('Next step');
    const prevButton = screen.getByLabelText('Previous step');

    fireEvent.click(nextButton);
    fireEvent.click(prevButton);

    expect(mockOnInteraction).toHaveBeenCalledTimes(2);
  });

  test('previous button is disabled on first step', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    const prevButton = screen.getByLabelText('Previous step');
    expect(prevButton).toBeDisabled();
  });

  test('next button is disabled on last step', () => {
    render(<AnimatedExplainerPreview data={defaultData} />);
    const nextButton = screen.getByLabelText('Next step');

    // Navigate to last step
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
  });

  test('keyboard Enter activates step', () => {
    render(<AnimatedExplainerPreview data={defaultData} onInteraction={mockOnInteraction} />);
    const step2 = screen.getByLabelText('Step 2: Step 2 Title');

    fireEvent.keyDown(step2, { key: 'Enter' });

    expect(mockOnInteraction).toHaveBeenCalled();
  });

  test('keyboard Space activates step', () => {
    render(<AnimatedExplainerPreview data={defaultData} onInteraction={mockOnInteraction} />);
    const step2 = screen.getByLabelText('Step 2: Step 2 Title');

    fireEvent.keyDown(step2, { key: ' ' });

    expect(mockOnInteraction).toHaveBeenCalled();
  });

  test('calls onComplete when all steps viewed', () => {
    render(
      <AnimatedExplainerPreview
        data={defaultData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    // Click all steps
    fireEvent.click(screen.getByLabelText('Step 1: Step 1 Title'));
    fireEvent.click(screen.getByLabelText('Step 2: Step 2 Title'));
    fireEvent.click(screen.getByLabelText('Step 3: Step 3 Title'));

    expect(mockOnComplete).toHaveBeenCalledWith('');
  });
});

describe('AnimatedExplainerEditor', () => {
  const mockOnChange = jest.fn();

  const defaultData = {
    title: 'Test Explainer',
    steps: [
      {
        id: 'step1',
        title: 'Step 1',
        description: 'Description 1',
        icon: '🎯',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  test('renders title input', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('Test Explainer');
  });

  test('renders step cards', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  test('renders add step button', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Add new step')).toBeInTheDocument();
  });

  test('renders step fields', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Icon (emoji)')).toBeInTheDocument();
    expect(screen.getByLabelText('Step Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-animated-explainer-editor')).toBeInTheDocument();
  });

  test('applies correct BEM classes for fields', () => {
    const { container } = render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelectorAll('.tpl-animated-explainer-editor__field').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-animated-explainer-editor__label').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-animated-explainer-editor__input').length).toBeGreaterThan(0);
  });

  test('applies correct BEM classes for step cards', () => {
    const { container } = render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-animated-explainer-editor__step-card')).toBeInTheDocument();
    expect(container.querySelector('.tpl-animated-explainer-editor__remove-btn')).toBeInTheDocument();
  });

  // ─── Interaction Tests ───────────────────────────────────────

  test('calls onChange when title is updated', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        title: 'New Title',
      },
    });
  });

  test('calls onChange when step title is updated', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const stepTitleInput = screen.getByLabelText('Step Title');

    fireEvent.change(stepTitleInput, { target: { value: 'New Step Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        steps: [
          {
            ...defaultData.steps[0],
            title: 'New Step Title',
          },
        ],
      },
    });
  });

  test('calls onChange when step description is updated', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const descInput = screen.getByLabelText('Description');

    fireEvent.change(descInput, { target: { value: 'New description' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        steps: [
          {
            ...defaultData.steps[0],
            description: 'New description',
          },
        ],
      },
    });
  });

  test('adds new step when add button is clicked', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const addButton = screen.getByLabelText('Add new step');

    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
    const calledData = mockOnChange.mock.calls[0][0].data;
    expect(calledData.steps.length).toBe(2);
  });

  test('removes step when remove button is clicked', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const removeButton = screen.getByLabelText('Remove step 1');

    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        steps: [],
      },
    });
  });

  test('handles empty data gracefully', () => {
    render(<AnimatedExplainerEditor data={{}} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('');
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('all inputs have proper labels with htmlFor', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toHaveAttribute('id', 'explainer-title');
  });

  test('all inputs have aria-label attributes', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-label', 'Title');
  });

  test('buttons have proper aria-labels', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Add new step')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove step 1')).toBeInTheDocument();
  });

  test('buttons have proper type attribute', () => {
    render(<AnimatedExplainerEditor data={defaultData} onChange={mockOnChange} />);
    const addButton = screen.getByLabelText('Add new step');
    const removeButton = screen.getByLabelText('Remove step 1');
    expect(addButton).toHaveAttribute('type', 'button');
    expect(removeButton).toHaveAttribute('type', 'button');
  });
});
