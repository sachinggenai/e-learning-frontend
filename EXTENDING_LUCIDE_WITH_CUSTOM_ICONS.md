# Extending Lucide with Custom Icons

## Overview

While Lucide provides 400+ professional icons, you may need custom icons specific to your application. This guide explains how to extend the system with custom SVG icons while maintaining consistency.

---

## When to Add Custom Icons

✅ **DO add custom icons for:**
- Domain-specific concepts (course types, content categories)
- Unique branding elements
- Icons not available in Lucide (rare)
- Special state indicators

❌ **DON'T add custom icons for:**
- Generic actions (save, delete, etc.) - use Lucide
- Icons already in Lucide library
- Duplicate functionality
- Experimental/temporary UI

---

## Adding Custom SVG Icons

### Step 1: Create SVG File

Place custom icons in `src/assets/icons/` directory:

```
src/
├── assets/
│   └── icons/
│       ├── custom-course-type.svg
│       ├── custom-feature.svg
│       └── custom-badge.svg
├── constants/
│   └── iconMap.ts
└── components/
    └── common/
        └── IconRenderer.tsx
```

### Step 2: Design Consistency

Ensure custom SVGs match Lucide style:

```svg
<!-- Template: 24x24 viewBox, stroke-based, consistent stroke width -->
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Line width should be consistent (2px) -->
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
  <path d="M12 6v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### Step 3: Update Icon Map

Create custom icon components:

```tsx
// src/constants/iconMap.ts
import { lazy, Suspense } from 'react';

// Lazy load custom icons
const CustomCourseTypeIcon = lazy(() => 
  import('@/assets/icons/custom-course-type.svg?react')
);
const CustomFeatureIcon = lazy(() => 
  import('@/assets/icons/custom-feature.svg?react')
);

// Add to icon map
export const CUSTOM_ICONS: Record<string, () => JSX.Element> = {
  'custom-course': () => (
    <Suspense fallback={<div />}>
      <CustomCourseTypeIcon />
    </Suspense>
  ),
  'custom-feature': () => (
    <Suspense fallback={<div />}>
      <CustomFeatureIcon />
    </Suspense>
  ),
};

// Update getIcon function
export const getIcon = (name: string | undefined) => {
  if (!name) return FileText;
  
  // Check custom icons first
  if (name in CUSTOM_ICONS) {
    return CUSTOM_ICONS[name as keyof typeof CUSTOM_ICONS];
  }
  
  // Check UI icons
  if (name in UI_ICONS) {
    return UI_ICONS[name as keyof typeof UI_ICONS];
  }
  
  // Check component icons
  if (name in COMPONENT_CATEGORY_ICONS) {
    return COMPONENT_CATEGORY_ICONS[name as keyof typeof COMPONENT_CATEGORY_ICONS];
  }
  
  // Fallback
  return FileText;
};
```

---

## Vite SVG Configuration

Update `vite.config.ts` to support SVG imports as React components:

```tsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: true,
        titleProp: true,
      },
    }),
  ],
});
```

---

## Creating Custom Icon Components

### Method 1: Inline SVG Component

```tsx
// src/components/icons/CustomCourseIcon.tsx
import React from 'react';

interface CustomCourseIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const CustomCourseIcon: React.FC<CustomCourseIconProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Your custom SVG path here */}
    <path
      d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
```

### Method 2: Using SVGR

```tsx
// src/assets/icons/custom-badge.svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M..." stroke="currentColor" strokeWidth="2"/>
</svg>

// Import as React component
import CustomBadgeIcon from '@/assets/icons/custom-badge.svg?react';

// Use like any other icon
<CustomBadgeIcon width={24} height={24} />
```

---

## Maintaining Consistency

### Icon Design Principles

```
┌─────────────────────────────────────────┐
│ Design System Checklist for Custom Icons│
├─────────────────────────────────────────┤
│ ✅ 24x24 viewBox (can scale to any size)│
│ ✅ 2px stroke width (consistent)        │
│ ✅ 4px border radius (if applicable)    │
│ ✅ Rounded stroke caps/joins            │
│ ✅ Filled area center-weighted          │
│ ✅ currentColor for theming             │
│ ✅ Negative space clarity               │
│ ✅ No thin lines < 2px                  │
│ ✅ Semantic, recognizable shapes        │
│ ✅ Balanced visual weight               │
└─────────────────────────────────────────┘
```

### Stroke Width Consistency

```
DO NOT do this:
├─ Mix 1px and 2px strokes
├─ Use filled icons alongside outlined
├─ Add drop shadows or effects
└─ Create overly complex paths

DO do this:
├─ Keep all strokes at 2px
├─ Use outline style consistently
├─ Keep design simple and readable
└─ Test at multiple sizes (16, 24, 32)
```

---

## Theming Custom Icons

### Using CSS Variables

```tsx
// Custom icon with theme support
const ThemedCustomIcon = ({ colorVar = '--color-primary' }) => {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24}>
      <path
        d="M12 2l3 7h7l-5 4 2 7-7-5-7 5 2-7-5-4h7z"
        stroke={`var(${colorVar})`}
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
};

// Usage
<ThemedCustomIcon colorVar="--color-success" />
```

### Supporting Dark/Light Modes

```tsx
const AdaptiveCustomIcon = ({ isDarkMode }) => {
  const color = isDarkMode ? '#ffffff' : '#333333';
  
  return (
    <svg viewBox="0 0 24 24" width={24} height={24}>
      <path
        d="M..."
        stroke={color}
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
};
```

---

## Animating Custom Icons

### SVG Animation

```tsx
// Custom spinning icon
const SpinningCustomIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width={24} 
    height={24}
    className="animate-spin"
  >
    <g>
      <path
        d="M..."
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      />
    </g>
  </svg>
);

// CSS animation
<style>
  @keyframes customSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
```

---

## Documentation Template

When adding custom icons, create documentation:

```markdown
# Custom Icon: [Icon Name]

## Overview
- **Purpose:** What this icon represents
- **Used in:** Where it appears
- **Designer:** Who created it
- **Date added:** When added

## Specifications
- **Viewbox:** 0 0 24 24
- **Stroke width:** 2px
- **Color:** currentColor (CSS variable support)
- **Animation:** Yes/No

## Usages
- Location 1: Template selector
- Location 2: Menu bar
- Location 3: Settings panel

## Variations
- Light theme: N/A
- Dark theme: N/A
- Hover state: N/A

## Future considerations
- Any planned changes?
```

---

## Performance Considerations

### Lazy Loading

```tsx
const CustomIcon = lazy(() => import('./CustomIcon'));

<Suspense fallback={<div style={{ width: 24, height: 24 }} />}>
  <CustomIcon />
</Suspense>
```

### Optimization

```tsx
// Use memo for frequently rendered icons
const MemoizedCustomIcon = memo(({ size = 24, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    {/* SVG content */}
  </svg>
));
```

---

## Testing Custom Icons

```tsx
// Test file for custom icons
describe('CustomIcons', () => {
  it('should render custom icon with correct size', () => {
    const { container } = render(
      <CustomCourseIcon size={32} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
  });

  it('should support color prop', () => {
    const { container } = render(
      <CustomCourseIcon color="red" />
    );
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke', 'red');
  });

  it('should be accessible', () => {
    const { container } = render(
      <CustomCourseIcon title="Course icon" />
    );
    expect(container).toBeInTheDocument();
  });
});
```

---

## Maintenance Checklist

- ✅ Document all custom icons
- ✅ Maintain style consistency
- ✅ Test animations
- ✅ Verify accessibility
- ✅ Check color theming
- ✅ Optimize SVG performance
- ✅ Update icon map
- ✅ Add unit tests
- ✅ Review with design team
- ✅ Update style guide

---

## Common Pitfalls to Avoid

| ❌ Mistake | ✅ Solution |
|-----------|-----------|
| Inconsistent stroke width | Keep all strokes at 2px |
| Overly complex design | Simplify to essential shapes |
| Using fill instead of stroke | Use outline style consistently |
| Forgetting currentColor | Always support color variables |
| Missing accessibility | Add title/aria-label support |
| No animation support | Build for smooth animations |
| Hard-coded colors | Use CSS variables |
| Not documenting | Add clear documentation |

---

## Future Enhancements

- Icon generation tool
- Icon builder UI
- Animation presets
- Icon usage analytics
- Auto-optimization
- Icon versioning system
- Brand variant support

---

*Last Updated: Feb 19, 2026*
