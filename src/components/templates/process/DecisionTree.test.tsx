import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionTreePreview, DecisionTreeEditor } from './DecisionTree';

describe('DecisionTreePreview', () => {
  it('renders root question and options', () => {
    const data = {
      title: 'Support Decision Tree',
      rootNode: {
        id: 'root',
        question: 'Is issue urgent?',
        options: [
          { id: 'opt-1', label: 'Yes', outcome: 'Escalate immediately' },
          { id: 'opt-2', label: 'No', outcome: 'Create standard ticket' },
        ],
      },
    };
    render(
      <DecisionTreePreview
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
      />
    );

    expect(screen.getByText('Is issue urgent?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    const data = {
      title: 'Eligibility Tree',
      rootNode: { id: 'root', question: 'Eligible?', options: [] },
    };
    render(
      <DecisionTreePreview
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
      />
    );

    expect(screen.getByText('Eligibility Tree')).toBeInTheDocument();
  });

  it('displays empty state when root question missing', () => {
    const data = {
      title: 'Decision Tree',
      rootNode: { id: 'root', question: '', options: [] },
    };
    render(
      <DecisionTreePreview
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
      />
    );

    expect(screen.getByText('No decision tree configured.')).toBeInTheDocument();
  });

  it('renders outcome text for options', () => {
    const data = {
      title: 'Path Selection',
      rootNode: {
        id: 'root',
        question: 'Choose path',
        options: [{ id: 'opt-1', label: 'Path A', outcome: 'Go to Team A' }],
      },
    };
    render(
      <DecisionTreePreview
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
      />
    );

    expect(screen.getByText('Outcome: Go to Team A')).toBeInTheDocument();
  });

  it('renders branch cards for each option', () => {
    const data = {
      title: 'Decision Paths',
      rootNode: {
        id: 'root',
        question: 'Select option',
        options: [
          { id: 'opt-1', label: 'Option 1', outcome: 'Result 1' },
          { id: 'opt-2', label: 'Option 2', outcome: 'Result 2' },
          { id: 'opt-3', label: 'Option 3', outcome: 'Result 3' },
        ],
      },
    };
    const { container } = render(
      <DecisionTreePreview
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
      />
    );

    const branchItems = container.querySelectorAll('.tpl-decision-tree__branch-item');
    expect(branchItems).toHaveLength(3);
  });
});

describe('DecisionTreeEditor', () => {
  it('renders title and root question inputs', () => {
    const onChange = jest.fn();
    render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={{
          title: 'My Tree',
          rootNode: { id: 'root', question: 'Main question?', options: [] },
        }}
        onChange={onChange}
      />
    );

    expect(screen.getByDisplayValue('My Tree')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Main question?')).toBeInTheDocument();
  });

  it('renders option cards for each option', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Tree',
      rootNode: {
        id: 'root',
        question: 'Question?',
        options: [
          { id: 'opt-1', label: 'Yes', outcome: 'Proceed' },
          { id: 'opt-2', label: 'No', outcome: 'Stop' },
        ],
      },
    };
    const { container } = render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
        onChange={onChange}
      />
    );

    const optionCards = container.querySelectorAll(
      '.tpl-decision-tree-editor__option-card'
    );
    expect(optionCards).toHaveLength(2);
  });

  it('adds a new option when Add Option button clicked', () => {
    const onChange = jest.fn();
    render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={{
          title: 'Tree',
          rootNode: { id: 'root', question: 'Question?', options: [] },
        }}
        onChange={onChange}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Option/ });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.rootNode.options).toHaveLength(1);
  });

  it('removes an option when remove button clicked', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Tree',
      rootNode: {
        id: 'root',
        question: 'Question?',
        options: [
          { id: 'opt-1', label: 'Yes', outcome: 'Proceed' },
          { id: 'opt-2', label: 'No', outcome: 'Stop' },
        ],
      },
    };
    const { container } = render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
        onChange={onChange}
      />
    );

    const removeButtons = container.querySelectorAll(
      '.tpl-decision-tree-editor__remove-btn'
    );
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.rootNode.options).toHaveLength(1);
  });

  it('updates option label when changed', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Tree',
      rootNode: {
        id: 'root',
        question: 'Question?',
        options: [{ id: 'opt-1', label: 'Old Label', outcome: 'Result' }],
      },
    };
    render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
        onChange={onChange}
      />
    );

    const labelInput = screen.getByDisplayValue('Old Label');
    fireEvent.change(labelInput, { target: { value: 'New Label' } });

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.rootNode.options[0].label).toBe('New Label');
  });

  it('updates root question when changed', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Tree',
      rootNode: { id: 'root', question: 'Old Question?', options: [] },
    };
    render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
        onChange={onChange}
      />
    );

    const questionInput = screen.getByDisplayValue('Old Question?');
    fireEvent.change(questionInput, { target: { value: 'New Question?' } });

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.data.rootNode.question).toBe('New Question?');
  });

  it('disables all inputs when readOnly is true', () => {
    const onChange = jest.fn();
    const data = {
      title: 'Tree',
      rootNode: {
        id: 'root',
        question: 'Question?',
        options: [{ id: 'opt-1', label: 'Option', outcome: 'Result' }],
      },
    };
    const { container } = render(
      <DecisionTreeEditor
        componentId="cmp-dt"
        componentType="decision-tree"
        data={data}
        onChange={onChange}
        readOnly={true}
      />
    );

    const inputs = container.querySelectorAll(
      '.tpl-decision-tree-editor__input, .tpl-decision-tree-editor__textarea, .tpl-decision-tree-editor__remove-btn, .tpl-decision-tree-editor__add-btn'
    );
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
