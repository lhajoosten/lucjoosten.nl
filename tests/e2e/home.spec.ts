import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage is responsive and accessible in light and dark themes', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'I build softwarethat holds up.',
  );
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((node) => node.target) })),
    ).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`home-${theme}.png`), fullPage: true });
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  if (testInfo.project.name === 'desktop') {
    for (const width of [320, 768, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('navigation supports keyboard use and mobile dismissal', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  if (testInfo.project.name === 'mobile') {
    const menu = page.getByRole('button', { name: /^(Open|Close) menu$/ });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(
      page
        .getByRole('navigation', { name: 'Mobile navigation' })
        .getByRole('link', { name: 'Projects' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Contact' })
      .click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Contact' })
      .click();
  }
  await expect(page).toHaveURL(/#contact$/);
});

test('project dialog traps and restores focus and respects repository visibility', async ({
  page,
}) => {
  await page.goto('/');
  const project = page.getByRole('button', { name: 'Read about Release Log' });
  await project.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const close = page.getByRole('button', { name: 'Close project details' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'Read the project README' })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(project).toBeFocused();
  await page.getByRole('button', { name: 'Read about ReviewBot' }).click();
  await expect(dialog.getByText('Private · source unavailable')).toBeVisible();
  await expect(dialog.getByRole('link')).toHaveCount(1);
  await expect(dialog.getByRole('link', { name: 'Read the case study' })).toBeVisible();
  await close.click();
  await expect(dialog).not.toBeVisible();
});

test('system theme works without a saved preference and reduced motion disables transitions', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(
    await page
      .locator('.btn')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
});

test('Upkeep overview distinguishes current discovery from planned integration', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.getByRole('button', { name: 'Read about Upkeep' });
  await card.click();
  const dialog = page.getByRole('dialog', { name: 'Upkeep' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText(/current release provides local, read-only Python dependency discovery/),
  ).toBeVisible();
  await expect(dialog.getByText(/Azure DevOps integration is planned/)).toBeVisible();
  await expect(dialog.getByText('Private · source unavailable')).toBeVisible();
  await expect(dialog.getByRole('link')).toHaveCount(1);
  await expect(dialog.getByRole('link', { name: 'Read the case study' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toBeFocused();
});

test('prerendered content is available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build software');
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  await context.close();
});

test('unknown URL renders a useful not-found page', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('This path ends here');
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build software');
});
