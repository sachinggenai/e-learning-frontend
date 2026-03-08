/**
 * Infographic Component Tests
 * Category: media-rich
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InfographicPreview, InfographicEditor } from './Infographic';

describe('InfographicPreview', () => {
  const defaultData = {
    title: 'Test Infographic',
    subtitle: 'Test subtitle',
    layout: 'vertical',
    sections: [
      {
        id: 'sec1',
        icon: '📊',
        heading: 'Section 1',
        body: 'Section 1 body text',
        statValue: '42%',
        statLabel: 'Growth',
        color: '#3b82f6',
      },
      {
        id: 'sec2',
        icon: '📈',
        heading: 'Section 2',
        body: 'Section 2 body text',
        statValue: '100',
        statLabel: 'Users',
        color: '#10b981',
      },
    ],
  };

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByRole('region', { name: /infographic content/i })).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByText('Test Infographic')).toBeInTheDocument();
  });

  test('renders subtitle when provided', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  test('does not render title when not provided', () => {
    const dataWithoutTitle = { ...defaultData, title: undefined };
    render(<InfographicPreview data={dataWithoutTitle} />);
    expect(screen.queryByText('Test Infographic')).not.toBeInTheDocument();
  });

  test('does not render subtitle when not provided', () => {
    const dataWithoutSubtitle = { ...defaultData, subtitle: undefined };
    render(<InfographicPreview data={dataWithoutSubtitle} />);
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
  });

  test('renders all sections', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  test('renders section icons', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('📈')).toBeInTheDocument();
  });

  test('renders stat values and labels', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  test('renders section body text', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByText('Section 1 body text')).toBeInTheDocument();
    expect(screen.getByText('Section 2 body text')).toBeInTheDocument();
  });

  test('renders empty when no sections provided', () => {
    const dataWithoutSections = { ...defaultData, sections: [] };
    render(<InfographicPreview data={dataWithoutSections} />);
    const list = screen.getByRole('list');
    expect(list.children.length).toBe(0);
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<InfographicPreview data={defaultData} />);
    expect(container.querySelector('.tpl-infographic')).toBeInTheDocument();
  });

  test('applies correct BEM classes for vertical layout', () => {
    const { container } = render(<InfographicPreview data={defaultData} />);
    const sectionsContainer = container.querySelector('.tpl-infographic__sections');
    expect(sectionsContainer).toBeInTheDocument();
    expect(sectionsContainer).not.toHaveClass('tpl-infographic__sections--grid');
  });

  test('applies correct BEM classes for grid layout', () => {
    const gridData = { ...defaultData, layout: 'grid' };
    const { container } = render(<InfographicPreview data={gridData} />);
    const sectionsContainer = container.querySelector('.tpl-infographic__sections--grid');
    expect(sectionsContainer).toBeInTheDocument();
  });

  test('applies correct BEM classes for section elements', () => {
    const { container } = render(<InfographicPreview data={defaultData} />);
    expect(container.querySelector('.tpl-infographic__section')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic__icon')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic__stat-value')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic__stat-label')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic__heading')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic__body')).toBeInTheDocument();
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('has proper ARIA role for main container', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  test('sections container has list role', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('each section has listitem role', () => {
    render(<InfographicPreview data={defaultData} />);
    const listitems = screen.getAllByRole('listitem');
    expect(listitems.length).toBe(2);
  });

  test('sections have proper ARIA labels', () => {
    render(<InfographicPreview data={defaultData} />);
    expect(screen.getByLabelText('Section 1: Section 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Section 2: Section 2')).toBeInTheDocument();
  });

  test('sections are keyboard accessible (tabIndex)', () => {
    const { container } = render(<InfographicPreview data={defaultData} />);
    const sections = container.querySelectorAll('.tpl-infographic__section');
    sections.forEach(section => {
      expect(section).toHaveAttribute('tabIndex', '0');
    });
  });

  test('icons have aria-hidden attribute', () => {
    const { container } = render(<InfographicPreview data={defaultData} />);
    const icons = container.querySelectorAll('.tpl-infographic__icon');
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ─── Layout Tests ─────────────────────────────────────────────

  test('properly handles vertical layout', () => {
    const verticalData = { ...defaultData, layout: 'vertical' };
    const { container } = render(<InfographicPreview data={verticalData} />);
    const sectionsContainer = container.querySelector('.tpl-infographic__sections');
    expect(sectionsContainer).not.toHaveClass('tpl-infographic__sections--grid');
  });

  test('properly handles grid layout', () => {
    const gridData = { ...defaultData, layout: 'grid' };
    const { container } = render(<InfographicPreview data={gridData} />);
    const sectionsContainer = container.querySelector('.tpl-infographic__sections--grid');
    expect(sectionsContainer).toBeInTheDocument();
  });

  test('uses vertical layout as default when layout not specified', () => {
    const dataWithoutLayout = { ...defaultData, layout: undefined };
    const { container } = render(<InfographicPreview data={dataWithoutLayout} />);
    const sectionsContainer = container.querySelector('.tpl-infographic__sections');
    expect(sectionsContainer).not.toHaveClass('tpl-infographic__sections--grid');
  });
});

describe('InfographicEditor', () => {
  const mockOnChange = jest.fn();

  const defaultData = {
    title: 'Test Infographic',
    subtitle: 'Test subtitle',
    layout: 'vertical',
    sections: [
      {
        id: 'sec1',
        icon: '📊',
        heading: 'Section 1',
        body: 'Section 1 body text',
        statValue: '42%',
        statLabel: 'Growth',
        color: '#3b82f6',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering Tests ────────────────────────────────────────

  test('renders without crashing', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  test('renders all main input fields', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Subtitle')).toBeInTheDocument();
    expect(screen.getByLabelText('Layout')).toBeInTheDocument();
  });

  test('displays current values in main fields', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('Test Infographic');
    expect(screen.getByLabelText('Subtitle')).toHaveValue('Test subtitle');
    expect(screen.getByLabelText('Layout')).toHaveValue('vertical');
  });

  test('renders section cards', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });

  test('renders add section button', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Add new section')).toBeInTheDocument();
  });

  // ─── BEM Class Tests ─────────────────────────────────────────

  test('applies correct BEM root class', () => {
    const { container } = render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-infographic-editor')).toBeInTheDocument();
  });

  test('applies correct BEM classes for fields', () => {
    const { container } = render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelectorAll('.tpl-infographic-editor__field').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-infographic-editor__label').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tpl-infographic-editor__input').length).toBeGreaterThan(0);
  });

  test('applies correct BEM classes for section cards', () => {
    const { container } = render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(container.querySelector('.tpl-infographic-editor__section-card')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic-editor__section-header')).toBeInTheDocument();
    expect(container.querySelector('.tpl-infographic-editor__remove-btn')).toBeInTheDocument();
  });

  // ─── Interaction Tests ───────────────────────────────────────

  test('calls onChange when title is updated', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        title: 'New Title',
      },
    });
  });

  test('calls onChange when subtitle is updated', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const subtitleInput = screen.getByLabelText('Subtitle');

    fireEvent.change(subtitleInput, { target: { value: 'New Subtitle' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        subtitle: 'New Subtitle',
      },
    });
  });

  test('calls onChange when layout is changed', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const layoutSelect = screen.getByLabelText('Layout');

    fireEvent.change(layoutSelect, { target: { value: 'grid' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        layout: 'grid',
      },
    });
  });

  test('calls onChange when section heading is updated', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const headingInput = screen.getByLabelText('Heading');

    fireEvent.change(headingInput, { target: { value: 'New Heading' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        sections: [
          {
            ...defaultData.sections[0],
            heading: 'New Heading',
          },
        ],
      },
    });
  });

  test('adds new section when add button is clicked', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const addButton = screen.getByLabelText('Add new section');

    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
    const calledData = mockOnChange.mock.calls[0][0].data;
    expect(calledData.sections.length).toBe(2);
  });

  test('removes section when remove button is clicked', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const removeButton = screen.getByLabelText('Remove section 1');

    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      data: {
        ...defaultData,
        sections: [],
      },
    });
  });

  test('handles empty data gracefully', () => {
    render(<InfographicEditor data={{}} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Subtitle')).toHaveValue('');
    expect(screen.getByLabelText('Layout')).toHaveValue('vertical');
  });

  test('renders multiple sections correctly', () => {
    const multiSectionData = {
      ...defaultData,
      sections: [
        ...defaultData.sections,
        {
          id: 'sec2',
          icon: '📈',
          heading: 'Section 2',
          body: 'Body 2',
          color: '#10b981',
        },
      ],
    };
    render(<InfographicEditor data={multiSectionData} onChange={mockOnChange} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  // ─── Accessibility Tests ─────────────────────────────────────

  test('all inputs have proper labels with htmlFor', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toHaveAttribute('id', 'infographic-title');
  });

  test('all inputs have aria-label attributes', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-label', 'Title');
    expect(screen.getByLabelText('Subtitle')).toHaveAttribute('aria-label', 'Subtitle');
    expect(screen.getByLabelText('Layout')).toHaveAttribute('aria-label', 'Layout');
  });

  test('buttons have proper aria-labels', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    expect(screen.getByLabelText('Add new section')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove section 1')).toBeInTheDocument();
  });

  test('buttons have proper type attribute', () => {
    render(<InfographicEditor data={defaultData} onChange={mockOnChange} />);
    const addButton = screen.getByLabelText('Add new section');
    const removeButton = screen.getByLabelText('Remove section 1');
    expect(addButton).toHaveAttribute('type', 'button');
    expect(removeButton).toHaveAttribute('type', 'button');
  });
});
