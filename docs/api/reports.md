---
title: Reports API
description: Session reports, cycle reports, and item exports. Write-once read models for audit-quality provenance.
sidebar_label: Reports API
sidebar_position: 7
audience: Developers
status: published
---

# Reports

Reports are **write-once read models** — generated at finalization time, never recomputed. A session report generated today is identical to the same session report generated at audit time one year from now, because it reads from immutable result records.

This is a critical architecture decision. A "dynamic" report that recomputes from current state is not provenance — it is a description of current state that looks like history.

---

## Session report

```
GET /v1/reports/sessions/:id
```

**Scopes:** `reports:read`

Returns the full session report: session metadata, all result records (ranked items with scores), facilitator overrides, participant summary, and decision provenance.

Only available when session `state` is `RUN_COMPLETE` or `PUBLISHED`.

**Request:**

```bash
curl "$PAI_BASE/reports/sessions/session-uuid" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": {
    "session": {
      "id": "session-uuid",
      "name": "Q3 Initiative Ranking",
      "state": "PUBLISHED",
      "cycle_id": "cycle-uuid",
      "facilitator_id": "user-uuid",
      "criteria_config": { ... },
      "published_at": "2026-04-01T14:00:00Z"
    },
    "results": [
      {
        "item_id": "item-uuid-1",
        "item_name": "Improve onboarding flow",
        "rank": 1,
        "score": 87.5,
        "tool_type": "dot_voting",
        "participant_responses": [
          {"participant_id": "user-a", "votes": 5},
          {"participant_id": "user-b", "votes": 3}
        ],
        "facilitator_override": null
      },
      {
        "item_id": "item-uuid-2",
        "item_name": "Migrate authentication to SSO",
        "rank": 2,
        "score": 74.0,
        "tool_type": "dot_voting",
        "participant_responses": [
          {"participant_id": "user-a", "votes": 3},
          {"participant_id": "user-b", "votes": 6}
        ],
        "facilitator_override": null
      }
    ],
    "participant_summary": {
      "expected": 3,
      "responded": 2,
      "completion_rate": 0.67
    },
    "decision_id": "decision-uuid",
    "generated_at": "2026-04-01T14:00:00Z"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Cycle report

```
GET /v1/reports/cycles/:id
```

**Scopes:** `reports:read`

Returns the full cycle report: cycle metadata, all tracks and their readiness states, all sessions with states, and any published priority list.

**Request:**

```bash
curl "$PAI_BASE/reports/cycles/cycle-uuid" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": {
    "cycle": {
      "id": "cycle-uuid",
      "name": "Q3 2026 Prioritization",
      "status": "published",
      "owner_id": "user-uuid"
    },
    "tracks": [
      {
        "id": "track-uuid",
        "name": "Strategic Initiatives",
        "category": "initiative",
        "altitude": 3,
        "readiness_state": "S6",
        "sessions": [
          {
            "id": "session-uuid",
            "state": "PUBLISHED",
            "published_at": "2026-04-01T14:00:00Z"
          }
        ]
      }
    ],
    "published_priority_list": {
      "id": "list-uuid",
      "approved_at": "2026-04-02T09:00:00Z",
      "items": [
        {"item_id": "item-1", "rank": 1},
        {"item_id": "item-2", "rank": 2},
        {"item_id": "item-3", "rank": 3}
      ]
    },
    "generated_at": "2026-04-02T09:00:00Z"
  },
  "meta": { ... }
}
```

---

## Items export

```
GET /v1/reports/items
```

**Scopes:** `reports:read`

Returns up to 500 items with full field data. Available in JSON (default) or CSV (`Accept: text/csv`).

**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| `status` | string | Filter by item status |
| `category` | string | Filter by category |
| `include_attributes` | boolean | Include attribute frames (default: `false`) |
| `include_relationships` | boolean | Include relationships summary (default: `false`) |
| `page` | integer | Page number |
| `per_page` | integer | Max 500 |

**CSV export:**

```bash
curl "$PAI_BASE/reports/items?include_attributes=true" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Accept: text/csv" \
  > items.csv
```

---

## What's next

- [Sessions API](/docs/api/sessions) — session lifecycle before the report is available
- [Webhooks API](/docs/api/webhooks) — receive `session.published` in real time instead of polling
