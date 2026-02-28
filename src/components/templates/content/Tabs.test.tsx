import { fireEvent, render, screen } from '@testing-library/react';
import { TabsPreview } from './Tabs';

const tabsData = {
  tabs: [
    { id: 'tab-1', title: 'Overview', body: '<p>Overview content</p>' },
    { id: 'tab-2', title: 'Details', body: '<p>Details content</p>' },
    { id: 'tab-3', title: 'Summary', body: '<p>Summary content</p>' },
  ],
  defaultTabId: 'tab-2',
};

describe('TabsPreview', () => {
  it('renders the configured default tab panel', () => {
    render(
      <TabsPreview
        componentId="cmp-tabs"
        componentType="tabs"
        data={tabsData}
      />
    );

    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Details content')).toBeInTheDocument();
    expect(document.getElementById('tabpanel-tab-2')).not.toHaveAttribute('hidden');
    expect(document.getElementById('tabpanel-tab-1')).toHaveAttribute('hidden');
  });

  it('switches tabs and emits interaction events', () => {
    const onInteraction = jest.fn();

    render(
      <TabsPreview
        componentId="cmp-tabs"
        componentType="tabs"
        data={tabsData}
        onInteraction={onInteraction}
      />
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Summary' }));

    expect(screen.getByRole('tab', { name: 'Summary' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Summary content')).toBeInTheDocument();
    expect(onInteraction).toHaveBeenCalledWith({
      componentId: 'cmp-tabs',
      interactionType: 'click',
      interactionId: 'tab-3',
      value: 'tab-3',
    });
  });

  it('calls onComplete after all tabs are visited', () => {
    const onComplete = jest.fn();

    render(
      <TabsPreview
        componentId="cmp-tabs"
        componentType="tabs"
        data={tabsData}
        onComplete={onComplete}
      />
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Summary' }));

    expect(onComplete).toHaveBeenCalledWith('cmp-tabs');
  });
});
