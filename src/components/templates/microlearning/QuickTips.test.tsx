import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuickTipsEditor, QuickTipsPreview } from './QuickTips';

const tipsData = {
  heading: 'Quick Tips',
  subtitle: 'Before you begin',
  allowMarkDone: true,
  showPriorityBadge: true,
  tips: [
    { id: 'qt-1', title: 'Save often', detail: 'Use Ctrl+S frequently.', priority: 'high' as const },
    { id: 'qt-2', title: 'Name files clearly', detail: 'Use descriptive names.', priority: 'medium' as const },
  ],
};

describe('QuickTipsPreview', () => {
  test('renders heading and list', () => {
    render(<QuickTipsPreview data={tipsData} />);
    expect(screen.getByText('Quick Tips')).toBeInTheDocument();
    expect(screen.getByText('Save often')).toBeInTheDocument();
  });

  test('expands and collapses details', () => {
    render(<QuickTipsPreview data={tipsData} />);

    fireEvent.click(screen.getByRole('button', { name: /save often/i }));
    expect(screen.getByText('Use Ctrl+S frequently.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /save often/i }));
    expect(screen.queryByText('Use Ctrl+S frequently.')).not.toBeInTheDocument();
  });

  test('marking all done triggers completion', () => {
    const onComplete = jest.fn();
    render(<QuickTipsPreview data={tipsData} onComplete={onComplete} componentId="qt-comp" />);

    const checks = screen.getAllByRole('checkbox');
    fireEvent.click(checks[0]);
    fireEvent.click(checks[1]);

    expect(onComplete).toHaveBeenCalledWith('qt-comp');
  });
});

describe('QuickTipsEditor', () => {
  test('calls onChange when heading updates', () => {
    const onChange = jest.fn();
    render(<QuickTipsEditor data={tipsData} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue('Quick Tips'), { target: { value: 'Better Tips' } });
    expect(onChange).toHaveBeenCalled();
  });
});
