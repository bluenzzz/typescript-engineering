import { mkdir, lstat, realpath, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectFiles } from './package-plugins.mjs';

const locations = {
  codex: '.agents/skills', claude: '.claude/skills', copilot: '.github/skills',
  cursor: '.cursor/skills', antigravity: '.agents/skills', opencode: '.opencode/skills',
  portable: '.agents/skills',
};

export async function installSkill({ sourceRoot, project, target }) {
  if (!Object.hasOwn(locations, target)) throw new Error(`Unknown skill target: ${target}`);
  const root = await realpath(project);
  if (!(await lstat(root)).isDirectory()) throw new Error('Project must be an existing directory');
  const source = await realpath(sourceRoot);
  const destination = path.join(root, locations[target], 'typescript-engineering');
  if (destination === source) throw new Error('Destination is the source skill');
  // Inspect every existing ancestor before any write; never traverse a junction/symlink.
  let ancestor = root;
  for (const part of [...locations[target].split('/'), 'typescript-engineering']) {
    ancestor = path.join(ancestor, part);
    try {
      const info = await lstat(ancestor);
      if (info.isSymbolicLink()) throw new Error(`Refusing symlink destination: ${ancestor}`);
      if (!info.isDirectory()) throw new Error(`Destination is not a directory: ${ancestor}`);
      if (ancestor === destination) throw new Error(`Skill already exists: ${destination}. Review it before replacing.`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const files = await collectFiles(source);
  await mkdir(path.dirname(destination), { recursive: true });
  await mkdir(destination);
  for (const relative of files) {
    const output = path.join(destination, relative);
    await mkdir(path.dirname(output), { recursive: true });
    await copyFile(path.join(source, relative), output);
  }
  return destination;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/install-skill.mjs --target codex|claude|copilot|cursor|antigravity|opencode|portable --project PATH\n' +
      'Copies the complete skill into an existing project. No global settings, dependencies or marketplaces are changed. Existing skills are refused.');
    return;
  }
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    if (!['--project', '--target'].includes(args[index]) || !args[index + 1] || options[args[index]]) throw new Error('Provide --target and --project once');
    options[args[index]] = args[index + 1];
  }
  if (!options['--project'] || !options['--target']) throw new Error('--project and --target are required');
  const installed = await installSkill({ sourceRoot: fileURLToPath(new URL('..', import.meta.url)),
    project: options['--project'], target: options['--target'] });
  console.log(`Installed skill files: ${installed}\nStart a new host session in that project and confirm skill discovery. Native activation has not been verified by this script.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
