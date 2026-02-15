# E2E Testing with Playwright - Screenshot Guide

## 🎯 Overview

Playwright E2E tests automatically capture screenshots at each workflow step and on test failures. Screenshots provide visual evidence that features are working correctly.

---

## 📁 Screenshot Locations

### Automatic Screenshots (Test Steps)
```
test-results/
  screenshots/
    01-landing-page.png
    02-new-course-created.png
    03-page-added.png
    04-component-picker-opened.png
    05-welcome-component-added.png
    06-component-edited.png
    07-preview-mode.png
    08-validation-result.png
    09-course-saved.png
    10-export-attempted.png
    validation/
      mcq-empty.png
      mcq-validation-errors.png
      welcome-valid.png
      welcome-validation-pass.png
      component-picker-full.png
```

### Failure Screenshots
```
test-results/
  smoke-flow-SMOKE-E2E-01-Complete-workflow-chromium/
    test-failed-1.png
    trace.zip
    video.webm
```

### HTML Report (Interactive)
```
playwright-report/
  index.html  ← Open this in browser to see all screenshots
```

---

## 🚀 Running E2E Tests

### Run All Tests (Headless)
```bash
npm run test:e2e
```

### Run with UI (Interactive)
```bash
npm run test:e2e:ui
```

### Run in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Mode (Step Through)
```bash
npm run test:e2e:debug
```

### View Last Test Report
```bash
npm run test:e2e:report
```

---

## 📊 Test Coverage

### Smoke Flow Tests (smoke-flow.spec.ts)

**SMOKE-E2E-01: Complete workflow**
- ✅ Landing page capture
- ✅ New course creation
- ✅ Page addition
- ✅ Component picker UI
- ✅ Welcome component added
- ✅ Component editing
- ✅ Preview mode
- ✅ Validation execution
- ✅ Course save (Ctrl+S)
- ✅ Export attempt

**SMOKE-E2E-02: Validation gating**
- ✅ Invalid MCQ state
- ✅ Export button disabled with errors

**SMOKE-E2E-03: Data persistence**
- ✅ Text component before edit
- ✅ Text component after edit
- ✅ Content after page reload

### Validation Tests (validation.spec.ts)

**VAL-E2E-01: MCQ validation**
- ✅ Empty MCQ component
- ✅ Validation error display

**VAL-E2E-02: Welcome validation**
- ✅ Valid welcome component
- ✅ Validation pass state

**VAL-E2E-03: Component registry**
- ✅ Full component picker screenshot
- ✅ All categories visible

---

## 🔍 Viewing Screenshots

### Option 1: Direct Files
Navigate to `test-results/screenshots/` and open PNG files

### Option 2: HTML Report (Recommended)
```bash
npm run test:e2e:report
```
This opens an interactive report with:
- All test steps with screenshots
- Pass/fail status
- Execution timeline
- Video recordings (on failure)
- Trace files for debugging

### Option 3: During Test Run
```bash
npm run test:e2e:headed
```
Watch tests execute in real browser

---

## 📸 Screenshot Capture Points

### Automatic Captures

1. **Every test.step()** - Screenshot after each major action
2. **On failure** - Automatic screenshot when test fails
3. **Video recording** - Full video on failure
4. **Trace files** - Complete execution trace for debugging

### Manual Screenshot Capture

Add to any test:
```typescript
await page.screenshot({ 
  path: 'test-results/screenshots/custom-screenshot.png',
  fullPage: true  // Capture entire scrollable page
});
```

---

## 🎨 Screenshot Configuration

Located in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',  // or 'on', 'off'
  video: 'retain-on-failure',     // or 'on', 'off', 'retain-on-first-retry'
  trace: 'retain-on-failure',     // or 'on', 'off', 'retain-on-first-retry'
  viewport: { width: 1280, height: 720 },
}
```

---

## 📂 Test Structure

```
e-learning-frontend/
  e2e/
    smoke-flow.spec.ts     ← Main workflow tests
    validation.spec.ts     ← Validation tests
  test-results/
    screenshots/           ← Your screenshots here
    *.json                 ← Test results data
  playwright-report/       ← HTML report
  playwright.config.ts     ← Configuration
```

---

## 🐛 Debugging Failed Tests

### View Trace File
```bash
npx playwright show-trace test-results/trace.zip
```

### Watch Video
Open `test-results/*/video.webm` in browser

### View Screenshot
Open `test-results/*/test-failed-*.png`

### Re-run Single Test
```bash
npx playwright test --grep "SMOKE-E2E-01"
```

---

## ✅ Example Test Run Output

```
Running 6 tests using 1 worker

  ✓ smoke-flow.spec.ts:13:3 › SMOKE-E2E-01: Complete workflow (15s)
    ✅ Screenshot: 01-landing-page.png
    ✅ Screenshot: 02-new-course-created.png
    ✅ Screenshot: 03-page-added.png
    ✅ Screenshot: 04-component-picker-opened.png
    ✅ Screenshot: 05-welcome-component-added.png
    ✅ Screenshot: 06-component-edited.png
    ✅ Screenshot: 07-preview-mode.png
    ✅ Screenshot: 08-validation-result.png
    ✅ Screenshot: 09-course-saved.png
    ✅ Screenshot: 10-export-attempted.png

  ✓ smoke-flow.spec.ts:120:3 › SMOKE-E2E-02: Validation blocks export (8s)
  ✓ smoke-flow.spec.ts:165:3 › SMOKE-E2E-03: Component data persists (10s)
  ✓ validation.spec.ts:9:3 › VAL-E2E-01: MCQ validation (7s)
  ✓ validation.spec.ts:43:3 › VAL-E2E-02: Welcome validation (8s)
  ✓ validation.spec.ts:81:3 › VAL-E2E-03: All components accessible (6s)

6 passed (54s)

To open last HTML report run:
  npx playwright show-report
```

---

## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Interactive test UI |
| `npm run test:e2e:headed` | See browser window |
| `npm run test:e2e:debug` | Debug mode |
| `npm run test:e2e:report` | View HTML report |
| `npx playwright test --grep "keyword"` | Run specific test |
| `npx playwright show-trace trace.zip` | Debug trace file |

---

## 🎯 Next Steps

1. **Run first test**: `npm run test:e2e`
2. **View screenshots**: Check `test-results/screenshots/`
3. **Open HTML report**: `npm run test:e2e:report`
4. **Add more tests**: Create new `.spec.ts` files in `e2e/`

---

**All screenshots are automatically captured and organized by test execution!**
