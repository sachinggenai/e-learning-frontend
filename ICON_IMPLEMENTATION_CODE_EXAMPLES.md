# Icon Implementation: Code Examples

## Using Icon Map & IconRenderer

### Example 1: Template Card with Icon

```tsx
import IconRenderer from '@/components/common/IconRenderer';

const TemplateCard = ({ template }) => {
  const templateIconMap = {
    'welcome': 'welcome',
    'content-text': 'content-text',
    'content-video': 'content-video',
    'mcq': 'mcq',
    'interactive': 'interactive',
  };

  return (
    <div className="template-card">
      <div className="template-icon">
        <IconRenderer 
          name={templateIconMap[template.type] || 'component-page'} 
          size="md"
          color="var(--color-primary)"
        />
      </div>
      <h3>{template.title}</h3>
      <p>{template.description}</p>
    </div>
  );
};
```

---

### Example 2: Action Button with Icon

```tsx
const ActionButton = ({ icon, label, onClick, disabled }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`action-button ${disabled ? 'disabled' : ''}`}
      title={label}
      aria-label={label}
    >
      <IconRenderer 
        name={icon}
        size="sm"
        color={disabled ? 'var(--text-muted)' : 'var(--text-primary)'}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
};

// Usage
<ActionButton icon="delete" label="Delete item" onClick={handleDelete} />
<ActionButton icon="save" label="Save changes" onClick={handleSave} />
<ActionButton icon="edit" label="Edit page" onClick={handleEdit} />
```

---

### Example 3: Loading Indicator

```tsx
const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  return (
    <div className="loading-spinner" role="status" aria-label={label}>
      <IconRenderer 
        name="refresh" 
        size={size}
        animation="spin"
        color="var(--color-primary)"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

// Usage
<LoadingSpinner size="lg" label="Loading courses..." />
```

---

### Example 4: Status Badge

```tsx
const StatusBadge = ({ status }) => {
  const statusConfig = {
    success: {
      icon: 'success',
      color: 'var(--color-success)',
      label: 'Completed',
    },
    error: {
      icon: 'error',
      color: 'var(--color-danger)',
      label: 'Error',
    },
    warning: {
      icon: 'warning',
      color: 'var(--color-warning)',
      label: 'Warning',
    },
    info: {
      icon: 'info',
      color: 'var(--color-primary)',
      label: 'Information',
    },
  };

  const config = statusConfig[status] || statusConfig.info;

  return (
    <div className={`badge badge--${status}`}>
      <IconRenderer 
        name={config.icon}
        size="sm"
        color={config.color}
        ariaLabel={config.label}
      />
      <span>{config.label}</span>
    </div>
  );
};

// Usage
<StatusBadge status="success" />
<StatusBadge status="error" />
<StatusBadge status="warning" />
```

---

### Example 5: Icon List

```tsx
const PagesList = ({ pages }) => {
  const pageIconMap = {
    welcome: 'welcome',
    content: 'content-text',
    quiz: 'mcq',
    activity: 'interactive',
  };

  return (
    <ul className="pages-list">
      {pages.map(page => (
        <li key={page.id} className="page-item">
          <IconRenderer 
            name={pageIconMap[page.type] || 'component-page'}
            size="sm"
            color="var(--color-primary)"
          />
          <span className="page-title">{page.title}</span>
          <span className="page-type">({page.type})</span>
        </li>
      ))}
    </ul>
  );
};
```

---

### Example 6: Using Icon Map Directly

```tsx
import { COMPONENT_CATEGORY_ICONS, getIcon, ICON_SIZES } from '@/constants/iconMap';
import { FileText } from 'lucide-react';

// Direct icon usage
const MyComponent = () => {
  // Get icon component
  const iconComponent = getIcon('welcome');
  const size = ICON_SIZES.md; // 24px

  return (
    <div style={{ fontSize: size }}>
      {/* Icon is a React component from Lucide */}
      {iconComponent && <iconComponent size={size} />}
    </div>
  );
};

// Using predefined icons
const TemplateTypeIcon = ({ type }) => {
  const IconComponent = COMPONENT_CATEGORY_ICONS[type] || FileText;
  
  return (
    <div>
      <IconComponent size={24} color="currentColor" />
    </div>
  );
};
```

---

### Example 7: Dynamic Icon Provider Hook

```tsx
import { useMemo } from 'react';
import { getIcon, getIconSize } from '@/constants/iconMap';

const useIcon = (name, size = 'md') => {
  return useMemo(() => ({
    IconComponent: getIcon(name),
    size: getIconSize(size),
    name,
  }), [name, size]);
};

// Usage
const MyIcon = ({ name = 'add', size = 'lg' }) => {
  const { IconComponent, size: pxSize } = useIcon(name, size);
  
  return <IconComponent size={pxSize} />;
};
```

---

### Example 8: Conditional Icon Rendering

```tsx
const ComponentCard = ({ component, isSelected, isEditing }) => {
  const getCardIcon = () => {
    if (isEditing) {
      return { name: 'edit', animation: 'pulse' };
    }
    if (isSelected) {
      return { name: 'check', color: 'var(--color-success)' };
    }
    return { name: component.type };
  };

  const iconConfig = getCardIcon();

  return (
    <div className={`card ${isSelected ? 'selected' : ''}`}>
      <IconRenderer 
        {...iconConfig}
        size="md"
      />
      <span>{component.name}</span>
    </div>
  );
};
```

---

### Example 9: Icon Menu System

```tsx
const ContextMenu = ({ items, onSelect }) => {
  return (
    <ul className="context-menu">
      {items.map(item => (
        <li key={item.id}>
          <button 
            onClick={() => onSelect(item.id)}
            className="menu-item"
            aria-label={item.label}
          >
            <IconRenderer 
              name={item.icon}
              size="sm"
              color={item.color || 'currentColor'}
            />
            <span className="menu-label">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

// Usage
const menuItems = [
  { id: 1, label: 'Edit', icon: 'edit' },
  { id: 2, label: 'Delete', icon: 'delete', color: 'var(--color-danger)' },
  { id: 3, label: 'Duplicate', icon: 'copy' },
  { id: 4, label: 'Settings', icon: 'settings' },
];

<ContextMenu items={menuItems} onSelect={handleSelect} />
```

---

### Example 10: Icon Animation Gallery

```tsx
const AnimationShowcase = () => {
  const animations = ['spin', 'pulse', 'bounce'] as const;

  return (
    <div className="animation-gallery">
      {animations.map(animation => (
        <div key={animation} className="animation-item">
          <h3>{animation}</h3>
          <IconRenderer 
            name="refresh"
            size="lg"
            animation={animation}
            color="var(--color-primary)"
          />
        </div>
      ))}
    </div>
  );
};
```

---

### Example 11: Accessible Icon Button Set

```tsx
const ToolbarButtons = () => {
  const tools = [
    { name: 'save', label: 'Save', icon: 'save', onClick: handleSave },
    { name: 'undo', label: 'Undo', icon: 'undo', onClick: handleUndo },
    { name: 'redo', label: 'Redo', icon: 'refresh', onClick: handleRedo },
    { name: 'settings', label: 'Settings', icon: 'settings', onClick: handleSettings },
  ];

  return (
    <toolbar className="toolbar" role="toolbar" aria-label="Editor actions">
      {tools.map(tool => (
        <button
          key={tool.name}
          onClick={tool.onClick}
          className="toolbar-btn"
          title={tool.label}
          aria-label={tool.label}
        >
          <IconRenderer 
            name={tool.icon}
            size="sm"
            color="var(--text-primary)"
          />
        </button>
      ))}
    </toolbar>
  );
};
```

---

### Example 12: Theming with Icons

```tsx
const ThemedIconComponent = ({ isDarkMode }) => {
  const theme = isDarkMode ? 'dark' : 'light';
  const iconColor = isDarkMode ? '#ffffff' : '#333333';

  return (
    <div className={`themed-component theme-${theme}`}>
      <IconRenderer 
        name="settings"
        size="lg"
        color={iconColor}
      />
      <p>Current theme: {theme}</p>
    </div>
  );
};

// Or using CSS variables (preferred)
const ThemedIcon = ({ themeVar = '--color-primary' }) => {
  return (
    <IconRenderer 
      name="favorite"
      size="md"
      color={`var(${themeVar})`}
    />
  );
};
```

---

### Example 13: Icon With Counter Badge

```tsx
const NotificationIcon = ({ count }) => {
  return (
    <div className="notification-icon">
      <IconRenderer 
        name="bell"
        size="lg"
        color="var(--text-primary)"
      />
      {count > 0 && (
        <span className="badge" aria-label={`${count} notifications`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};
```

---

## CSS Integration Examples

### Styling IconRenderer

```css
/* Custom button with icon */
.icon-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background: var(--bg-hover);
  border-color: var(--color-primary);
}

.icon-button:hover .icon-renderer {
  color: var(--color-primary);
}

/* Animation modifier */
.icon-button.loading .icon-renderer {
  animation: spin 1s linear infinite;
}
```

---

## Best Practices

1. **Always use IconRenderer** - Centralized, maintainable
2. **Use aria-labels** - Required for icon-only buttons
3. **Pair with text** - When possible, include text labels
4. **Consistent sizing** - Use preset sizes (xs, sm, md, lg, xl, xxl)
5. **CSS variables** - Use vars for theming
6. **Test animations** - Keep animations subtle and purposeful
7. **Document custom icons** - When extending with SVGs

---

*Last Updated: Feb 19, 2026*
