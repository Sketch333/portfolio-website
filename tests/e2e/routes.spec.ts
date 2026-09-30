import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const projects = [
  ['university-timetable-system', 'AI-Powered University Timetable Scheduling & Teacher Assignment System'],
  ['ai-video-generation-pipeline', 'AI Video Generation Pipeline — Human-in-the-Loop'],
  ['multimodal-ai-chatbot', 'Multimodal AI Chatbot — AIML + Prolog + Neo4j + ESP32'],
  ['industrial-iot-sensor-analytics', 'Industrial IoT Sensor Analytics'],
  ['bi-superstore-dashboard', 'BI Superstore Dashboard'],
] as const;

function observePageErrors(page: import('@playwright/test').Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('projects index groups every published project and each detail route renders its title', async ({ page }) => {
  const errors = observePageErrors(page);
  await page.goto('/projects');

  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Flagship projects' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured projects' })).toBeVisible();

  for (const [slug, title] of projects) {
    await page.goto('/projects');
    await expect(page.getByRole('link', { name: title })).toHaveAttribute('href', `/projects/${slug}`);
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test('project detail renders the verified personal role and remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/projects/university-timetable-system');
  await expect(page.getByRole('heading', { name: 'AI-Powered University Timetable Scheduling & Teacher Assignment System' })).toBeVisible();
  await expect(page.getByText('Full-Stack Integration Lead', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My Contribution' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Interactive Demonstration' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
  await expect(page.getByText('CP-SAT scheduling progress')).toBeVisible();
  await expect(page.getByText('Capacity and schedule state')).toBeVisible();

  await context.close();
});

test('scheduler walkthrough exposes each state after the reader opts in', async ({ page }) => {
  await page.goto('/projects/university-timetable-system');
  await expect(page.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore scheduling steps' }).click();
  await expect(page.getByText('Constraints loaded')).toBeVisible();
  await page.getByRole('button', { name: 'Show scheduling conflicts' }).click();
  await expect(page.getByText('Conflicts identified')).toBeVisible();
  await page.getByRole('button', { name: 'Inspect CP-SAT progress' }).click();
  await expect(page.getByText('CP-SAT scheduling progress')).toBeVisible();
  await page.getByRole('button', { name: 'Resolve scheduling conflicts' }).click();
  await expect(page.getByText('Schedule resolved')).toBeVisible();
  await expect(page.getByText('Capacity and schedule state')).toBeVisible();
  await expect(page.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
});

test('flagship AI walkthroughs retain their sequence and evidence limits without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/projects/ai-video-generation-pipeline');
  await expect(page.getByRole('list', { name: 'Video pipeline stages' }).getByRole('listitem')).toHaveCount(5);
  await expect(page.getByText(/No generated output is presented as a verified project artifact/i)).toBeVisible();

  await page.goto('/projects/multimodal-ai-chatbot');
  await expect(page.getByRole('group', { name: 'Hybrid chatbot system map' })).toBeVisible();
  await expect(page.getByText(/hardware connection has not been independently verified/i)).toBeVisible();

  await context.close();
});

test('featured analytics remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/projects/industrial-iot-sensor-analytics');
  await expect(page.getByRole('list', { name: 'Sensor analytics stages' }).locator(':scope > li')).toHaveCount(5);
  await expect(page.getByText('Isolation Forest')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://github.com/Sketch333/Industrial_IoT_Sensor_Analytics');

  await page.goto('/projects/bi-superstore-dashboard');
  const dashboard = page.getByRole('img', { name: /Global Superstore Power BI dashboard/i });
  await expect(dashboard).toBeVisible();
  await expect(dashboard).toHaveAttribute('width', '1300');
  await expect(dashboard).toHaveAttribute('height', '722');
  await expect(page.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://github.com/Sketch333/BI-Superstore-Dashboard');

  await context.close();
});

test('unknown project and blog slugs return a recoverable 404', async ({ page }) => {
  await page.goto('/projects/not-a-project');
  await expect(page.getByRole('heading', { name: /404|not found/i })).toBeVisible();

  await page.goto('/blog/not-a-post');
  await expect(page.getByRole('heading', { name: /404|not found/i })).toBeVisible();
});

test('about page communicates hybrid positioning and hides unsupplied experience dates', async ({ page }) => {
  const errors = observePageErrors(page);
  await page.goto('/about');

  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  await expect(page.getByText(/AI, Data, and Product/i)).toBeVisible();
  await expect(page.getByText('SprintX')).toBeVisible();
  await expect(page.getByText('Present', { exact: true })).toBeVisible();
  await expect(page.getByText('Dates not supplied', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('resume supplies a real contact method and does not expose an unverified download', async ({ page }) => {
  await page.goto('/resume');

  await expect(page.getByRole('heading', { name: 'Résumé' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'syedaonm@gmail.com' })).toHaveAttribute('href', 'mailto:syedaonm@gmail.com');
  await expect(page.getByText(/will be linked only when/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /download/i })).toHaveCount(0);
});

test('development blog gate shows only the migration state and no post cards', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.getByRole('heading', { name: 'Writing' })).toBeVisible();
  await expect(page.getByText('Writing migration in progress', { exact: true })).toBeVisible();
  await expect(page.locator('article')).toHaveCount(0);
});

test('content routes have no horizontal overflow across representative viewports', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/projects/university-timetable-system');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('relevant content routes have no Axe violations in light and dark themes', async ({ browser }) => {
  test.setTimeout(90_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    const errors = observePageErrors(page);

    for (const path of ['/projects', '/projects/university-timetable-system', '/projects/ai-video-generation-pipeline', '/projects/multimodal-ai-chatbot', '/projects/industrial-iot-sensor-analytics', '/projects/bi-superstore-dashboard', '/about', '/resume', '/blog']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }

    expect(errors).toEqual([]);
    await context.close();
  }
});
