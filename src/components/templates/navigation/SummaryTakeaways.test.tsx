import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  SummaryTakeawaysPreview,
  SummaryTakeawaysEditor,
  SummaryTakeawaysData,
} from './SummaryTakeaways';

// ============================================================
// TEST DATA
// ============================================================

const mockData: SummaryTakeawaysData = {
  title: 'Key Takeaways',
  introText: 'Here are the most important points from this module:',
  keyPoints: [
    {
      id: 'kp-1',
      text: 'Understanding the fundamentals is crucial',
      icon: 'CheckCircle',
      emphasis: 'high',
    },
    {
      id: 'kp-2',
      text: 'Practice regularly to reinforce your learning',
      icon: 'CheckCircle',
      emphasis: 'normal',
    },
    {
      id: 'kp-3',
      text: 'Apply concepts to real-world scenarios',
      icon: 'CheckCircle',
      emphasis: 'normal',
    },
  ],
  closingRemarks: 'Great work completing this module!',
  nextSteps: 'Continue to the next module to explore advanced topics.',
  showNextStepsSection: true,
  displayStyle: 'cards',
  showCompleteButton: true,
  showContinueButton: true,
  continueButtonText: 'Continue to Next Module',
};

// ============================================================
// PREVIEW COMPONENT TESTS
// ============================================================

describe('SummaryTakeawaysPreview', () => {
  const mockOnInteraction = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnInteraction.mockClear();
    mockOnComplete.mockClear();
  });

  test('renders title and intro text', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
    expect(screen.getByText('Here are the most important points from this module:')).toBeInTheDocument();
  });

  test('renders all key points', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Understanding the fundamentals is crucial')).toBeInTheDocument();
    expect(screen.getByText('Practice regularly to reinforce your learning')).toBeInTheDocument();
    expect(screen.getByText('Apply concepts to real-world scenarios')).toBeInTheDocument();
  });

  test('applies cards display style by default', () => {
    const { container } = render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const keyPointsContainer = container.querySelector('.tpl-summary-takeaways__key-points');
    expect(keyPointsContainer).toHaveClass('tpl-summary-takeaways__key-points--cards');
  });

  test('applies list display style when specified', () => {
    const listData = { ...mockData, displayStyle: 'list' as const };
    const { container } = render(
      <SummaryTakeawaysPreview
        data={listData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const keyPointsContainer = container.querySelector('.tpl-summary-takeaways__key-points');
    expect(keyPointsContainer).toHaveClass('tpl-summary-takeaways__key-points--list');
  });

  test('applies high emphasis class to emphasized key points', () => {
    const { container } = render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const keyPoints = container.querySelectorAll('.tpl-summary-takeaways__key-point');
    expect(keyPoints[0]).toHaveClass('tpl-summary-takeaways__key-point--emphasis-high');
    expect(keyPoints[1]).not.toHaveClass('tpl-summary-takeaways__key-point--emphasis-high');
  });

  test('renders closing remarks when provided', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Great work completing this module!')).toBeInTheDocument();
  });

  test('does not render closing remarks when not provided', () => {
    const dataWithoutClosing = { ...mockData, closingRemarks: undefined };
    const { container } = render(
      <SummaryTakeawaysPreview
        data={dataWithoutClosing}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(container.querySelector('.tpl-summary-takeaways__closing')).not.toBeInTheDocument();
  });

  test('renders next steps section when enabled', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText("What's Next")).toBeInTheDocument();
    expect(screen.getByText('Continue to the next module to explore advanced topics.')).toBeInTheDocument();
  });

  test('does not render next steps when disabled', () => {
    const dataWithoutNextSteps = { ...mockData, showNextStepsSection: false };
    const { container } = render(
      <SummaryTakeawaysPreview
        data={dataWithoutNextSteps}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(container.querySelector('.tpl-summary-takeaways__next-steps')).not.toBeInTheDocument();
  });

  test('renders complete button when enabled', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Mark as Complete')).toBeInTheDocument();
  });

  test('renders continue button with custom text', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Continue to Next Module')).toBeInTheDocument();
  });

  test('does not render action buttons when both disabled', () => {
    const dataWithoutButtons = {
      ...mockData,
      showCompleteButton: false,
      showContinueButton: false,
    };
    const { container } = render(
      <SummaryTakeawaysPreview
        data={dataWithoutButtons}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(container.querySelector('.tpl-summary-takeaways__actions')).not.toBeInTheDocument();
  });

  test('calls onComplete and onInteraction when complete button clicked', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const completeButton = screen.getByText('Mark as Complete');
    fireEvent.click(completeButton);

    expect(mockOnComplete).toHaveBeenCalledWith('');
    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'mark-complete',
      interactionId: 'complete',
      value: true,
    });
  });

  test('calls onInteraction when continue button clicked', () => {
    render(
      <SummaryTakeawaysPreview
        data={mockData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    const continueButton = screen.getByText('Continue to Next Module');
    fireEvent.click(continueButton);

    expect(mockOnInteraction).toHaveBeenCalledWith({
      componentId: undefined,
      interactionType: 'continue-clicked',
      interactionId: 'continue',
      value: true,
    });
  });

  test('displays empty state when no key points', () => {
    const emptyData: SummaryTakeawaysData = {
      ...mockData,
      keyPoints: [],
    };

    render(
      <SummaryTakeawaysPreview
        data={emptyData}
        onInteraction={mockOnInteraction}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('No takeaways configured')).toBeInTheDocument();
  });
});

// ============================================================
// EDITOR COMPONENT TESTS
// ============================================================

describe('SummaryTakeawaysEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders all editor sections', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Key Points *')).toBeInTheDocument();
    expect(screen.getByText('Closing Remarks')).toBeInTheDocument();
    expect(screen.getByText('Next Steps')).toBeInTheDocument();
    expect(screen.getByText('Action Buttons')).toBeInTheDocument();
  });

  test('displays all key points in editor', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Understanding the fundamentals is crucial')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Practice regularly to reinforce your learning')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Apply concepts to real-world scenarios')).toBeInTheDocument();
  });

  test('updates title field', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const titleInput = screen.getByLabelText('Title *') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        title: 'Updated Title',
      },
    });
  });

  test('updates intro text', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const introInput = screen.getByLabelText('Intro Text') as HTMLTextAreaElement;
    fireEvent.change(introInput, { target: { value: 'New intro text' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        introText: 'New intro text',
      },
    });
  });

  test('changes display style', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const listRadio = screen.getByRole('radio', { name: 'List' });
    fireEvent.click(listRadio);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        displayStyle: 'list',
      },
    });
  });

  test('updates key point text', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const keyPointTextarea = screen.getByDisplayValue('Understanding the fundamentals is crucial');
    fireEvent.change(keyPointTextarea, { target: { value: 'Updated key point' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        keyPoints: [
          { ...mockData.keyPoints[0], text: 'Updated key point' },
          mockData.keyPoints[1],
          mockData.keyPoints[2],
        ],
      },
    });
  });

  test('updates key point emphasis', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    // Get all "Normal" radio buttons and click the first one (for the first key point which is currently high)
    const normalRadios = screen.getAllByRole('radio', { name: 'Normal' });
    fireEvent.click(normalRadios[0]);

    expect(mockOnChange).toHaveBeenCalled();
    const calledWith = mockOnChange.mock.calls[0][0];
    expect(calledWith.data.keyPoints[0].emphasis).toBe('normal');
  });

  test('adds new key point', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const addButton = screen.getByText('+ Add Key Point');
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
    const calledWith = mockOnChange.mock.calls[0][0];
    expect(calledWith.data.keyPoints).toHaveLength(4);
    expect(calledWith.data.keyPoints[3].text).toBe('');
    expect(calledWith.data.keyPoints[3].emphasis).toBe('normal');
  });

  test('removes key point', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        keyPoints: [mockData.keyPoints[1], mockData.keyPoints[2]],
      },
    });
  });

  test('updates closing remarks', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const closingTextarea = screen.getByLabelText('Closing Text') as HTMLTextAreaElement;
    fireEvent.change(closingTextarea, { target: { value: 'New closing text' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        closingRemarks: 'New closing text',
      },
    });
  });

  test('toggles next steps section', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /Show Next Steps section/i });
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        showNextStepsSection: false,
      },
    });
  });

  test('updates next steps text when section is enabled', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const nextStepsTextarea = screen.getByLabelText('Next Steps Text') as HTMLTextAreaElement;
    fireEvent.change(nextStepsTextarea, { target: { value: 'New next steps' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        nextSteps: 'New next steps',
      },
    });
  });

  test('toggles complete button', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /Show "Mark as Complete" button/i });
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        showCompleteButton: false,
      },
    });
  });

  test('toggles continue button', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /Show "Continue" button/i });
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        showContinueButton: false,
      },
    });
  });

  test('updates continue button text', () => {
    render(<SummaryTakeawaysEditor data={mockData} onChange={mockOnChange} />);

    const buttonTextInput = screen.getByLabelText('Continue Button Text') as HTMLInputElement;
    fireEvent.change(buttonTextInput, { target: { value: 'Go to Advanced Topics' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...mockData,
        continueButtonText: 'Go to Advanced Topics',
      },
    });
  });
});
