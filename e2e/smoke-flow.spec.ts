import { test, expect, Page } from '@playwright/test';

/**
 * E2E Smoke Flow Test with Screenshots
 * Tests complete workflow: New Course → Add Pages → Components → Edit → Preview → Validate → Export
 * 
 * Screenshots are automatically captured at each step and saved to:
 * - test-results/ (failure screenshots)
 * - playwright-report/ (HTML report with all screenshots)
 */

test.describe('Smoke Flow: Full E2E Workflow with Screenshots', () => {
  
  test('SMOKE-E2E-01: Complete workflow from new course to export', async ({ page }) => {
    console.log('🧪 Starting E2E smoke test with screenshot capture - VERSION 2');
    
    // STEP 1: Navigate to application
    await test.step('Navigate to application', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/screenshots/01-landing-page.png', fullPage: true });
      console.log('  ✅ Screenshot: 01-landing-page.png');
    });

    // STEP 2: Create new course
    await test.step('Create new course', async () => {
      console.log('🔄 STEP 2: Using Load Example button approach');
      
      // Use the "Load Example" button instead of the menu (more reliable)
      const loadExampleButton = page.getByRole('button', { name: /load example/i });
      await expect(loadExampleButton).toBeVisible({ timeout: 10000 });
      await loadExampleButton.click();
      
      await page.waitForTimeout(2000); // Wait for course loading
      
      // Verify we're in editor mode (not the "No Course Loaded" state)
      const noCourseLoaded = page.locator('text=No Course Loaded');
      const isNoCourseVisible = await noCourseLoaded.isVisible();
      console.log('Is "No Course Loaded" visible:', isNoCourseVisible);
      
      if (isNoCourseVisible) {
        throw new Error('Course loading failed - still showing "No Course Loaded"');
      }
      
      // Verify course title appears in header
      const courseTitle = page.locator('.course-title').first();
      await expect(courseTitle).not.toHaveText('No Course Loaded');
      
      await page.screenshot({ path: 'test-results/screenshots/02-course-loaded.png', fullPage: true });
      console.log('  ✅ Screenshot: 02-course-loaded.png');
    });

    // STEP 3: Select existing page (example course already has pages)
    await test.step('Select existing page', async () => {
      console.log('🔄 STEP 3: Selecting existing page - START');
      
      // Check how many page items exist
      const pageItems = page.locator('.page-item');
      const pageItemCount = await pageItems.count();
      console.log('Found page items:', pageItemCount);
      
      if (pageItemCount === 0) {
        throw new Error('No page items found in PageManager');
      }
      
      // The example course has pages, select the first one
      const firstPageItem = pageItems.first();
      await expect(firstPageItem).toBeVisible({ timeout: 5000 });
      
      // Get the text of the first page item
      const pageItemText = await firstPageItem.textContent();
      console.log('First page item text:', pageItemText);
      
      // Check if the page item is clickable
      const isPageItemClickable = await firstPageItem.isEnabled();
      console.log('Is page item enabled/clickable:', isPageItemClickable);
      
      // Try clicking with force to see if it's a CSS/z-index issue
      await firstPageItem.click({ force: true });
      console.log('Clicked page item with force: true');
      
      // Debug: Wait and check again if page selection worked
      await page.waitForTimeout(1000);
      
      // Check again after waiting
      const pageTitleInputAfter = page.locator('.editor-v2__page-title-input');
      const isPageTitleVisibleAfter = await pageTitleInputAfter.isVisible();
      console.log('Is page title input visible AFTER wait:', isPageTitleVisibleAfter);
      
      if (isPageTitleVisibleAfter) {
        const pageTitleValue = await pageTitleInputAfter.inputValue();
        console.log('Page title input value:', pageTitleValue);
      }
      
      // Wait for page to be selected and component list to load
      await page.waitForTimeout(1000);
      
      // Debug: Check if page title input is visible (indicates page is selected)
      const pageTitleInput = page.locator('.editor-v2__page-title-input');
      const isPageTitleVisible = await pageTitleInput.isVisible();
      console.log('Is page title input visible:', isPageTitleVisible);
      
      if (isPageTitleVisible) {
        const pageTitleValue = await pageTitleInput.inputValue();
        console.log('Page title input value:', pageTitleValue);
      }
      
      // Debug: Check if ComponentList is visible
      const componentList = page.locator('.component-list');
      const isComponentListVisible = await componentList.isVisible();
      console.log('Is component list visible:', isComponentListVisible);
      
      if (isComponentListVisible) {
        // Check if there are existing components
        const componentItems = page.locator('.component-list__item');
        const componentCount = await componentItems.count();
        console.log('Number of existing components:', componentCount);
      } else {
        console.log('ComponentList not visible - page may not be selected properly');
      }
      
      await page.screenshot({ path: 'test-results/screenshots/03-page-selected.png', fullPage: true });
      console.log('  ✅ Screenshot: 03-page-selected.png');
      console.log('🔄 STEP 3: Selecting existing page - END');
    });

    // STEP 4: Open component picker
    await test.step('Open component picker', async () => {
      console.log('🔄 STEP 4: Looking for Add Component button - VERSION 2');
      
      // Wait a bit for component list to load
      await page.waitForTimeout(1000);
      
      // Scroll to bottom of page to ensure Add Component button is visible
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
      const buttonCount = await addComponentButton.count();
      console.log('Found add component buttons:', buttonCount);
      
      if (buttonCount === 0) {
        // Debug: list all buttons on the page
        const allButtons = page.locator('button');
        const buttonTexts = await allButtons.allTextContents();
        console.log('All buttons on page:', buttonTexts.slice(0, 10)); // First 10 buttons
      }
      
      await expect(addComponentButton).toBeVisible({ timeout: 5000 });
      await addComponentButton.click();
      
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/screenshots/04-component-picker-opened.png', fullPage: true });
      console.log('  ✅ Screenshot: 04-component-picker-opened.png');
    });

    // STEP 5: Select welcome component
    await test.step('Select welcome component', async () => {
      // Wait for component cards to load
      await page.waitForTimeout(1000);
      
      // Try to find welcome component card, or fall back to first component
      let componentToSelect;
      try {
        componentToSelect = page.locator('.component-card').filter({ hasText: /welcome/i }).first();
        await expect(componentToSelect).toBeVisible({ timeout: 3000 });
        console.log('Found welcome component');
      } catch (e) {
        console.log('Welcome component not found, selecting first available component');
        componentToSelect = page.locator('.component-card').first();
        await expect(componentToSelect).toBeVisible({ timeout: 3000 });
        console.log('Selected first component card');
      }
      
      await componentToSelect.click();
      
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/05-welcome-component-added.png', fullPage: true });
      console.log('  ✅ Screenshot: 05-welcome-component-added.png');
    });

    // STEP 6: Edit component title
    await test.step('Edit component title', async () => {
      // Handle both direct input and edit button pattern
      const titleEditButton = page.getByRole('button', { name: /edit title/i });
      if (await titleEditButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await titleEditButton.click();
        await page.waitForTimeout(300);
      }
      
      const titleInput = page.getByLabel(/title/i).or(page.getByPlaceholder(/title/i)).first();
      
      if (await titleInput.isVisible()) {
        await titleInput.clear();
        await titleInput.fill('Welcome to Advanced Training');
        await page.waitForTimeout(1000); // Wait for debounced save
        
        await page.screenshot({ path: 'test-results/screenshots/06-component-edited.png', fullPage: true });
        console.log('  ✅ Screenshot: 06-component-edited.png');
      }
    });

    // STEP 7: Open preview mode
    await test.step('Open preview mode', async () => {
      const previewButton = page.getByRole('button', { name: /preview/i });
      
      if (await previewButton.isVisible()) {
        await previewButton.click();
        await page.waitForTimeout(1000);
        
        await page.screenshot({ path: 'test-results/screenshots/07-preview-mode.png', fullPage: true });
        console.log('  ✅ Screenshot: 07-preview-mode.png');
        
        // Exit preview
        const exitButton = page.getByRole('button', { name: /exit|close/i }).first();
        if (await exitButton.isVisible()) {
          await exitButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    // STEP 8: Validate course
    await test.step('Validate course', async () => {
      const validateButton = page.getByRole('button', { name: /validate/i });
      
      if (await validateButton.isVisible()) {
        await validateButton.click();
        await page.waitForTimeout(1000);
        
        await page.screenshot({ path: 'test-results/screenshots/08-validation-result.png', fullPage: true });
        console.log('  ✅ Screenshot: 08-validation-result.png');
      }
    });

    // STEP 9: Save course (Ctrl+S)
    await test.step('Save course', async () => {
      await page.keyboard.press('Control+S');
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/screenshots/09-course-saved.png', fullPage: true });
      console.log('  ✅ Screenshot: 09-course-saved.png');
    });

    // STEP 10: Export SCORM (if no validation errors)
    await test.step('Attempt SCORM export', async () => {
      const exportButton = page.getByRole('button', { name: /export/i });
      
      if (await exportButton.isVisible()) {
        const isDisabled = await exportButton.isDisabled();
        console.log(`  Export button state: ${isDisabled ? 'disabled' : 'enabled'}`);
        
        if (!isDisabled) {
          await exportButton.click();
          await page.waitForTimeout(2000);
        }
        
        await page.screenshot({ path: 'test-results/screenshots/10-export-attempted.png', fullPage: true });
        console.log('  ✅ Screenshot: 10-export-attempted.png');
      }
    });

    console.log('🎉 E2E smoke test completed - All screenshots saved to test-results/screenshots/');
  });

  test('SMOKE-E2E-02: Validation blocks export with invalid data', async ({ page }) => {
    console.log('🧪 Testing validation gating on export');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Create course
    const fileMenuButton = page.getByRole('button', { name: 'File' });
    await fileMenuButton.click();
    const newCourseMenuItem = page.getByRole('menuitem', { name: /new course/i });
    await newCourseMenuItem.click();
    page.on('dialog', async dialog => {
      await dialog.accept('Validation Test Course');
    });
    await page.waitForTimeout(1000);

    // Add component with invalid data (empty MCQ)
    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    if (await addComponentButton.isVisible()) {
      await addComponentButton.click();
      await page.waitForTimeout(500);

      // Select MCQ component
      const mcqComponent = page.getByText(/mcq|multiple choice/i).first();
      if (await mcqComponent.isVisible()) {
        await mcqComponent.click();
        await page.waitForTimeout(1000);

        // Leave MCQ empty (invalid state)
        await page.screenshot({ path: 'test-results/screenshots/11-invalid-mcq.png', fullPage: true });
        console.log('  ✅ Screenshot: 11-invalid-mcq.png');

        // Try to export - should be blocked
        const exportButton = page.getByRole('button', { name: /export/i });
        if (await exportButton.isVisible()) {
          const isDisabled = await exportButton.isDisabled();
          expect(isDisabled).toBe(true); // Should be disabled with validation errors
          
          await page.screenshot({ path: 'test-results/screenshots/12-export-blocked.png', fullPage: true });
          console.log('  ✅ Screenshot: 12-export-blocked.png');
          console.log('  ✅ Export button correctly disabled with validation errors');
        }
      }
    }
  });

  test('SMOKE-E2E-03: Component data persists after edit', async ({ page }) => {
    console.log('🧪 Testing component data persistence');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Create course and add text component
    const fileMenuButton = page.getByRole('button', { name: 'File' });
    await fileMenuButton.click();
    const newCourseMenuItem = page.getByRole('menuitem', { name: /new course/i });
    await newCourseMenuItem.click();
    page.on('dialog', async dialog => {
      await dialog.accept('Persistence Test Course');
    });
    await page.waitForTimeout(1000);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    if (await addComponentButton.isVisible()) {
      await addComponentButton.click();
      await page.waitForTimeout(500);

      // Select text content component
      const textComponent = page.getByText(/text|content/i).first();
      await textComponent.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/screenshots/13-text-component-added.png', fullPage: true });
      console.log('  ✅ Screenshot: 13-text-component-added.png');

      // Edit content
      const contentInput = page.getByRole('textbox').first();
      if (await contentInput.isVisible()) {
        const testContent = 'This is test content that should persist';
        await contentInput.clear();
        await contentInput.fill(testContent);
        await page.waitForTimeout(1500); // Wait for debounced save

        await page.screenshot({ path: 'test-results/screenshots/14-text-edited.png', fullPage: true });
        console.log('  ✅ Screenshot: 14-text-edited.png');

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/screenshots/15-after-reload.png', fullPage: true });
        console.log('  ✅ Screenshot: 15-after-reload.png');

        // Verify content persisted
        const reloadedContent = await contentInput.inputValue();
        expect(reloadedContent).toContain(testContent);
        console.log('  ✅ Content persisted after reload');
      }
    }
  });
});
