# Platform packages

The root skill is the single maintained source. The generator creates independent packages with complete relative resources and SHA-256 source inventory; no symlinks or vendor-specific instructions are added to the core. Generated copies are build output, not separately maintained forks.

## Build

For installation directly from GitHub, run `npx skills add bluenzzz/typescript-engineering` and select your assistant and scope. See the [skills CLI documentation](https://skills.sh/docs). The local installer below remains available for an existing checkout.

For direct skill installation from this repository, use `node scripts/install-skill.mjs --target codex --project ../my-app`, replacing the project path with an existing directory. Targets: codex, claude, copilot, cursor, antigravity, opencode and portable. This includes all relative resources and refuses an existing destination. The Codex plain skill does not require plugin author metadata. Gemini uses the extension route below.

To regenerate all eight distribution packages into a fresh directory:

```sh
node scripts/package-plugins.mjs --out dist/plugins-next
```

The generator reads Daniel Braga's author name, GitHub URLs, MIT license and keywords from `package.json`. Claude Code, Copilot, Cursor and Codex receive the supported publisher fields. Other formats keep their own manifest contracts; every bundle includes the project metadata and license. Use `node scripts/package-plugins.mjs --help` for options.

Default output is `dist/plugins/`. Existing output is refused to protect local changes; select a fresh directory with `--out dist/plugins-next` for another build. The generator does not install, publish, edit user profiles or register marketplaces. Preserve hidden manifest directories when copying/zipping. Every bundled skill includes the project's [MIT License](../LICENSE).

## Formats and use

Paths below are relative to `dist/plugins/`. Commands are for the source repository root. For a standalone extracted package, substitute its actual directory. Check your host version and policy before installation.

| Target | Artifact | Installation or use |
| --- | --- | --- |
| Codex | `dist/plugins/codex/typescript-engineering` | Use the project installer for a native skill, or register the plugin package in your intended marketplace before using its actual install selector. |
| Claude Code | `claude/typescript-engineering/.claude-plugin/plugin.json` | Session-local trial: `claude --plugin-dir ./dist/plugins/claude/typescript-engineering`. Invoke `/typescript-engineering:typescript-engineering`. |
| Copilot CLI | `copilot/typescript-engineering/plugin.json` | `copilot plugin install ./dist/plugins/copilot/typescript-engineering`. Check `copilot plugin list`. |
| Cursor | `cursor/typescript-engineering/.cursor-plugin/plugin.json` | Copy the complete plugin folder into `~/.cursor/plugins/local/` and inspect Customize → Plugins. |
| Antigravity | `antigravity/typescript-engineering/plugin.json` | Copy the plugin folder to `.agents/plugins/` in the target workspace, or `~/.gemini/config/plugins/` globally. |
| OpenCode | `opencode/typescript-engineering/.opencode/skills/typescript-engineering/` | Copy only the inner skill folder into the target project's `.opencode/skills/`. Ask OpenCode to use `typescript-engineering`. |
| Gemini CLI | `gemini/typescript-engineering/gemini-extension.json` | `gemini extensions install ./dist/plugins/gemini/typescript-engineering`, then restart. |
| Other Agent Skills hosts | `portable/typescript-engineering/.agents/skills/typescript-engineering/` | Copy the inner skill folder to the host's documented skill location. This is not a universal plugin manifest. |

For Copilot surfaces without plugin installation, use the portable skill in `.github/skills/typescript-engineering/`. OpenCode integration uses its native skill loader: its JavaScript plugin API is for executable extensions, unnecessary for this instruction bundle. No no-op hook is installed just to call it a plugin.

## Updating and removing

Edit the canonical source and regenerate into a fresh directory. Compare the build inventories and rerun checks before replacing an installed copy. Use host-specific update/reload/uninstall controls for installed plugins; for manually copied skills/plugins remove only the exact package directory you installed, preserving unrelated customization. Avoid installing the same skill through multiple routes in one host.

## Verification and sources

Run `npm run test:packaging`, `npm run validate`, `npm run typecheck`, `npm test` and `npm run check:packages`. Each exported skill carries a standalone validator and examples. The source checkout's package check compares the versioned bundles to canonical files; a standalone installed skill does not contain the sibling distribution tree. See [packaging results](RESULTS.md) for actual checks; successful generation is not native runtime verification. [Primary sources](SOURCES.md) record current format evidence.
