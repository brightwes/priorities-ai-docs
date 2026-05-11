---
title: Item Classification API
description: Read and write item category, frames, and altitude — the classification geometry that determines where an item sits in the prioritization system.
sidebar_label: Item Classification API
sidebar_position: 2
audience: Developers
status: published
---

# Item Classification

**Classification** is the first major section of an item in Priorities.ai. It covers three related concepts:

- **Item category** — the frame type that describes what kind of thing this is (problem, opportunity, risk, etc.)
- **Frames** — interpretive lenses attached to the item; one frame is canonical at any time
- **Altitude** — the scope and time horizon of the work, assessed per frame

Together, category and altitude determine the item's **Track Cell** — the comparison geometry that decides which other items this one can be ranked against.

---

## Frames

An **item frame** is an interpretive lens applied to an item. It captures *how* the organization understands a piece of work.

An item can carry frames of multiple types simultaneously. Exactly one frame is the **canonical frame** — the authoritative interpretation used in session displays, ranked outputs, and decision records.

### Frame types

| `frame_type` | When to use |
|---|---|
| `problem` | A gap, unresolved pain point, or failure mode your organization is facing |
| `opportunity` | A potential upside — market, user need, or strategic opening |
| `risk` | A threat or downside that must be managed, mitigated, or accepted |
| `commitment` | An obligation already made — delivery is expected by stakeholders or contract |
| `investment` | A resource allocation decision with an expected return |
| `solution` | A proposed response to a problem or opportunity |

The frame type shapes how participants evaluate an item during a session. A `risk` frame may have different scoring criteria than an `opportunity` frame even when both reference the same underlying work.

### Frame fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | uuid | — | Set by the system on creation |
| `item_id` | uuid | — | The item this frame belongs to |
| `frame_type` | string | **required** | One of the six types above |
| `title` | string | **required** | Narrative title for this framing |
| `description` | string | **required** | What this framing means for this item |
| `is_primary` | boolean | | `true` if this is the canonical frame. At most one frame per item may be primary. |
| `is_original` | boolean | | `true` if this was the first frame created for the item |
| `altitude_scoping_inputs` | object | | Three-question altitude assessment (see below) |
| `altitude_level` | string | | Altitude level `"1"`–`"5"` derived from scoping inputs |
| `created_by` | string | | User ID of the frame author |
| `workspace_id` | uuid | — | Set by the system from your API key |
| `created_at` | timestamp | — | ISO 8601 |

---

## Altitude

Every frame carries an independent altitude assessment. Altitude is a 1–5 scale describing the scope and time horizon of the work from the perspective of this framing.

**Why frames carry altitude, not items:** the same piece of work can be framed at different altitudes. An "API rate limiting" item might be a `problem` frame at altitude 2 (a near-term engineering fix) and a `risk` frame at altitude 4 (a platform scalability constraint with multi-year consequences). Each frame records its own altitude so switching the canonical frame automatically changes the altitude context fed to sessions.

### Altitude scoping inputs

The `altitude_scoping_inputs` object holds three raw answers:

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

Promoting a frame to canonical automatically demotes any existing primary frame. When calling `PATCH /v1/items/:id/classification` with `is_primary: true` on any frame, the API demotes all existing primary frames on that item before applying changes.

---

## List frames

```
GET /v1/items/:id/classification
```

**Scopes:** `items:read`

Returns all frames attached to the item in creation order.

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../classification" \
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
PATCH /v1/items/:id/classification
```

**Scopes:** `items:write`

Creates new frames or updates existing ones in a single call.

- Frames **with** an `id` field update that specific existing frame.
- Frames **without** an `id` field are inserted as new frames.
- If any frame in the payload has `is_primary: true`, all other frames on the item are demoted before applying changes.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `frames` | array | **required** | Array of frame objects |

**Request — insert a new frame:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../classification" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "risk",
        "title": "Regulatory exposure if data residency is not addressed",
        "description": "Enterprise customers in the EU will not sign contracts without a clear data residency story.",
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
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../classification" \
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
DELETE /v1/items/:id/classification/:frameId
```

**Scopes:** `items:write`

Removes a specific frame by its `id`. If you delete the canonical frame (`is_primary: true`), no frame will be primary until you promote another one.

**Request:**

```bash
curl -X DELETE "$PAI_BASE/items/a1b2c3d4-.../classification/frame-uuid-1" \
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

## Protection rings

Classification changes on items in protected contexts (active sessions or tracks) are subject to mutation rules. Changing the canonical frame or altitude is a comparability-sensitive mutation.

| Ring | Context | Mutation rules |
|---|---|---|
| Ring 3 | Not in track or session | Fully mutable |
| Ring 2 | In track, not in active session | Requires approval |
| Ring 1 | In active session | Admin approval + session disposition declaration required |

See [Protection Rings](/docs/concepts/protection-rings) for details.

---

## What's next

- [Item Attributes API](/docs/api/items/items-attributes) — value proposals and scoring
- [Item Relationships API](/docs/api/items/items-relationships) — dependencies, packages, aggregations
- [Item Activity API](/docs/api/items/items-activity) — provenance, history, and discussion
