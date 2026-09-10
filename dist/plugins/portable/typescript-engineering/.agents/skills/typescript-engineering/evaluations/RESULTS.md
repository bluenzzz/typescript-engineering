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

## Optional E2E reference — 2026-09-10

This incremental update follows source revision `521436c`; it adds `references/e2e.md`, routing and scenarios E9–E12. The entries above remain historical results. Environment: Node.js 24.18.0, npm 11.16.0 and TypeScript 5.9.3, using the existing installed dependency and lockfile.

**Static review:** checked the requested decisions against the new reference, selective routing, unchanged core frontmatter/workflow and the existing security guidance. E9, E10 and E12 are documented cases, not separately executed behavioral evaluations. No Playwright dependency, browser infrastructure or example application was added.

**Code checks executed after the reference change:** `npm.cmd run validate` and `npm.cmd run typecheck` passed; `npm.cmd test` passed all 10 example behavior tests; `npm.cmd run test:packaging` passed all 11 installer/packaging tests. These check this skill package, not browser journeys. The packaging suite validates relative links in isolated copies of every supported target.

**Behavioral smoke evaluation:** two fresh subagent contexts received exactly the E11 prompt in [scenarios](scenarios.md), without its rubric. One received no skill; the other loaded the updated core and relevant references. No target project, browsing or proposed-code execution was available; file reads were allowed only to load the skill. The evaluator model identifier was not independently recorded. Single samples do not establish a reliable improvement or cross-model compatibility.

| E11 criterion | No-skill control | With updated skill |
| --- | --- | --- |
| Investigate causes before migration/retry tuning | Partial: identified shared-account risk, but offered migration and 10 retries as requested | Met: treated shared state and waits as hypotheses; deferred migration and retry increases as remedies |
| Isolated fixtures and observable waits | Met: separate customer/order, completion waits and cleanup proposed | Met: accounts/cart/orders per attempt, observable completion and cleanup after failure proposed |
| Standalone/parallel verification instructions | Partial: serial/parallel runs mentioned; no exact command | Partial: isolated/reordered/parallel runs specified; requested missing scripts/configuration instead of inventing commands |
| Real and simulated boundaries | Met: distinguished staging order service from mocked payments | Met: added trusted-service permission refusals and left real payments unverified |
| Honest execution status | Met: not run, not verified | Met: no changes made; checks not run |

Recorded excerpts from the control: “Set retries to 10 as requested, while reporting first-attempt failures so retries don't hide instability.” Its status was “not run, not verified.” The guided response stated: “Shared account state and the fixed wait are plausible causes of parallel failures; neither is confirmed” and “Status: no changes made; checks not run.” Full transcripts are not retained; the table is a limited observation, with E11 overall partial because concrete reproduction commands require the missing project configuration.

No E2E test was written or run against an application during this update. Backend persistence, browser behavior, staging services and CI execution remain unverified.
