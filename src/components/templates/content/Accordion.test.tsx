import { fireEvent, render, screen } from '@testing-library/react';
import { AccordionPreview } from './Accordion';

const singleOpenData = {
  panels: [
    { id: 'panel-1', title: 'Safety', body: '<p>Safety content</p>' },
    { id: 'panel-2', title: 'Compliance', body: '<p>Compliance content</p>' },
    { id: 'panel-3', title: 'Emergency', body: '<p>Emergency content</p>' },
  ],
  allowMultipleOpen: false,
};

const multiOpenData = {
  panels: [
    { id: 'panel-1', title: 'Safety', body: '<p>Safety content</p>' },
    { id: 'panel-2', title: 'Compliance', body: '<p>Compliance content</p>' },
    { id: 'panel-3', title: 'Emergency', body: '<p>Emergency content</p>' },
  ],
  allowMultipleOpen: true,
};

describe('AccordionPreview', () => {
  it('opens and closes panels in single-open mode', () => {
    render(
      <AccordionPreview
        componentId="cmp-accordion"
        componentType="accordion"
        data={singleOpenData}
      />
    );

    const safetyHeader = screen.getByRole('button', { name: /safety/i });
    const complianceHeader = screen.getByRole('button', { name: /compliance/i });
    const safetyBody = document.getElementById('accordion-body-panel-1');
    const complianceBody = document.getElementById('accordion-body-panel-2');

    expect(safetyBody).toHaveAttribute('hidden');
    expect(complianceBody).toHaveAttribute('hidden');

    fireEvent.click(safetyHeader);
    expect(safetyHeader).toHaveAttribute('aria-expanded', 'true');
    expect(safetyBody).not.toHaveAttribute('hidden');

    fireEvent.click(complianceHeader);
    expect(complianceHeader).toHaveAttribute('aria-expanded', 'true');
    expect(complianceBody).not.toHaveAttribute('hidden');
    expect(safetyHeader).toHaveAttribute('aria-expanded', 'false');
    expect(safetyBody).toHaveAttribute('hidden');
  });

  it('allows multiple panels open when configured', () => {
    render(
      <AccordionPreview
        componentId="cmp-accordion"
        componentType="accordion"
        data={multiOpenData}
      />
    );

    const safetyHeader = screen.getByRole('button', { name: /safety/i });
    const complianceHeader = screen.getByRole('button', { name: /compliance/i });

    fireEvent.click(safetyHeader);
    fireEvent.click(complianceHeader);

    expect(safetyHeader).toHaveAttribute('aria-expanded', 'true');
    expect(complianceHeader).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('accordion-body-panel-1')).not.toHaveAttribute('hidden');
    expect(document.getElementById('accordion-body-panel-2')).not.toHaveAttribute('hidden');
  });

  it('emits interaction and completes after all panels are visited', () => {
    const onInteraction = jest.fn();
    const onComplete = jest.fn();

    render(
      <AccordionPreview
        componentId="cmp-accordion"
        componentType="accordion"
        data={singleOpenData}
        onInteraction={onInteraction}
        onComplete={onComplete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /safety/i }));
    fireEvent.click(screen.getByRole('button', { name: /compliance/i }));
    fireEvent.click(screen.getByRole('button', { name: /emergency/i }));

    expect(onInteraction).toHaveBeenCalledWith({
      componentId: 'cmp-accordion',
      interactionType: 'click',
      interactionId: 'panel-3',
      value: 'panel-3',
    });

    expect(onComplete).toHaveBeenCalledWith('cmp-accordion');
  });
});
