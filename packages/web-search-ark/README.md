# @cyansalt/dsh-web-search-ark

[![npm](https://img.shields.io/npm/v/@cyansalt/dsh-web-search-ark.svg)](https://www.npmjs.com/package/@cyansalt/dsh-web-search-ark)

Ark web-search provider for DeepSeek Harness.

## Installation

Install the package in the DSH Web profile:

```sh
dsh plugin --profile web add @cyansalt/dsh-web-search-ark
```

This is a supporting package rather than a profile bundle. Mount it explicitly
as shown below, or install
[`@cyansalt/dsh-ark-profile`](https://www.npmjs.com/package/@cyansalt/dsh-ark-profile)
to enable the complete Ark integration automatically.

## Usage

Load the plugin alongside `@deepseek-ai/dsh-llm-pi-ai` and
`@deepseek-ai/dsh-web`. The plugin reads its endpoint and credential reference
from the selected PiAI provider profile.

```yaml
- id: llm-pi-ai
  name: '@deepseek-ai/dsh-llm-pi-ai'
  config:
    providers:
      ark:
        api: openai-responses
        apiKeyEnv: ARK_API_KEY
        baseURL: https://ark.cn-beijing.volces.com/api/v3
        models:
          - id: ep-example
            name: Example Model

- id: web-search-ark
  name: '@cyansalt/dsh-web-search-ark'
  config:
    provider: ark
    model: ep-example
    maxKeyword: 5

- id: web
  name: '@deepseek-ai/dsh-web'
  config:
    searchProvider: web-search-ark
```

## Configuration

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `provider` | `string` | `ark` | Key under `llm-pi-ai.providers` that supplies `apiKeyEnv` and `baseURL` |
| `model` | `string` | Current agent model | Model or endpoint ID used for the search request |
| `maxKeyword` | `number` | Unset | Maximum keywords Ark may use per search; must be an integer from 1 to 50 |

When the selected provider profile does not set `baseURL`, the plugin uses
`https://ark.cn-beijing.volces.com/api/v3`. Its `apiKeyEnv` value is a
credential reference, not the API key itself. The reference is resolved
through the DSH credential service and then the launch environment.

The search provider is available only when the selected profile declares
`apiKeyEnv`. If the reference has no value, the request is sent without an
authorization header.

## Provider ID

The provider ID comes from the plugin's Cordis Loader entry. A programmatic
mount outside a Loader entry falls back to `web-search-ark`.

The browser settings integration uses the fixed `web-search-ark` entry ID, so
keep that ID when using `@cyansalt/dsh-client-ui-settings-ark`.
