import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuizGameEditor, QuizGamePreview } from './QuizGame';

describe('QuizGame', () => {
  const baseData = {
    maxLives: 2,
    timeLimit: 0,
    questions: [
      {
        id: 'q1',
        question: '2 + 2 = ?',
        options: ['3', '4', '5', '6'],
        correctIndex: 1,
        explanation: '2 plus 2 is 4',
        points: 10,
      },
    ],
  };

  it('shows feedback for a correct answer', () => {
    render(<QuizGamePreview componentId="quiz" data={baseData} />);
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    expect(screen.getByText(/Correct answer/i)).toBeInTheDocument();
  });

  it('editor can add a question', () => {
    const onChange = jest.fn();
    render(<QuizGameEditor data={baseData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
