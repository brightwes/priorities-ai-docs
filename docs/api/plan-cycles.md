---
title: Plan Cycles API
description: Manage plan cycles, versions, plan of record, initiatives, and work units.
sidebar_label: Plan Cycles API
sidebar_position: 16
---

# Plan Cycles API

A **plan cycle** is a bounded planning effort that produces versioned snapshots of committed work. The hierarchy is:

```
plan_cycle
  └── plan_version (many)
        └── plan_of_record (one active at a time)
        └── initiative (many)
              └── work_unit (many)
```

All sub-resources are nested under `/v1/plan-cycles/:id`.

**Scope:** `cycles:read` / `cycles:write`

---

## Plan Cycles

### `GET /v1/plan-cycles`

Lists plan cycles for the workspace.

**Query params:** `status`, `page`, `per_page`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "workspace_id": "uuid",
      "name": "Q3 2026 Planning",
      "input_type": "published_priority_list",
      "input_reference_id": "uuid",
      "status": "open",
      "start_condition": "manual",
      "created_at": "2026-05-01T00:00:00Z",
      "closed_at": null,
      "created_by": "uuid"
    }
  ],
  "pagination": { "page": 1, "per_page": 50, "total": 3, "total_pages": 1 }
}
```

### `POST /v1/plan-cycles`

Creates a plan cycle.

**Required:** `name`, `input_type`

Valid `input_type` values: `published_priority_list`, `item_pool`

```json
// Request
{
  "name": "Q3 2026 Planning",
  "input_type": "published_priority_list",
  "input_reference_id": "cycle-uuid",
  "created_by": "user-uuid"
}
```

### `GET /v1/plan-cycles/:id`

Returns a single plan cycle.

### `PATCH /v1/plan-cycles/:id`

Updates a plan cycle. Updatable: `name`, `status`, `closed_at`, `start_condition`.

### `DELETE /v1/plan-cycles/:id`

Deletes a plan cycle and all its versions.

---

## Plan Versions

Each plan cycle may have multiple versioned snapshots. Versions are auto-numbered within the cycle.

### `GET /v1/plan-cycles/:id/versions`

Lists all versions for this plan cycle, newest first.

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "plan_cycle_id": "uuid",
      "version_number": 3,
      "created_at": "2026-05-10T00:00:00Z",
      "created_by": "uuid",
      "change_reason": "revised_scope"
    }
  ]
}
```

### `POST /v1/plan-cycles/:id/versions`

Creates a new version (auto-incremented `version_number`).

**Required:** `created_by`

**Optional:** `change_reason` — enum value from `plan_version_change_reason`

```json
// Request
{
  "created_by": "user-uuid",
  "change_reason": "revised_scope"
}
```

### `GET /v1/plan-cycles/:id/versions/:vid`

Returns a single version.

---

## Plan of Record

A Plan of Record (POR) is the authorized commitment for a plan cycle. Only one POR is active per cycle at a time.

### `GET /v1/plan-cycles/:id/plan-of-record`

Returns the most recently authorized POR for this cycle.

```json
// Response
{
  "data": {
    "id": "uuid",
    "plan_cycle_id": "uuid",
    "plan_version_id": "uuid",
    "authorized_at": "2026-05-10T00:00:00Z",
    "authorized_by": "uuid",
    "status": "active"
  }
}
```

### `POST /v1/plan-cycles/:id/plan-of-record`

Authorizes a version as the Plan of Record.

**Required:** `plan_version_id`, `authorized_by`

```json
// Request
{
  "plan_version_id": "version-uuid",
  "authorized_by": "user-uuid",
  "status": "active"
}
```

---

## Initiatives

Initiatives are the priority commitments within a plan version. Each maps one item to its committed work profile.

### `GET /v1/plan-cycles/:id/versions/:vid/initiatives`

Lists initiatives for a plan version, ordered by `priority_position`.

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "plan_version_id": "uuid",
      "item_id": "uuid",
      "title": "Redesign onboarding flow",
      "work_profile": "standard",
      "priority_position": 1,
      "status": "committed"
    }
  ]
}
```

### `POST /v1/plan-cycles/:id/versions/:vid/initiatives`

Adds an initiative to a plan version.

**Required:** `item_id`

**Optional:** `title`, `work_profile`, `priority_position`, `status`

```json
// Request
{
  "item_id": "item-uuid",
  "priority_position": 1,
  "status": "committed"
}
```

### `PATCH /v1/plan-cycles/:id/versions/:vid/initiatives/:iid`

Updates an initiative. Updatable: `title`, `work_profile`, `priority_position`, `status`.

### `DELETE /v1/plan-cycles/:id/versions/:vid/initiatives/:iid`

Removes an initiative from the plan version.

---

## Work Units

Work units are the execution-level breakdown of an initiative.

### `GET /v1/plan-cycles/:id/versions/:vid/initiatives/:iid/work-units`

Lists work units for an initiative.

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "initiative_id": "uuid",
      "title": "API design",
      "description": "Design and document the new onboarding API endpoints",
      "readiness_state": "ready",
      "created_at": "2026-05-01T00:00:00Z"
    }
  ]
}
```

### `POST /v1/plan-cycles/:id/versions/:vid/initiatives/:iid/work-units`

Creates a work unit. **Required:** `title`

```json
// Request
{
  "title": "API design",
  "description": "Design and document the new onboarding API endpoints",
  "readiness_state": "draft"
}
```

### `PATCH /v1/plan-cycles/:id/versions/:vid/initiatives/:iid/work-units/:wid`

Updates a work unit. Updatable: `title`, `description`, `readiness_state`, and scoring columns.

### `DELETE /v1/plan-cycles/:id/versions/:vid/initiatives/:iid/work-units/:wid`

Deletes a work unit.
