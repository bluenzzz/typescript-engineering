import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, realpath, rm, symlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { installSkill } from '../scripts/install-skill.mjs';

const sourceRoot = path.resolve(import.meta.dirname, '..');
async function project(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'typescript-install-'));
  t.after(async () => {
    const absolute = await realpath(directory);
    const base = await realpath(os.tmpdir());
    assert.ok(path.relative(base, absolute).startsWith('typescript-install-'));
    await rm(absolute, { recursive: true });
  });
  return directory;
}

test('Codex project install is complete and preserves existing project settings', async t => {
  const target = await project(t);
  await writeFile(path.join(target, 'AGENTS.md'), 'Existing project instructions');
  const installed = await installSkill({ sourceRoot, project: target, target: 'codex' });
  assert.equal(installed, path.join(target, '.agents/skills/typescript-engineering'));
  assert.equal(await readFile(path.join(installed, 'SKILL.md'), 'utf8'), await readFile(path.join(sourceRoot, 'SKILL.md'), 'utf8'));
  assert.equal(await readFile(path.join(target, 'AGENTS.md'), 'utf8'), 'Existing project instructions');
  const result = spawnSync(process.execPath, ['scripts/validate.mjs'], { cwd: installed, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  await assert.rejects(installSkill({ sourceRoot, project: target, target: 'codex' }), /already exists/i);
});

test('OpenCode installs into its native skill directory', async t => {
  const target = await project(t);
  assert.equal(await installSkill({ sourceRoot, project: target, target: 'opencode' }),
    path.join(target, '.opencode/skills/typescript-engineering'));
});

test('unknown targets and symlinked configuration directories are rejected', async t => {
  const target = await project(t);
  await assert.rejects(installSkill({ sourceRoot, project: target, target: '../escape' }), /target/i);
  const outside = path.join(target, 'other');
  await mkdir(outside);
  await symlink(outside, path.join(target, '.agents'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(installSkill({ sourceRoot, project: target, target: 'codex' }), /symlink/i);
});
