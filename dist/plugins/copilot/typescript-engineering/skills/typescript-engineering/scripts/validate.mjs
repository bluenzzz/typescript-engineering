import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Deterministic package checks without installing a Markdown/YAML toolchain.
// Supports this package's flat plain-scalar frontmatter and inline file links.
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const required = ['SKILL.md', 'README.md', 'README.pt-BR.md', 'CONTRIBUTING.md',
  'references', 'examples', 'evaluations'];
for (const item of required) {
  try { await stat(path.join(root, item)); }
  catch { errors.push(`Missing required path: ${item}`); }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist', '.npm-cache'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
    else errors.push(`Unsupported file type: ${absolute}`);
  }
  return files;
}

let links = 0;
let markdown = 0;
const files = await walk(root);
for (const file of files) {
  if ((await stat(file)).size === 0) errors.push(`Empty file: ${file}`);
  if (!file.endsWith('.md')) continue;
  markdown++;
  const content = await readFile(file, 'utf8');
  if (content.includes('\uFFFD')) errors.push(`Invalid text encoding: ${file}`);
  // Ignore fenced snippets: directory diagrams and sample syntax are not links.
  const prose = content.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  for (const match of prose.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)) {
    const href = match[1];
    if (/^https?:\/\//.test(href)) continue;
    if (href.startsWith('#') || href.includes('#')) {
      errors.push(`Anchor links are outside this validator's supported format: ${file}: ${href}`);
      continue;
    }
    const target = path.resolve(path.dirname(file), decodeURIComponent(href));
    const relative = path.relative(root, target);
    if (path.isAbsolute(href) || relative.startsWith('..') || path.isAbsolute(relative)) {
      errors.push(`Link escapes package: ${file}: ${href}`);
      continue;
    }
    links++;
    try { await stat(target); }
    catch { errors.push(`Broken link: ${file}: ${href}`); }
  }
}

try {
  const skill = await readFile(path.join(root, 'SKILL.md'), 'utf8');
  const front = skill.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
  if (!front) throw new Error('SKILL.md needs YAML frontmatter');
  const fields = {};
  for (const line of front[1].split(/\r?\n/)) {
    const match = line.match(/^(name|description): ([^\r\n]+)$/);
    if (!match || Object.hasOwn(fields, match[1])) throw new Error(`Unsupported or duplicate frontmatter: ${line}`);
    if (/[:]\s|\s#|^[\[\]{}&*!|>'"%@`]/.test(match[2])) throw new Error(`Not a supported plain YAML scalar: ${line}`);
    fields[match[1]] = match[2];
  }
  if (!fields.name || fields.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.name)) errors.push('Invalid skill name');
  if (fields.name !== path.basename(root)) errors.push('Skill name must match directory name');
  if (!fields.description || fields.description.length > 1024) errors.push('Invalid description');
  if (skill.split('\n').length >= 500) errors.push('Core should remain below 500 lines');
} catch (error) { errors.push(error.message); }

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} files, ${markdown} Markdown files, ${links} relative file links; frontmatter OK.`);
}
