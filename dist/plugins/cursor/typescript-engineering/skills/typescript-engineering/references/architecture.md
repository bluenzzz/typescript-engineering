# Architecture, reuse and UI

All layouts below are **contextual engineering recommendations**, not rules of the TypeScript language. Inspect existing imports, ownership, tests and conventions first; change structure only to solve an observed maintenance problem.

## Choose the smallest useful structure

A small project with one cohesive workflow can keep direct files:

```text
src/
  index.ts
  invoice.ts
  invoice.test.ts
```

Use this when navigation and dependencies remain easy. A single module with clear functions is often enough; do not introduce controllers, services and repositories for a trivial calculation.

A growing application may benefit from feature ownership:

```text
src/
  app.ts
  features/
    invoices/
      invoice.ts
      invoice.test.ts
      invoice-route.ts
      invoice-store.ts
    customers/
      customer.ts
      customer.test.ts
  infrastructure/
    database.ts
```

Use it when changes cluster by feature. Keep presentation/transport, business decisions and infrastructure distinct where they change for different reasons. The route maps transport input/output; domain code models policy; the store handles persistence. A small feature may combine files until separation has a concrete benefit. Avoid cross-feature imports into internals; define a small contract when collaboration is needed.

A shared library needs deliberate public boundaries:

```text
src/
  index.ts
  money.ts
  money.test.ts
test/
  consumer.test.ts
  contracts.types.ts
package.json
tsconfig.json
```

Use an intentional entry point, documented exports and declarations. Verify a packed artifact in a consumer context before release, including supported module formats and compiler floor. Breaking runtime or type contracts needs migration/versioning. Do not mistake internal imports that compile in the repository for a valid distributed package.

## Reuse decisions

Extract when two uses share a stable responsibility or a boundary deserves isolation. Similar lines alone are not proof. Compare duplication cost against coupling and indirection; keep local code when the two uses evolve differently. Favor composition and a few meaningful parameters. Do not create a `utils` or `common` dumping ground.

Keep dependencies understandable and modules cohesive. Inspect cycles before adding barrel exports; a type-only import can remove runtime dependency but does not repair unclear ownership. Follow existing test placement. Clean Architecture, DDD and monorepos need a demonstrated organizational/domain benefit, not automatic adoption.

## Framework-independent UI

Define props around user-visible behavior. Represent mutually exclusive states as a discriminated union, for example idle/loading/error/ready; model empty success explicitly in rendering. Keep selection, permissions, fetching and presentation from accumulating in one “universal” component with dozens of flags.

Use a small presentational component plus composition or a feature wrapper when fetching/export/billing are independent responsibilities. Make callback payloads meaningful; decide controlled vs local state and ownership of side effects. Preserve public props or document migration.

Use semantic controls, accessible names, keyboard interaction and visible focus. Associate form labels with controls; placeholder text is not a persistent label. Make loading, empty, success and error behavior understandable, preserving focus when content changes. Test interaction, not only markup snapshots. [W3C labeling guidance](https://www.w3.org/WAI/tutorials/forms/labels/).

Framework-specific API choices belong in an optional reference. A TypeScript props contract is not an accessibility test or a server authorization check.
