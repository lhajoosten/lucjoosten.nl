import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('about is readable and accessible in both themes at desktop and mobile widths', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Full-stack foundation.AI-focused practice.',
  );
  await expect(page.getByText('Crowe Netherlands', { exact: true })).toBeVisible();
  await expect(page.getByText('CynthAI', { exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`about-${theme}.png`), fullPage: true });
  }
  expect(
    await page
      .locator('.btn')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe('0s');
  if (testInfo.project.name === 'desktop') {
    for (const width of [320, 390, 650, 700, 768, 850, 851, 950, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.getByRole('link', { name: 'Luc Joosten homepage' })).toBeInViewport();
      if (width <= 850) await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
      else await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    }
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('about has initial content, metadata and ordinary links without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/about');
  await expect(page).toHaveTitle('About — Luc Joosten');
  await expect(page.getByRole('heading', { name: 'Software Engineer' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Meet Luc Joosten/,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'About — Luc Joosten',
  );
  for (const selector of ['link[rel="canonical"]', 'meta[property="og:url"]']) {
    await expect(page.locator(selector)).toHaveAttribute(
      selector.startsWith('link') ? 'href' : 'content',
      'https://lucjoosten.nl/about',
    );
  }
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/lhajoosten/',
  );
  await page.getByRole('link', { name: 'Explore my projects' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Engineering in practice.');
  await context.close();
});

test('about navigation supports keyboard focus, history and homepage anchors', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'More about my work' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page).toHaveTitle('About — Luc Joosten');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://lucjoosten.nl/about',
  );
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', {
    name: testInfo.project.name === 'mobile' ? 'Mobile navigation' : 'Main navigation',
  });
  await nav.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveTitle('Projects — Luc Joosten');
  await page.goBack();
  await expect(page).toHaveTitle('About — Luc Joosten');
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  await nav.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(page).toHaveURL(/\/#experience$/);
  await expect(page.getByRole('heading', { name: 'From idea to production.' })).toBeInViewport();
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  await nav.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  if (testInfo.project.name === 'mobile')
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
});
