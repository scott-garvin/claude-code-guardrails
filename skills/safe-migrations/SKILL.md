---
name: safe-migrations
description: Use when changing a database schema or seed/lookup data - adding or altering tables, columns, indexes, constraints, stored procedures, functions, or one-time data fixes. Every change is authored as an idempotent forward migration with a matching reverse (rollback) migration, keeps each object's canonical source file authoritative, and is applied through the migration pipeline behind the production-write-gate, never by editing production directly. Triggers on schema change, migration, DDL, add/alter column or table or index, stored procedure, seed data, or one-time data fix.
---

# safe-migrations

Every schema change is reversible, idempotent, and applied through the pipeline. No one-way doors, no manual production edits.

## Rules

1. **Forward + reverse, always.** Author the migration and its rollback in the same change. If a change genuinely can't be reversed — a destructive data transformation — say so explicitly and get sign-off. Don't silently ship a one-way door.
2. **Idempotent DDL.** Guard every statement so re-running the migration is safe: `IF NOT EXISTS` on creates, existence checks before alters, no-op when already applied. Migrations get re-run more often than you expect — partial failures, replays, parallel environments.
3. **Canonical source stays authoritative.** When a migration changes an object (a table, a procedure, a view), update that object's source-of-truth file in the repo too, so the checked-in schema reflects reality. The migration is *how* it changed; the source file is *what it is now*.
4. **Never edit production directly.** Changes reach prod only through the migration pipeline, and applying them is gated (see `production-write-gate`).
5. **Verify the pair.** Before shipping, confirm the forward migration applies cleanly on a fresh database and the reverse returns it to the prior state.

## Rollback

A rollback you have never run is a guess, not a safety net. Run the reverse migration at least once against real schema before you rely on it. The moment you need it is the worst moment to discover it doesn't work.

## Enforcement

`scripts/check-migration-pairs.mjs` fails CI when a forward migration lacks a matching rollback — rule 1, in code rather than in good intentions.
