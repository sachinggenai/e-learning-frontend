# Navigation Templates: Design-Only Theme Alignment Plan

## Overview

### Purpose
Align all 5 Navigation templates with the current app theme and design system using dedicated CSS files, strict BEM naming, and the existing 9 theme tokens with fallback values. This is a **design-only** refactor/implementation plan with NO functionality changes.

### Scope
Templates in scope:
1. Course Menu (`course-menu`)
2. Learning Roadmap (`learning-roadmap`)
3. Module Overview (`module-overview`)
4. Summary / Key Takeaways (`summary-takeaways`)
5. Resources & Downloads (`resources-downloads`)

Current implementation state:
- **Exists and needs design refactor:** `src/components/templates/navigation/CourseMenu.tsx`, `src/components/templates/navigation/ResourcesDownloads.tsx`
- **Missing and needs implementation:** Learning Roadmap, Module Overview, Summary / Key Takeaways

### Functional Invariance (Non-Negotiable)
No functionality changes are allowed:
- No callback payload shape changes (`onChange`, `onInteraction`, `onComplete`)
- No navigation behavior changes
- No data contract changes to registered template fields
- No structural/hierarchical data model changes

Source-of-truth references:
- `src/constants/templateTypes.ts`
- `src/data/componentRegistryData.ts`
- `src/components/registry/registrations.ts`
- `TemplateEngine_Frontend_Requirements.md`

---

## Design System Standards

### BEM Convention
Root blocks:
- `.tpl-course-menu`, `.tpl-course-menu-editor`
- `.tpl-learning-roadmap`, `.tpl-learning-roadmap-editor`
- `.tpl-module-overview`, `.tpl-module-overview-editor`
- `.tpl-summary-takeaways`, `.tpl-summary-takeaways-editor`
- `.tpl-resources-downloads`, `.tpl-resources-downloads-editor`

Elements and modifiers:
- `__element` (e.g., `__menu-item`, `__milestone`, `__resource-card`)
- `--modifier` (e.g., `--active`, `--completed`, `--disabled`)

### Theme Token Contract (Current Theme Alignment)
All visual styling must use only these 9 tokens with fallback values:
- `var(--theme-primary, #2563eb)`
- `var(--theme-text, #1e293b)`
- `var(--theme-text-secondary, #64748b)`
- `var(--theme-border, #e2e8f0)`
- `var(--theme-surface, #f8fafc)`
- `var(--theme-background, #ffffff)`
- `var(--theme-success, #22c55e)`
- `var(--theme-error, #ef4444)`
- `var(--theme-info, #3b82f6)`

Rules:
- No hardcoded static colors in template styles
- No mixed token families for the same template
- No inline visual styles except documented dynamic/computed cases (e.g., indentation depth calculations)

### Responsive Requirements
Primary breakpoint: `768px`
- Desktop: standard layout, comfortable spacing, side-by-side layouts where appropriate
- Mobile (`<=768px`): full-width cards, stacked layouts, reduced spacing, touch-friendly tap targets
- Tap targets: minimum `44px` for all interactive elements (menu items, milestone cards, resource links)

### Accessibility Visual Requirements
- Focus ring: `2px solid var(--theme-primary, #2563eb)` + `2px` offset
- Distinct hover/active/disabled/completed visuals
- Keyboard support (Tab, Enter/Space, Arrow keys for navigation)
- Contrast compliance: all text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Active/current page indicators clearly visible

---

## Current State Assessment

### CourseMenu.tsx (Existing - Needs Refactor)
**Current Issues:**
- All styles are inline (no dedicated CSS file)
- Hardcoded colors: `#eff6ff`, `#2563eb`, `#374151`, `#3b82f6`, `#1e293b`, `#e2e8f0`
- Emoji icon in editor instead of Lucide icon
- No BEM classes
- No tests

**Design Scope:**
- Extract all inline styles to CSS file
- Replace hardcoded colors with theme tokens
- Implement BEM naming convention
- Add hierarchical indentation using CSS with dynamic depth
- Add hover states, active state indicators
- Replace emoji with Lucide icons
- Add comprehensive test coverage

### ResourcesDownloads.tsx (Existing - Needs Refactor)
**Current Issues:**
- All styles are inline (no dedicated CSS file)
- Hardcoded colors: `#64748b`, `#e2e8f0`, `#fff`, `#1e293b`, `#475569`, `#f1f5f9`, `#94a3b8`, `#ef4444`, `#f9fafb`
- Emoji icons (📄, 📝, 🔗, etc.) instead of Lucide icons
- No BEM classes
- No tests

**Design Scope:**
- Extract all inline styles to CSS file
- Replace hardcoded colors with theme tokens
- Implement BEM naming convention
- Replace emoji icons with Lucide icons
- Add hover/focus states for resource cards
- Add file type badges with theme colors
- Add comprehensive test coverage

### Missing Templates (Need Full Implementation)
**Learning Roadmap:**
- Visual learning path with milestones
- Progressive milestone states (completed, current, locked)
- Connecting lines/path between milestones
- Milestone cards with title, description, and optional page links

**Module Overview:**
- Module title, description, and estimated duration
- Objectives list with checkboxes or bullet points
- Optional prerequisites section
- Optional learning outcomes summary

**Summary / Key Takeaways:**
- Module or course summary
- Key points list with emphasis styling
- Optional next steps section
- Optional call-to-action for review or assessment

---

## Template-Specific Plan

### 1) Course Menu
**Files:**
- Refactor: `src/components/templates/navigation/CourseMenu.tsx`
- Create: `src/components/templates/navigation/CourseMenu.css`
- Create: `src/components/templates/navigation/CourseMenu.test.tsx`

**Design Scope:**
- Move all inline styles to CSS file
- Implement BEM classes for menu structure
- Theme-align menu items, active states, hover states
- Dynamic indentation for nested items using CSS custom properties
- Preserve hierarchical menu data structure (children support)

**Core BEM Targets:**
- `.tpl-course-menu` (root container)
- `.tpl-course-menu__title` (menu heading)
- `.tpl-course-menu__nav` (nav wrapper)
- `.tpl-course-menu__item` (individual menu item)
- `.tpl-course-menu__item--active` (current page indicator)
- `.tpl-course-menu__item--nested` (for items with children)
- `.tpl-course-menu__icon` (item icon)

**Key Visual Features:**
- Active item: left border accent, background highlight, bold text
- Hover state: subtle background change
- Nested items: progressive left padding based on depth
- Icon + text alignment

---

### 2) Learning Roadmap
**Files:**
- Create: `src/components/templates/navigation/LearningRoadmap.tsx`
- Create: `src/components/templates/navigation/LearningRoadmap.css`
- Create: `src/components/templates/navigation/LearningRoadmap.test.tsx`
- Register: `src/components/registry/registrations.ts`

**Design Scope:**
- Build preview/editor with milestone-based structure
- Visual learning path with connecting lines
- Milestone cards with states (completed, current, locked)
- Theme-align cards, badges, progress indicators
- Responsive: vertical layout with connecting line on mobile

**Core BEM Targets:**
- `.tpl-learning-roadmap` (root container)
- `.tpl-learning-roadmap__title` (roadmap heading)
- `.tpl-learning-roadmap__path` (path container)
- `.tpl-learning-roadmap__milestone` (milestone card)
- `.tpl-learning-roadmap__milestone--completed`
- `.tpl-learning-roadmap__milestone--current`
- `.tpl-learning-roadmap__milestone--locked`
- `.tpl-learning-roadmap__connector` (line between milestones)
- `.tpl-learning-roadmap__milestone-icon` (milestone icon/badge)
- `.tpl-learning-roadmap__milestone-title`
- `.tpl-learning-roadmap__milestone-description`

**Key Visual Features:**
- Completed: success color (green check icon)
- Current: primary color (highlighted border)
- Locked: muted colors (lock icon)
- Connecting lines: border color
- Progressive disclosure of milestone details

**Data Structure:**
```typescript
{
  title: string;
  milestones: Array<{
    id: string;
    title: string;
    description?: string;
    pageId?: string;
    status: 'completed' | 'current' | 'locked';
    icon?: string;
  }>;
}
```

---

### 3) Module Overview
**Files:**
- Create: `src/components/templates/navigation/ModuleOverview.tsx`
- Create: `src/components/templates/navigation/ModuleOverview.css`
- Create: `src/components/templates/navigation/ModuleOverview.test.tsx`
- Register: `src/components/registry/registrations.ts`

**Design Scope:**
- Build preview/editor with module metadata display
- Section-based layout: header, objectives, optional sections
- Theme-align cards, objective lists, duration badges
- Preserve existing data contract from registry

**Core BEM Targets:**
- `.tpl-module-overview` (root container)
- `.tpl-module-overview__header` (title + metadata area)
- `.tpl-module-overview__title`
- `.tpl-module-overview__description`
- `.tpl-module-overview__duration` (estimated time badge)
- `.tpl-module-overview__objectives` (objectives section)
- `.tpl-module-overview__objective-item` (individual objective)
- `.tpl-module-overview__objective-icon` (checkmark or bullet)

**Key Visual Features:**
- Header with title and description
- Duration badge (info color)
- Objectives list with checkmark icons
- Card-based layout with proper spacing
- Responsive: full-width on mobile

**Data Structure:**
```typescript
{
  title: string;
  description?: string;
  estimatedDuration?: number; // minutes
  objectives: string[];
}
```

---

### 4) Summary / Key Takeaways
**Files:**
- Create: `src/components/templates/navigation/SummaryTakeaways.tsx`
- Create: `src/components/templates/navigation/SummaryTakeaways.css`
- Create: `src/components/templates/navigation/SummaryTakeaways.test.tsx`
- Register: `src/components/registry/registrations.ts`

**Design Scope:**
- Build preview/editor with summary content structure
- Key points list with emphasis styling
- Optional next steps section
- Theme-align cards, list items, call-to-action areas
- Preserve existing data contract from registry

**Core BEM Targets:**
- `.tpl-summary-takeaways` (root container)
- `.tpl-summary-takeaways__title`
- `.tpl-summary-takeaways__key-points` (key points section)
- `.tpl-summary-takeaways__key-point` (individual point)
- `.tpl-summary-takeaways__key-point-icon` (checkmark or star icon)
- `.tpl-summary-takeaways__next-steps` (next steps section)
- `.tpl-summary-takeaways__next-steps-text`

**Key Visual Features:**
- Prominent title
- Key points with checkmark/star icons (success color)
- Highlighted key points cards
- Next steps section with distinct styling
- Responsive: full-width cards on mobile

**Data Structure:**
```typescript
{
  title: string;
  keyPoints: string[];
  nextSteps?: string;
}
```

---

### 5) Resources & Downloads
**Files:**
- Refactor: `src/components/templates/navigation/ResourcesDownloads.tsx`
- Create: `src/components/templates/navigation/ResourcesDownloads.css`
- Create: `src/components/templates/navigation/ResourcesDownloads.test.tsx`

**Design Scope:**
- Move all inline styles to CSS file
- Replace emoji icons with Lucide icons (FileText, FileImage, Link, Video, Download, etc.)
- Implement BEM classes
- Theme-align resource cards, type badges, hover states
- Preserve existing data structure and resource types

**Core BEM Targets:**
- `.tpl-resources-downloads` (root container)
- `.tpl-resources-downloads__title`
- `.tpl-resources-downloads__description`
- `.tpl-resources-downloads__list` (resources container)
- `.tpl-resources-downloads__resource` (resource card/link)
- `.tpl-resources-downloads__resource-icon`
- `.tpl-resources-downloads__resource-content` (title + description)
- `.tpl-resources-downloads__resource-title`
- `.tpl-resources-downloads__resource-description`
- `.tpl-resources-downloads__resource-meta` (type badge + file size)
- `.tpl-resources-downloads__type-badge`
- `.tpl-resources-downloads__file-size`
- `.tpl-resources-downloads__empty-state`

**Key Visual Features:**
- Resource cards with hover effects (border + shadow)
- File type icons from Lucide (not emoji)
- Type badges with theme colors
- File size display (secondary text)
- Clean link styling (no underline, card is clickable)
- Focus states for keyboard navigation

**Icon Mapping (Lucide):**
- `pdf` → `FileText`
- `doc` → `FileText`
- `link` → `Link`
- `video` → `Video`
- `image` → `Image`
- `other` → `Paperclip`

---

## Implementation Phases

### Phase 1: Baseline & Contract Lock
- [ ] Confirm current behavior and payload baselines for existing templates
- [ ] Capture invariance checklist per template
- [ ] Confirm registry/defaultData parity with constants and requirements
- [ ] Document data structures for missing templates

### Phase 2: Existing Template Design Refactor
- [ ] CourseMenu: TSX class mapping + CSS extraction + Lucide icons + tests
- [ ] ResourcesDownloads: TSX class mapping + CSS extraction + Lucide icons + tests
- [ ] Remove all inline style usage for static visuals
- [ ] Verify no behavior regressions

### Phase 3: Missing Template Implementation
- [ ] Implement LearningRoadmap preview/editor + CSS + tests + registration
- [ ] Implement ModuleOverview preview/editor + CSS + tests + registration
- [ ] Implement SummaryTakeaways preview/editor + CSS + tests + registration

### Phase 4: Validation and Integration
- [ ] Run template test suites (all 5 templates)
- [ ] Run combined navigation template checks
- [ ] Run build and type checks
- [ ] Manual UI verification in template selector + editor + preview
- [ ] Verify theme consistency across all 5 templates

---

## Theme-Alignment Improvement Additions

These improvements are mandatory additions to keep templates inline with current color theme and design:

### 1. Token Coverage Map per Template
- [ ] Root container (background, border)
- [ ] Text elements (primary, secondary)
- [ ] Interactive elements (hover, active, focus states)
- [ ] Status indicators (completed, current, locked)
- [ ] Empty/loading states
- [ ] Editor controls (inputs, buttons, cards)

### 2. Hardcoded Style Prevention Gate
- [ ] No static `#hex`, `rgb()`, `rgba()`, or named colors in template styles
- [ ] No fixed shadow colors outside token contract
- [ ] Dynamic calculations (indentation, positioning) documented as exceptions

### 3. State Matrix Verification
- [ ] Validate: default, hover, focus-visible, active, disabled states
- [ ] Validate state visuals on both desktop and mobile
- [ ] Validate completed/current/locked states for roadmap

### 4. Viewport Verification Matrix
- [ ] Check at widths: 320, 375, 768, 1024
- [ ] Ensure no horizontal overflow and no clipped content
- [ ] Verify tap target sizes (minimum 44px)
- [ ] Test nested menu indentation at various depths

### 5. Accessibility Verification Matrix
- [ ] Keyboard-only flow works end-to-end
- [ ] Focus ring visible and consistent
- [ ] Active/current indicators have sufficient contrast
- [ ] Screen reader friendly link/nav semantics
- [ ] ARIA labels where needed (nav, role attributes)

---

## Testing Matrix (Comprehensive Coverage)

Target: `15-25 tests per template` (Total: ~100 tests for 5 templates)

### Common Test Cases for All Templates:
- [ ] Preview renders without crash
- [ ] Editor renders without crash
- [ ] BEM root class present
- [ ] Title renders correctly
- [ ] Data onChange callback works
- [ ] Empty state renders appropriately
- [ ] Responsive behavior assertions
- [ ] Accessibility keyboard checks
- [ ] Focus states work correctly

### Template-Specific Tests:

**CourseMenu:**
- [ ] Menu items render from data
- [ ] Active item highlighted correctly
- [ ] Nested items render with proper indentation
- [ ] Icons display correctly
- [ ] Editor can add/remove menu items
- [ ] Editor updates item labels
- [ ] Hierarchical structure preserved

**LearningRoadmap:**
- [ ] Milestones render in order
- [ ] Completed/current/locked states display correctly
- [ ] Connecting lines render between milestones
- [ ] Milestone icons match status
- [ ] Editor can add/remove milestones
- [ ] Editor updates milestone fields
- [ ] Status changes reflect visually

**ModuleOverview:**
- [ ] Module title and description render
- [ ] Objectives list renders all items
- [ ] Duration badge displays correctly
- [ ] Editor can add/remove objectives
- [ ] Editor updates all fields
- [ ] Empty objectives show appropriate state

**SummaryTakeaways:**
- [ ] Key points render as list
- [ ] Next steps section renders when provided
- [ ] Key point icons display
- [ ] Editor can add/remove key points
- [ ] Editor updates title and next steps
- [ ] Empty key points show appropriate state

**ResourcesDownloads:**
- [ ] Resources render as cards/links
- [ ] Type icons match resource type
- [ ] Type badges display correctly
- [ ] File size displays when provided
- [ ] Resource links are clickable
- [ ] Editor can add/remove resources
- [ ] Editor updates all resource fields
- [ ] Editor resource type selector works

---

## File Artifacts

### New Files:
- `src/components/templates/navigation/CourseMenu.css`
- `src/components/templates/navigation/CourseMenu.test.tsx`
- `src/components/templates/navigation/ResourcesDownloads.css`
- `src/components/templates/navigation/ResourcesDownloads.test.tsx`
- `src/components/templates/navigation/LearningRoadmap.tsx`
- `src/components/templates/navigation/LearningRoadmap.css`
- `src/components/templates/navigation/LearningRoadmap.test.tsx`
- `src/components/templates/navigation/ModuleOverview.tsx`
- `src/components/templates/navigation/ModuleOverview.css`
- `src/components/templates/navigation/ModuleOverview.test.tsx`
- `src/components/templates/navigation/SummaryTakeaways.tsx`
- `src/components/templates/navigation/SummaryTakeaways.css`
- `src/components/templates/navigation/SummaryTakeaways.test.tsx`

### Updated Files:
- `src/components/templates/navigation/CourseMenu.tsx` (refactored)
- `src/components/templates/navigation/ResourcesDownloads.tsx` (refactored)
- `src/components/registry/registrations.ts` (add 3 new template registrations)
- `src/data/componentRegistryData.ts` (update defaultData if needed)

---

## Validation Criteria

### Automated:
- [ ] Test suite passes for all 5 templates
- [ ] Build passes without errors
- [ ] TypeScript type-check passes
- [ ] No console warnings or errors
- [ ] All tests pass (target: 100+ tests total)

### Manual:
- [ ] All 5 templates selectable from template picker
- [ ] Preview works for each template
- [ ] Editor works for each template
- [ ] Theme consistency matches current app design
- [ ] No hardcoded colors visible
- [ ] Responsive layouts work at 320px, 768px, 1024px
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus rings visible and styled correctly

### Design Compliance:
- [ ] Dedicated CSS file per template
- [ ] BEM class consistency across all templates
- [ ] Token-only visual styling (no hardcoded colors)
- [ ] Lucide icons used (no emoji)
- [ ] No out-of-scope UX additions
- [ ] Consistent spacing and typography

---

## Rollback Strategy

- Phase-based commits only (atomic)
- Revert latest failing phase if regression is found
- Prioritize rollback triggers:
  - Callback/contract regressions
  - Navigation behavior regressions
  - Theme/accessibility regressions
  - Runtime template selection crashes
  - Build or type errors

---

## Success Metrics

### Quantitative:
- 5/5 navigation templates covered
- 100+ tests total across navigation templates
- 0 behavior regressions against invariance checklist
- 0 hardcoded colors in template styles
- All tests passing with >95% coverage

### Qualitative:
- Navigation templates are fully inline with current color theme and design
- Maintainability improved with dedicated CSS and consistent BEM
- Stable template selection, editing, and preview behavior
- Consistent icon usage (Lucide throughout)
- Professional, cohesive visual appearance
- Excellent keyboard accessibility

---

## Design Patterns & Best Practices

### Icon Usage:
- Use Lucide icons consistently
- Import from `lucide-react`
- Use 20-24px size for inline icons
- Use 32-40px size for prominent icons (milestone badges, empty states)

### Card Patterns:
- Border: `1px solid var(--theme-border)`
- Border radius: `8px` for cards, `6px` for smaller elements
- Padding: `16px` for cards, `12px` for compact elements
- Hover: subtle background change + border color intensify
- Focus: ring on entire card or main interactive element

### Typography:
- Title (h3): `18px`, `font-weight: 600`, `--theme-text`
- Subtitle (h4): `16px`, `font-weight: 600`, `--theme-text`
- Body text: `14px`, `font-weight: 400`, `--theme-text`
- Secondary text: `13px`, `font-weight: 400`, `--theme-text-secondary`
- Small text (labels, meta): `12px`, `font-weight: 500`, `--theme-text-secondary`

### Spacing:
- Section gap: `20px` (desktop), `16px` (mobile)
- Card gap: `12px` (desktop), `10px` (mobile)
- Internal padding: `16px` (desktop), `14px` (mobile)
- List item gap: `8px`

### Interactive States:
- Hover: `background-color: var(--theme-surface)`
- Active: `background-color: var(--theme-surface)`, `border-left: 3px solid var(--theme-primary)`
- Focus: `outline: 2px solid var(--theme-primary)`, `outline-offset: 2px`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`

---

**Document Version:** 1.0  
**Created:** March 8, 2026  
**Execution Mode:** Design-only, contract-preserving, theme-aligned  
**Estimated Effort:** 3-4 implementation phases, ~100 tests total
