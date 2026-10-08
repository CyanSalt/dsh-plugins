# Repository Guidelines

## Language and Documentation

- Write technical documentation in English.
- Use English kebab-case file names.
- Record architecture decisions in `docs/<four-digit-number>-<summary>.md`.
- Keep the package catalog in `README.md` current when packages are added,
  removed, or renamed.
- Keep `docs/README.md` current when architecture decisions are added, removed,
  renamed, or superseded.
- Put package-specific boundaries, identifiers, defaults, and configuration
  contracts in the applicable architecture decision rather than in this file.
- Review the decisions indexed by `docs/README.md` before changing an existing
  package or cross-package contract.

## Repository Scope

- This repository is a monorepo for DSH plugins, profiles, and supporting
  packages maintained by CyanSalt.
- Do not assume that a contract defined for one package or package family
  applies to another.
- Keep package-specific behavior in its owning package. Composition packages
  configure and mount their dependencies without absorbing their runtime
  implementations.
- Treat changes to published identifiers and configuration contracts as
  migrations and document them before implementation.

## Dependencies and Validation

- Declare shared development dependency versions, including Cordis and DSH
  packages, in the pnpm catalog. Keep package-specific runtime dependencies
  explicit.
- Declare peer dependency ranges with `>=` minimum versions.
- Use the global pnpm store. Do not create a repository-local store.
- Keep lockfile changes limited to dependencies required by the change.
- Do not rewrite existing package metadata or tool versions unless the task
  requires it or the user approves it.
- Before finishing, run the relevant package type checks, a frozen
  lockfile-only install, and `git diff --check`.
- Update this file when repository-wide conventions change.
