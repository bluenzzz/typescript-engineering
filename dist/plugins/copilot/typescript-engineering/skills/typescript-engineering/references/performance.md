# Performance with evidence

These are **engineering recommendations**. First ask whether the problem is application execution, typechecking, bundling or developer tooling; the measurements and fixes differ.

## Application runtime

Define the observed symptom and target: p95 endpoint latency, memory peak, query count, interaction delay or transfer size. Capture a baseline using a representative workload, environment, data size and concurrency. Separate cold/warm behavior; repeat samples and report variability, not a single favorable run.

Inspect algorithmic work, data structures, repeated I/O, N+1 queries, unbounded concurrency, retained objects and bundle composition. Profile the actual bottleneck before claiming gains. Consider pagination/streaming for large results, bounded parallel I/O for independent calls and lazy loading for expensive optional paths.

Cache only with explicit keys, scope, lifetime, invalidation and memory bounds; include tenant/permission context when caching protected data. Memoization trades retained memory and invalidation complexity for avoided computation. Compare before/after behavior and cost under the same workload, preserving correctness and security. Type-annotation-only edits do not establish a runtime speedup.

## Compiler and build

**Documented tools:** the TypeScript team's [performance guide](https://github.com/microsoft/TypeScript/wiki/Performance) describes compiler diagnostics and investigation. Use the installed compiler's `--extendedDiagnostics`; if needed and supported, collect a `--generateTrace` trace or `--traceResolution` output for resolution issues. Traces can contain project paths or source information: inspect before sharing.

**Recommendations:** compare clean and warm runs separately with the same compiler and machine. Inspect included files/declarations, accidental generated directories, costly unions, intersections and recursive instantiations. Prefer named simpler types when diagnostics implicate type complexity. Do not blindly disable checks to improve numbers.

Incremental builds and [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) may help larger independently buildable units. References introduce build ordering, composite/declaration requirements and cache maintenance; test clean builds as well as incremental invalidation. A tiny project may gain nothing. Bundler time and `tsc` time need separate reporting.

If no profiler or execution is available, state a hypothesis and a reproducible measurement plan. Do not report an estimated gain as measured evidence.
