import { expect, test } from '@playwright/test';

const completeAllDimensions = 'All three dimensions need a value greater than zero to calculate.';
const invalidDecimal = 'Enter a number with one decimal dot or comma.';

for (const unit of ['in', 'cm']) {
  test(`validates ${unit === 'in' ? 'inch' : 'centimeter'} dimensions before exposing a result`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Begin' }).click();
    if (unit === 'cm') {
      await page.getByRole('button', { name: 'in', exact: true }).click();
      await page.getByRole('button', { name: /Centimeters/ }).click();
    }

    const width = page.getByRole('textbox', { name: 'width' });
    const depth = page.getByRole('textbox', { name: 'depth' });
    const height = page.getByRole('textbox', { name: 'height' });
    const result = page.getByText('Required Square Side', { exact: true }).locator('..');
    const copy = page.getByRole('button', { name: 'Copy results' });
    const print = page.getByRole('button', { name: 'Print', exact: true });

    await width.fill('10');
    await depth.fill('10');
    await height.fill('2');
    await expect(result).toHaveText(new RegExp(`[0-9]${unit}$`));

    await width.fill('1.5');
    const decimalResult = await result.textContent();
    await width.fill('1,5');
    await expect(width).toHaveValue('1,5');
    await expect(result).toHaveText(decimalResult);
    await width.fill('15');
    await expect(result).not.toHaveText(decimalResult);

    for (const draft of ['', '.', '1.', '1,']) {
      await width.fill(draft);
      await expect(width).toHaveValue(draft);
      await expect(width).not.toHaveAttribute('aria-invalid', 'true');
      await expect(width).toHaveAccessibleDescription(completeAllDimensions);
      await expect(copy).toHaveCount(0);
      await expect(print).toHaveCount(0);
    }

    for (const [pasted, visible] of [['1.2.3', '1.2.3'], ['5 cm', '5 cm'], ['5\n6', '5 6']]) {
      await width.fill('');
      await page.evaluate(text => navigator.clipboard.writeText(text), pasted);
      await width.press('ControlOrMeta+V');
      await expect(width).toHaveValue(visible);
      await expect(width).toHaveAttribute('aria-invalid', 'true');
      await expect(width).toHaveAccessibleDescription(invalidDecimal);
      await expect(copy).toHaveCount(0);
      await expect(print).toHaveCount(0);
    }

    await width.fill('9'.repeat(309));
    await expect(width).toHaveAccessibleDescription('This measurement is too large.');
    await width.fill('10');
    await height.fill('9'.repeat(308));
    for (const input of [width, depth, height]) {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAccessibleDescription('These measurements are too large to calculate together.');
    }
    await expect(copy).toHaveCount(0);
    await expect(print).toHaveCount(0);

    await height.fill('2');
    await expect(copy).toBeVisible();
    await expect(print).toBeVisible();
  });
}
