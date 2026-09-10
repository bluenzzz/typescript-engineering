# Contributing and publication

Keep the core framework independent and in clear English; update the usage guides when user-facing behavior changes. Route specialized guidance to optional references instead of expanding every task's context.

## Change process

1. Describe the concrete task or failure the change improves. Preserve user scope and distinguish documented behavior, engineering recommendations and local conventions.
2. Check primary sources for the affected versions. Update the source register's actual consultation date, relevant version, supported claim and access limitations. Do not silently replace a version-specific source with a rolling page.
3. Add or adapt a small complete example when it clarifies a decision. Pin changed tooling deliberately and update the lockfile using the same package manager.
4. Run structure/link validation, typecheck, relevant tests and build. Record exact outcomes in the evaluation results; do not overwrite historical claims with unexecuted assumptions.
5. Exercise relevant behavioral scenarios using only permitted resources. Save inputs, outputs, skill revision, environment and per-criterion observations. Distinguish static review from assistant execution and native integration testing.
6. Review for contradictions, repetition, dogmatic rules, unsupported APIs and unnecessary dependencies. Keep examples free of personal data and secrets.

Revisit sources after compiler/runtime upgrades, module changes, security advisories or a demonstrated failure. Broken links require finding the official replacement and checking its content, not just changing a URL. Test at the supported compiler floor before advertising broader version compatibility.

## Commit messages

Keep each commit focused on one purpose and write its message in English: `type(scope): Imperative description`. Use `feat` for features, `fix` for bugs, `tweak` for improvements, `chore` for maintenance, `docs` for documentation and `style` for formatting. Choose a scope that identifies the affected area, such as `skill` or `integrations`; the scope is optional for documentation.

Review staged changes before committing. Regenerate distribution packages after source edits and verify them with `npm run check:packages`.

## License

This project is licensed under the [MIT License](LICENSE), copyright 2026 Daniel Braga. Preserve the copyright and permission notice when redistributing copies or substantial portions of the project.

Include only material you have the right to contribute and preserve required third-party notices. Source links do not grant redistribution rights. This package summarizes recommendations instead of copying manuals.

Publishing, pushing, creating public releases and installing into other users' environments are separate actions requiring the appropriate authorization. No external publication is part of creating these files.
