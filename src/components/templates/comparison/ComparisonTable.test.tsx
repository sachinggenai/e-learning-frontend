/**
 * ComparisonTable Tests
 * Comprehensive test coverage for Preview and Editor components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComparisonTablePreview, ComparisonTableEditor } from './ComparisonTable';

describe('ComparisonTablePreview', () => {
  const mockData = {
    title: 'Feature Comparison',
    columns: [
      { id: 'col1', header: 'Basic', highlighted: false },
      { id: 'col2', header: 'Pro', highlighted: true },
      { id: 'col3', header: 'Enterprise', highlighted: false },
    ],
    rows: [
      {
        id: 'row1',
        feature: 'Storage',
        values: { col1: '10GB', col2: '100GB', col3: 'Unlimited' },
      },
      {
        id: 'row2',
        feature: 'Users',
        values: { col1: '1', col2: '10', col3: 'Unlimited' },
      },
      {
        id: 'row3',
        feature: 'Support',
        values: { col1: 'Email', col2: 'Priority', col3: '24/7' },
      },
    ],
  };

  it('renders without errors', () => {
    render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Feature Comparison')).toBeInTheDocument();
  });

  it('applies correct BEM root class', () => {
    const { container } = render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-comparison-table')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Feature Comparison')).toHaveClass('tpl-comparison-table__title');
  });

  it('does not render title when not provided', () => {
    const dataWithoutTitle = { ...mockData, title: undefined };
    const { container } = render(<ComparisonTablePreview data={dataWithoutTitle} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-comparison-table__title')).not.toBeInTheDocument();
  });

  it('renders all column headers correctly', () => {
    render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('applies highlighted class to highlighted columns', () => {
    const { container } = render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    const proHeader = screen.getByText('Pro').closest('th');
    expect(proHeader).toHaveClass('tpl-comparison-table__header-cell--highlighted');
  });

  it('displays "Recommended" badge for highlighted columns', () => {
    render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.getByText('Recommended')).toHaveClass('tpl-comparison-table__recommended-badge');
  });

  it('renders all row features', () => {
    render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders all cell values correctly', () => {
    render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('10GB')).toBeInTheDocument();
    expect(screen.getByText('100GB')).toBeInTheDocument();
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
  });

  it('displays em dash for missing cell values', () => {
    const dataWithMissingValue = {
      ...mockData,
      rows: [
        { id: 'row1', feature: 'Feature', values: { col1: 'Value' } },
      ],
    };
    render(<ComparisonTablePreview data={dataWithMissingValue} onInteraction={jest.fn()} />);
    const cells = screen.getAllByText('—');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('applies even/odd row classes correctly', () => {
    const { container } = render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    const rows = container.querySelectorAll('.tpl-comparison-table__row');
    expect(rows[0]).toHaveClass('tpl-comparison-table__row--even');
    expect(rows[1]).toHaveClass('tpl-comparison-table__row--odd');
    expect(rows[2]).toHaveClass('tpl-comparison-table__row--even');
  });

  it('applies highlighted cell classes in highlighted columns', () => {
    const { container } = render(<ComparisonTablePreview data={mockData} onInteraction={jest.fn()} />);
    const highlightedCells = container.querySelectorAll('.tpl-comparison-table__cell--highlighted');
    // Should have 3 highlighted cells (one per row in the Pro column)
    expect(highlightedCells.length).toBe(3);
  });

  it('renders with empty data gracefully', () => {
    const emptyData = { title: '', columns: [], rows: [] };
    const { container } = render(<ComparisonTablePreview data={emptyData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-comparison-table')).toBeInTheDocument();
  });

  it('handles missing data prop', () => {
    const { container } = render(<ComparisonTablePreview data={{}} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-comparison-table')).toBeInTheDocument();
  });
});

describe('ComparisonTableEditor', () => {
  const mockData = {
    title: 'Feature Comparison',
    columns: [
      { id: 'col1', header: 'Basic', highlighted: false },
      { id: 'col2', header: 'Pro', highlighted: true },
    ],
    rows: [
      { id: 'row1', feature: 'Storage', values: { col1: '10GB', col2: '100GB' } },
    ],
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without errors', () => {
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Comparison')).toBeInTheDocument();
  });

  it('applies correct BEM editor root class', () => {
    const { container } = render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-comparison-table-editor')).toBeInTheDocument();
  });

  it('displays current title value', () => {
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const titleInput = screen.getByPlaceholderText('Comparison') as HTMLInputElement;
    expect(titleInput.value).toBe('Feature Comparison');
  });

  it('updates title when changed', async () => {
    const user = userEvent.setup();
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const titleInput = screen.getByPlaceholderText('Comparison');
    
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: 'New Title' }),
    });
  });

  it('renders all column inputs', () => {
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Basic')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pro')).toBeInTheDocument();
  });

  it('updates column header when changed', async () => {
    const user = userEvent.setup();
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const basicInput = screen.getByDisplayValue('Basic');
    
    await user.clear(basicInput);
    await user.type(basicInput, 'Starter');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        columns: expect.arrayContaining([
          expect.objectContaining({ header: 'Starter' }),
        ]),
      }),
    });
  });

  it('renders highlight checkbox for each column', () => {
    const { container } = render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const checkboxes = container.querySelectorAll('.tpl-comparison-table-editor__highlight-checkbox');
    expect(checkboxes.length).toBe(2);
  });

  it('shows checked state for highlighted columns', () => {
    const { container } = render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const checkboxes = container.querySelectorAll('.tpl-comparison-table-editor__highlight-checkbox') as NodeListOf<HTMLInputElement>;
    expect(checkboxes[0].checked).toBe(false); // Basic
    expect(checkboxes[1].checked).toBe(true);  // Pro
  });

  it('toggles column highlight when checkbox clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const checkboxes = container.querySelectorAll('.tpl-comparison-table-editor__highlight-checkbox');
    
    await user.click(checkboxes[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'col1', highlighted: true }),
        ]),
      }),
    });
  });

  it('adds new column when add button clicked', async () => {
    const user = userEvent.setup();
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const addButton = screen.getByText('+ Column');
    
    await user.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        columns: expect.arrayContaining([
          mockData.columns[0],
          mockData.columns[1],
          expect.objectContaining({ header: '' }),
        ]),
      }),
    });
  });

  it('removes column when remove button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const removeButtons = container.querySelectorAll('.tpl-comparison-table-editor__column-item .tpl-comparison-table-editor__remove-btn');
    
    await user.click(removeButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        columns: [mockData.columns[1]],
      }),
    });
  });

  it('renders row feature input', () => {
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Storage')).toBeInTheDocument();
  });

  it('updates row feature when changed', async () => {
    const user = userEvent.setup();
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const featureInput = screen.getByDisplayValue('Storage');
    
    await user.clear(featureInput);
    await user.type(featureInput, 'Disk Space');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({ feature: 'Disk Space' }),
        ]),
      }),
    });
  });

  it('renders cell inputs for each column in each row', () => {
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('10GB')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100GB')).toBeInTheDocument();
  });

  it('updates cell value when changed', async () => {
    const user = userEvent.setup();
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const cellInput = screen.getByDisplayValue('10GB');
    
    await user.clear(cellInput);
    await user.type(cellInput, '20GB');
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({
            values: expect.objectContaining({ col1: '20GB' }),
          }),
        ]),
      }),
    });
  });

  it('adds new row when add button clicked', async () => {
    const user = userEvent.setup();
    render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const addButton = screen.getByText('+ Add Row');
    
    await user.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rows: expect.arrayContaining([
          mockData.rows[0],
          expect.objectContaining({ feature: '', values: {} }),
        ]),
      }),
    });
  });

  it('removes row when remove button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ComparisonTableEditor data={mockData} onChange={mockOnChange} />);
    const removeButtons = container.querySelectorAll('.tpl-comparison-table-editor__row-item .tpl-comparison-table-editor__remove-btn');
    
    await user.click(removeButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rows: [],
      }),
    });
  });

  it('handles empty data gracefully', () => {
    const emptyData = { title: '', columns: [], rows: [] };
    const { container } = render(<ComparisonTableEditor data={emptyData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-comparison-table-editor')).toBeInTheDocument();
  });

  it('handles missing data prop', () => {
    const { container } = render(<ComparisonTableEditor data={{}} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-comparison-table-editor')).toBeInTheDocument();
  });
});
