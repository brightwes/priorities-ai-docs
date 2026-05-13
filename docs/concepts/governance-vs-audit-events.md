---
title: Governance vs Audit Events — Priorities.ai
description: Two distinct event tables. What each captures, why they are separate, and how to query them.
audience: Developers
source-canon: DOCS_V4/architecture-notes/event-model.md
status: published
---

# Governance vs Audit Events

Priorities.ai maintains two separate event tables. They are not the same thing, and they should not be queried interchangeably.

---

## The distinction

| | Governance Events | Audit Events |
|-|-------------------|--------------|
| **Purpose** | Major lifecycle actions — the authoritative record of significant decisions and state transitions | Full per-item forensic trail — every event that happened to every item |
| **Granularity** | Coarse-grained (major transitions) | Fine-grained (every item-level event) |
| **Volume** | Low | High |
| **Use case** | "What major governance actions happened in this cycle?" "When did the phase change?" | "What happened to item X over its full history?" "Who added item X to the pool?" |
| **Consumers** | Compliance, board-level audits, executive reporting, external integrations | Operational audit, change tracing, per-item forensics |

---

## Governance events

Governance events are recorded for:

- Cycle phase transitions
- Session state transitions (`DRAFT → CRITERIA_FINALIZED → RUN_COMPLETE → PUBLISHED`)
- Priority list approved
- Catchball proposal accepted or rejected
- Item pool locked
- Participant configuration confirmed
- Admin overrides in Ring 1 or Ring 2 contexts

**Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Event ID |
| `workspace_id` | uuid | Workspace |
| `event_type` | string | e.g. `cycle.phase_transition`, `session.published`, `proposal.accepted` |
| `actor_id` | uuid | User who performed the action |
| `object_type` | string | Type of the primary object (`cycle`, `session`, `proposal`, etc.) |
| `object_id` | uuid | Primary object ID |
| `payload` | jsonb | Event-specific data (from_state, to_state, rationale, etc.) |
| `linked_decision_id` | uuid | If this event auto-recorded a decision, that decision's ID |
| `created_at` | timestamptz | When the event occurred |

---

## Audit events

Audit events are recorded for every significant event on an item — a superset of governance events for item-scope, plus many item-specific events that do not rise to governance-level significance.

Audit events are the forensic layer — the answer to "what happened to this item, in what order, by whom?"

**Item-level events recorded:**

- Item created
- Item added to pool
- Item removed from pool
- Item shaped (name, description, category, altitude changed)
- Attribute value proposed
- Attribute value accepted
- Track Cell assignment proposed
- Track Cell assignment accepted
- Relationship added (any type)
- Relationship status changed
- Item included in a session
- Item ranked in a tool session
- Result record written for item
- Item flagged / unflagged
- Item exited (deferred, archived)
- Admin override applied to item

**Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Event ID |
| `workspace_id` | uuid | Workspace |
| `item_id` | uuid | The item this event concerns |
| `event_type` | string | e.g. `item.shaped`, `item.added_to_pool`, `attribute.accepted` |
| `actor_id` | uuid | User or system actor |
| `payload` | jsonb | Event-specific data (before/after values for changes) |
| `session_id` | uuid | Session context if relevant |
| `cycle_id` | uuid | Cycle context if relevant |
| `created_at` | timestamptz | When the event occurred |

---

## Decisions vs events

The three-layer model:

```
decisions          ← typed, human-readable, manual + auto, linked to source events
                     "what was decided, by whom, why"
governance_events  ← lifecycle record of major actions
                     "what happened to this cycle/session/proposal, when"
audit_events       ← per-item forensic record
                     "what happened to this item, in what sequence"
```

**How they relate:**

Some governance events trigger automatic decision records. For example:
- `session.published` governance event → auto-recorded `force_ranking` decision, linked back to the governance event via `source_event_id`
- `proposal.accepted` governance event → auto-recorded `convergence` decision

The link is always from decision → governance event. A decision can exist without a governance event (manual decisions). A governance event may exist without a decision (not every governance event auto-records).

---

## Current API status

> **Note (Coming soon):**
>
> - `GET /v1/governance-events` — list governance events for a workspace, filterable by object type, event type, and date range
> - `GET /v1/governance-events/:id` — get a specific governance event
> - `GET /v1/items/:id/audit-events` — get the full audit trail for an item
> - `GET /v1/audit-events` — query audit events across all items
>
> The underlying data is captured and stored today. The public query endpoints are planned.
>
> **Available today:** Webhook events deliver `session.published`, `cycle.transition`, and `priority_list.approved` — which correspond to the most important governance events. Subscribe to these for real-time integration without waiting for the query endpoints.

[Subscribe to decision events →](/guides/subscribe-to-decisions)   [Webhooks API →](/api/webhooks)

---

## What's next

- [Decision classes](/concepts/decision-classes) — the typed decision vocabulary
- [State machines](/concepts/state-machines) — what events get recorded on each state transition
