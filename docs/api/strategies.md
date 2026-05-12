---
title: Strategies API
description: Manage strategies, strategic objectives, goals, and item-to-objective alignments.
sidebar_label: Strategies API
sidebar_position: 12
audience: Developers
status: published
---

# Strategies API

The strategy layer connects organizational direction to the work being prioritized. Three resources form the hierarchy:

- **Strategy** — a named strategic direction (the "why" above the work)
- **Strategic Objective** — a concrete outcome the strategy intends to achieve, optionally linked to a parent objective
- **Goal** — a measurable metric target that tracks progress toward a strategy or objective

All three live at `GET /v1/strategies`, `GET /v1/objectives`, and `GET /v1/goals` respectively.

---

## Strategies

### List strategies

```
GET /v1/strategies
```

**Scopes:** `strategies:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `page` | integer | Page number (default `1`) |
| `per_page` | integer | Results per page (default `20`, max `100`) |

**Request:**

```bash
curl "$PAI_BASE/strategies" \
  -H "Authorization: Bearer $PAI_KEY"
```

### Create a strategy

```
POST /v1/strategies
```

**Scopes:** `strategies:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Strategy name |
| `description` | string | | Narrative description |
| `created_by` | uuid | | User ID of the creator |

**Request:**

```bash
curl -X POST "$PAI_BASE/strategies" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Become the default planning layer for product teams",
    "description": "Own the workflow between strategy and execution for teams of 10–500 people.",
    "created_by": "user-uuid"
  }'
```

**Response:** `201 Created` — the created strategy object.

### Get a strategy

```
GET /v1/strategies/:id
```

**Scopes:** `strategies:read`

### Update a strategy

```
PATCH /v1/strategies/:id
```

**Scopes:** `strategies:write`

All fields except `id` and `workspace_id` are patchable.

### Delete a strategy

```
DELETE /v1/strategies/:id
```

**Scopes:** `strategies:write`

### List objectives for a strategy

```
GET /v1/strategies/:id/objectives
```

**Scopes:** `strategies:read`

Convenience alias for `GET /v1/objectives?strategy_id=:id`. Returns objectives ordered by `priority` ascending.

### List goals for a strategy

```
GET /v1/strategies/:id/goals
```

**Scopes:** `strategies:read`

Convenience alias for `GET /v1/goals?strategy_id=:id`.

---

## Strategic Objectives

Objectives are concrete outcomes that a strategy intends to achieve. They can be nested (parent/child) and optionally link to goals and desired outcomes.

### List objectives

```
GET /v1/objectives
```

**Scopes:** `strategies:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `strategy_id` | uuid | Filter by parent strategy |
| `status` | string | Filter by status |

### Create an objective

```
POST /v1/objectives
```

**Scopes:** `strategies:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Objective name |
| `strategy_id` | uuid | | Parent strategy |
| `parent_objective_id` | uuid | | Parent objective (for nested hierarchies) |
| `description` | string | | Full description |
| `time_horizon` | string | | e.g. `Q3 2026`, `18 months` |
| `priority` | integer | | Sort order (lower = higher priority) |
| `status` | string | | e.g. `active`, `achieved`, `deferred` |
| `created_by` | uuid | | User ID |

**Request:**

```bash
curl -X POST "$PAI_BASE/objectives" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reduce time-to-first-ranking to under 30 minutes",
    "strategy_id": "strategy-uuid",
    "time_horizon": "Q3 2026",
    "priority": 1,
    "status": "active"
  }'
```

### Get an objective

```
GET /v1/objectives/:id
```

**Scopes:** `strategies:read`

### Update an objective

```
PATCH /v1/objectives/:id
```

**Scopes:** `strategies:write`

### Delete an objective

```
DELETE /v1/objectives/:id
```

**Scopes:** `strategies:write`

### Priority mappings

Priority mappings link items to objectives with an alignment strength, expressing how strongly a given item contributes to the objective.

#### List priority mappings

```
GET /v1/objectives/:id/priority-mappings
```

**Scopes:** `strategies:read`

Returns mappings ordered by `alignment_strength` descending.

#### Add a priority mapping

```
POST /v1/objectives/:id/priority-mappings
```

**Scopes:** `strategies:write`

| Field | Type | Required | Description |
|---|---|---|---|
| `priority_id` | uuid | **required** | Item ID to link |
| `alignment_strength` | float | **required** | 0.0 (weak) to 1.0 (direct alignment) |
| `rationale` | string | | Why this item contributes to this objective |
| `created_by` | uuid | | User who created this mapping |

#### Remove a priority mapping

```
DELETE /v1/objectives/:id/priority-mappings/:mappingId
```

**Scopes:** `strategies:write`

---

## Goals

Goals are measurable metric targets that track progress toward a strategy or objective. Includes `metric_name`, `target_value`, `current_value`, and `unit` columns for quantitative tracking.

### List goals

```
GET /v1/goals
```

**Scopes:** `strategies:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `strategy_id` | uuid | Filter by parent strategy |
| `status` | string | Filter by status |

### Create a goal

```
POST /v1/goals
```

**Scopes:** `strategies:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Goal name |
| `strategy_id` | uuid | | Parent strategy |
| `description` | string | | Full description |
| `time_horizon` | string | | e.g. `EOY 2026` |
| `priority` | integer | | Sort order |
| `status` | string | | e.g. `active`, `achieved`, `missed` |
| `metric_name` | string | | The metric being tracked (e.g. `NPS`, `ARR`, `TTFR`) |
| `target_value` | number | | Target value for the metric |
| `current_value` | number | | Current observed value |
| `unit` | string | | Unit of measure (e.g. `%`, `$`, `minutes`) |
| `created_by` | uuid | | User ID |

**Request:**

```bash
curl -X POST "$PAI_BASE/goals" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Time-to-first-ranking under 30 minutes",
    "strategy_id": "strategy-uuid",
    "metric_name": "TTFR",
    "target_value": 30,
    "current_value": 94,
    "unit": "minutes",
    "status": "active"
  }'
```

### Get a goal

```
GET /v1/goals/:id
```

**Scopes:** `strategies:read`

### Update a goal

```
PATCH /v1/goals/:id
```

**Scopes:** `strategies:write`

### Delete a goal

```
DELETE /v1/goals/:id
```

**Scopes:** `strategies:write`

---

## Scopes

| Scope | Grants |
|---|---|
| `strategies:read` | Read strategies, objectives, goals, priority mappings |
| `strategies:write` | Create, update, delete strategies, objectives, goals, mappings |

---

## What's next

- [Desired Outcomes API](/docs/api/desired-outcomes) — structured outcome briefs linked to objectives
- [Methodology Connections API](/docs/api/clarity-tools/methodology-connections) — connect clarity tools to strategies and objectives
- [Cycles API](/docs/api/cycles) — link strategies to prioritization cycles
