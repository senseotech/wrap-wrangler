import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin' }).click();
});

test('opens from the keyboard, keeps focus inside, and restores it on close', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'About This Protocol' });
  const dialog = page.getByRole('dialog', { name: 'About This Protocol' });
  const close = dialog.getByRole('button', { name: 'Close' });

  await expect(dialog).toHaveCount(0);
  await page.getByRole('textbox', { name: 'height' }).focus();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'About This Protocol' })).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription(/single square sheet of paper, oriented at 45°/);
  await expect(close).toBeFocused();
  await close.click({ trial: true });

  for (const key of ['Tab', 'Shift+Tab']) {
    await page.keyboard.press(key);
    await expect(close).toBeFocused();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.keyboard.press('Space');
  await expect(close).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('supports click and tap dismissal and leaves the unit drawer usable', async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 320, height: 400 });

  const activate = element => isMobile ? element.tap() : element.click();
  const trigger = page.getByRole('button', { name: 'About This Protocol' });
  const dialog = page.getByRole('dialog', { name: 'About This Protocol' });
  const close = dialog.getByRole('button', { name: 'Close' });
  const width = page.getByRole('textbox', { name: 'width' });
  await width.fill('10');

  await activate(trigger);
  await expect(dialog).toBeVisible();
  await expect(close).toBeInViewport();
  const panel = await dialog.boundingBox();
  const viewport = page.viewportSize();
  expect(panel.x).toBeGreaterThan(0);
  expect(panel.y).toBeGreaterThan(0);
  expect(panel.x + panel.width).toBeLessThan(viewport.width);
  expect(panel.y + panel.height).toBeLessThan(viewport.height);

  // Interaction inside the panel should leave it open.
  await activate(dialog.getByRole('heading', { name: 'About This Protocol' }));
  await expect(dialog).toBeVisible();
  await activate(close);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await activate(trigger);
  await close.click({ trial: true });
  if (isMobile) await page.touchscreen.tap(4, 4);
  else await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await activate(page.getByRole('button', { name: 'in', exact: true }));
  const drawer = page.getByRole('dialog', { name: 'Select Unit' });
  await expect(drawer).toBeVisible();
  await activate(drawer.getByRole('button', { name: /Centimeters/ }));
  await expect(drawer).toBeHidden();
  await expect(page.getByRole('button', { name: 'cm', exact: true })).toBeVisible();
  await expect(width).toHaveValue('10');
});
