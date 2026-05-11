---
title: API Versioning — Priorities.ai
description: How API versions work. Planned explicit versioning policy.
audience: Developers
status: planned
---

> **Note (Coming soon):** Explicit API versioning policy is planned. Today the API is at `/v1` and this prefix is stable. Breaking changes will not be made to existing `/v1` endpoints.

---

# API Versioning *(planned)*

The current API is versioned at `/v1` via the URL path prefix. This prefix is stable — the `/v1` endpoints you build against today will not be removed or broken without a deprecation notice and migration path.

---

## Current versioning model

**URL prefix:** `/v1`

All endpoints today are under `<base>/v1/`. No version negotiation or header-based versioning is in use.

**Stability guarantee:** Non-breaking additions (new optional fields, new endpoints, new event types) may be added at any time without a version bump. Breaking changes (removing fields, changing field types, removing endpoints) will not happen on the current `/v1` surface without a minimum 6-month deprecation period.

---

## Planned versioning policy

When the first breaking change is required, the platform will:

1. Publish the new version as `/v2/` 
2. Document the breaking changes and the migration path
3. Support `/v1/` for a minimum of 12 months after `/v2/` launch
4. Notify all workspaces via email and dashboard notice at least 6 months before `/v1/` sunset

**Breaking change definition:**

| Breaking | Not breaking |
|----------|-------------|
| Removing an endpoint | Adding a new endpoint |
| Removing a required field from a response | Adding a new optional field to a response |
| Changing a field type | Adding a new query parameter |
| Changing an error code | Adding a new error code |
| Changing a state machine transition rule | Adding a new event type |
| Removing an event type from webhooks | New webhook event |

---

## Webhook versioning

Webhook payloads are currently unversioned. When payload schemas change in a breaking way, webhooks will carry a `schema_version` field:

```json
{
  "event": "session.published",
  "schema_version": "2",
  ...
}
```

Payloads without `schema_version` are implicitly `"1"`.

---

## What's next

- [Changelog](/docs/reference/changelog) — all API changes dated
