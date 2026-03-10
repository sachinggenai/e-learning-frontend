import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PolicyAcknowledgementEditor, PolicyAcknowledgementPreview, PolicyAcknowledgementData } from './PolicyAcknowledgement';

const mockData: PolicyAcknowledgementData = {
  title: 'Security Policy',
  policyText: 'Always lock your workstation.',
  policyVersion: '2026.1',
  acknowledgementLabel: 'I acknowledge this policy',
  requireSignature: true,
};

describe('PolicyAcknowledgementPreview', () => {
  test('emits policy_viewed on render', () => {
    const onInteraction = jest.fn();
    render(<PolicyAcknowledgementPreview data={mockData} onInteraction={onInteraction} />);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'policy_viewed' }));
  });

  test('requires checkbox and signature before submit', () => {
    const onInteraction = jest.fn();
    render(<PolicyAcknowledgementPreview data={mockData} onInteraction={onInteraction} />);

    const submit = screen.getByRole('button', { name: /submit acknowledgement/i });
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(screen.getByPlaceholderText(/type full name/i), { target: { value: 'Alex Parker' } });
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'policy_submitted' }));
  });
});

describe('PolicyAcknowledgementEditor', () => {
  test('updates title', () => {
    const onChange = jest.fn();
    render(<PolicyAcknowledgementEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('Security Policy'), { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalled();
  });
});
