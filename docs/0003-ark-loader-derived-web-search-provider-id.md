# Ark Loader-Derived Web-Search Provider ID

> Scope: Ark package family

## Context

Cordis Loader entries already have an ID, so duplicating that value in
`web-search-ark` configuration creates two identities that can drift apart.
The browser client has a different constraint: client modules are loaded by
package and are not associated with one Host entry, while `configForms`
requires an explicit Host entry ID.

## Decision

`web-search-ark` derives its provider ID from `ctx.loader.locate()` and falls
back to `web-search-ark` when mounted programmatically outside a Loader entry.
It does not accept a separate provider ID configuration field.

`ui-settings-ark` continues to address its own and the web-search configuration
with the fixed IDs `ui-settings-ark` and `web-search-ark`. It does not expose a
`searchPluginId` option because that would make only part of the browser
integration dynamic without making the client plugin itself multi-instance.

## Consequences

The server-side provider can use a custom Loader entry ID when no
`ui-settings-ark` integration depends on it. Profiles that include the browser
settings integration must keep their web-search entry ID and
`web.searchProvider` set to `web-search-ark`.

Supporting multiple browser settings instances requires DSH to pass Host entry
identity through the client plugin or slot contract.

## Related Decisions

- [Ark package family architecture](0001-ark-package-architecture.md)
- [Ark shared provider configuration](0002-ark-shared-provider-configuration.md)
