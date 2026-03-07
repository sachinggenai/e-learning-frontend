/**
 * MatrixGrid Tests
 * Comprehensive test coverage for Preview and Editor components
 */

import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatrixGridPreview, MatrixGridEditor } from './MatrixGrid';

// Test wrapper that properly manages state for controlled components
const EditorTestWrapper = ({ initialData, onChangeSpy }: { initialData: any; onChangeSpy: jest.Mock }) => {
  const [data, setData] = useState(initialData);
  const handleChange = (payload: any) => {
    onChangeSpy(payload);
    setData(payload.data);
  };
  return <MatrixGridEditor data={data} onChange={handleChange} />;
};

describe('MatrixGridPreview', () => {
  const mockData = {
    title: 'Skills Matrix',
    rowHeaders: ['JavaScript', 'Python', 'Java'],
    columnHeaders: ['Beginner', 'Intermediate', 'Advanced'],
    cells: [
      ['Variables', 'Functions', 'Closures'],
      ['Lists', 'Decorators', 'Metaclasses'],
      ['Classes', 'Streams', 'Reflection'],
    ],
  };

  it('renders without errors', () => {
    render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Skills Matrix')).toBeInTheDocument();
  });

  it('applies correct BEM root class', () => {
    const { container } = render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-matrix-grid')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Skills Matrix')).toHaveClass('tpl-matrix-grid__title');
  });

  it('does not render title when not provided', () => {
    const dataWithoutTitle = { ...mockData, title: '' };
    const { container } = render(<MatrixGridPreview data={dataWithoutTitle} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-matrix-grid__title')).not.toBeInTheDocument();
  });

  it('renders all column headers', () => {
    render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('renders all row headers', () => {
    render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
  });

  it('renders all cell values', () => {
    render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('Functions')).toBeInTheDocument();
    expect(screen.getByText('Closures')).toBeInTheDocument();
    expect(screen.getByText('Decorators')).toBeInTheDocument();
    expect(screen.getByText('Streams')).toBeInTheDocument();
  });

  it('applies grid wrapper class', () => {
    const { container } = render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-matrix-grid__wrapper')).toBeInTheDocument();
  });

  it('renders corner header cell', () => {
    const { container } = render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-matrix-grid__header-cell--corner')).toBeInTheDocument();
  });

  it('renders row header cells with correct class', () => {
    const { container } = render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    const rowHeaderCells = container.querySelectorAll('.tpl-matrix-grid__cell--row-header');
    expect(rowHeaderCells.length).toBe(3);
  });

  it('displays em dash for missing cell values', () => {
    const dataWithMissingCells = {
      ...mockData,
      cells: [['Value'], [], []],
    };
    render(<MatrixGridPreview data={dataWithMissingCells} onInteraction={jest.fn()} />);
    const emDashes = screen.getAllByText('—');
    expect(emDashes.length).toBeGreaterThan(0);
  });

  it('displays empty state when no headers provided', () => {
    const emptyData = {
      title: 'Empty Matrix',
      rowHeaders: [],
      columnHeaders: [],
      cells: [],
    };
    render(<MatrixGridPreview data={emptyData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Add row and column headers to create the matrix')).toBeInTheDocument();
  });

  it('displays empty state when only column headers provided', () => {
    const partialData = {
      title: 'Partial Matrix',
      rowHeaders: [],
      columnHeaders: ['Col1', 'Col2'],
      cells: [],
    };
    render(<MatrixGridPreview data={partialData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Add row and column headers to create the matrix')).toBeInTheDocument();
  });

  it('displays empty state when only row headers provided', () => {
    const partialData = {
      title: 'Partial Matrix',
      rowHeaders: ['Row1', 'Row2'],
      columnHeaders: [],
      cells: [[], []],
    };
    render(<MatrixGridPreview data={partialData} onInteraction={jest.fn()} />);
    expect(screen.getByText('Add row and column headers to create the matrix')).toBeInTheDocument();
  });

  it('renders with empty data object', () => {
    const { container } = render(<MatrixGridPreview data={{}} onInteraction={jest.fn()} />);
    expect(container.querySelector('.tpl-matrix-grid')).toBeInTheDocument();
  });

  it('applies correct number of grid columns', () => {
    const { container } = render(<MatrixGridPreview data={mockData} onInteraction={jest.fn()} />);
    const grid = container.querySelector('.tpl-matrix-grid__grid') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('repeat(3, 1fr)');
  });
});

describe('MatrixGridEditor', () => {
  const mockData = {
    title: 'Skills Matrix',
    rowHeaders: ['JavaScript', 'Python'],
    columnHeaders: ['Beginner', 'Advanced'],
    cells: [
      ['Variables', 'Closures'],
      ['Lists', 'Decorators'],
    ],
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without errors', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText(/Skills Matrix/)).toBeInTheDocument();
  });

  it('applies correct BEM editor root class', () => {
    const { container } = render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-matrix-grid-editor')).toBeInTheDocument();
  });

  it('displays current title value', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    const titleInput = screen.getByPlaceholderText(/Skills Matrix/) as HTMLInputElement;
    expect(titleInput.value).toBe('Skills Matrix');
  });

  it('updates title when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const titleInput = screen.getByPlaceholderText(/Skills Matrix/);
    
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');
    
    const titleInputFinal = screen.getByPlaceholderText(/Skills Matrix/) as HTMLInputElement;
    expect(titleInputFinal.value).toBe('New Title');
  });

  it('renders section headers', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByText('Column Headers')).toBeInTheDocument();
    expect(screen.getByText('Row Headers')).toBeInTheDocument();
    expect(screen.getByText('Cell Data')).toBeInTheDocument();
  });

  it('renders all column header inputs', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Beginner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Advanced')).toBeInTheDocument();
  });

  it('renders all row header inputs', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Python')).toBeInTheDocument();
  });

  it('updates column header when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const columnInput = screen.getByDisplayValue('Beginner');
    
    await user.clear(columnInput);
    await user.type(columnInput, 'Novice');
    
    const columnInputFinal = screen.getByDisplayValue('Novice');
    expect(columnInputFinal).toBeInTheDocument();
  });

  it('updates row header when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const rowInput = screen.getByDisplayValue('JavaScript');
    
    await user.clear(rowInput);
    await user.type(rowInput, 'TypeScript');
    
    const rowInputFinal = screen.getByDisplayValue('TypeScript');
    expect(rowInputFinal).toBeInTheDocument();
  });

  it('adds new column when add button clicked', async () => {
    const user = userEvent.setup();
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    const addButton = screen.getByText('+ Add Column');
    
    await user.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        columnHeaders: ['Beginner', 'Advanced', ''],
        cells: [
          ['Variables', 'Closures', ''],
          ['Lists', 'Decorators', ''],
        ],
      }),
    });
  });

  it('adds new row when add button clicked', async () => {
    const user = userEvent.setup();
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    const addButton = screen.getByText('+ Add Row');
    
    await user.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rowHeaders: ['JavaScript', 'Python', ''],
        cells: [
          ['Variables', 'Closures'],
          ['Lists', 'Decorators'],
          ['', ''],
        ],
      }),
    });
  });

  it('removes column when remove button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    const columnSection = container.querySelectorAll('.tpl-matrix-grid-editor__headers')[0];
    const removeButtons = columnSection.querySelectorAll('.tpl-matrix-grid-editor__remove-btn');
    
    await user.click(removeButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        columnHeaders: ['Advanced'],
        cells: [
          ['Closures'],
          ['Decorators'],
        ],
      }),
    });
  });

  it('removes row when remove button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    const rowSection = container.querySelectorAll('.tpl-matrix-grid-editor__headers')[1];
    const removeButtons = rowSection.querySelectorAll('.tpl-matrix-grid-editor__remove-btn');
    
    await user.click(removeButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      data: expect.objectContaining({
        rowHeaders: ['Python'],
        cells: [['Lists', 'Decorators']],
      }),
    });
  });

  it('renders cell inputs for each row', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('Variables')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Closures')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lists')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Decorators')).toBeInTheDocument();
  });

  it('updates cell value when changed', async () => {
    const user = userEvent.setup();
    const onChangeSpy = jest.fn();
    render(<EditorTestWrapper initialData={mockData} onChangeSpy={onChangeSpy} />);
    const cellInput = screen.getByDisplayValue('Variables');
    
    await user.clear(cellInput);
    await user.type(cellInput, 'Constants');
    
    const cellInputFinal = screen.getByDisplayValue('Constants');
    expect(cellInputFinal).toBeInTheDocument();
  });

  it('does not render cell data section when no headers', () => {
    const emptyData = {
      title: 'Empty',
      rowHeaders: [],
      columnHeaders: [],
      cells: [],
    };
    render(<MatrixGridEditor data={emptyData} onChange={mockOnChange} />);
    expect(screen.queryByText('Cell Data')).not.toBeInTheDocument();
  });

  it('renders with empty data object', () => {
    const { container } = render(<MatrixGridEditor data={{}} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-matrix-grid-editor')).toBeInTheDocument();
  });

  it('displays help text in data section', () => {
    render(<MatrixGridEditor data={mockData} onChange={mockOnChange} />);
    expect(screen.getByText('Fill in values for each cell in the grid')).toBeInTheDocument();
  });
});
