---
title: Stakeholder Pulses API
description: Send, track, and record stakeholder sentiment on prioritized items.
sidebar_label: Stakeholder Pulses API
sidebar_position: 18
---

# Stakeholder Pulses API

A **stakeholder pulse** captures a stakeholder's outcome signal on an item — their priority sentiment, rank, and response note. Pulses are sent to a named submitter, tracked through a response lifecycle (`sent → viewed → responded`), and aggregated as priority signal.

**Scope:** `cycles:read` / `cycles:write`

---

## Endpoints

### `GET /v1/stakeholder-pulses`

Lists pulses for the workspace.

**Query params:** `item_id`, `submitter_id`, `status`, `priority_set_id`, `page`, `per_page`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "workspace_id": "uuid",
      "item_id": "uuid",
      "submitter_id": "uuid",
      "priority_set_id": "uuid",
      "outcome": "approve",
      "rank": 2,
      "outcome_summary": "This is critical for Q3 revenue.",
      "status": "responded",
      "sent_at": "2026-05-01T00:00:00Z",
      "viewed_at": "2026-05-01T12:00:00Z",
      "responded_at": "2026-05-01T14:30:00Z",
      "response": { "notes": "Strong alignment with OKR." },
      "response_note": "I'd prioritize this above the migration work.",
      "created_at": "2026-05-01T00:00:00Z",
      "created_by": "uuid"
    }
  ]
}
```

### `POST /v1/stakeholder-pulses`

Creates (sends) a pulse to a stakeholder for an item.

**Required:** `item_id`, `submitter_id`, `created_by`

**Optional:** `priority_set_id`, `status` (default: `sent`), `sent_at`

```json
// Request
{
  "item_id": "item-uuid",
  "submitter_id": "user-uuid",
  "priority_set_id": "set-uuid",
  "created_by": "admin-uuid"
}
```

### `GET /v1/stakeholder-pulses/:id`

Returns a single pulse record.

### `PATCH /v1/stakeholder-pulses/:id`

Records a stakeholder's response. Updatable: `outcome`, `rank`, `outcome_summary`, `response`, `response_note`, `status`, `viewed_at`, `responded_at`.

```json
// Request — record a response
{
  "outcome": "approve",
  "rank": 2,
  "outcome_summary": "Critical for Q3 revenue.",
  "response_note": "This directly impacts our largest account.",
  "status": "responded",
  "responded_at": "2026-05-01T14:30:00Z"
}
```

### `DELETE /v1/stakeholder-pulses/:id`

Deletes a pulse.

---

## Status lifecycle

| Status | Meaning |
|--------|---------|
| `sent` | Pulse delivered; awaiting stakeholder view |
| `viewed` | Stakeholder has opened the pulse |
| `responded` | Stakeholder has submitted their outcome |
| `expired` | Pulse period closed without response |

Use `PATCH` to advance status as stakeholders engage with the pulse.
