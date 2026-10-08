# dsh-plugins

`dsh-plugins` is a monorepo for independently installable DeepSeek Harness
(DSH) plugins, profiles, and their supporting packages maintained by CyanSalt.
The repository is not tied to one provider or plugin family.

## Packages

The current workspace contains the Ark integration:

| Package | Description |
| --- | --- |
| [`@cyansalt/dsh-ark-profile`](packages/ark-profile) | Profile bundle that configures the Ark model provider, web search, and browser settings |
| [`@cyansalt/dsh-web-search-ark`](packages/web-search-ark) | Server-side Ark web-search provider |
| [`@cyansalt/dsh-client-ui-settings-ark`](packages/ui-settings-ark) | Browser settings integration for Ark-based profiles |

Future DSH plugins can live alongside this package family without inheriting
Ark-specific configuration or runtime behavior.

## Repository Structure

- `packages/` contains publishable packages. Each runtime implementation stays
  in the package that owns it.
- `docs/` contains numbered architecture decisions and package-family design
  notes.
- `pnpm-workspace.yaml` defines the workspace and shared development dependency
  catalog.

Profile packages compose and configure plugins. They do not absorb the runtime
implementation of the plugins they include.

## Development

Use the Node.js version declared in [`.node-version`](.node-version) and pnpm
11.

```sh
pnpm install --frozen-lockfile
pnpm exec tsc -b
pnpm exec eslint .
pnpm -r prepack
```

Shared development dependency versions belong in the pnpm catalog. Runtime
dependencies remain explicit in the package that uses them.

## Documentation

Architecture decisions and package-family design notes are indexed in
[`docs/README.md`](docs/README.md).
