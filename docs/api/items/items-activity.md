---
title: Item Activity API
description: Read provenance (lineage events), history (audit trail), and discussion (comments) for any item.
sidebar_label: Item Activity API
sidebar_position: 4
audience: Developers
status: published
---

# Item Activity

The **Activity** section of an item in Priorities.ai has three sub-tabs:

| Tab | What it answers | Source |
|---|---|---|
| **Provenance** | Where did this item come from? What happened to its structural identity? | `lineage_events` table |
| **History** | What changed on this item, and who did it? | `audit_events` table |
| **Discussion** | Comments, questions, and clarifications from collaborators | `entity_comments` table |

These are exposed through three separate API sub-resources.

---

## Provenance — Lineage events

Provenance records structural transformation events over the item's lifecycle. It answers questions of identity and origin: was this item split from another? Merged with others? Promoted from a session?

Lineage is not a relationship. It is provenance — a permanent record of what happened to the item's structural continuity.

### Lineage event types

| `event_type` | What happened |
|---|---|
| `split` | This item was split into multiple successors; the original was retired |
| `merge` | Multiple items were merged into this item (or this item was merged into another) |
| `supersede` | One item replaced another; the superseded item closed with a pointer to this one |
| `retire` | This item was retired with no successor |
| `fork` | This item branched into a new successor while the original remained active |

### Get lineage events

```
GET /v1/items/:id/lineage
```

**Scopes:** `items:read`

Returns all lineage events where this item appears as a source or target, newest first.

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../lineage" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "lineage-uuid",
      "event_type": "fork",
      "source_item_ids": ["a1b2c3d4-..."],
      "target_item_ids": ["b2c3d4e5-..."],
      "rationale": "Scope was too broad. Forking a focused mobile-only version while keeping the original for web.",
      "actor_id": "user-uuid",
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-18T11:00:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

### Lineage event fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Event record ID |
| `event_type` | string | One of the five types above |
| `source_item_ids` | uuid[] | Items that were transformed (the "before" side) |
| `target_item_ids` | uuid[] | Items that resulted (the "after" side) |
| `rationale` | string | Human-provided explanation |
| `actor_id` | uuid | User who triggered the event |
| `created_at` | timestamptz | When the event was recorded |

### Lineage and relationships

After any lineage event (`split`, `merge`, `supersede`, `retire`, or `fork`), all active relationships on the affected item(s) must be explicitly reviewed and remapped. Lineage does not auto-inherit relationships. See [Item Relationships API](/docs/api/items/items-relationships) for the dissolution sequence.

---

## History — Audit events

History is the full chronological audit trail — every user action and system event that touched this item, in reverse chronological order. It answers: who changed the title? When was the category updated? When was this item added to a Package?

### Get audit events

```
GET /v1/items/:id/audit-events
```

**Scopes:** `audit:read`

Returns audit events whose payload references this item, paginated newest-first.

**Query params:**

| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `per_page` | `50` | Events per page (max 100) |

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../audit-events" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "audit-uuid",
      "event_type": "item.category_changed",
      "actor_id": "user-uuid",
      "payload": {
        "itemId": "a1b2c3d4-...",
        "from": "solution",
        "to": "investment"
      },
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-22T09:00:00Z"
    },
    {
      "id": "audit-uuid-2",
      "event_type": "item.title_updated",
      "actor_id": "user-uuid-2",
      "payload": {
        "itemId": "a1b2c3d4-...",
        "from": "Add reporting",
        "to": "Custom Reporting Suite — executive dashboards and data export"
      },
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-20T14:20:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 50,
    "total": 14,
    "total_pages": 1,
    "workspace_id": "...",
    "request_id": "..."
  }
}
```

### Audit event fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Audit event record ID |
| `event_type` | string | Dot-namespaced event name (e.g. `item.category_changed`) |
| `actor_id` | uuid | User who triggered the event |
| `payload` | object | Event-specific data including before/after state |
| `created_at` | timestamptz | When the event was recorded |

---

## Discussion — Comments

Discussion is the threaded conversation space for the item. Unlike History (system-generated), Discussion is human-authored — questions, clarification requests, decisions, and notes left by collaborators.

### List comments

```
GET /v1/items/:id/comments
```

**Scopes:** `items:read`

Returns all comments on this item in chronological order (oldest first).

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../comments" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "comment-uuid-1",
      "entity_type": "item",
      "entity_id": "a1b2c3d4-...",
      "author_id": "user-uuid",
      "author_name": "Rachel Chen",
      "body": "Should we consider the compliance angle here before scoring effort?",
      "reply_to_id": null,
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-21T10:30:00Z"
    },
    {
      "id": "comment-uuid-2",
      "entity_type": "item",
      "entity_id": "a1b2c3d4-...",
      "author_id": "user-uuid-2",
      "author_name": "Priya Menon",
      "body": "Good point — I'll tag the legal team to weigh in on this.",
      "reply_to_id": "comment-uuid-1",
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-21T11:15:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

### Post a comment

```
POST /v1/items/:id/comments
```

**Scopes:** `items:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `author_id` | uuid | **required** | User posting the comment |
| `author_name` | string | | Display name of the author |
| `body` | string | **required** | Comment text |
| `reply_to_id` | uuid | | Parent comment ID for threaded replies |

**Request:**

```bash
curl -X POST "$PAI_BASE/items/a1b2c3d4-.../comments" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "author_id": "user-uuid",
    "author_name": "Rachel Chen",
    "body": "Flagging this for the Q2 criteria session — the scope needs to be locked before we score.",
    "reply_to_id": null
  }'
```

**Response:** `201 Created` — the created comment object.

### Delete a comment

```
DELETE /v1/items/comments/:commentId
```

**Scopes:** `items:write`

Removes a comment by its record ID.

**Request:**

```bash
curl -X DELETE "$PAI_BASE/items/comments/comment-uuid-1" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": { "id": "comment-uuid-1", "deleted": true },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

### Comment fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Comment record ID |
| `entity_type` | string | Always `"item"` for this endpoint |
| `entity_id` | uuid | The item this comment is on |
| `author_id` | uuid | User who posted the comment |
| `author_name` | string | Display name at time of posting |
| `body` | string | Comment text |
| `reply_to_id` | uuid | Parent comment ID if this is a reply (null for top-level) |
| `created_at` | timestamptz | When the comment was posted |

---

## What's next

- [Item Classification API](/docs/api/items/items-classification) — frames, altitude, canonical frame
- [Item Attributes API](/docs/api/items/items-attributes) — value proposals and scoring
- [Item Relationships API](/docs/api/items/items-relationships) — lineage relationship propagation rules
