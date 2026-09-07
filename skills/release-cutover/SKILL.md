---
name: release-cutover
description: Use to run a production release or cutover. Treats a release as an ordered checklist where every step is reversible and gated - apply schema migrations through an error-halting pipeline, smoke-test on a staging target before it takes traffic, swap with the platform's mandatory restart, promote background workers in lockstep, and keep a rehearsed rollback for every step. Composes the safe-migrations and production-write-gate skills. Triggers on "cut the release", "ship to prod", deploy, slot swap, cutover, go-live, rollback.
---

# release-cutover

A release isn't an event, it's a checklist where every step can be undone. This skill composes `safe-migrations` (the schema changes) and `production-write-gate` (every mutating step is confirmed before it runs).

## The ordered sequence

1. **Migrations first, gated.** Apply forward migrations through the pipeline, behind an error gate that halts the release the moment one fails. (safe-migrations authored them with rollbacks; production-write-gate confirms applying them.)
2. **Smoke-test off to the side.** Verify on a staging target that isn't yet taking real traffic. A smoke test *after* the swap is an incident report, not a gate.
3. **Swap, then the mandatory restart.** Cut traffic over, then do the restart or warm-up step the platform actually requires. It's the step that's easiest to skip and quietly breaks the first requests.
4. **Promote the rest in lockstep.** Background workers and functions move with the app, never left a version behind the code that expects them.
5. **Rollback rehearsed, not hypothetical.** Every step above has a known reverse you've actually run. A release is only as safe as its least-tested rollback.

## Config wiring

A new setting is defined in every place that reads it, with a code-side default for the "not yet configured" window, so a half-deployed release never reads an empty config and behaves as though a feature is off when it isn't.
