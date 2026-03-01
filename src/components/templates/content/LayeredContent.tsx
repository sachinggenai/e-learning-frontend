import React, { useMemo, useState } from 'react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './LayeredContent.css';

interface LayerItem {
  id: string;
  label: string;
  content: string;
}

export const LayeredContentPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const layers: LayerItem[] = Array.isArray(data?.layers) ? data.layers : [];
  const defaultLayerId = data?.defaultLayerId;

  const initialLayerId = useMemo(() => {
    if (defaultLayerId && layers.some((layer) => layer.id === defaultLayerId)) {
      return defaultLayerId;
    }
    return layers[0]?.id ?? '';
  }, [defaultLayerId, layers]);

  const [activeLayerId, setActiveLayerId] = useState(initialLayerId);
  const [visitedLayerIds, setVisitedLayerIds] = useState<Set<string>>(() =>
    initialLayerId ? new Set([initialLayerId]) : new Set()
  );

  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? layers[0];

  const selectLayer = (layerId: string) => {
    setActiveLayerId(layerId);

    onInteraction?.({
      componentId,
      interactionType: 'layer-select',
      interactionId: layerId,
      value: layerId,
    });

    setVisitedLayerIds((previous) => {
      const next = new Set(previous);
      next.add(layerId);
      if (layers.length > 0 && next.size === layers.length) {
        onComplete?.(componentId);
      }
      return next;
    });
  };

  return (
    <section className="tpl-layered" aria-label="Layered content">
      {data?.title && <h3 className="tpl-layered__title">{data.title}</h3>}

      <div className="tpl-layered__tabs" role="tablist" aria-label="Layers">
        {layers.map((layer) => {
          const isActive = layer.id === activeLayer?.id;
          return (
            <button
              key={layer.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`layer-panel-${layer.id}`}
              id={`layer-tab-${layer.id}`}
              className={`tpl-layered__tab ${isActive ? 'tpl-layered__tab--active' : ''}`}
              onClick={() => selectLayer(layer.id)}
            >
              {layer.label || 'Untitled Layer'}
            </button>
          );
        })}
      </div>

      <div
        id={`layer-panel-${activeLayer?.id ?? 'default'}`}
        role="tabpanel"
        aria-labelledby={`layer-tab-${activeLayer?.id ?? 'default'}`}
        className="tpl-layered__panel"
      >
        {activeLayer ? (
          <p className="tpl-layered__content">{activeLayer.content}</p>
        ) : (
          <p className="tpl-layered__empty">No layers configured.</p>
        )}
      </div>

      <p className="tpl-layered__progress">
        {visitedLayerIds.size} / {layers.length} layers viewed
      </p>
    </section>
  );
};

export const LayeredContentEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const layers: LayerItem[] = Array.isArray(data?.layers) ? data.layers : [];

  const updateLayer = (index: number, field: keyof LayerItem, value: string) => {
    const nextLayers = [...layers];
    nextLayers[index] = { ...nextLayers[index], [field]: value };
    onChange({ data: { ...data, layers: nextLayers } });
  };

  const addLayer = () => {
    const nextLayer: LayerItem = {
      id: `layer-${Date.now()}`,
      label: '',
      content: '',
    };

    onChange({
      data: {
        ...data,
        layers: [...layers, nextLayer],
      },
    });
  };

  const removeLayer = (index: number) => {
    onChange({
      data: {
        ...data,
        layers: layers.filter((_, currentIndex) => currentIndex !== index),
      },
    });
  };

  return (
    <div className="tpl-layered-editor">
      <div className="tpl-layered-editor__field">
        <label className="tpl-layered-editor__label" htmlFor="layered-title">
          Title
        </label>
        <input
          id="layered-title"
          className="tpl-layered-editor__input"
          type="text"
          value={data?.title ?? ''}
          onChange={(event) => onChange({ data: { ...data, title: event.target.value } })}
          placeholder="Layered Content"
        />
      </div>

      {layers.map((layer, index) => (
        <div key={layer.id} className="tpl-layered-editor__item">
          <div className="tpl-layered-editor__item-header">
            <span className="tpl-layered-editor__item-title">Layer {index + 1}</span>
            <button
              type="button"
              className="tpl-layered-editor__delete"
              aria-label={`Delete layer ${index + 1}`}
              onClick={() => removeLayer(index)}
            >
              ×
            </button>
          </div>

          <div className="tpl-layered-editor__field">
            <label className="tpl-layered-editor__label">Label</label>
            <input
              className="tpl-layered-editor__input"
              type="text"
              value={layer.label}
              onChange={(event) => updateLayer(index, 'label', event.target.value)}
              placeholder="Layer label"
            />
          </div>

          <div className="tpl-layered-editor__field">
            <label className="tpl-layered-editor__label">Content</label>
            <textarea
              className="tpl-layered-editor__textarea"
              value={layer.content}
              rows={3}
              onChange={(event) => updateLayer(index, 'content', event.target.value)}
              placeholder="Layer content"
            />
          </div>
        </div>
      ))}

      <button type="button" className="tpl-layered-editor__add" onClick={addLayer}>
        + Add Layer
      </button>
    </div>
  );
};
