---
title: Objectives API
description: Manage strategic objectives and their item-to-objective priority mappings.
sidebar_label: Objectives API
sidebar_position: 13
audience: Developers
status: published
---

# Objectives API

A **strategic objective** is a concrete outcome a strategy intends to achieve. Objectives can be nested (parent/child), linked to items via priority mappings, and connected to desired outcomes.

**Scope:** `strategies:read` / `strategies:write`

---

## Endpoints

### `GET /v1/objectives`

Lists objectives for the workspace.

**Query params:** `strategy_id`, `status`, `page`, `per_page`

```bash
curl "$PAI_BASE/objectives?strategy_id=strategy-uuid" -H "Authorization: Bearer $PAI_KEY"
```

### `POST /v1/objectives`

Creates an objective.

**Required:** `name`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **required** | Objective name |
| `strategy_id` | uuid | | Parent strategy |
| `parent_objective_id` | uuid | | Parent objective (for nested hierarchies) |
| `description` | string | | Full description |
| `time_horizon` | string | | e.g. `Q3 2026`, `18 months` |
| `priority` | integer | | Sort order (lower = higher priority) |
| `status` | string | | `active`, `achieved`, `deferred` |
| `created_by` | uuid | | User ID |

```json
{
  "name": "Reduce time-to-first-ranking to under 30 minutes",
  "strategy_id": "strategy-uuid",
  "time_horizon": "Q3 2026",
  "priority": 1,
  "status": "active"
}
```

### `GET /v1/objectives/:id`

Returns a single objective.

### `PATCH /v1/objectives/:id`

Updates an objective. All fields except `id` and `workspace_id` are patchable.

### `DELETE /v1/objectives/:id`

Deletes an objective.

---

## Priority mappings

Priority mappings link items to objectives, expressing how strongly a given item contributes to the objective.

### `GET /v1/objectives/:id/priority-mappings`

Returns mappings ordered by `alignment_strength` descending.

```json
{
  "data": [
    {
      "id": "uuid",
      "objective_id": "uuid",
      "priority_id": "item-uuid",
      "alignment_strength": 0.9,
      "rationale": "This directly drives our primary acquisition metric."
    }
  ]
}
```

### `POST /v1/objectives/:id/priority-mappings`

Links an item to this objective.

| Field | Type | Required | Description |
|---|---|---|---|
| `priority_id` | uuid | **required** | Item ID to link |
| `alignment_strength` | float | **required** | `0.0` (weak) → `1.0` (direct alignment) |
| `rationale` | string | | Why this item contributes |
| `created_by` | uuid | | User who created this mapping |

```json
{
  "priority_id": "item-uuid",
  "alignment_strength": 0.9,
  "rationale": "This directly drives our primary acquisition metric."
}
```

### `DELETE /v1/objectives/:id/priority-mappings/:mappingId`

Removes an item from this objective's priority mappings.

---

## What's next

- [Strategies API](/docs/api/strategies) — the parent strategy layer
- [Goals API](/docs/api/goals) — measurable metric targets
- [Desired Outcomes API](/docs/api/desired-outcomes) — connect outcomes to objectives
