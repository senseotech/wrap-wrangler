import { expect } from '@playwright/test';

export async function expectClipboardText(page, browserName, text) {
  if (browserName === 'chromium') {
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(text);
    return;
  }

  // WebKit can paste using the keyboard even when clipboard.readText() is denied.
  await page.evaluate(() => {
    const target = document.createElement('textarea');
    target.setAttribute('aria-label', 'Clipboard test target');
    document.body.append(target);
  });
  const target = page.getByRole('textbox', { name: 'Clipboard test target' });
  await target.press('ControlOrMeta+V');
  await expect(target).toHaveValue(text);
  await target.evaluate(element => element.remove());
}
