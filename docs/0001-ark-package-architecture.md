# Ark Package Family Architecture

> Scope: Ark package family

## Context

The Ark integration was the first package family added to `dsh-plugins`. It
migrates the Star LM API integration from `llm-star-lm-api` into independently
installable DeepSeek Harness packages. The migration keeps the upstream HTTP
protocol and model definitions while using Ark-specific package and
configuration names.

`dsh-plugins` also hosts unrelated DSH plugins. This decision applies only to
the Ark package family and does not define repository-wide provider behavior.

## Decision

The Ark package family contains a profile bundle and two included components:

| Package | Responsibility |
| --- | --- |
| `@cyansalt/dsh-ark-profile` | Ark bundle composition and PiAI provider defaults |
| `@cyansalt/dsh-web-search-ark` | Server-side Ark web search provider |
| `@cyansalt/dsh-client-ui-settings-ark` | Browser settings card |

Selecting `@cyansalt/dsh-ark-profile` explicitly mounts these bundle rows:

1. `llm-pi-ai`
2. `web-search-ark`
3. `ui-settings-ark`

DSH applies only the patch files declared by bundles selected in a profile;
dependency packages do not implicitly add their own bundle patches. The
profile patch therefore mounts every component directly.

The profile configures the Host's `llm-pi-ai` entry with an `ark` provider
profile. The web-search and browser settings rows both receive `provider: ark`
and resolve their connection values from `llm-pi-ai.providers.ark`, so changing
a connection value affects both model and search requests.
The browser settings row also receives
`bundle: @cyansalt/dsh-ark-profile`, the package name of the profile detail
page that renders the settings card.
`maxKeyword` remains an optional field of the `web-search-ark` row because it
only controls the web-search tool request.

## Stable Identifiers

- LLM provider: `ark`
- Default web search provider: `web-search-ark`

The server-side web-search provider derives its ID from its Loader entry and
uses `web-search-ark` only as the fallback for programmatic mounts. The browser
settings integration cannot discover dynamic Host entry IDs, so profiles that
include it keep the web-search entry ID at `web-search-ark`.

Changes to these identifiers are migrations and require an architecture
decision before implementation.

## Related Decisions

- [Ark shared provider configuration](0002-ark-shared-provider-configuration.md)
- [Ark loader-derived web-search provider ID](0003-ark-loader-derived-web-search-provider-id.md)
- [Plugin monorepo scope](0004-plugin-monorepo-scope.md)
