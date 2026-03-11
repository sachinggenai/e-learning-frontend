import { expect, Page, test } from '@playwright/test';

async function dismissWebpackOverlay(page: Page) {
  const overlay = page.locator('#webpack-dev-server-client-overlay');
  if (await overlay.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.waitForTimeout(500);
  }
}

async function loadExampleCourse(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await dismissWebpackOverlay(page);

  const loadExampleButton = page.getByRole('button', { name: /load example/i });
  await expect(loadExampleButton).toBeVisible({ timeout: 15000 });
  await loadExampleButton.click({ force: true });
  await page.waitForTimeout(1500);

  const firstPageItem = page.locator('.page-item').first();
  await expect(firstPageItem).toBeVisible({ timeout: 10000 });
  await firstPageItem.click({ force: true });
  await page.waitForTimeout(1000);
}

async function openComponentPicker(page: Page) {
  const addComponentButton = page.getByRole('button', { name: /add component/i }).first();
  await expect(addComponentButton).toBeVisible({ timeout: 10000 });
  await addComponentButton.click();

  const picker = page.getByRole('dialog', { name: /add component/i });
  await expect(picker).toBeVisible();
  return picker;
}

async function expectComponentVisibleInPicker(page: Page, displayName: string) {
  const picker = await openComponentPicker(page);
  const searchInput = picker.getByRole('textbox', { name: /search components/i });
  await searchInput.fill(displayName);

  const card = picker.getByRole('listitem', { name: new RegExp(`Add ${displayName}`, 'i') }).first();
  await expect(card).toBeVisible({ timeout: 10000 });
  await expect(picker.getByText(displayName, { exact: true })).toBeVisible();
}

test.describe('Practice templates', () => {
  test('Guided Practice appears in the component picker', async ({ page }) => {
    await loadExampleCourse(page);
    await expectComponentVisibleInPicker(page, 'Guided Practice');
  });

  test('Try-It Simulation appears in the component picker', async ({ page }) => {
    await loadExampleCourse(page);
    await expectComponentVisibleInPicker(page, 'Try-It Simulation');
  });

  test('Software Simulation appears in the component picker', async ({ page }) => {
    await loadExampleCourse(page);
    await expectComponentVisibleInPicker(page, 'Software Simulation');
  });

  test('Sandbox Practice appears in the component picker', async ({ page }) => {
    await loadExampleCourse(page);
    await expectComponentVisibleInPicker(page, 'Sandbox Practice');
  });

  test('Error Identification appears in the component picker', async ({ page }) => {
    await loadExampleCourse(page);
    await expectComponentVisibleInPicker(page, 'Error Identification');
  });
});
