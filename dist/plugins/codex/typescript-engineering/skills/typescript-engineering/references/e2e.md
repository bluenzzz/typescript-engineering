# Optional end-to-end testing

Read for complete user journeys, regressions across layers, or flaky E2E tests. These are contextual engineering choices, not a mandatory stage for every change.

## Choose the boundary and tool

Use the simplest layer that adequately detects the failure:

| Concern | Usually start with |
| --- | --- |
| Isolated calculation, parser or formatter | Unit test |
| Contracts between components, storage or services | Integration test |
| A journey depending on the assembled system | E2E test |

E2E complements unit and integration tests. A small function change without a material journey risk does not justify new browser infrastructure. Prioritize changed, high-impact flows such as login, purchase, permissions and form submission when they exist. Cover relevant failures and refusals as well as success.

Inspect the project's installed tools, scripts, fixtures and CI. Reuse the existing E2E tool. Consider Playwright for a web project without one only when the need justifies adoption; do not replace a working tool to follow this reference. For a CLI or service without a web interface, exercise the appropriate public entry point without imposing a browser.

## Design stable, meaningful tests

- **Selectors:** prefer role and accessible name, associated labels or stable test identifiers. Avoid incidental DOM structure, presentation classes and arbitrary positions. Playwright's [best practices](https://playwright.dev/docs/best-practices) illustrate locators and retrying assertions; check APIs against the installed version.
- **Isolation:** give each test independent mutable data, session and state. Prepare deterministic fixtures and clean up owned resources, including after failure. Separate accounts or records when tests mutate shared server state. Tests should run alone, in another order, and in parallel where supported.
- **Synchronization:** wait for observable readiness or completion using the tool's waiting mechanisms, not fixed sleeps. For flakiness, reproduce the failure and inspect shared state, races, network responses and environment setup before changing timeouts or retries. Additional retries do not repair the cause; retain first-attempt failure evidence.
- **Assertions:** verify an observable outcome such as confirmation, persisted state or rejected operation, rather than implementation details. For example, a purchase confirmation alone does not prove persistence; verify the resulting order through the relevant real boundary when persistence is the risk.

## Real services, mocks and identity

Choose real test-environment integrations when the boundary under test requires them. Use mocks for controlled failure cases or appropriate external dependencies. Name every simulated boundary and the integrations left unverified. A journey with a fully mocked backend does not establish integration with that backend; a mocked payment success does not establish real payment processing.

Preconfigure sessions for journeys not intended to test login, while retaining dedicated login coverage when relevant. Playwright supports reusable authenticated state; its [authentication guide](https://playwright.dev/docs/auth) explains isolation and sensitive state files. Keep credentials and session artifacts out of source control and public reports.

Verify authorization at the trusted service boundary, including cross-user or cross-tenant refusals when applicable. A hidden button is not proof of authorization. See [security guidance](security.md) for the underlying policy.

## CI, diagnosis and evidence

Integrate with existing CI: establish reproducible dependencies, applicable browser/runtime versions, configuration, service startup and readiness, and isolated test data. Playwright's [CI guide](https://playwright.dev/docs/ci) documents its environment requirements; adapt to the project's runner instead of copying an unrelated workflow.

Retain failure traces, screenshots and logs when available, with appropriate access and retention. Exclude or redact credentials, session state and sensitive application data before sharing artifacts.

Report tests written separately from tests executed, passed, failed or blocked. Include exact commands, relevant environment, mocks and remaining limitations. Without execution, provide reproducible setup/run instructions and mark them **not run**. Successful package validation or a proposed E2E test is not an executed journey.
