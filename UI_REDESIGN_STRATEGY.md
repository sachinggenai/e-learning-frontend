# UI Redesign Strategy — Layout, Design & Testing

**Status**: Planning Phase  
**Date**: February 2026  
**Objective**: Enhance UI/UX design while maintaining 100% functional compatibility

---

## Executive Summary

This document outlines the comprehensive approach to redesigning the eLearning frontend UI/UX. The strategy ensures:
- ✅ **Zero functional regression** — all features remain intact
- ✅ **Visual & layout improvements** — modern, responsive design
- ✅ **Testable changes** — unit, functional, and visual regression tests
- ✅ **Incremental rollout** — per-component redesign with feature flags
- ✅ **Design system foundation** — reusable tokens and components

---

## Part 1: Architecture & Design Principles

### 1.1 Separation of Concerns

**Key Principle**: Keep business logic and functionality completely separate from styling and layout.

```
┌─────────────────────────────────────────────────────────────┐
│                  Component Structure                         │
├──────────────────┬──────────────┬──────────────────────────┤
│ Logic Layer      │ View Layer   │ Style Layer             │
├──────────────────┼──────────────┼──────────────────────────┤
│ - Hooks          │ - JSX/TSX    │ - CSS Modules (.css)    │
│ - Redux state    │ - Render     │ - Design tokens         │
│ - Event handlers │ - Structure  │ - Layouts (Flexbox/Grid)│
│ - API calls      │ - Attributes │ - Colors, spacing       │
│ - Validation     │ - Content    │ - Typography            │
└──────────────────┴──────────────┴──────────────────────────┘
```

### 1.2 Design Token System

Create a centralized design system with CSS custom properties (variables):

```css
/* src/styles/design-tokens.css */
:root {
  /* Colors */
  --color-primary: #1976D2;
  --color-secondary: #9C27B0;
  --color-success: #4CAF50;
  --color-error: #F44336;
  --color-warning: #FF9800;
  --color-info: #2196F3;
  --color-background: #FFFFFF;
  --color-surface: #F5F5F5;
  --color-border: #E0E0E0;
  --color-text: #212121;
  --color-text-secondary: #757575;

  /* Spacing (8px base unit) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-family-mono: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-h3: 24px;
  --font-size-h2: 32px;
  --font-size-h1: 40px;
  
  /* Line height */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.8;

  /* Border radius */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 500;
  --z-modal: 2000;
  --z-tooltip: 1500;
}
```

### 1.3 Component Layout Strategy

All redesigns use **CSS Flexbox** and **CSS Grid** with no inline styles:

```tsx
/* ❌ AVOID (inline styles couple logic to presentation) */
<div style={{ display: 'flex', padding: '16px', gap: '8px' }}>

/* ✅ USE (class-based styling with CSS modules) */
<div className={styles.container}>
```

---

## Part 2: CSS Architecture

### 2.1 File Organization

```
src/
├── styles/
│   ├── design-tokens.css          ← Global CSS variables
│   ├── reset.css                  ← Normalize browser styles
│   ├── typography.css             ← Font scales, weights
│   └── utilities.css              ← Helper classes (.flex, .grid, etc.)
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.css      ← Component-scoped styles
│   │   └── Header.test.tsx
│   ├── PageManager/
│   │   ├── PageManager.tsx
│   │   ├── PageManager.module.css
│   │   └── PageManager.test.tsx
└── index.css                      ← Import all styles in order
```

### 2.2 CSS Modules Best Practices

Use **CSS Modules** to scope styles per component:

```css
/* Header.module.css */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-lg);
}

.title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  transition: background-color var(--transition-fast);
}

.button:hover {
  background-color: var(--color-primary-dark);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

```tsx
/* Header.tsx */
import styles from './Header.module.css';

export const Header: React.FC = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>eLearning Editor</h1>
    <div className={styles.actions}>
      <button className={styles.button}>Save</button>
    </div>
  </header>
);
```

### 2.3 Responsive Design Pattern

Use **mobile-first** CSS with breakpoints:

```css
/* Header.module.css */
.header {
  /* Mobile (default) */
  flex-direction: column;
  align-items: stretch;
  padding: var(--spacing-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .header {
    flex-direction: row;
    align-items: center;
    padding: var(--spacing-md);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .header {
    padding: var(--spacing-lg);
  }
}
```

---

## Part 3: Feature Flag Strategy

Use feature flags to gradually roll out redesigns **without breaking existing UI**.

### 3.1 Feature Flag Definition

```typescript
/* src/utils/featureFlags.ts */
export const uiFeatureFlags = {
  // V2 UI components (redesigned with new layout)
  'header-v2': process.env.REACT_APP_HEADER_V2 === 'true',
  'menubar-v2': process.env.REACT_APP_MENUBAR_V2 === 'true',
  'page-manager-v2': process.env.REACT_APP_PAGE_MANAGER_V2 === 'true',
  'component-list-v2': process.env.REACT_APP_COMPONENT_LIST_V2 === 'true',
  'editor-v2': process.env.REACT_APP_EDITOR_V2 === 'true',
  'preview-v2': process.env.REACT_APP_PREVIEW_V2 === 'true',
};
```

### 3.2 Conditional Component Rendering

```tsx
import { uiFeatureFlags } from '../utils/featureFlags';
import HeaderV1 from './Header';
import HeaderV2 from './HeaderV2';

export const Header: React.FC = () => {
  return uiFeatureFlags['header-v2'] ? <HeaderV2 /> : <HeaderV1 />;
};
```

### 3.3 Environment Configuration

```bash
# .env (default — V1 UI)
REACT_APP_HEADER_V2=false
REACT_APP_MENUBAR_V2=false
REACT_APP_PAGE_MANAGER_V2=false

# .env.v2-design (switch to V2 UI for testing)
REACT_APP_HEADER_V2=true
REACT_APP_MENUBAR_V2=true
REACT_APP_PAGE_MANAGER_V2=true
```

---

## Part 4: Implementation Workflow

### 4.1 Component Redesign Checklist

For each component redesign:

```markdown
## Component: Header

### Phase 1: Prepare
- [ ] Create header copy: `HeaderV2.tsx` (parallel to `Header.tsx`)
- [ ] Create stylesheet: `HeaderV2.module.css`
- [ ] Extract business logic tests into shared utilities
- [ ] Write functional tests that apply to BOTH versions

### Phase 2: Redesign
- [ ] Design new layout (wireframe/mockup)
- [ ] Implement layout with CSS Grid/Flexbox
- [ ] Apply design tokens for colors, spacing, typography
- [ ] Test responsive breakpoints (mobile, tablet, desktop)
- [ ] Ensure accessibility (ARIA labels, keyboard nav)

### Phase 3: Test
- [ ] Run unit tests (should pass for both V1 & V2)
- [ ] Run functional tests (all interactions must work)
- [ ] Visual regression test (capture screenshots of both)
- [ ] Accessibility audit (axe-core)
- [ ] Keyboard navigation test
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

### Phase 4: Deploy
- [ ] Merge V2 component
- [ ] Enable feature flag in staging
- [ ] Smoke tests pass
- [ ] Gradual rollout: 10% → 25% → 50% → 100%
- [ ] Monitor error tracking (Sentry, etc.)
- [ ] Gather user feedback
- [ ] Deprecate V1 after stable period
```

### 4.2 Example: Redesign the Header Component

**Before** (`Header.tsx`, V1):
```tsx
export const Header: React.FC = () => (
  <div className="header">
    <h1>{course?.title}</h1>
    <div className="header-actions">
      <button onClick={handleSave}>Save</button>
      <button onClick={handleValidate}>Validate</button>
    </div>
  </div>
);
```

**After** (`HeaderV2.tsx`, V2 redesigned):
```tsx
import styles from './HeaderV2.module.css';

export const HeaderV2: React.FC = () => (
  <header className={styles.headerContainer}>
    <div className={styles.headerBrand}>
      <h1 className={styles.title}>{course?.title}</h1>
      <span className={styles.subtitle}>Course Editor</span>
    </div>
    
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <span>Editing</span>
    </nav>

    <div className={styles.headerDivider} />

    <div className={styles.headerActions}>
      <div className={styles.statusGroup}>
        <span className={styles.status} data-status={saveStatus}>
          {saveStatus === 'saved' ? '✓ Saved' : 'Saving...'}
        </span>
      </div>
      
      <button 
        className={`${styles.button} ${styles.buttonPrimary}`}
        onClick={handleSave}
        aria-label="Save course"
      >
        💾 Save
      </button>
      
      <button 
        className={`${styles.button} ${styles.buttonSecondary}`}
        onClick={handleValidate}
        aria-label="Validate course"
      >
        ✓ Validate
      </button>
    </div>
  </header>
);
```

**Stylesheet** (`HeaderV2.module.css`):
```css
.headerContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  box-shadow: var(--shadow-md);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.headerBrand {
  flex: 1;
  min-width: 200px;
}

.title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  margin: 0;
  line-height: var(--line-height-tight);
}

.subtitle {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  display: block;
  margin-top: var(--spacing-xs);
}

.breadcrumb {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.headerDivider {
  flex-basis: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
}

.headerActions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.statusGroup {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}

.status {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 600;
}

.buttonPrimary {
  background-color: white;
  color: var(--color-primary);
}

.buttonPrimary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.buttonSecondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.buttonSecondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .headerContainer {
    flex-direction: column;
    align-items: stretch;
    padding: var(--spacing-sm);
  }

  .headerActions {
    flex-wrap: wrap;
  }
}
```

---

## Part 5: Testing Strategy

### 5.1 Testing Pyramid

```
                         /\
                        /E2E\                 ← End-to-end tests
                       /______\
                      /        \
                     / Integration\         ← Integration tests  
                    /____________\
                   /              \
                  / Unit & Visual  \        ← Unit + Visual regression
                 /________________\
```

### 5.2 Testing Approach for UI Redesign

| Layer | Type | Purpose | Tools |
|-------|------|---------|-------|
| **Unit** | Component logic | Ensure props/callbacks work | Jest, React Testing Library |
| **Integration** | Component interactions | Multi-component workflows | React Testing Library, Playwright |
| **Visual** | Layout & styling | CSS did not break layout | Percy, Chromatic, Cypress visual |
| **Accessibility** | WCAG compliance | UI is accessible | axe-core, Lighthouse |
| **E2E** | Full user flow | End-to-end scenarios | Playwright, Cypress |

### 5.3 Test Naming Convention

Tests that must pass for **both** V1 and V2:

```
__tests__/
  ├── Header.shared.test.tsx            ← Shared logic tests (both versions)
  ├── Header.v1.test.tsx                ← V1-specific tests
  ├── Header.v2.test.tsx                ← V2-specific tests
  └── Header.integration.test.tsx       ← Header + other components
```

---

## Part 6: Quality Gates (Before & After Comparison)

### 6.1 Functional Regression Tests

Every action in V1 must work identically in V2:

| Feature | V1 Behavior | V2 Behavior | Test |
|---------|-----------|-----------|------|
| Save course | Dispatches saveCourse, shows toast | Same | `test('save button dispatches saveCourse')` |
| Validate | Opens validation modal | Same | `test('validate button opens modal')` |
| Export | Triggers SCORM export | Same | `test('export starts download')` |
| View toggle | Switches editor ↔ preview | Same | `test('view toggle switches modes')` |

### 6.2 Visual Regression Checks

Capture and compare screenshots:

```bash
# Before redesign (baseline)
npm run test:visual:baseline

# After redesign (capture new)
npm run test:visual:capture

# Compare (produces report with diffs)
npm run test:visual:compare
```

### 6.3 Accessibility Compliance

```bash
npm run test:a11y
```

Must pass:
- ✅ WCAG 2.1 AA compliance
- ✅ All interactive elements keyboard-accessible
- ✅ Proper ARIA labels and roles
- ✅ Color contrast ≥ 4.5:1 for text

---

## Part 7: Rollout Plan

### Phase 1: Local Development (Week 1)
- [ ] Create HeaderV2 component
- [ ] Write unit + integration tests
- [ ] Enable in local env with feature flag
- [ ] Internal design review

### Phase 2: Staging (Week 2)
- [ ] Deploy to staging environment
- [ ] Enable feature flag for 10% of users
- [ ] Run full test suite
- [ ] Manual QA checklist
- [ ] Gather accessibility audit results

### Phase 3: Gradual Rollout (Week 3–4)
- [ ] 10% → 25% → 50% → 100%
- [ ] Monitor error rates and performance
- [ ] Collect user feedback
- [ ] Hotfix any issues

### Phase 4: Cleanup (Week 5)
- [ ] Remove V1 component
- [ ] Remove feature flag
- [ ] Update documentation

---

## Summary

| Aspect | Strategy |
|--------|----------|
| **Code Organization** | CSS Modules + design tokens (no inline styles) |
| **Rollout** | Feature flags per-component for safety |
| **Testing** | Unit + integration + visual + E2E + accessibility |
| **Quality Gates** | 100% functional parity + visual regression tests |
| **Backward Compatibility** | V1 and V2 exist in parallel during redesign |
| **Deployment** | Gradual rollout with monitoring |

Next steps: Create the test cases file template.
