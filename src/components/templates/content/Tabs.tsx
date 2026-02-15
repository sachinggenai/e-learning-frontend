/**
 * Tabs Component — Content Presentation
 *
 * Preview: Renders tabbed content with per-tab audio support.
 * Editor: Provides tab management (add/remove/reorder/edit).
 * Self-registers with the component registry.
 */

import React, { useState, useCallback } from 'react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';

// ─── Preview Component ───────────────────────────────────────────
export const TabsPreview: React.FC<ComponentPreviewProps> = ({
  componentId,
  data,
  onInteraction,
  onComplete,
}) => {
  const tabs: Array<{ id: string; title: string; body: string }> = data.tabs || [];
  const [activeTab, setActiveTab] = useState(data.defaultTabId || tabs[0]?.id || '');
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());

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
    <div className="tabs-component" role="tablist" aria-label="Content tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`tab-button ${activeTab === tab.id ? 'tab-button--active' : ''} ${visitedTabs.has(tab.id) ? 'tab-button--visited' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
            {visitedTabs.has(tab.id) && <span className="tab-visited-indicator" aria-hidden="true">✓</span>}
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
          className="tab-panel"
        >
          <div dangerouslySetInnerHTML={{ __html: tab.body }} />
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
    <div className="tabs-editor">
      <div className="tabs-editor__header">
        <h4>Tabs Editor</h4>
        <button
          className="btn btn-sm btn-secondary"
          onClick={addTab}
          disabled={readOnly}
          aria-label="Add new tab"
        >
          + Add Tab
        </button>
      </div>

      <div className="tabs-editor__tab-list">
        {tabs.map((tab, index) => (
          <div key={tab.id} className={`tabs-editor__tab-item ${editingTab === index ? 'tabs-editor__tab-item--active' : ''}`}>
            <button
              className="tabs-editor__tab-select"
              onClick={() => setEditingTab(index)}
              aria-label={`Edit ${tab.title}`}
            >
              {tab.title}
            </button>
            {tabs.length > 1 && !readOnly && (
              <button
                className="tabs-editor__tab-remove"
                onClick={() => removeTab(index)}
                aria-label={`Remove ${tab.title}`}
              >
                ×
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
