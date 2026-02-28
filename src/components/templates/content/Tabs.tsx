/**
 * Tabs Component — Content Presentation
 *
 * Preview: Renders tabbed content with per-tab audio support.
 * Editor: Provides tab management (add/remove/reorder/edit).
 * Self-registers with the component registry.
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

// ─── Preview Component ───────────────────────────────────────────
export const TabsPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const tabs: Array<{ id: string; title: string; body: string }> = data.tabs || [];
  const defaultTabId = useMemo(() => {
    const configuredDefault = data.defaultTabId;
    if (configuredDefault && tabs.some((tab) => tab.id === configuredDefault)) {
      return configuredDefault;
    }
    return tabs[0]?.id || '';
  }, [data.defaultTabId, tabs]);

  const [activeTab, setActiveTab] = useState(defaultTabId);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActiveTab((currentTabId: string) => {
      if (currentTabId && tabs.some((tab) => tab.id === currentTabId)) {
        return currentTabId;
      }
      return defaultTabId;
    });
  }, [defaultTabId, tabs]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setVisitedTabs((prev) => {
      const next = new Set(prev);
      next.add(tabId);
      // If all tabs visited, consider component complete
      if (next.size === tabs.length && onComplete) {
        onComplete(componentId);
      }
      return next;
    });
    onInteraction?.({
      componentId,
      interactionType: 'click',
      interactionId: tabId,
      value: tabId,
    });
  }, [componentId, tabs.length, onInteraction, onComplete]);

  if (tabs.length === 0) {
    return <p className="component-empty">No tabs configured.</p>;
  }

  return (
    <div className="tpl-tabs-preview" role="presentation">
      <div className="tpl-tabs-preview__tablist" role="tablist" aria-label="Content tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`tpl-tabs-preview__tab ${activeTab === tab.id ? 'tpl-tabs-preview__tab--active' : ''} ${visitedTabs.has(tab.id) ? 'tpl-tabs-preview__tab--visited' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="tpl-tabs-preview__panel"
        >
          <div className="tpl-tabs-preview__panel-card" dangerouslySetInnerHTML={{ __html: tab.body }} />
        </div>
      ))}
    </div>
  );
};

// ─── Editor Component ────────────────────────────────────────────
export const TabsEditor: React.FC<ComponentEditorProps> = ({
  data,
  onChange,
  readOnly,
}) => {
  const tabs: Array<{ id: string; title: string; body: string }> = data.tabs || [];
  const [editingTab, setEditingTab] = useState(0);

  const updateTabs = useCallback((newTabs: typeof tabs) => {
    onChange({ data: { ...data, tabs: newTabs } });
  }, [data, onChange]);

  const addTab = useCallback(() => {
    const newTab = {
      id: `tab-${Date.now()}`,
      title: `Tab ${tabs.length + 1}`,
      body: '<p>Enter tab content here...</p>',
    };
    updateTabs([...tabs, newTab]);
    setEditingTab(tabs.length);
  }, [tabs, updateTabs]);

  const removeTab = useCallback((index: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    updateTabs(newTabs);
    setEditingTab(Math.min(editingTab, newTabs.length - 1));
  }, [tabs, editingTab, updateTabs]);

  const updateTab = useCallback((index: number, field: 'title' | 'body', value: string) => {
    const newTabs = tabs.map((tab, i) =>
      i === index ? { ...tab, [field]: value } : tab
    );
    updateTabs(newTabs);
  }, [tabs, updateTabs]);

  return (
    <div className="tabs-editor tpl-editor">
      <div className="tabs-editor__header">
        <h4>Tabs Editor</h4>
        <button
          className="tpl-btn tpl-btn--primary tpl-btn--sm"
          onClick={addTab}
          disabled={readOnly}
          aria-label="Add new tab"
        >
          + Add Tab
        </button>
      </div>

      <div className="tpl-tabs-editor__tab-nav">
        {tabs.map((tab, index) => (
          <div key={tab.id} className={`tabs-editor__tab-item ${editingTab === index ? 'tabs-editor__tab-item--active' : ''}`}>
            <button
              type="button"
              className={`tpl-tabs-editor__tab-btn ${editingTab === index ? 'tpl-tabs-editor__tab-btn--active' : ''}`}
              onClick={() => setEditingTab(index)}
              aria-label={`Edit ${tab.title}`}
            >
              {tab.title}
            </button>
            {tabs.length > 1 && !readOnly && (
              <button
                type="button"
                className="tpl-btn tpl-btn--danger tpl-btn--sm"
                onClick={() => removeTab(index)}
                aria-label={`Remove ${tab.title}`}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {tabs[editingTab] && (
        <div className="tabs-editor__content">
          <div className="form-group">
            <label htmlFor={`tab-title-${editingTab}`}>Tab Title</label>
            <input
              id={`tab-title-${editingTab}`}
              type="text"
              className="form-input"
              value={tabs[editingTab].title}
              onChange={(e) => updateTab(editingTab, 'title', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`tab-body-${editingTab}`}>Tab Content</label>
            <textarea
              id={`tab-body-${editingTab}`}
              className="form-textarea"
              rows={6}
              value={tabs[editingTab].body}
              onChange={(e) => updateTab(editingTab, 'body', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>
      )}
    </div>
  );
};
