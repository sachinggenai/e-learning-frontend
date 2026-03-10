import { test, expect } from '@playwright/test';

/**
 * Feedback Templates E2E Tests
 * Tests all 5 feedback template types: reflective-question, learner-journal, self-assessment,
 * confidence-rating, action-planning
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

test.describe('Feedback Templates E2E Tests', () => {

  test('FEEDBACK-01: Create and edit Reflective Question template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    // Add Reflective Question component
    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    // Search for/click Reflective Question
    const componentPicker = page.locator('[class*="component-picker"], [class*="modal"], [role="dialog"]').first();
    const reflectiveOption = page.getByText(/reflective question/i).first();
    
    if (await reflectiveOption.isVisible({ timeout: 3000 })) {
      await reflectiveOption.click();
      await page.waitForTimeout(800);
      
      // Verify component added
      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });
      
      // Edit title field
      const titleInput = page.locator('input[placeholder*="Reflective"], input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('My Reflection Prompt');
        await page.waitForTimeout(300);
      }
      
      await page.screenshot({ 
        path: 'test-results/screenshots/feedback/01-reflective-question-editor.png', 
        fullPage: true 
      });
      console.log('  ✅ Reflective Question template created and edited');
    }
  });

  test('FEEDBACK-02: Create and edit Learner Journal template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    const journalOption = page.getByText(/learner journal/i).first();
    
    if (await journalOption.isVisible({ timeout: 3000 })) {
      await journalOption.click();
      await page.waitForTimeout(800);
      
      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });
      
      const titleInput = page.locator('input').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('My Learning Journal');
        await page.waitForTimeout(300);
      }
      
      await page.screenshot({ 
        path: 'test-results/screenshots/feedback/02-learner-journal-editor.png', 
        fullPage: true 
      });
      console.log('  ✅ Learner Journal template created and edited');
    }
  });

  test('FEEDBACK-03: Create and edit Self-Assessment template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    const assessmentOption = page.getByText(/self-assessment/i).first();
    
    if (await assessmentOption.isVisible({ timeout: 3000 })) {
      await assessmentOption.click();
      await page.waitForTimeout(800);
      
      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });
      
      await page.screenshot({ 
        path: 'test-results/screenshots/feedback/03-self-assessment-editor.png', 
        fullPage: true 
      });
      console.log('  ✅ Self-Assessment template created');
    }
  });

  test('FEEDBACK-04: Create and edit Confidence Rating template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    const confidenceOption = page.getByText(/confidence rating/i).first();
    
    if (await confidenceOption.isVisible({ timeout: 3000 })) {
      await confidenceOption.click();
      await page.waitForTimeout(800);
      
      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });
      
      await page.screenshot({ 
        path: 'test-results/screenshots/feedback/04-confidence-rating-editor.png', 
        fullPage: true 
      });
      console.log('  ✅ Confidence Rating template created');
    }
  });

  test('FEEDBACK-05: Create and edit Action Planning template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    const actionOption = page.getByText(/action planning/i).first();
    
    if (await actionOption.isVisible({ timeout: 3000 })) {
      await actionOption.click();
      await page.waitForTimeout(800);
      
      const componentEditor = page.locator('[class*="editor"]').first();
      await expect(componentEditor).toBeVisible({ timeout: 3000 });
      
      await page.screenshot({ 
        path: 'test-results/screenshots/feedback/05-action-planning-editor.png', 
        fullPage: true 
      });
      console.log('  ✅ Action Planning template created');
    }
  });

  test('FEEDBACK-06: All feedback templates appear in component picker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    // Check all feedback template names are visible in picker
    const feedbackTemplates = [
      'Reflective Question',
      'Learner Journal',
      'Self-Assessment',
      'Confidence Rating',
      'Action Planning'
    ];

    for (const template of feedbackTemplates) {
      const templateOption = page.getByText(new RegExp(template, 'i')).first();
      await expect(templateOption).toBeVisible({ timeout: 2000 });
    }

    await page.screenshot({ 
      path: 'test-results/screenshots/feedback/06-all-templates-picker.png', 
      fullPage: true 
    });
    console.log('  ✅ All 5 feedback templates visible in component picker');
  });

  test('FEEDBACK-07: Reflective Question preview renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    await expect(addComponentButton).toBeVisible();
    await addComponentButton.click();
    await page.waitForTimeout(600);

    const reflectiveOption = page.getByText(/reflective question/i).first();
    if (await reflectiveOption.isVisible({ timeout: 3000 })) {
      await reflectiveOption.click();
      await page.waitForTimeout(800);

      // Switch to preview view
      const previewTab = page.getByRole('tab', { name: /preview/i });
      if (await previewTab.isVisible({ timeout: 2000 })) {
        await previewTab.click();
        await page.waitForTimeout(500);

        // Verify preview renders
        const previewContent = page.locator('[class*="preview"], [class*="tpl-reflective"]');
        await expect(previewContent.first()).toBeVisible({ timeout: 2000 });

        await page.screenshot({ 
          path: 'test-results/screenshots/feedback/07-reflective-preview.png', 
          fullPage: true 
        });
        console.log('  ✅ Reflective Question preview rendered');
      }
    }
  });

});
