# Icon System Quick Reference

## Installation

```bash
npm install lucide-react
```

---

## Basic Usage

```tsx
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react';

// Direct usage
<FileText size={24} />

// With properties
<Plus size={32} color="blue" strokeWidth={2} />

// With animation
<Trash2 className="animate-spin" />
```

---

## Available Icon Categories

### Template Icons
```tsx
import { 
  Home,           // welcome
  FileText,       // content-text
  Video,          // content-video
  Image,          // content-image
  HelpCircle,     // mcq
  Zap,            // interactive
  Box             // component-page
} from 'lucide-react';
```

### Action Icons
```tsx
import {
  Plus,           // add/create
  Trash2,         // delete
  Edit2,          // edit
  Settings,       // settings
  Save,           // save
  Eye,            // preview
  RotateCcw       // undo/refresh
} from 'lucide-react';
```

### UI Icons
```tsx
import {
  Menu,           // menu
  Search,         // search
  ChevronDown,    // dropdown
  MoreVertical,   // more options
  X,              // close
  AlertCircle,    // error/warning
  CheckCircle     // success
} from 'lucide-react';
```

---

## Size Scale System

```tsx
// Standard sizes
<Icon size="xs" />  // 16px
<Icon size="sm" />  // 20px
<Icon size="md" />  // 24px
<Icon size="lg" />  // 32px
<Icon size="xl" />  // 40px
<Icon size="xxl" /> // 48px

// Or use pixels directly
<Icon size={24} />
<Icon size={32} />
```

---

## Color & Styling

```tsx
// Direct color
<Icon color="#2563eb" />

// CSS variables
<Icon color="var(--color-primary)" />

// CSS classes
<Icon className="text-blue-500" />

// currentColor (inherits from parent)
<div style={{ color: 'blue' }}>
  <Icon />  {/* Will be blue */}
</div>
```

---

## Animation Options

```tsx
// Spin animation
<Icon className="animate-spin" />

// Pulse animation
<Icon className="animate-pulse" />

// Bounce animation
<Icon className="animate-bounce" />

// Custom animation
<Icon style={{ animation: 'spin 1s linear infinite' }} />
```

---

## Stroke Width & Variants

```tsx
// Default strokeWidth is 2
<Icon strokeWidth={1} />  // Lighter
<Icon strokeWidth={2} />  // Normal
<Icon strokeWidth={3} />  // Heavier

// Note: Fill is set to 'none' by default for outline style
```

---

## Using with IconRenderer Component

```tsx
import IconRenderer from '@/components/common/IconRenderer';

// Basic usage
<IconRenderer name="welcome" size="md" />

// With color
<IconRenderer 
  name="add" 
  size="lg" 
  color="var(--color-primary)" 
/>

// With animation
<IconRenderer 
  name="loading" 
  size="sm" 
  animation="spin" 
/>

// With ARIA label
<IconRenderer 
  name="delete" 
  size="md" 
  ariaLabel="Delete item" 
/>
```

---

## Icon Map Reference

See `src/constants/iconMap.ts` for:
- `COMPONENT_CATEGORY_ICONS` - All component type icons
- `UI_ICONS` - Action and UI icons
- `ICON_SIZES` - Safe size presets
- `getIcon(name)` - Get icon by name with fallback
- `getIconSize(size)` - Get pixel value from preset

---

## Common Patterns

### Icon with Text
```tsx
<div className="flex items-center gap-2">
  <FileText size={20} />
  <span>Document</span>
</div>
```

### Icon Button
```tsx
<button className="p-2 hover:bg-gray-200 rounded">
  <Trash2 size={24} />
</button>
```

### Icon in Badge
```tsx
<div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
  <CheckCircle size={16} color="blue" />
  <span>Completed</span>
</div>
```

### Icon List
```tsx
<ul>
  {items.map(item => (
    <li key={item.id} className="flex items-center gap-2">
      <Icon name={item.icon} size="sm" />
      {item.label}
    </li>
  ))}
</ul>
```

---

## Accessibility

```tsx
// Add aria-label for icon-only buttons
<button aria-label="Delete">
  <Trash2 size={24} />
</button>

// Add title for hover tooltip
<div title="Save changes">
  <Save size={24} />
</div>

// Use semantic HTML
<nav aria-label="Main navigation">
  <Menu size={24} />
</nav>
```

---

## Theming with CSS Variables

```css
/* Define in your CSS */
:root {
  --color-primary: #2563eb;
  --color-success: #16a34a;
  --color-danger: #dc2626;
}
```

```tsx
// Use in components
<Icon color="var(--color-primary)" />
<Icon color="var(--color-success)" />
<Icon color="var(--color-danger)" />
```

---

## Icon Search in Lucide

Visit: https://lucide.dev

- Search for icons visually
- Copy component name
- View SVG source
- Get React import statements

---

## Fallback Icon

The `getIcon()` function defaults to `FileText` if icon not found:

```tsx
import { getIcon } from '@/constants/iconMap';

const icon = getIcon('nonexistent'); // Returns FileText
```

---

## Performance Tips

1. **Use IconRenderer** - Centralized, optimized rendering
2. **Size appropriate icons** - Don't scale oversized icons
3. **Limit animations** - Only animate when necessary
4. **Use CSS variables** - Better theme switching
5. **Tree-shake** - Vite automatically includes only used icons

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Icon not showing | Check icon name matches iconMap |
| Icon too small | Increase size prop |
| Icon wrong color | Use color prop or CSS variables |
| Icon blurry | Use standard sizes (16, 20, 24, 32, 40, 48) |

---

*Last Updated: Feb 19, 2026*
