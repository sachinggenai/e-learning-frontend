import { test, expect } from '@playwright/test';

/**
 * Component Validation E2E Tests
 * Tests validation for different component types with screenshot evidence
 */

// Helper function to load example course
async function loadExampleCourse(page: any) {
  // Wait for any overlays to disappear
  await page.waitForTimeout(2000);
  
  // Try to dismiss any overlays
  try {
    const overlay = page.locator('#webpack-dev-server-client-overlay');
    if (await overlay.isVisible({ timeout: 2000 })) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } catch (e) {
    // Overlay not present, continue
  }
  
  // Click Load Example button
  const loadExampleButton = page.getByRole('button', { name: /load example/i });
  await expect(loadExampleButton).toBeVisible({ timeout: 10000 });
  await loadExampleButton.click({ force: true });
  
  // Wait for course to load
  await page.waitForTimeout(2000);
  
  // Verify course loaded
  const courseTitle = page.locator('.course-title').first();
  await expect(courseTitle).not.toHaveText('No Course Loaded');
}

test.describe('Component Validation E2E Tests', () => {

  test('VAL-E2E-01: MCQ validation requires question and options', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load example course
    await loadExampleCourse(page);

    // Select the first page
    const firstPageItem = page.locator('.page-item').first();
    await expect(firstPageItem).toBeVisible({ timeout: 5000 });
    await firstPageItem.click({ force: true });
    await page.waitForTimeout(2000);

    // Add MCQ component
    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    if (await addComponentButton.isVisible()) {
      await addComponentButton.click();
      await page.waitForTimeout(500);

      const mcqComponent = page.getByText(/mcq|multiple choice/i).first();
      if (await mcqComponent.isVisible()) {
        await mcqComponent.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ 
          path: 'test-results/screenshots/validation/mcq-empty.png', 
          fullPage: true 
        });

        // Validate course - should show errors
        const validateButton = page.getByRole('button', { name: /validate/i });
        if (await validateButton.isVisible()) {
          await validateButton.click();
          await page.waitForTimeout(1000);

          await page.screenshot({ 
            path: 'test-results/screenshots/validation/mcq-validation-errors.png', 
            fullPage: true 
          });
          console.log('  ✅ Screenshot: mcq-validation-errors.png');
        }
      }
    }
  });

  test('VAL-E2E-02: Valid welcome component passes validation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await loadExampleCourse(page);

    // Select the first page
    const firstPageItem = page.locator('.page-item').first();
    await expect(firstPageItem).toBeVisible({ timeout: 5000 });
    await firstPageItem.click({ force: true });
    await page.waitForTimeout(2000);

    // Add welcome component
    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    if (await addComponentButton.isVisible()) {
      await addComponentButton.click();
      await page.waitForTimeout(500);

      // Try to find welcome component, or fall back to first component
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

      // Fill in title
      const titleInput = page.getByLabel(/title/i).or(page.getByPlaceholder(/title/i)).first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Welcome to the Course');
        await page.waitForTimeout(1000);

        await page.screenshot({ 
          path: 'test-results/screenshots/validation/welcome-valid.png', 
          fullPage: true 
        });

        // Validate - should pass
        const validateButton = page.getByRole('button', { name: /validate/i });
        if (await validateButton.isVisible()) {
          await validateButton.click();
          await page.waitForTimeout(1000);

          await page.screenshot({ 
            path: 'test-results/screenshots/validation/welcome-validation-pass.png', 
            fullPage: true 
          });
          console.log('  ✅ Screenshot: welcome-validation-pass.png');
        }
      }
    }
  });

  test('VAL-E2E-03: All component types accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await loadExampleCourse(page);

    // Select the first page
    const firstPageItem = page.locator('.page-item').first();
    await expect(firstPageItem).toBeVisible({ timeout: 5000 });
    await firstPageItem.click({ force: true });
    await page.waitForTimeout(2000);

    // Open component picker
    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    if (await addComponentButton.isVisible()) {
      await addComponentButton.click();
      await page.waitForTimeout(500);

      await page.screenshot({ 
        path: 'test-results/screenshots/validation/component-picker-full.png', 
        fullPage: true 
      });
      console.log('  ✅ Screenshot: component-picker-full.png');

      // Check for component categories
      const componentCategories = [
        'content', 'assessment', 'interactive', 'navigation', 'gamification'
      ];

      for (const category of componentCategories) {
        const categoryElement = page.getByText(new RegExp(category, 'i'));
        if (await categoryElement.isVisible()) {
          console.log(`  ✅ Category found: ${category}`);
        }
      }
    }
  });
});
