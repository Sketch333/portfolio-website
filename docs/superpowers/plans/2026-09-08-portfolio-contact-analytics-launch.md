# Portfolio Contact, Analytics & Launch Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete contact conversion, privacy-conscious analytics, route/error states, identity assets, cross-browser/accessibility/performance hardening, and the explicit launch-quality gates required by the approved design.

**Architecture:** Keep contact submission server-side and independent from AI/database services. Centralize analytics event names/types so UI components emit only approved non-sensitive properties. Treat accessibility, Core Web Vitals, browser behavior, metadata/indexing, and content integrity as blocking release checks rather than cleanup.

**Tech Stack:** Next.js Route Handlers or Server Actions, Resend, Zod, Vercel Analytics, Playwright, @axe-core/playwright, Lighthouse CI or local Lighthouse CLI, existing application stack.

**Spec:** `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

## Global Constraints

- Final CTA direction: **Have a product, data problem, or AI idea worth building?**
- Direct email/contact method remains available if the form/provider fails.
- Analytics records meaningful portfolio events, not every hover.
- Raw AI prompt text is not sent to analytics by default.
- Accessibility target: **WCAG 2.2 AA**.
- Performance targets: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**.
- Verify phone, tablet, laptop, large desktop, current Chromium, Firefox, Safari/WebKit.
- Required identity: favicon/browser/mobile/social asset coverage using an abstract AK/data-to-product direction.
- Custom 404 copy direction: **404 — This route didn’t make it to production.**
- No launch with unresolved or invented claims.

---

### Task 1: Build validated contact submission and Resend adapter

**Files:**
- Create: `lib/contact/schema.ts`
- Create: `lib/contact/send-message.ts`
- Create: `app/api/contact/route.ts`
- Create: `components/contact/contact-form.tsx`
- Modify: final contact section
- Create: `tests/unit/contact/contact-route.test.ts`

**Interfaces:**
- POST `/api/contact` body: `{ name, email, message, company?, website? }`, where `website` is a honeypot and must remain empty.

- [ ] **Step 1: Install Resend and write failing validation tests**

```bash
npm install resend
```

Test invalid email, message below 20 chars, message above 5000 chars, and non-empty honeypot rejection.

- [ ] **Step 2: Implement Zod schema**

Use `name` 2–100 chars, valid email, optional `company` max 120 chars, `message` 20–5000 chars, `website` max 0 chars for legitimate submissions.

- [ ] **Step 3: Implement server-only Resend adapter**

Read `RESEND_API_KEY` and `CONTACT_TO_EMAIL` only inside the server adapter. Send plain text plus minimal HTML. Never echo secrets or the full provider response to the browser.

- [ ] **Step 4: Implement route**

Return 201 on send, 400 on validation/honeypot, 503 on provider failure with a generic message. The UI always keeps `mailto:syedaonm@gmail.com` visible.

- [ ] **Step 5: Implement accessible form**

Use labels, `aria-describedby` for field errors, a non-disruptive status region, and preserve entered text after provider failure.

- [ ] **Step 6: Run/commit**

```bash
npm run test -- tests/unit/contact/contact-route.test.ts
npm run typecheck
git add lib/contact app/api/contact components/contact components/sections package*.json tests/unit/contact
git commit -m "feat: add resilient contact conversion flow"
```

### Task 2: Centralize and instrument approved analytics events

**Files:**
- Create: `lib/analytics/events.ts`
- Create: `lib/analytics/track.ts`
- Modify: CTA/project/blog/AI/contact components
- Create: `tests/unit/analytics/events.test.ts`

**Interfaces:**
- Event union exactly includes:
  `project_opened`, `project_demo_interacted`, `project_source_clicked`, `blog_opened`, `blog_related_project_clicked`, `ai_opened`, `ai_question_submitted`, `ai_reference_clicked`, `resume_viewed`, `resume_downloaded`, `contact_started`, `contact_submitted`, `outbound_link_clicked`.

- [ ] **Step 1: Install Vercel Analytics**

```bash
npm install @vercel/analytics@latest
```

Render `<Analytics />` from `@vercel/analytics/react` once in the root layout and use the package's `track()` API only through the typed wrapper below.

- [ ] **Step 2: Write event-contract test**

Assert `ai_question_submitted` payload type allows `mode`, `location`, and `pageType` but has no `prompt`, `question`, `message`, or free-form text field.

- [ ] **Step 3: Implement typed `trackPortfolioEvent`**

One wrapper imports the Vercel analytics event function in client code and no-ops during unit tests/server rendering.

- [ ] **Step 4: Instrument meaningful actions only**

Track CTA clicks, project opens/demo interactions, article opens/related links, AI open/submission/reference clicks, résumé, contact lifecycle, and outbound GitHub/LinkedIn. Do not instrument decorative hero stages or hover states.

- [ ] **Step 5: Run/commit**

```bash
npm run test -- tests/unit/analytics/events.test.ts
npm run typecheck
git add lib/analytics components app tests/unit/analytics
git commit -m "feat: add privacy-conscious portfolio analytics"
```

### Task 3: Implement route loading/error/not-found states and custom 404

**Files:**
- Create: `app/loading.tsx`
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`
- Create: `app/projects/[slug]/loading.tsx`
- Create: `app/blog/[slug]/loading.tsx`
- Create: `tests/e2e/errors.spec.ts`

**Interfaces:**
- Global 404 actions: Go Home, Explore Projects, Ask My Portfolio.

- [ ] **Step 1: Write failing 404 test**

Navigate to `/does-not-exist` and assert exact 404 copy plus all three recovery actions.

- [ ] **Step 2: Implement semantic 404**

Use the approved copy and a small CSS/DOM `request → route → ?` visual. No heavy client animation is needed.

- [ ] **Step 3: Implement root error boundary**

`app/error.tsx` is a Client Component with “Try again” and direct navigation. Do not leak stack traces.

- [ ] **Step 4: Test project/blog unknown slugs**

They must resolve to the same recoverable 404 behavior.

- [ ] **Step 5: Run/commit**

```bash
npm run test:e2e -- tests/e2e/errors.spec.ts
npm run typecheck
git add app tests/e2e/errors.spec.ts
git commit -m "feat: add resilient loading error and 404 states"
```

### Task 4: Create favicon/identity assets and metadata wiring

**Files:**
- Create: `app/icon.svg`
- Create: `app/apple-icon.png` or generated equivalent
- Create: `public/icons/ak-mark.svg`
- Modify: metadata configuration
- Create: `tests/e2e/identity.spec.ts`

**Interfaces:**
- Produces a simple abstract AK/data-to-product mark that is legible at favicon scale.

- [ ] **Step 1: Create the vector mark**

Use simple geometric paths and the existing foreground/background CSS-compatible palette. Avoid brain/robot/network clichés. Keep the SVG accessible as decorative branding (`aria-hidden` when inline).

- [ ] **Step 2: Produce raster apple/app icon from the same mark**

Use a local build script or image tool to rasterize; do not introduce a runtime image dependency.

- [ ] **Step 3: Verify browser metadata**

Test `/favicon.ico` or framework-generated icon endpoint responds and the document includes expected icon links.

- [ ] **Step 4: Commit**

```bash
git add app/icon.svg app/apple-icon.png public/icons app/layout.tsx tests/e2e/identity.spec.ts
git commit -m "feat: add portfolio identity and favicon assets"
```

### Task 5: Finalize résumé delivery without broken links

**Files:**
- Add verified résumé PDF under `public/resume/` only after the user confirms the final file
- Modify: `app/resume/page.tsx`
- Modify: résumé CTAs
- Create: `tests/e2e/resume.spec.ts`

**Interfaces:**
- Produces a working view/download route and analytics events.

- [ ] **Step 1: Verify the final résumé artifact with the user-provided current file**

Do not ship the older Canva résumé link if the newer provided resume is authoritative. Confirm filename/content before placing it in `public/resume/`.

- [ ] **Step 2: Add browser test**

Assert `/resume` has a working download link and the asset returns HTTP 200.

- [ ] **Step 3: Wire analytics**

Track `resume_viewed` on route view and `resume_downloaded` on explicit download action.

- [ ] **Step 4: Commit**

```bash
git add public/resume app/resume components tests/e2e/resume.spec.ts
git commit -m "feat: publish verified resume asset"
```

### Task 6: Resolve content-integrity gates before release

**Files:**
- Modify: `content/experience/experience.json`
- Modify: affected project MDX files
- Create: `tests/unit/content/launch-integrity.test.ts`

**Interfaces:**
- Produces a machine-checkable list of disallowed unresolved markers/claims.

- [ ] **Step 1: Collect authoritative answers for remaining content gaps**

Required user/source confirmations:
- SprintX start date,
- SprintX exact responsibilities and approved public outcomes,
- WebForest end date if applicable,
- final public résumé,
- public links/screenshots/demos for flagship scheduler/video projects,
- project metric verification,
- final launch domain.

If any item remains unknown, omit the corresponding claim/metric/link from public content rather than displaying unresolved-marker text.

- [ ] **Step 2: Add integrity tests**

Scan production content for unresolved-marker patterns (including the standard three-letter 'to be determined' marker, the standard four-letter task marker, and phrases such as `replace dashboard`) and for scheduler metrics unless a `verifiedMetrics` field has been explicitly added after source confirmation.

- [ ] **Step 3: Run/commit verified content updates**

```bash
npm run test -- tests/unit/content/launch-integrity.test.ts
npm run typecheck
git add content tests/unit/content/launch-integrity.test.ts
git commit -m "content: resolve launch integrity gates"
```

### Task 7: Add cross-browser responsive and accessibility release suite

**Files:**
- Extend: `playwright.config.ts`
- Create: `tests/e2e/release-accessibility.spec.ts`
- Create: `tests/e2e/release-responsive.spec.ts`

**Interfaces:**
- Projects: Chromium desktop, Firefox desktop, WebKit desktop, mobile Chromium, reduced-motion Chromium.

- [ ] **Step 1: Install Playwright Firefox/WebKit browsers**

```bash
npx playwright install --with-deps firefox webkit
```

- [ ] **Step 2: Add browser projects**

Use Playwright's official device presets for phone and desktop. The reduced-motion project sets `reducedMotion: 'reduce'`.

- [ ] **Step 3: Implement keyboard and axe journeys**

Cover home → flagship → blog → Ask AI → contact. Fail on serious/critical axe issues. Verify focus visibility, mobile menu operation, dialog search/AI behavior, contact errors, and reduced-motion content completeness.

- [ ] **Step 4: Run the full browser suite**

```bash
npm run test:e2e
```

Expected: PASS across configured browsers.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: add cross-browser accessibility release gates"
```

### Task 8: Add bundle/performance budget checks

**Files:**
- Create: `scripts/check-client-bundles.mjs`
- Create: `lighthouserc.json`
- Modify: `package.json`

**Interfaces:**
- Produces `npm run perf:bundle` and `npm run perf:lighthouse`.

- [ ] **Step 1: Add bundle check**

After `next build`, inspect build output/manifests and fail if the homepage unexpectedly includes project-specific demo modules or the AI SDK/provider bundle before interaction. The script should check for known chunk/module names rather than enforce a brittle global KB number.

- [ ] **Step 2: Add Lighthouse CI/local configuration**

Install `@lhci/cli` as a dev dependency. Configure representative `/`, one project, and one article. Set minimum accessibility and SEO category scores to 0.95 and performance to 0.90 as a regression gate; separately review field-like Core Web Vitals targets from the spec because Lighthouse lab scores are not equivalent to field CWV.

- [ ] **Step 3: Run performance checks under production build**

```bash
npm run build
npm run perf:bundle
npm run perf:lighthouse
```

- [ ] **Step 4: Fix regressions before commit**

Typical accepted fixes: dynamic import heavy demos/AI client, correct image `sizes`, remove unused client providers, reduce font weights, move server-compatible code out of Client Components. Do not lower thresholds merely to pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-client-bundles.mjs lighthouserc.json package*.json
git commit -m "test: enforce portfolio performance budgets"
```

### Task 9: Configure final domain, deployment environment, and production indexing

**Files:**
- Modify: environment configuration in Vercel
- No secret files committed

**Interfaces:**
- Production env includes `NEXT_PUBLIC_SITE_URL`, `MONGODB_URI`, `MONGODB_DB`, AI provider key/model, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.

- [ ] **Step 1: Set verified production environment variables in Vercel**

Do not expose server secrets with `NEXT_PUBLIC_` prefixes.

- [ ] **Step 2: Deploy a preview and run smoke tests against the preview URL**

Verify home, projects, blog, search, AI, contact, RSS, sitemap, robots, favicon, 404, and résumé.

- [ ] **Step 3: Set/verify final domain and `NEXT_PUBLIC_SITE_URL`**

Rebuild so canonicals, JSON-LD, sitemap, RSS, and social metadata use the production domain.

- [ ] **Step 4: Verify robots/indexing policy**

Preview deployments should not be treated as canonical production pages. Production `robots.txt` must allow intended public routes and reference the correct sitemap.

### Task 10: Execute the explicit launch-quality checklist

**Files:**
- Create: `docs/launch-checklist.md`

**Interfaces:**
- Produces signed-off checks for CTA, positioning, SEO, indexing, blogs, projects, accessibility, responsive, performance, images, AI, search, analytics, contact, links, errors, theme, motion, identity, browser, content.

- [ ] **Step 1: Create the checklist with one checkbox per Spec §26 row**

Add three final walkthrough sections: Technical Recruiter, Product/Business Visitor, Founder/Client.

- [ ] **Step 2: Run all automated release commands**

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run perf:bundle
npm run perf:lighthouse
```

- [ ] **Step 3: Perform manual content/link review**

Check every public external link, source link, image alt decision, project ownership statement, article date, SprintX/WebForest chronology, and direct contact method.

- [ ] **Step 4: Commit launch checklist**

```bash
git add docs/launch-checklist.md
git commit -m "docs: add portfolio launch quality checklist"
```

## Plan Completion Gate

The portfolio is launch-ready only when every applicable item in `docs/launch-checklist.md` is checked and the automated release commands pass on the production candidate commit. Unknown content facts must be omitted, not guessed.
