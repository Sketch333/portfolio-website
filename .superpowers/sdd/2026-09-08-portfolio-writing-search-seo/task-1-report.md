# Phase 3 Task 1 report

Implemented launch editorial metadata on `BlogPostRecord` and `blogFrontmatterSchema`: required `category` (`technical` or `build-journal`) and `excerpt`, plus optional site-relative `coverImage` and kebab-case `relatedProjectSlugs`. `publishedAt` is optional per the user's clarification that the eight migrated articles have no verified publication dates; when provided it remains a strict ISO calendar date. Existing `published` and `featured` defaults are retained.

Updated date sorting and date rendering so undated posts show no date, while dated posts remain newest-first. Updated valid MDX test fixtures with required metadata without changing their date-validation purpose.

Validation: `npm run test -- tests/unit/content/frontmatter.test.ts tests/unit/content/loaders.test.ts` passed (23 tests); `npm run typecheck` passed.

User ruling: omit displayed publication dates for the eight migrated Canva articles because original dates are unavailable. No other concerns.
