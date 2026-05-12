---
title: Decision Rights API
description: Assign, delegate, and revoke decision authority within cycles.
sidebar_label: Decision Rights API
sidebar_position: 17
---

# Decision Rights API

**Decision rights** define who owns a class of decisions within a cycle's scope. They formalize the authority structure that governs how prioritization decisions are made and by whom.

All authority mutations (assign, delegate, revoke) go through **RPC-backed transitions** per §2.3a of the Build Contract. This ensures governance events are written atomically with every authority change.

**Scope:** `cycles:read` / `cycles:write`

---

## Decision Rights

### `GET /v1/decision-rights`

Lists decision rights for the workspace.

**Query params:** `cycle_id`, `domain`, `decision_class`, `page`, `per_page`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "cycle_id": "uuid",
      "workspace_id": "uuid",
      "domain": "product",
      "decision_class": "scope_change",
      "scope_selector": "track:uuid",
      "owner_principal_id": "uuid",
      "owner_principal_type": "user",
      "allowed_execution_modes": ["unilateral", "consult"],
      "delegation_constraints": null,
      "version": 1,
      "assigned_at": "2026-05-01T00:00:00Z",
      "assigned_by": "uuid"
    }
  ]
}
```

### `POST /v1/decision-rights`

Assigns a decision right via the `assign_decision_right` RPC. This is the only write path — direct inserts bypass governance.

**Required:** `cycle_id`, `domain`, `decision_class`, `scope_selector`, `owner_principal_id`, `owner_principal_type`, `allowed_execution_modes`

**Optional:** `delegation_constraints`, `assigned_by`, `assigned_at`

Valid `allowed_execution_modes` values: `unilateral`, `consult`, `ratify`, `delegate`

```json
// Request
{
  "cycle_id": "cycle-uuid",
  "domain": "product",
  "decision_class": "scope_change",
  "scope_selector": "track:uuid",
  "owner_principal_id": "user-uuid",
  "owner_principal_type": "user",
  "allowed_execution_modes": ["unilateral", "consult"],
  "assigned_by": "admin-uuid"
}
```

### `GET /v1/decision-rights/:id`

Returns a single decision right.

### `DELETE /v1/decision-rights/:id`

Removes a decision right.

---

## Delegations

A delegation grants a secondary principal the ability to exercise a decision right within defined constraints.

### `GET /v1/decision-rights/:id/delegations`

Lists all delegations from this decision right.

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "source_right_id": "uuid",
      "delegate_principal_id": "uuid",
      "allowed_execution_modes": ["consult"],
      "depth": 1,
      "accepted": true,
      "accepted_at": "2026-05-02T00:00:00Z",
      "expires_at": "2026-06-01T00:00:00Z",
      "revoked_at": null
    }
  ]
}
```

### `POST /v1/decision-rights/:id/delegations`

Delegates this right to another principal via the `delegate_decision_right` RPC.

**Required:** `delegate_principal_id`, `allowed_execution_modes`, `caller_id`

**Optional:** `expires_at`

```json
// Request
{
  "delegate_principal_id": "user-uuid",
  "allowed_execution_modes": ["consult"],
  "expires_at": "2026-06-01T00:00:00Z",
  "caller_id": "admin-uuid"
}
```

### `DELETE /v1/decision-rights/delegations/:did`

Revokes a delegation via the `revoke_delegation` RPC. **Required:** `caller_id` in the request body.

```json
// Request
{
  "caller_id": "admin-uuid"
}
```
