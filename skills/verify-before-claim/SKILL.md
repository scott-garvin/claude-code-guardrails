---
name: verify-before-claim
description: Use before reporting that any change, write, or fix succeeded. Confirm the result from an independent read rather than trusting the operation's own return value, know the specific ways a "success" lies (read-after-write lag, 200-but-not-persisted, wrote-a-different-field, 400-but-it-landed, permission-blocked verb that fails silently, green-by-skip test runs), and when the result genuinely cannot be verified, report "cannot determine, here is why" instead of a confident guess. Triggers on verifying a write, "did this work", an API or database mutation, "the change is done", or reporting a fix as complete.
---

# verify-before-claim

A call returning success is not proof the thing happened. Before you tell a human a change worked, verify it — and know how verification itself lies.

## Rule

Do not report success from the return value of the operation that made the change. Confirm it with an **independent read**, ideally through a different path than the write used. If the write and the read share the same faulty assumption, they will agree and both be wrong.

## The ways "success" lies

- **Read-after-write lag.** The write landed, but a read issued immediately after hits a replica or cache that hasn't caught up. You conclude it failed; it didn't. Re-read after a beat, or read from the primary.
- **`200` but not persisted.** The endpoint accepted the request and returned OK, but the record never committed (a swallowed downstream error, a rolled-back transaction). The status code describes the request, not the outcome.
- **Wrote a different field or record than intended.** The write succeeded — into the wrong column, the wrong row, the wrong tenant. A bare "it saved" tells you nothing about *what* saved. Read back the specific value you meant to set.
- **`400` but it landed anyway.** The response errored on a validation step that ran *after* the mutation. You back off assuming nothing happened; a partial write is now live.
- **Permission-blocked verb that fails silently.** The caller lacks rights to the write, but the API degrades to a no-op with a success-shaped response instead of a 403.
- **Green-by-skip.** A test run that discovered or executed zero tests is not a pass. Neither is one where the relevant suite self-skipped on a missing environment flag. Confirm the tests that cover the change actually ran.

## When you cannot verify

Say so, plainly:

> "I changed X. I could not verify it because Y. Here is what to check: Z."

Never upgrade an unverified change to "done." On a production system, a confident wrong "done" is more expensive than an honest "unverified" — it's the one that ships the incident.
