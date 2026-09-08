# Portfolio Foundation & Content System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the production-ready Next.js foundation, shared design-system shell, adaptive theme, typed content model, and base portfolio routes without implementing the heavy cinematic, AI, or semantic-search layers yet.

**Architecture:** Use the Next.js App Router with Server Components by default and narrowly scoped Client Components for theme/navigation behavior. Keep conventional portfolio content in repository files and expose it through Zod-validated loaders so project/blog/experience pages, search, and AI ingestion can share one canonical model. Establish testing and accessibility primitives before interactive work begins.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Motion, next-themes, Zod, gray-matter, next-mdx-remote, Vitest, React Testing Library, Playwright, @axe-core/playwright.

**Spec:** `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

## Global Constraints

- Positioning: hybrid **AI/Data + product/business**.
- Hero statement: **From data to products.**
- Visual system: cinematic hero, product-interface projects, editorial-tech blogs.
- Theme: adaptive light and dark; respect system preference and persist manual choice.
- Content source: repository files are canonical; MDX is preferred for projects and articles.
- Accessibility target: **WCAG 2.2 AA**.
- Performance targets: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1** under realistic conditions.
- Server Components by default; minimize client component scope.
- No separate long-lived Express backend.
- Do not invent SprintX responsibilities, project metrics, dates, artifacts, or outcomes not supported by verified sources.
- `@chenglou/pretext` is not a global dependency; add it only behind an isolated client adapter when a measured interaction justifies it.
- Launch does not require a CMS, voice AI, full AI conversation storage, Canvas-rendered core text, or an interactive demo for every archive project.

---

## File Structure

Create this foundation structure:

```text
app/
├── about/page.tsx
├── blog/page.tsx
├── blog/[slug]/page.tsx
├── projects/page.tsx
├── projects/[slug]/page.tsx
├── resume/page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
components/
├── layout/site-header.tsx
├── layout/mobile-nav.tsx
├── layout/site-footer.tsx
├── providers/theme-provider.tsx
├── theme/theme-toggle.tsx
└── ui/
content/
├── experience/
├── projects/
└── blog/
lib/
├── content/frontmatter.ts
├── content/projects.ts
├── content/blog.ts
├── content/experience.ts
├── content/mdx.tsx
├── metadata/site.ts
└── utils/cn.ts
types/
└── content.ts
tests/
├── unit/content/
├── unit/components/
└── e2e/
```

The foundation exposes these stable interfaces for later plans:

```ts
getAllProjects(): Promise<ProjectRecord[]>
getProjectBySlug(slug: string): Promise<ProjectRecord | null>
getAllPosts(): Promise<BlogPostRecord[]>
getPostBySlug(slug: string): Promise<BlogPostRecord | null>
getExperience(): Promise<ExperienceRecord[]>
renderMdx(source: string): Promise<React.ReactNode>
```

### Task 1: Scaffold the application and test harness

**Files:**
- Create: application scaffold in repository root
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `playwright.config.ts`
- Create: `tests/e2e/smoke.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, `npm run build`.

- [ ] **Step 1: Scaffold the Next.js app in the isolated repository**

Run from an empty implementation repository:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --import-alias '@/*'
npm install motion next-themes zod gray-matter next-mdx-remote clsx tailwind-merge
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright
npx shadcn@latest init
npx playwright install --with-deps chromium
```

Initialize shadcn/ui against the existing Tailwind/CSS-variable setup and keep its generated primitives under `components/ui/`. Do not add MongoDB, AI-provider, Resend, or Pretext dependencies in this task.

- [ ] **Step 2: Add failing smoke test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('home page exposes the primary positioning', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'From data to products.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore My Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ask My Portfolio' })).toBeVisible();
});
```

- [ ] **Step 3: Configure unit and browser test runners**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

Install the Vite React plugin used by that config:

```bash
npm install -D @vitejs/plugin-react
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 4: Run the test suite and confirm the smoke test fails before the real page is built**

Run:

```bash
npm run test
npm run test:e2e
```

Expected: unit command succeeds with no unit tests; Playwright smoke test fails because the required hero/CTA content is not present yet.

- [ ] **Step 5: Commit the scaffold**

```bash
git add .
git commit -m "chore: scaffold portfolio application"
```

### Task 2: Define the shared content types and validation schemas

**Files:**
- Create: `types/content.ts`
- Create: `lib/content/frontmatter.ts`
- Create: `tests/unit/content/frontmatter.test.ts`

**Interfaces:**
- Produces: `ProjectRecord`, `BlogPostRecord`, `ExperienceRecord`, `projectFrontmatterSchema`, `blogFrontmatterSchema`, `experienceRecordSchema`.

- [ ] **Step 1: Write failing schema tests**

Create `tests/unit/content/frontmatter.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  blogFrontmatterSchema,
  experienceRecordSchema,
  projectFrontmatterSchema,
} from '@/lib/content/frontmatter';

describe('content schemas', () => {
  it('accepts a valid flagship project', () => {
    const result = projectFrontmatterSchema.parse({
      title: 'University Timetable Scheduling System',
      description: 'Constraint-based scheduling and full-stack integration.',
      slug: 'university-timetable-system',
      tier: 'flagship',
      technologies: ['Django REST Framework', 'React', 'OR-Tools'],
      featured: true,
      published: true,
    });
    expect(result.tier).toBe('flagship');
  });

  it('rejects a post without a publication date', () => {
    expect(() =>
      blogFrontmatterSchema.parse({
        title: 'Data Preprocessing',
        description: 'Cleaning data for analysis.',
        slug: 'data-preprocessing',
        tags: ['Data Science'],
        published: true,
      }),
    ).toThrow();
  });

  it('allows an experience entry without unverified metrics', () => {
    const result = experienceRecordSchema.parse({
      company: 'SprintX',
      role: 'Business Developer',
      periodLabel: 'Present',
      current: true,
      highlights: [],
    });
    expect(result.highlights).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run the schema test and verify failure**

```bash
npm run test -- tests/unit/content/frontmatter.test.ts
```

Expected: FAIL because schemas do not exist.

- [ ] **Step 3: Implement shared types**

Create `types/content.ts`:

```ts
export type ProjectTier = 'flagship' | 'featured' | 'archive';

export type ProjectRecord = {
  title: string;
  description: string;
  slug: string;
  tier: ProjectTier;
  technologies: string[];
  featured: boolean;
  published: boolean;
  role?: string;
  sourceUrl?: string;
  demoUrl?: string;
  body: string;
};

export type BlogPostRecord = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
  body: string;
};

export type ExperienceRecord = {
  company: string;
  role: string;
  periodLabel: string;
  current: boolean;
  highlights: string[];
  startDate?: string;
  endDate?: string;
};
```

Create `lib/content/frontmatter.ts`:

```ts
import { z } from 'zod';

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tier: z.enum(['flagship', 'featured', 'archive']),
  technologies: z.array(z.string().min(1)),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  role: z.string().min(1).optional(),
  sourceUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
});

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  publishedAt: z.string().date(),
  updatedAt: z.string().date().optional(),
  tags: z.array(z.string().min(1)).min(1),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const experienceRecordSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  periodLabel: z.string().min(1),
  current: z.boolean().default(false),
  highlights: z.array(z.string()),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
```

- [ ] **Step 4: Run tests and typecheck**

```bash
npm run test -- tests/unit/content/frontmatter.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add types/content.ts lib/content/frontmatter.ts tests/unit/content/frontmatter.test.ts
git commit -m "feat: define typed portfolio content schemas"
```

### Task 3: Build filesystem content loaders

**Files:**
- Create: `lib/content/projects.ts`
- Create: `lib/content/blog.ts`
- Create: `lib/content/experience.ts`
- Create: `tests/unit/content/loaders.test.ts`
- Create: `tests/fixtures/content/...`

**Interfaces:**
- Produces the six canonical loader functions listed in the file-structure section.

- [ ] **Step 1: Add isolated fixture files for loader tests**

Create `tests/fixtures/content/projects/demo-project.mdx`:

```mdx
---
title: Demo Project
description: Fixture project used only by automated tests.
slug: demo-project
tier: featured
technologies:
  - TypeScript
featured: true
published: true
---

Fixture body.
```

Create `tests/fixtures/content/blog/demo-post.mdx`:

```mdx
---
title: Demo Post
description: Fixture article used only by automated tests.
slug: demo-post
publishedAt: 2026-09-08
tags:
  - Testing
published: true
featured: false
---

Fixture article body.
```

Create `tests/fixtures/content/experience/experience.json`:

```json
[
  {
    "company": "Example Co",
    "role": "Example Role",
    "periodLabel": "2026",
    "current": false,
    "highlights": ["Fixture highlight"]
  }
]
```

- [ ] **Step 2: Write failing loader tests**

Create `tests/unit/content/loaders.test.ts`:

```ts
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBlogPostsFrom, loadProjectsFrom } from '@/lib/content/projects';
import { loadExperienceFrom } from '@/lib/content/experience';

const fixtureRoot = path.join(process.cwd(), 'tests/fixtures/content');

describe('filesystem content loaders', () => {
  it('loads and validates project MDX', async () => {
    const projects = await loadProjectsFrom(path.join(fixtureRoot, 'projects'));
    expect(projects[0]).toMatchObject({ slug: 'demo-project', tier: 'featured' });
  });

  it('loads and validates blog MDX', async () => {
    const posts = await loadBlogPostsFrom(path.join(fixtureRoot, 'blog'));
    expect(posts[0]).toMatchObject({ slug: 'demo-post', publishedAt: '2026-09-08' });
  });

  it('loads experience JSON', async () => {
    const experience = await loadExperienceFrom(path.join(fixtureRoot, 'experience/experience.json'));
    expect(experience[0].company).toBe('Example Co');
  });
});
```

The imports intentionally fail until the loaders are implemented. Keep test fixtures out of production content.

- [ ] **Step 3: Run the loader tests and verify failure**

```bash
npm run test -- tests/unit/content/loaders.test.ts
```

Expected: FAIL because loader modules/functions are missing.

- [ ] **Step 4: Implement loader helpers**

Create `lib/content/projects.ts` with a shared MDX reader and project exports:

```ts
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { projectFrontmatterSchema, blogFrontmatterSchema } from './frontmatter';
import type { BlogPostRecord, ProjectRecord } from '@/types/content';

async function readMdxDirectory(directory: string) {
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith('.mdx'));
  return Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(path.join(directory, file), 'utf8');
      const parsed = matter(source);
      return { data: parsed.data, body: parsed.content.trim() };
    }),
  );
}

export async function loadProjectsFrom(directory: string): Promise<ProjectRecord[]> {
  const entries = await readMdxDirectory(directory);
  return entries.map(({ data, body }) => ({ ...projectFrontmatterSchema.parse(data), body }));
}

export async function loadBlogPostsFrom(directory: string): Promise<BlogPostRecord[]> {
  const entries = await readMdxDirectory(directory);
  return entries.map(({ data, body }) => ({ ...blogFrontmatterSchema.parse(data), body }));
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export async function getAllProjects() {
  const projects = await loadProjectsFrom(projectsDirectory);
  return projects.filter((project) => project.published);
}

export async function getProjectBySlug(slug: string) {
  return (await getAllProjects()).find((project) => project.slug === slug) ?? null;
}
```

Create `lib/content/blog.ts`:

```ts
import path from 'node:path';
import { loadBlogPostsFrom } from './projects';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export { loadBlogPostsFrom };

export async function getAllPosts() {
  const posts = await loadBlogPostsFrom(blogDirectory);
  return posts
    .filter((post) => post.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostBySlug(slug: string) {
  return (await getAllPosts()).find((post) => post.slug === slug) ?? null;
}
```

Create `lib/content/experience.ts`:

```ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { experienceRecordSchema } from './frontmatter';
import type { ExperienceRecord } from '@/types/content';

const experienceFile = path.join(process.cwd(), 'content/experience/experience.json');

export async function loadExperienceFrom(file: string): Promise<ExperienceRecord[]> {
  const raw = JSON.parse(await fs.readFile(file, 'utf8'));
  return z.array(experienceRecordSchema).parse(raw);
}

export function getExperience() {
  return loadExperienceFrom(experienceFile);
}
```

Fix the loader test imports so `loadBlogPostsFrom` comes from `@/lib/content/blog` and `loadProjectsFrom` from `@/lib/content/projects`.

- [ ] **Step 5: Run tests and typecheck**

```bash
npm run test -- tests/unit/content/loaders.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/content tests/fixtures tests/unit/content/loaders.test.ts
git commit -m "feat: add validated filesystem content loaders"
```

### Task 4: Add MDX rendering boundary

**Files:**
- Create: `lib/content/mdx.tsx`
- Create: `components/blog/mdx-components.tsx`
- Create: `tests/unit/content/mdx.test.tsx`

**Interfaces:**
- Produces: `renderMdx(source: string): Promise<React.ReactNode>`.

- [ ] **Step 1: Write a failing MDX rendering test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderMdx } from '@/lib/content/mdx';

describe('renderMdx', () => {
  it('renders semantic headings and links', async () => {
    render(await renderMdx('## Architecture\n\n[Source](https://example.com)'));
    expect(screen.getByRole('heading', { name: 'Architecture', level: 2 })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://example.com');
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test -- tests/unit/content/mdx.test.tsx
```

- [ ] **Step 3: Implement the MDX renderer**

Create `components/blog/mdx-components.tsx`:

```tsx
import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-12 scroll-mt-24 text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-8 scroll-mt-24 text-xl font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7 text-balance" {...props} />,
  a: (props) => <a className="underline underline-offset-4" {...props} />,
  pre: (props) => <pre className="my-6 overflow-x-auto rounded-xl border p-4" {...props} />,
};
```

Create `lib/content/mdx.tsx`:

```tsx
import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/blog/mdx-components';

export async function renderMdx(source: string) {
  const { content } = await compileMDX({ source, components: mdxComponents });
  return content;
}
```

- [ ] **Step 4: Run the test and typecheck**

```bash
npm run test -- tests/unit/content/mdx.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/content/mdx.tsx components/blog/mdx-components.tsx tests/unit/content/mdx.test.tsx
git commit -m "feat: add server-rendered MDX boundary"
```

### Task 5: Build the adaptive theme provider and toggle

**Files:**
- Create: `components/providers/theme-provider.tsx`
- Create: `components/theme/theme-toggle.tsx`
- Create: `tests/unit/components/theme-toggle.test.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `ThemeProvider`, `ThemeToggle`.

- [ ] **Step 1: Write a failing toggle test**

Create a unit test that mocks `next-themes` and verifies an accessible button cycles from light to dark:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const setTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => setTheme.mockClear());

  it('switches to dark theme', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test -- tests/unit/components/theme-toggle.test.tsx
```

- [ ] **Step 3: Implement theme provider/toggle**

`components/providers/theme-provider.tsx`:

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
```

`components/theme/theme-toggle.tsx`:

```tsx
'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="rounded-full border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
```

Wrap `app/layout.tsx` body content with:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  {children}
</ThemeProvider>
```

Add `suppressHydrationWarning` to `<html>` because the class is theme-controlled after hydration.

- [ ] **Step 4: Run tests/typecheck**

```bash
npm run test -- tests/unit/components/theme-toggle.test.tsx
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add components/providers components/theme app/layout.tsx tests/unit/components/theme-toggle.test.tsx
git commit -m "feat: add adaptive light and dark themes"
```

### Task 6: Build the accessible site shell and navigation

**Files:**
- Create: `components/layout/site-header.tsx`
- Create: `components/layout/mobile-nav.tsx`
- Create: `components/layout/site-footer.tsx`
- Create: `tests/unit/components/site-header.test.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: desktop nav `Work · Experience · Writing · About · Ask AI`, distinct `Contact`, skip-link target `#main-content`.

- [ ] **Step 1: Write failing navigation test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from '@/components/layout/site-header';

describe('SiteHeader', () => {
  it('exposes the required navigation and contact action', () => {
    render(<SiteHeader />);
    for (const name of ['Work', 'Experience', 'Writing', 'About', 'Ask AI']) {
      expect(screen.getByRole('link', { name })).toBeVisible();
    }
    expect(screen.getByRole('link', { name: 'Contact' })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test -- tests/unit/components/site-header.test.tsx
```

- [ ] **Step 3: Implement semantic header/footer**

Use `<header>`, `<nav aria-label="Primary">`, normal `<a>`/`Link` elements, a button-controlled mobile menu with `aria-expanded`, and visible focus states. Desktop target anchors are `/#work`, `/#experience`, `/blog`, `/about`, and `/#ask-ai`; `Contact` targets `/#contact`.

Add before the header in `app/layout.tsx`:

```tsx
<a
  href="#main-content"
  className="sr-only fixed left-4 top-4 z-[100] rounded bg-background px-3 py-2 focus:not-sr-only"
>
  Skip to content
</a>
```

Wrap route children in `<main id="main-content">`.

- [ ] **Step 4: Run tests and typecheck**

```bash
npm run test -- tests/unit/components/site-header.test.tsx
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add components/layout app/layout.tsx tests/unit/components/site-header.test.tsx
git commit -m "feat: add accessible portfolio shell navigation"
```

### Task 7: Add canonical site metadata primitives and the real hero copy

**Files:**
- Create: `lib/metadata/site.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `tests/unit/content/site-metadata.test.ts`

**Interfaces:**
- Produces: `siteConfig`, baseline metadata, real home positioning/CTAs.

- [ ] **Step 1: Write failing metadata test**

```ts
import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/lib/metadata/site';

describe('siteConfig', () => {
  it('uses the approved positioning', () => {
    expect(siteConfig.title).toContain('Syed Aon Muhammad Kazmi');
    expect(siteConfig.description).toContain('AI-driven systems');
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test -- tests/unit/content/site-metadata.test.ts
```

- [ ] **Step 3: Implement site config and base metadata**

`lib/metadata/site.ts`:

```ts
export const siteConfig = {
  name: 'Syed Aon Muhammad Kazmi',
  title: 'Syed Aon Muhammad Kazmi — AI, Data & Product',
  description:
    'I build AI-driven systems with technical depth and business impact — spanning intelligent automation, full-stack products, analytics, and product strategy.',
  email: 'syedaonm@gmail.com',
} as const;
```

Use this in `app/layout.tsx` metadata. Do not set a production `metadataBase` until the launch domain is verified; using a false domain would create incorrect canonicals.

Replace default `app/page.tsx` with a semantic, static foundation:

```tsx
export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-6 py-24">
        <p className="text-sm font-medium tracking-[0.2em]">AI · Data · Product</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-tight md:text-7xl">
          From data to products.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          I build AI-driven systems with technical depth and business impact — spanning intelligent automation,
          full-stack products, analytics, and product strategy.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#work" className="rounded-full bg-foreground px-5 py-3 text-background">Explore My Work</a>
          <a href="#ask-ai" className="rounded-full border px-5 py-3">Ask My Portfolio</a>
          <a href="/resume" className="px-5 py-3 underline underline-offset-4">View résumé</a>
        </div>
      </section>
      <section id="work" aria-label="Selected work" className="min-h-40" />
      <section id="experience" aria-label="Experience" className="min-h-40" />
      <section id="ask-ai" aria-label="Ask My Portfolio" className="min-h-40" />
      <section id="contact" aria-label="Contact" className="min-h-40" />
    </>
  );
}
```

These empty anchor sections are temporary structural anchors within this foundation task only; Task 2 of the next plan replaces them with actual components before any public release.

- [ ] **Step 4: Run all current tests**

```bash
npm run test
npm run test:e2e
npm run typecheck
npm run lint
```

Expected: PASS, including the Task 1 smoke test.

- [ ] **Step 5: Commit**

```bash
git add app lib/metadata tests/unit/content/site-metadata.test.ts
git commit -m "feat: add approved positioning and base metadata"
```

### Task 8: Add real project and experience canonical records without inventing missing facts

**Files:**
- Create: `content/projects/university-timetable-system.mdx`
- Create: `content/projects/ai-video-generation-pipeline.mdx`
- Create: `content/projects/multimodal-ai-chatbot.mdx`
- Create: `content/projects/industrial-iot-sensor-analytics.mdx`
- Create: `content/projects/bi-superstore-dashboard.mdx`
- Create: `content/experience/experience.json`
- Create: `tests/unit/content/production-content.test.ts`

**Interfaces:**
- Produces: verified launch project metadata and experience ordering for later presentation layers.

- [ ] **Step 1: Write a production-content integrity test**

```ts
import { describe, expect, it } from 'vitest';
import { getAllProjects } from '@/lib/content/projects';
import { getExperience } from '@/lib/content/experience';

describe('production portfolio content', () => {
  it('contains exactly three flagship projects', async () => {
    const flagships = (await getAllProjects()).filter((project) => project.tier === 'flagship');
    expect(flagships.map((project) => project.slug).sort()).toEqual([
      'ai-video-generation-pipeline',
      'multimodal-ai-chatbot',
      'university-timetable-system',
    ]);
  });

  it('keeps SprintX first without invented highlights', async () => {
    const experience = await getExperience();
    expect(experience[0]).toMatchObject({ company: 'SprintX', role: 'Business Developer', current: true });
    expect(experience[0].highlights).toEqual([]);
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test -- tests/unit/content/production-content.test.ts
```

- [ ] **Step 3: Add the verified project frontmatter and conservative body copy**

Use only claims already supported by the approved design spec and source material. For example, the scheduler frontmatter:

```yaml
---
title: AI-Powered University Timetable Scheduling & Teacher Assignment System
description: Constraint-based university scheduling with full-stack integration, exports, and deployment.
slug: university-timetable-system
tier: flagship
technologies:
  - Django REST Framework
  - React
  - Vite
  - Material UI
  - Google OR-Tools CP-SAT
  - Docker
  - Google Cloud Run
featured: true
published: true
role: Full-Stack Integration Lead
---
```

The body must distinguish four-person team scope from personal contribution and may include only the already verified contribution areas: electives scheduling, API/integration work, export/deployment, and related delivery. Do not publish the 90.5%, 98.5%, or 92.5% metrics until those metrics are re-verified from authoritative project records during Plan 2.

For SprintX in `experience.json`, use:

```json
{
  "company": "SprintX",
  "role": "Business Developer",
  "periodLabel": "Present",
  "current": true,
  "highlights": []
}
```

Do not invent a start date or responsibilities. Add WebForest and UMT TA using dates already present in verified source material; leave WebForest end date absent if not verified.

- [ ] **Step 4: Run integrity tests**

```bash
npm run test -- tests/unit/content/production-content.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content tests/unit/content/production-content.test.ts
git commit -m "content: add verified project and experience records"
```

### Task 9: Build base list/detail routes for projects, blog, about, and résumé

**Files:**
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/resume/page.tsx`
- Create: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Produces: conventional browse paths that work before advanced interaction/AI layers.

- [ ] **Step 1: Write failing route tests**

```ts
import { expect, test } from '@playwright/test';

test('projects index lists the scheduler', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /University Timetable/i })).toBeVisible();
});

test('project detail renders the personal role', async ({ page }) => {
  await page.goto('/projects/university-timetable-system');
  await expect(page.getByText('Full-Stack Integration Lead')).toBeVisible();
});

test('about page contains the hybrid positioning', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText(/AI.*Data.*Product/i)).toBeVisible();
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test:e2e -- tests/e2e/routes.spec.ts
```

- [ ] **Step 3: Implement server-rendered project routes**

`app/projects/page.tsx` must call `getAllProjects()` and render semantic links grouped by tier. `app/projects/[slug]/page.tsx` must call `getProjectBySlug`, return `notFound()` for null, render `role` when present, and render the MDX body with `renderMdx`.

Use `generateStaticParams()` from `getAllProjects()` so published project routes are statically enumerable.

Implement blog routes with the same pattern; the list can legitimately show “Writing migration in progress” only in local development, but production should not publish the blog index until Plan 3 imports the curated launch set. Gate production rendering with actual `getAllPosts()` results rather than fake cards.

Implement `/resume` as a page that offers the verified email/contact path and clearly states the downloadable résumé file will be linked only when the final public résumé asset is confirmed; do not publish a dead download link.

- [ ] **Step 4: Run all foundation checks**

```bash
npm run test
npm run test:e2e
npm run typecheck
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app tests/e2e/routes.spec.ts
git commit -m "feat: add server-rendered portfolio content routes"
```

## Plan Completion Gate

Before moving to the home/project interaction plan, verify:

```bash
npm run test
npm run test:e2e
npm run typecheck
npm run lint
npm run build
```

Then manually confirm:

- system theme works before a manual override,
- manual theme choice persists after reload,
- keyboard focus reaches the skip link, nav, CTAs, and theme toggle,
- project detail pages remain readable with JavaScript disabled,
- no unverified SprintX details or project metrics are present.
