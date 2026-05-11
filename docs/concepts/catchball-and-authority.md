---
title: Catchball and Authority — Priorities.ai
description: The bidirectional alignment mechanism. How authority lanes, proposals, and Catchball loops work.
audience: Developers
source-canon: DOCS_V4/00-canon/04-workflow-orchestration-specification.md
status: published
---

# Catchball and Authority

Catchball is the bidirectional priority alignment mechanism that runs within every Cycle. It is how executive intent and team knowledge reach the decision together — not through unilateral authority at either end, but through a governed exchange.

This page describes the technical model. For the conceptual overview, see [The Exchange](/platform/exchange).

---

## What Catchball is

Named after the management practice of tossing a planning "ball" between organizational levels — executives throw down with context and constraints; teams throw back with operational reality and counterproposals — Catchball is a first-class system concept with its own state machine, its own API surface, and its own governance record.

Every exchange in every loop is recorded. Every acceptance and rejection carries a rationale. The record of who held the "ball" and what they decided with it is on the record.

---

## Key objects

### Catchball Loop

A Catchball Loop is opened within a Cycle for a specific track or scope. It is the container for all exchanges on that scope within the cycle.

| Field | Description |
|-------|-------------|
| `id` | UUID |
| `cycle_id` | Parent cycle |
| `scope` | Track, item pool, or strategic objective this loop governs |
| `state` | See state machine below |
| `opened_at` | When the loop was opened |
| `closed_at` | When the loop reached terminal state |

### Catchball Proposal

A Catchball Proposal is the specific "ball" thrown in one direction. Typically a team forms a proposal containing a candidate ranked list and supporting rationale; the proposal moves up to the decision authority.

| Field | Description |
|-------|-------------|
| `id` | UUID |
| `loop_id` | Parent Catchball Loop |
| `submitter_id` | User who submitted the proposal |
| `content` | The proposal body — ranked list, rationale, constraints |
| `state` | See proposal state machine below |
| `submitted_at` | Submission timestamp |

### Catchball Thread

Discussion threads on proposals — structured comment-response exchange between the submitting team and the reviewing authority.

---

## State machines

### Loop state machine

```
working → proposed → returned → accepted_provisional → accepted → closed
                              → rejected → closed
```

| State | Description |
|-------|-------------|
| `working` | Loop open, proposal not yet submitted |
| `proposed` | A proposal has been submitted and is pending review |
| `returned` | Authority returned the proposal with guidance for revision |
| `accepted_provisional` | Authority accepted with conditions — conditions must be met before final acceptance |
| `accepted` | Final acceptance — auto-records a `convergence` decision |
| `rejected` | Authority rejected with rationale — loop closes |
| `closed` | Terminal state (after accepted or rejected) |

### Proposal state machine

```
draft → submitted → accepted | rejected | returned
returned → draft → submitted → ...
```

A returned proposal moves back to `draft` for the submitting team to revise. The revision history is preserved.

---

## Authority lanes

Authority lanes are the organizational channels through which a proposal is legitimate to travel. They are configured per workspace and per Cycle.

An item cannot bypass the authority chain. A team-level proposal cannot go directly to the board without passing through the intermediate authority level.

**Why this matters for integrations:**

When you build an integration that submits Catchball proposals programmatically (e.g., as the output of an AI agent or an automated scoring process), you must include the correct `submitter_id` — a user whose role and authority lane allow them to submit into the target loop. The RPC enforces this.

```bash
# Submit a proposal (routes through catchball_submit_proposal RPC)
POST /v1/catchball/proposals
{
  "loop_id": "loop-uuid",
  "submitter_id": "user-uuid",
  "content": {
    "rationale": "Based on Q2 customer data...",
    "ranked_items": [
      {"item_id": "item-1", "rank": 1, "rationale": "..."},
      {"item_id": "item-2", "rank": 2, "rationale": "..."}
    ]
  }
}
```

---

## Acceptance and governance

When a proposal is accepted, the system:

1. Advances the loop state to `accepted`
2. Auto-records a `decisions` row with `decision_class: convergence`, `impact: medium`
3. Records a governance event
4. Makes the accepted ranked list available as input to the Published Priority List

**The acceptance RPC:**

```bash
POST /v1/catchball/proposals/:id/accept
{
  "actor_id": "authority-user-uuid",
  "rationale": "Team proposal aligns with Q3 strategic objectives. Approved.",
  "provisional": false
}
```

> **Note:** All acceptance and rejection operations are routed through RPCs. Direct table writes for proposal state changes are rejected. This ensures the authority model is enforced — only a user with the correct role and lane can accept a proposal.

---

## What's next

- [Catchball API](/docs/api/catchball) — full endpoint reference
- [Decision classes](/docs/concepts/decision-classes) — `convergence` decision class explained
- [Governance vs audit events](/docs/concepts/governance-vs-audit-events) — what gets recorded when a loop closes
