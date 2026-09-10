# Types and configuration

## Establish the environment

**Engineering recommendation:** inspect scripts, lockfile, installed compiler, inherited TSConfigs, runtime support and build tool before changing options. A dependency range is not an installed version. Prefer the local compiler; a global compiler or unpinned package runner may differ. When available, inspect `tsc --showConfig` and reproduce the failing type/import in the real package context.

**Documented behavior:** `strict` enables a family of checks that can evolve. `noUncheckedIndexedAccess` introduces possible `undefined` on unchecked indexing; `exactOptionalPropertyTypes` distinguishes omission from explicitly assigned `undefined`. Neither is implied by `strict`. `target` controls emitted syntax; `lib` describes APIs and installs no polyfills. [TSConfig](https://www.typescriptlang.org/tsconfig/).

**Recommendation:** start new code with explicit `strict: true`; evaluate the extra flags against API compatibility and migration cost. Consider `noImplicitReturns`, `noFallthroughCasesInSwitch`, unused-code checks and `noEmitOnError` according to the pipeline. Do not enable every flag mechanically. If `skipLibCheck` is needed for a dependency issue, record lost declaration coverage and a removal condition.

## Choose the module model

| Execution/build context | Candidate and decision |
| --- | --- |
| Node executes emitted ESM | Supported Node-aware pair such as `module: NodeNext`, `moduleResolution: NodeNext`; inspect package `type`, extensions and dependency exports. |
| Existing Node CommonJS | Preserve boundaries; inspect `.cts`/`.cjs`, package `type` and dependencies. Node-aware resolution can also model CommonJS. |
| Bundler owns emission | Evaluate `module: ESNext` or supported `preserve` with `moduleResolution: bundler`; use `noEmit` when another tool emits. Consult that bundler's official docs. |
| Shared library | Match consumers, emit declarations, verify exports and test real consumer imports. Test both formats before claiming dual-format support. |

**Documented behavior:** Node-aware modes account for package metadata; `NodeNext` evolves. `paths` does not rewrite emitted imports. `verbatimModuleSyntax` distinguishes type-only imports and can expose a format mismatch instead of rewriting it. Confirm installed-version support. [Module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html).

For ESM/CJS errors, capture exact command/error, nearest package metadata, source/output extensions, emitted JS, dependency `exports` and runtime version. Fix the mismatched boundary and run emitted code. Typechecking alone is insufficient; a cast cannot fix a loader error.

The example's ES2022/NodeNext profile is a **package convention** for compiled code on Node 24, not a frontend template. Browser code may need DOM libraries; server code should not gain browser globals accidentally. Keep `target` explicit across upgrades. [6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) illustrate why upgrades need review.

## Model contracts economically

Infer obvious local values; annotate public boundaries when it clarifies stability. Choose `interface` for suitable object contracts/extension and `type` for unions/transformations. Neither is universally superior. Classes may suit identity or state; do not wrap every function in a class.

Use `unknown` at boundaries and narrow before access. A predicate returning `value is T` must check the claimed properties: the compiler trusts it. Discriminated unions prevent impossible states; exhaustive `never` checks detect missing variants. [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

Use generics to express relationships, e.g. `Result<T, E>` preserving success/error types. A parameter appearing only once often adds no relationship. Derive contracts with `keyof`, indexed access, `Pick` or `Omit` when the source truly owns the relationship. Prefer explicit DTO allowlists over exposing database entities that may acquire sensitive columns.

`satisfies` checks expression compatibility while preserving useful inference and requires TypeScript 4.9+. On 4.8 use supported annotations and runtime validation or plan an upgrade. It is not a parser. [4.9 notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html).

Distinguish absence, null and empty where meaningful; truthiness loses valid `0` or empty-string values. Assertions and interfaces do not check external data. [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html). `readonly` limits writes through a type, not runtime mutation or mutable aliases. [Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

Keep necessary assertions localized, document the invariant and test it. Use explained `@ts-expect-error` for deliberate negative type tests; do not suppress unexplained errors. Prefer named, simple contracts over complex conditional/recursive types that impair comprehension and compilation.

## Legacy adoption

1. Capture current diagnostics and relevant behavior tests.
2. Identify risky `any` flows, especially inputs reaching privileged operations. Add validated adapters in the touched path first.
3. Adopt strict checks in an isolated package or suitable migration config; `strict` is not selectively disabled per source file. Baseline unrelated errors when whole-project migration is impractical.
4. Replace each `any` with domain information or `unknown` plus narrowing, not mass casts.
5. Record exception reason, scope and removal condition; expand after checks pass without unrelated public changes.
