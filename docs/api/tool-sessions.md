---
title: Tool Sessions API
description: Collaborative runs of a single prioritization tool. Participants submit, facilitator reveals and finalizes.
sidebar_label: Tool Sessions API
sidebar_position: 5
audience: Developers
status: published
---

# Tool Sessions

A Tool Session represents a collaborative run of a single prioritization tool within a session context. Each participant submits a response; the facilitator controls reveal and finalization.

This is the execution primitive where the actual judgment happens — the dot voting, the RICE scoring, the force ranking.

---

## Tool session lifecycle

```
collecting → revealed → finalized
```

| Phase | Description |
|-------|-------------|
| `collecting` | Open for participant submissions. In `hidden` vote mode, responses are not visible to other participants. |
| `revealed` | All responses visible to all participants. No new submissions accepted. |
| `finalized` | Responses aggregated, facilitator overrides applied, result locked. |

---

## Available tool types

| Tool type | Description |
|-----------|-------------|
| `dot_voting` | Participants allocate a budget of votes across items |
| `rice` | Each participant scores Reach, Impact, Confidence, Effort per item |
| `weighted_scoring` | Criteria-weighted scoring with configurable weights |
| `force_ranking` | Strict total-order ranking — drag-and-drop list ordering |
| `buy_a_feature` | Participants allocate a budget to "buy" features they want |
| `value_effort` | 2×2 matrix placement: value (y) vs. effort (x) |
| `kano` | Feature classification: basic, performance, excitement, indifferent, reverse |
| `moscow` | Must have, Should have, Could have, Won't have classification |
| `paired_comparison` | Pairwise comparison — every item vs every other item |

---

## List tool sessions

```
GET /v1/tool-sessions
```

**Scopes:** `tool_sessions:read`

**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| `session_id` | uuid | Filter by parent session |
| `phase` | string | Filter by phase (`collecting`, `revealed`, `finalized`) |

---

## Create a tool session

```
POST /v1/tool-sessions
```

**Scopes:** `tool_sessions:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | uuid | **required** | Parent prioritization session |
| `tool_type` | string | **required** | Tool type (see table above) |
| `tool_name` | string | | Display name for this tool run |
| `facilitator_id` | uuid | **required** | Facilitating user |
| `items` | array | | Item snapshots `[{id, name, description}]` |
| `participant_ids` | array | | Expected participant user IDs |
| `vote_mode` | string | | `"hidden"` (default) or `"live"` |

**Request:**

```bash
curl -X POST "$PAI_BASE/tool-sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-uuid",
    "tool_type": "dot_voting",
    "tool_name": "Initiative Vote — Round 1",
    "facilitator_id": "user-uuid",
    "items": [
      {"id": "item-1", "name": "Improve onboarding flow"},
      {"id": "item-2", "name": "Migrate to SSO"},
      {"id": "item-3", "name": "Reduce API latency"}
    ],
    "participant_ids": ["user-a", "user-b", "user-c"],
    "vote_mode": "hidden"
  }'
```

**Response:** `201 Created` with the tool session object.

---

## Get a tool session

```
GET /v1/tool-sessions/:id
```

**Scopes:** `tool_sessions:read`

Returns the tool session and all participant responses inline.

**Response:**

```json
{
  "data": {
    "id": "tool-session-uuid",
    "session_id": "session-uuid",
    "tool_type": "dot_voting",
    "phase": "collecting",
    "vote_mode": "hidden",
    "items": [
      {"id": "item-1", "name": "Improve onboarding flow"},
      {"id": "item-2", "name": "Migrate to SSO"},
      {"id": "item-3", "name": "Reduce API latency"}
    ],
    "participant_ids": ["user-a", "user-b", "user-c"],
    "responses": [
      {
        "id": "response-uuid",
        "participant_id": "user-a",
        "results": [
          {"item_id": "item-1", "votes": 5},
          {"item_id": "item-2", "votes": 3},
          {"item_id": "item-3", "votes": 2}
        ],
        "is_complete": true,
        "submitted_at": "2026-04-01T12:05:00Z"
      }
    ]
  },
  "meta": { ... }
}
```

---

## Update a tool session

```
PATCH /v1/tool-sessions/:id
```

**Scopes:** `tool_sessions:write`

Use to advance `phase` (`collecting` → `revealed`) or change `vote_mode` or item list.

**Request (reveal votes):**

```bash
curl -X PATCH "$PAI_BASE/tool-sessions/tool-session-uuid" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phase": "revealed"}'
```

---

## Submit a participant response

```
POST /v1/tool-sessions/:id/responses
```

**Scopes:** `tool_sessions:write`

Upserts the response for a participant. Calling again before reveal replaces the previous submission.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `participant_id` | uuid | **required** | Responding user |
| `participant_name` | string | | Display name |
| `results` | array | | Tool-specific result payload (see below) |
| `is_complete` | boolean | | Marks submission as final |

**Result payloads by tool type:**

```json
// dot_voting
{"item_id": "item-1", "votes": 5}

// rice
{"item_id": "item-1", "reach": 1000, "impact": 3, "confidence": 80, "effort": 5}

// force_ranking
{"item_id": "item-1", "rank": 1}

// value_effort
{"item_id": "item-1", "value": 8, "effort": 3}

// moscow
{"item_id": "item-1", "classification": "must_have"}
```

**Request:**

```bash
curl -X POST "$PAI_BASE/tool-sessions/tool-session-uuid/responses" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_id": "user-a",
    "results": [
      {"item_id": "item-1", "votes": 5},
      {"item_id": "item-2", "votes": 3},
      {"item_id": "item-3", "votes": 2}
    ],
    "is_complete": true
  }'
```

---

## Finalize a tool session

```
POST /v1/tool-sessions/:id/finalize
```

**Scopes:** `tool_sessions:write`

Advances to `finalized`, aggregates all responses into a result, and optionally applies facilitator overrides.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `facilitator_overrides` | object | | Manual adjustments to aggregate results |

**Request:**

```bash
curl -X POST "$PAI_BASE/tool-sessions/tool-session-uuid/finalize" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

> **Facilitator overrides** are recorded. When a facilitator adjusts the aggregate result, the override is part of the decision provenance — the original aggregate is preserved alongside the facilitator's adjustment and rationale.

---

## What's next

- [Sessions](/docs/api/sessions) — publish the session after tool sessions are finalized
- [Catchball](/docs/api/catchball) — submit proposals based on session results
- [Guide: run a headless session](/docs/guides/run-headless-session)
