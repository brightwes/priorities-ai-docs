---
title: Open Questions API
description: Track and resolve open questions across the workspace.
sidebar_label: Open Questions
sidebar_position: 3
audience: Developers
status: published
---

# Open Questions

Open Questions are the things your team doesn't know yet. They can be anchored to any clarity tool or prioritization entity, or left free-floating at the workspace level.

**Base path:** `/v1/open-questions`

**Scopes:**
- `open-questions:read` — all GET endpoints
- `open-questions:write` — all POST, PATCH, DELETE endpoints

---

## Statuses

| Status | Meaning |
|--------|---------|
| `open` | Unresolved, needs attention |
| `in_progress` | Being actively investigated |
| `resolved` | Answered; resolution recorded |
| `deferred` | Acknowledged but postponed |

---

## Context entity types

Questions can be anchored to: `item`, `cycle`, `session`, `track`, `outcome_driver`, `desired_outcome`, `backplan_node`, `ost_node`.

---

## Endpoints

### List questions

```
GET /v1/open-questions
```

**Query params:**

| Param | Description |
|-------|-------------|
| `status` | Filter by status |
| `context_entity_type` | Filter by anchor type (e.g. `item`, `outcome_driver`) |
| `context_entity_id` | Filter by a specific anchored entity |
| `search` | Full-text search on `text` |
| `page`, `per_page` | Pagination |

**Example — all open questions for a specific outcome driver:**

```bash
curl "$PAI_BASE/open-questions?context_entity_type=outcome_driver&context_entity_id=<uuid>&status=open" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

### Create a question

```
POST /v1/open-questions
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | **required** | The question |
| `context_entity_type` | string | | Anchor type (see types above) |
| `context_entity_id` | uuid | | ID of the anchored entity |
| `raised_by` | uuid | | User who raised the question |
| `priority` | string | | e.g. `high`, `medium`, `low` |

**Webhook fired:** `open-question.created`

---

### Get a question

```
GET /v1/open-questions/:id
```

---

### Update a question

```
PATCH /v1/open-questions/:id
```

Supports updating `text`, `status`, `context_entity_type`, `context_entity_id`, `priority`. Does not accept `id` or `workspace_id`.

**Webhook fired:** `open-question.updated`

---

### Delete a question

```
DELETE /v1/open-questions/:id
```

**Webhook fired:** `open-question.deleted`

---

### Resolve a question

```
POST /v1/open-questions/:id/resolve
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resolution_text` | string | **required** | The answer or resolution |
| `resolved_by` | uuid | | User who resolved it |

Sets `status` to `resolved`, records `resolution_text`, `resolved_at`, and `resolved_by`.

**Webhook fired:** `open-question.resolved`

---

### Reopen a question

```
POST /v1/open-questions/:id/reopen
```

Clears the resolution and sets `status` back to `open`.

**Webhook fired:** `open-question.reopened`

---

## See also

- [Export API](/api/clarity-tools/export) — export questions as JSON or CSV
- [Methodology Connections API](/api/clarity-tools/methodology-connections) — `open_question` is a valid source entity type
