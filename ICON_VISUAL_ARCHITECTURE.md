# Icon System: Visual Architecture & Organization

## System Overview

```
Icon System Architecture
│
├─ Icon Mapping & Configuration
│  ├─ Component Category Icons (Templates)
│  ├─ UI Action Icons
│  └─ Size & Animation Presets
│
├─ Universal Renderer
│  ├─ IconRenderer Component
│  ├─ Styling & Theming
│  └─ Animation Support
│
└─ Integration Points
   ├─ Template Selector
   ├─ Page Manager
   ├─ Component Picker
   ├─ Menu Bar
   └─ UI Components
```

---

## Icon Categories

### 1. Template Type Icons

Represent different page template types in courses.

```
Welcome         →  Home icon
                   🎓 Introduces course/module

Content Text    →  FileText icon
                   📝 Text-based learning content

Content Video   →  Video icon
                   🎥 Video embedded content

Content Image   →  Image icon
                   🖼️  Image-based content

MCQ Quiz        →  HelpCircle icon
                   ❓ Multiple choice questions

Interactive     →  Zap icon
                   ⚡ Interactive activities

Component Page  →  Box icon
                   📦 Reusable components
```

### 2. Action Icons

Standard actions for UI interaction.

```
Create/Add      →  Plus icon
                   ➕ Add new item

Edit            →  Edit2 icon
                   ✏️  Modify existing item

Delete          →  Trash2 icon
                   🗑️  Remove item

Save            →  Save icon
                   💾 Persist changes

Preview         →  Eye icon
                   👁️  View result

Settings        →  Settings icon
                   ⚙️  Configure

Undo/Refresh    →  RotateCcw icon
                   🔄 Go back/reload
```

### 3. UI Icon

Navigation and interface elements.

```
Menu            →  Menu icon
                   ☰ Open navigation

Search          →  Search icon
                   🔍 Find items

Close           →  X icon
                   ✕ Dismiss/exit

More Options    →  MoreVertical icon
                   ⋮ Additional actions

Dropdown       →  ChevronDown icon
                   ▼ Expand menu

Success        →  CheckCircle icon
                   ✔️ Completed

Error/Warning  →  AlertCircle icon
                   ⚠️ Alert/problem
```

---

## Size Scale System

```
┌─────────────────────────────────┬─────────┐
│ Size Name                       │ Pixels  │
├─────────────────────────────────┼─────────┤
│ Extra Small (xs)                │ 16px    │
│ Purpose: Inline badges, small UI│         │
├─────────────────────────────────┼─────────┤
│ Small (sm)                      │ 20px    │
│ Purpose: List items, buttons    │         │
├─────────────────────────────────┼─────────┤
│ Medium (md) - DEFAULT           │ 24px    │
│ Purpose: Card icons, menu items │         │
├─────────────────────────────────┼─────────┤
│ Large (lg)                      │ 32px    │
│ Purpose: Headers, emphasis      │         │
├─────────────────────────────────┼─────────┤
│ Extra Large (xl)                │ 40px    │
│ Purpose: Hero sections, dialogs │         │
├─────────────────────────────────┼─────────┤
│ Double Extra Large (xxl)        │ 48px    │
│ Purpose: Modal headers, focus   │         │
└─────────────────────────────────┴─────────┘
```

### Visual Representation

```
xs   sm   md   lg   xl   xxl
●    ●    ●    ●    ●    ●
     ●    ●    ●    ●    ●
          ●    ●    ●    ●
               ●    ●    ●
                    ●    ●
                         ●
```

---

## Color Theming System

### Semantic Colors

```
Primary Brand       → --color-primary
                      Used for: CTAs, highlights, selected states
                      Default: #2563eb (Blue)

Success             → --color-success
                      Used for: Completed, valid, checkmarks
                      Default: #16a34a (Green)

Warning/Attention   → --color-warning
                      Used for: Alerts, caution, disabled
                      Default: #ca8a04 (Amber)

Danger/Error        → --color-danger
                      Used for: Errors, delete, critical actions
                      Default: #dc2626 (Red)

Text Primary        → --text-primary
                      Used for: Main content, headers
                      Default: #333333 (Dark gray)

Text Secondary      → --text-secondary
                      Used for: Descriptions, metadata
                      Default: #666666 (Medium gray)

Text Muted          → --text-muted
                      Used for: Disabled, hints, placeholders
                      Default: #999999 (Light gray)
```

### Color Application in Icons

```tsx
<IconRenderer name="success" color="var(--color-success)" />
<IconRenderer name="warning" color="var(--color-warning)" />
<IconRenderer name="error" color="var(--color-danger)" />
<IconRenderer name="primary" color="var(--color-primary)" />
```

---

## Animation System

### Available Animations

```
Spin (Loading)
├─ Rotation speed: 1s
├─ Timing: linear
├─ Use case: Loading indicators, processing
└─ Example: <Icon animation="spin" />

Pulse (Attention)
├─ Fade speed: 2s
├─ Timing: ease-in-out
├─ Use case: New items, notifications, focus
└─ Example: <Icon animation="pulse" />

Bounce (Emphasis)
├─ Vertical bounce: 1s
├─ Height: 2px
├─ Use case: Call-to-action, alerts
└─ Example: <Icon animation="bounce" />
```

### Animation Visual Reference

```
Spin:     ↻ ↻ ↻ ↻ ↻ (continuous rotation)
Pulse:    ● → ◐ → ○ → ◑ → ● (fade in/out)
Bounce:   ↑ ↑ ↑ ↑ ↑ (vertical movement)
```

---

## Icon State System

### Interactive States

```
Default State
├─ Color: Standard (gray or primary)
├─ Size: Standard (24px)
└─ Animation: None

Hover State
├─ Color: Darker/brighter variation
├─ Size: Slightly larger (optional)
└─ Animation: Subtle scale transform

Active/Selected State
├─ Color: Primary color
├─ Size: Standard
└─ Animation: Pulse (optional)

Disabled State
├─ Color: Muted/light gray
├─ Opacity: 0.5
└─ Animation: None (no interaction)

Loading State
├─ Color: Primary
├─ Animation: Spin (continuous)
└─ Cursor: Not-allowed
```

---

## Accessibility Architecture

### Semantic Structure

```
Button with Icon Only
├─ Aria-label: Required
├─ Title: Optional (tooltip)
└─ Role: button

Icon with Text
├─ aria-label: Optional (text provides meaning)
├─ Role: inherited from parent
└─ Order: Icon before or after text

Icon in Lists
├─ aria-label: May be required
├─ List semantics: Preserved
└─ Keyboard navigation: Supported
```

### Color Accessibility

```
Icon styling should NOT rely solely on color
├─ Use text labels with icons when possible
├─ Use shape/pattern differentiation
├─ Provide aria-labels for icon-only UI
└─ Maintain sufficient contrast ratio (WCAG AA)

Minimum Contrast Requirements
├─ Text (4.5:1 ratio): Normal text
├─ Graphics (3:1 ratio): Icons
└─ Large text (3:1 ratio): 18pt+ or bold 14pt+
```

---

## Visual Consistency Guidelines

### Icon Alignment

```
Inline with text:     ●│●│●
Button/icon combo:    [●] Label
Card with icon:       ┌──────┐
                      │ ●    │
                      │ Text │
                      └──────┘
```

### Spacing Around Icons

```
Icon with text:  icon + 8px + text
Icon in button:  padding 8-12px around icon
Icon in list:    icon + 12px + list item
Icon in card:    icon margin bottom 8px
```

### Stroke Weight Consistency

```
ALL Lucide icons use consistent stroke weight (strokeWidth=2)
This ensures visual consistency across all icons
└─ Customizable if design requires variation
```

---

## Implementation Hierarchy

```
Level 1: Core (Required)
└─ Lucide React library
└─ Icon map configuration
└─ IconRenderer component

Level 2: Integration (First Wave)
├─ Template selector
├─ Page manager
└─ Action buttons

Level 3: Enhancement (Second Wave)
├─ Themed variations
├─ Animations
└─ Custom icons

Level 4: Advanced (Future)
├─ Icon search UI
├─ Animation library
├─ Icon documentation portal
└─ Third-party integrations
```

---

## Naming Conventions

### Icon Names
- **Format:** camelCase or kebab-case (as needed)
- **Clear intent:** `delete` not `trash` (although both used)
- **Consistency:** Same concept, same icon name
- Example: `contentText`, `content-text`, `add`, `plus`

### Component Names
- **IconRenderer** - Main component
- **FallbackIcon** - Unavailable icon display
- **IconButton** - Icon wrapped in button
- **IconBadge** - Icon with label/counter

### CSS Classes
- `.icon-renderer` - Main class
- `.icon-renderer--spin` - Animation class
- `.icon-container` - Wrapper class
- `.icon-label` - Text alongside icon

---

## Visual Audit Checklist

- ✅ All icons same visual weight
- ✅ Icons align properly with text
- ✅ Animations smooth and performant
- ✅ Colors meet accessibility standards
- ✅ Size consistency across categories
- ✅ No pixelation at standard sizes
- ✅ Hover states clearly indicated
- ✅ Disabled states clearly distinguished

---

*Last Updated: Feb 19, 2026*
