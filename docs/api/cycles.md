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

---

## Delete a cycle

```
DELETE /v1/cycles/:id
```

**Scopes:** `cycles:write`

---

## Create a track

```
POST /v1/cycles/:id/tracks
```

**Scopes:** `cycles:write`

Creates a new track inside this cycle. The track is automatically `cycle_linked` with `is_standalone: false`.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Track name |
| `description` | string | | Track description |
| `category` | string | | Item category this track evaluates |
| `altitude` | integer | | Altitude level (1–5) |

---

## Participants

Effective cycle participants are the union of direct users (`cycle_participants`) and group members (`cycle_participant_groups`). Both are resolved at runtime.

### List participants

```
GET /v1/cycles/:id/participants
```

**Scopes:** `cycles:read`

Returns `{ direct: [...], groups: [...] }`.

### Add a participant

```
POST /v1/cycles/:id/participants
```

**Scopes:** `cycles:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | uuid | one of | Direct user participant |
| `group_id` | uuid | one of | Group participant |
| `role` | string | | `contributor` (default) or `facilitator` |
| `added_by` | uuid | | Actor performing the addition |

### Remove a participant

```
DELETE /v1/cycles/:id/participants/:uid
```

**Scopes:** `cycles:write`

`:uid` is either a `user_id` or `group_id`.

---

## Criteria

Criteria are the evaluation dimensions for scoring items in this cycle's tracks. Each row in `cycle_attribute_configs` represents one criterion on one track.

### List criteria

```
GET /v1/cycles/:id/criteria
```

**Scopes:** `cycles:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `track_id` | uuid | Filter to a specific track within this cycle |

Returns `cycle_attribute_configs` rows including `attribute_key`, `range_status` (`pending` → `proposed` → `accepted`), `range_value` (the accepted scale), and governance role assignments.

### Create a criterion

```
POST /v1/cycles/:id/criteria
```

**Scopes:** `cycles:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `attribute_key` | string | **required** | Criterion identifier (e.g. `business_value`, `technical_effort`) |
| `track_id` | uuid | | Track to scope this criterion to |
| `range_definer_roles` | string[] | | Roles allowed to propose the value range |
| `range_approver_roles` | string[] | | Roles allowed to accept the value range |
| `value_proposer_roles` | string[] | | Roles allowed to submit value proposals (S5) |
| `value_approver_roles` | string[] | | Roles allowed to accept value proposals (S5) |
| `collection_method` | string | | How values are collected (`individual`, `facilitated`, `system`) |
| `requires_evidence` | boolean | | Whether evidence is required for a proposal |

### Update a criterion

```
PATCH /v1/cycles/:id/criteria/:cid
```

**Scopes:** `cycles:write`

Updates any criterion field. `cycle_id` is immutable.

### Delete a criterion

```
DELETE /v1/cycles/:id/criteria/:cid
```

**Scopes:** `cycles:write`

Removes a criterion configuration from this cycle. Only safe to call before scoring begins.

**Response:**

```json
{ "data": { "id": "cid-uuid", "deleted": true }, "meta": { ... } }
```

---

## Item pool

```
GET /v1/cycles/:id/item-pool
```

**Scopes:** `cycles:read`

Returns all item pools belonging to tracks in this cycle. Each pool includes `priority_ids` (ordered item UUIDs) and `pool_locked_at`.

To manage pool membership at the track level, use the [Tracks API](/docs/api/tracks).

---

## Approve priority list

```
POST /v1/cycles/:id/approve-priority-list
```

**Scopes:** `cycles:write`

**Authority transition (§2.3a).** Calls the `approve_priority_list` RPC. Atomically sets `leadership_approved = true` on the specified items and emits a `priority_list_approved` governance event. This is the non-Catchball path — use this when approving an item pool's above-cut items directly.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `actor_id` | uuid | **required** | Leader approving the list |
| `item_ids` | uuid[] | **required** | Items to approve (must be non-empty) |
| `loop_id` | uuid | | Catchball loop ID (if approving via Catchball path) |
| `note` | string | | Reason recorded in governance event |

**Request:**

```bash
curl -X POST "$PAI_BASE/cycles/cycle-uuid/approve-priority-list" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "actor_id": "exec-user-uuid",
    "item_ids": ["item-uuid-1", "item-uuid-2", "item-uuid-3"],
    "note": "Q3 strategic slate approved after executive review"
  }'
```

**Response:**

```json
{
  "data": {
    "success": true,
    "approvedCount": 3,
    "approvedAt": "2026-04-15T14:30:00Z",
    "approvedBy": "exec-user-uuid",
    "governanceEventId": "gov-event-uuid",
    "source": "item_pool"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

> **Governance:** Every approval is recorded in `governance_events` with `event_type = priority_list_approved`. This appears in `GET /v1/governance-events` and is delivered to webhooks subscribed to `governance.priority_list_approved`.

---

## Tool readiness

```
GET /v1/cycles/:id/tool-readiness
```

**Scopes:** `cycles:read`

Evaluates which prioritization tools are available for this cycle based on workflow state (pool locked, criteria defined, values entered). Returns structured blocker objects — not disabled flags — so the UI can show specific diagnostic guidance.

**Query params:** `tool_name` (optional) — evaluates a single tool. If omitted, evaluates all 18 registered tools.

**Single tool request:**

```bash
curl "$PAI_BASE/cycles/cycle-uuid/tool-readiness?tool_name=rice" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Single tool response:**

```json
{
  "data": {
    "tool_name": "rice",
    "cycle_id": "cycle-uuid",
    "available": false,
    "evaluated_at": "2026-05-11T20:00:00Z",
    "blockers": [
      {
        "code": "POOL_LOCKED",
        "title": "Item pool not locked",
        "why_it_matters": "RICE requires a stable, locked item set to produce comparable scores.",
        "current_state": "Pool contains 12 items but is not locked.",
        "remediation_route": "POST /v1/tracks/:id/item-pool/lock"
      }
    ]
  }
}
```

**All tools response:**

```json
{
  "data": {
    "cycle_id": "cycle-uuid",
    "evaluated_at": "2026-05-11T20:00:00Z",
    "tools": {
      "rice": { "available": false, "blockers": [...] },
      "dot_voting": { "available": true, "blockers": [] },
      "moscow": { "available": true, "blockers": [] }
    }
  }
}
```

---

## What's next

- [Tracks API](/docs/api/tracks) — manage tracks, participants, item pools, criteria, and readiness
- [Sessions API](/docs/api/sessions) — create sessions within a cycle
- [Catchball API](/docs/api/catchball) — manage authority exchanges within a cycle
- [Concepts: state machines](/docs/concepts/state-machines) — cycle, session, and POR state machines
