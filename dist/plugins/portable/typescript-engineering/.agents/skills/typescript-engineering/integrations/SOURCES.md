# Platform format sources

Consulted 2026-09-10. These document formats/commands; they do not establish successful loading of this package. Host policies and older versions may differ.

| Platform | Primary source | Applied contract |
| --- | --- | --- |
| Codex | Installed plugin-creator specification and validator; `codex plugin --help`, `codex plugin add --help` | `.codex-plugin/plugin.json`, skills directory, interface fields and marketplace-based install; local CLI 0.153.4 |
| Codex public documentation | [Plugins](https://developers.openai.com/codex/plugins/) | Redirected to ChatGPT Learn plugin docs; not used to infer undocumented CLI fields |
| Codex local skills | [Build skills](https://learn.chatgpt.com/docs/build-skills) | Repository discovery from `.agents/skills`; native skill installation is independent of plugin publisher metadata |
| Claude Code | [Plugin reference](https://code.claude.com/docs/en/plugins-reference) | `.claude-plugin/plugin.json`, skill discovery, plugin validation; local CLI 2.1.220 |
| Copilot | [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) | Root manifest, skills paths and local-directory install |
| Copilot skills | [Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Portable skill alternative across supported surfaces |
| Cursor | [Plugin reference](https://prod.cursor.com/docs/reference/plugins) and [extension API](https://prod.cursor.com/docs/extension-api) | Cursor manifest/skills discovery and local plugin directory |
| Antigravity | [Plugins](https://antigravity.google/docs/plugins) | Root marker manifest and workspace/global plugin directories; docs identified 2.12.2 |
| Antigravity skills | [Skills](https://antigravity.google/docs/skills) | Current `.agents/skills` convention; legacy `.agent/skills` compatibility |
| OpenCode | [Skills](https://opencode.ai/docs/skills/) and [plugins](https://opencode.ai/docs/plugins/) | On-demand skill discovery; distinguishes it from executable JS plugins |
| Gemini CLI | [Extension reference](https://geminicli.com/docs/extensions/reference/) and [building extensions](https://geminicli.com/docs/extensions/writing-extensions/) | `gemini-extension.json`, bundled skills and local install |
| Portable | [Agent Skills specification](https://agentskills.io/specification) | Named skill directory with frontmatter and relative resources |

No minimum host-version matrix was executed. Only local CLI versions actually queried are identified. Recheck primary documentation and test native loading before advertising a supported version range. License and publisher identity must come from the owner, not a scaffold default.

Repository organization and README presentation were informed by [Superpowers](https://github.com/obra/superpowers) and [wshobson/agents](https://github.com/wshobson/agents). These are examples, not platform specifications.
