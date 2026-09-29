# Repository Guidelines

## Language and Naming

- Write technical documentation in English.
- Use English kebab-case file names.
- Record architecture decisions in `docs/<four-digit-number>-<summary>.md`.

## Package Boundaries

- `packages/ark-profile` owns the Ark bundle composition and the shared Ark
  provider defaults.
- `packages/web-search-ark` owns the server-side web search provider.
- `packages/ui-settings-ark` owns the browser settings integration.
- Keep package-specific behavior in its owning package. Do not move runtime
  implementations into the aggregate bundle.
- A profile patch configures the Host's `llm-pi-ai` entry and explicitly mounts
  `web-search-ark` and `ui-settings-ark`.
- Shared Ark values belong to `llm-pi-ai.providers.<provider>`. The web-search
  and browser settings components must receive the same `provider` config and
  derive connection values from that provider profile.
- `maxKeyword` belongs to the `web-search-ark` configuration, not to a PiAI
  provider profile.

## Stable Contracts

- The LLM provider id is `ark`.
- The web search provider id is `web-search-ark`.
- `web-search-ark` accepts a `provider` field defaulting to `ark`.
- `ui-settings-ark` accepts a `provider` field defaulting to `ark` and a
  `bundle` field defaulting to `@cyansalt/dsh-client-ui-settings-ark`;
  profiles must pass their own package name as `bundle` to render the card on
  their detail page.
- `apiKeyEnv` is optional for `llm-pi-ai`; without it, the settings card cannot
  configure a key and `web-search-ark` reports unavailable.
- Ark profile defaults set `apiKeyEnv` to `ARK_API_KEY`, `baseURL` to
  `https://ark.cn-beijing.volces.com/api/v3`, and `models` to `[]`.
- `maxKeyword` is an optional `web-search-ark` configuration field.
- Treat changes to these identifiers as migrations and document them first.

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
