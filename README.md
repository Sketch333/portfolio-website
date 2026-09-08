# Portfolio Website

Production portfolio for **Syed Aon Muhammad Kazmi**, positioned at the intersection of **AI, Data, Product, and Business**.

> **From data to products.**
>
> I build AI-driven systems with technical depth and business impact.

## Status

The product/design specification is approved. Implementation is intentionally phased; Codex should begin with **Phase 1 — Foundation & Content System** and stop at that phase boundary for review.

## Codex Web handoff

Read `AGENTS.md` and `CODEX_WEB_HANDOFF.md` before making changes.

The approved spec and plans are stored as verified compressed text payloads under `.planning-payload/`. If the normal Markdown files under `docs/superpowers/` are not present yet, restore them with:

```bash
python3 scripts/bootstrap-planning-docs.py
```

Do not continue unless the script reports that all planning-document checksums verified.

## Execution order

After the planning docs are restored:

1. `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`
2. `docs/superpowers/plans/2026-09-08-portfolio-roadmap.md`
3. `docs/superpowers/plans/2026-09-08-portfolio-foundation-content-system.md`
4. Later phases only after explicit approval.

## Approved stack

- Next.js App Router + React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion
- Next.js Route Handlers / Server Actions
- MongoDB Atlas (later AI/search phase)
- Vercel AI SDK + model provider (later AI phase)
- Resend (later contact phase)
- Vercel
- GitHub
- Vercel Analytics
- Next.js Metadata + JSON-LD

## Visual direction

The experience deliberately changes mode while staying inside one design system:

- **Hero / landing:** cinematic experimental
- **Projects / AI:** product-interface
- **Blogs / reading:** editorial-tech
- **Theme:** adaptive light + dark

Motion must explain hierarchy, causality, state, progress, navigation, or system behavior. Decorative motion is not a design goal.

## Phase 1 boundary

Phase 1 establishes the production Next.js foundation, testing harness, adaptive theme, shared shell, typed canonical content model, base routes, verified portfolio content, accessibility baseline, and foundation-quality checks.

It does **not** implement the cinematic hero, project demos, semantic search, AI assistant, MongoDB retrieval, Resend contact delivery, or production deployment.

## Safety

- Never commit secrets.
- Never invent portfolio claims.
- Never merge, deploy, publish, or create paid resources without explicit approval.
- Work on an isolated branch/worktree, not directly on `main`.
