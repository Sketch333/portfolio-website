# Portfolio Home & Project Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the foundation into the approved cinematic landing experience and product-interface project system while preserving semantic HTML, mobile usability, reduced-motion behavior, and contribution integrity.

**Architecture:** Keep the homepage content server-rendered, then progressively enhance only the hero and project demo surfaces with isolated Client Components. Every interactive visualization has a semantic/static representation rendered first; motion layers consume the same typed project data instead of duplicating facts. The project case-study shell stays shared while each flagship gets a distinct demo module.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Motion, existing content loaders, Playwright, Vitest, React Testing Library, @axe-core/playwright.

**Spec:** `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

## Global Constraints

- Hero statement: **From data to products.**
- Hero mode: cinematic experimental.
- Project mode: product-interface.
- Motion must communicate hierarchy, causality, state, progress, navigation, or system behavior.
- Reduced-motion and mobile users receive composed, understandable alternatives.
- No essential hover-only interactions.
- Semantic DOM remains the primary text output.
- Flagship project copy must separate team scope from personal contribution.
- Do not publish scheduler metrics until re-verified.
- Do not promote BI dashboards as ML systems without modelling evidence.
- Pretext remains optional and isolated; this plan does not require it.
- Accessibility target: **WCAG 2.2 AA**.
- Performance targets: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**.

---

## File Structure

```text
components/
├── sections/hero-section.tsx
├── sections/selected-work.tsx
├── sections/capabilities.tsx
├── sections/experience-section.tsx
├── sections/writing-preview.tsx
├── sections/beyond-work.tsx
├── sections/contact-preview.tsx
├── interactive/hero-sequence.tsx
├── projects/project-card.tsx
├── projects/project-case-study.tsx
├── projects/demos/scheduler-demo.tsx
├── projects/demos/video-pipeline-demo.tsx
├── projects/demos/chatbot-system-demo.tsx
└── projects/demos/iot-sensor-demo.tsx
lib/
└── projects/presentation.ts
tests/
├── unit/projects/
└── e2e/home-experience.spec.ts
```

### Task 1: Define the presentation model separate from canonical content

**Files:**
- Create: `lib/projects/presentation.ts`
- Create: `tests/unit/projects/presentation.test.ts`

**Interfaces:**
- Produces: `getProjectPresentation(project: ProjectRecord): ProjectPresentation`.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from 'vitest';
import { getProjectPresentation } from '@/lib/projects/presentation';

const base = {
  title: 'Scheduler',
  description: 'Constraint scheduling',
  slug: 'university-timetable-system',
  tier: 'flagship' as const,
  technologies: ['OR-Tools'],
  featured: true,
  published: true,
  body: '',
};

describe('getProjectPresentation', () => {
  it('maps the scheduler to the scheduler interaction', () => {
    expect(getProjectPresentation(base).demo).toBe('scheduler');
  });

  it('maps featured IoT work to the sensor interaction', () => {
    expect(getProjectPresentation({ ...base, slug: 'industrial-iot-sensor-analytics', tier: 'featured' }).demo).toBe('iot');
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/projects/presentation.test.ts
```

- [ ] **Step 3: Implement the mapping**

```ts
import type { ProjectRecord } from '@/types/content';

export type DemoKind = 'scheduler' | 'video-pipeline' | 'chatbot-system' | 'iot' | 'static';

export type ProjectPresentation = {
  demo: DemoKind;
  accentLabel: string;
};

const presentations: Record<string, ProjectPresentation> = {
  'university-timetable-system': { demo: 'scheduler', accentLabel: 'Constraint scheduling' },
  'ai-video-generation-pipeline': { demo: 'video-pipeline', accentLabel: 'Human-in-the-loop AI' },
  'multimodal-ai-chatbot': { demo: 'chatbot-system', accentLabel: 'Hybrid symbolic AI' },
  'industrial-iot-sensor-analytics': { demo: 'iot', accentLabel: 'Time-series analytics' },
};

export function getProjectPresentation(project: ProjectRecord): ProjectPresentation {
  return presentations[project.slug] ?? { demo: 'static', accentLabel: project.tier };
}
```

- [ ] **Step 4: Run tests/typecheck and commit**

```bash
npm run test -- tests/unit/projects/presentation.test.ts
npm run typecheck
git add lib/projects/presentation.ts tests/unit/projects/presentation.test.ts
git commit -m "feat: define project presentation model"
```

### Task 2: Replace homepage anchors with the approved semantic section structure

**Files:**
- Create: all `components/sections/*.tsx` files listed above
- Modify: `app/page.tsx`
- Create: `tests/e2e/home-experience.spec.ts`

**Interfaces:**
- Produces homepage sequence: Hero → Selected Work → Capabilities → Experience → Ask AI deferred static boundary → Writing → Beyond Work → Contact.

- [ ] **Step 1: Write failing order/landmark test**

```ts
import { expect, test } from '@playwright/test';

test('home exposes the approved section landmarks', async ({ page }) => {
  await page.goto('/');
  const headings = await page.locator('main h1, main h2').allTextContents();
  expect(headings).toEqual(expect.arrayContaining([
    'From data to products.',
    'Selected Work',
    'AI × Data × Product × Business',
    'Experience',
    'Writing / Build Journal',
    'Beyond the Work',
  ]));
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test:e2e -- tests/e2e/home-experience.spec.ts
```

- [ ] **Step 3: Implement server-rendered section components**

Each section receives typed data from server loaders. Do not move all of `app/page.tsx` into a Client Component. `SelectedWork` receives only flagship plus selected featured records. `ExperienceSection` receives `getExperience()` output. The Ask AI section renders a lightweight static call-to-action boundary now; Plan 4 replaces its internals.

- [ ] **Step 4: Run route/a11y smoke checks and commit**

```bash
npm run test:e2e -- tests/e2e/home-experience.spec.ts
npm run typecheck
git add app/page.tsx components/sections tests/e2e/home-experience.spec.ts
git commit -m "feat: build semantic homepage narrative"
```

### Task 3: Implement the cinematic hero as progressive enhancement

**Files:**
- Create: `components/interactive/hero-sequence.tsx`
- Modify: `components/sections/hero-section.tsx`
- Create: `tests/unit/components/hero-sequence.test.tsx`
- Extend: `tests/e2e/home-experience.spec.ts`

**Interfaces:**
- Produces: static semantic hero plus client-only `data → intelligence → product → impact` sequence.

- [ ] **Step 1: Write a reduced-motion test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeroSequence } from '@/components/interactive/hero-sequence';

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<object>('motion/react');
  return { ...actual, useReducedMotion: () => true };
});

it('renders all conceptual stages when reduced motion is requested', () => {
  render(<HeroSequence />);
  for (const label of ['Data', 'Intelligence', 'Product', 'Impact']) {
    expect(screen.getByText(label)).toBeVisible();
  }
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/components/hero-sequence.test.tsx
```

- [ ] **Step 3: Implement the progressive sequence**

Use `useReducedMotion()` from Motion. Render all four semantic stage labels regardless of motion preference. When motion is allowed, animate only transform/opacity and connecting-line progress. Avoid pointer-dependent logic. The static content must be visible before hydration.

- [ ] **Step 4: Add mobile/browser assertions**

Extend Playwright with a mobile viewport and assert no horizontal overflow:

```ts
test.use({ viewport: { width: 390, height: 844 } });

test('hero does not overflow on mobile', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
```

- [ ] **Step 5: Run and commit**

```bash
npm run test -- tests/unit/components/hero-sequence.test.tsx
npm run test:e2e -- tests/e2e/home-experience.spec.ts
git add components/interactive components/sections/hero-section.tsx tests
git commit -m "feat: add cinematic progressive hero sequence"
```

### Task 4: Build the shared project card and case-study shell

**Files:**
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/project-case-study.tsx`
- Modify: `components/sections/selected-work.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Create: `tests/unit/projects/project-case-study.test.tsx`

**Interfaces:**
- Consumes: `ProjectRecord`, `ProjectPresentation`.
- Produces: consistent case-study backbone and slots for project-specific demos.

- [ ] **Step 1: Write failing integrity test**

Test that a project with `role` renders a dedicated “My Contribution” section before technology and that source/demo links are ordinary links when present.

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/projects/project-case-study.test.tsx
```

- [ ] **Step 3: Implement the case-study shell**

The component must expose section headings in this order when content is available:

```text
Overview
The Problem
Why It Was Difficult
System / Architecture
My Contribution
Engineering Decisions
Interactive Demonstration
Technology
Results / Metrics
What I Learned
Source / Demo / Related Writing
```

Do not fabricate empty prose. Sections with no verified content should be omitted, except “My Contribution” for team projects, which must be present when a verified role exists.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/projects/project-case-study.test.tsx
npm run typecheck
git add components/projects components/sections/selected-work.tsx app/projects/[slug]/page.tsx tests/unit/projects
git commit -m "feat: add project case-study framework"
```

### Task 5: Implement the scheduler product-interface demo

**Files:**
- Create: `components/projects/demos/scheduler-demo.tsx`
- Create: `tests/unit/projects/scheduler-demo.test.tsx`

**Interfaces:**
- Produces accessible interactive state model for `constraints → conflicts → solved schedule`.

- [ ] **Step 1: Write failing interaction test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SchedulerDemo } from '@/components/projects/demos/scheduler-demo';

it('moves from constraints to a solved schedule without hiding semantic state', () => {
  render(<SchedulerDemo />);
  expect(screen.getByText('Constraints loaded')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Resolve scheduling conflicts' }));
  expect(screen.getByText('Schedule resolved')).toBeVisible();
  expect(screen.getByRole('table', { name: 'Example resolved timetable' })).toBeVisible();
});
```

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/projects/scheduler-demo.test.tsx
```

- [ ] **Step 3: Implement deterministic demo state**

The demo is illustrative, not a live CP-SAT solver. Label it “interactive system walkthrough” so it does not imply production solver execution. Use a small fixed dataset of fictional course codes solely to explain the workflow. Render state transitions as buttons/tabs and an accessible HTML table. Animate transitions only after state updates.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/projects/scheduler-demo.test.tsx
npm run typecheck
git add components/projects/demos/scheduler-demo.tsx tests/unit/projects/scheduler-demo.test.tsx
git commit -m "feat: add scheduler system walkthrough"
```

### Task 6: Implement video-pipeline and hybrid-chatbot demos

**Files:**
- Create: `components/projects/demos/video-pipeline-demo.tsx`
- Create: `components/projects/demos/chatbot-system-demo.tsx`
- Create: `tests/unit/projects/flagship-demos.test.tsx`

**Interfaces:**
- Produces: ordered pipeline state and connected hybrid-AI architecture visualization.

- [ ] **Step 1: Write failing tests**

Verify video pipeline exposes `Script`, `Scene plan`, `Human validation`, `Render` as ordered steps and chatbot exposes `AIML`, `Prolog`, `Neo4j`, `ESP32` as readable labels even when no animation runs.

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/projects/flagship-demos.test.tsx
```

- [ ] **Step 3: Implement semantic-first demos**

Use ordered lists and diagram cards as the underlying DOM. If ESP32/hardware artifact evidence has not yet been re-verified, include it only in the architecture label with copy explicitly sourced from the verified résumé; do not imply a live connected demo. Keep generated video thumbnails/output media out until publishable artifacts are confirmed.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/projects/flagship-demos.test.tsx
npm run typecheck
git add components/projects/demos tests/unit/projects/flagship-demos.test.tsx
git commit -m "feat: add flagship AI system walkthroughs"
```

### Task 7: Implement the featured IoT interaction and analytics project treatment

**Files:**
- Create: `components/projects/demos/iot-sensor-demo.tsx`
- Modify: `components/sections/selected-work.tsx`
- Create: `tests/unit/projects/iot-sensor-demo.test.tsx`

**Interfaces:**
- Produces: `raw stream → cleaning/denoising → anomaly → health score → forecast` walkthrough.

- [ ] **Step 1: Write failing test**

Ensure all five stages are visible to screen readers and selecting “Anomaly” reveals the documented methods: Z-score/IQR, Isolation Forest, Local Outlier Factor, Gaussian Mixture.

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/projects/iot-sensor-demo.test.tsx
```

- [ ] **Step 3: Implement from repository-verified facts only**

Use the existing project README/output evidence. Do not state forecasting accuracy values unless source artifacts provide them. Keep BI Superstore as a standard visual case study with its actual dashboard screenshot/source file rather than pretending it is a live BI engine.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/projects/iot-sensor-demo.test.tsx
npm run typecheck
git add components/projects/demos/iot-sensor-demo.tsx components/sections/selected-work.tsx tests/unit/projects/iot-sensor-demo.test.tsx
git commit -m "feat: add featured IoT analytics walkthrough"
```

### Task 8: Build the experience progression and capabilities narrative

**Files:**
- Modify: `components/sections/capabilities.tsx`
- Modify: `components/sections/experience-section.tsx`
- Create: `tests/unit/components/experience-section.test.tsx`

**Interfaces:**
- Produces: `Data → Intelligence → Product → Business Impact` capability flow and chronological experience display with SprintX first.

- [ ] **Step 1: Write failing test**

Assert SprintX is first, the role is Business Developer, and no bullet copy is rendered for SprintX while its responsibilities remain unverified.

- [ ] **Step 2: Verify failure**

```bash
npm run test -- tests/unit/components/experience-section.test.tsx
```

- [ ] **Step 3: Implement the sections**

Capabilities are grouped into four conceptual clusters and use the verified stack as evidence; they do not dump every skill into the hero. The experience section may describe the overall progression in generic, clearly interpretive copy but must keep each company entry factual.

- [ ] **Step 4: Run and commit**

```bash
npm run test -- tests/unit/components/experience-section.test.tsx
npm run typecheck
git add components/sections tests/unit/components/experience-section.test.tsx
git commit -m "feat: add capability and experience progression"
```

### Task 9: Add accessibility and reduced-motion end-to-end gates for the home/projects experience

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Extend: `playwright.config.ts`

**Interfaces:**
- Produces: automated axe scan, reduced-motion browser project, mobile project.

- [ ] **Step 1: Add axe tests for home and one flagship**

Use `@axe-core/playwright` and fail on serious/critical violations.

- [ ] **Step 2: Add Playwright projects**

Add `mobile-chromium` using `devices['Pixel 7']` (or nearest available Playwright preset) and `reduced-motion` with `reducedMotion: 'reduce'`.

- [ ] **Step 3: Run complete interaction gate**

```bash
npm run test
npm run test:e2e
npm run typecheck
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e playw* components app
git commit -m "test: enforce accessible responsive project experience"
```

## Plan Completion Gate

Manually verify on desktop and mobile:

- hero core copy appears before motion enhancement,
- reduced-motion communicates all four hero stages,
- every project demo can be operated by keyboard/touch,
- no flagship implies unsupported ownership or evidence,
- project pages remain readable with scripts blocked,
- selected-work modules are lazy/client-isolated enough that unrelated project demos are not loaded on first paint.
