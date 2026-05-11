---
title: Item Attributes API
description: Read and write attribute values, value proposals, and accepted scoring data for any item.
sidebar_label: Item Attributes API
sidebar_position: 3
audience: Developers
status: published
---

# Item Attributes

**Attributes** are the scored dimensions of an item — the criteria-based values that inform prioritization. The **Values** section of the item detail in Priorities.ai exposes this data: what values have been proposed, which ones have been accepted, and what scoring gaps remain.

The attributes model has two layers:

1. **Value Proposals** — a stakeholder's proposed value for a specific attribute (e.g., "I think Impact is High"). Proposals are lightweight and revisable.
2. **Accepted Values** — a proposal that has been explicitly accepted by an authorized user, becoming the canonical value for that attribute on this item. Accepted values feed into session scoring and track readiness.

---

## Value proposals

A value proposal captures a participant's assessment of an item on a single scoring criterion.

### Value proposal fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Proposal record ID |
| `item_id` | uuid | The item this proposal applies to |
| `attribute_key` | string | The criterion being assessed (e.g. `"impact"`, `"effort"`, `"reach"`) |
| `value` | any | The proposed value — a number, string, or structured object depending on the criterion |
| `proposed_by` | uuid | User ID of the proposer |
| `session_id` | uuid | Session in which this proposal was made (optional) |
| `track_id` | uuid | Track this proposal is scoped to (optional) |
| `rationale` | string | Reasoning behind the proposed value (optional) |
| `status` | string | `proposed`, `accepted`, or `superseded` |
| `accepted_by` | uuid | User who accepted this proposal (set on acceptance) |
| `accepted_at` | timestamptz | When the proposal was accepted |
| `created_at` | timestamptz | When the proposal was created |

---

## List value proposals

```
GET /v1/items/:id/value-proposals
```

**Scopes:** `items:read`

Returns all value proposals for this item, newest first.

**Query params:**

| Param | Description |
|---|---|
| `status` | Filter by `proposed`, `accepted`, or `superseded` |

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../value-proposals" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "proposal-uuid-1",
      "item_id": "a1b2c3d4-...",
      "attribute_key": "impact",
      "value": "high",
      "proposed_by": "user-uuid",
      "rationale": "This affects every customer's daily workflow.",
      "status": "accepted",
      "accepted_by": "owner-uuid",
      "accepted_at": "2026-03-21T14:30:00Z",
      "session_id": null,
      "track_id": "track-uuid",
      "created_at": "2026-03-20T10:00:00Z"
    },
    {
      "id": "proposal-uuid-2",
      "item_id": "a1b2c3d4-...",
      "attribute_key": "effort",
      "value": 3,
      "proposed_by": "user-uuid-2",
      "rationale": "Estimated 3 team-weeks based on prior similar work.",
      "status": "proposed",
      "accepted_by": null,
      "accepted_at": null,
      "session_id": "session-uuid",
      "track_id": "track-uuid",
      "created_at": "2026-03-21T09:00:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

**Fetch only unresolved proposals:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../value-proposals?status=proposed" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

## Submit a value proposal

```
POST /v1/items/:id/value-proposals
```

**Scopes:** `items:write`

Submits a new proposed value for a specific attribute.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `attribute_key` | string | **required** | The criterion being assessed |
| `value` | any | **required** | The proposed value |
| `proposed_by` | uuid | **required** | User ID of the proposer |
| `session_id` | uuid | | Session context (optional) |
| `track_id` | uuid | | Track context (optional) |
| `rationale` | string | | Reasoning behind the proposal |

**Request:**

```bash
curl -X POST "$PAI_BASE/items/a1b2c3d4-.../value-proposals" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "attribute_key": "reach",
    "value": 8500,
    "proposed_by": "user-uuid",
    "track_id": "track-uuid",
    "rationale": "Based on MAU count for the affected feature surface."
  }'
```

**Response:** `201 Created` — the created proposal object.

---

## Accept a value proposal

```
POST /v1/items/:id/value-proposals/:proposalId/accept
```

**Scopes:** `items:write`

Accepts a specific proposal, promoting it to the canonical value for this attribute. The proposal's `status` becomes `accepted` and `accepted_by` / `accepted_at` are set.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `accepted_by` | uuid | **required** | User ID of the person accepting the proposal |

**Request:**

```bash
curl -X POST "$PAI_BASE/items/a1b2c3d4-.../value-proposals/proposal-uuid-2/accept" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "accepted_by": "owner-uuid" }'
```

**Response:** `200 OK` — the updated proposal with `status: "accepted"`.

---

## Value convergence and readiness

Accepted values feed directly into **track readiness**. The platform's `evaluate_track_readiness` RPC checks whether `values_converged_at` has been set on the track — which requires that all required criteria for items in the pool have accepted values.

Calling `GET /v1/tracks/:id/readiness` will tell you specifically which items have outstanding value gaps (S5 blockers).

---

## Attribute keys

Attribute keys are workspace-defined. Common built-in keys include:

| Key | Typical value type | Notes |
|---|---|---|
| `impact` | string (`low`, `medium`, `high`, `critical`) | Effect on outcomes if delivered |
| `effort` | number (1–10 or story points) | Cost to deliver |
| `reach` | number | Users or accounts affected |
| `confidence` | number (1–100) | Estimate confidence level |
| `time_criticality` | string or number | Urgency of delivery |

Custom keys can be defined per workspace in **Settings → Scoring Criteria**.

---

## What's next

- [Item Classification API](/docs/api/items/items-classification) — frames and altitude
- [Item Relationships API](/docs/api/items/items-relationships) — dependencies, packages, aggregations
- [Item Activity API](/docs/api/items/items-activity) — provenance, history, and discussion
- [Tracks API](/docs/api/tracks) — `GET /v1/tracks/:id/readiness` to check value completion
