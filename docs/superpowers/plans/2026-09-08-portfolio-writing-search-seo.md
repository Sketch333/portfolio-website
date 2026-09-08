# Portfolio Writing, Search & SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch the curated technical/build-journal writing experience, conventional site search, RSS/indexing routes, and complete page-level SEO metadata without depending on AI or MongoDB availability.

**Architecture:** Keep article content in validated MDX and build a server-generated local search index from the same canonical project/blog/experience data. SEO artifacts are generated directly from canonical records so titles, descriptions, canonicals, JSON-LD, sitemap entries, and RSS cannot drift from page content. Interactive editorial widgets remain optional per article and never block reading.

**Tech Stack:** Next.js metadata APIs, MDX content system from Plan 1, React/TypeScript, Tailwind CSS, Zod, local search utility, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

## Global Constraints

- Editorial direction: **Technical + Build Journal**.
- Launch curation: strongest 6–8 existing articles; approved recommendation is eight.
- Preserve original authorship/core content; clean index typos/duplicates deliberately.
- Preserve archived 2025 article dates instead of silently refreshing them.
- Blog mode: editorial-tech with restrained motion.
- Search must work independently of conversational AI.
- Metadata must include unique title/description, canonical, Open Graph/social metadata, structured data where appropriate, sitemap, robots, RSS.
- Do not invent a production canonical domain; domain-dependent canonicals are enabled only after `NEXT_PUBLIC_SITE_URL` is set to the verified launch URL.
- Accessibility target: **WCAG 2.2 AA**.

---

### Task 1: Extend blog schema with launch editorial metadata

**Files:**
- Modify: `types/content.ts`
- Modify: `lib/content/frontmatter.ts`
- Modify: `tests/unit/content/frontmatter.test.ts`

**Interfaces:**
- Adds: `category: 'technical' | 'build-journal'`, `excerpt`, optional `coverImage`, optional `relatedProjectSlugs`.

- [ ] **Step 1: Add failing schema test**

Add a test that accepts `category: technical` and rejects any other category.

- [ ] **Step 2: Run failure**

```bash
npm run test -- tests/unit/content/frontmatter.test.ts
```

- [ ] **Step 3: Implement schema/type changes**

Keep `publishedAt` as an ISO date and retain `featured`/`published` flags. `coverImage` must be a site-relative path starting with `/`.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/content/frontmatter.test.ts
npm run typecheck
git add types/content.ts lib/content/frontmatter.ts tests/unit/content/frontmatter.test.ts
git commit -m "feat: extend blog editorial metadata"
```

### Task 2: Migrate the curated eight launch articles from Canva into MDX

**Files:**
- Create eight files under `content/blog/`
- Create: `tests/unit/content/launch-blog-set.test.ts`

**Interfaces:**
- Produces the approved launch set exactly:
  - `data-preprocessing-a-guide-to-cleaning-your-data`
  - `from-data-to-insights-how-data-science-solves-business-problems`
  - `how-data-visualization-enhances-decision-making`
  - `the-ethics-of-data-science-responsibilities-of-a-data-scientist`
  - `supervised-vs-unsupervised-learning-key-differences`
  - `how-to-build-a-simple-machine-learning-model-in-python`
  - `the-role-of-statistics-in-data-science`
  - `deep-learning-vs-machine-learning-whats-the-difference`

- [ ] **Step 1: Write launch-set test before content import**

Test `getAllPosts()` returns exactly eight `featured: true`/`published: true` launch posts and no archived 2025/general-career articles.

- [ ] **Step 2: Run and verify failure**

```bash
npm run test -- tests/unit/content/launch-blog-set.test.ts
```

- [ ] **Step 3: Extract source article text from the connected Canva designs**

For each approved article, read its Canva design content and transfer the original text into MDX. Preserve article substance and original publication date. Make only documented editorial cleanup: repeated index labels, obvious index/title typo cleanup, Markdown structure, and formatting. Do not supplement factual claims with general web knowledge during migration unless a separate revision is explicitly authored and dated.

- [ ] **Step 4: Add metadata to each article**

Use `category: technical` for the migrated set. Add a concise `description`/`excerpt` derived from the article itself. Keep `featured: true`, `published: true`. Do not set cover images until an actual asset exists.

- [ ] **Step 5: Run content tests and commit**

```bash
npm run test -- tests/unit/content/launch-blog-set.test.ts
npm run typecheck
git add content/blog tests/unit/content/launch-blog-set.test.ts
git commit -m "content: migrate curated launch writing"
```

### Task 3: Build editorial blog index and article chrome

**Files:**
- Create: `components/blog/article-header.tsx`
- Create: `components/blog/article-toc.tsx`
- Create: `components/blog/related-content.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Create: `lib/content/headings.ts`
- Create: `tests/unit/content/headings.test.ts`
- Create: `tests/e2e/blog.spec.ts`

**Interfaces:**
- Produces: readable article layout, reading time, table of contents where 2+ H2 headings exist, related project links.

- [ ] **Step 1: Write heading extractor test**

Test Markdown H2/H3 extraction produces stable slugs and ignores fenced code blocks.

- [ ] **Step 2: Implement `extractHeadings(source)`**

Return `{ level: 2 | 3, text: string, id: string }[]` and reuse the same ID algorithm in MDX heading components so TOC anchors are exact.

- [ ] **Step 3: Implement article index/detail**

Blog index groups by category with featured launch articles first. Article pages render title, description, publish date, tags, reading time computed from source word count, TOC, MDX body, related project links, and next/previous writing where useful.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/content/headings.test.ts
npm run test:e2e -- tests/e2e/blog.spec.ts
npm run typecheck
git add app/blog components/blog lib/content/headings.ts tests
git commit -m "feat: build editorial writing experience"
```

### Task 4: Build conventional unified search over canonical content

**Files:**
- Create: `types/search.ts`
- Create: `lib/search/index.ts`
- Create: `components/search/search-dialog.tsx`
- Create: `components/search/search-results.tsx`
- Modify: `components/layout/site-header.tsx`
- Create: `tests/unit/search/index.test.ts`

**Interfaces:**
- Produces: `buildSearchIndex()` and `searchPortfolio(query, records)`.
- Search record fields: `id`, `type`, `title`, `description`, `href`, `keywords`.

- [ ] **Step 1: Write failing search tests**

Verify `Neo4j` returns the multimodal chatbot project and that `Business Developer` returns SprintX. Verify blank queries return no results.

- [ ] **Step 2: Implement normalized token search**

Use case-insensitive substring/token scoring across title, description, keywords, technologies, company/role, and tags. Do not add fuzzy libraries at launch. Search index construction happens on the server and only the compact search records needed by the client are sent to the dialog.

- [ ] **Step 3: Implement keyboard dialog**

Use a real dialog/sheet primitive with focus trap, Escape close, arrow navigation, Enter to activate, and visible result types. Include an “Ask AI about this” action that links to `/#ask-ai?q=<encoded query>`; Plan 4 makes that query hydrate the assistant.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/search/index.test.ts
npm run typecheck
git add types/search.ts lib/search components/search components/layout/site-header.tsx tests/unit/search
git commit -m "feat: add unified keyboard portfolio search"
```

### Task 5: Add deterministic page metadata, canonicals, and JSON-LD

**Files:**
- Create: `lib/metadata/build-metadata.ts`
- Create: `lib/metadata/json-ld.ts`
- Modify: project/blog/about pages
- Create: `tests/unit/content/metadata.test.ts`

**Interfaces:**
- Produces: `buildPageMetadata`, `personJsonLd`, `articleJsonLd`, `breadcrumbJsonLd`.

- [ ] **Step 1: Write failing metadata tests**

Verify project title format `... | Aon Kazmi`, article title format, and that canonical URL generation returns `undefined` when `NEXT_PUBLIC_SITE_URL` is absent rather than fabricating a domain.

- [ ] **Step 2: Implement metadata builder**

```ts
export function absoluteUrl(pathname: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return undefined;
  return new URL(pathname, base.endsWith('/') ? base : `${base}/`).toString();
}
```

Build metadata objects from content record fields. Social images are included only when the content has a real `coverImage` or a generated project/article OG route exists.

- [ ] **Step 3: Add JSON-LD scripts**

Use `Person` on the root/about page, `Article` on published posts, and `BreadcrumbList` on project/article detail routes. Escape JSON with `JSON.stringify(data).replace(/</g, '\\u003c')` before embedding.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/content/metadata.test.ts
npm run typecheck
git add lib/metadata app tests/unit/content/metadata.test.ts
git commit -m "feat: add canonical metadata and structured data"
```

### Task 6: Generate purpose-built Open Graph images from canonical content

**Files:**
- Create: `app/opengraph-image.tsx`
- Create: `app/projects/[slug]/opengraph-image.tsx`
- Create: `app/blog/[slug]/opengraph-image.tsx`
- Create: `lib/metadata/og.ts`
- Create: `tests/unit/content/og.test.ts`

**Interfaces:**
- Produces deterministic social cards for home, project detail, and article detail routes using the shared identity/type system.

- [ ] **Step 1: Write failing OG content tests**

Test pure helpers that transform a project/post record into `{ eyebrow, title, subtitle }`, ensuring the scheduler card includes its project title and an article card includes the article title/date without fabricating a cover image.

- [ ] **Step 2: Implement shared OG payload helpers**

Keep typography/copy generation in `lib/metadata/og.ts`; route image files only handle layout and `ImageResponse`. Use the same abstract AK/data-to-product mark from the design direction as a simple inline vector/text lockup until the final favicon asset is created in Plan 5.

- [ ] **Step 3: Implement dynamic route images**

`app/projects/[slug]/opengraph-image.tsx` and `app/blog/[slug]/opengraph-image.tsx` load canonical records, return `notFound()` for unknown slugs, and render 1200×630 images with high-contrast light/dark-neutral styling. Do not fetch remote fonts or images at request time.

- [ ] **Step 4: Wire metadata to generated images**

Update the metadata builder so project/article pages reference their generated Open Graph image routes and social metadata no longer depends on manually supplied `coverImage`.

- [ ] **Step 5: Run and commit**

```bash
npm run test -- tests/unit/content/og.test.ts
npm run typecheck
git add app/opengraph-image.tsx app/projects app/blog lib/metadata/og.ts tests/unit/content/og.test.ts
git commit -m "feat: generate portfolio social preview images"
```

### Task 7: Generate sitemap, robots, and RSS from canonical records

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/rss.xml/route.ts`
- Create: `tests/unit/content/feeds.test.ts`

**Interfaces:**
- Produces: `/sitemap.xml`, `/robots.txt`, `/rss.xml`.

- [ ] **Step 1: Write feed helper tests**

Refactor pure helper functions so unit tests can verify only published project/blog routes are included and archived/unpublished records are omitted.

- [ ] **Step 2: Implement sitemap/robots**

When `NEXT_PUBLIC_SITE_URL` is absent, fail the production build with a clear configuration error in CI/deploy mode; local development may use `http://localhost:3000` only for preview. Do not publish production sitemap URLs with localhost.

- [ ] **Step 3: Implement RSS**

Return valid XML with escaped title/description values, latest posts first, canonical article URLs, and `application/rss+xml; charset=utf-8` content type.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/content/feeds.test.ts
NEXT_PUBLIC_SITE_URL=https://example.test npm run build
git add app/sitemap.ts app/robots.ts app/rss.xml tests/unit/content/feeds.test.ts
git commit -m "feat: generate sitemap robots and rss"
```

### Task 8: Add editorial accessibility and SEO browser tests

**Files:**
- Create: `tests/e2e/seo.spec.ts`
- Extend: `tests/e2e/accessibility.spec.ts`

**Interfaces:**
- Produces browser assertions for one project and one article.

- [ ] **Step 1: Test metadata in browser**

Verify title, meta description, canonical link when the test environment provides `NEXT_PUBLIC_SITE_URL`, article JSON-LD, and one real heading hierarchy.

- [ ] **Step 2: Test blog keyboard/a11y**

Run axe on blog index/article, tab through TOC/search, and verify code/pre blocks do not create page-level horizontal overflow.

- [ ] **Step 3: Run complete writing/search gate**

```bash
npm run test
NEXT_PUBLIC_SITE_URL=https://example.test npm run test:e2e
npm run typecheck
npm run lint
NEXT_PUBLIC_SITE_URL=https://example.test npm run build
```

- [ ] **Step 4: Commit**

```bash
git add tests/e2e
git commit -m "test: verify editorial seo and accessibility"
```

## Plan Completion Gate

Before AI work begins, confirm conventional browsing alone can answer:

- what the flagship projects are,
- what Aon has written about data/ML,
- where Neo4j appears,
- what his current role is without invented responsibilities,
- and how to navigate projects/articles with keyboard only.
