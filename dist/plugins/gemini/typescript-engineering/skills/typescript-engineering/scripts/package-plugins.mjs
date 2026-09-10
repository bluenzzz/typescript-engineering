import { mkdir, readFile, readdir, lstat, realpath, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const description = 'Practical TypeScript engineering with validated boundaries and evidence-based verification.';
const supported = new Set(['codex', 'claude', 'copilot', 'cursor', 'antigravity', 'opencode', 'gemini', 'portable']);
const directories = ['references', 'examples', 'evaluations', 'scripts', 'tests', 'integrations'];
const rootFiles = ['SKILL.md', 'README.md', 'CONTRIBUTING.md', 'LICENSE', 'package.json', 'package-lock.json', '.gitignore'];
const excluded = new Set(['node_modules', 'dist', '.git', '.npm-cache']);

function checkMetadata(metadata) {
  if (metadata.name !== 'typescript-engineering') throw new Error('Unsupported package name');
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(metadata.version)) {
    throw new Error('Package version must be a stable numeric semver');
  }
  if (metadata.author !== undefined && (typeof metadata.author !== 'string' || !metadata.author.trim())) {
    throw new Error('Author must be a nonempty string when provided');
  }
}

export function createManifest(target, metadata) {
  checkMetadata(metadata);
  if (!supported.has(target)) throw new Error(`Unknown target: ${target}`);
  if (target === 'portable' || target === 'opencode') return null;
  if (target === 'antigravity') return { name: metadata.name };
  const base = { name: metadata.name, version: metadata.version, description };
  if (target === 'gemini') return base;
  if (metadata.author) base.author = { name: metadata.author };
  for (const key of ['homepage', 'repository', 'license', 'keywords']) {
    if (metadata[key] !== undefined) base[key] = metadata[key];
  }
  base.skills = './skills/';
  if (target === 'codex') {
    if (!metadata.author) throw new Error('Codex packaging requires an author; supply --author with the owner-approved name.');
    base.interface = {
      displayName: 'TypeScript Engineering', shortDescription: 'Practical TypeScript engineering',
      longDescription: description, developerName: metadata.author,
      category: 'Productivity', capabilities: [],
      defaultPrompt: ['Use typescript-engineering to review this TypeScript change.'],
    };
  }
  return base;
}

function safeRelative(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') ||
      path.posix.isAbsolute(value) || /^[a-z]:/i.test(value) ||
      value.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`Unsafe package path: ${value}`);
  }
  return value;
}

export async function collectFiles(sourceRoot) {
  const files = [];
  async function visit(relative) {
    const info = await lstat(path.join(sourceRoot, relative));
    if (info.isSymbolicLink()) throw new Error(`Source symlinks are not packaged: ${relative}`);
    if (info.isDirectory()) {
      for (const entry of (await readdir(path.join(sourceRoot, relative))).sort()) {
        if (!excluded.has(entry)) await visit(`${relative}/${entry}`);
      }
    } else if (info.isFile()) files.push(relative);
    else throw new Error(`Unsupported source file: ${relative}`);
  }
  for (const relative of [...rootFiles, ...directories]) await visit(relative);
  return files.sort();
}

export async function buildPackages({ sourceRoot, output, metadata, targets }) {
  checkMetadata(metadata);
  sourceRoot = await realpath(sourceRoot);
  output = path.resolve(output);
  // Fail closed: a build never merges with or deletes an existing directory.
  try { await lstat(output); throw new Error(`Output already exists: ${output}. Choose a fresh output directory.`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const relativeOutput = path.relative(sourceRoot, output);
  if (relativeOutput === '' || directories.some(dir => relativeOutput === dir || relativeOutput.startsWith(`${dir}${path.sep}`))) {
    throw new Error('Output cannot overlap a packaged source directory');
  }
  const definitions = Object.entries(targets).map(([target, config]) => {
    if (!supported.has(target)) throw new Error(`Unknown target: ${target}`);
    safeRelative(target);
    safeRelative(config.skillRoot);
    if (config.manifest) safeRelative(config.manifest);
    const manifest = createManifest(target, metadata);
    if (Boolean(manifest) !== Boolean(config.manifest)) throw new Error(`Manifest mismatch: ${target}`);
    if (!config.skillRoot.endsWith('/typescript-engineering')) throw new Error('Skill directory must match its name');
    return { target, config, manifest };
  });
  if (!definitions.length) throw new Error('Select at least one target');
  const files = await collectFiles(sourceRoot);
  const checksums = {};
  for (const relative of files) {
    checksums[relative] = createHash('sha256').update(await readFile(path.join(sourceRoot, relative))).digest('hex');
  }
  await mkdir(path.dirname(output), { recursive: true });
  await mkdir(output);
  const bundles = [];
  for (const { target, config, manifest } of definitions) {
    const root = path.join(output, target, metadata.name);
    const skill = path.join(root, config.skillRoot);
    for (const relative of files) {
      const destination = path.join(skill, relative);
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(path.join(sourceRoot, relative), destination);
    }
    if (manifest) {
      const destination = path.join(root, config.manifest);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, JSON.stringify(manifest, null, 2) + '\n');
    }
    await writeFile(path.join(root, 'README.md'),
      `# TypeScript Engineering — ${target}\n\nGenerated ${config.kind} package, version ${metadata.version}.\n\n` +
      `Read [installation instructions](${config.skillRoot}/integrations/README.md).\n\n` +
      `The [canonical skill](${config.skillRoot}/SKILL.md) and all its relative resources are bundled. ` +
      `No runtime hooks, remote services or credentials are included. ` +
      `A generated package is not proof of successful loading in the host application.\n\n` +
      `Licensed under the [MIT License](${config.skillRoot}/LICENSE).\n`);
    bundles.push({ target, kind: config.kind, path: `${target}/${metadata.name}`, skillRoot: config.skillRoot });
  }
  await writeFile(path.join(output, 'build-manifest.json'), JSON.stringify({
    name: metadata.name, version: metadata.version, bundles, sourceSha256: checksums,
  }, null, 2) + '\n');
  return bundles;
}

export async function checkPackages({ sourceRoot, output }) {
  const inventory = JSON.parse(await readFile(path.join(output, 'build-manifest.json'), 'utf8'));
  const files = await collectFiles(sourceRoot);
  const recorded = Object.keys(inventory.sourceSha256).sort();
  if (JSON.stringify(files) !== JSON.stringify(recorded)) throw new Error('Stale package file inventory; regenerate the packages.');
  const hashes = {};
  for (const relative of files) {
    hashes[relative] = createHash('sha256').update(await readFile(path.join(sourceRoot, relative))).digest('hex');
    if (hashes[relative] !== inventory.sourceSha256[relative]) throw new Error(`Stale source snapshot: ${relative}`);
  }
  if (!Array.isArray(inventory.bundles) || !inventory.bundles.length) throw new Error('No packages recorded');
  for (const bundle of inventory.bundles) {
    safeRelative(bundle.path);
    safeRelative(bundle.skillRoot);
    for (const relative of files) {
      const value = await readFile(path.join(output, bundle.path, bundle.skillRoot, relative));
      if (createHash('sha256').update(value).digest('hex') !== hashes[relative]) {
        throw new Error(`Modified package resource: ${bundle.target}/${relative}`);
      }
    }
  }
  return { bundles: inventory.bundles.length, files: files.length };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/package-plugins.mjs [--check] [--author NAME] [--targets codex,claude,...] [--out DIRECTORY]\n' +
      'Defaults: all eight targets, dist/plugins. Output must not exist. Builds files only; does not install or publish.');
    return;
  }
  const check = args.includes('--check');
  if (check) args.splice(args.indexOf('--check'), 1);
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (!['--author', '--targets', '--out'].includes(key) || !args[index + 1] || args[index + 1].startsWith('--') || options[key]) {
      throw new Error(`Invalid or duplicate argument: ${key}`);
    }
    options[key] = args[index + 1];
  }
  const sourceRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
  if (check) {
    if (options['--targets'] || options['--author']) throw new Error('--check accepts only --out');
    const result = await checkPackages({ sourceRoot, output: options['--out'] ?? path.join(sourceRoot, 'dist/plugins') });
    console.log(`Verified ${result.bundles} packages against ${result.files} canonical source files.`);
    return;
  }
  const pkg = JSON.parse(await readFile(path.join(sourceRoot, 'package.json'), 'utf8'));
  const allTargets = JSON.parse(await readFile(path.join(sourceRoot, 'integrations/targets.json'), 'utf8'));
  const selected = options['--targets'] ? options['--targets'].split(',') : Object.keys(allTargets);
  const targets = {};
  for (const key of selected) {
    if (!Object.hasOwn(allTargets, key) || Object.hasOwn(targets, key)) throw new Error(`Unknown or duplicate target: ${key}`);
    targets[key] = allTargets[key];
  }
  const author = options['--author'] ?? (typeof pkg.author === 'string' ? pkg.author : pkg.author?.name);
  const bundles = await buildPackages({ sourceRoot, output: options['--out'] ?? path.join(sourceRoot, 'dist/plugins'),
    metadata: { name: pkg.name, version: pkg.version, ...(author ? { author } : {}),
      homepage: pkg.homepage, repository: pkg.repository, license: pkg.license, keywords: pkg.keywords }, targets });
  console.log(`Built ${bundles.length} packages: ${bundles.map(bundle => bundle.target).join(', ')}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
