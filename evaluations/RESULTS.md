# Evaluation results

Checked 2026-09-10 with Node.js 24.18.0, npm 11.16.0 and TypeScript 5.9.3.

## Executable checks

| Command | Result |
| --- | --- |
| `npm.cmd run validate` | Skill frontmatter and relative Markdown links passed. |
| `npm.cmd run typecheck` | Passed, including six negative public type contracts. |
| `npm.cmd test` | Build and ten behavior tests passed. |

A mutation probe that bypassed the owner check made the forged-actor test fail. This checks one concrete authorization regression, not exhaustive mutation coverage. A temporary broken Markdown link was also correctly rejected by the validator.

See [integration results](../integrations/RESULTS.md) for packaging and installation checks.

## Assistant smoke evaluation

The [scenarios](scenarios.md) describe the inputs and expected behavior. A no-skill E7 control and a separate assistant with the skill were evaluated during development; the exact model identifier was not recorded.

| Scenario with the skill | Observed behavior | Limitation |
| --- | --- | --- |
| E7: input, authorization and version constraints | Proposed runtime validation, trusted actor/tenant authorization and a TypeScript 4.8-compatible approach; declined fabricated verification claims. | Proposed code was not compiled on 4.8 or integrated with a database. |
| E5: performance and tenant caching | Rejected URL-only global caching and type-only speedup claims; proposed measurements. | No benchmark was executed. |
| E8: small formatter change | Proposed an optional prefix with preserved defaults and avoided unnecessary architecture. | No concrete patch was supplied; partial result. |

The control also identified the TypeScript version constraint, required trusted identity and declined invented test claims. These observations do not demonstrate a measured improvement caused by the skill.

The with-skill responses shared one evaluation context. Full transcripts are not retained; this is a historical smoke-test summary, not a reproducible comparative benchmark. E1–E4 and E6 were not separately executed as assistant evaluations.

## Coverage limits

No cross-model study, compiler-version matrix, browser UI, live database, HTTP adapter, React build or performance benchmark was run. Native host activation is separate from file and manifest validation. The executable example covers validation and authorization behavior without claiming production integration or universal security.
