---
title: Item Attributes API
description: Read and write interpretive frames on items — the problem/opportunity/risk lenses that define how an item is understood and displayed.
sidebar_label: Item Attributes API
sidebar_position: 3
audience: Developers
status: published
---

# Item Attributes

**Attributes** are the interpretive frames attached to an item — structured descriptions that classify _how_ an item is understood: as a problem, opportunity, risk, constraint, etc. Frames drive how items appear in session displays and ranked outputs.

Every item can have multiple frames of different types. Exactly one frame may be marked `is_primary = true` — that is the canonical frame used in session displays, priority lists, and exported reports.

---

## Frame fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Frame record ID |
| `item_id` | uuid | The item this frame belongs to |
| `workspace_id` | uuid | Workspace scope |
| `frame_type` | string | `problem`, `opportunity`, `risk`, `constraint`, `hypothesis`, `goal` |
| `title` | string | Short label for the frame |
| `description` | string | Full framing statement |
| `is_primary` | boolean | Whether this is the canonical frame for the item |
| `created_at` | timestamptz | When the frame was created |
| `updated_at` | timestamptz | When the frame was last updated |

At most one frame per item may have `is_primary = true`. The API enforces this by demoting all existing primary frames before promoting a new one.

---

## List frames

```
GET /v1/items/:id/attributes
```

**Scopes:** `items:read`

Returns all interpretive frames on this item, ordered by creation time (oldest first).

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "frame-uuid-1",
      "item_id": "a1b2c3d4-...",
      "workspace_id": "ws-uuid",
      "frame_type": "problem",
      "title": "Customer cannot reconcile orders",
      "description": "Finance teams spend 3+ hours per week manually reconciling order data that should auto-sync.",
      "is_primary": true,
      "created_at": "2026-03-10T09:00:00Z",
      "updated_at": "2026-03-10T09:00:00Z"
    },
    {
      "id": "frame-uuid-2",
      "item_id": "a1b2c3d4-...",
      "workspace_id": "ws-uuid",
      "frame_type": "opportunity",
      "title": "Upsell to real-time sync tier",
      "description": "Solving this opens a natural upgrade path for enterprise customers who need sub-minute sync.",
      "is_primary": false,
      "created_at": "2026-03-11T11:30:00Z",
      "updated_at": "2026-03-11T11:30:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Upsert frames

```
PATCH /v1/items/:id/attributes
```

**Scopes:** `items:write`

Upserts one or more frames on the item in a single call.

- Frames that include an `id` field update that existing frame.
- Frames without an `id` field are inserted as new frames.
- If any frame has `is_primary: true`, all other frames on the item are demoted to `is_primary: false` first (the partial unique index enforces at-most-one primary per item).

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `frames` | array | **required** | Array of frame objects to upsert |

Each frame object:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | uuid | | Omit to insert; include to update an existing frame |
| `frame_type` | string | **required** | `problem`, `opportunity`, `risk`, `constraint`, `hypothesis`, or `goal` |
| `title` | string | **required** | Short label |
| `description` | string | **required** | Full framing statement |
| `is_primary` | boolean | | Pass `true` to promote this frame to canonical |

**Add a new primary frame:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "opportunity",
        "title": "Expand into APAC",
        "description": "Solving order reconciliation removes the last blocker to launching in Japan and Singapore.",
        "is_primary": true
      }
    ]
  }'
```

**Response:** `200 OK` — array of the upserted frame objects.

**Update an existing frame and add a new one in one call:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "id": "frame-uuid-1",
        "title": "Customer cannot reconcile orders (updated)",
        "description": "Finance teams spend 3–5 hours per week on reconciliation.",
        "frame_type": "problem"
      },
      {
        "frame_type": "risk",
        "title": "Competitor ships similar feature",
        "description": "Two known competitors have this on their roadmap for Q3.",
        "is_primary": false
      }
    ]
  }'
```

---

## Delete a frame

```
DELETE /v1/items/:id/attributes/:frameId
```

**Scopes:** `items:write`

Removes a specific interpretive frame by its ID. The canonical frame (`is_primary = true`) can be deleted; callers are responsible for promoting another frame to canonical afterward if needed.

**Request:**

```bash
curl -X DELETE "$PAI_BASE/items/a1b2c3d4-.../attributes/frame-uuid-2" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": { "id": "frame-uuid-2", "deleted": true },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Frame types

| Type | When to use |
|---|---|
| `problem` | A pain point, gap, or failure mode experienced by a user or system |
| `opportunity` | A capability, market, or improvement worth capturing |
| `risk` | A potential negative outcome if the item is not addressed (or is addressed poorly) |
| `constraint` | A hard boundary that cannot be changed (budget, regulatory, technical) |
| `hypothesis` | An untested belief about value or behavior |
| `goal` | A desired end state the item moves toward |

Items can hold frames of multiple types simultaneously. The primary frame (`is_primary: true`) is the one displayed in session UIs and exported outputs.

---

## What's next

- [Items API](/docs/api/items/items) — core CRUD and value proposals
- [Item Relationships API](/docs/api/items/items-relationships) — dependencies, packages, aggregations
- [Tracks API](/docs/api/tracks) — `GET /v1/tracks/:id/readiness` to check how attributes affect readiness
