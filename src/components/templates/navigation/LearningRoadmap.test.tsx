import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  LearningRoadmapPreview,
  LearningRoadmapEditor,
  LearningRoadmapData,
} from './LearningRoadmap';

// ============================================================
// TEST DATA
// ============================================================

const mockData: LearningRoadmapData = {
  title: 'Course Learning Path',
  description: 'Follow this roadmap to complete the course',
  milestones: [
    {
      id: 'ms-1',
      title: 'Getting Started',
      description: 'Introduction to the course',
      status: 'completed',
      pageId: 'page-1',
      estimatedDuration: 15,
    },
    {
      id: 'ms-2',
      title: 'Core Concepts',
      description: 'Learn the fundamentals',
      status: 'current',
      pageId: 'page-2',
      estimatedDuration: 30,
    },
    {
      id: 'ms-3',
      title: 'Advanced Topics',
      description: 'Deep dive into advanced subjects',
      status: 'locked',
      pageId: 'page-3',
      estimatedDuration: 45,
    },
  ],
  showConnectors: true,
  layout: 'vertical',
};

// ============================================================
// PREVIEW COMPONENT TESTS
// ============================================================

describe('LearningRoadmapPreview', () => {
  const mockOnInteraction = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
  });

  test('renders roadmap title and description', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    expect(screen.getByText('Course Learning Path')).toBeInTheDocument();
    expect(screen.getByText('Follow this roadmap to complete the course')).toBeInTheDocument();
  });

  test('renders all milestones with correct status', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Core Concepts')).toBeInTheDocument();
    expect(screen.getByText('Advanced Topics')).toBeInTheDocument();
  });

  test('displays milestone descriptions and durations', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    expect(screen.getByText('Introduction to the course')).toBeInTheDocument();
    expect(screen.getByText('Learn the fundamentals')).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  test('applies correct BEM classes for milestone status', () => {
    const { container } = render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const milestones = container.querySelectorAll('.tpl-learning-roadmap__milestone');
    expect(milestones[0]).toHaveClass('tpl-learning-roadmap__milestone--completed');
    expect(milestones[1]).toHaveClass('tpl-learning-roadmap__milestone--current');
    expect(milestones[2]).toHaveClass('tpl-learning-roadmap__milestone--locked');
  });

  test('renders connector lines when showConnectors is true', () => {
    const { container } = render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const connectors = container.querySelectorAll('.tpl-learning-roadmap__connector');
    // Should have 2 connectors for 3 milestones
    expect(connectors).toHaveLength(2);
  });

  test('does not render connector lines when showConnectors is false', () => {
    const dataWithoutConnectors = { ...mockData, showConnectors: false };
    const { container } = render(
      <LearningRoadmapPreview data={dataWithoutConnectors} onInteraction={mockOnInteraction} />
    );

    const connectors = container.querySelectorAll('.tpl-learning-roadmap__connector');
    expect(connectors).toHaveLength(0);
  });

  test('marks completed milestones as clickable', () => {
    const { container } = render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const completedMilestone = container.querySelector('.tpl-learning-roadmap__milestone--completed');
    expect(completedMilestone).toHaveClass('tpl-learning-roadmap__milestone--clickable');
    expect(completedMilestone).toHaveAttribute('role', 'button');
    expect(completedMilestone).toHaveAttribute('tabindex', '0');
  });

  test('marks current milestone as clickable', () => {
    const { container } = render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const currentMilestone = container.querySelector('.tpl-learning-roadmap__milestone--current');
    expect(currentMilestone).toHaveClass('tpl-learning-roadmap__milestone--clickable');
    expect(currentMilestone).toHaveAttribute('role', 'button');
    expect(currentMilestone).toHaveAttribute('tabindex', '0');
  });

  test('does not mark locked milestones as clickable', () => {
    const { container } = render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const lockedMilestone = container.querySelector('.tpl-learning-roadmap__milestone--locked');
    expect(lockedMilestone).not.toHaveClass('tpl-learning-roadmap__milestone--clickable');
  });

  test('emits interaction event when clicking completed milestone', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const completedMilestone = screen.getByText('Getting Started').closest('.tpl-learning-roadmap__milestone');
    fireEvent.click(completedMilestone!);

    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'milestone_click',
      interactionId: 'ms-1',
      value: 'page-1',
    });
  });

  test('emits interaction event when clicking current milestone', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const currentMilestone = screen.getByText('Core Concepts').closest('.tpl-learning-roadmap__milestone');
    fireEvent.click(currentMilestone!);

    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'milestone_click',
      interactionId: 'ms-2',
      value: 'page-2',
    });
  });

  test('does not emit interaction when clicking locked milestone', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const lockedMilestone = screen.getByText('Advanced Topics').closest('.tpl-learning-roadmap__milestone');
    fireEvent.click(lockedMilestone!);

    expect(mockOnInteraction).not.toHaveBeenCalled();
  });

  test('displays empty state when no milestones', () => {
    const emptyData: LearningRoadmapData = {
      ...mockData,
      milestones: [],
    };

    render(
      <LearningRoadmapPreview data={emptyData} onInteraction={mockOnInteraction} />
    );

    expect(screen.getByText('No milestones configured')).toBeInTheDocument();
  });

  test('handles keyboard navigation with Enter key', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const completedMilestone = screen.getByText('Getting Started').closest('.tpl-learning-roadmap__milestone');
    fireEvent.keyDown(completedMilestone!, { key: 'Enter', code: 'Enter' });

    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'milestone_click',
      interactionId: 'ms-1',
      value: 'page-1',
    });
  });

  test('handles keyboard navigation with Space key', () => {
    render(
      <LearningRoadmapPreview data={mockData} onInteraction={mockOnInteraction} />
    );

    const currentMilestone = screen.getByText('Core Concepts').closest('.tpl-learning-roadmap__milestone');
    fireEvent.keyDown(currentMilestone!, { key: ' ', code: 'Space' });

    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'milestone_click',
      interactionId: 'ms-2',
      value: 'page-2',
    });
  });
});

// ============================================================
// EDITOR COMPONENT TESTS
// ============================================================

describe('LearningRoadmapEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders all editor fields', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    expect(screen.getByLabelText('Roadmap Title')).toBeInTheDocument();
    expect(document.getElementById('roadmap-description')).toBeInTheDocument();
    expect(screen.getByText('Show connector lines')).toBeInTheDocument();
    expect(screen.getByText('Milestones')).toBeInTheDocument();
  });

  test('displays all milestones in editor', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Getting Started')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Core Concepts')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Advanced Topics')).toBeInTheDocument();
  });

  test('updates roadmap title', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const titleInput = screen.getByLabelText('Roadmap Title') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Updated Roadmap Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        title: 'Updated Roadmap Title',
      },
    });
  });

  test('updates roadmap description', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const descriptionInput = document.getElementById('roadmap-description') as HTMLTextAreaElement;
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        description: 'New description',
      },
    });
  });

  test('toggles show connectors checkbox', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /show connector lines/i });
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        showConnectors: false,
      },
    });
  });

  test('updates milestone title', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const titleInput = screen.getByDisplayValue('Getting Started');
    fireEvent.change(titleInput, { target: { value: 'Updated Milestone' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        milestones: [
          { ...mockData.milestones[0], title: 'Updated Milestone' },
          mockData.milestones[1],
          mockData.milestones[2],
        ],
      },
    });
  });

  test('updates milestone status', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const statusSelect = screen.getAllByLabelText(/Status/i)[0] as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'current' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  test('enforces single current milestone status', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    // Try to set first milestone (currently completed) to current
    const statusSelects = screen.getAllByLabelText(/Status/i) as HTMLSelectElement[];
    fireEvent.change(statusSelects[0], { target: { value: 'current' } });

    // Check that onChange was called with first milestone as current
    // and second milestone (previously current) should be locked
    const calledWith = mockOnChange.mock.calls[0][0];
    expect(calledWith.data.milestones[0].status).toBe('current');
    expect(calledWith.data.milestones[1].status).toBe('locked'); // Was current, now locked
  });

  test('adds new milestone', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const addButton = screen.getByText('+ Add Milestone');
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
    const calledWith = mockOnChange.mock.calls[0][0];
    expect(calledWith.data.milestones).toHaveLength(4);
    expect(calledWith.data.milestones[3].title).toBe('New Milestone');
    expect(calledWith.data.milestones[3].status).toBe('locked');
  });

  test('removes milestone', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        milestones: [mockData.milestones[1], mockData.milestones[2]],
      },
    });
  });

  test('updates milestone duration', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const durationInputs = screen.getAllByLabelText(/Duration \(min\)/i);
    fireEvent.change(durationInputs[0], { target: { value: '20' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        milestones: [
          { ...mockData.milestones[0], estimatedDuration: 20 },
          mockData.milestones[1],
          mockData.milestones[2],
        ],
      },
    });
  });

  test('updates milestone page ID', () => {
    render(<LearningRoadmapEditor data={mockData} onChange={mockOnChange} />);

    const pageIdInputs = screen.getAllByLabelText(/Page ID/i);
    fireEvent.change(pageIdInputs[0], { target: { value: 'page-10' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        milestones: [
          { ...mockData.milestones[0], pageId: 'page-10' },
          mockData.milestones[1],
          mockData.milestones[2],
        ],
      },
    });
  });
});
