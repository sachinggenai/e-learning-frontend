import { fireEvent, render, screen } from '@testing-library/react';
import { CourseMenuEditor, CourseMenuPreview } from './CourseMenu';

const menuData = {
  title: 'Course Contents',
  currentPageId: 'page-2',
  items: [
    { id: 'mi-1', label: 'Introduction', pageId: 'page-1', icon: '1' },
    {
      id: 'mi-2',
      label: 'Core Module',
      pageId: 'page-2',
      icon: '2',
      children: [{ id: 'mi-2-1', label: 'Lesson 2.1', pageId: 'page-2-1' }],
    },
    { id: 'mi-3', label: 'Section Header' },
  ],
};

describe('CourseMenuPreview', () => {
  it('renders title and items', () => {
    render(
      <CourseMenuPreview
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
      />
    );

    expect(screen.getByText('Course Contents')).toBeInTheDocument();
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Core Module')).toBeInTheDocument();
    expect(screen.getByText('Lesson 2.1')).toBeInTheDocument();
  });

  it('applies active state to current page item', () => {
    render(
      <CourseMenuPreview
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
      />
    );

    const active = screen.getByRole('button', { name: /Core Module/i });
    expect(active).toHaveClass('tpl-course-menu__item--active');
    expect(active).toHaveAttribute('aria-current', 'page');
  });

  it('emits interaction when clickable item is selected', () => {
    const onInteraction = jest.fn();

    render(
      <CourseMenuPreview
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
        onInteraction={onInteraction}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Introduction/i }));

    expect(onInteraction).toHaveBeenCalledWith({
      componentId: 'cmp-course-menu',
      interactionType: 'click',
      interactionId: 'mi-1',
      value: 'page-1',
    });
  });

  it('does not render section headers as buttons', () => {
    render(
      <CourseMenuPreview
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
      />
    );

    expect(screen.queryByRole('button', { name: /Section Header/i })).not.toBeInTheDocument();
    expect(screen.getByText('Section Header')).toBeInTheDocument();
  });

  it('shows empty state when no items are configured', () => {
    render(
      <CourseMenuPreview
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={{ title: 'Course Contents', items: [] }}
      />
    );

    expect(screen.getByText('No menu items added yet.')).toBeInTheDocument();
  });
});

describe('CourseMenuEditor', () => {
  it('renders title input with current value', () => {
    render(
      <CourseMenuEditor
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Menu Title')).toHaveValue('Course Contents');
  });

  it('calls onChange when title is updated', () => {
    const onChange = jest.fn();

    render(
      <CourseMenuEditor
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Menu Title'), {
      target: { value: 'Updated Contents' },
    });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].data.title).toBe('Updated Contents');
  });

  it('adds a new menu item', () => {
    const onChange = jest.fn();

    render(
      <CourseMenuEditor
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={{ title: 'Course Contents', items: [] }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '+ Add Menu Item' }));

    expect(onChange).toHaveBeenCalled();
    const items = onChange.mock.calls[0][0].data.items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toMatch(/^mi-/);
  });

  it('removes an existing item', () => {
    const onChange = jest.fn();

    render(
      <CourseMenuEditor
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Remove item 1'));

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].data.items).toHaveLength(2);
  });

  it('uses BEM classes on root elements', () => {
    const { container } = render(
      <CourseMenuEditor
        componentId="cmp-course-menu"
        componentType="course-menu"
        data={menuData}
        onChange={jest.fn()}
      />
    );

    expect(container.querySelector('.tpl-course-menu-editor')).toBeInTheDocument();
    expect(container.querySelector('.tpl-course-menu-editor__add-btn')).toBeInTheDocument();
  });
});
