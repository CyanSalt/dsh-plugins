# Package Architecture

## Context

This repository migrates the Star LM API integration from
`llm-star-lm-api` into independently installable DeepSeek Harness packages.
The migration keeps the upstream HTTP protocol and model definitions while
using Ark-specific package and configuration names.

## Decision

The repository contains a profile bundle and two included components:

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

The Ark PiAI provider profile defaults are:

| Field | Default |
| --- | --- |
| `apiKeyEnv` | `ARK_API_KEY` |
| `baseURL` | `https://ark.cn-beijing.volces.com/api/v3` |
| `models` | `[{ id: unknown, name: Unknown }]` |

Ark deployments use deployment-specific model or endpoint IDs. The generic
profile includes an `unknown` placeholder so the Ark provider remains visible
on model configuration surfaces until the deployment supplies its actual model
catalog. The browser settings card does not create or replace models.

`web-search-ark.maxKeyword` is optional and defaults to unset.

## Dependency Policy

The root pnpm catalog pins Cordis and every DSH development dependency.
Non-DSH dependencies remain explicit in their owning manifests. DSH
development dependencies are pinned to `0.1.7-rc.2`, matching the API used by
the source integration. Runtime contracts are peer dependencies with `>=`
minimum versions.

## Verification

The repository validates:

- JavaScript through TypeScript `checkJs`
- repository style through ESLint
- workspace dependency consistency through pnpm's frozen lockfile mode
