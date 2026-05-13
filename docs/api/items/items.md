---
title: Items API
description: Create, read, update, and delete items. Items are the primary work objects in the platform.
sidebar_label: Items API
sidebar_position: 1
audience: Developers
status: published
# `items/items.md` would otherwise share the same URL as the parent folder (`/api/items/`).
slug: items
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

---

## Bulk import

```
POST /v1/items/bulk
```

**Scopes:** `items:write`

Upserts up to 500 items in a single request. Rows with an existing `id` update; rows without an `id` insert. All rows must include `name`.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `items` | array | **required** | Array of item objects (max 500) |

---

## Provenance and Lineage

**Provenance** is an operation you assert on an item — a discrete, named event with real semantic consequences (Supersede, Split, Merge, Fork, Retire). **Lineage** is the system-level record that results from asserting provenance: the traversable history of how items moved and transformed over time. Asserting a provenance operation writes a lineage record.

### Assert a provenance operation

```
POST /v1/items/provenance
```

**Scopes:** `items:write`

Records a provenance operation, writing the resulting lineage record to `lineage_events`.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `event_type` | string | **required** | `supersede`, `split`, `merge`, `fork`, or `retire` |
| `performed_by` | uuid | **required** | User asserting the provenance operation |
| `source_item_ids` | array | | Item UUIDs that are the source (the "before") |
| `target_item_ids` | array | | Item UUIDs that are the result (the "after") |
| `rationale` | string | | Why this operation was performed |
| `metadata` | object | | Arbitrary additional context |

At least one of `source_item_ids` or `target_item_ids` is required.

| Operation | Source | Target | Meaning |
|---|---|---|---|
| `supersede` | 1 item | 1 item | Source is replaced by target |
| `split` | 1 item | 2+ items | Source becomes multiple targets |
| `merge` | 2+ items | 1 item | Sources combine into one target |
| `fork` | 1 item | 1 item | Source branches; both remain active |
| `retire` | 1+ items | none | Source(s) archived with no replacement |

**Request:**

```bash
curl -X POST "$PAI_BASE/items/provenance" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "split",
    "source_item_ids": ["a1b2c3d4-..."],
    "target_item_ids": ["new-uuid-1", "new-uuid-2"],
    "performed_by": "user-uuid",
    "rationale": "Scope was too broad for a single track — separated infra and product work."
  }'
```

**Response:** `201 Created` — the created lineage event record.

### Read lineage for an item

```
GET /v1/items/:id/lineage
```

**Scopes:** `items:read`

Returns all lineage events where this item appears as a source or target, ordered newest first.

**Response:**

```json
{
  "data": [
    {
      "id": "event-uuid",
      "event_type": "split",
      "source_item_ids": ["a1b2c3d4-..."],
      "target_item_ids": ["new-uuid-1", "new-uuid-2"],
      "performed_by": "user-uuid",
      "rationale": "Scope was too broad for a single track",
      "workspace_id": "...",
      "created_at": "2026-04-10T09:00:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Comments

Threaded discussion attached to an item. Comments support one level of replies via `reply_to_id`.

### List comments

```
GET /v1/items/:id/comments
```

**Scopes:** `items:read`

Returns comments in chronological order, including replies.

### Post a comment

```
POST /v1/items/:id/comments
```

**Scopes:** `items:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `author_id` | uuid | **required** | User posting the comment |
| `author_name` | string | | Display name (cached at write time) |
| `body` | string | **required** | Comment text |
| `reply_to_id` | uuid | | Root comment being replied to |

### Delete a comment

```
DELETE /v1/items/:id/comments/:commentId
```

**Scopes:** `items:write`

Only the comment author or a workspace admin should call this.

---

## Value proposals

Value proposals are S5 (Item Scoring) inputs — a participant's proposed value for a specific scoring criterion on this item. Proposals move through `proposed → accepted` status.

### List value proposals

```
GET /v1/items/:id/value-proposals
```

**Scopes:** `items:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `status` | string | Filter by status (`proposed`, `accepted`) |

**Response:**

```json
{
  "data": [
    {
      "id": "proposal-uuid",
      "item_id": "a1b2c3d4-...",
      "attribute_key": "business_value",
      "value": 8,
      "status": "proposed",
      "proposed_by": "user-uuid",
      "proposed_at": "2026-04-12T10:00:00Z",
      "session_id": "session-uuid",
      "track_id": "track-uuid"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

### Submit a value proposal

```
POST /v1/items/:id/value-proposals
```

**Scopes:** `items:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `attribute_key` | string | **required** | The criterion being scored (e.g. `business_value`, `technical_effort`) |
| `value` | any | **required** | The proposed value (stored as JSONB — may be a number, string, or object) |
| `proposed_by` | uuid | **required** | User submitting the proposal |
| `session_id` | uuid | | Session context for this proposal |
| `track_id` | uuid | | Track context |
| `rationale` | string | | Justification for this value |

### Accept a value proposal

```
POST /v1/items/:id/value-proposals/:proposalId/accept
```

**Scopes:** `items:write`

Marks a proposal as accepted — the authoritative value for this attribute on this item within the scoring context.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `accepted_by` | uuid | **required** | User accepting the proposal |

---

## Classification

Classification determines how an item is categorized within the workspace's comparability model — its `category` (e.g. `initiative`, `capability`, `feature`, `spike`) and `altitude_level` (the organizational level at which it lives). Both fields are comparability-sensitive and require RPC-backed authority transitions per build contract §2.3a.

The classification lifecycle: `empty → proposed → approved`. Agents propose; humans accept (or directly set).

### Get classification

```
GET /v1/items/:id/classification
```

**Scopes:** `items:read`

Returns the item's current classification state and the active proposal (if any).

**Response:**

```json
{
  "data": {
    "item_id": "a1b2c3d4-...",
    "item_category": "feature",
    "altitude_level": 3,
    "classification_status": "proposed",
    "active_proposal": {
      "id": "proposal-uuid",
      "proposed_by": "agent",
      "proposed_by_agent": "atc",
      "classification_fields": {
        "category": "feature",
        "altitude_level": 3,
        "rationale": "Scope indicates a user-facing capability at team level.",
        "confidence": "high"
      },
      "status": "active",
      "created_at": "2026-04-10T08:00:00Z"
    }
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

When `classification_status` is `empty`, `active_proposal` is `null`.

### Set classification directly

```
POST /v1/items/:id/classification
```

**Scopes:** `items:write`

Directly sets the classification, bypassing the proposal flow. Sets `classification_status` to `approved` immediately. Calls the `set_item_classification` RPC.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `category` | string | **required** | e.g. `initiative`, `capability`, `feature`, `spike` |
| `altitude_level` | integer | **required** | Organizational altitude (workspace-defined scale) |
| `user_id` | uuid | **required** | User performing the classification |
| `rationale` | string | | Reason for this classification |
| `question_responses` | array | | Structured answers to classification questions |

**Request:**

```bash
curl -X POST "$PAI_BASE/items/a1b2c3d4-.../classification" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "feature",
    "altitude_level": 3,
    "user_id": "user-uuid",
    "rationale": "Confirmed scope with engineering lead — single team, single sprint."
  }'
```

**Response:** `200 OK`

```json
{
  "data": {
    "item_id": "a1b2c3d4-...",
    "category": "feature",
    "altitude_level": 3,
    "classification_status": "approved"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

### Accept an active proposal

```
POST /v1/items/:id/classification/accept
```

**Scopes:** `items:write`

Accepts the active classification proposal produced by an agent or another user. Calls the `accept_classification_proposal` RPC.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `proposal_id` | uuid | **required** | ID of the active proposal to accept |
| `accepted_by` | uuid | **required** | User ID of the person accepting |

**Request:**

```bash
curl -X POST "$PAI_BASE/items/a1b2c3d4-.../classification/accept" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "proposal_id": "proposal-uuid",
    "accepted_by": "user-uuid"
  }'
```

**Response:** `200 OK`

```json
{
  "data": {
    "item_id": "a1b2c3d4-...",
    "proposal_id": "proposal-uuid",
    "classification_status": "approved"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Audit events

```
GET /v1/items/:id/audit-events
```

**Scopes:** `audit:read`

Returns paginated audit events whose payload references this item. Useful for building an item-level activity log in an external system.

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `page` | integer | Page number (default `1`) |
| `per_page` | integer | Results per page (default `20`, max `100`) |

**Response:**

```json
{
  "data": [
    {
      "id": "audit-uuid",
      "workspace_id": "ws-uuid",
      "actor_id": "user-uuid",
      "action": "item.updated",
      "payload": { "itemId": "a1b2c3d4-...", "field": "title", "before": "Old name", "after": "New name" },
      "created_at": "2026-04-15T14:22:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 8,
    "total_pages": 1,
    "workspace_id": "...",
    "request_id": "..."
  }
}
```

For workspace-wide audit event queries (all actors, all items), see the [Audit Events API](/api/events/audit-events).

---

## What's next

- [Item Attributes API](/api/items/items-attributes) — interpretive frames (problem, opportunity, risk, etc.)
- [Item Relationships API](/api/items/items-relationships) — dependencies, packages, aggregations
- [Audit Events API](/api/events/audit-events) — workspace-level audit log
- [Tracks API](/api/tracks) — how items enter a track's item pool for scoring
- [Core concepts: items and their lifecycle](/start/core-concepts)
