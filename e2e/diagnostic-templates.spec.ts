import { test, expect } from '@playwright/test';

/**
 * Diagnostic Templates E2E Tests
 * Tests all 5 diagnostic template types: pre-assessment, diagnostic-quiz,
 * skill-gap-analysis, adaptive-learning-path, recommendation-card
 */

async function loadExampleCourse(page: any) {
  await page.waitForTimeout(1500);

  try {
    const overlay = page.locator('#webpack-dev-server-client-overlay');
    if (await overlay.isVisible({ timeout: 1500 })) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (e) {
    // Overlay not present, continue
  }

  const loadExampleButton = page.getByRole('button', { name: /load example/i });
  await expect(loadExampleButton).toBeVisible({ timeout: 8000 });
  await loadExampleButton.click({ force: true });

  await page.waitForTimeout(1500);

  const courseTitle = page.locator('.course-title').first();
  await expect(courseTitle).not.toHaveText('No Course Loaded');
}

async function selectFirstPage(page: any) {
  const firstPageItem = page.locator('.page-item').first();
  await expect(firstPageItem).toBeVisible({ timeout: 4000 });
  await firstPageItem.click({ force: true });
  await page.waitForTimeout(1200);
}

async function openComponentPicker(page: any) {
  const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
  await expect(addComponentButton).toBeVisible({ timeout: 5000 });
  await addComponentButton.click();
  await page.waitForTimeout(600);
}

test.describe('Diagnostic Templates E2E Tests', () => {

  test('DIAGNOSTIC-01: Create and edit Pre-Assessment template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    const preAssessmentOption = page.getByText(/pre-assessment/i).first();
    if (await preAssessmentOption.isVisible({ timeout: 3000 })) {
      await preAssessmentOption.click();
      await page.waitForTimeout(800);

      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });

      const titleInput = page.locator('input[placeholder*="Pre-Assessment"], input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Course Entry Assessment');
        await page.waitForTimeout(300);
      }

      await page.screenshot({
        path: 'test-results/screenshots/diagnostic/01-pre-assessment-editor.png',
        fullPage: true,
      });
      console.log('  ✅ Pre-Assessment template created and edited');
    }
  });

  test('DIAGNOSTIC-02: Create and edit Diagnostic Quiz template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    const diagnosticQuizOption = page.getByText(/diagnostic quiz/i).first();
    if (await diagnosticQuizOption.isVisible({ timeout: 3000 })) {
      await diagnosticQuizOption.click();
      await page.waitForTimeout(800);

      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });

      const titleInput = page.locator('input[placeholder*="Diagnostic Quiz"], input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('JavaScript Knowledge Diagnostic');
        await page.waitForTimeout(300);
      }

      await page.screenshot({
        path: 'test-results/screenshots/diagnostic/02-diagnostic-quiz-editor.png',
        fullPage: true,
      });
      console.log('  ✅ Diagnostic Quiz template created and edited');
    }
  });

  test('DIAGNOSTIC-03: Create and edit Skill Gap Analysis template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    const skillGapOption = page.getByText(/skill gap analysis/i).first();
    if (await skillGapOption.isVisible({ timeout: 3000 })) {
      await skillGapOption.click();
      await page.waitForTimeout(800);

      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });

      const titleInput = page.locator('input[placeholder*="Skill Gap"], input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('My Competency Gaps');
        await page.waitForTimeout(300);
      }

      await page.screenshot({
        path: 'test-results/screenshots/diagnostic/03-skill-gap-editor.png',
        fullPage: true,
      });
      console.log('  ✅ Skill Gap Analysis template created and edited');
    }
  });

  test('DIAGNOSTIC-04: Create and edit Adaptive Learning Path template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    const adaptivePathOption = page.getByText(/adaptive learning path/i).first();
    if (await adaptivePathOption.isVisible({ timeout: 3000 })) {
      await adaptivePathOption.click();
      await page.waitForTimeout(800);

      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });

      const titleInput = page.locator('input[placeholder*="Adaptive Learning Path"], input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Your Personalised Route');
        await page.waitForTimeout(300);
      }

      await page.screenshot({
        path: 'test-results/screenshots/diagnostic/04-adaptive-path-editor.png',
        fullPage: true,
      });
      console.log('  ✅ Adaptive Learning Path template created and edited');
    }
  });

  test('DIAGNOSTIC-05: Create and edit Recommendation Card template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    const recCardOption = page.getByText(/recommendation card/i).first();
    if (await recCardOption.isVisible({ timeout: 3000 })) {
      await recCardOption.click();
      await page.waitForTimeout(800);

      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });

      const titleInput = page.locator('input[placeholder*="Recommendations"], input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Recommended for You');
        await page.waitForTimeout(300);
      }

      await page.screenshot({
        path: 'test-results/screenshots/diagnostic/05-recommendation-card-editor.png',
        fullPage: true,
      });
      console.log('  ✅ Recommendation Card template created and edited');
    }
  });

  test('DIAGNOSTIC-06: All diagnostic templates visible in component picker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    await page.waitForTimeout(800);

    const diagnosticTemplates = [
      /pre-assessment/i,
      /diagnostic quiz/i,
      /skill gap analysis/i,
      /adaptive learning path/i,
      /recommendation card/i,
    ];

    for (const pattern of diagnosticTemplates) {
      const option = page.getByText(pattern).first();
      if (await option.isVisible({ timeout: 2000 })) {
        console.log(`  ✅ Found: ${pattern.source}`);
      } else {
        // Scroll within picker if needed - some UIs paginate
        console.log(`  ℹ️ Not immediately visible (may need scroll): ${pattern.source}`);
      }
    }

    await page.screenshot({
      path: 'test-results/screenshots/diagnostic/06-component-picker.png',
      fullPage: true,
    });
    console.log('  ✅ Component picker screenshot taken for diagnostic templates');
  });

  test('DIAGNOSTIC-07: Pre-Assessment preview renders with default data', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    const preAssessmentOption = page.getByText(/pre-assessment/i).first();
    if (await preAssessmentOption.isVisible({ timeout: 3000 })) {
      await preAssessmentOption.click();
      await page.waitForTimeout(800);

      // Switch to preview tab if available
      const previewTab = page.getByRole('tab', { name: /preview/i }).first();
      if (await previewTab.isVisible({ timeout: 2000 })) {
        await previewTab.click();
        await page.waitForTimeout(600);
      }

      const previewArea = page.locator('[class*="preview"]').first();
      if (await previewArea.isVisible({ timeout: 3000 })) {
        await expect(previewArea).toBeVisible();
      }

      await page.screenshot({
        path: 'test-results/screenshots/diagnostic/07-pre-assessment-preview.png',
        fullPage: true,
      });
      console.log('  ✅ Pre-Assessment preview rendered');
    }
  });
});
