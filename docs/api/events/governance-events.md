---
title: Governance Events API
description: Query the lifecycle record of major governance actions in the workspace.
sidebar_label: Governance Events API
sidebar_position: 2
audience: Developers
status: published
---

# Governance Events

Governance events are the authoritative lifecycle record of major actions in the platform — cycle phase changes, session state transitions, catchball decisions, priority list approvals. They are distinct from [audit events](/docs/api/audit-events) (per-item forensic trail) and [decisions](/docs/api/decisions) (typed, human-readable records).

**Base path:** `/v1/governance-events`

**Scopes:** `governance:read`

---

## Events captured

| Event type | Trigger |
|-----------|---------|
| `cycle.phase_transition` | Cycle phase changes |
| `session.state_transition` | Session state changes |
| `session.published` | Session reaches `PUBLISHED` |
| `proposal.submitted` | Catchball proposal submitted |
| `proposal.accepted` | Catchball proposal accepted |
| `proposal.rejected` | Catchball proposal rejected |
| `proposal.returned` | Catchball proposal returned to sender |
| `priority_list.approved` | Published priority list ratified |
| `item_pool.locked` | Item pool locked for a track |
| `criteria.finalized` | Session criteria finalized |
| `admin_override.applied` | Admin override applied |

---

## Endpoints

### List governance events

```
GET /v1/governance-events
```

**Query params:**

| Param | Description |
|-------|-------------|
| `event_type` | Filter by event type string |
| `item_id` | Events related to a specific item |
| `session_id` | Events related to a specific session |
| `cycle_id` | Events related to a specific cycle |
| `actor_id` | Events by a specific user |
| `after` | ISO timestamp — filter `created_at >=` |
| `before` | ISO timestamp — filter `created_at <=` |
| `page`, `per_page` | Pagination |

**Example — all governance events for a cycle:**

```bash
curl "$PAI_BASE/governance-events?cycle_id=<uuid>" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Example — all events in the last 30 days:**

```bash
curl "$PAI_BASE/governance-events?after=2026-04-11T00:00:00Z" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

## See also

- [Decisions API](/docs/api/decisions) — major lifecycle events auto-generate decisions
- [Audit Events API](/docs/api/audit-events) — per-item forensic trail
- [Webhooks API](/docs/api/webhooks) — receive governance events in real time
