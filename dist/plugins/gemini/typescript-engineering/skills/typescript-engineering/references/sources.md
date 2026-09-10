# Source register

Consulted **2026-09-10** using web retrieval. Links below were opened successfully unless explicitly noted. These are primary documentation sources, not a claim that every linked page or every platform was exhaustively tested. Recommendations in other guides are original contextual engineering guidance; sources support specific language/API/security facts, not universal architectures.

| Source | Supported topic | Version/scope |
| --- | --- | --- |
| [Agent Skills specification](https://agentskills.io/specification) | Required name/description frontmatter, directory naming, relative references and progressive loading | Rolling specification as consulted; no fixed spec version advertised here |
| [TypeScript Handbook introduction](https://www.typescriptlang.org/docs/handbook/intro.html) | Static checking scope and Handbook boundaries | Rolling docs; navigation included 6.0 |
| [TSConfig reference](https://www.typescriptlang.org/tsconfig/) | strictness, optional/index access checks, target/lib and compiler options | Confirm each flag against installed compiler |
| [Module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html) | Node-aware resolution, bundler resolution, package metadata and emit | Rolling docs, version-sensitive |
| [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) | Assertions, object types and runtime limitations | Rolling Handbook |
| [Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) | readonly and mutable alias limitations | Rolling Handbook; corrected URL opened successfully |
| [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) | unknown refinement, predicates, discriminants and never | Rolling Handbook |
| [TypeScript 4.9 notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) | Introduction of satisfies and unlisted-property narrowing | 4.9; not available on 4.8 |
| [TypeScript 6.0 notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) | Upgrade-sensitive compiler defaults and options | 6.0 docs consulted; examples target pinned 5.9.3 |
| [TypeScript performance guide](https://github.com/microsoft/TypeScript/wiki/Performance) | Compiler investigation and type complexity | Official project wiki, rolling |
| [Project references](https://www.typescriptlang.org/docs/handbook/project-references.html) | Composite projects, declarations and build relationships | Rolling docs |
| [Node 24 packages](https://nodejs.org/download/release/v24.18.0/docs/api/packages.html) | Explicit type field, .mjs/.cjs and package exports | 24.18.0, matching local verification; initial rolling page also opened and identified 26.8.2 |
| [Node 24 test runner](https://nodejs.org/docs/latest-v24.x/api/test.html) | Built-in node:test | Retrieval identified 24.21.0; local runtime 24.18.0 |
| [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) | Lockfile-based installation | npm 11 documentation |
| [React TypeScript](https://react.dev/learn/typescript) | Typed props and hook inference | Rolling docs; no React version installed/tested here |
| [W3C form labels](https://www.w3.org/WAI/tutorials/forms/labels/) | Accessible names/associated labels | WAI tutorial, not a full accessibility audit |
| [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | Boundary validation and distinction from output encoding | Rolling cheat sheet |
| [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Permission enforcement and resource access | Rolling cheat sheet |
| [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) | Parameters and allowlists | Rolling cheat sheet |
| [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | Context-specific encoding and safe sinks | Rolling cheat sheet |
| [OWASP logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Sensitive-data exclusions and useful diagnostics | Rolling cheat sheet |

The initially attempted `handbook/2/object-types.html` address and Node's `latest-v24.x/api/packages.html` did not return usable content. They are not treated as successful consultations. Versioned runtime docs should be consulted for new version-sensitive APIs; no reliance on unverified Node 26-only APIs is intended.

For maintenance, record the actual access date, source version, claim and verification environment. Keep installed/compiler-tested versions separate from rolling documentation versions. Without web access, label fresh-source verification unavailable and use supplied/versioned material; do not invent a consultation date.
