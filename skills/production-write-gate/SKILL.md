---
name: production-write-gate
description: Use before running any operation that mutates a production system - a database write, a deploy or slot swap, a config or secret change, a destructive command (drop, delete, truncate, force-push), or a live third-party call that charges money or sends messages. The agent surfaces the exact operation, what it affects, and how to reverse it, then waits for explicit human confirmation in chat before executing. Read-only inspection never needs a gate. Triggers on prod write, deploy, slot swap, migration apply, delete/drop/truncate, config or secret change, or "run this against production".
---

# production-write-gate

The agent proposes; a human commits. Nothing mutates production without an explicit go.

## Rule

Before executing any operation that changes production state, stop and surface three things:

1. **Exactly what will run** — the command or the write, verbatim. Not a paraphrase.
2. **What it affects** — which environment, which data, how much of it.
3. **Whether it's reversible, and how** — the rollback, or a clear statement that there isn't one.

Then wait for explicit confirmation in chat. "Looks good, run it" is a gate. Silence is not a gate, and neither is your own confidence.

## Always gated

- Production database writes (including migrations being *applied*).
- Deploys, slot swaps, restarts, scaling changes.
- Config or secret changes.
- Anything destructive: `DROP`, `DELETE`, `TRUNCATE`, force-push, bulk update without a `WHERE`.
- Live third-party calls that charge money, send messages, or change external state.

## Never gated

Read-only inspection — reading logs, `SELECT` queries, listing resources, checking status, diffing. Move fast on reads; gate every write. The whole point is to make it safe to let an agent work quickly, by putting the brake in exactly one place.
