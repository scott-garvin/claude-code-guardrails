# Claude Code Guardrails

Reusable instruction files for Claude Code, plus a small migration-file check. They guide review and verification; they do not grant permissions or guarantee safe model behavior.

[Worked example](examples/review-walkthrough.md) � [CI checks](https://github.com/scott-garvin/claude-code-guardrails/actions/workflows/ci.yml)

## What is actually enforced

| Layer | What it does | What it cannot establish |
| --- | --- | --- |
| Skill Markdown | Describes expected agent behavior | Cannot prevent commands or guarantee compliance |
| Migration-pair script | Exits nonzero for missing pairs, missing directories, or no forward files | Does not execute or validate SQL |
| GitHub Actions | Runs the checker tests and example check | Does not block merges unless repository rules require it |
| External permissions and deployment approvals | Restrict access when configured in your environment | Not installed or configured by copying these skills |

## Principles

The whole set runs on a few convictions:

1. **Verify before you claim.** A change isn't done because a call returned `200`. Confirm it from an independent read, and know the ways a "success" lies to you.
2. **When you can't verify, say so.** "Can't determine, here's why, review this" beats a confident wrong answer every time. An agent that guesses on a production system is a liability, not leverage.
3. **Every production write passes a human gate.** The agent proposes the exact operation; a human confirms before anything mutates prod.
4. **Plan recovery before release.** Test rollback where possible; document irreversible data changes and a restore or forward-repair plan.

## Skills

Seven skills in three groups: **correctness** (don't trust a green light you can't explain), **safety** (nothing breaks production quietly), and **knowledge** (don't pay for the same lesson twice).

| Group | Skill | Guidance it provides |
| --- | --- | --- |
| Correctness | [`verify-before-claim`](skills/verify-before-claim/SKILL.md) | Confirm a change from an independent read; know the ways "success" lies; refuse to guess. |
| Correctness | [`build-test-truth`](skills/build-test-truth/SKILL.md) | A passing command isn't a passing suite; assert the tests covering the change actually ran. |
| Safety | [`production-write-gate`](skills/production-write-gate/SKILL.md) | Every operation that mutates production is surfaced and human-confirmed before it runs. |
| Safety | [`safe-migrations`](skills/safe-migrations/SKILL.md) | Every schema change is idempotent, ships with a tested rollback, and never touches prod directly. |
| Safety | [`release-cutover`](skills/release-cutover/SKILL.md) | A release is a gated, reversible checklist, with rollback rehearsed at every step. |
| Knowledge | [`knowledge-registry`](skills/knowledge-registry/SKILL.md) | Capture the gotchas that burned past investigations for later investigations. |
| Knowledge | [`prod-error-triage`](skills/prod-error-triage/SKILL.md) | Start from the error source that's actually authoritative, not the dashboard that's silently empty. |

## Use

Copy the `skills/` directory into your project's `.claude/skills/`. The `description` tells Claude Code when a skill is relevant; automatic selection is not guaranteed. Adapt the specifics (your stack, your environments) to your project — the discipline is the portable part.

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

`scripts/check-migration-pairs.mjs` is a small, dependency-free CI check that fails a build when a forward migration is missing its rollback — the file-pair requirement checked in code (not SQL rollback safety):

```sh
node scripts/check-migration-pairs.mjs ./migrations
```

## Verify locally

```sh
node --test
node scripts/check-migration-pairs.mjs examples/migrations
```

The runnable example and its limits are explained in [the walkthrough](examples/review-walkthrough.md). These public files use generic examples and contain no client-specific procedures.

Claude Code's `.claude/skills/` location and skill loading are product-specific. The review practices can be adapted to another agent, but copying these files does not install its hooks, permissions, or CI settings. Check the agent's documentation before adapting the integration.

[Portfolio](https://scott-garvin.github.io/)

## License

MIT — see [LICENSE](LICENSE).
