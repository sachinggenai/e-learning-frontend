import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlipCardsPreview, FlipCardsEditor } from './FlipCards';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

describe('FlipCards Component', () => {
  const mockData = {
    title: 'Learn with Flip Cards',
    columns: 3,
    cards: [
      { id: 'card-1', front: 'Question 1', back: 'Answer 1', imageUrl: '' },
      { id: 'card-2', front: 'Question 2', back: 'Answer 2', imageUrl: '' },
      { id: 'card-3', front: 'Question 3', back: 'Answer 3', imageUrl: '' },
    ],
  };

  // ─── Preview Tests ────────────────────────────────────────

  describe('FlipCardsPreview - Basic Render', () => {
    it('should render title', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.getByTestId('title')).toHaveTextContent('Learn with Flip Cards');
    });

    it('should render grid of cards', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.getByTestId('cards-grid')).toBeInTheDocument();
      const cards = screen.getAllByTestId(/^flip-card-/);
      expect(cards.length).toBe(3);
    });

    it('should render card front content initially', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
      expect(screen.getByText('Question 3')).toBeInTheDocument();
    });

    it('should show progress indicator', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.getByTestId('flip-progress')).toHaveTextContent('0 / 3 cards flipped');
    });

    it('should render card with image when provided', () => {
      const dataWithImage = {
        ...mockData,
        cards: [
          {
            id: 'card-1',
            front: 'Question 1',
            back: 'Answer 1',
            imageUrl: 'https://example.com/image.jpg',
          },
        ],
      };

      const props: ComponentPreviewProps = {
        data: dataWithImage,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const image = screen.getByAltText('');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });

  describe('FlipCardsPreview - Interaction', () => {
    it('should flip card on click', async () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.click(card);

      expect(card).toHaveClass('tpl-flip-cards__card--flipped');
    });

    it('should show card back content after flip', async () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByTestId('card-back-card-1')).toBeInTheDocument();
      });
    });

    it('should call onInteraction when card is flipped', async () => {
      const mockOnInteraction = jest.fn();
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: mockOnInteraction,
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.click(card);

      await waitFor(() => {
        expect(mockOnInteraction).toHaveBeenCalledWith(
          expect.objectContaining({
            interactionType: 'flip',
            interactionId: 'card-1',
            value: true,
          })
        );
      });
    });

    it('should update progress when card is flipped', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.click(card);

      expect(screen.getByTestId('flip-progress')).toHaveTextContent('1 / 3 cards flipped');
    });

    it('should handle keyboard flip (Enter key)', async () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(card).toHaveClass('tpl-flip-cards__card--flipped');
    });

    it('should handle keyboard flip (Space key)', async () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.keyDown(card, { key: ' ' });

      expect(card).toHaveClass('tpl-flip-cards__card--flipped');
    });

    it('should call onComplete when all cards are flipped', async () => {
      const mockOnComplete = jest.fn();
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: mockOnComplete,
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const cards = screen.getAllByTestId(/^flip-card-/);
      cards.forEach(card => fireEvent.click(card));

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith('');
      });
    });
  });

  // ─── Editor Tests ──────────────────────────────────────────

  describe('FlipCardsEditor - Basic Render', () => {
    it('should render title input', () => {
      const props: ComponentEditorProps = {
        data: mockData,
        onChange: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
      expect(titleInput).toBeInTheDocument();
      expect(titleInput.value).toBe('Learn with Flip Cards');
    });

    it('should render columns select', () => {
      const props: ComponentEditorProps = {
        data: mockData,
        onChange: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const columnsSelect = screen.getByTestId('columns-select') as HTMLSelectElement;
      expect(columnsSelect).toBeInTheDocument();
      expect(columnsSelect.value).toBe('3');
    });

    it('should render all card editors', () => {
      const props: ComponentEditorProps = {
        data: mockData,
        onChange: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      expect(screen.getByTestId('card-editor-0')).toBeInTheDocument();
      expect(screen.getByTestId('card-editor-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-editor-2')).toBeInTheDocument();
    });

    it('should render add card button', () => {
      const props: ComponentEditorProps = {
        data: mockData,
        onChange: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      expect(screen.getByTestId('add-card-button')).toHaveTextContent('+ Add Card');
    });
  });

  describe('FlipCardsEditor - Card Management', () => {
    it('should add new card when add button is clicked', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      fireEvent.click(screen.getByTestId('add-card-button'));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({ front: '', back: '' }),
            ]),
          }),
        })
      );
    });

    it('should remove card when remove button is clicked', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      fireEvent.click(screen.getByTestId('remove-card-0'));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({ front: 'Question 2' }),
              expect.objectContaining({ front: 'Question 3' }),
            ]),
          }),
        })
      );
    });

    it('should update card front when input changes', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const frontInput = screen.getByTestId('card-front-input-0') as HTMLInputElement;
      fireEvent.change(frontInput, { target: { value: 'New Question' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({ front: 'New Question' }),
            ]),
          }),
        })
      );
    });

    it('should update card back when textarea changes', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const backInput = screen.getByTestId('card-back-input-0') as HTMLTextAreaElement;
      fireEvent.change(backInput, { target: { value: 'New Answer' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({ back: 'New Answer' }),
            ]),
          }),
        })
      );
    });

    it('should update card image URL when input changes', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const imageInput = screen.getByTestId('card-image-input-0') as HTMLInputElement;
      fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({ imageUrl: 'https://example.com/image.jpg' }),
            ]),
          }),
        })
      );
    });

    it('should update title when title input changes', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'New Title',
          }),
        })
      );
    });

    it('should update columns when columns select changes', () => {
      const onChange = jest.fn();
      const props: ComponentEditorProps = {
        data: mockData,
        onChange,
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const columnsSelect = screen.getByTestId('columns-select') as HTMLSelectElement;
      fireEvent.change(columnsSelect, { target: { value: '2' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            columns: 2,
          }),
        })
      );
    });
  });

  // ─── CSS & Styling Tests ──────────────────────────────────

  describe('FlipCards - Styling', () => {
    it('should apply correct CSS classes to container', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const container = screen.getByTestId('flip-cards-preview');
      expect(container).toHaveClass('tpl-flip-cards');
    });

    it('should apply card class to each card', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      expect(card).toHaveClass('tpl-flip-cards__card');
    });

    it('should apply editor CSS classes', () => {
      const props: ComponentEditorProps = {
        data: mockData,
        onChange: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsEditor {...props} />);

      const editor = screen.getByTestId('flip-cards-editor');
      expect(editor).toHaveClass('tpl-flip-cards-editor');
    });

    it('should apply grid CSS class', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const grid = screen.getByTestId('cards-grid');
      expect(grid).toHaveClass('tpl-flip-cards__grid');
    });

    it('should apply flipped state class', () => {
      const props: ComponentPreviewProps = {
        data: mockData,
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      const card = screen.getByTestId('flip-card-card-1');
      fireEvent.click(card);

      expect(card).toHaveClass('tpl-flip-cards__card--flipped');
    });
  });

  // ─── Edge Cases & Additional Tests ────────────────────────

  describe('FlipCards - Edge Cases', () => {
    it('should handle empty card list', () => {
      const props: ComponentPreviewProps = {
        data: { title: 'Empty Cards', columns: 3, cards: [] },
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.getByTestId('flip-cards-preview')).toBeInTheDocument();
      expect(screen.getByTestId('flip-progress')).toHaveTextContent('0 / 0 cards flipped');
    });

    it('should handle single card', () => {
      const props: ComponentPreviewProps = {
        data: {
          title: 'Single Card',
          columns: 3,
          cards: [{ id: 'card-1', front: 'Q', back: 'A', imageUrl: '' }],
        },
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.getByTestId('flip-card-card-1')).toBeInTheDocument();
    });

    it('should handle missing title gracefully', () => {
      const props: ComponentPreviewProps = {
        data: { columns: 3, cards: mockData.cards },
        onInteraction: jest.fn(),
        onComplete: jest.fn(),
        readOnly: false,
      };

      render(<FlipCardsPreview {...props} />);

      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
    });
  });
});
