import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClickRevealPreview, ClickRevealEditor } from './ClickReveal';

describe('ClickReveal Component', () => {
  // ─── Default Mock Data ───────────────────────────────────────
  const mockData = {
    title: 'Test Concepts',
    instructions: 'Click to reveal',
    items: [
      { id: '1', label: 'Item 1', content: 'Content for item 1' },
      { id: '2', label: 'Item 2', content: 'Content for item 2' },
      { id: '3', label: 'Item 3', content: 'Content for item 3' },
    ],
    columns: 3,
  };

  const mockProps = {
    data: mockData,
    componentId: 'test-component',
    componentType: 'click-reveal',
  };

  // ═══════════════════════════════════════════════════════════════
  // PREVIEW TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('ClickRevealPreview', () => {
    it('renders title and instructions', () => {
      render(<ClickRevealPreview {...mockProps} />);
      expect(screen.getByText('Test Concepts')).toBeInTheDocument();
      expect(screen.getByText('Click to reveal')).toBeInTheDocument();
    });

    it('renders all items with correct labels', () => {
      render(<ClickRevealPreview {...mockProps} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      render(<ClickRevealPreview {...mockProps} />);
      expect(screen.queryByText('Content for item 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for item 2')).not.toBeInTheDocument();
    });

    it('reveals content when item is clicked', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const firstItem = screen.getByText('Item 1').closest('[role="button"]');
      fireEvent.click(firstItem!);
      expect(screen.getByText('Content for item 1')).toBeInTheDocument();
    });

    it('applies revealed state class to clicked items', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const firstItem = screen.getByText('Item 1').closest('[role="button"]');
      fireEvent.click(firstItem!);
      expect(firstItem).toHaveClass('tpl-click-reveal__card--revealed');
    });

    it('hides content when item is clicked again', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const firstItem = screen.getByText('Item 1').closest('[role="button"]');
      fireEvent.click(firstItem!);
      expect(screen.getByText('Content for item 1')).toBeInTheDocument();
      fireEvent.click(firstItem!);
      expect(screen.queryByText('Content for item 1')).not.toBeInTheDocument();
    });

    it('updates progress counter', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const progressElement = document.querySelector('.tpl-click-reveal__progress');
      expect(progressElement?.textContent).toMatch(/0\s*\/\s*3\s*revealed/i);
      
      const firstItem = screen.getByText('Item 1').closest('[role="button"]');
      fireEvent.click(firstItem!);
      expect(progressElement?.textContent).toMatch(/1\s*\/\s*3\s*revealed/i);
    });

    it('supports keyboard navigation with Enter key', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const firstItem = screen.getByText('Item 1').closest('[role="button"]')!;
      fireEvent.keyDown(firstItem, { key: 'Enter' });
      expect(screen.getByText('Content for item 1')).toBeInTheDocument();
    });

    it('supports keyboard navigation with Space key', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const firstItem = screen.getByText('Item 1').closest('[role="button"]')!;
      fireEvent.keyDown(firstItem, { key: ' ' });
      expect(screen.getByText('Content for item 1')).toBeInTheDocument();
    });

    it('calls onInteraction callback when item is revealed', () => {
      const onInteraction = jest.fn();
      render(<ClickRevealPreview {...mockProps} onInteraction={onInteraction} />);
      
      const firstItem = screen.getByText('Item 1').closest('[role="button"]');
      fireEvent.click(firstItem!);
      
      expect(onInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          interactionType: 'reveal',
          interactionId: '1',
          value: true,
        })
      );
    });

    it('calls onComplete when all items are revealed', () => {
      const onComplete = jest.fn();
      render(<ClickRevealPreview {...mockProps} onComplete={onComplete} />);
      
      // Reveal all items
      const items = screen.getAllByRole('button');
      items.forEach(item => fireEvent.click(item));
      
      expect(onComplete).toHaveBeenCalled();
    });

    it('applies grid column class based on columns prop', () => {
      const { container } = render(<ClickRevealPreview {...mockProps} />);
      const grid = container.querySelector('.tpl-click-reveal__grid');
      expect(grid).toHaveClass('tpl-click-reveal__grid--3col');
    });

    it('handles 2-column layout', () => {
      const { container } = render(
        <ClickRevealPreview {...mockProps} data={{ ...mockData, columns: 2 }} />
      );
      const grid = container.querySelector('.tpl-click-reveal__grid');
      expect(grid).toHaveClass('tpl-click-reveal__grid--2col');
    });

    it('handles empty items gracefully', () => {
      const emptyData = { ...mockData, items: [] };
      render(<ClickRevealPreview {...mockProps} data={emptyData} />);
      const progressElement = document.querySelector('.tpl-click-reveal__progress');
      expect(progressElement?.textContent).toMatch(/0\s*\/\s*0\s*revealed/i);
    });

    it('sets aria-expanded attribute correctly', () => {
      render(<ClickRevealPreview {...mockProps} />);
      const firstItem = screen.getByText('Item 1').closest('[role="button"]');
      
      expect(firstItem).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(firstItem!);
      expect(firstItem).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // EDITOR TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('ClickRevealEditor', () => {
    const mockOnChange = jest.fn();
    const editorProps = {
      data: mockData,
      onChange: mockOnChange,
      componentId: 'test-component',
      componentType: 'click-reveal',
    };

    beforeEach(() => {
      mockOnChange.mockClear();
    });

    it('renders title and instruction inputs', () => {
      render(<ClickRevealEditor {...editorProps} />);
      expect(screen.getByDisplayValue('Test Concepts')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Click to reveal')).toBeInTheDocument();
    });

    it('updates title when input changes', () => {
      render(<ClickRevealEditor {...editorProps} />);
      const titleInput = screen.getByDisplayValue('Test Concepts') as HTMLInputElement;
      
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ title: 'New Title' }),
        })
      );
    });

    it('renders all items', () => {
      render(<ClickRevealEditor {...editorProps} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('adds new item when add button is clicked', () => {
      render(<ClickRevealEditor {...editorProps} />);
      const addButton = screen.getByText('+ Add Item');
      fireEvent.click(addButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({ label: '', content: '' }),
            ]),
          }),
        })
      );
    });

    it('removes item when delete button is clicked', () => {
      render(<ClickRevealEditor {...editorProps} />);
      const deleteButtons = screen.getAllByLabelText(/delete item/i);
      fireEvent.click(deleteButtons[0]);
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            items: expect.arrayContaining([
              expect.not.objectContaining(mockData.items[0]),
            ]),
          }),
        })
      );
    });

    it('updates item label', () => {
      render(<ClickRevealEditor {...editorProps} />);
      const labelInputs = screen.getAllByDisplayValue(/Item/) as HTMLInputElement[];
      
      fireEvent.change(labelInputs[0], { target: { value: 'Updated Label' } });
      
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({ label: 'Updated Label' }),
            ]),
          }),
        })
      );
    });
  });
});
