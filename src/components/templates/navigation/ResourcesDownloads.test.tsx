import { fireEvent, render, screen } from '@testing-library/react';
import { ResourcesDownloadsEditor, ResourcesDownloadsPreview } from './ResourcesDownloads';

const resourcesData = {
  title: 'Resources',
  description: 'Supplementary materials',
  resources: [
    {
      id: 'res-1',
      title: 'Course Handbook',
      description: 'Main reference guide',
      url: 'https://example.com/handbook.pdf',
      type: 'pdf',
      fileSize: '2.4 MB',
    },
    {
      id: 'res-2',
      title: 'Reference Link',
      url: 'https://example.com/reference',
      type: 'link',
    },
  ],
};

describe('ResourcesDownloadsPreview', () => {
  it('renders title, description and resources', () => {
    render(
      <ResourcesDownloadsPreview
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
      />
    );

    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Supplementary materials')).toBeInTheDocument();
    expect(screen.getByText('Course Handbook')).toBeInTheDocument();
    expect(screen.getByText('Reference Link')).toBeInTheDocument();
  });

  it('renders links with secure external attributes', () => {
    render(
      <ResourcesDownloadsPreview
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
      />
    );

    const link = screen.getByRole('link', { name: /Download Course Handbook/i });
    expect(link).toHaveAttribute('href', 'https://example.com/handbook.pdf');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows type badge and file size', () => {
    render(
      <ResourcesDownloadsPreview
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
      />
    );

    expect(screen.getByText('pdf')).toBeInTheDocument();
    expect(screen.getByText('2.4 MB')).toBeInTheDocument();
  });

  it('shows empty state when resources are missing', () => {
    render(
      <ResourcesDownloadsPreview
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={{ title: 'Resources', resources: [] }}
      />
    );

    expect(screen.getByText('No resources added yet.')).toBeInTheDocument();
  });

  it('uses BEM classes on preview elements', () => {
    const { container } = render(
      <ResourcesDownloadsPreview
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
      />
    );

    expect(container.querySelector('.tpl-resources-downloads')).toBeInTheDocument();
    expect(container.querySelector('.tpl-resources-downloads__resource')).toBeInTheDocument();
  });
});

describe('ResourcesDownloadsEditor', () => {
  it('renders title and description fields with values', () => {
    render(
      <ResourcesDownloadsEditor
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Resources & Downloads')).toHaveValue('Resources');
    expect(screen.getByPlaceholderText('Supplementary materials')).toHaveValue('Supplementary materials');
  });

  it('updates title through onChange', () => {
    const onChange = jest.fn();

    render(
      <ResourcesDownloadsEditor
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Resources & Downloads'), {
      target: { value: 'Updated Resources' },
    });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].data.title).toBe('Updated Resources');
  });

  it('adds resource item', () => {
    const onChange = jest.fn();

    render(
      <ResourcesDownloadsEditor
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={{ title: 'Resources', resources: [] }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '+ Add Resource' }));

    const nextResources = onChange.mock.calls[0][0].data.resources;
    expect(nextResources).toHaveLength(1);
    expect(nextResources[0].id).toMatch(/^res-/);
  });

  it('removes resource item', () => {
    const onChange = jest.fn();

    render(
      <ResourcesDownloadsEditor
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Remove resource 1'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].data.resources).toHaveLength(1);
  });

  it('updates resource type through selector', () => {
    const onChange = jest.fn();

    render(
      <ResourcesDownloadsEditor
        componentId="cmp-resources"
        componentType="resources-downloads"
        data={resourcesData}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getAllByLabelText('Type')[0], { target: { value: 'video' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].data.resources[0].type).toBe('video');
  });
});
