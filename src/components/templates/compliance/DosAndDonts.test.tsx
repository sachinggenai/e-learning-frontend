import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DosAndDontsEditor, DosAndDontsPreview, DosAndDontsData } from './DosAndDonts';

const mockData: DosAndDontsData = {
  title: "Do's and Don'ts",
  dos: [{ id: 'd1', text: 'Report incidents', rationale: 'Fast escalation', reference: 'POL-11' }],
  donts: [{ id: 'dn1', text: 'Share passwords' }],
  layout: 'columns',
};

describe('DosAndDontsPreview', () => {
  test('renders both sections', () => {
    render(<DosAndDontsPreview data={mockData} />);
    expect(screen.getByText('Do')).toBeInTheDocument();
    expect(screen.getByText('Do Not')).toBeInTheDocument();
  });

  test('emits item_expanded when details open', () => {
    const onInteraction = jest.fn();
    render(<DosAndDontsPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /show details/i }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'item_expanded' }));
  });
});

describe('DosAndDontsEditor', () => {
  test('updates title', () => {
    const onChange = jest.fn();
    render(<DosAndDontsEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Do's and Don'ts"), { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalled();
  });
});
