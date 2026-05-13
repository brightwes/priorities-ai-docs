---
title: Error Codes — Priorities.ai
description: Every error code the API returns, with causes and remedies.
audience: Developers
status: published
---

# Error Codes

All errors use the envelope:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": null
  }
}
```

`details` is non-null for validation errors and carries field-specific messages.

---

## HTTP status to error code mapping

| HTTP | Code | Meaning |
|------|------|---------|
| 400 | `VALIDATION_ERROR` | Request body failed validation |
| 401 | `UNAUTHORIZED` | Missing or invalid API key |
| 403 | `FORBIDDEN` | Valid key but insufficient scope or role |
| 404 | `NOT_FOUND` | Resource does not exist or is not accessible from this workspace |
| 409 | `CONFLICT` | State conflict — action cannot be performed on resource in current state |
| 422 | `UNPROCESSABLE` | Business rule violation (not a validation error) |
| 429 | `RATE_LIMITED` | 120/min window exceeded |
| 500 | `INTERNAL_ERROR` | Server-side error |
| 503 | `SERVICE_UNAVAILABLE` | Platform temporarily unavailable |

---

## Error code reference

### `VALIDATION_ERROR` (400)

A required field is missing, a field has the wrong type, or a field value is outside the allowed range.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "name": "Name is required",
        "altitude": "Altitude must be between 1 and 5"
      }
    }
  }
}
```

**Remedy:** Check the `details.fields` map for field-specific messages.

---

### `UNAUTHORIZED` (401)

`Authorization` header is missing, the key prefix is malformed, or the key has been revoked.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid API key",
    "details": null
  }
}
```

**Remedy:** Check that your `Authorization` header is `Bearer pk_live_<key>`. If the key was recently created, ensure you are using the full key (not just the prefix shown in the dashboard).

---

### `FORBIDDEN` (403)

The API key is valid but lacks the scope required for this endpoint, or the authenticated user lacks the role required for this governance action.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient scope: sessions:write required",
    "details": { "required_scope": "sessions:write" }
  }
}
```

**Remedy:** Check the endpoint's required scope in the API reference. Create a new key with the required scope, or use a key that already has it.

---

### `NOT_FOUND` (404)

The resource does not exist, or it exists in a different workspace than the authenticating key's workspace.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": null
  }
}
```

**Remedy:** Verify the resource ID. If you believe the resource exists, verify that your API key belongs to the same workspace as the resource.

---

### `CONFLICT` (409)

The action cannot be performed because the resource is in a state that does not permit it.

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Session is already PUBLISHED. No further state transitions are permitted.",
    "details": { "current_state": "PUBLISHED" }
  }
}
```

**Remedy:** Read the resource to check its current state before attempting state transitions.

---

### `UNPROCESSABLE` (422)

The request is technically valid but violates a business rule that cannot be expressed as a schema validation.

Common causes:

| Message | Cause |
|---------|-------|
| `Item is in an active session (Ring 1 protected). A comparability-affecting change requires admin approval.` | Attempting to change a comparability-affecting field on a Ring 1 item |
| `Package member cannot be committed without all Package members present in scope.` | Attempting to commit a Package member when other Package members are not in scope |
| `Hard dependency on :item_id must be explicitly addressed before this item can receive a commitment-quality disposition.` | Attempting to commit an item with an unresolved hard Dependency |
| `Session criteria cannot be modified after CRITERIA_FINALIZED.` | Attempting to change criteria after finalization |
| `Track Cell is empty. Item cannot participate in a Track-scoped session.` | Attempting to include an item with `classification_state: empty` in a session |

---

### `RATE_LIMITED` (429)

120 requests per 60-second window exceeded for this API key.

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again after 2026-04-01T12:01:00Z.",
    "details": { "reset_at": "2026-04-01T12:01:00Z" }
  }
}
```

**Remedy:** Respect the `X-RateLimit-Reset` header. Back off and retry after the reset timestamp. For bulk operations, use the items report endpoint (up to 500 items per request) rather than looping on individual GET endpoints.

---

### `INTERNAL_ERROR` (500)

An unexpected server-side error. These are logged and monitored.

**Remedy:** Retry with exponential backoff. If the error persists, contact support.

---

## What's next

- [Rate limits reference](/reference/rate-limits) — window size, headers, and backoff guidance
- [Webhook payloads reference](/reference/webhook-payloads)
