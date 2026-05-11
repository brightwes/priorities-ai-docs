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

See [Webhooks API](/docs/api/webhooks) for registration, delivery model, and security.

---

## `session.published`

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
      {
        "item_id": "item-uuid-1",
        "item_name": "Improve onboarding flow",
        "rank": 1,
        "score": 87.5
      },
      {
        "item_id": "item-uuid-2",
        "item_name": "Migrate authentication to SSO",
        "rank": 2,
        "score": 74.0
      }
    ]
  }
}
```

---

## `cycle.transition`

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

## `priority_list.approved`

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
      {
        "item_id": "item-uuid-1",
        "item_name": "Improve onboarding flow",
        "rank": 1,
        "category": "initiative",
        "altitude": 3
      },
      {
        "item_id": "item-uuid-2",
        "item_name": "Migrate authentication to SSO",
        "rank": 2,
        "category": "initiative",
        "altitude": 3
      }
    ]
  }
}
```

---

## `catchball.accepted`

Fires when a Catchball proposal is accepted and the loop reaches `accepted` state.

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
    "rationale": "Proposal aligns with Q3 strategic objectives.",
    "decision_id": "decision-uuid",
    "decision_class": "convergence",
    "ranked_items": [
      {"item_id": "item-uuid-1", "rank": 1},
      {"item_id": "item-uuid-2", "rank": 2}
    ]
  }
}
```

---

## `catchball.returned`

Fires when a Catchball proposal is returned to the submitting team.

```json
{
  "event": "catchball.returned",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T11:00:00Z",
  "data": {
    "loop_id": "loop-uuid",
    "proposal_id": "proposal-uuid",
    "cycle_id": "cycle-uuid",
    "returned_by": "user-uuid",
    "guidance": "Please revise to account for the Q3 engineering freeze in July."
  }
}
```

---

## `workspace.updated`

Fires when workspace settings are changed.

```json
{
  "event": "workspace.updated",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T10:00:00Z",
  "data": {
    "changed_by": "user-uuid",
    "changes": {
      "name": { "from": "Acme Corp", "to": "Acme Platform" }
    }
  }
}
```

---

## What's next

- [Webhooks API](/docs/api/webhooks) — register and manage webhooks
- [Guide: subscribe to decisions](/docs/guides/subscribe-to-decisions) — end-to-end webhook integration
