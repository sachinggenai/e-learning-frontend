import { test, expect } from '@playwright/test';

async function loadExampleCourse(page: any) {
  await page.waitForTimeout(1500);
  const loadExampleButton = page.getByRole('button', { name: /load example/i });
  await expect(loadExampleButton).toBeVisible({ timeout: 8000 });
  await loadExampleButton.click({ force: true });
  await page.waitForTimeout(1200);
}

async function selectFirstPage(page: any) {
  const firstPageItem = page.locator('.page-item').first();
  await expect(firstPageItem).toBeVisible({ timeout: 4000 });
  await firstPageItem.click({ force: true });
  await page.waitForTimeout(1000);
}

async function openComponentPicker(page: any) {
  const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
  await addComponentButton.click({ force: true });
  await page.waitForTimeout(500);
}

test.describe('Analytics Templates E2E Tests', () => {
  test('ANALYTICS-01 through ANALYTICS-05: create each analytics template', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);

    const templates = [
      /learning progress summary/i,
      /performance dashboard/i,
      /skill mastery report/i,
      /completion certificate/i,
      /manager review page/i,
    ];

    for (const pattern of templates) {
      await openComponentPicker(page);
      const option = page.getByText(pattern).first();
      await expect(option).toBeVisible({ timeout: 4000 });
      await option.click();
      await page.waitForTimeout(700);
      const editor = page.locator('[class*="editor"]').first();
      await expect(editor).toBeVisible({ timeout: 3000 });
    }
  });

  test('ANALYTICS-06: all analytics templates visible in component picker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    await expect(page.getByText(/learning progress summary/i).first()).toBeVisible({ timeout: 4000 });
    await expect(page.getByText(/performance dashboard/i).first()).toBeVisible({ timeout: 4000 });
    await expect(page.getByText(/skill mastery report/i).first()).toBeVisible({ timeout: 4000 });
    await expect(page.getByText(/completion certificate/i).first()).toBeVisible({ timeout: 4000 });
    await expect(page.getByText(/manager review page/i).first()).toBeVisible({ timeout: 4000 });
  });

  test('ANALYTICS-07: learning progress summary renders after add', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openComponentPicker(page);

    await page.getByText(/learning progress summary/i).first().click();
    await page.waitForTimeout(700);

    const componentEditor = page.locator('[class*="editor"]').first();
    await expect(componentEditor).toBeVisible({ timeout: 3000 });
  });
});
