# TypeScript Engineering

**Practical TypeScript expertise for your coding assistant.**

![TypeScript examples](https://img.shields.io/badge/examples-TypeScript_5.9.3-3178C6?logo=typescript&logoColor=white)
![Agent Skills](https://img.shields.io/badge/format-Agent_Skills-5B21B6)
![Framework independent](https://img.shields.io/badge/core-framework_independent-0F766E)
[![skills.sh](https://skills.sh/b/bluenzzz/typescript-engineering)](https://skills.sh/bluenzzz/typescript-engineering)

[Installation](integrations/README.md) · [Examples](examples/README.md) · [Contributing](CONTRIBUTING.md)

> Clear contracts. Validated boundaries. Proportionate architecture. Honest verification.
>
> One maintained skill for frontend, backend and libraries. Optional references load only when the task needs them.

## Quick start

Install from GitHub with the [skills CLI](https://skills.sh/docs):

```sh
npx skills add bluenzzz/typescript-engineering
```

Follow the prompts to choose your assistant and installation scope. On PowerShell with script execution disabled, use `npx.cmd`. The skills.sh directory tracks installations through this CLI; adding the badge alone does not register an installation or guarantee a ranking.

If you already cloned this repository, you can instead use its local installer from the repository root with an **existing project**:

```
node scripts/install-skill.mjs --target codex --project ../my-app
```

Replace `../my-app` with your project's path. Choose `codex`, `claude`, `copilot`, `cursor`, `antigravity`, `opencode` or `portable`. The helper uses Node.js 24 without installing dependencies. It copies the complete skill, preserves project instructions and refuses an existing installation. Global settings are unchanged.

Start a new assistant session in that project and ask:

```
Use typescript-engineering to review this TypeScript change.
Preserve the public API, follow project conventions, and report what you verified.
```

Confirm that the assistant discovered the skill and can open its references. File installation alone does not prove host activation.

<details>
<summary><strong>Prefer a plugin or a Gemini CLI extension?</strong></summary>

From this repository's root:

```
# Claude Code: load for this session
claude --plugin-dir ./dist/plugins/claude/typescript-engineering

# Copilot CLI: install a local plugin
copilot plugin install ./dist/plugins/copilot/typescript-engineering

# Gemini CLI: install the extension, then restart
gemini extensions install ./dist/plugins/gemini/typescript-engineering
```

In Claude Code, invoke `/typescript-engineering:typescript-engineering`. See the [platform guide](integrations/README.md) for Cursor, Antigravity, updates and removal. Choose one route per host to avoid duplicates.

</details>

## Choose your assistant

| Assistant | Available route | Project skill location |
| --- | --- | --- |
| **Codex** | Native skill or plugin package for marketplace registration | `.agents/skills/typescript-engineering/` |
| **Claude Code** | Plugin or native skill | `.claude/skills/typescript-engineering/` |
| **GitHub Copilot** | CLI plugin; native skill on supported surfaces | `.github/skills/typescript-engineering/` |
| **Cursor** | Plugin or native skill | `.cursor/skills/typescript-engineering/` |
| **Antigravity** | Plugin or native skill | `.agents/skills/typescript-engineering/` |
| **OpenCode** | Native skill; no JavaScript plugin required | `.opencode/skills/typescript-engineering/` |
| **Gemini CLI** | Extension with a bundled skill | Extension command above |
| **Other assistants** | Agent Skills or manual attachment | Follow the host's documentation |

**Verification status:** automated packaging and installer checks pass. Native skill discovery and reference loading were checked in Codex. Plugin activation across hosts has not been tested. See [actual results](integrations/RESULTS.md).

## What it helps with

| Area | Expected behavior |
| --- | --- |
| **Types and contracts** | Useful inference, narrowing, discriminated unions and purposeful generics. |
| **Input and security** | Runtime validation, resource authorization and protection of sensitive data. |
| **Configuration and modules** | Installed-version checks and alignment between TypeScript, ESM/CommonJS, runtime and build. |
| **Architecture and UI** | Existing conventions, cohesive responsibilities, composition and explicit UI states. |
| **Performance** | Separate runtime from compiler cost; measure before claiming a gain. |
| **Verification** | Relevant behavior tests and an exact account of what ran and what remains uncertain. |
| **Optional E2E** | Proportionate test-layer selection, critical journeys, stable tests and honest execution evidence. See the [E2E guide](references/e2e.md). |

The assistant distinguishes language behavior, contextual recommendations and project conventions. It responds in your language. A small fix should remain a small fix.

## How it works

1. **Understand** requirements, code, versions and constraints.
2. **Consult** only the references relevant to the task.
3. **Implement** the simplest adequate solution, preserving public contracts.
4. **Review** invalid input, missing states, authorization and unnecessary complexity.
5. **Verify** with available checks, correct findings and report evidence and limits.

Hosts discover the skill through its name and description. Explicit invocation helps when automatic selection does not happen. This focused workflow needs no session-start hook, MCP server or mandatory subagent.

## Try these tasks

```
Validate this unknown API response before it reaches the billing calculation.
Improve this legacy any boundary without enabling strict across the entire project.
Investigate this ESM/CommonJS error using the installed compiler and runtime.
Review this reusable table: which props represent unrelated responsibilities?
The endpoint is slow. Propose measurements before changing its implementation.
```

[Executable examples](examples/README.md) demonstrate validation, owner/tenant authorization, errors and public type contracts. [Twelve evaluation scenarios](evaluations/scenarios.md) exercise decisions under realistic constraints, including optional E2E guidance. The guidance reuses project tooling; this repository does not install or run a browser E2E suite.

## Repository map

```
SKILL.md                  Core instructions — the maintained source
references/               Engineering guides and source register
examples/                 Complete example and behavior/type tests
evaluations/              Scenarios and recorded observations
integrations/             Host formats, installation and verification
scripts/                  Validation, project installation and packaging
tests/                    Packaging and installer tests
dist/plugins/             Versionable distribution copies generated from source
```

Edit the source, not each distribution copy. Consult the [platform sources](integrations/SOURCES.md) when updating integrations.

## Verify and maintain

```
npm ci --ignore-scripts
npm run validate
npm run typecheck
npm test
npm run test:packaging
npm run check:packages
```

On PowerShell with script execution disabled, use `npm.cmd`. `npm test` builds and runs behavior tests; typechecking includes negative contracts. `check:packages` detects stale snapshots or modified exported resources.

Generate a fresh distribution for all eight targets:

```
node scripts/package-plugins.mjs --out dist/plugins-next
```

The generator refuses existing output. Review the artifacts before replacing the versioned `dist/plugins/` tree. `dist/plugins-next/` remains ignored; `dist/plugins/` is allowed by Git. Publisher metadata is maintained in `package.json`: Daniel Braga, the GitHub repository, MIT license and discovery keywords.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Skill is not listed | Project location, new session and host skill settings/policies. |
| References cannot be read | Copy the complete folder, not only `SKILL.md`. |
| Duplicate entries | Keep a single installation route per host/project. |
| Installer refuses a folder | Review the existing installation before replacing it. |
| Package check reports stale files | Regenerate from source and review distribution changes. |
| No browser or terminal | Attach instructions and references manually; mark checks as not run. |

## Contributing and limits

See [CONTRIBUTING.md](CONTRIBUTING.md) for changes, source updates and evaluation. Official language, runtime and security references are recorded with dates in the [source register](references/sources.md).

This is engineering guidance, not a security audit or correctness guarantee. The example does not include production HTTP, database or identity-provider integration. No external publication or public marketplace listing has been performed.

## License

[MIT](LICENSE) © 2026 Daniel Braga.
