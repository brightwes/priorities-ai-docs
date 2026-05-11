---
title: Item Frames API
description: Read, write, and delete interpretive frames — the narrative context that shapes how an item is prioritized.
sidebar_label: Item Frames API
sidebar_position: 3
audience: Developers
status: published
---

# Item Frames

An **item frame** is an interpretive lens applied to a prioritization item. It captures *how* the organization understands a piece of work — as a problem to solve, an opportunity to capture, a risk to mitigate, a commitment to honor, an investment to make, or a solution to deploy.

Frames are first-class records. Each frame has its own title, description, and altitude assessment. An item can carry frames of multiple types simultaneously. Exactly one frame per item is the **canonical frame** — the authoritative interpretation used in session displays, ranked outputs, and decision records.

---

## Frame types

| `frame_type` | When to use |
|---|---|
| `problem` | A gap, unresolved pain point, or failure mode your organization is facing |
| `opportunity` | A potential upside — market, user need, or strategic opening |
| `risk` | A threat or downside that must be managed, mitigated, or accepted |
| `commitment` | An obligation already made — delivery is expected by stakeholders or contract |
| `investment` | A resource allocation decision with an expected return |
| `solution` | A proposed response to a problem or opportunity |

The frame type shapes how participants evaluate an item during a session. A `risk` frame may have different scoring criteria than an `opportunity` frame even when both reference the same underlying work.

---

## Frame fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | uuid | — | Set by the system on creation |
| `item_id` | uuid | — | The item this frame belongs to |
| `frame_type` | string | **required** | One of the six types above |
| `title` | string | **required** | Narrative title for this framing of the item |
| `description` | string | **required** | Narrative description — what this framing means for this item |
| `is_primary` | boolean | | `true` if this is the canonical frame. At most one frame per item may be primary. |
| `is_original` | boolean | | `true` if this was the first frame created for the item |
| `altitude_scoping_inputs` | object | | Three-question altitude assessment (see below) |
| `altitude_level` | string | | Computed altitude level `"1"`–`"5"` derived from scoping inputs |
| `created_by` | string | | User ID of the frame author |
| `workspace_id` | uuid | — | Set by the system from your API key |
| `created_at` | timestamp | — | ISO 8601 |

---

## Altitude

Every frame carries an independent altitude assessment. Altitude is a 1–5 scale describing the scope and time horizon of the work from the perspective of this framing.

**Why frames carry altitude, not items:** the same piece of work can be framed at different altitudes. An "API rate limiting" item might be a `problem` frame at altitude 2 (a near-term engineering fix) and a `risk` frame at altitude 4 (a platform scalability constraint with multi-year consequences). Each frame records its own altitude so switching the canonical frame automatically changes the altitude context fed to sessions.

### Altitude scoping inputs

The `altitude_scoping_inputs` object holds the three raw scoping answers:

| Key | Description | Example values |
|---|---|---|
| `timeHorizon` | When the work delivers value | `"days"`, `"weeks"`, `"quarters"`, `"years"`, `"multi-year"` |
| `workSize` | How much organizational effort is involved | `"task"`, `"project"`, `"program"`, `"initiative"`, `"transformation"` |
| `impactSurface` | Who or what is affected | `"individual"`, `"team"`, `"department"`, `"organization"`, `"market"` |

### Altitude levels

| Level | Interpretation |
|---|---|
| `"1"` | Operational — a discrete task or fix, days to weeks, individual impact |
| `"2"` | Tactical — a contained project, weeks to a quarter, team impact |
| `"3"` | Program — a multi-project initiative, one to two quarters, departmental impact |
| `"4"` | Strategic — a multi-initiative program, one to two years, organizational impact |
| `"5"` | Transformational — enterprise-wide shift, multi-year horizon, market-level impact |

`altitude_level` is computed by the platform from `altitude_scoping_inputs` and stored on the frame.

---

## The canonical frame

One frame per item can be marked `is_primary: true`. This is the **canonical frame** — the interpretation that:

- Appears in session participant views during scoring
- Is recorded in ranked output snapshots
- Determines which `frame_type` and `altitude_level` are reported in exports and webhooks

Promoting a frame to canonical automatically demotes any existing primary frame. The system enforces this at the database level (partial unique index on `item_id WHERE is_primary = true`). When calling `PATCH /v1/items/:id/attributes` with `is_primary: true` on any frame, the API demotes all existing primary frames on that item before applying your changes.

---

## List frames

```
GET /v1/items/:id/attributes
```

**Scopes:** `items:read`

Returns all frames attached to the item in creation order.

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
      "frame_type": "problem",
      "title": "Customers can't prioritize across teams",
      "description": "The lack of a shared prioritization surface means each team prioritizes independently, causing misalignment at the portfolio level.",
      "is_primary": true,
      "is_original": true,
      "altitude_scoping_inputs": {
        "timeHorizon": "quarters",
        "workSize": "program",
        "impactSurface": "organization"
      },
      "altitude_level": "3",
      "created_by": "user-uuid",
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-20T10:00:00Z"
    },
    {
      "id": "frame-uuid-2",
      "item_id": "a1b2c3d4-...",
      "frame_type": "opportunity",
      "title": "Unified prioritization surface across functions",
      "description": "Solving the cross-team visibility gap opens a wedge into enterprise accounts that currently use ad-hoc spreadsheets.",
      "is_primary": false,
      "is_original": false,
      "altitude_scoping_inputs": {
        "timeHorizon": "years",
        "workSize": "initiative",
        "impactSurface": "market"
      },
      "altitude_level": "4",
      "created_by": "user-uuid",
      "workspace_id": "workspace-uuid",
      "created_at": "2026-03-22T09:15:00Z"
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

Creates new frames or updates existing ones in a single call.

- Frames **with** an `id` field update that specific existing frame.
- Frames **without** an `id` field are inserted as new frames.
- If any frame in the payload has `is_primary: true`, all other frames on the item are demoted to `is_primary: false` before applying changes.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `frames` | array | **required** | Array of frame objects. See field reference above. |

**Request — insert a new frame:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "risk",
        "title": "Regulatory exposure if data residency is not addressed",
        "description": "Enterprise customers in the EU will not sign contracts without a clear data residency story. This is a blocker for the top 3 pipeline deals.",
        "is_primary": false,
        "altitude_scoping_inputs": {
          "timeHorizon": "quarters",
          "workSize": "project",
          "impactSurface": "organization"
        },
        "altitude_level": "3"
      }
    ]
  }'
```

**Request — promote an existing frame to canonical:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "id": "frame-uuid-2",
        "is_primary": true
      }
    ]
  }'
```

**Response:** `200 OK` — array of upserted frames.

---

## Delete a frame

```
DELETE /v1/items/:id/attributes/:frameId
```

**Scopes:** `items:write`

Removes a specific frame by its `id`. The canonical frame (`is_primary: true`) can be deleted — if you delete the canonical frame, no frame will be primary until you promote another one via `PATCH`.

**Request:**

```bash
curl -X DELETE "$PAI_BASE/items/a1b2c3d4-.../attributes/frame-uuid-1" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": { "id": "frame-uuid-1", "deleted": true },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Working with frames

### Multiple frames, one canonical

An item can have several frames representing different analytical perspectives. When running a session, participants see the canonical frame's `title`, `description`, and `frame_type`. You can update the canonical frame without re-entering session criteria — the frame swap propagates automatically to the session's item display.

```bash
# Add a second framing without disturbing the current canonical
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "commitment",
        "title": "Q3 board-committed delivery",
        "description": "This was committed to the board in February. It is not optional.",
        "is_primary": false
      }
    ]
  }'
```

### Setting altitude at frame creation

Supply `altitude_scoping_inputs` and `altitude_level` at the time you create or update a frame. The platform stores both — the raw inputs (so users can revisit their reasoning) and the computed level (so sessions and reports can filter and sort without re-deriving it).

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "investment",
        "title": "Platform extensibility investment",
        "description": "Investing in the plugin architecture now reduces integration cost by an estimated 40% over the next two years.",
        "is_primary": true,
        "altitude_scoping_inputs": {
          "timeHorizon": "years",
          "workSize": "initiative",
          "impactSurface": "organization"
        },
        "altitude_level": "4"
      }
    ]
  }'
```

---

## What's next

- [Items API](/docs/api/items/items) — create and manage items
- [Item Relationships API](/docs/api/items/items-relationships) — dependencies, contributions, decompositions
- [Sessions API](/docs/api/sessions) — sessions use the canonical frame for participant display
- [Concepts: comparability and tracks](/docs/concepts/comparability-and-tracks) — how altitude feeds track scoping
