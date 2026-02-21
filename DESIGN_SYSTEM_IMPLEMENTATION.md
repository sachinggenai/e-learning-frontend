# Design System & Quick-Start Implementation Guide

**Purpose**: Standardized design tokens and patterns for UI redesign.  
**Scope**: Colors, typography, spacing, shadows, borders, responsive breakpoints.

---

## 1. Design Tokens (CSS Custom Properties)

### 1.1 Create Design Tokens File

**File**: `src/styles/design-tokens.css`

```css
/**
 * Design Tokens for eLearning Frontend
 * 
 * These CSS custom properties define the visual language.
 * All components should use these variables instead of hard-coded values.
 * 
 * Usage: color: var(--color-primary);
 */

:root {
  /* ─── COLORS ─────────────────────────────────────────────────────── */
  
  /* Primary brand color */
  --color-primary: #1976D2;
  --color-primary-dark: #1565C0;
  --color-primary-light: #42A5F5;
  
  /* Secondary brand color */
  --color-secondary: #9C27B0;
  --color-secondary-dark: #7B1FA2;
  --color-secondary-light: #BA68C8;
  
  /* Status colors */
  --color-success: #4CAF50;
  --color-success-bg: #E8F5E9;
  --color-error: #F44336;
  --color-error-bg: #FFEBEE;
  --color-warning: #FF9800;
  --color-warning-bg: #FFF3E0;
  --color-info: #2196F3;
  --color-info-bg: #E3F2FD;
  
  /* Neutral palette */
  --color-background: #FFFFFF;
  --color-background-secondary: #FAFAFA;
  --color-surface: #F5F5F5;
  --color-surface-hover: #EEEEEE;
  --color-border: #E0E0E0;
  --color-border-light: #F0F0F0;
  --color-border-dark: #BDBDBD;
  
  /* Text colors */
  --color-text: #212121;
  --color-text-secondary: #757575;
  --color-text-disabled: #BDBDBD;
  --color-text-inverse: #FFFFFF;
  
  /* Overlay & transparency */
  --color-overlay-light: rgba(0, 0, 0, 0.05);
  --color-overlay-medium: rgba(0, 0, 0, 0.12);
  --color-overlay-dark: rgba(0, 0, 0, 0.54);
  --color-overlay-modal: rgba(0, 0, 0, 0.5);
  
  /* ─── TYPOGRAPHY ─────────────────────────────────────────────────── */
  
  /* Font families */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-family-mono: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Monaco',
    'Courier New', monospace;
  
  /* Font sizes */
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 20px;
  --font-size-h4: 24px;
  --font-size-h3: 32px;
  --font-size-h2: 40px;
  --font-size-h1: 48px;
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;
  
  /* Letter spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.02em;
  
  /* ─── SPACING ────────────────────────────────────────────────────── */
  
  /* 8px-based scale */
  --spacing-0: 0;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;
  
  /* Gap for flexbox/grid */
  --gap-xs: 4px;
  --gap-sm: 8px;
  --gap-md: 16px;
  --gap-lg: 24px;
  --gap-xl: 32px;
  
  /* ─── BORDER RADIUS ──────────────────────────────────────────────── */
  
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 999px;
  
  /* ─── SHADOWS ────────────────────────────────────────────────────── */
  
  --shadow-none: 0 0 0 rgba(0, 0, 0, 0);
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 20px 45px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15);
  
  /* Inset shadow (for pressed/active states) */
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  
  /* ─── TRANSITIONS & ANIMATIONS ────────────────────────────────────── */
  
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
  
  --easing-linear: linear;
  --easing-in-out: ease-in-out;
  --easing-in: ease-in;
  --easing-out: ease-out;
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* ─── Z-INDEX SCALE ──────────────────────────────────────────────── */
  
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 500;
  --z-fixed: 600;
  --z-modal-backdrop: 1400;
  --z-modal: 1500;
  --z-popover: 1100;
  --z-tooltip: 1200;
  --z-notification: 1600;
  
  /* ─── RESPONSIVE BREAKPOINTS ─────────────────────────────────────── */
  
  /* These are referenced in media queries, not applied directly */
  /* Mobile: < 640px */
  /* Tablet: 640px - 1024px */
  /* Desktop: >= 1024px */
  /* Wide: >= 1280px */
}

/* ─── DARK MODE ────────────────────────────────────────────────────── */

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #121212;
    --color-background-secondary: #1E1E1E;
    --color-surface: #1E1E1E;
    --color-surface-hover: #2E2E2E;
    --color-border: #383838;
    --color-border-light: #2E2E2E;
    --color-text: #FFFFFF;
    --color-text-secondary: #B3B3B3;
    --color-text-disabled: #757575;
  }
}

/* ─── PRINT STYLES ─────────────────────────────────────────────────── */

@media print {
  :root {
    --shadow-sm: none;
    --shadow-md: none;
    --shadow-lg: none;
  }
}
```

### 1.2 Global Reset & Base Styles

**File**: `src/styles/reset.css`

```css
/**
 * CSS Reset — Normalize browser defaults
 */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-family-base);
  font-size: 16px;
  line-height: var(--line-height-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  background-color: var(--color-background);
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin: 0;
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }

/* Forms */
button, input, textarea, select {
  font-family: var(--font-family-base);
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
}

input, textarea, select {
  box-sizing: border-box;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Lists */
ul, ol {
  list-style-position: inside;
}

/* Code */
code, pre {
  font-family: var(--font-family-mono);
  background-color: var(--color-surface);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
}

pre {
  padding: var(--spacing-md);
  overflow-x: auto;
}

/* Remove default table styles */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

td, th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  background-color: var(--color-surface);
  font-weight: var(--font-weight-semibold);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: var(--color-surface);
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-border-dark);
}
```

### 1.3 Import All Styles

**Update**: `src/index.css`

```css
@import './styles/design-tokens.css';
@import './styles/reset.css';
@import './styles/typography.css';
@import './styles/utilities.css';
```

---

## 2. Utility Classes

**File**: `src/styles/utilities.css`

```css
/**
 * Utility Classes
 * 
 * Common patterns for flexbox, grid, spacing, visibility, etc.
 */

/* ─── FLEXBOX ─────────────────────────────────────────────────────── */

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-1 {
  flex: 1;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-sm {
  gap: var(--gap-sm);
}

.gap-md {
  gap: var(--gap-md);
}

.gap-lg {
  gap: var(--gap-lg);
}

/* ─── GRID ────────────────────────────────────────────────────────── */

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* ─── SPACING ─────────────────────────────────────────────────────── */

.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }

.px-sm { padding-left: var(--spacing-sm); padding-right: var(--spacing-sm); }
.px-md { padding-left: var(--spacing-md); padding-right: var(--spacing-md); }
.px-lg { padding-left: var(--spacing-lg); padding-right: var(--spacing-lg); }

.py-sm { padding-top: var(--spacing-sm); padding-bottom: var(--spacing-sm); }
.py-md { padding-top: var(--spacing-md); padding-bottom: var(--spacing-md); }
.py-lg { padding-top: var(--spacing-lg); padding-bottom: var(--spacing-lg); }

.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }

.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }

/* ─── VISIBILITY ──────────────────────────────────────────────────── */

.hidden {
  display: none !important;
}

.invisible {
  visibility: hidden;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ─── COLORS ──────────────────────────────────────────────────────── */

.text-primary {
  color: var(--color-primary);
}

.text-secondary {
  color: var(--color-secondary);
}

.text-error {
  color: var(--color-error);
}

.text-success {
  color: var(--color-success);
}

.text-muted {
  color: var(--color-text-secondary);
}

.bg-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.bg-surface {
  background-color: var(--color-surface);
}

.border {
  border: 1px solid var(--color-border);
}

/* ─── TEXT ────────────────────────────────────────────────────────── */

.text-sm {
  font-size: var(--font-size-sm);
}

.text-lg {
  font-size: var(--font-size-lg);
}

.font-bold {
  font-weight: var(--font-weight-bold);
}

.font-semibold {
  font-weight: var(--font-weight-semibold);
}

.text-center {
  text-align: center;
}

.uppercase {
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ─── RESPONSIVE ──────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .mobile-hidden {
    display: none;
  }
  
  .mobile-flex {
    display: flex;
  }
}

@media (min-width: 1024px) {
  .desktop-flex {
    display: flex;
  }
}
```

---

## 3. Responsive Breakpoints Reference

Add this comment to your CSS files for reference:

```css
/**
 * Breakpoint Guide
 * 
 * Mobile (sm):    < 640px    — phones
 * Tablet (md):    640px-1023px — tablets
 * Desktop (lg):   1024px+    — desktops
 * Wide (xl):      1280px+    — large desktops
 * 
 * Usage:
 * @media (max-width: 640px) { ... }
 * @media (min-width: 641px) and (max-width: 1023px) { ... }
 * @media (min-width: 1024px) { ... }
 * @media (min-width: 1280px) { ... }
 */
```

---

## 4. Component Example: Button Redesign

### Before (V1 — Inline styles)

```tsx
// ❌ OLD: Inline styles, no design tokens
export const Button = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      backgroundColor: variant === 'primary' ? '#1976D2' : '#999',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    }}
  >
    {children}
  </button>
);
```

### After (V2 — CSS Modules + Design Tokens)

**File**: `src/components/Button/Button.tsx`

```tsx
import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          styles.button,
          styles[`button--${variant}`],
          styles[`button--${size}`],
          fullWidth && styles['button--fullWidth'],
          isLoading && styles['button--loading'],
          className,
        ].filter(Boolean).join(' ')}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**File**: `src/components/Button/Button.module.css`

```css
.button {
  /* Base styles */
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  line-height: var(--line-height-tight);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-sm);
  
  /* Accessibility */
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* ─── VARIANTS ────────────────────────────────────────────────────── */

.button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.button--primary:active:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-inset);
  transform: translateY(0);
}

.button--secondary {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}

.button--secondary:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.button--danger {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
}

.button--danger:hover:not(:disabled) {
  background-color: #D32F2F;
  box-shadow: var(--shadow-md);
}

/* ─── SIZES ────────────────────────────────────────────────────── */

.button--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.button--lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

/* ─── STATES ───────────────────────────────────────────────────── */

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--fullWidth {
  width: 100%;
}

.button--loading {
  pointer-events: none;
  opacity: 0.7;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-text-inverse);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── FOCUS STATE (KEYBOARD NAVIGATION) ────────────────────────── */

.button:focus-visible {
  outline-color: var(--color-primary);
}

/* ─── RESPONSIVE ───────────────────────────────────────────────── */

@media (max-width: 640px) {
  .button {
    width: 100%;
  }
}
```

---

## 5. Quick-Start Checklist for Each Component Redesign

**Use this checklist for every component you redesign.**

```markdown
## Component: ______________________

### Preparation
- [ ] Backup existing component (V1)
- [ ] Create V2 variant folder
- [ ] Create V2 component file
- [ ] Create V2 CSS module
- [ ] Create shared tests

### Design & Implementation
- [ ] Design new wireframe/mockup
- [ ] Create CSS Module with design tokens
- [ ] Implement responsive breakpoints (mobile, tablet, desktop)
- [ ] Test Flexbox/Grid layout (no inline styles)
- [ ] Apply color, typography, spacing tokens
- [ ] Add hover, active, disabled states
- [ ] Ensure proper ARIA labels and keyboard nav

### Testing
- [ ] Run shared functional tests (must pass for V1 & V2)
- [ ] Run V1-specific tests
- [ ] Run V2-specific tests
- [ ] Visual regression snapshot (Percy)
- [ ] Accessibility audit (axe-core)
- [ ] Mobile responsiveness test
- [ ] Keyboard navigation test

### Deployment
- [ ] Create feature flag in `featureFlags.ts`
- [ ] Add environment variable in `.env`
- [ ] Update `package.json` with V2 export
- [ ] Merge to staging
- [ ] Enable flag for 10% users
- [ ] Monitor errors and performance
- [ ] Gradual rollout: 10% → 25% → 50% → 100%
- [ ] Gather user feedback
- [ ] Deprecate V1 after stable period
```

---

## 6. More Examples

### Example 1: Card Component

**File**: `src/components/Card/Card.module.css`

```css
.card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal);
}

.card--elevated {
  box-shadow: var(--shadow-md);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.cardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.cardTitle {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.cardBody {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.cardFooter {
  display: flex;
  gap: var(--gap-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
```

### Example 2: Form Input Group

**File**: `src/components/FormField/FormField.module.css`

```css
.formField {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  margin-bottom: var(--spacing-md);
}

.label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.label.required::after {
  content: ' *';
  color: var(--color-error);
}

.input {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.helpText {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.errorText {
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.input.error {
  border-color: var(--color-error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}
```

---

## Summary

| Component | File | Purpose |
|-----------|------|---------|
| **Design Tokens** | `design-tokens.css` | Global colors, spacing, typography |
| **Reset** | `reset.css` | Normalize browser defaults |
| **Utilities** | `utilities.css` | Common helper classes |
| **Component CSS** | `Component.module.css` | Component-scoped styles |
| **Index** | `index.css` | Import all stylesheets |

Next steps:
1. Copy `design-tokens.css` and `reset.css` to `src/styles/`
2. Update `src/index.css` to import all stylesheets
3. Create V2 components using CSS Modules + design tokens
4. Run tests to ensure no functional regression
5. GraduallEnable feature flags for rollout
