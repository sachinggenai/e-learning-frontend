import { fireEvent, render, screen } from '@testing-library/react';
import { TimelinePreview } from './Timeline';

const timelineData = {
  title: 'Project Timeline',
  events: [
    {
      id: 'evt-1',
      date: 'Jan 2026',
      title: 'Kickoff',
      description: 'Project kickoff completed.',
    },
    {
      id: 'evt-2',
      date: 'Feb 2026',
      title: 'Design',
      description: 'Design phase completed.',
      imageUrl: 'https://example.com/timeline-image.jpg',
    },
    {
      id: 'evt-3',
      date: 'Mar 2026',
      title: 'Launch',
      description: 'Release launched.',
    },
  ],
};

describe('TimelinePreview', () => {
  it('renders events in provided order', () => {
    render(
      <TimelinePreview
        componentId="cmp-timeline"
        componentType="timeline"
        data={timelineData}
      />
    );

    const headers = screen.getAllByText(/Kickoff|Design|Launch/).map((item) => item.textContent);
    expect(headers).toEqual(['Kickoff', 'Design', 'Launch']);
  });

  it('expands event details on click', () => {
    render(
      <TimelinePreview
        componentId="cmp-timeline"
        componentType="timeline"
        data={timelineData}
      />
    );

    expect(screen.queryByText('Project kickoff completed.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Kickoff'));
    expect(screen.getByText('Project kickoff completed.')).toBeInTheDocument();
  });

  it('renders optional media when expanded', () => {
    render(
      <TimelinePreview
        componentId="cmp-timeline"
        componentType="timeline"
        data={timelineData}
      />
    );

    fireEvent.click(screen.getByText('Design'));
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/timeline-image.jpg');
  });

  it('supports keyboard interaction', () => {
    render(
      <TimelinePreview
        componentId="cmp-timeline"
        componentType="timeline"
        data={timelineData}
      />
    );

    const kickoffCard = screen.getByText('Kickoff').closest('[role="button"]');
    fireEvent.keyDown(kickoffCard!, { key: 'Enter' });
    expect(screen.getByText('Project kickoff completed.')).toBeInTheDocument();
  });

  it('calls onComplete after all events are expanded', () => {
    const onComplete = jest.fn();

    render(
      <TimelinePreview
        componentId="cmp-timeline"
        componentType="timeline"
        data={timelineData}
        onComplete={onComplete}
      />
    );

    fireEvent.click(screen.getByText('Kickoff'));
    fireEvent.click(screen.getByText('Design'));
    fireEvent.click(screen.getByText('Launch'));

    expect(onComplete).toHaveBeenCalledWith('');
  });
});
