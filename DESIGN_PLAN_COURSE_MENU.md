# Course Menu Template: Design-Only Theme Alignment Plan

## Template Overview

**Template Type:** `course-menu`  
**Category:** Navigation  
**Status:** Exists - Needs Design Refactor  
**File:** `src/components/templates/navigation/CourseMenu.tsx`

**Purpose:** Hierarchical navigation menu displaying course structure with support for nested items, active page indication, and optional icons per menu item.

---

## Current State Assessment

### Existing Implementation
- ✅ Component exists with Preview and Editor
- ✅ Supports hierarchical menu structure (children)
- ✅ Active page highlighting
- ✅ Dynamic indentation based on nesting depth
- ❌ All styles are inline
- ❌ Hardcoded colors throughout
- ❌ No BEM structure
- ❌ No dedicated CSS file
- ❌ No test coverage

### Hardcoded Colors Found
```tsx
background: isActive ? '#eff6ff' : 'transparent'
color: isActive ? '#2563eb' : '#374151'
borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent'
border: '1px solid #e2e8f0'
color: '#1e293b'
```

### Current Data Contract
```typescript
interface MenuItem {
  id: string;
  label: string;
  pageId?: string;
  icon?: string;
  children?: MenuItem[];
}

interface CourseMenuData {
  title?: string;
  items: MenuItem[];
  currentPageId?: string;
  showProgress?: boolean;
  showPageNumbers?: boolean;
}
```

**Registry Default Data:**
```typescript
{
  title: 'Course Contents',
  showProgress: true,
  showPageNumbers: true
}
```

---

## Design Specifications

### BEM Structure

**Root Blocks:**
- `.tpl-course-menu` - Preview container
- `.tpl-course-menu-editor` - Editor container

**Preview Elements:**
```css
.tpl-course-menu__title        /* Menu heading */
.tpl-course-menu__nav          /* Nav wrapper */
.tpl-course-menu__list         /* Menu items container */
.tpl-course-menu__item         /* Individual menu item */
.tpl-course-menu__item--active /* Active/current page */
.tpl-course-menu__item--nested /* Item with children */
.tpl-course-menu__item-content /* Item inner wrapper */
.tpl-course-menu__icon         /* Item icon */
.tpl-course-menu__label        /* Item text label */
.tpl-course-menu__progress     /* Optional progress indicator */
.tpl-course-menu__empty        /* Empty state */
```

**Editor Elements:**
```css
.tpl-course-menu-editor__header
.tpl-course-menu-editor__field
.tpl-course-menu-editor__label
.tpl-course-menu-editor__input
.tpl-course-menu-editor__checkbox
.tpl-course-menu-editor__items
.tpl-course-menu-editor__item-row
.tpl-course-menu-editor__icon-input
.tpl-course-menu-editor__label-input
.tpl-course-menu-editor__remove-btn
.tpl-course-menu-editor__add-btn
```

### Theme Token Mapping

| Element | Token | Usage |
|---------|-------|-------|
| Container background | `--theme-background` | Root container |
| Title text | `--theme-text` | Menu title |
| Item default text | `--theme-text` | Non-active items |
| Item default background | `transparent` | Non-active items |
| Active item background | `--theme-surface` | Current page |
| Active item text | `--theme-primary` | Current page text |
| Active item border | `--theme-primary` | Left border accent |
| Hover background | `--theme-surface` | Hover state |
| Item border | `--theme-border` | Separators if needed |
| Icon color | `--theme-text-secondary` | Default icon color |
| Empty state text | `--theme-text-secondary` | No items message |

### Visual Features

**Hierarchical Indentation:**
- Level 0 (root): `padding-left: 14px`
- Level 1: `padding-left: 34px` (14 + 20)
- Level 2: `padding-left: 54px` (14 + 40)
- Formula: `14 + (depth × 20)px`

**Active State Indicators:**
- Left border: `3px solid var(--theme-primary)`
- Background: `var(--theme-surface)`
- Font weight: `600`
- Text color: `var(--theme-primary)`

**Interactive States:**
- Hover: `background: var(--theme-surface)`, `cursor: pointer`
- Focus: `outline: 2px solid var(--theme-primary)`, `outline-offset: 2px`
- Disabled: (not applicable for menu items)

**Typography:**
- Title: `16px`, `font-weight: 600`, `--theme-text`
- Menu item: `14px`, `font-weight: 400`, `--theme-text`
- Active item: `14px`, `font-weight: 600`, `--theme-primary`

**Spacing:**
- Title margin-bottom: `12px`
- Item padding: `10px 14px`
- Item gap: `2px`
- Icon-text gap: `8px`

---

## Functionality Specifications

### Preview Behavior
1. **Render Menu Items:**
   - Display items in hierarchical order
   - Support unlimited nesting depth
   - Apply dynamic indentation based on depth

2. **Active Page Highlighting:**
   - Compare `item.pageId` with `data.currentPageId`
   - Apply active state styling when match found
   - Only one item can be active at a time

3. **Icon Display:**
   - Show icon if `item.icon` provided
   - Support emoji or Lucide icon names
   - Left-align icon with label

4. **Interactive Behavior:**
   - Items with `pageId` are clickable
   - Items without `pageId` act as section headers (non-clickable)
   - No actual navigation (handled by parent application)

5. **Empty State:**
   - Show message when `items` array is empty
   - "No menu items configured"

### Editor Behavior
1. **Title Field:**
   - Text input for menu title
   - Placeholder: "Course Menu"
   - Optional field

2. **Menu Item Management:**
   - Add new items button
   - Remove item button (X) per item
   - Reorder items (future enhancement - not in this iteration)

3. **Item Fields:**
   - Icon input (40px width, centered)
   - Label input (flexible width)
   - Each item has unique ID

4. **Data Updates:**
   - Call `onChange` with updated data on every change
   - Preserve item IDs during updates
   - Generate unique IDs for new items: `mi-${Date.now()}`

### Accessibility Requirements
- Semantic `<nav>` element
- `role="navigation"` on nav wrapper
- `aria-label` on nav: "Course menu"
- `aria-current="page"` on active item
- Keyboard navigation support (Tab, Enter/Space)
- Focus visible states
- Screen reader friendly labels

---

## Responsive Specifications

### Desktop (>768px)
- Standard padding and spacing
- Icon size: 20px
- Font size: 14px

### Mobile (≤768px)
- Maintain padding and indentation
- Ensure tap targets ≥44px height
- Font size: 14px (unchanged)
- Reduce horizontal padding if needed: `10px`

---

## Test Cases (22 Tests)

### Preview Tests (12)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title when provided
   - ✓ Does not render title when not provided
   - ✓ Renders menu items from data

2. **Menu Item Display**
   - ✓ Displays item label correctly
   - ✓ Displays item icon when provided
   - ✓ Does not display icon when not provided
   - ✓ Renders nested items (children)

3. **Active State**
   - ✓ Highlights active item based on currentPageId
   - ✓ Only one item is active at a time
   - ✓ Applies active BEM modifier class
   - ✓ Shows active border on active item

4. **Hierarchy & Indentation**
   - ✓ Root level items have base indentation
   - ✓ Nested items have increased indentation
   - ✓ Multi-level nesting renders correctly (3+ levels)

5. **Empty State**
   - ✓ Shows empty state when no items
   - ✓ Empty state has appropriate message

6. **BEM Classes**
   - ✓ Root has correct BEM class
   - ✓ Items have correct BEM classes
   - ✓ Active modifier applied correctly

7. **Click Interaction**
   - ✓ Items with pageId are clickable
   - ✓ Items without pageId are not clickable (section headers)

### Editor Tests (10)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title input field
   - ✓ Displays all menu items from data

2. **Title Field**
   - ✓ Title input shows current value
   - ✓ Title input updates on change
   - ✓ Calls onChange with new title

3. **Item Management**
   - ✓ Add item button adds new item to list
   - ✓ Remove button removes item from list
   - ✓ New items have unique IDs

4. **Item Fields**
   - ✓ Icon input displays and updates
   - ✓ Label input displays and updates
   - ✓ onChange called with updated items

5. **BEM Classes**
   - ✓ Editor root has correct BEM class
   - ✓ Editor elements have correct BEM classes

---

## Implementation Checklist

### Phase 1: CSS Extraction
- [ ] Create `CourseMenu.css`
- [ ] Define all BEM classes
- [ ] Map theme tokens to visual properties
- [ ] Implement responsive breakpoints
- [ ] Add focus/hover/active states

### Phase 2: TSX Refactor
- [ ] Import CSS file
- [ ] Replace inline styles with BEM classes
- [ ] Implement dynamic indentation with CSS custom properties
- [ ] Add semantic HTML (nav, aria attributes)
- [ ] Preserve data contract and callbacks

### Phase 3: Test Implementation
- [ ] Create `CourseMenu.test.tsx`
- [ ] Implement all 22 test cases
- [ ] Test hierarchical rendering
- [ ] Test active state logic
- [ ] Test editor interactions

### Phase 4: Validation
- [ ] All tests passing
- [ ] No hardcoded colors
- [ ] No inline styles (except dynamic indentation)
- [ ] TypeScript errors resolved
- [ ] Visual verification in UI

---

## Files to Create/Update

**New Files:**
- `src/components/templates/navigation/CourseMenu.css`
- `src/components/templates/navigation/CourseMenu.test.tsx`

**Updated Files:**
- `src/components/templates/navigation/CourseMenu.tsx`

---

## Success Criteria

- ✅ All inline styles removed (except dynamic indentation)
- ✅ All hardcoded colors replaced with theme tokens
- ✅ BEM classes implemented throughout
- ✅ 22 tests passing
- ✅ No TypeScript errors
- ✅ Visual parity with current design maintained
- ✅ Accessibility requirements met
- ✅ Responsive behavior verified

---

**Document Version:** 1.0  
**Created:** March 8, 2026  
**Template Status:** Existing - Refactor Required  
**Estimated Effort:** 4-6 hours
