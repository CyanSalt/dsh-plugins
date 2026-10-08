# Ark Web-Search Provider ID

> Scope: Ark package family

## Context

Cordis Loader entries already have an ID, so duplicating that value in
`web-search-ark` configuration creates two identities that can drift apart.
The browser client has a different constraint: client modules are loaded by
package and are not associated with one Host entry, while `configForms`
requires an explicit Host entry ID.

## Decision

`web-search-ark` always registers the public provider ID `web-search-ark`.
It does not derive the ID from `ctx.loader.locate()`, because that API returns
the Cordis-internal `include:<id>` representation for entries mounted by the
profile include plugin. The plugin does not accept a separate provider ID
configuration field.

`ui-settings-ark` continues to address its own and the web-search configuration
with the fixed IDs `ui-settings-ark` and `web-search-ark`. It does not expose a
`searchPluginId` option because that would make only part of the browser
integration dynamic without making the client plugin itself multi-instance.

## Consequences

Profiles that include the browser settings integration must keep their
web-search entry ID and `web.searchProvider` set to `web-search-ark`.
Supporting multiple provider instances or custom provider IDs requires a
separate configuration contract and browser integration update.

Supporting multiple browser settings instances requires DSH to pass Host entry
identity through the client plugin or slot contract.

## Related Decisions

- [Ark package family architecture](0001-ark-package-architecture.md)
- [Ark shared provider configuration](0002-ark-shared-provider-configuration.md)
