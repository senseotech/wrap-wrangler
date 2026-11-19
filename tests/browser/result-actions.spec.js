import { expect, test } from '@playwright/test';

const expectedText = 'Required Square Side: 12.9 cm\nPaper Diagonal: 18.2 cm';
const measurements = { width: '10', depth: '10', height: '2' };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preferredUnit', 'cm'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Begin' }).click();
  for (const [name, value] of Object.entries(measurements)) {
    await page.getByRole('textbox', { name }).fill(value);
  }
});

async function expectMeasurementsPreserved(page) {
  for (const [name, value] of Object.entries(measurements)) {
    await expect(page.getByRole('textbox', { name })).toHaveValue(value);
  }
  await expect(page.getByRole('button', { name: 'cm', exact: true })).toBeVisible();
  const result = page.getByText('Required Square Side', { exact: true }).locator('../..');
  await expect(result.getByText('Required Square Side', { exact: true }).locator('..'))
    .toHaveText('Required Square Side12.9cm');
  await expect(result.getByText('Paper Diagonal', { exact: true }).locator('..'))
    .toHaveText('Paper Diagonal18.2cm');
}

test('shows copy success only after the clipboard write completes', async ({ page, isMobile }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: text => new Promise(resolve => {
          window.finishCopy = () => { resolve(); return text; };
        }),
      },
    });
  });

  const copy = page.getByRole('button', { name: 'Copy results' });
  if (isMobile) await copy.tap();
  else await copy.click();
  await expect(copy).toBeDisabled();
  await expect(copy.locator('.lucide-check')).toHaveCount(0);
  await expect(page.getByText('Copied to clipboard', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.finishCopy())).toBe(expectedText);
  await expect(copy).toBeEnabled();
  await expect(copy.locator('.lucide-check')).toBeVisible();
  await expect(page.getByText('Copied to clipboard', { exact: true })).toBeVisible();
  await expectMeasurementsPreserved(page);
});

for (const failure of ['denied', 'unavailable']) {
  test(`keeps the result manually copyable when clipboard access is ${failure}`, async ({ page, isMobile }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.evaluate(async failure => {
      await navigator.clipboard.writeText('Clipboard before manual copy');
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: failure === 'unavailable' ? undefined : {
          writeText: () => Promise.reject(new DOMException('Clipboard access denied', 'NotAllowedError')),
        },
      });
    }, failure);

    const copy = page.getByRole('button', { name: 'Copy results' });
    if (isMobile) await copy.tap();
    else await copy.click();
    const fallback = page.getByRole('textbox', { name: 'Result text' });
    await expect(fallback).toHaveAccessibleDescription(/Select the result text and copy it manually/);
    await expect(fallback).toHaveValue(expectedText);
    await expect(fallback).not.toBeEditable();
    await expect(copy.locator('.lucide-check')).toHaveCount(0);
    await expect(page.getByText('Copied to clipboard', { exact: true })).toHaveCount(0);

    await fallback.focus();
    await expect.poll(() => fallback.evaluate(node => [node.selectionStart, node.selectionEnd]))
      .toEqual([0, expectedText.length]);
    await fallback.press('ControlOrMeta+C');
    await page.evaluate(() => delete navigator.clipboard);
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expectedText);
    await expectMeasurementsPreserved(page);
    expect(errors).toEqual([]);
  });
}

test('explains how to retry a blocked print without losing the result', async ({ page, isMobile }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.evaluate(() => { window.open = () => null; });

  const print = page.getByRole('button', { name: 'Print', exact: true });
  if (isMobile) await print.tap();
  else await print.click();
  await expect(page.getByText('Print window could not open', { exact: true })).toBeVisible();
  await expect(page.getByText('Allow pop-ups for this site, then try Print again.', { exact: true })).toBeVisible();
  await expect(print).toBeEnabled();
  await expectMeasurementsPreserved(page);
  expect(errors).toEqual([]);
});
