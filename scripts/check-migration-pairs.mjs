#!/usr/bin/env node
// check-migration-pairs.mjs
//
// Fails (exit 1) if any forward migration (`*.up.sql`) is missing its matching
// rollback (`*.down.sql`). Enforces the `safe-migrations` rule "forward + reverse,
// always" in CI, with zero dependencies.
//
// Usage:  node scripts/check-migration-pairs.mjs [migrationsDir]   (default: ./migrations)

import { readdirSync } from "node:fs";

const dir = process.argv[2] ?? "migrations";

let files;
try {
  files = readdirSync(dir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name);
} catch {
  console.error(`migrations directory not found: ${dir}`);
  process.exit(1);
}

const present = new Set(files);
const forward = files.filter((f) => f.endsWith(".up.sql"));
const orphans = forward.filter((f) => !present.has(f.replace(/\.up\.sql$/, ".down.sql")));

if (!forward.length) {
  console.error("No forward migrations found; refusing a vacuous success.");
  process.exit(1);
}

if (orphans.length) {
  console.error("Forward migrations missing a matching .down.sql rollback:\n");
  for (const f of orphans) console.error(`  - ${f}`);
  console.error("\nEvery schema change must ship with a rollback (safe-migrations skill).");
  process.exit(1);
}

console.log(`OK: ${forward.length} migration(s), each with a matching rollback.`);
