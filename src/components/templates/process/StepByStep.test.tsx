import { render, screen, fireEvent } from '@testing-library/react';
import { StepByStepPreview, StepByStepEditor } from './StepByStep';

describe('StepByStepPreview', () => {
  it('renders all steps as progress indicators', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
        { id: 's3', title: 'Deploy', description: 'Deploy application' },
      ],
    };
    const { container } = render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    // Verify step indicators (buttons) are rendered
    const buttons = container.querySelectorAll('.tpl-step-by-step__step-button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('1');
    expect(buttons[1]).toHaveTextContent('2');
    expect(buttons[2]).toHaveTextContent('3');
  });

  it('displays first step content initially', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    expect(screen.getByText(/Step 1: Install/)).toBeInTheDocument();
    expect(screen.getByText('Install software')).toBeInTheDocument();
  });

  it('navigates to next step on Next button click', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    // Initial state
    expect(screen.getByText(/Step 1: Install/)).toBeInTheDocument();

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /Next/ });
    fireEvent.click(nextBtn);

    // Should now show step 2
    expect(screen.getByText(/Step 2: Configure/)).toBeInTheDocument();
    expect(screen.getByText('Configure settings')).toBeInTheDocument();
  });

  it('navigates to previous step on Previous button click', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    const { rerender } = render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    // Navigate to step 2
    const nextBtn = screen.getByRole('button', { name: /Next/ });
    fireEvent.click(nextBtn);

    // Now navigate back
    const prevBtn = screen.getByRole('button', { name: /Previous/ });
    fireEvent.click(prevBtn);

    // Should show step 1 again
    expect(screen.getByText(/Step 1: Install/)).toBeInTheDocument();
  });

  it('disables Previous button on first step', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    const prevBtn = screen.getByRole('button', { name: /Previous/ });
    expect(prevBtn).toBeDisabled();
  });

  it('disables Next button on last step', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    const onComplete = jest.fn();
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
        onComplete={onComplete}
      />
    );

    // Navigate to last step
    const nextBtn = screen.getByRole('button', { name: /Next/ });
    fireEvent.click(nextBtn);

    // Now Next button should show "Complete" and be disabled
    expect(screen.getByRole('button', { name: /Complete/ })).toBeDisabled();
  });

  it('calls onComplete when last step is visited', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    const onComplete = jest.fn();
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
        onComplete={onComplete}
      />
    );

    // Navigate through all steps
    const nextBtn = screen.getByRole('button', { name: /Next/ });
    fireEvent.click(nextBtn); // Go to step 2

    // onComplete should be called
    expect(onComplete).toHaveBeenCalledWith('cmp-sbs');
  });

  it('renders optional image in step content', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        {
          id: 's1',
          title: 'Install',
          description: 'Install software',
          imageUrl: 'https://example.com/install.png',
        },
      ],
    };
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    const img = screen.getByAltText('Install');
    expect(img).toHaveAttribute('src', 'https://example.com/install.png');
    expect(img).toHaveClass('tpl-step-by-step__image');
  });

  it('shows empty state when no steps configured', () => {
    const data = { title: 'Setup Guide', steps: [] };
    render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    expect(screen.getByText('No steps configured.')).toBeInTheDocument();
  });

  it('allows clicking step indicators to navigate directly', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
        { id: 's3', title: 'Deploy', description: 'Deploy application' },
      ],
    };
    const { container } = render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    // Click on step 3 indicator
    const buttons = container.querySelectorAll('.tpl-step-by-step__step-button');
    fireEvent.click(buttons[2]);

    // Should show step 3
    expect(screen.getByText(/Step 3: Deploy/)).toBeInTheDocument();
  });

  it('tracks visited steps with styling', () => {
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
        { id: 's3', title: 'Deploy', description: 'Deploy application' },
      ],
    };
    const { container } = render(
      <StepByStepPreview
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
      />
    );

    const buttons = container.querySelectorAll('.tpl-step-by-step__step-button');

    // Navigate to step 2
    fireEvent.click(buttons[1]);

    // Step 1 and 2 should be visited
    expect(buttons[0]).toHaveClass('tpl-step-by-step__step-button--visited');
    expect(buttons[1]).toHaveClass('tpl-step-by-step__step-button--active');
    expect(buttons[2]).toHaveClass('tpl-step-by-step__step-button--unvisited');
  });
});

describe('StepByStepEditor', () => {
  it('renders title input', () => {
    const onChange = jest.fn();
    render(
      <StepByStepEditor
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={{ title: 'My Guide', steps: [] }}
        onChange={onChange}
      />
    );

    const titleInput = screen.getByDisplayValue('My Guide');
    expect(titleInput).toBeInTheDocument();
  });

  it('renders step cards for each step', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Setup Guide',
      steps: [
        { id: 's1', title: 'Install', description: 'Install software' },
        { id: 's2', title: 'Configure', description: 'Configure settings' },
      ],
    };
    const { container } = render(
      <StepByStepEditor
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
        onChange={onChange}
      />
    );

    const stepCards = container.querySelectorAll('.tpl-step-by-step-editor__step-card');
    expect(stepCards).toHaveLength(2);
  });

  it('adds a new step when Add Step button is clicked', () => {
    const onChange = jest.fn();
    render(
      <StepByStepEditor
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={{ title: 'Setup', steps: [] }}
        onChange={onChange}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Step/ });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.steps).toHaveLength(1);
    expect(callArgs.data.steps[0].title).toBe('');
  });

  it('removes a step when remove button is clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Setup',
      steps: [
        { id: 's1', title: 'Install', description: 'Install' },
        { id: 's2', title: 'Configure', description: 'Configure' },
      ],
    };
    const { container } = render(
      <StepByStepEditor
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
        onChange={onChange}
      />
    );

    const removeButtons = container.querySelectorAll('.tpl-step-by-step-editor__remove-btn');
    fireEvent.click(removeButtons[0]); // Remove first step

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.steps).toHaveLength(1);
    expect(callArgs.data.steps[0].id).toBe('s2');
  });

  it('disables fields when readOnly is true', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Setup',
      steps: [{ id: 's1', title: 'Install', description: 'Install' }],
    };
    const { container } = render(
      <StepByStepEditor
        componentId="cmp-sbs"
        componentType="step-by-step"
        data={data}
        onChange={onChange}
        readOnly={true}
      />
    );

    const inputs = container.querySelectorAll(
      '.tpl-step-by-step-editor__input, .tpl-step-by-step-editor__textarea, .tpl-step-by-step-editor__remove-btn, .tpl-step-by-step-editor__add-btn'
    );
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
