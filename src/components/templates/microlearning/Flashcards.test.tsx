import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlashcardsEditor, FlashcardsPreview } from './Flashcards';

const flashcardsData = {
  title: 'HTML Basics',
  cards: [
    { id: 'fc-1', front: 'What is HTML?', back: 'Markup language' },
    { id: 'fc-2', front: 'What is CSS?', back: 'Stylesheet language' },
  ],
};

describe('FlashcardsPreview', () => {
  test('renders first card front', () => {
    render(<FlashcardsPreview data={flashcardsData} />);
    expect(screen.getByText('What is HTML?')).toBeInTheDocument();
  });

  test('flip reveals back side content', () => {
    render(<FlashcardsPreview data={flashcardsData} />);
    fireEvent.click(screen.getByRole('button', { name: /flip card/i }));
    expect(screen.getByText('Markup language')).toBeInTheDocument();
  });

  test('next moves to next card and resets to front', () => {
    render(<FlashcardsPreview data={flashcardsData} />);
    fireEvent.click(screen.getByRole('button', { name: /flip card/i }));
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByText('What is CSS?')).toBeInTheDocument();
  });

  test('completion triggers on final finish', () => {
    const onComplete = jest.fn();
    render(<FlashcardsPreview data={flashcardsData} onComplete={onComplete} componentId="flash-1" />);

    fireEvent.click(screen.getByRole('button', { name: /flip card/i }));
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    fireEvent.click(screen.getByRole('button', { name: /flip card/i }));
    fireEvent.click(screen.getByRole('button', { name: /^finish$/i }));

    expect(onComplete).toHaveBeenCalledWith('flash-1');
  });

  test('requireFlipBeforeNext blocks next until flip', () => {
    render(<FlashcardsPreview data={{ ...flashcardsData, requireFlipBeforeNext: true }} />);
    expect(screen.getByRole('button', { name: /^next$/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /flip card/i }));
    expect(screen.getByRole('button', { name: /^next$/i })).not.toBeDisabled();
  });
});

describe('FlashcardsEditor', () => {
  test('calls onChange when title updates', () => {
    const onChange = jest.fn();
    render(<FlashcardsEditor data={flashcardsData} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue('HTML Basics'), { target: { value: 'Web Basics' } });
    expect(onChange).toHaveBeenCalled();
  });
});
