# Portfolio Website — Agent Instructions

This repository implements Syed Aon Muhammad Kazmi's approved portfolio website design.

## Mandatory planning bootstrap

The approved spec and plans are stored as verified compressed text payloads because the repository was initialized through a text-only GitHub connector.

Before any implementation work, check whether this file exists:

`docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

If it does not exist, run:

```bash
python3 scripts/bootstrap-planning-docs.py
```

The command must finish with `Planning documents restored and checksums verified.` before you continue. If checksum verification fails, stop: do not reconstruct, paraphrase, or guess the missing planning document.

After restoration, the generated Markdown files are authoritative project documentation and should be included with the implementation branch. Do not modify or delete `.planning-payload/` during Phase 1.

## Authority order

When instructions conflict, use this precedence:

1. Direct instruction from the human partner in the current Codex task.
2. `docs/superpowers/specs/2026-09-08-portfolio-website-design.md` — binding product/design authority.
3. The active phase implementation plan under `docs/superpowers/plans/`.
4. `docs/superpowers/plans/2026-09-08-portfolio-roadmap.md`.
5. Existing repository conventions.

Do not silently change the approved product direction. If a plan detail conflicts with the spec, follow the spec and record the ruling in the Superpowers execution ledger.

## Current execution scope

The repository starts as a documentation-first baseline. Begin with **Phase 1 only**:

`docs/superpowers/plans/2026-09-08-portfolio-foundation-content-system.md`

Do not implement Phase 2–5 unless the human partner explicitly asks you to continue.

## Required Superpowers workflow

Use the installed Superpowers skills whenever applicable.

For Phase 1 execution:

- Restore and verify the planning documents first if needed.
- Read the active plan and its referenced spec before coding.
- Use `superpowers:subagent-driven-development` when subagents are available.
- Use `superpowers:using-git-worktrees` to ensure implementation occurs in an isolated worktree/feature branch, never directly on `main`.
- Maintain the plan-specific SDD progress ledger under `.superpowers/sdd/`.
- Run the plan's pre-flight consistency scan before Task 1.
- Dispatch a fresh implementer per task and review every completed task for both spec compliance and code quality.
- Resolve review findings before advancing.
- Perform the required broad whole-branch review when the phase is complete.
- Stop before merge or deployment so the human partner can review the completed phase.

## Test-driven development

For production behavior, follow `superpowers:test-driven-development`:

1. Write the smallest failing test first.
2. Run it and confirm it fails for the intended reason.
3. Implement the minimum code required to pass.
4. Run the targeted test and broader relevant suite.
5. Refactor only while green.
6. Commit at the checkpoints specified by the implementation plan.

Scaffolding/configuration commands explicitly required by Task 1 may precede the first behavioral test, but do not add application behavior that bypasses the RED → GREEN cycle.

## Content integrity

Portfolio content must be factual and traceable to approved source material.

- Do not invent SprintX responsibilities, dates, metrics, client outcomes, or commercial impact.
- Do not invent project metrics, demos, screenshots, responsibilities, technologies, or outcomes that are not supported by the approved sources/spec.
- Distinguish team ownership from Aon's personal contribution.
- Preserve approved article titles and archived year references unless a separate editorial change is explicitly requested.
- Missing facts remain missing; use neutral placeholders in internal data only when the plan explicitly allows them, and never expose invented copy to visitors.

## Approved positioning

- Audience: hybrid AI/Data + product/business opportunities.
- Hero statement: **From data to products.**
- Supporting positioning: AI-driven systems with technical depth and business impact.
- Visual progression: cinematic landing → product-interface projects/AI → editorial-tech writing.
- Themes: adaptive light/dark, system preference by default, persisted manual override.

## Core architecture constraints

- Next.js App Router + React + TypeScript.
- Tailwind CSS + shadcn/ui.
- Motion for purposeful interaction.
- Server Components by default; keep Client Components narrowly scoped.
- Repository/MDX content is canonical for conventional portfolio content.
- MongoDB Atlas is reserved for later semantic retrieval/AI data needs, not basic content rendering.
- Vercel AI SDK is introduced in the AI phase, not Foundation.
- No separate long-running Express server unless a later approved design change justifies it.
- `@chenglou/pretext` is selective and client-only behind an adapter; never make it a global layout dependency.
- No CMS, voice AI, persistent visitor conversation storage, or Canvas-rendered core text for launch unless the spec is revised.

## Quality gates

Treat these as engineering requirements, not optional polish:

- WCAG 2.2 AA working target.
- Keyboard navigation and visible focus states.
- Reduced-motion support.
- Mobile-first responsive behavior.
- Semantic HTML and meaningful alt-text decisions.
- LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 under realistic conditions.
- Unique route metadata and canonical URLs when SEO work is introduced.
- Graceful degradation: normal portfolio content must remain usable if AI/search/animation enhancements fail.
- No secrets committed to the repository.

## External side effects

Do not perform any of the following without explicit human approval:

- Merge to `main`.
- Deploy or publish to Vercel or another production host.
- Modify production infrastructure.
- Create paid external resources.
- Send real email through Resend.
- Write to production MongoDB data.
- Expose API keys, credentials, personal secrets, or private visitor data.

Creating local commits in the isolated implementation branch/worktree is expected. Prepare changes for review and stop at the phase boundary.

## Codex Cloud bootstrap note

Phase 1 Task 1 begins from this documentation-first repository and requires downloading npm packages, shadcn resources, and Playwright Chromium. The Codex Cloud environment therefore needs internet access during the initial scaffold task. Once the app and lockfile exist, normal environment setup should prefer `npm ci`.

## Primary documents

- Product/design spec: `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`
- Roadmap: `docs/superpowers/plans/2026-09-08-portfolio-roadmap.md`
- Phase 1: `docs/superpowers/plans/2026-09-08-portfolio-foundation-content-system.md`
- Phase 2: `docs/superpowers/plans/2026-09-08-portfolio-home-project-experience.md`
- Phase 3: `docs/superpowers/plans/2026-09-08-portfolio-writing-search-seo.md`
- Phase 4: `docs/superpowers/plans/2026-09-08-portfolio-ai-assistant.md`
- Phase 5: `docs/superpowers/plans/2026-09-08-portfolio-contact-analytics-launch.md`
