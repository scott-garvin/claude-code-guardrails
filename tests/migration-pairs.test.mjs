import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const script = new URL('../scripts/check-migration-pairs.mjs', import.meta.url);
import { fileURLToPath } from 'node:url';
for (const [name, files, expected] of [
  ['matching pair', ['001.up.sql','001.down.sql'], 0],
  ['missing rollback', ['001.up.sql'], 1],
  ['empty directory', [], 1],
  ['rollback only', ['001.down.sql'], 1],
]) test(name, () => {
  const dir = mkdtempSync(join(tmpdir(),'migration-check-'));
  try {
    for (const f of files) writeFileSync(join(dir,f),'-- fixture');
    assert.equal(spawnSync(process.execPath,[fileURLToPath(script),dir]).status,expected);
  } finally { rmSync(dir,{recursive:true,force:true}); }
});
test('a directory cannot masquerade as a rollback file', () => {
  const dir=mkdtempSync(join(tmpdir(),'migration-check-'));
  try {
    writeFileSync(join(dir,'001.up.sql'),'-- fixture'); mkdirSync(join(dir,'001.down.sql'));
    assert.equal(spawnSync(process.execPath,[fileURLToPath(script),dir]).status,1);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
test('missing path fails',()=>assert.equal(spawnSync(process.execPath,[fileURLToPath(script),'does-not-exist']).status,1));
