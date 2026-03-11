import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MicrolearningCardsPreview } from './MicrolearningCards';

const data = {
  heading: 'Daily Security Tips',
  cards: [
    { id: 'mc-1', title: 'Lock screen', body: 'Lock your workstation when you step away.' },
    { id: 'mc-2', title: 'Use MFA', body: 'Enable multi-factor authentication.' },
  ],
  showProgress: true,
};

describe('MicrolearningCardsPreview', () => {
  test('renders heading and first card', () => {
    render(<MicrolearningCardsPreview data={data} />);
    expect(screen.getByText('Daily Security Tips')).toBeInTheDocument();
    expect(screen.getByText('Lock screen')).toBeInTheDocument();
  });

  test('next moves to second card', () => {
    render(<MicrolearningCardsPreview data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByText('Use MFA')).toBeInTheDocument();
  });

  test('previous returns to first card', () => {
    render(<MicrolearningCardsPreview data={data} />);
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^previous$/i }));
    expect(screen.getByText('Lock screen')).toBeInTheDocument();
  });

  test('finish calls onComplete', () => {
    const onComplete = jest.fn();
    render(<MicrolearningCardsPreview data={data} onComplete={onComplete} componentId="mc-comp" />);

    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^finish$/i }));

    expect(onComplete).toHaveBeenCalledWith('mc-comp');
  });

  test('auto advance moves over time', () => {
    jest.useFakeTimers();
    render(<MicrolearningCardsPreview data={{ ...data, autoAdvanceSec: 1 }} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Use MFA')).toBeInTheDocument();
    jest.useRealTimers();
  });
});
