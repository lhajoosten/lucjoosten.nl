import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { releaseLog } from '../../src/content/release-log';
import { releaseLogRefsUrl } from '../../src/content/release-log-version';

test.beforeEach(async ({ page }) => {
  await page.route(releaseLogRefsUrl, (route) =>
    route.fulfill({
      json: [
        { ref: 'refs/tags/v0.2.1' },
        { ref: 'refs/tags/v0.3.0' },
        { ref: 'refs/tags/v0.4.0-rc.1' },
      ],
    }),
  );
});

const caseStudies = [
  {
    path: '/projects/lint-action',
    title: 'Lint Action — Luc Joosten',
    heading: 'Lint Action',
    section: 'Adopt the gate in stages',
  },
  {
    path: '/projects/azure-ai-workbench',
    title: 'Azure AI Workbench — Luc Joosten',
    heading: 'Azure AI Workbench',
    section: 'From exercises to a backend',
  },
  {
    path: '/projects/reviewbot',
    title: 'ReviewBot — Luc Joosten',
    heading: 'ReviewBot',
    section: 'The terminal and the dashboard',
  },
  {
    path: '/projects/kube-lab',
    title: 'kube-lab — Luc Joosten',
    heading: 'kube-lab',
    section: 'A dashboard and a bot in the same exercise',
  },
  {
    path: '/projects/upkeep',
    title: 'Upkeep — Luc Joosten',
    heading: 'Upkeep',
    section: 'Local dependency discovery',
  },
  {
    path: '/projects/lucjoosten-nl',
    title: 'lucjoosten.nl — Luc Joosten',
    heading: 'lucjoosten.nl',
    section: 'Rendering the portfolio at build time',
  },
];

const routes = [
  ...caseStudies,
  { path: '/projects', title: 'Projects — Luc Joosten', heading: 'Engineering in practice.' },
  { path: '/projects/release-log', title: 'Release Log — Luc Joosten', heading: 'Release Log.' },
];

for (const route of routes) {
  test(`${route.path} supports direct loads, both themes and responsive reading`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    await expect(page).toHaveTitle(route.title);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ['light', 'dark']) {
      if (theme === 'dark')
        await page.getByRole('button', { name: 'Switch to dark theme' }).click();
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({ path: testInfo.outputPath(`projects-${theme}.png`), fullPage: true });
    }
    if (testInfo.project.name === 'desktop') {
      for (const width of [320, 390, 768, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
    expect(
      await page
        .locator('.project, .btn, .small-link')
        .first()
        .evaluate((element) => getComputedStyle(element).transitionDuration),
    ).toBe('0s');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });

  test(`${route.path} has content and metadata without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://lucjoosten.nl${route.path}`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://lucjoosten.nl${route.path}`,
    );
    if (route.path === '/projects') {
      await expect(page.getByRole('article')).toHaveCount(7);
      for (const [name, url] of [
        ['Lint Action', 'https://github.com/lhajoosten/lint-action'],
        ['Release Log', 'https://github.com/lhajoosten/release-log'],
        ['Azure AI Workbench', 'https://github.com/lhajoosten/azure-ai-workbench'],
        ['lucjoosten.nl', 'https://github.com/lhajoosten/lucjoosten.nl'],
      ] as const) {
        const project = page.getByRole('article', { name, exact: true });
        await expect(
          project.getByRole('link', { name: `View the ${name} repository` }),
        ).toHaveAttribute('href', url);
      }
      await expect(
        page
          .getByRole('article', { name: 'ReviewBot' })
          .getByText(/terminal interface and dashboard/)
          .first(),
      ).toBeVisible();
      await expect(
        page.getByRole('article', { name: 'Azure AI Workbench' }).getByText(/AI-200/),
      ).toBeVisible();
      await expect(
        page.getByRole('article', { name: 'kube-lab' }).getByText(/incident resolution/),
      ).toBeVisible();
      const upkeep = page.getByRole('article', { name: 'Upkeep' });
      await expect(
        upkeep.getByText(/local, read-only Python dependency discovery/).last(),
      ).toBeVisible();
      await expect(upkeep.getByText(/Azure DevOps integration is planned/)).toBeVisible();
      await expect(upkeep.getByRole('link')).toHaveCount(1);
      await expect(upkeep.getByRole('link', { name: 'Read the Upkeep case study' })).toBeVisible();
      await expect(page.getByText('Planning · documentation only')).toBeVisible();
      await expect(page.getByText('Private · source unavailable')).toHaveCount(3);
      await expect(page.getByRole('article', { name: 'kube-lab' }).getByRole('link')).toHaveCount(
        1,
      );
      for (const study of caseStudies) {
        await page.getByRole('link', { name: `Read the ${study.heading} case study` }).click();
        await expect(page).toHaveTitle(study.title);
        await expect(page.getByRole('heading', { name: study.section })).toBeVisible();
        await page.getByRole('link', { name: 'Back to projects' }).first().click();
        await expect(page).toHaveURL(/\/projects$/);
      }
      await page.getByRole('link', { name: 'Read the Release Log case study' }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Release Log.');
    } else if (route.path === '/projects/release-log') {
      await expect(page.getByRole('link', { name: 'Read the reviewed README' })).toHaveAttribute(
        'href',
        releaseLog.source.url,
      );
      await expect(page.getByRole('link', { name: 'Run the published CLI' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Browse version tags on GitHub' })).toBeVisible();
      await expect(page.getByText(/Source-project tests were not executed/)).toBeVisible();
      await page.getByRole('link', { name: 'Back to projects' }).first().click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Engineering in practice.');
    }
    await context.close();
  });
}

test('project navigation supports keyboard focus, history, metadata and homepage anchors', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  const navigation = page.getByRole('navigation', {
    name: testInfo.project.name === 'mobile' ? 'Mobile navigation' : 'Main navigation',
  });
  await navigation.getByRole('link', { name: 'Projects', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page).toHaveURL(/\/projects$/);
  if (testInfo.project.name === 'mobile')
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  const link = page.getByRole('link', { name: 'Read the Release Log case study' });
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page).toHaveTitle('Release Log — Luc Joosten');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://lucjoosten.nl/projects/release-log',
  );
  await page.goBack();
  await expect(page).toHaveTitle('Projects — Luc Joosten');
  await page.goForward();
  await expect(page).toHaveTitle('Release Log — Luc Joosten');
  await page
    .getByRole('navigation', { name: 'Case study sections' })
    .getByRole('link', { name: 'Where AI belongs' })
    .click();
  await expect(page).toHaveURL(/#ai-boundary$/);
  await expect(page.getByRole('heading', { name: 'Where AI belongs' })).toBeInViewport();
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  await navigation.getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(
    page.getByRole('heading', { name: 'Let’s build something meaningful.' }),
  ).toBeInViewport();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://lucjoosten.nl/',
  );
});

test('resolves the latest stable tag without changing the reviewed narrative', async ({ page }) => {
  await page.goto('/projects/release-log');
  await expect(page.getByRole('link', { name: 'v0.3.0', exact: true })).toHaveAttribute(
    'href',
    'https://github.com/lhajoosten/release-log/tree/v0.3.0',
  );
  await expect(page.getByText('Latest stable tag:', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read the reviewed README' })).toHaveAttribute(
    'href',
    releaseLog.source.url,
  );
  await expect(page.getByRole('link', { name: 'Run the published CLI' })).toBeVisible();
});

test('keeps usage links working when GitHub is rate limited', async ({ page }) => {
  await page.route(releaseLogRefsUrl, (route) => route.fulfill({ status: 403, json: {} }));
  await page.goto('/projects/release-log');
  await expect(page.getByRole('link', { name: 'Browse version tags on GitHub' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Run the published CLI' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Packaged for use' })).toBeVisible();
});

test('homepage and index share project cards and the homepage links to the Lint Action study', async ({
  page,
}) => {
  await page.goto('/');
  const homepageCards = page.locator('#projects .project');
  const homepageTitles = await homepageCards.locator('.project-title').allTextContents();
  const homepageStatuses = await homepageCards.locator('.project-status').allTextContents();
  await expect(homepageCards).toHaveCount(7);
  await page.getByRole('button', { name: 'Read about Lint Action' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Read the case study' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lint Action');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Read the reviewed README' })).toHaveAttribute(
    'href',
    /github\.com\/lhajoosten\/lint-action\/blob\/[a-f0-9]{40}\/README\.md$/,
  );
  await page.getByRole('link', { name: 'Luc Joosten homepage' }).click();
  await page.getByRole('link', { name: 'View all projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  const indexCards = page.getByRole('article');
  expect(await indexCards.locator('.project-title').allTextContents()).toEqual(homepageTitles);
  expect(await indexCards.locator('.project-status').allTextContents()).toEqual(homepageStatuses);
});

test('unknown project routes have no valid canonical or social URL and recover home metadata', async ({
  page,
}) => {
  await page.goto('/projects/missing');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('This path ends here');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page).toHaveTitle('Luc Joosten — Software Engineer | AI & Full-Stack');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://lucjoosten.nl/',
  );
});
