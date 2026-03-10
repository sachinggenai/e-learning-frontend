import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuditChecklistEditor, AuditChecklistPreview, AuditChecklistData } from './AuditChecklist';

const mockData: AuditChecklistData = {
  title: 'Audit Checklist',
  reviewerName: 'Manager',
  items: [
    { id: 'i1', label: 'Review logs', required: true, completed: false },
    { id: 'i2', label: 'Upload evidence', required: false, completed: false },
  ],
};

describe('AuditChecklistPreview', () => {
  test('submits only after required item is complete', () => {
    const onInteraction = jest.fn();
    render(<AuditChecklistPreview data={mockData} onInteraction={onInteraction} />);

    const submit = screen.getByRole('button', { name: /submit checklist/i });
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'checklist_submitted' }));
  });

  test('emits checklist_note_added', () => {
    const onInteraction = jest.fn();
    render(<AuditChecklistPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.change(screen.getAllByPlaceholderText(/reviewer notes/i)[0], { target: { value: 'Looks good' } });
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'checklist_note_added' }));
  });
});

describe('AuditChecklistEditor', () => {
  test('updates title', () => {
    const onChange = jest.fn();
    render(<AuditChecklistEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('Audit Checklist'), { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalled();
  });
});
