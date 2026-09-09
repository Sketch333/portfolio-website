# Task 2 report: shared content types and validation schemas

## RED

Command:

```text
npm run test -- tests/unit/content/frontmatter.test.ts
```

Result: failed as intended before implementation. Vitest reported one failed suite with zero tests because `@/lib/content/frontmatter` could not be resolved.

## GREEN

Commands and results:

```text
npm run test -- tests/unit/content/frontmatter.test.ts
# Test Files  1 passed (1), Tests  7 passed (7)

npm run test
# Test Files  1 passed (1), Tests  7 passed (7)

npm run typecheck
# exit code 0

npm run lint
# exit code 0
```

## Changed files

- `types/content.ts` — shared project, blog post, experience, and project-tier types.
- `lib/content/frontmatter.ts` — Zod frontmatter schemas with defaults and HTTP(S)-only public URLs.
- `tests/unit/content/frontmatter.test.ts` — valid records, required dates, slug/date/URL rejection, and conservative defaults.
- `package.json` — removed `--passWithNoTests` from the unit test script.

## Concerns

- `body` is required on the shared record types and intentionally remains outside frontmatter validation; Task 3 content loaders will combine validated metadata with body content.
- Browser smoke was not rerun because the Phase 1 plan intentionally keeps it RED until Task 7.
