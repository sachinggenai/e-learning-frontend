/**
 * CourseMenu — Navigation component showing course structure.
 *
 * Category: navigation
 */

import React from 'react';
import type { ComponentPreviewProps, ComponentEditorProps } from '../../../types/registry';
import './CourseMenu.css';

interface MenuItem {
  id: string;
  label: string;
  pageId?: string;
  icon?: string;
  children?: MenuItem[];
}

interface CourseMenuData {
  title?: string;
  items?: MenuItem[];
  currentPageId?: string;
}

// ─── Preview ──────────────────────────────────────────────────────
export const CourseMenuPreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const menuData = data as CourseMenuData;
  const items: MenuItem[] = menuData?.items ?? [];
  const currentPageId: string | undefined = menuData?.currentPageId;

  const handleItemClick = (item: MenuItem) => {
    if (!item.pageId) {
      return;
    }

    onInteraction?.({
      componentId,
      interactionType: 'click',
      interactionId: item.id,
      value: item.pageId,
    });
  };

  const renderItem = (item: MenuItem, depth: number): React.ReactElement => {
    const isActive = item.pageId === currentPageId;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const itemClassNames = [
      'tpl-course-menu__item',
      isActive ? 'tpl-course-menu__item--active' : '',
      hasChildren ? 'tpl-course-menu__item--nested' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={item.id} className="tpl-course-menu__list-item">
        {item.pageId ? (
          <button
            type="button"
            className={itemClassNames}
            style={{ '--depth': depth } as React.CSSProperties}
            onClick={() => handleItemClick(item)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tpl-course-menu__item-content">
              {item.icon && <span className="tpl-course-menu__icon">{item.icon}</span>}
              <span className="tpl-course-menu__label">{item.label}</span>
            </span>
          </button>
        ) : (
          <div
            className={itemClassNames}
            style={{ '--depth': depth } as React.CSSProperties}
            role="heading"
            aria-level={Math.min(6, depth + 2)}
          >
            <span className="tpl-course-menu__item-content">
              {item.icon && <span className="tpl-course-menu__icon">{item.icon}</span>}
              <span className="tpl-course-menu__label">{item.label}</span>
            </span>
          </div>
        )}

        {hasChildren ? (
          <ul className="tpl-course-menu__list tpl-course-menu__list--nested">
            {item.children?.map((child) => renderItem(child, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <section className="tpl-course-menu">
      {menuData?.title && (
        <h4 className="tpl-course-menu__title">
          {menuData.title}
        </h4>
      )}

      <nav className="tpl-course-menu__nav" role="navigation" aria-label="Course menu">
        {items.length > 0 ? (
          <ul className="tpl-course-menu__list">
            {items.map((item) => renderItem(item, 0))}
          </ul>
        ) : (
          <p className="tpl-course-menu__empty">No menu items added yet.</p>
        )}
      </nav>
    </section>
  );
};

// ─── Editor ───────────────────────────────────────────────────────
export const CourseMenuEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const menuData = data as CourseMenuData;
  const items: MenuItem[] = menuData?.items ?? [];

  const updateItem = (idx: number, field: keyof MenuItem, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ data: { ...menuData, items: updated } });
  };

  const addItem = () => {
    onChange({
      data: {
        ...menuData,
        items: [...items, { id: `mi-${Date.now()}`, label: '', icon: '' }],
      },
    });
  };

  const removeItem = (idx: number) => {
    onChange({ data: { ...menuData, items: items.filter((_, i) => i !== idx) } });
  };

  return (
    <section className="tpl-course-menu-editor">
      <div className="tpl-course-menu-editor__header">
        <label className="tpl-course-menu-editor__label" htmlFor="course-menu-title">
          Menu Title
        </label>
        <input
          id="course-menu-title"
          className="tpl-course-menu-editor__input"
          type="text"
          value={menuData?.title ?? ''}
          onChange={(e) => onChange({ data: { ...menuData, title: e.target.value } })}
          placeholder="Course Menu"
        />
      </div>

      <div className="tpl-course-menu-editor__items">
      {items.map((item, idx) => (
        <div key={item.id} className="tpl-course-menu-editor__item-row">
          <input
            className="tpl-course-menu-editor__icon-input"
            type="text"
            value={item.icon ?? ''}
            onChange={(e) => updateItem(idx, 'icon', e.target.value)}
            placeholder="📘"
            aria-label={`Item ${idx + 1} icon`}
          />
          <input
            className="tpl-course-menu-editor__label-input"
            type="text"
            value={item.label}
            onChange={(e) => updateItem(idx, 'label', e.target.value)}
            placeholder="Menu item label"
            aria-label={`Item ${idx + 1} label`}
          />
          <input
            className="tpl-course-menu-editor__pageid-input"
            type="text"
            value={item.pageId ?? ''}
            onChange={(e) => updateItem(idx, 'pageId', e.target.value)}
            placeholder="page-id"
            aria-label={`Item ${idx + 1} page id`}
          />
          <button
            type="button"
            className="tpl-course-menu-editor__remove-btn"
            onClick={() => removeItem(idx)}
            aria-label={`Remove item ${idx + 1}`}
          >
            ×
          </button>
        </div>
      ))}
      </div>

      <button
        type="button"
        className="tpl-course-menu-editor__add-btn"
        onClick={addItem}
      >
        + Add Menu Item
      </button>
    </section>
  );
};
