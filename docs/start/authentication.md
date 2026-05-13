---
title: Authentication — Priorities.ai
description: API keys, scopes, rate limits, and key management.
audience: Developers
status: published
nav-order: 3
---

# Authentication

All requests to `/v1/*` require a Bearer API key in the `Authorization` header.

```
Authorization: Bearer pk_live_<64 hex chars>
```

API keys are **workspace-scoped**. Create one in **Settings → API Keys** inside the app. That same page also shows your workspace's **API base URL** — you'll need both.

> **Finding your base URL:** Go to **Settings → API Keys** in the app. The full base URL is displayed at the bottom of the page and can be copied with one click. It follows the pattern `https://<your-project>.supabase.co/functions/v1/api/v1`.

---

## Key format

```
pk_live_a1b2c3d4e5f6...
```

Prefix: `pk_live_` (8 chars) + 64 hex characters = 72 characters total.

The raw key is shown **exactly once** at creation time. Only a SHA-256 hash is stored — the key cannot be recovered after dismissal. Store it in your secret manager immediately.

---

## Test connectivity

The health endpoint requires no authentication:

```bash
curl https://<project>.supabase.co/functions/v1/api/health
```

```json
{
  "status": "ok",
  "version": "1",
  "timestamp": "2026-04-01T12:00:00.000Z"
}
```

---

## Create an API key

Via the app: **Settings → API Keys → Create key**

Via the API (requires a valid session token or an existing key with `workspace:write`):

```bash
curl -X POST "$PAI_BASE/workspace/api-keys" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Read-only reporting key",
    "scopes": ["items:read", "sessions:read", "reports:read"]
  }'
```

```json
{
  "data": {
    "id": "...",
    "name": "Read-only reporting key",
    "key_prefix": "a1b2c3d4",
    "scopes": ["items:read", "sessions:read", "reports:read"],
    "expires_at": null,
    "created_at": "2026-04-01T12:00:00Z",
    "key": "pk_live_a1b2c3d4e5f6..."
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

> **Save the `key` value immediately.** It is returned once and not stored. If you lose it, revoke the key and create a new one.

### Key options

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Descriptive name shown in the dashboard |
| `scopes` | array | Scope strings. Empty array = full access to all resources |
| `expires_at` | string | ISO 8601 expiry timestamp. Omit for non-expiring keys. |

---

## Scopes

Scopes follow the pattern `<resource>:<action>`.

| Scope | Description |
|-------|-------------|
| `items:read` | Read items, relationships, and attributes |
| `items:write` | Create, update, and delete items and attributes |
| `sessions:read` | Read prioritization sessions and results |
| `sessions:write` | Create sessions and manage their lifecycle |
| `tool_sessions:read` | Read collaborative tool sessions and responses |
| `tool_sessions:write` | Create tool sessions, submit responses, finalize |
| `cycles:read` | Read cycles and tracks |
| `cycles:write` | Create cycles and execute phase transitions |
| `catchball:read` | Read catchball proposals, loops, and threads |
| `catchball:write` | Submit and resolve catchball proposals |
| `workspace:read` | Read workspace settings, members, and connectors |
| `workspace:write` | Modify workspace settings, manage members and API keys |
| `reports:read` | Access session, cycle, and item reports (JSON + CSV) |
| `webhooks:read` | List registered webhooks |
| `webhooks:write` | Create, delete, and test webhooks |

### Wildcard shortcuts

| Pattern | Meaning |
|---------|---------|
| `*` | Full access to all resources |
| `items:*` | All actions on items |
| `sessions:*` | All actions on sessions |

An empty scopes array is equivalent to `["*"]`.

---

## Rate limits

**120 requests per 60-second window** per API key.

Rate limit headers are included on every response:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1743508860
```

When the limit is exceeded, the API returns `429 RATE_LIMITED`. Back off and retry after the `Reset` timestamp.

For high-volume integrations (bulk imports, warehouse syncs), use the `reports/items` endpoint (up to 500 items per request) and batch webhook delivery rather than polling individual item endpoints.

---

## Revoke a key

```bash
curl -X DELETE "$PAI_BASE/workspace/api-keys/:id" \
  -H "Authorization: Bearer $PAI_KEY"
```

The key stops working immediately. This action cannot be undone. If you need to rotate a key, create the new key first, update your consuming systems, then revoke the old key.

---

## List keys

```bash
curl "$PAI_BASE/workspace/api-keys" \
  -H "Authorization: Bearer $PAI_KEY"
```

Returns key metadata only — `key_hash` is never returned. Only the display prefix, name, scopes, `last_used_at`, and timestamps.

```json
{
  "data": [
    {
      "id": "...",
      "name": "CI/CD Pipeline",
      "key_prefix": "a1b2c3d4",
      "scopes": ["items:read", "sessions:read"],
      "last_used_at": "2026-03-31T08:00:00Z",
      "expires_at": null,
      "revoked_at": null,
      "created_at": "2026-03-01T00:00:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Security recommendations

- **Least privilege.** Create keys with only the scopes required. A read-only reporting integration should never have `items:write`.
- **One key per consuming system.** This gives you per-system `last_used_at` visibility and lets you revoke selectively.
- **Set expiry for short-lived integrations.** Use `expires_at` for CI/CD keys, migration scripts, and one-time imports.
- **Rotate on leak.** If a key is exposed — in logs, in a commit, in an error message — revoke it immediately and create a new one.
- **Store in a secret manager.** Never in environment files committed to source control, never in client-side code.

---

## What's next

- [Quickstart](/start/quickstart) — use your key to build a complete integration
- [Workspace API](/api/workspace) — full key management API reference
- [Error codes](/reference/errors) — `UNAUTHORIZED` and `FORBIDDEN` explained
