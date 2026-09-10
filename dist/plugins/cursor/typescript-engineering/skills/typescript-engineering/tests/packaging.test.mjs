import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, readdir, lstat, realpath, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildPackages, createManifest, checkPackages } from '../scripts/package-plugins.mjs';

const sourceRoot = path.resolve(import.meta.dirname, '..');
const targets = JSON.parse(await readFile(new URL('../integrations/targets.json', import.meta.url)));
const metadata = { name: 'typescript-engineering', version: '0.1.0', author: 'Fixture Author' };

async function temporary(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'typescript-packaging-'));
  t.after(async () => {
    const resolved = await realpath(directory);
    const base = await realpath(os.tmpdir());
    assert.ok(path.relative(base, resolved).startsWith('typescript-packaging-'));
    await rm(resolved, { recursive: true });
  });
  return directory;
}

test('each plugin format uses its documented discovery contract', () => {
  for (const target of ['claude', 'copilot', 'cursor']) {
    assert.deepEqual(createManifest(target, metadata), {
      name: metadata.name, version: metadata.version,
      description: 'Practical TypeScript engineering with validated boundaries and evidence-based verification.',
      author: { name: metadata.author }, skills: './skills/',
    });
  }
  assert.deepEqual(createManifest('antigravity', metadata), { name: metadata.name });
  assert.deepEqual(createManifest('gemini', metadata), {
    name: metadata.name, version: metadata.version,
    description: 'Practical TypeScript engineering with validated boundaries and evidence-based verification.',
  });
  const codex = createManifest('codex', metadata);
  assert.equal(codex.author.name, metadata.author);
  assert.equal(codex.interface.developerName, metadata.author);
  assert.equal(codex.skills, './skills/');
  assert.ok(!('mcpServers' in codex));
  assert.ok(!('hooks' in codex));
});

test('publisher metadata reaches compatible manifests without adding unsupported fields', () => {
  const publisher = { ...metadata, homepage: 'https://github.com/bluenzzz/typescript-engineering',
    repository: 'https://github.com/bluenzzz/typescript-engineering', license: 'MIT',
    keywords: ['typescript', 'skills'] };
  for (const target of ['claude', 'copilot', 'cursor', 'codex']) {
    const manifest = createManifest(target, publisher);
    for (const key of ['homepage', 'repository', 'license', 'keywords']) {
      assert.deepEqual(manifest[key], publisher[key], `${target}: ${key}`);
    }
  }
  assert.deepEqual(createManifest('antigravity', publisher), { name: metadata.name });
  assert.equal(createManifest('gemini', publisher).homepage, undefined);
});

test('missing authorship blocks Codex packaging without inventing identity', () => {
  assert.throws(() => createManifest('codex', { ...metadata, author: undefined }), /author/i);
  assert.ok(!('author' in createManifest('claude', { ...metadata, author: undefined })));
});

test('built packages are self-contained, preserve canonical skill and work offline', async t => {
  const temporaryRoot = await temporary(t);
  const output = path.join(temporaryRoot, 'packages');
  await buildPackages({ sourceRoot, output, metadata, targets });
  const inventory = JSON.parse(await readFile(path.join(output, 'build-manifest.json'), 'utf8'));
  const original = await readFile(path.join(sourceRoot, 'SKILL.md'), 'utf8');
  for (const [target, config] of Object.entries(targets)) {
    const root = path.join(output, target, metadata.name);
    const skill = path.join(root, config.skillRoot);
    assert.equal(await readFile(path.join(skill, 'SKILL.md'), 'utf8'), original);
    for (const [relative, checksum] of Object.entries(inventory.sourceSha256)) {
      const actual = createHash('sha256').update(await readFile(path.join(skill, relative))).digest('hex');
      assert.equal(actual, checksum, `${target}: altered resource ${relative}`);
    }
    assert.equal((await lstat(skill)).isSymbolicLink(), false);
    const validation = spawnSync(process.execPath, ['scripts/validate.mjs'], { cwd: skill, encoding: 'utf8' });
    assert.equal(validation.status, 0, `${target}: ${validation.stderr}`);
    if (config.manifest) {
      const manifest = JSON.parse(await readFile(path.join(root, config.manifest), 'utf8'));
      assert.equal(manifest.name, metadata.name);
    }
    assert.ok(!(await readdir(skill)).includes('node_modules'));
    assert.ok(!(await readdir(path.join(skill, 'examples'))).includes('dist'));
  }
});

test('refuses an existing output before changing its files', async t => {
  const output = path.join(await temporary(t), 'packages');
  await mkdir(output);
  await writeFile(path.join(output, 'keep.txt'), 'user data');
  await assert.rejects(buildPackages({ sourceRoot, output, metadata, targets }), /exist/i);
  assert.equal(await readFile(path.join(output, 'keep.txt'), 'utf8'), 'user data');
});

test('rejects escaping target paths before writing output', async t => {
  const output = path.join(await temporary(t), 'packages');
  await assert.rejects(buildPackages({ sourceRoot, output, metadata,
    targets: { claude: { ...targets.claude, skillRoot: '../escape' } } }), /path|escape/i);
  await assert.rejects(lstat(output), { code: 'ENOENT' });
});

test('rejects unknown targets and invalid versions', () => {
  assert.throws(() => createManifest('unknown', metadata), /target/i);
  assert.throws(() => createManifest('codex', { ...metadata, version: 'latest' }), /version/i);
});

test('package verification detects modified exported resources', async t => {
  const output = path.join(await temporary(t), 'packages');
  await buildPackages({ sourceRoot, output, metadata, targets: { claude: targets.claude } });
  assert.equal((await checkPackages({ sourceRoot, output })).bundles, 1);
  await writeFile(path.join(output, 'claude/typescript-engineering/skills/typescript-engineering/SKILL.md'), 'Changed outside the canonical source');
  await assert.rejects(checkPackages({ sourceRoot, output }), /modified|stale/i);
});
