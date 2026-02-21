# UI Redesign — Quick Reference & Execution Roadmap

**Date**: February 2026  
**Status**: Ready for Implementation  
**Estimated Timeline**: 5-8 weeks

---

## What Was Delivered

You now have a **complete UI redesign framework** that ensures:
✅ Zero functional regression  
✅ 100% design token consistency  
✅ Comprehensive test coverage (unit + visual + E2E + accessibility)  
✅ Feature flag-based safe rollout  
✅ Detailed implementation guides

---

## 📁 Documentation Files Created

| File | Purpose | When to Use |
|------|---------|-----------|
| **UI_REDESIGN_STRATEGY.md** | Overall architecture & approach | Start here — explains the full strategy |
| **UI_REDESIGN_TEST_CASES.md** | Complete test case templates | Copy test code, run before/after redesign |
| **DESIGN_SYSTEM_IMPLEMENTATION.md** | Design tokens & utility classes | Create CSS files, copy token values |
| **This File** | Quick reference & execution steps | Day-to-day implementation guide |

---

## 🎯 Implementation Workflow (Step-by-Step)

### Week 1: Setup

**Day 1-2: Create Design System**

```bash
# 1. Create style files
mkdir -p src/styles
touch src/styles/design-tokens.css
touch src/styles/reset.css
touch src/styles/utilities.css

# 2. Copy content from DESIGN_SYSTEM_IMPLEMENTATION.md
# - Copy design-tokens.css content
# - Copy reset.css content
# - Copy utilities.css content

# 3. Update src/index.css
# Add imports: 
# @import './styles/design-tokens.css';
# @import './styles/reset.css';
# @import './styles/utilities.css';

# 4. Install test dependencies
npm install --save-dev \
  @percy/cli @percy/sdk-js \
  jest-axe \
  @axe-core/react \
  @playwright/test
```

**Day 3: Create Feature Flags**

```typescript
// src/utils/featureFlags.ts
export const uiFeatureFlags = {
  'header-v2': process.env.REACT_APP_HEADER_V2 === 'true',
  'page-manager-v2': process.env.REACT_APP_PAGE_MANAGER_V2 === 'true',
  'component-list-v2': process.env.REACT_APP_COMPONENT_LIST_V2 === 'true',
  // ... add more as needed
};
```

**Day 4-5: Write Baseline Tests**

```bash
# 1. Copy test files from UI_REDESIGN_TEST_CASES.md
mkdir -p src/__tests__/{Header,PageManager,integration}
cp [test files from template]

# 2. Run baseline visual snapshots
npm run test:visual:baseline

# 3. Run all tests to ensure they pass with V1
npm test
npm run test:a11y
npm run test:e2e
```

---

### Week 2: Redesign First Component (Header)

**Day 1-2: Create V2 Component**

```bash
# Create parallel V2 component
touch src/components/HeaderV2.tsx
touch src/components/HeaderV2.module.css
```

```typescript
// src/components/HeaderV2.tsx
import styles from './HeaderV2.module.css';

export const HeaderV2: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isBackendConnected,
}) => (
  <header className={styles.header}>
    {/* New layout using CSS Grid/Flexbox */}
    {/* All styles in HeaderV2.module.css using design tokens */}
  </header>
);
```

```css
/* src/components/HeaderV2.module.css */
.header {
  display: flex;
  align-items: center;
  gap: var(--gap-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  /* ... more styles */
}
```

**Day 3: Update Component Selection**

```typescript
// src/components/Header.tsx (wrapper component)
import Header from './HeaderV1';
import HeaderV2 from './HeaderV2';
import { uiFeatureFlags } from '../utils/featureFlags';

export default uiFeatureFlags['header-v2'] ? HeaderV2 : Header;
```

**Day 4: Run Tests**

```bash
# Test shared logic (functional parity)
npm test -- Header.shared.test.tsx

# Tests should PASS for both V1 & V2
# Example results:
# ✓ Header displays course title
# ✓ Save button calls handleSave
# ✓ Validate button opens modal
# ... (all 10 shared tests)

# Visual regression
npm run test:visual:capture

# Accessibility
npm run test:a11y

# E2E
npm run test:e2e
```

**Day 5: Staging Deployment**

```bash
# Enable for staging
echo "REACT_APP_HEADER_V2=true" >> .env.staging

# Deploy to staging
npm run build
# ... deploy to staging environment

# Test on staging (10% rollout)
```

---

### Week 3-4: Redesign Remaining Components

Repeat the Week 2 workflow for:
1. **PageManager** — page list, add/delete/reorder
2. **MenuBar** — menus, validation
3. **Editor / EditorV2** — main editing interface
4. **Preview / PreviewV2** — course preview player
5. **ComponentList** — component management
6. **ComponentSettings** — component config panel

For each component:

| Step | Command/Action | Time |
|------|----------------|------|
| Create V2 | Copy V1 component, create .module.css | 2-3 hours |
| Update styles | Use design tokens, no inline styles | 3-4 hours |
| Test shared logic | `npm test -- [Component].shared` | 1 hour |
| Visual regression | `npm run test:visual:capture` | 30 min |
| Accessibility | `npm run test:a11y` | 30 min |
| E2E tests | `npm run test:e2e` | 1 hour |
| Deploy | Enable feature flag, deploy to staging | 1 hour |

**Estimated time per component**: 8-10 hours

---

### Week 5: Gradual Rollout

```
Timeline: Production Rollout
│
├─ Day 1: Enable for 10% of users
│   └─ Monitor error rates (Sentry), Page Load Time, User Sessions
│
├─ Day 3: Ramp to 25%
│   └─ Check feedback, fix any issues
│
├─ Day 5: Ramp to 50%
│   └─ Continue monitoring
│
├─ Day 7: Ramp to 100%
│   └─ All users on V2
│
└─ Day 14: Cleanup & Deprecation
    └─ Remove V1 code, feature flags, old styles
```

```javascript
// Monitor script
{
  "10% rollout": "REACT_APP_HEADER_V2_ROLLOUT_PERCENTAGE=10",
  "25% rollout": "REACT_APP_HEADER_V2_ROLLOUT_PERCENTAGE=25",
  "50% rollout": "REACT_APP_HEADER_V2_ROLLOUT_PERCENTAGE=50",
  "100% rollout": "REACT_APP_HEADER_V2_ROLLOUT_PERCENTAGE=100",
}
```

---

## 🧪 Testing Commands Reference

### Run Tests

```bash
# All tests
npm test

# Specific test file
npm test -- Header.shared.test.tsx

# Watch mode (for development)
npm test -- --watch

# With coverage
npm test -- --coverage

# Visual regression baseline (BEFORE redesign)
npm run test:visual:baseline

# Visual regression capture (AFTER redesign)
npm run test:visual:capture

# Accessibility only
npm run test:a11y

# E2E tests
npm run test:e2e

# E2E headed (see browser)
npm run test:e2e:headed

# E2E debug
npm run test:e2e:debug

# All quality checks
npm run test && npm run test:visual && npm run test:a11y && npm run test:e2e
```

---

## 🎨 Design Token Quick Reference

### Colors
```css
--color-primary: #1976D2
--color-secondary: #9C27B0
--color-success: #4CAF50
--color-error: #F44336
--color-warning: #FF9800
--color-background: #FFFFFF
--color-text: #212121
```

### Spacing (8px base)
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Typography
```css
--font-family-base: system fonts
--font-size-base: 14px
--font-size-lg: 16px
--font-size-xl: 18px
--font-size-h4: 24px
--font-size-h3: 32px
--font-size-h2: 40px
--font-size-h1: 48px
```

### Border Radius
```css
--radius-sm: 2px
--radius-md: 4px
--radius-lg: 8px
--radius-xl: 12px
```

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.12)
--shadow-md: 0 3px 6px rgba(0,0,0,0.15)
--shadow-lg: 0 10px 20px rgba(0,0,0,0.15)
```

All tokens in: [DESIGN_SYSTEM_IMPLEMENTATION.md](DESIGN_SYSTEM_IMPLEMENTATION.md)

---

## 📝 CSS Best Practices Checklist

For every component you redesign, verify:

### ✅ Code Quality

- [ ] **No inline `style={}` attributes** — all styles in CSS Module
- [ ] **All colors use `var(--color-*)`** — not hardcoded hex values
- [ ] **All spacing uses `var(--spacing-*)`** — not `8px`, `16px`, etc.
- [ ] **All typography uses `var(--font-size-*)`** — not `14px`, `16px`, etc.
- [ ] **Shadows use `var(--shadow-*)`** — not hardcoded `0 1px 3px`
- [ ] **Transitions use `var(--transition-*)`** — not hardcoded `200ms ease`
- [ ] **Border radius uses `var(--radius-*)`** — not hardcoded `4px`

### ✅ Responsiveness

- [ ] **Mobile-first approach** — base styles for small screens
- [ ] **Tested on 3 breakpoints** — mobile (375px), tablet (768px), desktop (1024px)
- [ ] **No hardcoded widths** — use `%`, `flex`, or `grid`
- [ ] **Use `@media (max-width)` for mobile-first** or `@media (min-width)` for desktop-first

### ✅ Accessibility

- [ ] **All buttons have `aria-label` or visible text**
- [ ] **Interactive elements focusable** with TAB
- [ ] **Focus styles visible** (not removed)
- [ ] **Color contrast ≥ 4.5:1** for text
- [ ] **Icons paired with text labels** or have `aria-label`
- [ ] **Forms have associated `<label>` elements**
- [ ] **No keyboard traps** (can Tab out of everything)

### ✅ Performance

- [ ] **No CSS animations on page load** (use `prefers-reduced-motion`)
- [ ] **Transitions are 150-300ms** (not 1000ms+)
- [ ] **Minimal box-shadow** use (expensive to render)
- [ ] **Use CSS Grid/Flexbox** (not floats or absolute positioning)
- [ ] **CSS specificity is low** (avoid `!important`)

### ✅ Testing

- [ ] **Shared unit tests pass for both V1 & V2**
- [ ] **Visual regression diff < 1% pixel change**
- [ ] **Accessibility audit passes** (zero violations)
- [ ] **E2E workflow tests pass** (user journeys work)
- [ ] **Mobile, tablet, desktop viewports tested**

---

## 🚀 Day-to-Day Workflow

### Daily Standup Checklist

- [ ] Run full test suite: `npm test && npm run test:visual && npm run test:a11y && npm run test:e2e`
- [ ] Check visual regression diffs (Percy dashboard)
- [ ] Review accessibility audit results
- [ ] Verify no regressions from previous day's changes
- [ ] Update feature flag percentages (if in rollout phase)
- [ ] Check error tracking dashboard (Sentry) for new issues

### Before Committing Code

```bash
# 1. Run all tests
npm test
npm run test:visual:capture
npm run test:a11y
npm run test:e2e

# 2. Check coverage
npm test -- --coverage

# 3. Lint and format
npm run lint:fix
npm run format

# 4. Type check
npm run type-check

# 5. Commit with message
git commit -m "feat: redesign Header component with new design tokens"
```

### Release Checklist

```markdown
## Before enabling feature flag in production:

- [ ] All shared tests passing
- [ ] Visual regression approved
- [ ] Accessibility audit passed (zero violations)
- [ ] E2E tests all green
- [ ] Performance metrics baseline established
- [ ] Error rates normal
- [ ] Code review approved
- [ ] Merge to main branch
- [ ] Build succeeds
- [ ] Deploy to staging
- [ ] Smoke tests pass
- [ ] Ready for gradual rollout (start at 10%)
```

---

## 🐛 Troubleshooting

### Tests Failing with "Cannot find module"

```bash
# Likely cause: CSS Module not being imported
# Solution: Check file name matches exactly
# Header.module.css  ← correct
# header.module.css  ← wrong (case sensitive)
```

### Visual Regression Shows False Positives

```bash
# Likely cause: Anti-aliasing differences between browsers
# Solution: 
# 1. Increase threshold in Percy config
# 2. Re-baseline if intentional change
# 3. Test on multiple browsers (Chrome, Firefox, Safari)
```

### Accessibility Tests Fail on Focus Styles

```bash
# Likely cause: Focus outline removed (e.g., outline: none; without replacement)
# Solution: Always provide alternative focus indicator
```

```css
/* ❌ Bad */
button:focus {
  outline: none;  /* Removes focus indicator entirely */
}

/* ✅ Good */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Mobile Viewport Tests Fail

```bash
# Likely cause: Hardcoded pixel widths or horizontal overflow
# Solution: Use responsive units
```

```css
/* ❌ Bad */
.container {
  width: 1200px;  /* Fixed width breaks on mobile */
}

/* ✅ Good */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
```

---

## 📊 Success Metrics

Track these KPIs during rollout:

| Metric | Target | How to Measure |
|--------|--------|-----------------|
| **Test Coverage** | > 80% | Coverage report from Jest |
| **Functional Regression** | 0% | Shared tests pass for V1 & V2 |
| **Visual Diff** | < 1% pixel change | Percy visual regression |
| **Accessibility Violations** | 0 | axe-core audit |
| **E2E Pass Rate** | 100% | Playwright test success |
| **User Error Rate** | ≤ baseline | Sentry/error tracking |
| **Page Load Time** | ≤ baseline | Lighthouse/web vitals |
| **User Satisfaction** | ≥ 4/5 | User feedback survey |

---

## 🔗 Helpful Resources

### Documentation
- [UI_REDESIGN_STRATEGY.md](UI_REDESIGN_STRATEGY.md) — Full strategy guide
- [UI_REDESIGN_TEST_CASES.md](UI_REDESIGN_TEST_CASES.md) — Test templates
- [DESIGN_SYSTEM_IMPLEMENTATION.md](DESIGN_SYSTEM_IMPLEMENTATION.md) — Design tokens & CSS

### Tools Setup
- Jest: `npm install --save-dev jest @testing-library/react`
- Percy: `npm install --save-dev @percy/cli @percy/sdk-js`
- Playwright: `npm install --save-dev @playwright/test`
- axe-core: `npm install --save-dev jest-axe @axe-core/react`

### External Resources
- CSS Design System: https://material-io.cn/
- Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
- CSS Modules: https://github.com/css-modules/css-modules
- Percy Documentation: https://docs.percy.io/
- Playwright: https://playwright.dev/docs/intro

---

## 📞 Getting Help

If you encounter issues during implementation:

1. **Check Troubleshooting Section** (above)
2. **Review Test Failures** — Jest output tells you exactly what failed
3. **Check Visual Diffs** — Percy shows before/after side-by-side
4. **Accessibility Violations** — axe-core shows specific WCAG rules
5. **Browser Console** — Check for CSS errors or warnings
6. **Mobile DevTools** — Verify responsive layout on actual devices

---

## ✨ Final Checklist

Before you start: **Verify you have**

- [ ] All 4 documentation files
- [ ] Design tokens CSS file copied
- [ ] Feature flags configured
- [ ] Test dependencies installed
- [ ] Baseline visual snapshots captured
- [ ] Feature branch created
- [ ] Team communication plan (for gradual rollout)

**You're ready to begin the redesign! 🚀**

---

## Timeline Summary

| Week | Deliverable | Status |
|------|------|-|
| 1 | Design system setup + baseline tests | ✅ Ready |
| 2 | Header V2 component redesign | ⏳ Ready |
| 3-4 | Remaining component redesigns | ⏳ Ready |
| 5 | Gradual production rollout (10%→100%) | ⏳ Ready |
| 5-6 | Monitoring + user feedback | ⏳ Ready |
| 6 | V1 deprecation + cleanup | ⏳ Ready |

---

**Last Updated**: February 21, 2026  
**Status**: Implementation Ready  
**Next Step**: Follow Week 1 setup instructions ☝️
