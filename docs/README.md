# Documentation

This directory records architecture decisions for the `dsh-plugins`
monorepo. The index is grouped by scope; decision numbers reflect creation
order rather than document hierarchy.

Read repository-wide decisions before package-family decisions. A
package-family decision does not define behavior for unrelated packages.

## Repository-Wide Decisions

| Decision | Summary |
| --- | --- |
| [`0004` - Plugin monorepo scope](0004-plugin-monorepo-scope.md) | Defines the provider-neutral repository scope and documentation boundaries |

## Package-Family Decisions

### Ark

| Decision | Summary |
| --- | --- |
| [`0001` - Ark package family architecture](0001-ark-package-architecture.md) | Defines package responsibilities, composition, and stable identifiers |
| [`0002` - Ark shared provider configuration](0002-ark-shared-provider-configuration.md) | Defines shared PiAI values, component options, and settings behavior |
| [`0003` - Ark web-search provider ID](0003-ark-loader-derived-web-search-provider-id.md) | Defines the fixed server-side provider identity and browser integration constraints |

## Maintenance

- Add each architecture decision as
  `<four-digit-number>-<english-kebab-case-summary>.md`.
- State the decision scope near the top of the document.
- Update this index when a decision is added, renamed, removed, or superseded.
- Preserve decision numbers when renaming documents.
