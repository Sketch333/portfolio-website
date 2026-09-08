# Codex Web Handoff — Phase 1

This repository is prepared for Codex Web to implement **Phase 1 — Foundation & Content System**.

## 1. Codex Web project

Connect Codex Web to:

`Sketch333/portfolio-website`

Use the `main` branch as the repository baseline. Codex must not implement directly on `main`; `AGENTS.md` requires the Superpowers isolated-worktree workflow.

## 2. Environment networking

The repository has not yet installed the Next.js toolchain. Phase 1 Task 1 therefore requires network access for npm packages, shadcn resources, and Playwright Chromium.

Enable internet access for the initial scaffold/install task. If you use an allowlist rather than broad temporary access, ensure the package/browser resources required by npm, shadcn, and Playwright are reachable.

No MongoDB, model-provider, Resend, Vercel, or other production secrets are required for Phase 1.

## 3. First Codex prompt

Paste this as the task prompt:

> Implement Phase 1 of this portfolio project completely. Start by reading `AGENTS.md`. If the approved planning Markdown files under `docs/superpowers/` are missing, run `python3 scripts/bootstrap-planning-docs.py` and do not continue unless all checksums verify. Then read the design spec, roadmap, and `docs/superpowers/plans/2026-09-08-portfolio-foundation-content-system.md` in full. Treat the design spec as the binding authority. Use the installed Superpowers workflow, including `superpowers:subagent-driven-development`, `superpowers:using-git-worktrees`, and test-driven development. Run the Phase 1 pre-flight consistency scan, execute every Phase 1 task, use a fresh implementer and task review for each task, resolve review findings before advancing, and run the whole-branch review at the end. Do not implement Phase 2–5. Do not invent missing portfolio facts. Do not merge, push to shared branches, deploy, publish, send email, write production data, or create paid resources without my explicit approval. When Phase 1 is complete and verified, stop and give me the branch/worktree state, commits, tests/build results, review findings, and any unresolved factual-content gaps.

## 4. Expected bootstrap sequence

Codex should effectively perform:

```text
Read AGENTS.md
    ↓
Restore planning docs if missing
python3 scripts/bootstrap-planning-docs.py
    ↓
Checksum verification succeeds
    ↓
Read design spec + roadmap + Phase 1 plan
    ↓
Use Superpowers worktree + SDD ledger
    ↓
Phase 1 Task 1 → review → commit
    ↓
Phase 1 Task 2 → review → commit
    ↓
...
    ↓
Whole-branch review
    ↓
STOP for human review
```

## 5. Planning payloads

`.planning-payload/` contains gzip-compressed/base64 text copies of the approved spec and implementation plans. `scripts/bootstrap-planning-docs.py` restores the exact Markdown documents and verifies each file against its approved SHA-256 hash.

Do not manually edit the payloads during Phase 1.

## 6. Phase boundary

Phase 1 should produce the working Next.js foundation/content system described by the approved plan. It must **not** jump ahead to the cinematic hero, flagship project interactions, semantic search, AI assistant, MongoDB retrieval, Resend delivery, or deployment.

After Phase 1 review, later phases are executed separately and in roadmap order.
