import { render, screen, fireEvent } from '@testing-library/react';
import { FlowchartPreview, FlowchartEditor } from './Flowchart';

describe('FlowchartPreview', () => {
  it('renders nodes with different shapes based on type', () => {
    const data = {
      title: 'Process Flow',
      nodes: [
        { id: 'n1', type: 'start' as const, label: 'Start' },
        { id: 'n2', type: 'process' as const, label: 'Process' },
        { id: 'n3', type: 'decision' as const, label: 'Decision' },
        { id: 'n4', type: 'end' as const, label: 'End' },
      ],
      connections: [],
    };
    const { container } = render(
      <FlowchartPreview
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
      />
    );

    // Check all node shapes are rendered
    const nodes = container.querySelectorAll('.tpl-flowchart__node');
    expect(nodes.length).toBeGreaterThanOrEqual(4);
  });

  it('renders title when provided', () => {
    const data = {
      title: 'Decision Process',
      nodes: [{ id: 'n1', type: 'start' as const, label: 'Start' }],
      connections: [],
    };
    render(
      <FlowchartPreview
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
      />
    );

    expect(screen.getByText('Decision Process')).toBeInTheDocument();
  });

  it('displays empty state when no nodes', () => {
    const data = { title: 'Process Flow', nodes: [], connections: [] };
    render(
      <FlowchartPreview
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
      />
    );

    expect(screen.getByText('No flowchart configured.')).toBeInTheDocument();
  });

  it('renders node legend with type labels', () => {
    const data = {
      title: 'Process Flow',
      nodes: [
        { id: 'n1', type: 'start' as const, label: 'Begin' },
        { id: 'n2', type: 'process' as const, label: 'Execute' },
      ],
      connections: [],
    };
    const { container } = render(
      <FlowchartPreview
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
      />
    );

    // Check legend section exists
    const nodesList = container.querySelector('.tpl-flowchart__nodes-list');
    expect(nodesList).toBeInTheDocument();
    
    // Check nodes are shown in legend
    const legendItems = container.querySelectorAll('.tpl-flowchart__node-item');
    expect(legendItems).toHaveLength(2);
  });

  it('renders SVG with connections between nodes', () => {
    const data = {
      title: 'Process Flow',
      nodes: [
        { id: 'n1', type: 'start' as const, label: 'Start' },
        { id: 'n2', type: 'process' as const, label: 'Process' },
      ],
      connections: [{ from: 'n1', to: 'n2' }],
    };
    const { container } = render(
      <FlowchartPreview
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
      />
    );

    // Check lines/connections are rendered
    const lines = container.querySelectorAll('.tpl-flowchart__line');
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe('FlowchartEditor', () => {
  it('renders title input', () => {
    const onChange = jest.fn();
    render(
      <FlowchartEditor
        componentId="cmp-fc"
        componentType="flowchart"
        data={{ title: 'My Flowchart', nodes: [], connections: [] }}
        onChange={onChange}
      />
    );

    const titleInput = screen.getByDisplayValue('My Flowchart');
    expect(titleInput).toBeInTheDocument();
  });

  it('renders node cards for each node', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Flow',
      nodes: [
        { id: 'n1', type: 'start' as const, label: 'Start' },
        { id: 'n2', type: 'process' as const, label: 'Process' },
      ],
      connections: [],
    };
    const { container } = render(
      <FlowchartEditor
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
        onChange={onChange}
      />
    );

    const nodeCards = container.querySelectorAll('.tpl-flowchart-editor__node-card');
    expect(nodeCards).toHaveLength(2);
  });

  it('adds a new node when Add Node button clicked', () => {
    const onChange = jest.fn();
    render(
      <FlowchartEditor
        componentId="cmp-fc"
        componentType="flowchart"
        data={{ title: 'Flow', nodes: [], connections: [] }}
        onChange={onChange}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Node/ });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.nodes).toHaveLength(1);
    expect(callArgs.data.nodes[0].type).toBe('process');
  });

  it('removes a node when remove button clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Flow',
      nodes: [
        { id: 'n1', type: 'start' as const, label: 'Start' },
        { id: 'n2', type: 'process' as const, label: 'Process' },
      ],
      connections: [{ from: 'n1', to: 'n2' }],
    };
    const { container } = render(
      <FlowchartEditor
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
        onChange={onChange}
      />
    );

    const removeButtons = container.querySelectorAll(
      '.tpl-flowchart-editor__remove-btn'
    );
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.nodes).toHaveLength(1);
    // Connections referencing removed node should be cleaned up
    expect(callArgs.data.connections).toHaveLength(0);
  });

  it('allows changing node type via dropdown', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Flow',
      nodes: [{ id: 'n1', type: 'start' as const, label: 'Start' }],
      connections: [],
    };
    const { container } = render(
      <FlowchartEditor
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
        onChange={onChange}
      />
    );

    const typeSelect = container.querySelector(
      '#fc-type-0'
    ) as HTMLSelectElement;
    expect(typeSelect).toBeInTheDocument();
    fireEvent.change(typeSelect, { target: { value: 'end' } });

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.nodes[0].type).toBe('end');
  });

  it('disables all inputs when readOnly is true', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Flow',
      nodes: [{ id: 'n1', type: 'process' as const, label: 'Process' }],
      connections: [],
    };
    const { container } = render(
      <FlowchartEditor
        componentId="cmp-fc"
        componentType="flowchart"
        data={data}
        onChange={onChange}
        readOnly={true}
      />
    );

    const inputs = container.querySelectorAll(
      '.tpl-flowchart-editor__input, .tpl-flowchart-editor__remove-btn, .tpl-flowchart-editor__add-btn'
    );
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
