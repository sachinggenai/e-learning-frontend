# Comparison Templates Redesign Plan

**Status**: In Progress - Phase 1  
**Branch**: `feature/comparison-templates-redesign`  
**Date**: March 7, 2026  
**Scope**: Design-only refactor + implement 3 missing templates

---

## Overview

Redesign all four Comparison category templates to match the established theme design system, following the same BEM + theme token patterns used in the Assessment templates refactor (completed March 7, 2026). This work addresses:
- **Quality debt**: ComparisonTable has inline styles, no tests, poor mobile UX
- **Runtime risk**: Selecting ProsCons/BeforeAfter/MatrixGrid crashes (missing component implementations)
- **Theme inconsistency**: Existing template doesn't use theme tokens or BEM conventions

### Current State
- ✅ **1/4 implemented**: [ComparisonTable.tsx](src/components/templates/comparison/ComparisonTable.tsx) exists but needs refactor
- ❌ **3/4 missing**: ProsCons, BeforeAfter, MatrixGrid registered but not implemented
- ❌ **No tests**: Zero test coverage for comparison templates
- ❌ **No theme alignment**: Hardcoded colors (`#e2e8f0`, `#64748b`, `#1d4ed8`)

### Target State
- ✅ All 4 templates implemented with Preview + Editor
- ✅ BEM CSS architecture with dedicated `.css` files
- ✅ Full theme token usage (9 tokens + fallbacks)
- ✅ Responsive design (768px breakpoint)
- ✅ Comprehensive test coverage (15-25 tests per template)
- ✅ Keyboard navigation + accessibility
- ✅ Production build passing

---

## Theme Design Requirements

All templates MUST adhere to the established design system:

### 1. Theme Tokens (MANDATORY)
Every template must use these 9 theme tokens with fallback values:

```css
/* Primary colors */
--theme-primary: #2563eb;          /* Buttons, links, selections */
--theme-text: #1e293b;             /* Primary text */
--theme-text-secondary: #64748b;   /* Secondary/muted text */

/* Backgrounds & borders */
--theme-border: #e2e8f0;           /* Dividers, borders */
--theme-surface: #f8fafc;          /* Cards, panels */
--theme-background: #ffffff;       /* Page background */

/* Semantic colors */
--theme-success: #22c55e;          /* Positive states */
--theme-error: #ef4444;            /* Negative states */
--theme-info: #3b82f6;             /* Informational states */
```

**Usage**: `color: var(--theme-text, #1e293b);`

### 2. BEM Naming Convention (MANDATORY)
Follow Block__Element--Modifier pattern:

```css
/* Block (root container) */
.tpl-comparison-table { }
.tpl-pros-cons { }
.tpl-before-after { }
.tpl-matrix-grid { }

/* Editor blocks */
.tpl-comparison-table-editor { }
.tpl-pros-cons-editor { }
.tpl-before-after-editor { }
.tpl-matrix-grid-editor { }

/* Elements (children) */
.tpl-comparison-table__title { }
.tpl-comparison-table__header { }
.tpl-comparison-table__row { }
.tpl-comparison-table__cell { }
.tpl-comparison-table__actions { }

/* Modifiers (states) */
.tpl-comparison-table__cell--highlighted { }
.tpl-comparison-table__row--selected { }
.tpl-pros-cons__item--pro { }
.tpl-pros-cons__item--con { }
```

### 3. Responsive Design (MANDATORY)
Single breakpoint at 768px:

```css
/* Desktop-first approach */
.tpl-comparison-table {
  /* Desktop styles */
}

/* Mobile overrides */
@media (max-width: 768px) {
  .tpl-comparison-table {
    /* Mobile styles: stacked layout, full-width, reduced padding */
  }
}
```

**Mobile patterns**:
- Tables → Card-based layout or vertical stacking
- Multi-column → Single column
- Horizontal scrolling → Responsive reflow
- Full-width buttons

### 4. Accessibility (MANDATORY)
- **Focus rings**: `outline: 2px solid var(--theme-primary, #2563eb); outline-offset: 2px;`
- **Role attributes**: `role="table"`, `role="grid"`, `role="button"`, etc.
- **Aria labels**: `aria-label`, `aria-labelledby`, `aria-describedby`
- **Keyboard navigation**: Tab, Enter/Space, Arrow keys where appropriate
- **Min tap target**: 44px height for interactive elements
- **WCAG AA contrast**: Use theme tokens (pre-validated for contrast)

### 5. Typography & Spacing
```css
/* Headings */
.tpl-{name}__title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

/* Body text */
.tpl-{name}__text {
  font-size: 15px;
  line-height: 1.6;
}

/* Secondary text */
.tpl-{name}__label {
  font-size: 13px;
  line-height: 1.5;
}

/* Spacing scale */
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
```

### 6. Interactive States
```css
/* Hover */
.button:hover:not(:disabled) {
  background: #1d4ed8; /* Darker primary */
  transform: translateY(-1px);
}

/* Focus */
.button:focus {
  outline: 2px solid var(--theme-primary);
  outline-offset: 2px;
}

/* Active/Selected */
.item--selected {
  border-color: var(--theme-primary);
  background: rgba(37, 99, 235, 0.08);
}

/* Disabled */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Implementation Phases

### Phase 1: ComparisonTable Redesign ✅ IN PROGRESS
**Goal**: Transform existing inline-styled component to match theme system

**Files**:
- [src/components/templates/comparison/ComparisonTable.tsx](src/components/templates/comparison/ComparisonTable.tsx) - Refactor classes only
- `src/components/templates/comparison/ComparisonTable.css` - NEW
- `src/components/templates/comparison/ComparisonTable.test.tsx` - NEW

**Theme Requirements**:
- Replace ALL inline styles with BEM classes
- Use theme tokens for:
  - Table borders: `var(--theme-border)`
  - Header background: `var(--theme-surface)`
  - Text color: `var(--theme-text)` / `var(--theme-text-secondary)`
  - Highlighted columns: `rgba(37, 99, 235, 0.08)` (primary tint)
  - Hover states: `rgba(37, 99, 235, 0.04)`
- Responsive strategy:
  - Desktop: Standard table layout
  - Mobile (<768px): Card-based layout with definition lists
- Focus rings on all interactive cells
- Arrow key navigation within table

**Data Contract** (preserve existing):
```typescript
{
  title: string;
  columns: Array<{ id: string; header: string; highlighted?: boolean }>;
  rows: Array<{ id: string; feature: string; values: Record<string, string> }>;
}
```

**Testing** (15-20 tests):
- Preview rendering: title, columns, rows, highlighted state
- BEM class application
- Add/remove columns and rows in editor
- Keyboard navigation
- Mobile responsive layout
- Callbacks: onInteraction, onChange

**Acceptance**:
- [ ] Zero inline styles remaining
- [ ] All 9 theme tokens used where appropriate
- [ ] Mobile card layout working
- [ ] 15+ tests passing
- [ ] Build successful

---

### Phase 2: ProsCons Implementation
**Goal**: Create two-column comparison template from scratch

**Files**:
- `src/components/templates/comparison/ProsCons.tsx` - NEW
- `src/components/templates/comparison/ProsCons.css` - NEW
- `src/components/templates/comparison/ProsCons.test.tsx` - NEW
- [src/components/registry/registrations.ts](src/components/registry/registrations.ts#L77) - Add lazy import

**Theme Requirements**:
- Root: `.tpl-pros-cons` with `--theme-background`
- Title: `.tpl-pros-cons__title` with `--theme-text`
- Topic: `.tpl-pros-cons__topic` with `--theme-text-secondary`
- Pro items:
  - Background: `rgba(34, 197, 94, 0.08)` (success tint)
  - Border: `var(--theme-success)`
  - Icon: CheckCircle from Lucide, color `var(--theme-success)`
- Con items:
  - Background: `rgba(239, 68, 68, 0.08)` (error tint)
  - Border: `var(--theme-error)`
  - Icon: XCircle from Lucide, color `var(--theme-error)`
- Responsive:
  - Desktop: Two-column grid (1fr 1fr)
  - Mobile: Single column stack (Pros → Cons)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         Title (centered)            │
│     Topic subtitle (centered)       │
├──────────────────┬──────────────────┤
│  ✓ Pros          │  ✗ Cons          │
│  ┌────────────┐  │  ┌────────────┐  │
│  │ ✓ Item 1   │  │  │ ✗ Item 1   │  │
│  │ ✓ Item 2   │  │  │ ✗ Item 2   │  │
│  └────────────┘  │  └────────────┘  │
└──────────────────┴──────────────────┘
```

**Data Contract**:
```typescript
{
  title: string;
  topic: string;
  pros: string[];
  cons: string[];
}
```

---

### Phase 3: BeforeAfter Implementation (Side-by-side cards)
**Goal**: Create comparison cards with clear visual differentiation

**Files**:
- `src/components/templates/comparison/BeforeAfter.tsx` - NEW
- `src/components/templates/comparison/BeforeAfter.css` - NEW
- `src/components/templates/comparison/BeforeAfter.test.tsx` - NEW
- [src/components/registry/registrations.ts](src/components/registry/registrations.ts#L78) - Add lazy import

**Theme Requirements**:
- Root: `.tpl-before-after` with minimal padding
- Title: `.tpl-before-after__title` with `--theme-text`
- Cards:
  - Background: `var(--theme-surface)`
  - Border: `var(--theme-border)`
  - Border-radius: 8px
- Labels:
  - Font-weight: 600
  - Before: `var(--theme-info)` color
  - After: `var(--theme-success)` color
- Divider/Arrow:
  - Use ArrowRight icon from Lucide
  - Color: `var(--theme-primary)`
- Responsive:
  - Desktop: Two cards side-by-side with arrow between
  - Mobile: Stacked vertically (Before on top, After below)

**Data Contract**:
```typescript
{
  title: string;
  beforeLabel: string;
  afterLabel: string;
  beforeContent: string;
  afterContent: string;
}
```

---

### Phase 4: MatrixGrid Implementation
**Goal**: Create flexible grid/matrix template distinct from ComparisonTable

**Files**:
- `src/components/templates/comparison/MatrixGrid.tsx` - NEW
- `src/components/templates/comparison/MatrixGrid.css` - NEW
- `src/components/templates/comparison/MatrixGrid.test.tsx` - NEW
- [src/components/registry/registrations.ts](src/components/registry/registrations.ts#L80) - Add lazy import

**Theme Requirements**:
- Root: `.tpl-matrix-grid` with full width
- Title: `.tpl-matrix-grid__title` with `--theme-text`
- Grid container:
  - Border: `var(--theme-border)`
  - Background: `var(--theme-background)`
- Headers (row/column):
  - Background: `var(--theme-surface)`
  - Font-weight: 600
  - Color: `var(--theme-text)`
- Cells:
  - Border: `var(--theme-border)`
  - Padding: 12px
  - Hover: `rgba(37, 99, 235, 0.04)`
- Responsive:
  - Desktop: CSS Grid with auto-fit columns
  - Mobile: Definition list layout (label: value pairs)

**Data Contract**:
```typescript
{
  title: string;
  rowHeaders: string[];
  columnHeaders: string[];
  cells: string[][]; // 2D array
}
```

---

## Testing Strategy

### Test Coverage Requirements
Each template MUST have:
- **Preview tests** (10-15):
  - Component renders without errors
  - BEM classes applied correctly
  - Default data displays properly
  - User interactions work (if applicable)
  - Callbacks fire with correct payloads
  - Responsive behavior verified
  - Accessibility roles present
- **Editor tests** (5-10):
  - Editor renders without errors
  - Input fields update data via onChange
  - Add/remove item functions work
  - ReadOnly mode prevents edits (if applicable)

### Test Commands
```bash
# Individual template
npm test -- --testPathPattern="comparison/ComparisonTable" --watchAll=false

# All comparison templates
npm test -- --testPathPattern="comparison/(ComparisonTable|ProsCons|BeforeAfter|MatrixGrid)" --watchAll=false

# Full suite
npm test -- --watchAll=false
```

---

## Verification Checklist

### Per-Template Checklist
For each template, verify:
- [ ] Component file exists with Preview + Editor exports
- [ ] CSS file exists with BEM naming throughout
- [ ] Test file exists with 15+ tests passing
- [ ] All 9 theme tokens used where appropriate
- [ ] Zero hardcoded colors/spacing
- [ ] Responsive breakpoint at 768px implemented
- [ ] Focus rings on all interactive elements
- [ ] Keyboard navigation functional
- [ ] Aria labels/roles present
- [ ] Registry lazy import added
- [ ] Default data matches contract
- [ ] Production build passes

### Integration Checklist
- [ ] All 4 templates selectable in template selector
- [ ] All templates render in preview without errors
- [ ] All templates render in editor without errors
- [ ] Template cards show correct icons (Columns icon)
- [ ] Save/load works for all templates
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Full test suite passes
- [ ] Production build successful: `npm run build`

---

## File Structure Reference

```
src/components/templates/comparison/
├── ComparisonTable.tsx        (refactored)
├── ComparisonTable.css        (NEW)
├── ComparisonTable.test.tsx   (NEW)
├── ProsCons.tsx               (NEW)
├── ProsCons.css               (NEW)
├── ProsCons.test.tsx          (NEW)
├── BeforeAfter.tsx            (NEW)
├── BeforeAfter.css            (NEW)
├── BeforeAfter.test.tsx       (NEW)
├── MatrixGrid.tsx             (NEW)
├── MatrixGrid.css             (NEW)
└── MatrixGrid.test.tsx        (NEW)

src/components/registry/
└── registrations.ts           (update lazy imports)

src/data/
└── componentRegistryData.ts   (already configured ✓)

src/constants/
└── templateTypes.ts           (already configured ✓)
```

---

## Git Workflow

### Commit Strategy
```bash
# After each phase
git add src/components/templates/comparison/{Template}.*
git commit -m "feat(comparison): implement {Template} with theme design"
git push origin feature/comparison-templates-redesign

# Example commits:
# "refactor(comparison): redesign ComparisonTable with BEM and theme tokens"
# "feat(comparison): implement ProsCons template with theme design"
# "feat(comparison): implement BeforeAfter template with side-by-side layout"
# "feat(comparison): implement MatrixGrid template with flexible grid structure"
```

---

## Success Criteria

This redesign is complete when:
1. ✅ All 4 comparison templates implemented and tested
2. ✅ Zero inline styles - all CSS in dedicated files
3. ✅ 100% theme token usage (9 tokens + fallbacks)
4. ✅ BEM naming convention throughout
5. ✅ 60+ total tests passing (15+ per template)
6. ✅ Responsive design at 768px breakpoint
7. ✅ Keyboard navigation + accessibility
8. ✅ Production build successful
9. ✅ All templates selectable and functional in UI
10. ✅ No TypeScript errors

---

## Reference Materials

### Similar Completed Work
- [DESIGN_PLAN_ASSESSMENT_TEMPLATES.md](DESIGN_PLAN_ASSESSMENT_TEMPLATES.md) - Assessment redesign (completed March 7, 2026)
- [src/components/templates/assessment/MCQ.css](src/components/templates/assessment/MCQ.css) - BEM + theme example
- [src/components/templates/assessment/MCQ.test.tsx](src/components/templates/assessment/MCQ.test.tsx) - Test pattern

---

**Current Status**: Phase 1 in progress - ComparisonTable refactor
