---
title: Goals API
description: Manage measurable metric targets that track progress toward strategies and objectives.
sidebar_label: Goals API
sidebar_position: 14
audience: Developers
status: published
---

# Goals API

A **goal** is a measurable metric target that tracks progress toward a strategy or objective. Goals have a metric name, target value, current value, and unit — making them directly observable over time.

**Scope:** `strategies:read` / `strategies:write`

---

## Endpoints

### `GET /v1/goals`

Lists goals for the workspace.

**Query params:** `strategy_id`, `status`, `page`, `per_page`

```bash
curl "$PAI_BASE/goals?strategy_id=strategy-uuid" -H "Authorization: Bearer $PAI_KEY"
```

### `POST /v1/goals`

Creates a goal.

**Required:** `name`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Goal name |
| `strategy_id` | uuid | | Parent strategy |
| `description` | string | | Full description |
| `time_horizon` | string | | e.g. `EOY 2026` |
| `priority` | integer | | Sort order |
| `status` | string | | `active`, `achieved`, `missed` |
| `metric_name` | string | | The metric being tracked (e.g. `NPS`, `ARR`, `TTFR`) |
| `target_value` | number | | Target value for the metric |
| `current_value` | number | | Current observed value |
| `unit` | string | | Unit of measure (e.g. `%`, `$`, `minutes`) |
| `created_by` | uuid | | User ID |

```json
{
  "name": "Time-to-first-ranking under 30 minutes",
  "strategy_id": "strategy-uuid",
  "metric_name": "TTFR",
  "target_value": 30,
  "current_value": 94,
  "unit": "minutes",
  "status": "active"
}
```

**Response:** `201 Created` — the created goal.

```json
{
  "data": {
    "id": "uuid",
    "workspace_id": "uuid",
    "name": "Time-to-first-ranking under 30 minutes",
    "strategy_id": "strategy-uuid",
    "metric_name": "TTFR",
    "target_value": 30,
    "current_value": 94,
    "unit": "minutes",
    "status": "active",
    "created_at": "2026-05-11T00:00:00Z"
  }
}
```

### `GET /v1/goals/:id`

Returns a single goal.

### `PATCH /v1/goals/:id`

Updates a goal. Use this to update `current_value` as metrics are observed.

```json
// Update current progress
{
  "current_value": 42
}
```

### `DELETE /v1/goals/:id`

Deletes a goal.

---

## Tracking progress over time

Update `current_value` via `PATCH` as your metrics are observed. Pair with webhooks subscribed to `goal.updated` to trigger downstream alerts or dashboards when progress milestones are hit.

---

## What's next

- [Strategies API](/api/strategies) — the parent strategy layer
- [Objectives API](/api/objectives) — concrete outcomes goals measure toward
- [Desired Outcomes API](/api/desired-outcomes) — qualitative outcome briefs
