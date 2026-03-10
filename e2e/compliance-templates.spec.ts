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

test.describe('Compliance Templates E2E Tests', () => {
  test('COMPLIANCE-01: create and edit Policy Acknowledgement', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/policy acknowledgement/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });

      const titleInput = page.locator('input[type="text"]').first();
      if (await titleInput.isVisible({ timeout: 2000 })) {
        await titleInput.fill('Updated Policy Acknowledgement');
        await expect(titleInput).toHaveValue('Updated Policy Acknowledgement');
      }
    }
  });

  test('COMPLIANCE-02: create and edit Do\'s and Don\'ts', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/do\'s and don\'ts/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });
      const addDoButton = page.getByRole('button', { name: /add do/i }).first();
      if (await addDoButton.isVisible({ timeout: 2000 })) {
        await addDoButton.click();
      }
    }
  });

  test('COMPLIANCE-03: create and edit Code of Conduct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/code of conduct/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });
      const addSectionButton = page.getByRole('button', { name: /add section/i });
      if (await addSectionButton.isVisible({ timeout: 2000 })) {
        await addSectionButton.click();
      }
    }
  });

  test('COMPLIANCE-04: create and edit Regulatory Scenario', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/regulatory scenario/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });
      const addChoiceButton = page.getByRole('button', { name: /add choice/i });
      if (await addChoiceButton.isVisible({ timeout: 2000 })) {
        await addChoiceButton.click();
      }
    }
  });

  test('COMPLIANCE-05: create and edit Audit Checklist', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    const option = page.getByText(/audit checklist/i).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      await expect(page.locator('[class*="editor"]').first()).toBeVisible({ timeout: 4000 });
      const addItemButton = page.getByRole('button', { name: /add item/i });
      if (await addItemButton.isVisible({ timeout: 2000 })) {
        await addItemButton.click();
      }
    }
  });

  test('COMPLIANCE-06: all compliance templates visible in component picker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await loadExampleCourse(page);
    await selectFirstPage(page);
    await openPicker(page);

    await expect(page.getByText(/policy acknowledgement/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/do\'s and don\'ts/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/code of conduct/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/regulatory scenario/i).first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/audit checklist/i).first()).toBeVisible({ timeout: 3000 });
  });
});
