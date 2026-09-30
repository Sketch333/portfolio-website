# Task 5: Scheduler system walkthrough

Base: `8957719`. Branch: `feat/phase-2-home-project-experience`.

## Delivered

- Added a deterministic constraints → conflicts → resolved interaction with semantic state text, keyboard-operable buttons, and an HTML timetable. The content explicitly labels fictional course codes and disclaims live solver execution.
- Added a server-rendered fallback with the full three-step explanation and resolved timetable. The small loader imports the interactive module only after the reader opts in.
- Wired the scheduler demo into the shared case study by presentation kind. Other project demos remain absent until their own tasks.
- Prevented false and empty-string demo props from creating an empty Interactive Demonstration section.

## Evidence

- RED: the focused scheduler test failed because the demo module did not exist (`task-5-red.log`).
- GREEN: focused scheduler test passed (`task-5-green.log`); case-study guard test passed (`task-5-case-study.log`).
- Final full unit suite: 13 files, 53 tests passed (`task-5-unit-final.log`). Typecheck and lint passed (`task-5-typecheck.log`, `task-5-lint.log`).
- Browser routes: 8 tests passed, including no-JavaScript content, responsive overflow, and light/dark Axe scan (`task-5-e2e.log`). Additional scheduler browser interaction passed (`task-5-interaction-e2e.log`).
- Production build passed and prerendered the scheduler route (`task-5-build.log`).

The example is explanatory only; it does not invoke the production CP-SAT solver or claim that these assignments were real university output. No project metrics or canonical MDX facts changed.

## Spec review correction

Added the design spec's explicit CP-SAT scheduling progress and capacity/schedule states. The progress stage names an illustrative input → constraint → feasible-assignment sequence, with no simulated runtime or solver claim. Fictional enrollment and room capacities appear in the resolved state and table. The server fallback carries the same explanation. RED tests for both surfaces are in `task-5-fix-red.log`; focused GREEN is in `task-5-fix-green.log`. Final checks: 54 unit tests, typecheck, lint, two relevant browser tests (interactive and no-JavaScript), and production build passed in `task-5-fix-*.log`. An initial lint run overlapped Playwright's transient `test-results` directory and hit ENOENT; its sequential rerun passed.
