# Verification and critical review

## Select checks from the project

Inspect package scripts, manager/lockfile, versions and CI instructions. Use the existing toolchain; do not replace it just to follow this guide. Run relevant available typecheck, lint, behavioral tests and build, plus checks specific to the change. A transpiler may emit without typechecking. A typecheck cannot establish correct module loading or resource authorization.

Test meaningful behavior: accepted/rejected inputs, malformed syntax, absence, zero/empty boundaries, expected errors and recovery. For resource access, include another user's/tenant's ID. For async changes, include cancellation, races or partial failure where relevant. Use deterministic control of time/concurrency when possible, not arbitrary sleeps. Test public type contracts when type-level regressions matter. Do not require 100% coverage, indiscriminate snapshots or tests that restate implementation details.

The example suite uses Node's built-in [test runner](https://nodejs.org/docs/latest-v24.x/api/test.html). This is a package choice, not a required testing framework for consumers.

## Review to produce corrections

| Question | Observable action when a problem exists |
| --- | --- |
| Do types represent possible states accurately? | Replace conflicting flags or unjustified assertions; add a missing-case check. |
| Does external input bypass validation? | Add a parser at the boundary and an invalid-input test. |
| Can identity/resource permissions be bypassed? | Enforce trusted context and resource scope; exercise denial. |
| Can concurrent operations race or resources leak? | Fix atomicity/cleanup and test the relevant failure path. |
| Does reuse reduce complexity? | Remove unnecessary indirection or split unrelated responsibility. |
| Is optimization supported by evidence? | Measure, or label it a hypothesis and avoid a gain claim. |
| Do tests verify relevant behavior? | Replace implementation-mirroring checks with observable outcomes. |
| Would something simpler suffice? | Reduce scope/abstraction while retaining acceptance criteria. |

Re-run affected checks after corrections. Stop once criteria pass and material limitations are recorded. Security-critical unresolved failures block a claim of readiness; unrelated pre-existing failures must be distinguished, not silently ignored.

## Delivery evidence

Use a concise report with these fields (not a demand for internal reasoning):

- Change and user-visible behavior.
- Important decisions: documented fact with source/date/version, contextual recommendation with trade-off, or convention with project evidence.
- Verification: exact command, working directory when needed, version and actual outcome.
- Not verified: missing capability, unresolved risk or remaining manual check.

Example: “The endpoint now rejects malformed IDs before lookup. `npm run typecheck` passed on the installed compiler; `npm test` passed 12 tests. The database authorization policy was not exercised by this in-memory suite.” Only use numbers from actual output.

Without a terminal, inspect and supply runnable commands but mark them not run. Without browsing, rely on supplied documentation and mark version-sensitive assumptions unconfirmed. Neither limitation justifies fabricating a result or requiring an unrelated tool installation.
