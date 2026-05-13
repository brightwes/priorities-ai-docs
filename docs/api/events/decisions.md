---
title: Decisions API
description: Query and create decisions. Every governance event auto-records a typed decision. Manual decisions can be added via API.
sidebar_label: Decisions API
sidebar_position: 1
audience: Developers
status: published
---

# Decisions

The Decisions API provides programmatic access to the typed decision log — every auto-recorded system decision and every manually recorded organizational decision in the workspace.

**Base path:** `/v1/decisions`

**Scopes:**
- `decisions:read` — GET endpoints
- `decisions:write` — POST and PATCH endpoints

---

## Decision kinds

| Kind | Description |
|------|-------------|
| `auto` | Recorded automatically by the system on governance events (session published, catchball accepted, etc.) |
| `manual` | Created explicitly via API or app UI |

## Statuses

| Status | Description |
|--------|-------------|
| `active` | Current and in effect |
| `superseded` | Replaced by a newer decision |
| `reversed` | Deliberately undone |

---

## Endpoints

### List decisions

```
GET /v1/decisions
```

**Query params:**

| Param | Description |
|-------|-------------|
| `decision_class` | `force_ranking`, `selection`, `convergence`, `range_selection`, `review` |
| `decision_kind` | `auto` or `manual` |
| `impact` | `high`, `medium`, `low` |
| `status` | `active`, `superseded`, `reversed` |
| `linked_cycle_id` | Decisions linked to a specific cycle |
| `linked_session_id` | Decisions linked to a specific session |
| `linked_item_id` | Decisions linked to a specific item |
| `decided_after` | ISO timestamp — filter `created_at >=` |
| `decided_before` | ISO timestamp — filter `created_at <=` |
| `page`, `per_page` | Pagination |

**Example — all active high-impact decisions in a cycle:**

```bash
curl "$PAI_BASE/decisions?status=active&impact=high&linked_cycle_id=<uuid>" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

### Get a decision

```
GET /v1/decisions/:id
```

---

### Create a manual decision

```
POST /v1/decisions
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **required** | Short title for the decision |
| `decision_class` | string | | e.g. `selection`, `review` |
| `impact` | string | | `high`, `medium`, or `low` |
| `rationale` | string | | Full decision rationale |
| `notes` | string | | Additional notes |
| `item_id` | uuid | | Related item |
| `session_id` | uuid | | Related session |
| `cycle_id` | uuid | | Related cycle |
| `status` | string | | Defaults to `active` |

`decision_kind` is always set to `manual` for API-created decisions.

**Webhook fired:** `decision.created`

---

### Update decision status

```
PATCH /v1/decisions/:id/status
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | **required** | `active`, `superseded`, or `reversed` |

**Webhook fired:** `decision.status_changed`

---

## See also

- [Governance Events API](/api/events/governance-events) — structural lifecycle events that auto-generate decisions
- [Webhooks API](/api/webhooks) — `session.published` and `priority_list.approved` events include decision payloads
