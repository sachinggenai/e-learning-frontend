import { render, screen, fireEvent } from '@testing-library/react';
import { CycleDiagramPreview, CycleDiagramEditor } from './CycleDiagram';

describe('CycleDiagramPreview', () => {
  it('renders stages in circular layout', () => {
    const data = {
      title: 'Process Cycle',
      stages: [
        { id: 's1', label: 'Planning', description: 'Plan the work' },
        { id: 's2', label: 'Execution', description: 'Execute the plan' },
        { id: 's3', label: 'Review', description: 'Review results' },
      ],
    };
    const { container } = render(
      <CycleDiagramPreview
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
      />
    );

    // Check SVG circles are rendered (stage nodes)
    const circles = container.querySelectorAll('.tpl-cycle-diagram__node');
    expect(circles).toHaveLength(3);

    // Check stage descriptions rendered below diagram
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Execution')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    const data = {
      title: 'Product Lifecycle',
      stages: [{ id: 's1', label: 'Stage 1', description: 'First stage' }],
    };
    render(
      <CycleDiagramPreview
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
      />
    );

    expect(screen.getByText('Product Lifecycle')).toBeInTheDocument();
  });

  it('displays empty state when no stages', () => {
    const data = { title: 'Process Cycle', stages: [] };
    render(
      <CycleDiagramPreview
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
      />
    );

    expect(screen.getByText('No stages configured.')).toBeInTheDocument();
  });

  it('renders stage descriptions for each stage', () => {
    const data = {
      title: 'Process Cycle',
      stages: [
        { id: 's1', label: 'Plan', description: 'Planning phase' },
        { id: 's2', label: 'Execute', description: 'Execution phase' },
      ],
    };
    render(
      <CycleDiagramPreview
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
      />
    );

    expect(screen.getByText('Planning phase')).toBeInTheDocument();
    expect(screen.getByText('Execution phase')).toBeInTheDocument();
  });

  it('renders SVG with connecting lines between stages', () => {
    const data = {
      title: 'Process Cycle',
      stages: [
        { id: 's1', label: 'Stage 1' },
        { id: 's2', label: 'Stage 2' },
        { id: 's3', label: 'Stage 3' },
      ],
    };
    const { container } = render(
      <CycleDiagramPreview
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
      />
    );

    // Check lines are rendered
    const lines = container.querySelectorAll('.tpl-cycle-diagram__line');
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe('CycleDiagramEditor', () => {
  it('renders title input field', () => {
    const onChange = jest.fn();
    render(
      <CycleDiagramEditor
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={{ title: 'My Cycle', stages: [] }}
        onChange={onChange}
      />
    );

    const titleInput = screen.getByDisplayValue('My Cycle');
    expect(titleInput).toBeInTheDocument();
  });

  it('renders stage cards for each stage', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process Cycle',
      stages: [
        { id: 's1', label: 'Stage 1', description: 'First' },
        { id: 's2', label: 'Stage 2', description: 'Second' },
      ],
    };
    const { container } = render(
      <CycleDiagramEditor
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
        onChange={onChange}
      />
    );

    const stageCards = container.querySelectorAll(
      '.tpl-cycle-diagram-editor__stage-card'
    );
    expect(stageCards).toHaveLength(2);
  });

  it('adds a new stage when Add Stage button clicked', () => {
    const onChange = jest.fn();
    render(
      <CycleDiagramEditor
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={{ title: 'Cycle', stages: [] }}
        onChange={onChange}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Stage/ });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.stages).toHaveLength(1);
  });

  it('removes a stage when remove button clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Cycle',
      stages: [
        { id: 's1', label: 'Stage 1' },
        { id: 's2', label: 'Stage 2' },
      ],
    };
    const { container } = render(
      <CycleDiagramEditor
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
        onChange={onChange}
      />
    );

    const removeButtons = container.querySelectorAll(
      '.tpl-cycle-diagram-editor__remove-btn'
    );
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.stages).toHaveLength(1);
    expect(callArgs.data.stages[0].id).toBe('s2');
  });

  it('disables add button when maximum stages reached', () => {
    const onChange = jest.fn();
    const stages = Array.from({ length: 8 }, (_, i) => ({
      id: `s${i}`,
      label: `Stage ${i}`,
    }));
    render(
      <CycleDiagramEditor
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={{ title: 'Cycle', stages }}
        onChange={onChange}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Stage/ });
    expect(addBtn).toBeDisabled();
  });

  it('disables all inputs when readOnly is true', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Cycle',
      stages: [{ id: 's1', label: 'Stage 1', description: 'First' }],
    };
    const { container } = render(
      <CycleDiagramEditor
        componentId="cmp-cd"
        componentType="cycle-diagram"
        data={data}
        onChange={onChange}
        readOnly={true}
      />
    );

    const inputs = container.querySelectorAll(
      '.tpl-cycle-diagram-editor__input, .tpl-cycle-diagram-editor__textarea, .tpl-cycle-diagram-editor__remove-btn, .tpl-cycle-diagram-editor__add-btn'
    );
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
