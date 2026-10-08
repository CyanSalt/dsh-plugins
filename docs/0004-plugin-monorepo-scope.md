# Plugin Monorepo Scope

> Scope: Repository-wide

## Context

The repository began as `dsh-ark`, a home for the Ark integration. Its scope
has expanded beyond one provider: it is now `dsh-plugins`, a collection of DSH
plugins, profiles, and supporting packages maintained by CyanSalt.

Treating the repository itself as Ark-specific would make future package
families appear to inherit Ark configuration, identifiers, and dependency
boundaries.

## Decision

`dsh-plugins` is a provider-neutral monorepo. Packages are grouped by their
actual integration or responsibility, and each package owns its runtime
implementation.

Provider-specific profiles may compose related packages and supply shared
defaults, but they do not define behavior for unrelated packages. Existing Ark
contracts remain scoped to `ark-profile`, `web-search-ark`, and
`ui-settings-ark`.

The root `README.md` is the package catalog and entry point for contributors.
`docs/README.md` indexes architecture decisions, which remain in numbered
documents under `docs/`. Every decision states whether it is repository-wide
or limited to a package family.

## Consequences

- New DSH plugins can be added without adopting Ark identifiers or
  configuration.
- Package-family documentation can evolve independently while repository-wide
  conventions remain in `AGENTS.md`.
- Adding, removing, or renaming a package requires updating the root package
  catalog. Changing the decision set requires updating the documentation index.
