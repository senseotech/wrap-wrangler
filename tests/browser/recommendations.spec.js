import { expect, test } from '@playwright/test';
import { expectClipboardText } from './clipboard.js';

for (const { unit, alternateUnit, alternateSide, alternateDiagonal } of [
  { unit: 'in', alternateUnit: 'cm', alternateSide: 32.6, alternateDiagonal: 46.1 },
  { unit: 'cm', alternateUnit: 'in', alternateSide: 5.1, alternateDiagonal: 7.2 },
]) {
  test(`shows the same ${unit} recommendation on screen, on the clipboard, and in print`, async ({ page, browserName }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Begin' }).click();
    if (unit === 'cm') {
      await page.getByRole('button', { name: 'in', exact: true }).click();
      await page.getByRole('button', { name: /Centimeters/ }).click();
    }

    await page.getByRole('textbox', { name: 'width' }).fill('10');
    await page.getByRole('textbox', { name: 'depth' }).fill('10');
    await page.getByRole('textbox', { name: 'height' }).fill('2');
    await page.getByRole('button', { name: 'Toggle Expert Mode' }).click();

    const result = page.getByText('Required Square Side', { exact: true }).locator('../..');
    const row = (card, label) => card.getByText(label, { exact: true }).locator('..');
    await expect(row(result, 'Required Square Side')).toHaveText(`Required Square Side12.9${unit}`);
    await expect(row(result, 'Paper Diagonal')).toHaveText(`Paper Diagonal18.2${unit}`);

    const fieldRecord = page.getByText('Field Record', { exact: true }).locator('..');
    await expect(row(fieldRecord, 'Square Side')).toHaveText(`Square Side12.9${unit}`);
    await expect(row(fieldRecord, 'Paper Diagonal')).toHaveText(`Paper Diagonal18.2${unit}`);

    await expect(page.getByText('Derivation · raw values')).toBeVisible();
    await expect(page.getByText(`≈ 12.8284 ${unit}`)).toBeVisible();
    await expect(page.getByText(`≈ 18.1421 ${unit}`)).toBeVisible();
    const alternate = page.getByText(`Cutting recommendation · ${alternateUnit}`, { exact: true }).locator('..');
    await expect(row(alternate, 'Required Side')).toHaveText(`Required Side${alternateSide} ${alternateUnit}`);
    await expect(row(alternate, 'Paper Diagonal')).toHaveText(`Paper Diagonal${alternateDiagonal} ${alternateUnit}`);

    await page.getByRole('button', { name: 'Copy results' }).click();
    await expect(page.getByText('Copied to clipboard', { exact: true })).toBeVisible();
    await expectClipboardText(page, browserName, `Required Square Side: 12.9 ${unit}\nPaper Diagonal: 18.2 ${unit}`);

    // Keep the popup available for inspection without opening the OS print dialog.
    await page.evaluate(() => {
      const open = window.open.bind(window);
      window.open = (...args) => {
        const popup = open(...args);
        popup.print = () => { popup.document.documentElement.dataset.printRequested = 'true'; };
        return popup;
      };
    });
    const [printPreview] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'Print', exact: true }).click(),
    ]);
    await expect(printPreview).toHaveTitle('Field Record · Wrap Wrangler');
    await expect(printPreview.locator('.value')).toHaveText(['12.9', '18.2']);
    await expect(printPreview.locator('.unit')).toHaveText([unit, unit]);
    await expect(printPreview.locator('html')).toHaveAttribute('data-print-requested', 'true');
  });
}
