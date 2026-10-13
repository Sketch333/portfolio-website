import { expect, test } from '@playwright/test';

const articlePath = '/blog/how-to-build-a-simple-machine-learning-model-in-python';
const origin = process.env.NEXT_PUBLIC_SITE_URL;
const pages = [
  { path: '/projects/university-timetable-system', title: 'AI-Powered University Timetable Scheduling & Teacher Assignment System', description: 'Constraint-based university scheduling with full-stack integration, exports, and deployment.', type: 'website' },
  { path: articlePath, title: 'How to Build a Simple Machine Learning Model in Python', description: 'Train a first scikit-learn regression pipeline, compare it with a baseline, and evaluate held-out predictions without fitting preprocessing on test data.', type: 'article' },
];

for (const record of pages) {
  test(`${record.path} renders canonical and social metadata from its content`, async ({ page }) => {
    await page.goto(record.path);
    await expect(page).toHaveTitle(`${record.title} | Aon Kazmi`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', record.description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', `${record.title} | Aon Kazmi`);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', record.type);
    if (origin) {
      const canonical = new URL(record.path, origin).href;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', new URL(`${record.path}/opengraph-image`, origin).href);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    }
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent!)));
    if (origin) {
      const breadcrumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
      expect(breadcrumbs.itemListElement.at(-1).item).toBe(new URL(record.path, origin).href);
    }
    if (record.type === 'article') {
      const article = schemas.find(schema => schema['@type'] === 'Article');
      expect(article.headline).toBe(record.title);
      expect(article.description).toBe(record.description);
      expect(article.author.name).toBe('Syed Aon Muhammad Kazmi');
      expect(article.datePublished).toBeUndefined(); // Source articles have no verified publication date.
      if (origin) expect(article.mainEntityOfPage['@id']).toBe(new URL(record.path, origin).href);
    }
  });
}

test('article heading hierarchy starts at one h1 and never skips a level', async ({ page }) => {
  await page.goto(articlePath);
  await expect(page.locator('main h1')).toHaveCount(1);
  const levels = await page.locator('main h1, main h2, main h3, main h4, main h5, main h6').evaluateAll(nodes => nodes.map(node => Number(node.tagName.slice(1))));
  expect(levels[0]).toBe(1);
  expect(levels).toContain(2);
  for (let index = 1; index < levels.length; index++) expect(levels[index]).toBeLessThanOrEqual(levels[index - 1] + 1);
});

test('indexing routes serve canonical XML and robots instructions', async ({ request }) => {
  test.skip(!origin, 'Canonical feed assertions require NEXT_PUBLIC_SITE_URL.');
  const rss = await request.get('/rss.xml');
  expect(rss.status()).toBe(200);
  expect(rss.headers()['content-type']).toContain('application/rss+xml');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  for (const response of [rss, sitemap]) {
    const xml = await response.text();
    expect(xml).toContain(new URL(articlePath, origin).href);
    expect(xml).not.toContain('localhost');
    expect(xml).not.toContain('unpublished');
  }
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${new URL('/sitemap.xml', origin).href}`);
});
