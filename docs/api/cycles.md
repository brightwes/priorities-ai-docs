---
title: Cycles API
description: Governance containers for prioritization efforts. Create, configure, and transition cycles.
sidebar_label: Cycles API
sidebar_position: 3
audience: Developers
status: published
---

# Cycles

A Cycle is the top-level governance container for a prioritization effort. It has phases, owners, tracks, sessions, and ultimately produces a Published Priority List as its authoritative output.

Cycle phase transitions enforce the authority model. **All phase changes must go through the `transition` endpoint** — direct status updates are not permitted for governance compliance.

---

## Cycle phases

```
draft → planning → execution → published → closed
```

The exact phase set is configurable per workspace. Phase transitions are governed by the authority model — only the Cycle Owner and authorized administrators can advance phases.

---

## List cycles

```
GET /v1/cycles
```

**Scopes:** `cycles:read`

**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| `status` | string | Filter by cycle status |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

**Request:**

```bash
curl "$PAI_BASE/cycles" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

## Create a cycle

```
POST /v1/cycles
```

**Scopes:** `cycles:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **required** | Cycle name |
| `description` | string | | Cycle description |
| `owner_id` | uuid | | Cycle owner user ID |

**Request:**

```bash
curl -X POST "$PAI_BASE/cycles" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q3 2026 Product Prioritization",
    "description": "Strategic initiatives and technical investments for Q3",
    "owner_id": "user-uuid"
  }'
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "cycle-uuid",
    "workspace_id": "...",
    "name": "Q3 2026 Product Prioritization",
    "description": "Strategic initiatives and technical investments for Q3",
    "status": "draft",
    "owner_id": "user-uuid",
    "created_at": "2026-04-01T12:00:00Z",
    "updated_at": "2026-04-01T12:00:00Z"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Get a cycle

```
GET /v1/cycles/:id
```

**Scopes:** `cycles:read`

---

## Update a cycle

```
PATCH /v1/cycles/:id
```

**Scopes:** `cycles:write`

Updates `name`, `description`, or `owner_id`. Does not update `status` — use the transition endpoint for phase changes.

---

## List tracks for a cycle

```
GET /v1/cycles/:id/tracks
```

**Scopes:** `cycles:read`

Returns all Track Instances belonging to the cycle. A Track Instance is the realization of a Track Cell (Item Category × Altitude) within this cycle.

**Response:**

```json
{
  "data": [
    {
      "id": "track-uuid",
      "cycle_id": "cycle-uuid",
      "name": "Strategic Initiatives",
      "category": "initiative",
      "altitude": 3,
      "readiness_state": "S4",
      "workspace_id": "..."
    }
  ],
  "meta": { ... }
}
```

**Track readiness states** (S1–S6):

| State | Condition satisfied |
|-------|-------------------|
| S1 | Participation configured |
| S2 | Item pool assembled |
| S3 | Criteria selected |
| S4 | Scales defined |
| S5 | Values complete |
| S6 | Ready for ranking |

---

## Transition cycle phase

```
POST /v1/cycles/:id/transition
```

**Scopes:** `cycles:write`

Calls the `transition_cycle_phase` RPC. **All cycle phase changes must use this endpoint.** Direct status updates are rejected.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to_phase` | string | **required** | Target phase |
| `actor_id` | uuid | | User performing the transition. Defaults to the API key owner. |
| `reason` | string | | Reason for the transition — recorded in governance events |

**Request:**

```bash
curl -X POST "$PAI_BASE/cycles/cycle-uuid/transition" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to_phase": "execution",
    "actor_id": "user-uuid",
    "reason": "All tracks confirmed ready. Participant confirmations received."
  }'
```

**Response:**

```json
{
  "data": {
    "id": "cycle-uuid",
    "status": "execution",
    "transitioned_by": "user-uuid",
    "transitioned_at": "2026-04-01T12:00:00Z"
  },
  "meta": { ... }
}
```

> **Note:** Phase transitions are governance events. Every transition is recorded with the actor, timestamp, and reason. These appear in the governance events table and are linked to the cycle's decision provenance.

---

## What's next

- [Sessions API](/docs/api/sessions) — create sessions within a cycle
- [Catchball API](/docs/api/catchball) — manage authority exchanges within a cycle
- [Concepts: state machines](/docs/concepts/state-machines) — cycle, session, and POR state machines
