---
title: Strategies API
description: Manage named strategic directions and their nested objectives and goals.
sidebar_label: Strategies API
sidebar_position: 12
audience: Developers
status: published
---

# Strategies API

A **strategy** is a named strategic direction — the "why" above the work. Strategies contain objectives and goals, and can connect to prioritization cycles and OST trees.

**Scope:** `strategies:read` / `strategies:write`

---

## Endpoints

### `GET /v1/strategies`

Lists strategies for the workspace.

**Query params:** `page`, `per_page`

```bash
curl "$PAI_BASE/strategies" -H "Authorization: Bearer $PAI_KEY"
```

### `POST /v1/strategies`

Creates a strategy.

**Required:** `name`

```json
{
  "name": "Become the default planning layer for product teams",
  "description": "Own the workflow between strategy and execution for teams of 10–500 people.",
  "created_by": "user-uuid"
}
```

### `GET /v1/strategies/:id`

Returns a single strategy.

### `PATCH /v1/strategies/:id`

Updates a strategy. All fields except `id` and `workspace_id` are patchable.

### `DELETE /v1/strategies/:id`

Deletes a strategy.

---

## Nested reads

### `GET /v1/strategies/:id/objectives`

Convenience alias for `GET /v1/objectives?strategy_id=:id`. Returns objectives ordered by `priority` ascending.

### `GET /v1/strategies/:id/goals`

Convenience alias for `GET /v1/goals?strategy_id=:id`.

---

## What's next

- [Objectives API](/api/objectives) — concrete outcomes under a strategy
- [Goals API](/api/goals) — measurable metric targets
- [Desired Outcomes API](/api/desired-outcomes) — structured outcome briefs linked to objectives
