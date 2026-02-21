# Issue Template
# Copy this template and fill it out for each issue found

# ISSUE-XXX: [Brief Title]

## 📸 Screenshot Evidence
- **File**: `design-testing/current-v2-light/[screenshot-name].png`
- **Date**: [Date found]
- **Status**: 🔴 NEW / 🟡 IN PROGRESS / 🟢 RESOLVED

## 📋 Problem Description

### What's Wrong?
(Describe the issue in detail)

Example:
- Header background is dark (#1a1a2e) instead of white (#FFFFFF)
- Text colors are light gray instead of dark
- Buttons don't have light theme styling

### Where Did We Find It?
(Which component/page/section)

Example:
- Component: Header.tsx
- CSS File: Header.css
- Visible on: All pages (header is global)

## ✅ Expected Behavior

### How Should It Look?
(Describe the correct appearance)

Example:
- Header background: White (#FFFFFF)
- Header text: Dark (#2C3E50)
- Buttons: Light gray background (#F8F9FA) with dark text
- App title: Blue (#1976D2)
- Course title: Dark with reduced opacity

## 🔍 Root Cause Analysis

### What's Causing This?
(CSS variable? hardcoded color? missing rule?)

Example:
```
Issue: CSS file still uses dark theme variables
File: src/components/Header.css
Problem: 
  .header {
    background: var(--topbar-bg);  /* Points to dark color */
    color: var(--topbar-text);     /* Points to light color */
  }
```

## 🛠️ Resolution

### Changes Made
(Step by step what we're changing)

- [ ] Step 1: Edit Header.css - change background color
- [ ] Step 2: Update text colors to dark
- [ ] Step 3: Verify button styling
- [ ] Step 4: Test in browser
- [ ] Step 5: Run tests to confirm

### Code Changes
```diff
File: src/components/Header.css

- .header {
-   background: var(--topbar-bg);      /* dark */
-   color: var(--topbar-text);         /* light */
- }

+ .header {
+   background: #FFFFFF;               /* white */
+   color: #2C3E50;                    /* dark */
+   box-shadow: 0 2px 8px rgba(0,0,0,0.06);
+ }
```

### Before & After Screenshots
- **Before**: `design-testing/current-v2-light/01-header-v1.png`
- **After**: `design-testing/current-v2-light/01-header-v2-FINAL.png`

## ✨ Verification

### Checklist
- [ ] Visual looks correct in screenshot
- [ ] All tests still passing
- [ ] No console errors
- [ ] Component still functional
- [ ] Responsive design verified

### Test Results
```
Command: npm run test:e2e -- ui-redesign.spec.ts --grep "Header"
Status: ✅ PASSED
Duration: X seconds
```

## 📝 Notes
(Any additional observations)

---

**Created**: [Date]  
**Resolved**: [Date]  
**Reviewed By**: [Your name]
