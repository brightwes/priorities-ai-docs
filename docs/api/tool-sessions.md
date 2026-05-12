---
title: Tool Sessions API
description: Collaborative runs of a single prioritization tool. Participants submit, facilitator reveals and finalizes with a computed aggregate result.
sidebar_label: Tool Sessions API
sidebar_position: 5
audience: Developers
status: published
---

# Tool Sessions

A Tool Session represents a collaborative run of a single prioritization tool within a session context. Each participant submits a response; the facilitator controls reveal and finalization. At finalization, the API computes the aggregate result — ranked items, scores, or classifications — directly from all participant responses.

---

## Tool session lifecycle

```
collecting → revealed → finalized
```

| Phase | Description |
|-------|-------------|
| `collecting` | Open for participant submissions. In `hidden` vote mode, responses are not visible to other participants. |
| `revealed` | All responses visible to all participants. No new submissions accepted. |
| `finalized` | Responses aggregated into `aggregate_result`. Facilitator overrides applied. Result locked. |

---

## Tool types

The canonical tool types from the registry. Use these exact strings as `tool_type`.

### Voting and allocation

| `tool_type` | Description | Aggregate output |
|-------------|-------------|-----------------|
| `dot_voting` | Participants allocate a budget of votes across items | Sum votes per item → rank descending |
| `buy_a_feature` | Participants allocate a budget to "buy" items | Sum budget spent per item → rank descending |

### Ranking

| `tool_type` | Description | Aggregate output |
|-------------|-------------|-----------------|
| `pairwise_ranking` | Head-to-head comparisons derive an ordering | Count wins per item → rank descending |
| `stack_ranking` | Direct total ordering — drag-and-drop list | Average rank across participants → rank ascending |
| `max_priorities_pyramid` | Staged narrowing from many to few | Pass-through (no multi-participant aggregate) |

### Scoring

| `tool_type` | Description | Aggregate output |
|-------------|-------------|-----------------|
| `rice` | Reach × Impact × Confidence ÷ Effort | Average R/I/C/E → compute score → rank descending |
| `simple_weighted_scoring` | Weighted scoring across selected criteria | Average weighted score per item → rank descending |
| `wsjf` | Cost of Delay ÷ Job Size | Average CoD/Job Size → compute ratio → rank descending |
| `cost_of_delay` | Time-based value estimation | Pass-through (single-user estimate) |
| `pareto_analysis` | 80/20 vital few from existing scores | Pass-through (derived from existing scores) |
| `ahp` | Analytic Hierarchy Process | Pass-through (complex eigenvector calc) |
| `magic_prioritization` | Urgency × Value ÷ Duration (qualitative CD3) | Average urgency/value/duration → CD3 score → rank |

### Frameworks and matrices

| `tool_type` | Description | Aggregate output |
|-------------|-------------|-----------------|
| `impact_effort_matrix` | 2×2 placement: impact vs effort | Average impact/effort → ratio → quadrant assignment |
| `eisenhower_matrix` | 2×2: urgent/important quadrants | Plurality quadrant per item |
| `moscow` | Must / Should / Could / Won't classification | Plurality classification per item |
| `speed_boat` | Engines, anchors, rocks, life preservers | Plurality category per item |
| `prune_product_tree` | Value/impact/feasibility rating + prune decision | Average composite score, majority-pruned items excluded |
| `fast_vs_right` | Decision guidance: urgency vs correctness | Pass-through (single decision context) |

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

Returns the tool session with all participant responses inline. After finalization, `aggregate_result` is populated.

**Response:**

```json
{
  "data": {
    "id": "tool-session-uuid",
    "session_id": "session-uuid",
    "tool_type": "dot_voting",
    "phase": "finalized",
    "vote_mode": "hidden",
    "items": [
      {"id": "item-1", "name": "Improve onboarding flow"},
      {"id": "item-2", "name": "Migrate to SSO"},
      {"id": "item-3", "name": "Reduce API latency"}
    ],
    "aggregate_result": {
      "tool_type": "dot_voting",
      "participant_count": 3,
      "items": [
        {"item_id": "item-1", "name": "Improve onboarding flow", "total_votes": 14, "rank": 1},
        {"item_id": "item-3", "name": "Reduce API latency", "total_votes": 9, "rank": 2},
        {"item_id": "item-2", "name": "Migrate to SSO", "total_votes": 7, "rank": 3}
      ]
    },
    "facilitator_overrides": null,
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

### Response payload formats by tool type

```json
// dot_voting — votes per item
[{"item_id": "item-1", "votes": 5}, {"item_id": "item-2", "votes": 3}]

// buy_a_feature — budget amount spent per item
[{"item_id": "item-1", "amount": 40}, {"item_id": "item-2", "amount": 10}]

// pairwise_ranking — winner of each head-to-head comparison
[{"winner_id": "item-1"}, {"winner_id": "item-1"}, {"winner_id": "item-3"}]

// stack_ranking — ordered list (rank 1 = highest priority)
[{"item_id": "item-1", "rank": 1}, {"item_id": "item-3", "rank": 2}, {"item_id": "item-2", "rank": 3}]

// rice — RICE components per item
[{"item_id": "item-1", "reach": 1000, "impact": 3, "confidence": 80, "effort": 5}]

// simple_weighted_scoring — composite weighted score per item
[{"item_id": "item-1", "score": 87.5}, {"item_id": "item-2", "score": 62.0}]

// wsjf — Cost of Delay and Job Size per item
[{"item_id": "item-1", "cost_of_delay": 8, "job_size": 3}]

// impact_effort_matrix — placement on 1-10 scale
[{"item_id": "item-1", "impact": 8, "effort": 3}, {"item_id": "item-2", "impact": 5, "effort": 7}]

// moscow — one classification per item
[{"item_id": "item-1", "classification": "must_have"}, {"item_id": "item-2", "classification": "could_have"}]

// eisenhower_matrix — quadrant per item
[{"item_id": "item-1", "quadrant": "do"}, {"item_id": "item-2", "quadrant": "schedule"}]

// speed_boat — category per item
[{"item_id": "item-1", "category": "engine"}, {"item_id": "item-2", "category": "anchor"}]

// prune_product_tree — ratings + pruning decision per item
[{"item_id": "item-1", "value": 4, "impact": 5, "feasibility": 3, "pruned": false}]

// magic_prioritization — urgency, value, duration per item
[{"item_id": "item-1", "urgency": 3, "value": 4, "duration": 2}]
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

Advances to `finalized`, **computes the aggregate result** from all complete participant responses, and optionally applies facilitator overrides on top. The original aggregate is always preserved alongside any overrides.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `facilitator_overrides` | object | | Manual adjustments to the aggregate result |

**Request:**

```bash
curl -X POST "$PAI_BASE/tool-sessions/tool-session-uuid/finalize" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** includes the tool session with `aggregate_result` populated and all participant responses:

```json
{
  "data": {
    "id": "tool-session-uuid",
    "phase": "finalized",
    "tool_type": "rice",
    "aggregate_result": {
      "tool_type": "rice",
      "participant_count": 4,
      "items": [
        {
          "item_id": "item-1",
          "name": "Improve onboarding flow",
          "avg_reach": 850,
          "avg_impact": 3.25,
          "avg_confidence": 72.5,
          "avg_effort": 4.0,
          "score": 500.15,
          "rank": 1
        },
        {
          "item_id": "item-2",
          "name": "Migrate to SSO",
          "avg_reach": 600,
          "avg_impact": 2.75,
          "avg_confidence": 65.0,
          "avg_effort": 6.5,
          "score": 165.0,
          "rank": 2
        }
      ]
    },
    "facilitator_overrides": null,
    "responses": [ ... ]
  }
}
```

### Aggregate result shapes by tool type

| Tool | Key fields in each item |
|------|------------------------|
| `dot_voting` | `total_votes`, `rank` |
| `buy_a_feature` | `total_budget`, `rank` |
| `pairwise_ranking` | `win_count`, `rank` |
| `stack_ranking` | `average_rank`, `response_count`, `rank` |
| `rice` | `avg_reach`, `avg_impact`, `avg_confidence`, `avg_effort`, `score`, `rank` |
| `simple_weighted_scoring` | `average_score`, `response_count`, `rank` |
| `wsjf` | `avg_cost_of_delay`, `avg_job_size`, `score`, `rank` |
| `magic_prioritization` | `avg_urgency`, `avg_value`, `avg_duration`, `cd3_score`, `rank` |
| `impact_effort_matrix` | `avg_impact`, `avg_effort`, `ratio`, `quadrant`, `rank` |
| `moscow` | `classification`, `vote_breakdown` |
| `eisenhower_matrix` | `quadrant`, `vote_breakdown` |
| `speed_boat` | `category`, `vote_breakdown` |
| `prune_product_tree` | `avg_value`, `avg_impact`, `avg_feasibility`, `score`, `pruned`, `rank` |
| `cost_of_delay`, `pareto_analysis`, `ahp`, `max_priorities_pyramid`, `fast_vs_right` | Pass-through — item ids only |

### Facilitator overrides

When a facilitator adjusts the aggregate result, the override is stored in `facilitator_overrides` alongside the unmodified `aggregate_result`. Both are always returned — the original aggregate is permanent provenance.

```json
{
  "facilitator_overrides": {
    "rationale": "item-3 was moved to rank 1 — regulatory deadline confirmed after session",
    "items": [
      {"item_id": "item-3", "rank": 1},
      {"item_id": "item-1", "rank": 2},
      {"item_id": "item-2", "rank": 3}
    ]
  }
}
```

---

## What's next

- [Sessions](/docs/api/sessions) — publish the session after tool sessions are finalized
- [Catchball](/docs/api/catchball) — submit proposals based on session results
- [Reports](/docs/api/reports) — pull the full session report with provenance after publication
