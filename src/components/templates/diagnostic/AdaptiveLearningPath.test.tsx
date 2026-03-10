import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  AdaptiveLearningPathData,
  AdaptiveLearningPathEditor,
  AdaptiveLearningPathPreview,
} from './AdaptiveLearningPath';

const mockData: AdaptiveLearningPathData = {
  title: 'My Learning Path',
  currentNodeId: 'node-2',
  nodes: [
    { id: 'node-1', title: 'Introduction', required: true, estimatedMins: 10 },
    { id: 'node-2', title: 'Core Concepts', required: true, estimatedMins: 20 },
    { id: 'node-3', title: 'Advanced Topics', required: false, estimatedMins: 30 },
  ],
};

describe('AdaptiveLearningPathPreview', () => {
  test('renders title and nodes', () => {
    render(<AdaptiveLearningPathPreview data={mockData} />);
    expect(screen.getByText('My Learning Path')).toBeInTheDocument();
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Core Concepts')).toBeInTheDocument();
    expect(screen.getByText('Advanced Topics')).toBeInTheDocument();
  });

  test('shows required and optional badges', () => {
    render(<AdaptiveLearningPathPreview data={mockData} />);
    expect(screen.getAllByText('Required').length).toBeGreaterThan(0);
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  test('shows estimated time badges', () => {
    render(<AdaptiveLearningPathPreview data={mockData} />);
    expect(screen.getByText('~10 min')).toBeInTheDocument();
    expect(screen.getByText('~20 min')).toBeInTheDocument();
  });

  test('fires interaction on node click', () => {
    const onInteraction = jest.fn();
    render(<AdaptiveLearningPathPreview data={mockData} onInteraction={onInteraction} />);
    // node-1 is completed (before currentNodeId), should have open button
    const openBtns = screen.getAllByRole('button', { name: /Open/i });
    fireEvent.click(openBtns[0]);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({
      interactionType: 'path_node_opened',
    }));
  });

  test('shows empty state when no nodes', () => {
    render(<AdaptiveLearningPathPreview data={{ nodes: [] }} />);
    expect(screen.getByText('No path nodes configured yet.')).toBeInTheDocument();
  });
});

describe('AdaptiveLearningPathEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('updates title', () => {
    render(<AdaptiveLearningPathEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Path' } });
    expect(mockOnChange).toHaveBeenCalledWith({ data: expect.objectContaining({ title: 'New Path' }) });
  });

  test('adds a node', () => {
    render(<AdaptiveLearningPathEditor data={mockData} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Node/i }));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        nodes: expect.arrayContaining([expect.objectContaining({ required: true })]),
      }),
    }));
  });
});
