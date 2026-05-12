---
title: Desired Outcomes API
description: Create and manage Desired Outcomes — structured articulations of what success looks like for a specific who.
sidebar_label: Desired Outcomes API
sidebar_position: 13
audience: Developers
status: published
---

# Desired Outcomes API

A **Desired Outcome** is a structured answer to the question: "How will you know when you have what you want?" It forces one specific person (the Who) to articulate what they want, why it matters, and what sensory evidence of success looks like. This prevents outcomes from being vague or substitutable.

A Desired Outcome can be scoped to a DEGAP cycle, linked to a strategic objective, or exist independently as a standalone clarity artifact.

---

## Desired Outcome fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Record ID |
| `workspace_id` | uuid | Workspace scope |
| `title` | string | Human-readable label |
| `who` | string | Exactly one persona (the specific who) |
| `what_wanted` | string | Single positive sentence from the Who's point of view |
| `deeper_benefit` | string | The meta-outcome — what changes for the Who when this is achieved |
| `evidence_sufficient` | string | Minimum evidence that would satisfy the Who |
| `evidence_targeted` | string | Ambitious but plausible evidence of success |
| `evidence_ideal` | string | Unconstrained stretch evidence |
| `soonest_needed` | string | Earliest date the outcome is needed |
| `last_responsible_moment` | string | Latest date before value is lost |
| `obstacles` | array | JSONB array of `{ category, description }` objects |
| `ecology` | string | Unintended consequences of achieving the outcome |
| `ecology_mitigations` | string | How unintended consequences would be addressed |
| `steps` | array | JSONB array of `{ text, is_step_zero, is_threshold }` objects |
| `cycle_id` | uuid | Optional DEGAP cycle this outcome is scoped to |
| `created_by` | uuid | User who created this record |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last updated timestamp |

---

## List Desired Outcomes

```
GET /v1/desired-outcomes
```

**Scopes:** `desired-outcomes:read`

**Query parameters:**

| Name | Type | Description |
|---|---|---|
| `cycle_id` | uuid | Filter by DEGAP cycle |
| `page` | integer | Page number (default `1`) |
| `per_page` | integer | Results per page (default `20`, max `100`) |

**Request:**

```bash
curl "$PAI_BASE/desired-outcomes" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "do-uuid",
      "workspace_id": "ws-uuid",
      "title": "Series A fundraise",
      "who": "Our lead investor",
      "what_wanted": "Signs the term sheet by June 30",
      "deeper_benefit": "We have 18 months of runway and can hire the team we need.",
      "evidence_sufficient": "Term sheet signed and countersigned.",
      "evidence_targeted": "Term sheet signed, wire initiated within 5 business days.",
      "evidence_ideal": "Term sheet signed, wire received, investor joins first board meeting.",
      "obstacles": [
        { "category": "Process", "description": "Due diligence timeline may slip." }
      ],
      "steps": [
        { "text": "Finish financial model", "is_step_zero": true, "is_threshold": false }
      ],
      "created_at": "2026-04-01T09:00:00Z",
      "updated_at": "2026-04-01T09:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 3,
    "total_pages": 1,
    "workspace_id": "...",
    "request_id": "..."
  }
}
```

---

## Create a Desired Outcome

```
POST /v1/desired-outcomes
```

**Scopes:** `desired-outcomes:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **required** | Human-readable label |
| `who` | string | | The specific persona whose outcome this is |
| `what_wanted` | string | | What the Who wants in a single positive sentence |
| `cycle_id` | uuid | | Scope to a DEGAP cycle |
| `deeper_benefit` | string | | The meta-outcome |
| `evidence_sufficient` | string | | Minimum success evidence |
| `evidence_targeted` | string | | Ambitious success evidence |
| `evidence_ideal` | string | | Unconstrained success evidence |
| `soonest_needed` | string | | Earliest timing |
| `last_responsible_moment` | string | | Latest timing before value is lost |
| `obstacles` | array | | `[{ "category": "...", "description": "..." }]` |
| `ecology` | string | | Unintended consequences |
| `ecology_mitigations` | string | | How to address them |
| `steps` | array | | `[{ "text": "...", "is_step_zero": false, "is_threshold": false }]` |
| `created_by` | uuid | | User ID |

**Request:**

```bash
curl -X POST "$PAI_BASE/desired-outcomes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Series A fundraise",
    "who": "Our lead investor",
    "what_wanted": "Signs the term sheet by June 30",
    "deeper_benefit": "We have 18 months of runway and can hire the team we need.",
    "evidence_sufficient": "Term sheet signed and countersigned.",
    "evidence_targeted": "Term sheet signed, wire initiated within 5 business days.",
    "created_by": "user-uuid"
  }'
```

**Response:** `201 Created` — the created Desired Outcome object.

---

## Get a Desired Outcome

```
GET /v1/desired-outcomes/:id
```

**Scopes:** `desired-outcomes:read`

---

## Update a Desired Outcome

```
PATCH /v1/desired-outcomes/:id
```

**Scopes:** `desired-outcomes:write`

All fields except `id` and `workspace_id` are patchable. The `updated_at` column is managed by a database trigger.

**Request:**

```bash
curl -X PATCH "$PAI_BASE/desired-outcomes/do-uuid" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "evidence_ideal": "Term sheet signed, wire received, investor joins first board meeting.",
    "obstacles": [
      { "category": "Process", "description": "Due diligence timeline may slip." },
      { "category": "People", "description": "Investor needs CFO reference before signing." }
    ]
  }'
```

---

## Delete a Desired Outcome

```
DELETE /v1/desired-outcomes/:id
```

**Scopes:** `desired-outcomes:write`

---

## Obstacles format

The `obstacles` field is a JSONB array. Each entry:

| Field | Type | Description |
|---|---|---|
| `category` | string | `People`, `Process`, `Technology`, `Policy`, `Budget`, or `Other` |
| `description` | string | Description of the obstacle |

---

## Steps format

The `steps` field is a JSONB array. Each entry:

| Field | Type | Description |
|---|---|---|
| `text` | string | Description of the step |
| `is_step_zero` | boolean | True if this must happen before anything else |
| `is_threshold` | boolean | True if this step is the minimum bar (not just nice-to-have) |
| `dependency` | string | Optional — what this step depends on |

---

## Scopes

| Scope | Grants |
|---|---|
| `desired-outcomes:read` | Read all Desired Outcomes in the workspace |
| `desired-outcomes:write` | Create, update, delete Desired Outcomes |

---

## What's next

- [Strategies API](/docs/api/strategies) — link Desired Outcomes to strategic objectives
- [Methodology Connections API](/docs/api/clarity-tools/methodology-connections) — connect Desired Outcomes to sessions, cycles, and items
- [Open Questions API](/docs/api/clarity-tools/open-questions) — capture uncertainties related to an outcome
