# @cyansalt/dsh-ark-profile

[![npm](https://img.shields.io/npm/v/@cyansalt/dsh-ark-profile.svg)](https://www.npmjs.com/package/@cyansalt/dsh-ark-profile)

Ark models, web search, and browser settings for DeepSeek Harness.

## Installation

Install and enable the bundle in the DSH Web profile:

```sh
dsh plugin --profile web add @cyansalt/dsh-ark-profile
```

## Usage

Select `@cyansalt/dsh-ark-profile` as a DSH profile. The bundle configures the
Ark provider and mounts the packages needed for web search and browser-based
settings:

| Entry | Package | Purpose |
| --- | --- | --- |
| `llm-pi-ai` | `@deepseek-ai/dsh-llm-pi-ai` | Provides the `ark` model route |
| `web-search-ark` | `@cyansalt/dsh-web-search-ark` | Runs Ark web searches |
| `ui-settings-ark` | `@cyansalt/dsh-client-ui-settings-ark` | Adds Ark settings to the profile page |
| `web` | `@deepseek-ai/dsh-web` | Selects `web-search-ark` as the search provider |

Configure an actual Ark endpoint or model ID before making model requests. The
bundled `unknown` model is only a placeholder that makes Ark available on model
configuration surfaces.

## Defaults

The profile adds `llm-pi-ai.providers.ark` with these values:

| Field | Default |
| --- | --- |
| `displayName` | `Ark` |
| `api` | `openai-responses` |
| `apiKeyEnv` | `ARK_API_KEY` |
| `baseURL` | `https://ark.cn-beijing.volces.com/api/v3` |
| `models` | `[{ id: "unknown", name: "Unknown" }]` |

The web-search and settings entries both use the `ark` provider profile, so
model requests and web-search requests share its endpoint and credential
reference. The settings card can edit the endpoint, the referenced API key,
and the maximum number of keywords per search. It does not create or replace
the provider's model list.

This package only composes the bundle. The runtime implementations remain in
the packages listed above.
