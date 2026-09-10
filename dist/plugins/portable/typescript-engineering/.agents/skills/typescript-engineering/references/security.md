# Security and robustness

These are **contextual application controls**, not TypeScript guarantees. Select them from data flows and real risks; a pure formatting function needs a smaller review than a payment endpoint.

## Trust boundaries

HTTP, forms, files, environment variables, storage and third-party responses are untrusted, typically `unknown`. Parse syntax, validate shape/domain limits and construct a narrow value. Check lengths, numeric finiteness/ranges and variants. Apply body/transport limits before parsing. Decide whether unknown keys are rejected or ignored; never spread untrusted records into privileged objects.

Use an existing schema library for complex/repeated schemas, verifying its installed API. A small explicit parser may suffice for a small contract. Test malformed JSON separately from valid JSON with invalid fields.

| Operation | Purpose |
| --- | --- |
| Validation | Accept/reject against a contract, e.g. bounded positive integer. |
| Normalization | Convert equivalent representations when domain rules permit, e.g. trim a display name. |
| Sanitization | Remove unsafe constructs from permitted markup with a suitable maintained sanitizer. |
| Output encoding | Encode for the sink; HTML text encoding differs from JavaScript or URL encoding. |

Normalize intentionally, then validate the representation used. Do not silently normalize passwords or opaque IDs. [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

## Identity and authorization

Authentication establishes identity through trusted middleware. Authorization decides whether that identity may perform this action on this resource. Derive actor/tenant from that trusted boundary, not body fields or hidden buttons. Deny absent permissions; scope reads/writes by resource and tenant. Test cross-user and cross-tenant access. Choose intentionally between 403 and a non-disclosing 404. [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

Check-then-update can race: use transactions, conditional writes or database-enforced policies with suitable isolation and conflicts. In-memory read examples do not prove production authorization. Static privacy, obfuscated IDs and frontend code are not barriers.

## Sinks, errors and secrets

Parameterize database values; dynamic table/column names need allowlists. Avoid constructing shell commands from input. [OWASP SQL injection](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

Use context-appropriate output encoding and safe UI sinks. Raw HTML needs a justified trusted/sanitized path; validate URL schemes where URLs are accepted. [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

For file paths, remote URLs and cookie-authenticated writes, investigate traversal, SSRF and CSRF respectively using relevant official/OWASP guidance. Do not apply identical controls to every environment.

Map expected errors consistently to stable public codes. Preserve unexpected causes in controlled diagnostics without exposing stack traces or database details. Log correlation IDs and minimal context; redact tokens, passwords, bodies and personal data. Constrain untrusted log fields. [OWASP logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## Async robustness

Set finite I/O deadlines and propagate cancellation through supported runtime/driver APIs. A winning timeout promise does not cancel work. Release connections, streams, timers and listeners in `finally` or supported scoped cleanup. Bound concurrency and decide partial-failure behavior. Test cancellation before/during work and cleanup.

Retry identified transient failures only for idempotent operations or those with durable idempotency protection. Bound attempts/time, use appropriate backoff/jitter, honor retry guidance and stop on cancellation. A timed-out payment may already have succeeded; do not retry every error.

Inspect dependency provenance, maintenance, advisories, transitive cost and lifecycle scripts. Preserve lockfiles and reproducible installs. Audit results need triage and do not prove safety. This package uses `npm ci --ignore-scripts` for the pinned compiler; see [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).
