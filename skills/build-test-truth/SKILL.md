---
name: build-test-truth
description: Use when building a project, running its tests, or reasoning about a CI result. A passing command is not a passing suite. Knows the "green-by-skip" traps - a run that discovered or executed zero tests, a suite that self-skipped on a missing environment flag, a tool/flag combination that reports success while running nothing, or the wrong test project running - and applies an execution gate that asserts the tests actually covering the change ran and passed. Triggers on build, compile, run the tests, CI, "the tests pass", vstest/xunit/jest/pytest, green build.
---

# build-test-truth

Green is a claim, not a fact. A build or test command can report success while running nothing that matters.

## The green-by-skip traps

- **Zero tests discovered.** The runner started, found no tests (a bad filter, a misconfigured adapter, a path typo), and exited 0. Zero failures is not a pass.
- **Self-skipping suites.** Environment-gated tests that silently skip when a flag or dependency is absent report green having asserted nothing. The suite you cared about never ran.
- **False-green runners.** Some tool and flag combinations report success while executing nothing. Know the ones in your stack; treat an unexpectedly instant, quiet pass as suspicious.
- **Wrong project ran.** The change lives in one test project; CI exercised another. Both green, nothing covered.

## The execution gate

Before trusting green, confirm a nonzero count of the tests that cover *this change* actually executed. If you can't point to the specific tests that ran and passed for the change you made, you don't have a pass. You have an absence of failure, which is not the same thing.

## Know which suite owns the change

Map the change to the test project or area that covers it, and run that. "The build is green" without knowing what it exercised is noise.
