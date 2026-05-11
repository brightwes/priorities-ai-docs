---
title: Audit Events API
description: Per-item forensic trail and workspace-wide audit log.
sidebar_label: Audit Events API
sidebar_position: 3
audience: Developers
status: published
---

# Audit Events

Audit events are the workspace-level forensic trail — every low-level event that occurred, in sequence. They answer compliance questions: "What changed on this item, by whom, and when?"

This is distinct from [governance events](/docs/api/governance-events) (major lifecycle actions on cycles and sessions) and from [decisions](/docs/api/decisions) (typed, human-readable records).

**Base path:** `/v1/audit-events`

**Scopes:** `audit:read`

---

## Events captured

| Event type | Description |
|-----------|-------------|
| `item.created` | Item creation |
| `item.shaped` | Name, description, category, or altitude changed |
| `item.added_to_pool` | Item included in a cycle/track pool |
| `item.removed_from_pool` | Item removed from a pool |
| `attribute.proposed` | Attribute value proposed |
| `attribute.accepted` | Attribute value accepted |
| `classification.proposed` | Track cell assignment proposed |
| `classification.determined` | Track cell assignment confirmed |
| `relationship.added` | Relationship record created |
| `relationship.status_changed` | Relationship status changed |
| `item.deferred` | Item deferred |
| `item.archived` | Item archived |
| `admin_override.applied` | Admin override applied to item |

---

## Endpoints

### List workspace audit events

```
GET /v1/audit-events
```

**Query params:**

| Param | Description |
|-------|-------------|
| `event_type` | Filter by event type |
| `after` | ISO timestamp — filter `created_at >=` |
| `before` | ISO timestamp — filter `created_at <=` |
| `page`, `per_page` | Pagination |

**Example — all attribute-related events in a date range:**

```bash
curl "$PAI_BASE/audit-events?event_type=attribute.accepted&after=2026-04-01T00:00:00Z" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

### List audit events for a specific item

```
GET /v1/items/:id/audit-events
```

**Scope:** `audit:read`

Returns audit events where `payload.itemId` matches the given item ID. Same query params as the workspace endpoint.

**Example:**

```bash
curl "$PAI_BASE/items/<item-uuid>/audit-events" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

## See also

- [Governance Events API](/docs/api/governance-events) — major lifecycle actions on cycles and sessions
- [Decisions API](/docs/api/decisions) — typed, human-readable decision log
- [Items API](/docs/api/items) — item CRUD and relationships
