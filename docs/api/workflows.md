---
title: Workflows API
description: Manage workflow definitions and seed canonical presets for a workspace.
sidebar_label: Workflows API
sidebar_position: 20
---

# Workflows API

A **workflow** defines how a prioritization cycle runs — tool sequencing, stage gating, session context mode, and promotion rules. Five canonical presets ship with every workspace and can be installed via the seed endpoint.

**Scope:** `cycles:read` / `cycles:write`

---

## Endpoints

### `POST /v1/workflows/seed`

Seeds all five canonical workflow presets into the workspace. Safe to call multiple times — inserts are idempotent (skips if a preset with the same name already exists).

The five presets are:

| Name | Use case |
|------|----------|
| Standard Periodic | Regular cadence planning with full stage gating |
| Rapid Triage | Fast-moving teams; skips criteria expression stage |
| Deep Deliberation | High-stakes decisions with full AHP/pairwise tooling |
| Lightweight | Minimal stage gating for small teams |
| Custom | Empty template for bespoke configuration |

```bash
# Seed presets for the authenticated workspace
curl -X POST /v1/workflows/seed \
  -H "Authorization: Bearer pk_live_..."
```

```json
// Response
{
  "data": {
    "workspace_id": "uuid",
    "seeded": true
  }
}
```

### `GET /v1/workflows`

Lists workflow definitions for the workspace.

**Query params:** `status` (`draft` | `active` | `archived`), `page`, `per_page`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "workspace_id": "uuid",
      "name": "Standard Periodic",
      "description": "Regular cadence planning with full stage gating",
      "status": "active",
      "configuration": { "stage_gating": true, "session_context_mode": "structured" },
      "created_at": "2026-05-01T00:00:00Z",
      "created_by": "system",
      "updated_at": "2026-05-01T00:00:00Z"
    }
  ]
}
```

### `POST /v1/workflows`

Creates a custom workflow.

**Required:** `name`, `created_by`

**Optional:** `description`, `status` (default: `draft`), `configuration` (JSONB)

```json
// Request
{
  "name": "My Custom Workflow",
  "description": "Tailored for our quarterly planning process",
  "created_by": "user-uuid",
  "configuration": {
    "stage_gating": false,
    "session_context_mode": "open"
  }
}
```

### `GET /v1/workflows/:id`

Returns a single workflow.

### `PATCH /v1/workflows/:id`

Updates a workflow.

Updatable: `name`, `description`, `status`, `configuration`.

**Status transitions:**
- `draft` → `active` (activate for use)
- `active` → `archived` (retire from use)

```json
// Request — activate a draft workflow
{
  "status": "active"
}
```

### `DELETE /v1/workflows/:id`

Deletes a workflow. Only `draft` or `archived` workflows may be deleted. Active workflows must be archived first.

```json
// 400 response for active workflow
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Active workflows cannot be deleted. Archive the workflow first."
  }
}
```

---

## Assigning a workflow to a cycle

Set `workflow_id` when creating or patching a cycle:

```json
// POST /v1/cycles
{
  "name": "Q3 Planning",
  "workflow_id": "workflow-uuid"
}
```
