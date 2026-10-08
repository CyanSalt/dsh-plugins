# @cyansalt/dsh-client-ui-settings-ark

[![npm](https://img.shields.io/npm/v/@cyansalt/dsh-client-ui-settings-ark.svg)](https://www.npmjs.com/package/@cyansalt/dsh-client-ui-settings-ark)

Browser settings integration for Ark-based DeepSeek Harness profiles.

## Installation

Install the package in the DSH Web profile:

```sh
dsh plugin --profile web add @cyansalt/dsh-client-ui-settings-ark
```

This is a supporting package rather than a profile bundle. Mount it explicitly
as shown below, or install
[`@cyansalt/dsh-ark-profile`](https://www.npmjs.com/package/@cyansalt/dsh-ark-profile)
to enable the complete Ark integration automatically.

## Usage

To use this package in another profile, mount it with the profile package name
and the PiAI provider key it should edit:

```yaml
- id: ui-settings-ark
  name: '@cyansalt/dsh-client-ui-settings-ark'
  config:
    bundle: '@example/dsh-custom-profile'
    provider: ark
    hiddenFields:
      - maxKeyword
```

The client integration expects these Host entry IDs:

| Entry | Purpose |
| --- | --- |
| `llm-pi-ai` | Stores `providers.<provider>.baseURL` and `apiKeyEnv` |
| `web-search-ark` | Stores `maxKeyword` |
| `ui-settings-ark` | Stores this package's own configuration |

The `bundle` value determines which profile detail page receives the settings
card. A custom profile should therefore pass its own package name.

## Configuration

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `bundle` | `string` | `@cyansalt/dsh-client-ui-settings-ark` | Package name whose profile page receives the settings card |
| `provider` | `string` | `ark` | Key under `llm-pi-ai.providers` edited by the card |
| `hiddenFields` | `("baseURL" \| "apiKey" \| "maxKeyword")[]` | `[]` | Fields omitted from the card |

## Settings

| Field | Storage | Behavior |
| --- | --- | --- |
| Endpoint | `llm-pi-ai.providers.<provider>.baseURL` | Shared by model and web-search requests |
| API key | Credential referenced by `llm-pi-ai.providers.<provider>.apiKeyEnv` | Stored outside the settings file; editing is disabled when no reference is configured |
| Max keywords per search | `web-search-ark.maxKeyword` | Optional integer from 1 to 50 |

Provider and web-search changes are saved independently because they belong to
different Host entries. The card does not create or replace
`llm-pi-ai.providers.<provider>.models`.

The browser integration cannot discover custom Host entry IDs. Keep
`llm-pi-ai`, `web-search-ark`, and `ui-settings-ark` unchanged when using this
package.
