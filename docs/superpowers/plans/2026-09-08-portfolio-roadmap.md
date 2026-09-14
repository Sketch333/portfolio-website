# Portfolio Website Implementation Roadmap

**Spec:** `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

The approved specification spans multiple independently testable subsystems, so implementation is split into five plans. Execute them in order because each plan establishes interfaces used by the next.

1. `2026-09-08-portfolio-foundation-content-system.md` — application scaffold, testing, theme, shared shell, content schemas/loaders, base routes, and canonical metadata primitives.
2. `2026-09-08-portfolio-home-project-experience.md` — cinematic hero, project hierarchy, case-study framework, experience narrative, responsive interaction behavior, and accessible motion fallbacks.
3. `2026-09-08-portfolio-writing-search-seo.md` — curated MDX writing, editorial components, conventional search, RSS, sitemap/robots, JSON-LD, canonical/social metadata.
4. `2026-09-08-portfolio-ai-assistant.md` — MongoDB Atlas ingestion, embeddings, hybrid retrieval, evidence-grounded Ask My Portfolio, page context, recruiter mode, and RAG evaluations.
5. `2026-09-08-portfolio-contact-analytics-launch.md` — contact delivery, analytics events, error/404 states, favicon/identity assets, accessibility/performance/browser hardening, deployment checks, and release gates.

## Execution rule

Each plan must leave the application in a working, testable state. Do not start the next plan until the current plan's automated checks pass and its review gate is accepted. If the user-provided `web-artifacts-builder` or `front-end` skill files are surfaced by the implementation environment, read and apply them before editing UI code; do not assume their contents when they are not available.

## Repository note

The authenticated GitHub account currently exposes repositories for the existing projects and profile, but no dedicated portfolio application repository has been selected. Do not overwrite the profile repository `Sketch333/Syed-Aon-Muhammad-Kazmi`. Build in an isolated local repository/worktree first; add a GitHub remote only after a dedicated portfolio repository is selected or created.
