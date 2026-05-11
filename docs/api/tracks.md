---
title: Tracks API
description: Create and manage tracks — the S1–S6 execution containers within a cycle or standalone.
sidebar_label: Tracks API
sidebar_position: 5
audience: Developers
status: published
---

# Tracks

A **Track** is the execution container for a single prioritization effort. It holds the six stages of preparation (S1 Participation → S2 Pool → S3 Criteria → S4 Scales → S5 Values → S6 Ranking) and owns the sessions that produce ranked output.

Tracks can be **cycle-linked** (created inside a Cycle and governed by its phase) or **standalone** (independent of any Cycle, used for ad-hoc prioritization).

---

## Track stages

| Stage | Name | What it requires |
|---|---|---|
| S1 | Participation | At least one participant added and participation locked |
| S2 | Pool | Item pool assembled and locked |
| S3 | Criteria | At least one criterion configured and criteria locked |
| S4 | Scales | All criteria have accepted value ranges |
| S5 | Values | At least one accepted value proposal exists for the pool |
| S6 | Tool-ready | All S1–S5 prerequisites met |

Use `GET /v1/tracks/:id/readiness` to check which stages are complete and what's blocking each one.

---

## List tracks

```
GET /v1/tracks
```

**Scopes:** `cycles:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `cycle_id` | uuid | Filter to tracks belonging to a specific cycle |
| `standalone` | boolean | `true` to return only standalone tracks |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

**Request:**

```bash
curl "$PAI_BASE/tracks?cycle_id=cycle-uuid" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

## Create a track

```
POST /v1/tracks
```

**Scopes:** `cycles:write`

Omit `cycle_id` to create a standalone track. Include it to create a cycle-linked track (equivalent to `POST /v1/cycles/:id/tracks`).

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Track name |
| `cycle_id` | uuid | | Parent cycle. Omit for standalone. |
| `description` | string | | Track description |
| `category` | string | | Item category this track evaluates |
| `altitude` | integer | | Altitude level (1–5) this track operates at |

**Request:**

```bash
curl -X POST "$PAI_BASE/tracks" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Strategic Initiatives — Q3",
    "cycle_id": "cycle-uuid",
    "category": "initiative",
    "altitude": 4
  }'
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "track-uuid",
    "workspace_id": "...",
    "cycle_id": "cycle-uuid",
    "name": "Strategic Initiatives — Q3",
    "category": "initiative",
    "altitude": 4,
    "is_standalone": false,
    "readiness_state": null,
    "created_at": "2026-04-01T12:00:00Z"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Get a track

```
GET /v1/tracks/:id
```

**Scopes:** `cycles:read`

---

## Update a track

```
PATCH /v1/tracks/:id
```

**Scopes:** `cycles:write`

`cycle_id` and `is_standalone` are immutable after creation. All other fields can be updated.

---

## Delete a track

```
DELETE /v1/tracks/:id
```

**Scopes:** `cycles:write`

---

## Get track readiness

```
GET /v1/tracks/:id/readiness
```

**Scopes:** `cycles:read`

Calls the `evaluate_track_readiness` RPC. Returns the readiness status for each of the six preparation stages with specific blockers for each incomplete stage.

**Response:**

```json
{
  "data": {
    "track_id": "track-uuid",
    "track_name": "Strategic Initiatives — Q3",
    "cycle_id": "cycle-uuid",
    "s1_participation": { "ready": true, "blockers": [] },
    "s2_pool": { "ready": true, "blockers": [] },
    "s3_criteria": { "ready": false, "blockers": ["Criteria not locked"] },
    "s4_scales": { "ready": false, "blockers": ["2 scale(s) not accepted"] },
    "s5_values": { "ready": false, "blockers": ["No values entered"] },
    "s6_tool": {
      "ready": false,
      "blockers": [
        "Prerequisites not met",
        "S3: Criteria incomplete",
        "S4: Scales incomplete",
        "S5: Values incomplete"
      ]
    },
    "all_prerequisites_met": false,
    "s6_ready": false
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Sessions

### List sessions for a track

```
GET /v1/tracks/:id/sessions
```

**Scopes:** `cycles:read`

Returns all sessions with `track_id` set to this track.

### Attach a session to a track

```
POST /v1/tracks/:id/sessions
```

**Scopes:** `cycles:write`

Calls the `link_session_to_track` RPC. If the track belongs to a Cycle, the session is promoted to `cycle_linked` and its `cycle_id` is set. Guards against linking a session that is already bound to a different cycle.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `session_id` | uuid | **required** | Existing session to attach |

**Request:**

```bash
curl -X POST "$PAI_BASE/tracks/track-uuid/sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "session-uuid"}'
```

---

## Participants

Effective track participants are the union of: cycle direct users + cycle groups + track direct users + track groups. Use `GET /v1/tracks/:id/readiness` to see the effective count against the S1 requirement.

### List participants

```
GET /v1/tracks/:id/participants
```

**Scopes:** `cycles:read`

Returns `{ direct: [...], groups: [...] }` — direct user participants and group participants separately.

### Add a participant

```
POST /v1/tracks/:id/participants
```

**Scopes:** `cycles:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | uuid | one of | Direct user participant |
| `group_id` | uuid | one of | Group participant |
| `role` | string | | `contributor` (default) or `facilitator` |
| `added_by` | uuid | **required** | Actor performing the addition |

### Remove a participant

```
DELETE /v1/tracks/:id/participants/:uid
```

**Scopes:** `cycles:write`

`:uid` is either a `user_id` or `group_id`. The route tries both.

---

## Item pool

The item pool is the set of items eligible for scoring in this track. S2 readiness requires at least one item in the pool and the pool locked.

### Get item pool

```
GET /v1/tracks/:id/item-pool
```

**Scopes:** `cycles:read`

Returns the `item_pools` record(s) for this track, including `priority_ids` (the ordered list of item UUIDs) and `pool_locked_at`.

---

## Criteria

Criteria are the evaluation dimensions participants score items against (Stage 3 — Criteria Selection, Stage 4 — Scales). Each criterion maps to a `cycle_attribute_configs` row.

### List criteria

```
GET /v1/tracks/:id/criteria
```

**Scopes:** `cycles:read`

Returns all criteria configurations scoped to this track, including `attribute_key`, `range_status`, `range_value`, and governance role assignments.

---

## What's next

- [Cycles API](/docs/api/cycles) — the parent governance container
- [Sessions API](/docs/api/sessions) — create ranking sessions within a track
- [Concepts: comparability and tracks](/docs/concepts/comparability-and-tracks) — why tracks exist and how they scope comparisons
