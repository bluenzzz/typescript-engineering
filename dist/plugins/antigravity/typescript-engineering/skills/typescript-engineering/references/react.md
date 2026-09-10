# Optional React guidance

Load only for a React project. Check installed React, TypeScript, JSX/build configuration and React type-package versions before proposing APIs. This package has no executable React sample and claims no React integration testing.

**Documented behavior:** React props can be described using TypeScript object contracts; hooks such as `useState` can infer types, with explicit types useful when the initial value does not express all valid states. Use the official [React TypeScript guide](https://react.dev/learn/typescript) for installed-version-compatible syntax.

**Engineering recommendations:** model loading/error/ready props as variants rather than independent booleans. Keep data fetching and feature policy outside a reusable visual component when that enables simpler reuse. Compose children or small specialized components instead of adding a switch for every caller. Use correct event types where inference is insufficient, and native button/input semantics with accessible labels.

Do not add effects for values that can be derived during rendering. Before introducing a hook, memoization, concurrent API or framework-specific fetching method, consult its official documentation for the project's version. Measure render cost before optimization; preserve interaction behavior. Test loading, failure, empty results, keyboard access and callback behavior using the project's actual tools. No universal component architecture or performance claim follows from React typings.
