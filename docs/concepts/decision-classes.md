---
title: Decision Classes — Priorities.ai
description: The typed decision vocabulary. Five classes, when they are used, and what they mean.
audience: Developers
source-canon: DOCS_V4/00-canon/12-decision-recording-spec.v1.md
status: published
---

# Decision Classes

Every decision recorded in Priorities.ai carries a `decision_class` — a typed assertion about the nature of the decision. This is not a tag or a label. It is part of the canonical decision record, and it is what allows the decision log to be queried meaningfully.

---

## The five classes

| Class | Definition |
|-------|-----------|
| `force_ranking` | A strict total ordering of items was produced — a definitive rank order |
| `selection` | A bounded set was chosen from a larger candidate pool |
| `convergence` | Previously uncertain, disputed, or distributed values were brought into agreement |
| `range_selection` | A range, band, or threshold was established for a dimension of value |
| `review` | A structured comparison was conducted without producing a total ordering |

---

## When each class is used

### `force_ranking`

Used when the decision produces a strict ordered list — item 1 above item 2, item 2 above item 3, with no ties.

**Auto-recorded for:**
- Session reaching `PUBLISHED` state
- Priority list approved (Cycle Owner ratifies the published output)

**Manual use:** When an executive makes a forced ranking decision outside of a facilitated session and wants to record it.

---

### `selection`

Used when the decision narrows a larger set to a specific subset.

**Auto-recorded for:**
- Session reaching `CRITERIA_FINALIZED` state (which criteria apply to this session is a selection from the full criteria registry)
- Item pool assembly completed (which items are eligible for this cycle/track)

**Manual use:** "We decided to scope Q3 to these 12 initiatives from the original 34 candidates." That is a `selection` decision.

---

### `convergence`

Used when multiple perspectives — from different organizational levels or stakeholders — were brought into agreement.

**Auto-recorded for:**
- Catchball proposal accepted (the authority exchange reached agreement — a convergence of executive intent and team proposal)

**Manual use:** "We held a 3-session values alignment process and converged on these RICE scores for the five items in the pool." That is a `convergence` decision.

---

### `range_selection`

Used when the decision establishes a measurement range, band, or threshold.

**Auto-recorded for:**
- Scale definitions confirmed in a session's criteria configuration

**Manual use:** "We decided our effort scoring scale runs 1–8, with each integer representing approximately one sprint of a two-person team." That is a `range_selection` decision.

---

### `review`

Used when a structured comparison was conducted — a formal review session — without producing a total ordering.

**Auto-recorded for:**
- Sessions configured with `mode: review` (as opposed to `mode: ranking`)

**Manual use:** "We reviewed the top 10 candidates with the VP team and categorized them but did not force-rank them." That is a `review` decision.

---

## Decision fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Decision record ID |
| `workspace_id` | uuid | Workspace this decision belongs to |
| `title` | string | Human-readable decision title |
| `body` | text | Rationale, context, reasoning |
| `decision_class` | string | One of five classes above |
| `decision_kind` | string | `auto` (system-generated) or `manual` (human-recorded) |
| `impact` | string | `high`, `medium`, or `low` |
| `status` | string | `active`, `superseded`, or `reversed` |
| `decided_at` | timestamptz | When the decision was made (can be set to past for manual decisions) |
| `decider_id` | uuid | User who made the decision |
| `linked_items` | array | Item IDs linked to this decision |
| `linked_sessions` | array | Session IDs linked |
| `linked_cycles` | array | Cycle IDs linked |
| `source_event_id` | uuid | For auto-decisions: the governance event that triggered this record |
| `tags` | array | Freeform tags |
| `created_at` | timestamptz | When the record was created |

---

## Immutability

Decision records are **immutable**. Once created, the core fields (`title`, `body`, `decision_class`, `linked_*`, `source_event_id`, `decided_at`) cannot be altered.

The `status` field can change:
- `active` → `superseded` (a newer decision takes precedence — old record preserved)
- `active` → `reversed` (the decision was undone — old record preserved)

These transitions do not alter the historical fact of the decision. They annotate its current standing.

---

## What's next

- [Governance vs audit events](/docs/concepts/governance-vs-audit-events) — how decisions relate to the two event tables
- [Decisions API](/docs/api/decisions) — query endpoints (planned)
- [Subscribe to decisions guide](/docs/guides/subscribe-to-decisions) — webhook-based real-time integration
