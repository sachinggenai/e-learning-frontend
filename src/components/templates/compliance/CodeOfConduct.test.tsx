import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CodeOfConductEditor, CodeOfConductPreview, CodeOfConductData } from './CodeOfConduct';

const mockData: CodeOfConductData = {
  title: 'Code of Conduct',
  requireAllSectionsViewed: true,
  quickCheckEnabled: true,
  sections: [
    { id: 's1', title: 'Respect', principles: [{ id: 'p1', title: 'Be respectful', description: 'Treat peers with respect.' }] },
    { id: 's2', title: 'Integrity', principles: [{ id: 'p2', title: 'Be honest', description: 'Report issues transparently.' }] },
  ],
};

describe('CodeOfConductPreview', () => {
  test('emits section and principle events', () => {
    const onInteraction = jest.fn();
    render(<CodeOfConductPreview data={mockData} onInteraction={onInteraction} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Integrity' }));
    fireEvent.click(screen.getByRole('button', { name: /be honest/i }));

    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'conduct_section_opened' }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'principle_viewed' }));
  });

  test('requires view-all + quick check before completion', () => {
    const onInteraction = jest.fn();
    render(<CodeOfConductPreview data={mockData} onInteraction={onInteraction} />);

    const complete = screen.getByRole('button', { name: /mark complete/i });
    expect(complete).toBeDisabled();

    fireEvent.click(screen.getByRole('tab', { name: 'Integrity' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /i understand these conduct expectations/i }));
    expect(complete).toBeEnabled();
  });
});

describe('CodeOfConductEditor', () => {
  test('updates title', () => {
    const onChange = jest.fn();
    render(<CodeOfConductEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('Code of Conduct'), { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalled();
  });
});
