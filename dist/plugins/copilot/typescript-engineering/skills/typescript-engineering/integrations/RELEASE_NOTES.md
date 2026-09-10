# v0.2.0 — Codex Plugin and Publisher Metadata

## Added

- Codex plugin distribution, alongside the existing native skill installation.
- Publisher metadata for Claude Code, Codex, Copilot and Cursor: Daniel Braga, GitHub homepage and repository, MIT license and discovery keywords.
- Installation instructions using `npx skills add bluenzzz/typescript-engineering` and a skills.sh badge.
- Regression coverage for publisher metadata in compatible manifests.

## Updated

- Regenerated all eight distribution packages for version 0.2.0.
- Updated installation guides and verification status.

## Verification

- 10 example behavior tests and 11 packaging/installation tests.
- Type checking, Markdown link validation and distribution consistency checks.
- Claude plugin manifest validation.

## Installation

```sh
npx skills add bluenzzz/typescript-engineering
```

## Known limitations

Native skill discovery and reference loading were checked in Codex. Plugin activation across host applications has not been verified. The skills.sh badge and command do not guarantee immediate directory listing.

MIT License — Copyright (c) 2026 Daniel Braga.
