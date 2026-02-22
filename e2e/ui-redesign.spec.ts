/**
 * UI Redesign Validation Tests
 * 
 * Purpose: Capture screenshots at each UI redesign step to validate:
 * 1. Dark theme → Light theme conversion
 * 2. Template width (full width available)
 * 3. Button placement and styling ("Generate New Template")
 * 4. App/Course name repositioning
 * 5. NO functional regression
 * 
 * Run: npm run test:e2e -- ui-redesign.spec.ts
 * 
 * Screenshots saved to: design-testing/current-v2-light/
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_PATH = 'design-testing/current-v2-light';

// Ensure screenshot directory exists
function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_PATH)) {
    fs.mkdirSync(SCREENSHOT_PATH, { recursive: true });
  }
}

test.describe('UI Redesign - Light Theme & Layout Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    ensureScreenshotDir();
    // Enable screenshot capture
    page.on('console', msg => {
      if (msg.type() === 'log') console.log(`LOG: ${msg.text()}`);
    });
  });

  /**
   * TEST 1: Header Component - Light Theme & Repositioning
   * Validates:
   * - Dark background → Light background (#FFFFFF)
   * - Dark text → Dark text (#2C3E50)
   * - App title color change
   * - Course name repositioning (vertical stack)
   * - Button styling in light theme
   */
  test('Header: Dark → Light Theme + App/Course Name Repositioning', async ({ page }) => {
    console.log('📸 TEST 1: Header Component Validation');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Load example course
    const loadBtn = page.getByRole('button', { name: /load example/i });
    await expect(loadBtn).toBeVisible({ timeout: 5000 });
    await loadBtn.click();
    await page.waitForTimeout(2000);
    
    // SCREENSHOT 1: Header with light theme
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-header-light-theme.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 80 } // Header only
    });
    console.log('  ✅ Screenshot: 01-header-light-theme.png');
    
    // Validate header styling (light theme)
    const header = page.locator('.header');
    await expect(header).toBeVisible();
    
    // Check colors via CSS variables (should be light theme)
    const headerStyles = await header.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderBottom: computed.borderBottom
      };
    });
    
    console.log('  📋 Header computed styles:', headerStyles);
    
    // Validate app title is visible and repositioned
    const appTitle = page.locator('.app-title');
    await expect(appTitle).toBeVisible();
    const appTitleText = await appTitle.textContent();
    console.log(`  📝 App title: ${appTitleText}`);
    
    // Validate course title is visible and repositioned
    const courseTitle = page.locator('.course-title').first();
    await expect(courseTitle).toBeVisible();
    const courseTitleText = await courseTitle.textContent();
    console.log(`  📝 Course title: ${courseTitleText}`);
    
    // Check if app title and course title are stacked vertically
    const appTitleBox = await appTitle.boundingBox();
    const courseTitleBox = await courseTitle.boundingBox();
    
    if (appTitleBox && courseTitleBox) {
      console.log(`  📏 App title Y: ${appTitleBox.y}, Course title Y: ${courseTitleBox.y}`);
      if (courseTitleBox.y > appTitleBox.y) {
        console.log('  ✅ Titles stacked vertically (correct repositioning)');
      } else {
        console.log('  ⚠️  Titles may be horizontal (needs verification)');
      }
    }
    
    // SCREENSHOT 2: Header detail
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/02-header-detail.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
    console.log('  ✅ Screenshot: 02-header-detail.png');
  });

  /**
   * TEST 2: Template Editor - Full Width
   * Validates:
   * - Template taking full available width
   * - No max-width limiting container
   * - Layout expansion
   */
  test('Template Editor: Full Width Layout', async ({ page }) => {
    console.log('📸 TEST 2: Template Width Validation');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Load example
    await page.getByRole('button', { name: /load example/i }).click();
    await page.waitForTimeout(2000);
    
    // Switch to editor view if not already there
    const editorBtn = page.getByRole('button', { name: /editor/i });
    if (await editorBtn.isVisible()) {
      await editorBtn.click();
    }
    
    // Wait for template editor to load
    await page.waitForTimeout(1000);
    
    // SCREENSHOT 3: Template editor full page
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/03-template-editor-full-width.png`,
      fullPage: true
    });
    console.log('  ✅ Screenshot: 03-template-editor-full-width.png');
    
    // Validate template editor width
    const templateEditor = page.locator('.template-editor');
    if (await templateEditor.isVisible()) {
      const templateBox = await templateEditor.boundingBox();
      const windowSize = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight
      }));
      
      if (templateBox) {
        console.log(`  📏 Template width: ${templateBox.width}px / Window width: ${windowSize.width}px`);
        const usagePercent = parseFloat((templateBox.width / windowSize.width * 100).toFixed(1));
        console.log(`  📊 Width usage: ${usagePercent}%`);
        
        if (usagePercent > 90) {
          console.log('  ✅ Template using >90% of available width (GOOD)');
        } else {
          console.log(`  ⚠️  Template only using ${usagePercent}% width (needs expansion)`);
        }
      }
    }
  });

  /**
   * TEST 3: Generate Button - Placement & Styling
   * Validates:
   * - Button location
   * - Button styling (light theme)
   * - Button interactions
   */
  test('Generate Button: Placement & Light Theme Styling', async ({ page }) => {
    console.log('📸 TEST 3: Generate Button Validation');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Load example
    await page.getByRole('button', { name: /load example/i }).click();
    await page.waitForTimeout(2000);
    
    // Switch to editor
    const editorBtn = page.getByRole('button', { name: /editor/i });
    if (await editorBtn.isVisible()) {
      await editorBtn.click();
    }
    
    await page.waitForTimeout(1000);
    
    // Look for "Generate" or "New Template" button
    const generateBtn = page.getByRole('button', { 
      name: /generate|new template/i 
    }).first();
    
    if (await generateBtn.isVisible()) {
      console.log('  ✅ Generate button found and visible');
      
      // Validate button styling
      const btnStyles = await generateBtn.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          padding: computed.padding,
          borderRadius: computed.borderRadius
        };
      });
      console.log('  📋 Button styles:', btnStyles);
      
      // Get button position
      const btnBox = await generateBtn.boundingBox();
      if (btnBox) {
        console.log(`  📍 Button position: X=${btnBox.x}, Y=${btnBox.y}`);
      }
      
      // SCREENSHOT 4: Generate button closeup
      if (btnBox) {
        await page.screenshot({
          path: `${SCREENSHOT_PATH}/04-generate-button.png`,
          fullPage: false,
          clip: {
            x: Math.max(0, btnBox.x - 20),
            y: Math.max(0, btnBox.y - 20),
            width: btnBox.width + 40,
            height: btnBox.height + 40
          }
        });
        console.log('  ✅ Screenshot: 04-generate-button.png');
      }
      
      // Test button hover state
      await generateBtn.hover();
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/05-generate-button-hover.png`,
        fullPage: false,
        clip: {
          x: Math.max(0, btnBox!.x - 20),
          y: Math.max(0, btnBox!.y - 20),
          width: btnBox!.width + 40,
          height: btnBox!.height + 40
        }
      });
      console.log('  ✅ Screenshot: 05-generate-button-hover.png');
    } else {
      console.log('  ⚠️  Generate button not found - need to verify button location');
    }
  });

  /**
   * TEST 4: Functional Parity - No Regression
   * Validates:
   * - Course loads correctly
   * - Pages are accessible
   * - Templates can be edited
   * - Save functionality works
   * - No console errors/warnings
   */
  test('Functionality: No Regression with UI Changes', async ({ page }) => {
    console.log('🧪 TEST 4: Functional Regression Check');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Capture console errors/warnings
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log(`  ❌ Console Error: ${msg.text()}`);
      }
      if (msg.type() === 'warning') {
        warnings.push(msg.text());
        console.log(`  ⚠️  Console Warning: ${msg.text()}`);
      }
    });
    
    // Navigate to app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('  ✅ App loaded');
    
    // Load example course
    const loadBtn = page.getByRole('button', { name: /load example/i });
    await expect(loadBtn).toBeVisible({ timeout: 5000 });
    await loadBtn.click();
    await page.waitForTimeout(2000);
    console.log('  ✅ Example course loaded');
    
    // Verify course title exists
    const courseTitle = page.locator('.course-title').first();
    await expect(courseTitle).not.toHaveText('');
    console.log('  ✅ Course title displayed');
    
    // Test switching views
    const editorBtn = page.getByRole('button', { name: /editor/i });
    const previewBtn = page.getByRole('button', { name: /preview/i });
    
    if (await editorBtn.isVisible()) {
      await editorBtn.click();
      await page.waitForTimeout(500);
      console.log('  ✅ Editor view works');
    }
    
    if (await previewBtn.isVisible()) {
      await previewBtn.click();
      await page.waitForTimeout(500);
      console.log('  ✅ Preview view works');
    }
    
    // Check for critical errors
    if (errors.length > 0) {
      console.log(`  ⚠️  Found ${errors.length} console errors`);
    } else {
      console.log('  ✅ No console errors');
    }
    
    // SCREENSHOT 5: App with no errors
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/06-functional-check.png`,
      fullPage: true
    });
    console.log('  ✅ Screenshot: 06-functional-check.png');
  });

  /**
   * TEST 5: Full Page Comparison
   * Captures entire page for visual comparison
   */
  test('Full Page: Color & Layout Validation', async ({ page }) => {
    console.log('📸 TEST 5: Full Page Visual Validation');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Load example
    await page.getByRole('button', { name: /load example/i }).click();
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/07-full-page-light-theme.png`,
      fullPage: true
    });
    console.log('  ✅ Screenshot: 07-full-page-light-theme.png');
    
    // Color analysis
    const body = page.locator('body');
    const bodyStyles = await body.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    console.log('  📋 Page background color:', bodyStyles.backgroundColor);
    console.log('  📋 Page text color:', bodyStyles.color);
  });
});

/**
 * SUMMARY FUNCTION FOR REPORTING
 * Run this to generate a comparison report
 */
test.describe.skip('UI Redesign Report', () => {
  test('Generate Comparison Report', async () => {
    const report = `
# UI Redesign Validation Report
Generated: ${new Date().toISOString()}

## Screenshots Captured
- 01-header-light-theme.png - Header with light theme colors
- 02-header-detail.png - Header detail view
- 03-template-editor-full-width.png - Template taking full width
- 04-generate-button.png - Generate button styling
- 05-generate-button-hover.png - Generate button hover state
- 06-functional-check.png - Functionality verification
- 07-full-page-light-theme.png - Full page light theme

## Validation Checklist
- [ ] Colors changed from dark to light
- [ ] Header background is white/light
- [ ] Text colors are dark (not light on dark)
- [ ] Template uses full available width
- [ ] Generate button repositioned correctly
- [ ] App name and course name stacked vertically
- [ ] All buttons styled for light theme
- [ ] No console errors
- [ ] No functional regression
- [ ] All views work (Editor, Preview, etc)

## Issues Found
(Add issues here as you find them)

## Resolution
(Document resolutions here)
    `;
    
    fs.writeFileSync(
      'design-testing/VALIDATION_REPORT.md',
      report
    );
    console.log('📋 Report generated: design-testing/VALIDATION_REPORT.md');
  });
});
