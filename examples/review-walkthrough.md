# Worked example: an invoice note table

This is an authored scenario, not a transcript of an observed Claude run.

Request: "Add a table for internal invoice notes in a disposable demo database. Prepare the migration and verification plan."

1. `safe-migrations` guides the agent to prepare the forward file, reverse file, and a review of data loss.
2. `build-test-truth` asks it to report the tests that actually ran, their exit status, and any missing checks.
3. CI runs the migration-pair script. Removing `001_invoice_note.down.sql` makes that command exit 1. An empty directory also fails.
4. A reviewer inspects both SQL files. The reverse drops all notes, so it is suitable only for this disposable example. A real migration may need an expand/contract release and a restore plan instead.
5. Before database deployment, apply the forward migration twice in a disposable PostgreSQL database, inspect the table, insert a fixture, and test the reverse. The supplied CI does not execute SQL and cannot claim those checks passed.
6. Production credentials and deployment approvals belong in the hosting platform or protected CI environment. A Markdown instruction alone cannot block a deployment.

Run the automated checks:

```sh
node --test
node scripts/check-migration-pairs.mjs examples/migrations
```

The first command tests the checker. The second checks that the example has a forward/rollback file pair. Neither evaluates SQL correctness, idempotence, recoverability, or an agent's behavior.
