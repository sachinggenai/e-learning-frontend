import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SkillMasteryReportEditor, SkillMasteryReportPreview, SkillMasteryReportData } from './SkillMasteryReport';

const mockData: SkillMasteryReportData = {
  title: 'Skill Mastery',
  lowThreshold: 50,
  highThreshold: 80,
  items: [
    { id: 's1', skill: 'Communication', score: 84 },
    { id: 's2', skill: 'Problem Solving', score: 45 },
  ],
  displayMode: 'list',
};

describe('SkillMasteryReportPreview', () => {
  test('renders sorted skills and scores', () => {
    render(<SkillMasteryReportPreview data={mockData} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Communication');
    expect(screen.getByText('84%')).toBeInTheDocument();
  });

  test('shows empty state', () => {
    render(<SkillMasteryReportPreview data={{ items: [] }} />);
    expect(screen.getByText('No skills configured yet.')).toBeInTheDocument();
  });

  test('fires skill and gap focus events', () => {
    const onInteraction = jest.fn();
    render(<SkillMasteryReportPreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Communication' }));
    fireEvent.click(screen.getByRole('button', { name: /Focus This Gap/i }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'skill_viewed' }));
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({ interactionType: 'gap_focus_selected' }));
  });
});

describe('SkillMasteryReportEditor', () => {
  test('adds skill row', () => {
    const onChange = jest.fn();
    render(<SkillMasteryReportEditor data={mockData} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Skill/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
