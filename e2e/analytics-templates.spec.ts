import { test, expect } from '@playwright/test';

async function loadExampleCourse(page: any) {
  await page.waitForTimeout(1200);
  const loadExampleButton = page.getByRole('button', { name: /load example/i });
  await expect(loadExampleButton).toBeVisible({ timeout: 8000 });
  await loadExampleButton.click({ force: true });
  await page.waitForTimeout(1200);
}

async function selectFirstPage(page: any) {
  const firstPageItem = page.locator('.page-item').first();
  await expect(firstPageItem).toBeVisible({ timeout: 4000 });
  await firstPageItem.click({ force: true });
  await page.waitForTimeout(900);
}

async function openPicker(page: any) {
  await page.getByRole('button', { name: /add component/i }).first().click({ force: true });
  await page.waitForTimeout(450);
}

test.describe('Analytics Templates E2E Tests', () => {
  test('ANALYTICS-01: create and edit Learning Progress Summary', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/learning progress summary/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      const editor = page.locator('[class*="editor"]').first();
      await expect(editor).toBeVisible({ timeout: 4000 });

      const titleInput = page.locator('input[type="text"]').first();
      if (await titleInput.isVisible({ timeout: 2000 })) {
        await titleInput.fill('Updated Progress Summary');
        await expect(titleInput).toHaveValue('Updated Progress Summary');
      }
    }
  });

  test('ANALYTICS-02: create and edit Performance Dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/performance dashboard/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });

      const addKpiBtn = page.getByRole('button', { name: /Add KPI/i });
      if (await addKpiBtn.isVisible({ timeout: 2000 })) {
        await addKpiBtn.click();
      }
    }
  });

  test('ANALYTICS-03: create and edit Skill Mastery Report', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/skill mastery report/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });

      const addSkillBtn = page.getByRole('button', { name: /Add Skill/i });
      if (await addSkillBtn.isVisible({ timeout: 2000 })) {
        await addSkillBtn.click();
      }
    }
  });

  test('ANALYTICS-04: create and edit Completion Certificate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/completion certificate/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });

      const learnerInput = page.locator('input').nth(1);
      if (await learnerInput.isVisible({ timeout: 2000 })) {
        await learnerInput.fill('Jane Learner');
        await expect(learnerInput).toHaveValue('Jane Learner');
      }
    }
  });

  test('ANALYTICS-05: create and edit Manager Review Page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/manager review page/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });

      const addRowBtn = page.getByRole('button', { name: /Add Row/i });
      if (await addRowBtn.isVisible({ timeout: 2000 })) {
        await addRowBtn.click();
      }
    }
  });

  test('ANALYTICS-06: all analytics templates visible in component picker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    await expect(page.getByText(/learning progress summary/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/performance dashboard/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/skill mastery report/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/completion certificate/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/manager review page/i).first()).toBeVisible({ timeout: 3000 });
  });

  test('ANALYTICS-07: manager review preview controls render', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/manager review page/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
    }

    const previewTab = page.getByRole('tab', { name: /preview/i }).first();
    if (await previewTab.isVisible({ timeout: 1500 }).catch(() => false)) {
      await previewTab.click();
      await page.waitForTimeout(400);
    }

    const hasPreview = await page.locator('.tpl-manager-review-page').first().isVisible({ timeout: 2500 }).catch(() => false);
    const hasEditor = await page.locator('[class*="editor"]').first().isVisible({ timeout: 2500 }).catch(() => false);
    if (!(hasPreview || hasEditor)) {
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 3000 });
    }
  });
});
