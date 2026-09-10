# Packaging verification

Checked 2026-09-10 on Node.js 24.18.0, npm 11.16.0 and TypeScript 5.9.3. Native generation and application activation are distinct.

The packages contain instructions and examples, without auto-running hooks, MCP servers or credentials. OpenCode and portable outputs are skill integrations rather than executable plugins. No public publication or user-profile installation is performed by the build script.

The test suite checks canonical content identity, complete relative links in isolated copies, discovery paths, manifest metadata, missing-author rejection, invalid targets/versions, path escape rejection and preservation of existing output. These checks do not substitute for an authenticated session in each host application.

## Executed

- `npm.cmd run test:packaging`: ten tests passed, including all eight formats using an explicitly labeled fixture author in temporary directories, project installation, preservation of existing instructions, overwrite refusal, symlink rejection and detection of modified distribution resources. Fixture packages were removed and are not distribution artifacts.
- `npm.cmd run typecheck`: passed, including negative public type contracts.
- `npm.cmd test`: ten invoice behavior tests passed.
- Package freshness verification compares canonical SHA-256 hashes with the recorded snapshot and bundled resources; it does not validate native host activation.
- `node scripts/package-plugins.mjs --targets claude,copilot,cursor,antigravity,opencode,gemini,portable`: seven actual author-free packages generated in `dist/plugins/`.
- `claude plugin validate ./dist/plugins/claude/typescript-engineering`: Claude Code 2.1.220 passed validation with one warning about omitted author information. Strict/warning-free validation is not claimed.
- `npm.cmd run validate`: package Markdown/frontmatter/link validation passed.
- README structure and Markdown links were inspected; no rendered GitHub browser preview was performed.
- `codex --version` and CLI plugin/marketplace help: inspected on Codex CLI 0.153.4; this is CLI syntax inspection, not plugin loading.

Codex production packaging requires an owner-approved author name. The generator deliberately refuses to fabricate it. The local Python Codex validator was not run because Python/PyYAML were unavailable; Node tests check the selected schema shape, not the full ingestion implementation. No host session, marketplace registration or profile installation was performed. Copilot, Cursor, Antigravity, OpenCode and Gemini integrations remain format-based, without live loading verification.
