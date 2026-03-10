import { fireEvent, render, screen } from '@testing-library/react';
import { ModuleOverviewEditor, ModuleOverviewPreview } from './ModuleOverview';

const moduleData = {
  title: 'Module Overview',
  description: 'Core concepts in this module',
  estimatedDuration: 30,
  difficultyLevel: 'beginner' as const,
  objectives: [
    { id: 'obj-1', text: 'Understand basics' },
    { id: 'obj-2', text: 'Apply concepts' },
  ],
  prerequisites: [{ id: 'pre-1', text: 'Basic understanding', completed: true }],
  topics: [{ id: 'topic-1', title: 'Introduction', description: 'Start here' }],
  showStartButton: true,
};

describe('ModuleOverviewPreview', () => {
  it('renders main sections and metadata', () => {
    render(<ModuleOverviewPreview componentType="module-overview" data={moduleData} />);

    expect(screen.getByText('Module Overview')).toBeInTheDocument();
    expect(screen.getByText('Core concepts in this module')).toBeInTheDocument();
    expect(screen.getByText(/30 min/)).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('Understand basics')).toBeInTheDocument();
  });

  it('supports legacy objective string arrays', () => {
    render(
      <ModuleOverviewPreview
        componentType="module-overview"
        data={{ title: 'Module', objectives: ['Legacy objective'] }}
      />
    );

    expect(screen.getByText('Legacy objective')).toBeInTheDocument();
  });

  it('emits interaction on start button click', () => {
    const onInteraction = jest.fn();

    render(
      <ModuleOverviewPreview
        componentId="cmp-module-overview"
        componentType="module-overview"
        data={moduleData}
        onInteraction={onInteraction}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start Module' }));

    expect(onInteraction).toHaveBeenCalledWith({
      componentId: 'cmp-module-overview',
      interactionType: 'start-module',
      interactionId: 'start-module',
      value: true,
    });
  });
});

describe('ModuleOverviewEditor', () => {
  it('updates title field', () => {
    const onChange = jest.fn();

    render(
      <ModuleOverviewEditor
        componentType="module-overview"
        data={moduleData}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Module' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].data.title).toBe('Updated Module');
  });

  it('adds and removes objectives', () => {
    const onChange = jest.fn();

    render(
      <ModuleOverviewEditor
        componentType="module-overview"
        data={moduleData}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '+ Add Objective' }));
    const afterAdd = onChange.mock.calls[0][0].data.objectives;
    expect(afterAdd.length).toBe(3);

    fireEvent.click(screen.getByLabelText('Remove objective 1'));
    const afterRemove = onChange.mock.calls[1][0].data.objectives;
    expect(afterRemove.length).toBe(1);
  });
});
