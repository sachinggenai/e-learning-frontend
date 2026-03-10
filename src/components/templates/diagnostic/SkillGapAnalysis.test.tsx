import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  SkillGapAnalysisData,
  SkillGapAnalysisEditor,
  SkillGapAnalysisPreview,
} from './SkillGapAnalysis';

const mockData: SkillGapAnalysisData = {
  title: 'My Skill Gaps',
  highGapThreshold: 30,
  showRecommendations: true,
  items: [
    { id: 's1', skill: 'Communication', currentLevel: 40, targetLevel: 80 },
    { id: 's2', skill: 'Coding', currentLevel: 70, targetLevel: 75 },
  ],
};

describe('SkillGapAnalysisPreview', () => {
  test('renders title and skills', () => {
    render(<SkillGapAnalysisPreview data={mockData} />);
    expect(screen.getByText('My Skill Gaps')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
  });

  test('shows high priority badge for large gap', () => {
    render(<SkillGapAnalysisPreview data={mockData} />);
    expect(screen.getByText(/High Priority/)).toBeInTheDocument();
  });

  test('shows progress bars', () => {
    render(<SkillGapAnalysisPreview data={mockData} />);
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  test('shows gap percentage text', () => {
    render(<SkillGapAnalysisPreview data={mockData} />);
    expect(screen.getByText(/Gap: 40%/)).toBeInTheDocument();
  });

  test('shows empty state', () => {
    render(<SkillGapAnalysisPreview data={{ items: [] }} />);
    expect(screen.getByText('No skills configured yet.')).toBeInTheDocument();
  });
});

describe('SkillGapAnalysisEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<SkillGapAnalysisEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Title' } });
    expect(mockOnChange).toHaveBeenCalledWith({ data: expect.objectContaining({ title: 'New Title' }) });
  });

  test('adds a skill', () => {
    render(<SkillGapAnalysisEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Skill/i }));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        items: expect.arrayContaining([expect.objectContaining({ skill: '' })]),
      }),
    }));
  });
});
