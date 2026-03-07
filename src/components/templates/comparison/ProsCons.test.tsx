/**
 * ProsCons Tests
 * Comprehensive test coverage for Preview and Editor components
 */

import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProsConsPreview, ProsConsEditor } from './ProsCons';

// Test wrapper that properly manages state for controlled components
const EditorTestWrapper = ({ initialData, onChangeSpy }: { initialData: any; onChangeSpy: jest.Mock }) => {
  const [data, setData] = useState(initialData);
  const handleChange = (payload: any) => {
    onChangeSpy(payload);
    setData(payload.data);
  };
  return <ProsConsEditor data={data} onChange={handleChange} />;
};

describe('ProsConsPreview', () => {
  const mockData = {
    title: 'Should we adopt React?',
    topic: 'Technology evaluation for frontend development',
    pros: [
      'Large community and ecosystem',
      'Component-based architecture',
      'Virtual DOM for performance',
    ],
    cons: [
      'Steep learning curve',
      'Frequent breaking changes',
      'Requires additional libraries',
    ],
  };

  it('renders without errors', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Should we adopt React?')).toBeInTheDocument();
  });

  it('applies correct BEM root class', () => {
    const { container } = render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-pros-cons')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Should we adopt React?')).toHaveClass('tpl-pros-cons__title');
  });

  it('displays topic when provided', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Technology evaluation for frontend development')).toHaveClass('tpl-pros-cons__topic');
  });

  it('does not render title when not provided', () => {
    const dataWithoutTitle = { ...mockData, title: '' };
    const { container } = render(<ProsConsPreview data={dataWithoutTitle} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-pros-cons__title')).not.toBeInTheDocument();
  });

  it('does not render topic when not provided', () => {
    const dataWithoutTopic = { ...mockData, topic: '' };
    const { container } = render(<ProsConsPreview data={dataWithoutTopic} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-pros-cons__topic')).not.toBeInTheDocument();
  });

  it('renders Pros column header', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    const prosHeader = screen.getByText('Pros');
    expect(prosHeader).toHaveClass('tpl-pros-cons__column-header');
    expect(prosHeader).toHaveClass('tpl-pros-cons__column-header--pro');
  });

  it('renders Cons column header', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    const consHeader = screen.getByText('Cons');
    expect(consHeader).toHaveClass('tpl-pros-cons__column-header');
    expect(consHeader).toHaveClass('tpl-pros-cons__column-header--con');
  });

  it('renders all pros items', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Large community and ecosystem')).toBeInTheDocument();
    expect(screen.getByText('Component-based architecture')).toBeInTheDocument();
    expect(screen.getByText('Virtual DOM for performance')).toBeInTheDocument();
  });

  it('renders all cons items', () => {
    render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Steep learning curve')).toBeInTheDocument();
    expect(screen.getByText('Frequent breaking changes')).toBeInTheDocument();
    expect(screen.getByText('Requires additional libraries')).toBeInTheDocument();
  });

  it('applies pro item classes correctly', () => {
    const { container } = render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    const proItems = container.querySelectorAll('.tpl-pros-cons__item--pro');
    expect(proItems.length).toBe(3);
  });

  it('applies con item classes correctly', () => {
    const { container } = render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    const conItems = container.querySelectorAll('.tpl-pros-cons__item--con');
    expect(conItems.length).toBe(3);
  });

  it('renders CheckCircle icons for pros', () => {
    const { container } = render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    const proIcons = container.querySelectorAll('.tpl-pros-cons__item-icon--pro');
    expect(proIcons.length).toBe(3);
  });

  it('renders XCircle icons for cons', () => {
    const { container } = render(<ProsConsPreview data={mockData} onInteraction={jest.fn()} />);
    const conIcons = container.querySelectorAll('.tpl-pros-cons__item-icon--con');
    expect(conIcons.length).toBe(3);
  });

  it('displays empty state when no pros provided', () => {
    const dataWithoutPros = { ...mockData, pros: [] };
    render(<ProsConsPreview data={dataWithoutPros} onInteraction={jest.fn()} />);
    expect(screen.getByText('No pros added yet')).toBeInTheDocument();
  });

  it('displays empty state when no cons provided', () => {
    const dataWithoutCons = { ...mockData, cons: [] };
    render(<ProsConsPreview data={dataWithoutCons} onInteraction={jest.fn()} />);
    expect(screen.getByText('No cons added yet')).toBeInTheDocument();
  });

  it('renders with empty data gracefully', () => {
    const emptyData = { title: '', topic: '', pros: [], cons: [] };
    const { container } = render(<ProsConsPreview data={emptyData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-pros-cons')).toBeInTheDocument();
    expect(screen.getByText('No pros added yet')).toBeInTheDocument();
    expect(screen.getByText('No cons added yet')).toBeInTheDocument();
  });

  it('handles missing data prop', () => {
    const { container } = render(<ProsConsPreview data={{}} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-pros-cons')).toBeInTheDocument();
  });
});

describe('ProsConsEditor', () => {
  const mockData = {
    title: 'Should we adopt React?',
    topic: 'Technology evaluation',
    pros: ['Great ecosystem', 'Fast performance'],
    cons: ['Complex setup', 'Large bundle size'],
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without errors', () => {
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText(/Should we adopt/)).toBeInTheDocument();
  });

  it('applies correct BEM editor root class', () => {
    const { container } = render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-pros-cons-editor')).toBeInTheDocument();
  });

  it('displays current title value', () => {
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const titleInput = screen.getByPlaceholderText(/Should we adopt/) as HTMLInputElement;
    expect(titleInput.value).toBe('Should we adopt React?');
  });

  it('displays current topic value', () => {
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const topicInput = screen.getByPlaceholderText(/React vs Vue/) as HTMLInputElement;
    expect(topicInput.value).toBe('Technology evaluation');
  });

  it('updates title when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const titleInput = screen.getByPlaceholderText(/Should we adopt/);
    
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');
    
    // Check that the final value is correct
    const titleInputFinal = screen.getByPlaceholderText(/Should we adopt/) as HTMLInputElement;
    expect(titleInputFinal.value).toBe('New Title');
  });

  it('updates topic when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const topicInput = screen.getByPlaceholderText(/React vs Vue/);
    
    await user.clear(topicInput);
    await user.type(topicInput, 'New Topic');
    
    const topicInputFinal = screen.getByPlaceholderText(/React vs Vue/) as HTMLInputElement;
    expect(topicInputFinal.value).toBe('New Topic');
  });

  it('renders Pros section header with icon', () => {
    const { container } = render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const prosHeader = screen.getByText('Pros');
    expect(prosHeader).toHaveClass('tpl-pros-cons-editor__section-title--pro');
    expect(container.querySelector('.tpl-pros-cons-editor__section-icon')).toBeInTheDocument();
  });

  it('renders Cons section header with icon', () => {
    const { container } = render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const consHeader = screen.getByText('Cons');
    expect(consHeader).toHaveClass('tpl-pros-cons-editor__section-title--con');
  });

  it('renders all pro inputs', () => {
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Great ecosystem')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fast performance')).toBeInTheDocument();
  });

  it('renders all con inputs', () => {
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Complex setup')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Large bundle size')).toBeInTheDocument();
  });

  it('updates pro item when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const proInput = screen.getByDisplayValue('Great ecosystem');
    
    await user.clear(proInput);
    await user.type(proInput, 'Updated pro');
    
    const proInputFinal = screen.getByDisplayValue('Updated pro');
    expect(proInputFinal).toBeInTheDocument();
  });

  it('updates con item when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const conInput = screen.getByDisplayValue('Complex setup');
    
    await user.clear(conInput);
    await user.type(conInput, 'Updated con');
    
    const conInputFinal = screen.getByDisplayValue('Updated con');
    expect(conInputFinal).toBeInTheDocument();
  });

  it('adds new pro when add button clicked', async () => {
    const user = userEvent.setup();
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const addButton = screen.getByText('+ Add Pro');
    
    await user.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        pros: ['Great ecosystem', 'Fast performance', ''],
      }),
    });
  });

  it('adds new con when add button clicked', async () => {
    const user = userEvent.setup();
    render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const addButton = screen.getByText('+ Add Con');
    
    await user.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        cons: ['Complex setup', 'Large bundle size', ''],
      }),
    });
  });

  it('removes pro when remove button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const prosSection = container.querySelectorAll('.tpl-pros-cons-editor__items')[0];
    const removeButtons = prosSection.querySelectorAll('.tpl-pros-cons-editor__remove-btn');
    
    await user.click(removeButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        pros: ['Fast performance'],
      }),
    });
  });

  it('removes con when remove button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProsConsEditor data={mockData} onChange={mockOnChange} />);
    const consSection = container.querySelectorAll('.tpl-pros-cons-editor__items')[1];
    const removeButtons = consSection.querySelectorAll('.tpl-pros-cons-editor__remove-btn');
    
    await user.click(removeButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        cons: ['Large bundle size'],
      }),
    });
  });

  it('renders with empty pros/cons gracefully', () => {
    const emptyData = { title: '', topic: '', pros: [], cons: [] };
    const { container } = render(<ProsConsEditor data={emptyData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-pros-cons-editor')).toBeInTheDocument();
  });

  it('handles missing data prop', () => {
    const { container } = render(<ProsConsEditor data={{}} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-pros-cons-editor')).toBeInTheDocument();
  });
});
