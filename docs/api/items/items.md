---
title: Items API
description: Create, read, update, and delete items. Items are the primary work objects in the platform.
sidebar_label: Items API
sidebar_position: 1
audience: Developers
status: published
---

# Items

Items are the primary work objects in the platform. They exist at the workspace level, independent of any Cycle, and accumulate attributes, relationships, and history over time.

An item represents any unit of work, idea, initiative, or request that an organization might consider prioritizing — a strategic initiative, a customer feature request, a technical debt item, a compliance requirement, a risk.

---

## List items

```
GET /v1/items
```

**Scopes:** `items:read`

**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| `status` | string | Filter by item status (`intake`, `active`, `shaping`, `deferred`, `archived`) |
| `category` | string | Filter by item category |
| `search` | string | Case-insensitive name search |
| `page` | integer | Page number (default: 1) |
| `per_page` | integer | Results per page (max 100, default 50) |

**Request:**

```bash
curl "$PAI_BASE/items?status=active&per_page=25" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "workspace_id": "...",
      "name": "Improve onboarding flow",
      "description": "Reduce time-to-value for new users",
      "status": "active",
      "category": "initiative",
      "created_at": "2026-03-15T10:00:00Z",
      "updated_at": "2026-03-28T14:22:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." },
  "pagination": { "page": 1, "per_page": 25, "total": 87, "total_pages": 4 }
}
```

---

## Create an item

```
POST /v1/items
```

**Scopes:** `items:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **required** | Item name |
| `description` | string | | Item description |
| `category` | string | | Item category (e.g. `initiative`, `feature`, `technical`, `risk`) |
| `status` | string | | Initial lifecycle status. Defaults to `intake`. |
| `metadata` | object | | Additional freeform metadata |

**Request:**

```bash
curl -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Migrate to new infrastructure",
    "description": "Move core services to managed Kubernetes",
    "category": "technical"
  }'
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "new-uuid",
    "workspace_id": "...",
    "name": "Migrate to new infrastructure",
    "description": "Move core services to managed Kubernetes",
    "category": "technical",
    "status": "intake",
    "created_at": "2026-04-01T12:00:00Z",
    "updated_at": "2026-04-01T12:00:00Z"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Get an item

```
GET /v1/items/:id
```

**Scopes:** `items:read`

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | uuid | Item ID |

**Response:** Item object (same shape as above).

---

## Update an item

```
PATCH /v1/items/:id
```

**Scopes:** `items:write`

Partial update — only fields present in the body are changed. `id` and `workspace_id` are ignored if included.

**Request:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-..." \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "shaping", "description": "Updated description"}'
```

**Response:** Updated item object.

---

## Delete an item

```
DELETE /v1/items/:id
```

**Scopes:** `items:write`

**Response:**

```json
{
  "data": { "id": "a1b2c3d4-...", "deleted": true },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

> **Note:** Deleting an item that is part of an active session or published priority list is blocked. Deactivate or archive the item instead.

---

## Item status values

| Status | Meaning |
|--------|---------|
| `intake` | Newly created, not yet shaped |
| `active` | In active consideration |
| `shaping` | Being enriched and prepared for a comparison |
| `deferred` | Explicitly set aside — not archived, may return |
| `archived` | Removed from active consideration |

Exit status is one of four orthogonal state machines on an item. It does not determine Item Readiness and is not inferred from governance events.

---

## What's next

- [Item relationships](/docs/api/items-relationships) — declare dependencies, blocs, aggregations
- [Item attributes](/docs/api/items-attributes) — attach RICE frames, sizing, custom attributes
- [Core concepts: items and their lifecycle](/docs/start/core-concepts)
