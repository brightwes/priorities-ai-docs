---
title: Workspace API
description: Workspace settings, member management, connector configuration, and API key management.
sidebar_label: Workspace API
sidebar_position: 11
audience: Developers
status: published
---

# Workspace

The Workspace API manages the organizational settings, member roster, connector configuration, and API keys for your Priorities.ai workspace.

---

## Get workspace

```
GET /v1/workspace
```

**Scopes:** `workspace:read`

Returns workspace settings and metadata.

**Response:**

```json
{
  "data": {
    "id": "workspace-uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "settings": {
      "default_altitude": 3,
      "allowed_categories": ["initiative", "feature", "technical", "risk"],
      "sso_enabled": true,
      "sso_provider": "okta"
    },
    "plan": "organizational",
    "created_at": "2026-01-15T00:00:00Z"
  },
  "meta": { ... }
}
```

---

## Update workspace

```
PATCH /v1/workspace
```

**Scopes:** `workspace:write`

Updates workspace settings. `id` cannot be changed.

---

## Members

### List members

```
GET /v1/workspace/members
```

**Scopes:** `workspace:read`

**Response:**

```json
{
  "data": [
    {
      "id": "member-uuid",
      "user_id": "user-uuid",
      "email": "harry@example.com",
      "name": "Harry Max",
      "role": "admin",
      "external_ids": [
        {"system": "jira", "external_id": "harry.max@example.com"}
      ],
      "joined_at": "2026-01-20T00:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### Invite a member

```
POST /v1/workspace/members/invite
```

**Scopes:** `workspace:write`

**Body:** `email` (required), `role` (required), `name` (optional)

**Roles:** `owner`, `admin`, `facilitator`, `contributor`, `observer`

### Remove a member

```
DELETE /v1/workspace/members/:user_id
```

**Scopes:** `workspace:write`

---

## External identity mapping

External identity mappings connect workspace members to their IDs in external systems (Jira, Workday, Okta, etc.).

### List external identities

```
GET /v1/workspace/external-identities
```

**Scopes:** `workspace:read`

### Create external identity mapping

```
POST /v1/workspace/external-identities
```

**Scopes:** `workspace:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | uuid | **required** | Priorities.ai user ID |
| `system` | string | **required** | External system identifier (e.g. `jira`, `workday`, `okta`) |
| `external_id` | string | **required** | The user's ID in the external system |

---

## Connectors

Connectors define how Priorities.ai integrates with external systems for signal ingestion and commitment export.

### List connectors

```
GET /v1/workspace/connectors
```

**Scopes:** `workspace:read`

Returns all connector definitions available in the workspace, including their current configuration status.

**Response:**

```json
{
  "data": [
    {
      "id": "connector-jira",
      "name": "Jira",
      "type": "execution",
      "direction": ["export"],
      "status": "configured",
      "config": {
        "base_url": "https://acme.atlassian.net",
        "project_key": "PROD"
      }
    },
    {
      "id": "connector-salesforce",
      "name": "Salesforce",
      "type": "signal",
      "direction": ["import"],
      "status": "not_configured"
    }
  ],
  "meta": { ... }
}
```

### Configure a connector

```
PATCH /v1/workspace/connectors/:id
```

**Scopes:** `workspace:write`

**Body:** connector-specific configuration object (fields vary by connector type).

---

## API keys

### List API keys

```
GET /v1/workspace/api-keys
```

**Scopes:** `workspace:read`

Returns key metadata only — `key_hash` is never returned.

### Create an API key

```
POST /v1/workspace/api-keys
```

**Scopes:** `workspace:write`

**Body:** `name` (required), `scopes` (array), `expires_at` (optional ISO timestamp)

**Response:** Includes `key` field in plaintext — returned once, not stored.

### Revoke an API key

```
DELETE /v1/workspace/api-keys/:id
```

**Scopes:** `workspace:write`

Revocation is immediate and irreversible.

---

## What's next

- [Authentication](/docs/start/authentication) — API key formats, scopes, and security
- [Integrations](/docs/integrations/index) — per-connector setup guides
