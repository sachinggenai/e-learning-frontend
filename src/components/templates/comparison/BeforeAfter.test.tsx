/**
 * BeforeAfter Tests
 * Comprehensive test coverage for Preview and Editor components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BeforeAfterPreview, BeforeAfterEditor } from './BeforeAfter';

describe('BeforeAfterPreview', () => {
  const mockData = {
    title: 'Process Improvement',
    beforeLabel: 'Old Process',
    afterLabel: 'New Process',
    beforeContent: 'Manual data entry with spreadsheets. Prone to errors and time-consuming.',
    afterContent: 'Automated data pipeline with validation. Fast and accurate.',
  };

  it('renders without errors', () => {
    render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Process Improvement')).toBeInTheDocument();
  });

  it('applies correct BEM root class', () => {
    const { container } = render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-before-after')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Process Improvement')).toHaveClass('tpl-before-after__title');
  });

  it('does not render title when not provided', () => {
    const dataWithoutTitle = { ...mockData, title: '' };
    const { container } = render(<BeforeAfterPreview data={dataWithoutTitle} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-before-after__title')).not.toBeInTheDocument();
  });

  it('renders before card with label', () => {
    render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    const beforeLabel = screen.getByText('Old Process');
    expect(beforeLabel).toHaveClass('tpl-before-after__card-label');
    expect(beforeLabel).toHaveClass('tpl-before-after__card-label--before');
  });

  it('renders after card with label', () => {
    render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    const afterLabel = screen.getByText('New Process');
    expect(afterLabel).toHaveClass('tpl-before-after__card-label');
    expect(afterLabel).toHaveClass('tpl-before-after__card-label--after');
  });

  it('displays before content', () => {
    render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText(/Manual data entry/)).toBeInTheDocument();
  });

  it('displays after content', () => {
    render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText(/Automated data pipeline/)).toBeInTheDocument();
  });

  it('uses default labels when not provided', () => {
    const dataWithoutLabels = {
      title: 'Test',
      beforeContent: 'Before',
      afterContent: 'After',
    };
    render(<BeforeAfterPreview data={dataWithoutLabels} onInteraction={jest.fn()} />);
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('renders arrow divider when content exists', () => {
    const { container } = render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-before-after__arrow')).toBeInTheDocument();
  });

  it('applies correct card classes', () => {
    const { container } = render(<BeforeAfterPreview data={mockData} onInteraction={jest.fn()} />);
    const cards = container.querySelectorAll('.tpl-before-after__card');
    expect(cards.length).toBe(2);
  });

  it('displays empty state when no content provided', () => {
    const emptyData = {
      title: 'Test',
      beforeLabel: 'Before',
      afterLabel: 'After',
      beforeContent: '',
      afterContent: '',
    };
    render(<BeforeAfterPreview data={emptyData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Add before and after content to compare')).toBeInTheDocument();
  });

  it('shows content when only before content exists', () => {
    const dataWithBefore = {
      title: 'Test',
      beforeContent: 'Before text',
      afterContent: '',
    };
    render(<BeforeAfterPreview data={dataWithBefore} onInteraction={jest.fn()} />);
    expect(screen.getByText('Before text')).toBeInTheDocument();
    expect(screen.queryByText('Add before and after content to compare')).not.toBeInTheDocument();
  });

  it('shows content when only after content exists', () => {
    const dataWithAfter = {
      title: 'Test',
      beforeContent: '',
      afterContent: 'After text',
    };
    render(<BeforeAfterPreview data={dataWithAfter} onInteraction={jest.fn()} />);
    expect(screen.getByText('After text')).toBeInTheDocument();
    expect(screen.queryByText('Add before and after content to compare')).not.toBeInTheDocument();
  });

  it('displays placeholder for empty before content', () => {
    const dataWithEmptyBefore = {
      ...mockData,
      beforeContent: '',
    };
    const { container } = render(<BeforeAfterPreview data={dataWithEmptyBefore} onInteraction={jest.fn()} />);
    const beforeCard = container.querySelector('.tpl-before-after__card:first-child .tpl-before-after__card-content');
    expect(beforeCard?.textContent).toContain('No content yet');
  });

  it('displays placeholder for empty after content', () => {
    const dataWithEmptyAfter = {
      ...mockData,
      afterContent: '',
    };
    const { container } = render(<BeforeAfterPreview data={dataWithEmptyAfter} onInteraction={jest.fn()} />);
    const afterCard = container.querySelector('.tpl-before-after__card:last-child .tpl-before-after__card-content');
    expect(afterCard?.textContent).toContain('No content yet');
  });

  it('renders with empty data object', () => {
    const { container } = render(<BeforeAfterPreview data={{}} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-before-after')).toBeInTheDocument();
  });
});

describe('BeforeAfterEditor', () => {
  const mockData = {
    title: 'Process Improvement',
    beforeLabel: 'Old Process',
    afterLabel: 'New Process',
    beforeContent: 'Manual data entry',
    afterContent: 'Automated pipeline',
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without errors', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText(/Process Improvement/)).toBeInTheDocument();
  });

  it('applies correct BEM editor root class', () => {
    const { container } = render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-before-after-editor')).toBeInTheDocument();
  });

  it('displays current title value', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const titleInput = screen.getByPlaceholderText(/Process Improvement/) as HTMLInputElement;
    expect(titleInput.value).toBe('Process Improvement');
  });

  it('displays current before label value', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const beforeLabelInput = screen.getByDisplayValue('Old Process') as HTMLInputElement;
    expect(beforeLabelInput).toBeInTheDocument();
  });

  it('displays current after label value', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const afterLabelInput = screen.getByDisplayValue('New Process') as HTMLInputElement;
    expect(afterLabelInput).toBeInTheDocument();
  });

  it('displays current before content value', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const beforeTextarea = screen.getByDisplayValue('Manual data entry') as HTMLTextAreaElement;
    expect(beforeTextarea).toBeInTheDocument();
  });

  it('displays current after content value', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const afterTextarea = screen.getByDisplayValue('Automated pipeline') as HTMLTextAreaElement;
    expect(afterTextarea).toBeInTheDocument();
  });

  it('updates title when changed', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const titleInput = screen.getByPlaceholderText(/Process Improvement/);
    
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: 'New Title' }),
    });
  });

  it('updates before label when changed', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const beforeLabelInput = screen.getByDisplayValue('Old Process');
    
    await user.clear(beforeLabelInput);
    await user.type(beforeLabelInput, 'Previous');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({ beforeLabel: 'Previous' }),
    });
  });

  it('updates after label when changed', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const afterLabelInput = screen.getByDisplayValue('New Process');
    
    await user.clear(afterLabelInput);
    await user.type(afterLabelInput, 'Current');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({ afterLabel: 'Current' }),
    });
  });

  it('updates before content when changed', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const beforeTextarea = screen.getByDisplayValue('Manual data entry');
    
    await user.clear(beforeTextarea);
    await user.type(beforeTextarea, 'Updated content');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({ beforeContent: 'Updated content' }),
    });
  });

  it('updates after content when changed', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const afterTextarea = screen.getByDisplayValue('Automated pipeline');
    
    await user.clear(afterTextarea);
    await user.type(afterTextarea, 'Updated content');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({ afterContent: 'Updated content' }),
    });
  });

  it('uses default values when data not provided', () => {
    const { container } = render(<BeforeAfterEditor data={{}} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-before-after-editor')).toBeInTheDocument();
  });

  it('renders section headers', () => {
    render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const headers = screen.getAllByRole('heading', { level: 5 });
    expect(headers[0]).toHaveTextContent('Before');
    expect(headers[1]).toHaveTextContent('After');
  });

  it('applies correct section title classes', () => {
    const { container } = render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const beforeTitle = container.querySelector('.tpl-before-after-editor__section-title--before');
    const afterTitle = container.querySelector('.tpl-before-after-editor__section-title--after');
    expect(beforeTitle).toBeInTheDocument();
    expect(afterTitle).toBeInTheDocument();
  });

  it('renders textarea elements for content', () => {
    const { container } = render(<BeforeAfterEditor data={mockData} onChange={mockOnChange} />);
    const textareas = container.querySelectorAll('.tpl-before-after-editor__textarea');
    expect(textareas.length).toBe(2);
  });
});
