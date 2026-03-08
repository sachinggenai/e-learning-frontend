# Resources & Downloads Template: Design-Only Theme Alignment Plan

## Template Overview

**Template Type:** `resources-downloads`  
**Category:** Navigation  
**Status:** Exists - Needs Design Refactor  
**File:** `src/components/templates/navigation/ResourcesDownloads.tsx`

**Purpose:** Display downloadable files and reference links with file type indicators, descriptions, and optional file size information. Provides learners with supplementary materials and external resources.

---

## Current State Assessment

### Existing Implementation
- ✅ Component exists with Preview and Editor
- ✅ Supports multiple resource types (pdf, doc, link, video, image, other)
- ✅ Displays resource title, description, type badge, and file size
- ✅ Resources render as clickable links
- ❌ All styles are inline
- ❌ Hardcoded colors throughout
- ❌ Emoji icons instead of Lucide icons
- ❌ No BEM structure
- ❌ No dedicated CSS file
- ❌ No test coverage

### Hardcoded Colors Found
```tsx
color: '#64748b'
border: '1px solid #e2e8f0'
background: '#fff', '#f1f5f9', '#f9fafb'
color: '#1e293b', '#475569', '#94a3b8', '#ef4444'
```

### Emoji Icons to Replace
```typescript
TYPE_ICONS = {
  pdf: '📄',
  doc: '📝',
  link: '🔗',
  video: '🎬',
  image: '🖼️',
  other: '📎',
}
```

### Current Data Contract
```typescript
interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'pdf' | 'doc' | 'link' | 'video' | 'image' | 'other';
  fileSize?: string;
}

interface ResourcesDownloadsData {
  title?: string;
  description?: string;
  resources: Resource[];
}
```

**Registry Default Data:**
```typescript
{
  title: 'Resources',
  resources: [
    {
      id: 'res-1',
      title: 'Course Handbook',
      type: 'pdf',
      url: '',
      description: ''
    }
  ]
}
```

---

## Design Specifications

### BEM Structure

**Root Blocks:**
- `.tpl-resources-downloads` - Preview container
- `.tpl-resources-downloads-editor` - Editor container

**Preview Elements:**
```css
.tpl-resources-downloads__header
.tpl-resources-downloads__title
.tpl-resources-downloads__description
.tpl-resources-downloads__list         /* Resources container */
.tpl-resources-downloads__resource     /* Resource card/link */
.tpl-resources-downloads__resource-icon
.tpl-resources-downloads__resource-content /* Title + description wrapper */
.tpl-resources-downloads__resource-title
.tpl-resources-downloads__resource-description
.tpl-resources-downloads__resource-meta /* Type badge + file size wrapper */
.tpl-resources-downloads__type-badge
.tpl-resources-downloads__type-badge--pdf
.tpl-resources-downloads__type-badge--doc
.tpl-resources-downloads__type-badge--link
.tpl-resources-downloads__type-badge--video
.tpl-resources-downloads__type-badge--image
.tpl-resources-downloads__type-badge--other
.tpl-resources-downloads__file-size
.tpl-resources-downloads__empty        /* Empty state */
```

**Editor Elements:**
```css
.tpl-resources-downloads-editor__header
.tpl-resources-downloads-editor__field
.tpl-resources-downloads-editor__label
.tpl-resources-downloads-editor__input
.tpl-resources-downloads-editor__resources    /* Resources list */
.tpl-resources-downloads-editor__resource-card
.tpl-resources-downloads-editor__resource-header
.tpl-resources-downloads-editor__resource-number
.tpl-resources-downloads-editor__resource-fields
.tpl-resources-downloads-editor__type-selector
.tpl-resources-downloads-editor__remove-btn
.tpl-resources-downloads-editor__add-btn
```

### Lucide Icon Mapping

Replace emoji with Lucide icons:
```typescript
const TYPE_ICONS = {
  pdf: FileText,      // lucide-react
  doc: FileText,      // lucide-react
  link: Link,         // lucide-react
  video: Video,       // lucide-react
  image: Image,       // lucide-react
  other: Paperclip,   // lucide-react
}
```

### Theme Token Mapping

| Element | Token | Usage |
|---------|-------|-------|
| Container background | `--theme-background` | Root container |
| Title text | `--theme-text` | Main title |
| Description text | `--theme-text-secondary` | Header description |
| Resource card background | `--theme-background` | Card background |
| Resource card border | `--theme-border` | Card border |
| Resource card hover border | `--theme-primary` | Hover state border |
| Icon color | `--theme-primary` | Resource icons |
| Title text | `--theme-text` | Resource title |
| Description text | `--theme-text-secondary` | Resource description |
| Type badge background | `--theme-surface` | Badge background |
| Type badge text | `--theme-text-secondary` | Badge text |
| File size text | `--theme-text-secondary` | File size |
| Remove button | `--theme-error` | Remove button in editor |
| Empty state text | `--theme-text-secondary` | No resources message |

### Visual Specifications

**Resource Card:**
- Display: Flex row
- Align-items: center
- Gap: `14px`
- Padding: `14px 16px`
- Border: `1px solid var(--theme-border)`
- Border-radius: `10px`
- Background: `var(--theme-background)`
- Transition: `all 0.2s`
- Text-decoration: none
- Color: inherit

**Resource Card Hover:**
- Border-color: `var(--theme-primary)`
- Box-shadow: `0 2px 8px rgba(37, 99, 235, 0.12)`
- Transform: `translateY(-1px)`

**Resource Card Focus:**
- Outline: `2px solid var(--theme-primary)`
- Outline-offset: `2px`

**Resource Icon:**
- Size: `28px`
- Color: `var(--theme-primary)`
- Flex-shrink: 0

**Resource Content:**
- Flex: 1
- Min-width: 0
- Display: Flex column
- Gap: `4px`

**Resource Title:**
- Font-size: `14px`
- Font-weight: `600`
- Color: `var(--theme-text)`
- White-space: nowrap
- Overflow: hidden
- Text-overflow: ellipsis

**Resource Description:**
- Font-size: `12px`
- Color: `var(--theme-text-secondary)`
- Line-height: `1.4`
- Display: -webkit-box
- -webkit-line-clamp: 2
- -webkit-box-orient: vertical
- Overflow: hidden

**Resource Meta:**
- Display: Flex column
- Align-items: flex-end
- Gap: `4px`
- Flex-shrink: 0

**Type Badge:**
- Font-size: `11px`
- Padding: `2px 8px`
- Border-radius: `12px`
- Background: `var(--theme-surface)`
- Color: `var(--theme-text-secondary)`
- Text-transform: uppercase
- Font-weight: `500`
- Letter-spacing: `0.5px`

**File Size:**
- Font-size: `11px`
- Color: `var(--theme-text-secondary)`
- Font-weight: `400`

**Header:**
- Title: `20px`, `font-weight: 600`, margin-bottom `4px`
- Description: `14px`, `font-weight: 400`, `--theme-text-secondary`, margin-bottom `16px`

**List:**
- Display: Flex column
- Gap: `10px`

**Empty State:**
- Text-align: center
- Color: `var(--theme-text-secondary)`
- Padding: `24px`
- Font-size: `14px`

**Spacing:**
- Section margin-bottom: `16px`
- Resource card gap: `10px`
- Internal card padding: `14px 16px`
- Icon-content gap: `14px`
- Content internal gap: `4px`
- Meta internal gap: `4px`

**Typography:**
- Title: `20px`, `font-weight: 600`
- Description: `14px`, `font-weight: 400`
- Resource title: `14px`, `font-weight: 600`
- Resource description: `12px`, `font-weight: 400`
- Type badge: `11px`, `font-weight: 500`, uppercase
- File size: `11px`, `font-weight: 400`

---

## Functionality Specifications

### Preview Behavior
1. **Render Resources:**
   - Display resources as clickable links
   - Each resource is an `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"`
   - Apply hover and focus statesfor keyboard navigation

2. **Icon Display:**
   - Show Lucide icon based on resource type
   - Consistent size (28px) and color (primary)

3. **Type Badge:**
   - Display resource type as uppercase badge
   - Consistent styling across all types

4. **File Size:**
   - Show file size if provided
   - Format: "2.5 MB", "150 KB", etc.

5. **Empty State:**
   - Show "No resources added yet." when resources array is empty

6. **External Links:**
   - All links open in new tab
   - Security: `rel="noopener noreferrer"`

### Editor Behavior
1. **Title/Description Fields:**
   - Text input for title
   - Text input for description
   - Both optional

2. **Resource Management:**
   - Add new resource button
   - Remove resource button per item
   - Resources displayed in cards

3. **Resource Fields:**
   - Title input (required)
   - Description input (optional)
   - URL input (required)
   - Type selector (dropdown with 6 types)
   - File size input (optional)

4. **Data Updates:**
   - Call `onChange` with updated data on every change
   - Generate unique IDs for new resources: `res-${Date.now()}`
   - Preserve resource order

### Accessibility Requirements
- Semantic `<section>` wrapper
- Resource cards: Proper `<a>` elements with descriptive text
- ARIA labels: `aria-label="Download {title}"` on each link
- Type badge: `aria-label="{type} file type"`
- Keyboard navigation: Tab through resources, Enter/Space to activate
- Focus visible states on all links
- Screen reader: Announce "opens in new tab" for external links
- Empty state: Appropriate ARIA attributes

---

## Responsive Specifications

### Desktop (>768px)
- Resource cards: Standard padding and sizing
- Icon size: 28px
- Font sizes: Standard
- Max-width: 700px

### Mobile (≤768px)
- Resource cards: Reduce padding to `12px 14px`
- Icon size: 24px
- Meta section: May stack on very small screens
- Ensure tap targets ≥44px height
- Font sizes: Maintain for readability

---

## Test Cases (21 Tests)

### Preview Tests (12)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title when provided
   - ✓ Renders description when provided
   - ✓ Does not render title/description when not provided

2. **Resource Display**
   - ✓ Renders all resources from data
   - ✓ Each resource displays title correctly
   - ✓ Each resource displays description when provided
   - ✓ Resource links are clickable
   - ✓ Resource links have correct href
   - ✓ Resource links open in new tab (target="_blank")

3. **Icons and Badges**
   - ✓ Displays correct Lucide icon for each resource type
   - ✓ Type badge displays correct type text
   - ✓ Type badge is uppercase
   - ✓ File size displays when provided

4. **Empty State**
   - ✓ Shows empty state when no resources
   - ✓ Empty state has appropriate message

5. **BEM Classes**
   - ✓ Root has correct BEM class
   - ✓ Resource cards have correct BEM classes
   - ✓ Type badges have correct type modifiers

### Editor Tests (9)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title input
   - ✓ Renders description input
   - ✓ Displays all resources from data

2. **Title/Description Fields**
   - ✓ Title input shows current value and updates
   - ✓ Description input shows current value and updates
   - ✓ onChange called with new values

3. **Resource Management**
   - ✓ Add resource button adds new resource
   - ✓ Remove button removes resource
   - ✓ New resources have unique IDs

4. **Resource Fields**
   - ✓ Title input displays and updates for each resource
   - ✓ Description input displays and updates
   - ✓ URL input displays and updates
   - ✓ Type selector displays current type
   - ✓ Type selector updates on change
   - ✓ File size input displays and updates

5. **BEM Classes**
   - ✓ Editor root has correct BEM class
   - ✓ Editor elements have correct BEM classes

---

## Implementation Checklist

### Phase 1: Icon Migration
- [ ] Import Lucide icon components
- [ ] Create icon mapping object (FileText, Video, Link, etc.)
- [ ] Replace emoji strings with Lucide components
- [ ] Test icon rendering for all resource types

### Phase 2: CSS Extraction
- [ ] Create `ResourcesDownloads.css`
- [ ] Define all BEM classes
- [ ] Map theme tokens to visual properties
- [ ] Implement responsive breakpoints
- [ ] Add hover/focus/active states
- [ ] Style type badge variants

### Phase 3: TSX Refactor
- [ ] Import CSS file
- [ ] Replace inline styles with BEM classes
- [ ] Update icon rendering to use Lucide components
- [ ] Add semantic HTML and ARIA attributes
- [ ] Preserve data contract and callbacks
- [ ] Test external link behavior

### Phase 4: Test Implementation
- [ ] Create `ResourcesDownloads.test.tsx`
- [ ] Implement all 21 test cases
- [ ] Test resource rendering with different types
- [ ] Test editor interactions
- [ ] Test empty state
- [ ] Test link behavior (new tab)

### Phase 5: Validation
- [ ] All tests passing
- [ ] No hardcoded colors
- [ ] All emoji replaced with Lucide icons
- [ ] No inline styles
- [ ] TypeScript errors resolved
- [ ] Visual verification in UI
- [ ] Accessibility verification

---

## Files to Create/Update

**New Files:**
- `src/components/templates/navigation/ResourcesDownloads.css`
- `src/components/templates/navigation/ResourcesDownloads.test.tsx`

**Updated Files:**
- `src/components/templates/navigation/ResourcesDownloads.tsx`

---

## Success Criteria

- ✅ All emoji icons replaced with Lucide icons
- ✅ All inline styles removed
- ✅ All hardcoded colors replaced with theme tokens
- ✅ BEM classes implemented throughout
- ✅ 21 tests passing
- ✅ No TypeScript errors
- ✅ All 6 resource types render with correct icons
- ✅ Type badges styled consistently
- ✅ Hover and focus states work correctly
- ✅ External links open in new tab
- ✅ Visual parity with current design maintained
- ✅ Accessibility requirements met
- ✅ Responsive behavior verified

---

## Icon Reference

**Lucide Icons to Import:**
```typescript
import {
  FileText,    // for pdf, doc
  Link,        // for link
  Video,       // for video
  Image,       // for image
  Paperclip,   // for other
  Download     // optional: for overall section icon
} from 'lucide-react';
```

**Usage in Component:**
```typescript
const getResourceIcon = (type: Resource['type']) => {
  const iconMap = {
    pdf: FileText,
    doc: FileText,
    link: Link,
    video: Video,
    image: Image,
    other: Paperclip,
  };
  const IconComponent = iconMap[type] || Paperclip;
  return <IconComponent size={28} />;
};
```

---

**Document Version:** 1.0  
**Created:** March 8, 2026  
**Template Status:** Existing - Refactor Required  
**Estimated Effort:** 4-6 hours
