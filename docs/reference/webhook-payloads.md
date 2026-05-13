---
title: Webhook Payloads — Priorities.ai
description: Full payload schemas for every webhook event.
audience: Developers
status: published
---

# Webhook Payloads

Full payload schemas for every event type. All payloads use the same envelope:

```json
{
  "event": "<event_type>",
  "workspace_id": "uuid",
  "timestamp": "ISO 8601 timestamp",
  "data": { ... }
}
```

See [Webhooks API](/api/webhooks) for registration, delivery model, and security.

---

## Item events

### `item.created`

Fires when an item is created via `POST /v1/items`. The full item record is included.

```json
{
  "event": "item.created",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T12:00:00Z",
  "data": {
    "id": "item-uuid",
    "title": "Improve onboarding flow",
    "description": "Reduce time-to-value for new users by simplifying the first 10 minutes.",
    "status": "active",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T12:00:00Z",
    "updated_at": "2026-04-01T12:00:00Z"
  }
}
```

---

### `item.updated`

Fires when an item is updated via `PATCH /v1/items/:id`. The full updated item record is included.

```json
{
  "event": "item.updated",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T13:00:00Z",
  "data": {
    "id": "item-uuid",
    "title": "Improve onboarding flow",
    "description": "Updated description with revised scope.",
    "status": "active",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T12:00:00Z",
    "updated_at": "2026-04-01T13:00:00Z"
  }
}
```

---

### `item.deleted`

Fires when an item is deleted via `DELETE /v1/items/:id`.

```json
{
  "event": "item.deleted",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "id": "item-uuid"
  }
}
```

---

### `items.bulk_imported`

Fires when a bulk upsert completes via `POST /v1/items/bulk`. Contains the count and IDs of all affected items.

```json
{
  "event": "items.bulk_imported",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T12:30:00Z",
  "data": {
    "count": 42,
    "item_ids": [
      "item-uuid-1",
      "item-uuid-2",
      "item-uuid-3"
    ]
  }
}
```

---

## Decision events

### `decision.created`

Fires when a decision record is created via `POST /v1/decisions`. The full decision record is included.

```json
{
  "event": "decision.created",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "id": "decision-uuid",
    "title": "Deprioritize feature X in favor of infrastructure work",
    "decision_kind": "manual",
    "decision_class": "tradeoff",
    "status": "active",
    "impact": "high",
    "rationale": "Engineering capacity is needed for Q3 infrastructure work. Feature X will be re-evaluated in Q4.",
    "notes": null,
    "item_id": "item-uuid",
    "session_id": null,
    "cycle_id": "cycle-uuid",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T14:00:00Z",
    "updated_at": "2026-04-01T14:00:00Z"
  }
}
```

---

### `decision.status_changed`

Fires when a decision's status changes via `PATCH /v1/decisions/:id/status`. The full updated decision record is included.

| Status value | Meaning |
|---|---|
| `active` | Decision is current and in effect |
| `superseded` | A newer decision has replaced this one |
| `reversed` | The decision was reversed |

```json
{
  "event": "decision.status_changed",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-05-01T09:00:00Z",
  "data": {
    "id": "decision-uuid",
    "title": "Deprioritize feature X in favor of infrastructure work",
    "decision_kind": "manual",
    "decision_class": "tradeoff",
    "status": "superseded",
    "impact": "high",
    "rationale": "Engineering capacity is needed for Q3 infrastructure work.",
    "item_id": "item-uuid",
    "cycle_id": "cycle-uuid",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T14:00:00Z",
    "updated_at": "2026-05-01T09:00:00Z"
  }
}
```

---

## Open question events

### `open-question.created`

Fires when a question is posted via `POST /v1/open-questions`.

```json
{
  "event": "open-question.created",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T10:00:00Z",
  "data": {
    "id": "question-uuid",
    "text": "Should we split this initiative into two separate items for Q3 and Q4?",
    "status": "open",
    "context_entity_type": "item",
    "context_entity_id": "item-uuid",
    "resolution_text": null,
    "resolved_at": null,
    "resolved_by": null,
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-01T10:00:00Z"
  }
}
```

---

### `open-question.updated`

Fires when a question is updated via `PATCH /v1/open-questions/:id`. The full updated question record is included.

```json
{
  "event": "open-question.updated",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T10:30:00Z",
  "data": {
    "id": "question-uuid",
    "text": "Should we split this initiative into two separate items for Q3 and Q4? (Updated with additional context)",
    "status": "open",
    "context_entity_type": "item",
    "context_entity_id": "item-uuid",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-01T10:30:00Z"
  }
}
```

---

### `open-question.deleted`

Fires when a question is deleted via `DELETE /v1/open-questions/:id`.

```json
{
  "event": "open-question.deleted",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-02T09:00:00Z",
  "data": {
    "id": "question-uuid"
  }
}
```

---

### `open-question.resolved`

Fires when a question is resolved via `POST /v1/open-questions/:id/resolve`. The full updated record is included, with `resolution_text`, `resolved_at`, and `resolved_by` populated.

```json
{
  "event": "open-question.resolved",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-03T11:00:00Z",
  "data": {
    "id": "question-uuid",
    "text": "Should we split this initiative into two separate items for Q3 and Q4?",
    "status": "resolved",
    "context_entity_type": "item",
    "context_entity_id": "item-uuid",
    "resolution_text": "Decision made to keep as a single item. Q4 scope will be tracked as a separate follow-up.",
    "resolved_at": "2026-04-03T11:00:00Z",
    "resolved_by": "user-uuid",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-03T11:00:00Z"
  }
}
```

---

### `open-question.reopened`

Fires when a resolved question is reopened via `POST /v1/open-questions/:id/reopen`. Resolution fields are cleared.

```json
{
  "event": "open-question.reopened",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-04T09:00:00Z",
  "data": {
    "id": "question-uuid",
    "text": "Should we split this initiative into two separate items for Q3 and Q4?",
    "status": "open",
    "context_entity_type": "item",
    "context_entity_id": "item-uuid",
    "resolution_text": null,
    "resolved_at": null,
    "resolved_by": null,
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-04T09:00:00Z"
  }
}
```

---

## Outcome driver events

### `outcome-driver.created`

Fires when an outcome driver is created via `POST /v1/outcome-drivers`. The full outcome driver record is included.

```json
{
  "event": "outcome-driver.created",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T09:00:00Z",
  "data": {
    "id": "driver-uuid",
    "name": "Reduce customer churn",
    "description": "Churn rate is above industry benchmark. Reducing it by 2 points is a top-3 company objective.",
    "driver_type": "outcome",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T09:00:00Z",
    "updated_at": "2026-04-01T09:00:00Z"
  }
}
```

---

### `outcome-driver.updated`

Fires when an outcome driver is updated via `PATCH /v1/outcome-drivers/:id`. The full updated record is included.

```json
{
  "event": "outcome-driver.updated",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-10T14:00:00Z",
  "data": {
    "id": "driver-uuid",
    "name": "Reduce customer churn",
    "description": "Updated: revised target from 2 points to 3 points based on board direction.",
    "driver_type": "outcome",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T09:00:00Z",
    "updated_at": "2026-04-10T14:00:00Z"
  }
}
```

---

### `outcome-driver.deleted`

Fires when an outcome driver is deleted via `DELETE /v1/outcome-drivers/:id`.

```json
{
  "event": "outcome-driver.deleted",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-15T10:00:00Z",
  "data": {
    "id": "driver-uuid"
  }
}
```

---

## Catchball events

### `catchball.proposal.returned`

Fires when a proposal is returned to the submitting team via `POST /v1/catchball/proposals/:id/return`. The submitting team may revise and resubmit.

```json
{
  "event": "catchball.proposal.returned",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T11:00:00Z",
  "data": {
    "proposal_id": "proposal-uuid",
    "loop_id": "loop-uuid",
    "cycle_id": "cycle-uuid",
    "returned_by": "user-uuid",
    "note": "Please revise to account for the Q3 engineering freeze in July. The current ranking does not reflect this constraint."
  }
}
```

---

### `catchball.accepted`

Fires when a Catchball proposal is accepted and the loop reaches `accepted` state. Includes the ranked items from the accepted proposal and the governance decision ID.

```json
{
  "event": "catchball.accepted",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T13:30:00Z",
  "data": {
    "loop_id": "loop-uuid",
    "proposal_id": "proposal-uuid",
    "cycle_id": "cycle-uuid",
    "accepted_by": "user-uuid",
    "rationale": "Proposal aligns with Q3 strategic objectives. Engineering freeze accounted for.",
    "decision_id": "decision-uuid",
    "decision_class": "convergence",
    "ranked_items": [
      {"item_id": "item-uuid-1", "rank": 1},
      {"item_id": "item-uuid-2", "rank": 2},
      {"item_id": "item-uuid-3", "rank": 3}
    ]
  }
}
```

---

## Governance events

### `session.published`

Fires when a session transitions to `PUBLISHED` state.

```json
{
  "event": "session.published",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "session_id": "session-uuid",
    "session_name": "Q3 Initiative Ranking",
    "cycle_id": "cycle-uuid",
    "facilitator_id": "user-uuid",
    "decision_id": "decision-uuid",
    "decision_class": "force_ranking",
    "result_count": 8,
    "results": [
      {"item_id": "item-uuid-1", "item_name": "Improve onboarding flow", "rank": 1, "score": 87.5},
      {"item_id": "item-uuid-2", "item_name": "Migrate authentication to SSO", "rank": 2, "score": 74.0}
    ]
  }
}
```

---

### `cycle.transition`

Fires when a cycle changes phase.

```json
{
  "event": "cycle.transition",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "cycle_id": "cycle-uuid",
    "cycle_name": "Q3 2026 Prioritization",
    "from_phase": "planning",
    "to_phase": "execution",
    "actor_id": "user-uuid",
    "reason": "All tracks confirmed ready.",
    "governance_event_id": "gov-event-uuid"
  }
}
```

---

### `priority_list.approved`

Fires when a published priority list is ratified by the Cycle Owner.

```json
{
  "event": "priority_list.approved",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-02T09:00:00Z",
  "data": {
    "list_id": "list-uuid",
    "cycle_id": "cycle-uuid",
    "cycle_name": "Q3 2026 Prioritization",
    "approved_by": "user-uuid",
    "decision_id": "decision-uuid",
    "item_count": 8,
    "items": [
      {"item_id": "item-uuid-1", "item_name": "Improve onboarding flow", "rank": 1, "category": "initiative", "altitude": 3},
      {"item_id": "item-uuid-2", "item_name": "Migrate authentication to SSO", "rank": 2, "category": "initiative", "altitude": 3}
    ]
  }
}
```

---

### `workspace.updated`

Fires when workspace settings are changed.

```json
{
  "event": "workspace.updated",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T10:00:00Z",
  "data": {
    "changed_by": "user-uuid",
    "changes": {
      "name": {"from": "Acme Corp", "to": "Acme Platform"}
    }
  }
}
```

---

## What's next

- [Webhooks API](/api/webhooks) — register and manage webhooks
- [Guide: subscribe to decisions](/guides/subscribe-to-decisions) — end-to-end webhook integration
