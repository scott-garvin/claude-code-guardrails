# Claude Code Guardrails

Reusable [Claude Code](https://docs.claude.com/en/docs/claude-code) skills that let AI coding agents do real work on production systems without shipping subtly wrong changes.

Most "AI in engineering" tooling optimizes for speed. On a production system, speed is the easy part. The hard part is that an agent is *confidently wrong* in exactly the places that cost you: it misses a domain gotcha, misreads what a "successful" write actually did, runs a test suite that quietly executed nothing, or edits production directly because nothing stopped it.

The gap isn't "can an AI write code." It's "can an AI be trusted to work safely in *this* system." Closing that gap is engineering work. These skills are a starting point.

## Principles

The whole set runs on a few convictions:

1. **Verify before you claim.** A change isn't done because a call returned `200`. Confirm it from an independent read, and know the ways a "success" lies to you.
2. **When you can't verify, say so.** "Can't determine, here's why, review this" beats a confident wrong answer every time. An agent that guesses on a production system is a liability, not leverage.
3. **Every production write passes a human gate.** The agent proposes the exact operation; a human confirms before anything mutates prod.
4. **Every change is reversible.** Schema changes ship with a tested rollback. No one-way doors.

## Skills

Seven skills in three groups: **correctness** (don't trust a green light you can't explain), **safety** (nothing breaks production quietly), and **knowledge** (don't pay for the same lesson twice).

| Group | Skill | What it enforces |
| --- | --- | --- |
| Correctness | [`verify-before-claim`](skills/verify-before-claim/SKILL.md) | Confirm a change from an independent read; know the ways "success" lies; refuse to guess. |
| Correctness | [`build-test-truth`](skills/build-test-truth/SKILL.md) | A passing command isn't a passing suite; assert the tests covering the change actually ran. |
| Safety | [`production-write-gate`](skills/production-write-gate/SKILL.md) | Every operation that mutates production is surfaced and human-confirmed before it runs. |
| Safety | [`safe-migrations`](skills/safe-migrations/SKILL.md) | Every schema change is idempotent, ships with a tested rollback, and never touches prod directly. |
| Safety | [`release-cutover`](skills/release-cutover/SKILL.md) | A release is a gated, reversible checklist, with rollback rehearsed at every step. |
| Knowledge | [`knowledge-registry`](skills/knowledge-registry/SKILL.md) | Capture the gotchas that burned past investigations so they never cost time twice. |
| Knowledge | [`prod-error-triage`](skills/prod-error-triage/SKILL.md) | Start from the error source that's actually authoritative, not the dashboard that's silently empty. |

## Use

Copy the `skills/` directory into your project's `.claude/skills/`. Claude Code loads each skill by its `description` and applies it when the work matches. Adapt the specifics (your stack, your environments) to your project — the discipline is the portable part.

```
your-project/
  .claude/
    skills/
      verify-before-claim/SKILL.md
      build-test-truth/SKILL.md
      production-write-gate/SKILL.md
      safe-migrations/SKILL.md
      release-cutover/SKILL.md
      knowledge-registry/SKILL.md
      prod-error-triage/SKILL.md
```

`scripts/check-migration-pairs.mjs` is a small, dependency-free CI check that fails a build when a forward migration is missing its rollback — the `safe-migrations` rule, enforced in code:

```sh
node scripts/check-migration-pairs.mjs ./migrations
```

## Background

These come out of building and operating production platforms in regulated, money-handling domains (healthcare, fintech), largely solo, with heavy AI-agent leverage. The leverage only works because the guardrails do — an agent moving fast through a production system is an asset exactly to the degree that it can't quietly break it.

More on the work behind this: [scott-garvin.github.io](https://scott-garvin.github.io).

## License

MIT — see [LICENSE](LICENSE).
