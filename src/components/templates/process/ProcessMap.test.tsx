import { render, screen, fireEvent } from '@testing-library/react';
import { ProcessMapPreview, ProcessMapEditor } from './ProcessMap';

describe('ProcessMapPreview', () => {
  it('renders swimlanes with steps', () => {
    const data = {
      title: 'Hiring Process',
      lanes: [
        {
          id: 'lane-1',
          label: 'HR Manager',
          actor: 'HR',
          steps: [
            { id: 'step-1', label: 'Post Job' },
            { id: 'step-2', label: 'Review CVs' },
          ],
        },
        {
          id: 'lane-2',
          label: 'Hiring Manager',
          actor: 'Manager',
          steps: [
            { id: 'step-3', label: 'Shortlist' },
            { id: 'step-4', label: 'Interview' },
          ],
        },
      ],
      connections: [],
    };
    const { container } = render(
      <ProcessMapPreview
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
      />
    );

    // Check swimlanes are rendered
    const lanes = container.querySelectorAll('.tpl-process-map__lane');
    expect(lanes.length).toBeGreaterThanOrEqual(2);
  });

  it('renders title when provided', () => {
    const data = {
      title: 'Order Processing',
      lanes: [{ id: 'lane-1', label: 'Sales', actor: '', steps: [] }],
      connections: [],
    };
    render(
      <ProcessMapPreview
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
      />
    );

    expect(screen.getByText('Order Processing')).toBeInTheDocument();
  });

  it('displays empty state when no lanes', () => {
    const data = { title: 'Process Map', lanes: [], connections: [] };
    render(
      <ProcessMapPreview
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
      />
    );

    expect(screen.getByText('No process map configured.')).toBeInTheDocument();
  });

  it('renders lane summary with step counts', () => {
    const data = {
      title: 'Workflow',
      lanes: [
        {
          id: 'lane-1',
          label: 'Team A',
          actor: '',
          steps: [
            { id: 's1', label: 'Step 1' },
            { id: 's2', label: 'Step 2' },
          ],
        },
        {
          id: 'lane-2',
          label: 'Team B',
          actor: '',
          steps: [{ id: 's3', label: 'Step 3' }],
        },
      ],
      connections: [],
    };
    const { container } = render(
      <ProcessMapPreview
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
      />
    );

    const laneItems = container.querySelectorAll('.tpl-process-map__lane-item');
    expect(laneItems).toHaveLength(2);
  });

  it('renders step boxes in swimlane SVG', () => {
    const data = {
      title: 'Process',
      lanes: [
        {
          id: 'lane-1',
          label: 'Lane 1',
          actor: '',
          steps: [{ id: 'step-1', label: 'Action' }],
        },
      ],
      connections: [],
    };
    const { container } = render(
      <ProcessMapPreview
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
      />
    );

    const stepBoxes = container.querySelectorAll('.tpl-process-map__step-box');
    expect(stepBoxes.length).toBeGreaterThan(0);
  });
});

describe('ProcessMapEditor', () => {
  it('renders title input', () => {
    const onChange = jest.fn();
    render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={{ title: 'My Process', lanes: [], connections: [] }}
        onChange={onChange}
      />
    );

    const titleInput = screen.getByDisplayValue('My Process');
    expect(titleInput).toBeInTheDocument();
  });

  it('renders lane cards for each lane', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process',
      lanes: [
        {
          id: 'lane-1',
          label: 'Department A',
          actor: '',
          steps: [],
        },
        {
          id: 'lane-2',
          label: 'Department B',
          actor: '',
          steps: [],
        },
      ],
      connections: [],
    };
    const { container } = render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
        onChange={onChange}
      />
    );

    const laneCards = container.querySelectorAll(
      '.tpl-process-map-editor__lane-card'
    );
    expect(laneCards).toHaveLength(2);
  });

  it('adds a new lane when Add Lane button clicked', () => {
    const onChange = jest.fn();
    render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={{ title: 'Process', lanes: [], connections: [] }}
        onChange={onChange}
      />
    );

    const addLaneBtn = screen.getByRole('button', { name: /Add Lane/ });
    fireEvent.click(addLaneBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.lanes).toHaveLength(1);
  });

  it('removes a lane when remove button clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process',
      lanes: [
        { id: 'lane-1', label: 'Lane 1', actor: '', steps: [] },
        { id: 'lane-2', label: 'Lane 2', actor: '', steps: [] },
      ],
      connections: [],
    };
    const { container } = render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
        onChange={onChange}
      />
    );

    const removeButtons = container.querySelectorAll(
      '.tpl-process-map-editor__lane-card .tpl-process-map-editor__remove-btn'
    );
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.lanes).toHaveLength(1);
  });

  it('adds a step to lane when Add Step button clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process',
      lanes: [{ id: 'lane-1', label: 'Lane 1', actor: '', steps: [] }],
      connections: [],
    };
    render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
        onChange={onChange}
      />
    );

    const addStepBtn = screen.getByRole('button', { name: /Add Step/ });
    fireEvent.click(addStepBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.lanes[0].steps).toHaveLength(1);
  });

  it('removes a step from lane when step remove button clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process',
      lanes: [
        {
          id: 'lane-1',
          label: 'Lane 1',
          actor: '',
          steps: [
            { id: 'step-1', label: 'Step 1' },
            { id: 'step-2', label: 'Step 2' },
          ],
        },
      ],
      connections: [],
    };
    const { container } = render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
        onChange={onChange}
      />
    );

    const stepRemoveButtons = container.querySelectorAll(
      '.tpl-process-map-editor__step-card .tpl-process-map-editor__remove-btn'
    );
    fireEvent.click(stepRemoveButtons[0]);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.lanes[0].steps).toHaveLength(1);
  });

  it('updates lane name when input changed', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process',
      lanes: [{ id: 'lane-1', label: 'Old Name', actor: '', steps: [] }],
      connections: [],
    };
    render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
        onChange={onChange}
      />
    );

    const laneNameInput = screen.getByDisplayValue('Old Name');
    fireEvent.change(laneNameInput, { target: { value: 'New Name' } });

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.lanes[0].label).toBe('New Name');
  });

  it('disables all inputs when readOnly is true', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Process',
      lanes: [{ id: 'lane-1', label: 'Lane 1', actor: '', steps: [] }],
      connections: [],
    };
    const { container } = render(
      <ProcessMapEditor
        componentId="cmp-pm"
        componentType="process-map"
        data={data}
        onChange={onChange}
        readOnly={true}
      />
    );

    const inputs = container.querySelectorAll(
      '.tpl-process-map-editor__input, .tpl-process-map-editor__remove-btn, .tpl-process-map-editor__add-lane-btn, .tpl-process-map-editor__add-step-btn'
    );
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
