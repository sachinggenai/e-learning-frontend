import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CaseStudyPreview, CaseStudyEditor } from './CaseStudy';

describe('CaseStudy', () => {
  const mockData = {
    title: 'Customer Escalation Case',
    subtitle: 'Review and respond to the incident',
    context: 'A major customer has reported repeated outages over two days.',
    prompts: [
      { id: 'p1', question: 'What is your immediate response?', sampleAnswer: 'Acknowledge, triage, and communicate timeline.' },
      { id: 'p2', question: 'What preventive measures would you suggest?', sampleAnswer: 'Implement monitoring thresholds and runbooks.' },
    ],
  };

  it('renders themed preview root and heading content', () => {
    render(<CaseStudyPreview data={mockData} />);

    expect(screen.getByTestId('case-study-preview')).toHaveClass('tpl-case-study');
    expect(screen.getByText('Customer Escalation Case')).toBeInTheDocument();
    expect(screen.getByText('📋 Background')).toBeInTheDocument();
  });

  it('submit is disabled until all prompts are answered', () => {
    render(<CaseStudyPreview data={mockData} />);

    const submitButton = screen.getByRole('button', { name: 'Submit Analysis' });
    expect(submitButton).toBeDisabled();

    const inputs = screen.getAllByPlaceholderText('Type your analysis here…');
    fireEvent.change(inputs[0], { target: { value: 'First answer' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(inputs[1], { target: { value: 'Second answer' } });
    expect(submitButton).toBeEnabled();
  });

  it('submits and calls onInteraction/onComplete', () => {
    const onInteraction = jest.fn();
    const onComplete = jest.fn();

    render(<CaseStudyPreview data={mockData} onInteraction={onInteraction} onComplete={onComplete} />);

    const inputs = screen.getAllByPlaceholderText('Type your analysis here…');
    fireEvent.change(inputs[0], { target: { value: 'First answer' } });
    fireEvent.change(inputs[1], { target: { value: 'Second answer' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }));

    expect(onInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        interactionType: 'case-study-submit',
        interactionId: 'submit',
      })
    );
    expect(onComplete).toHaveBeenCalledWith('');
  });

  it('shows sample answer toggle after submit', () => {
    render(<CaseStudyPreview data={mockData} />);

    const inputs = screen.getAllByPlaceholderText('Type your analysis here…');
    fireEvent.change(inputs[0], { target: { value: 'First answer' } });
    fireEvent.change(inputs[1], { target: { value: 'Second answer' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }));

    const toggle = screen.getAllByRole('button', { name: /sample answer/i })[0];
    fireEvent.click(toggle);

    expect(screen.getByText('Acknowledge, triage, and communicate timeline.')).toHaveClass('tpl-case-study__sample-answer');
  });

  it('renders themed editor root', () => {
    render(<CaseStudyEditor data={mockData} onChange={jest.fn()} />);
    expect(screen.getByTestId('case-study-editor')).toHaveClass('tpl-case-study-editor');
  });

  it('editor add prompt triggers onChange', () => {
    const onChange = jest.fn();
    render(<CaseStudyEditor data={mockData} onChange={onChange} />);

    fireEvent.click(screen.getByText('+ Add Analysis Prompt'));
    expect(onChange).toHaveBeenCalled();
  });

  it('editor title input triggers onChange', () => {
    const onChange = jest.fn();
    render(<CaseStudyEditor data={mockData} onChange={onChange} />);

    const titleInput = screen.getByDisplayValue('Customer Escalation Case');
    fireEvent.change(titleInput, { target: { value: 'Updated Case' } });

    expect(onChange).toHaveBeenCalled();
  });
});
