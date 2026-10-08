# Ark Shared Provider Configuration

> Scope: Ark package family

## Context

An Ark profile configures a PiAI provider route plus independently switchable
web-search and browser-settings components. They must use the same API base
URL and credential reference.

## Decision

`@cyansalt/dsh-ark-profile` configures the Host's `llm-pi-ai` entry. Shared
connection values live in `llm-pi-ai.providers.<provider>` rather than in a
second configuration service.

The profile bundle mounts these rows:

1. `llm-pi-ai`, with an `ark` profile containing an `unknown` placeholder
   model displayed as `Unknown`.
2. `web-search-ark`, with `provider: ark`.
3. `ui-settings-ark`, with `provider: ark` and
   `bundle: @cyansalt/dsh-ark-profile`.

The browser card maps connection fields into
`llm-pi-ai.providers.<provider>` and `maxKeyword` into the `web-search-ark`
entry. It never creates or replaces `models`. When a profile omits
`apiKeyEnv`, the card disables key editing; `llm-pi-ai` then uses pi-ai's own
environment discovery, while `web-search-ark` is unavailable. When a profile
names a reference that has no value, web-search requests omit the authorization
header.

The Host stores each entry independently, so the card stages and saves provider
and web-search changes as separate revision-fenced writes.

## Configuration Contracts

The generic Ark profile supplies these PiAI provider defaults:

| Field | Default |
| --- | --- |
| `apiKeyEnv` | `ARK_API_KEY` |
| `baseURL` | `https://ark.cn-beijing.volces.com/api/v3` |
| `models` | `[{ id: unknown, name: Unknown }]` |

The supporting packages accept these options:

| Package | Field | Default |
| --- | --- | --- |
| `web-search-ark` | `provider` | `ark` |
| `web-search-ark` | `maxKeyword` | unset |
| `ui-settings-ark` | `provider` | `ark` |
| `ui-settings-ark` | `bundle` | `@cyansalt/dsh-client-ui-settings-ark` |

`maxKeyword` belongs to the web-search configuration rather than the PiAI
provider profile. A profile must pass its own package name as `bundle` so the
settings card appears on that profile's detail page.

## Consequences

Ark deployments use deployment-specific model or endpoint IDs. The generic
profile includes an `unknown` placeholder so Ark appears on model configuration
surfaces, while an operator or specialized profile can replace it with actual
models.

Specialized profiles such as Star LM API reuse the same web-search and browser
settings packages, but configure `providers.star-lm-api`, pass
`provider: star-lm-api` to both packages, and set `ui-settings-ark.bundle` to
the specialized profile's package name. Because the browser settings package
cannot discover a dynamic Host entry ID, these profiles keep the web-search row
ID at `web-search-ark`. Bundle dependencies do not apply patches recursively,
so every profile patch explicitly mounts its rows.

## Related Decisions

- [Ark package family architecture](0001-ark-package-architecture.md)
- [Ark loader-derived web-search provider ID](0003-ark-loader-derived-web-search-provider-id.md)
