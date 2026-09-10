# Runnable examples

This package uses TypeScript **5.9.3** and compiled ESM on Node.js **24.x**. Exact versions/results actually used are recorded in the evaluation report. This is a chosen verification baseline, not a claim that 5.9.3 is the newest compiler or that all older versions work. `satisfies` needs 4.9+; the complete configuration may need newer features. The code uses no runtime dependency.

From the package root, install with `npm ci --ignore-scripts`, run `npm run typecheck` and `npm test`. Use `npm.cmd` on PowerShell if needed. Tests execute emitted JavaScript, so the ESM configuration is exercised rather than merely inspected. The parent package explicitly declares `type: module`; relative TypeScript imports use `.js` for the compiled output.

## Boundary validation and authorization

[invoice.ts](src/invoice.ts) accepts `unknown`, validates a small request and creates only the permitted field. Its ID grammar and 64-character limit are **example domain conventions**, not TypeScript requirements. Unknown fields are ignored by projection, including a forged `actorId`. The trusted actor is a separate argument.

The complete synchronous in-memory read scopes access to resource ID, owner and tenant; denied and missing records return the same public error. A `Pick` allowlist projects the response without internal notes. The generic `Result` relates success/error contracts; narrowing, `satisfies` and an exhaustive switch express those states. [Behavior tests](tests/invoice.test.mjs) cover invalid inputs, malformed JSON, missing identity, cross-user/tenant denial and zero-valued data.

The input parser is intended for decoded JSON/plain data, not hostile JavaScript proxies or getters. The HTTP adapter must enforce body size limits before parsing and authenticate identity. The in-memory collection is trusted domain data; a real external database response needs appropriate validation/invariants. This example is not an authentication provider, transaction model or ready-to-deploy API. Writes need atomic authorization and concurrency controls in the actual data store.

## Public type contracts

[contracts.types.ts](src/contracts.types.ts) contains positive narrowing checks and intentional negative checks using explained `@ts-expect-error` directives. It is compiled but its function is never called. If a contract becomes too permissive, an unused directive makes typechecking fail. These are compile-time tests, not runtime validation. `readonly` here does not freeze objects.

The TSConfig uses explicit strictness, exact optional properties, unchecked indexing protection, ES2022 libraries without DOM globals, NodeNext resolution and declarations. These settings belong to this example. Do not copy them unchanged into a bundler-driven UI or older CommonJS project.

No React sample is compiled. No benchmark, HTTP integration or database concurrency test is claimed. The examples illustrate separate boundary and type-contract concerns with a single small domain to keep maintenance low.
