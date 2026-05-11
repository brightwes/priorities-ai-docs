---
title: Catchball API
description: Bidirectional priority alignment. Proposals, loops, threads, acceptance, rejection.
sidebar_label: Catchball API
sidebar_position: 6
audience: Developers
status: published
---

# Catchball

Catchball is the bidirectional alignment mechanism. Teams submit proposals; authorities review, accept, return, or reject. Every exchange is recorded.

See [Concepts: Catchball and authority](/docs/concepts/catchball-and-authority) for the full model.

All Catchball state changes route through RPCs. Direct table writes for proposals or loop states are rejected.

---

## List loops

```
GET /v1/catchball/loops
```

**Scopes:** `catchball:read`

**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| `cycle_id` | uuid | Filter by cycle |
| `state` | string | Filter by loop state |

---

## Get a loop

```
GET /v1/catchball/loops/:id
```

**Scopes:** `catchball:read`

---

## List proposals

```
GET /v1/catchball/proposals
```

**Scopes:** `catchball:read`

**Query parameters:** `loop_id`, `state`, `submitter_id`

---

## Submit a proposal

```
POST /v1/catchball/proposals
```

**Scopes:** `catchball:write`

Routes through `catchball_submit_proposal` RPC. The submitter must have a role that permits submission in the target loop's authority lane.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `loop_id` | uuid | **required** | Target Catchball Loop |
| `submitter_id` | uuid | **required** | Submitting user |
| `content` | object | **required** | Proposal content (see below) |

**Proposal content:**

```json
{
  "rationale": "Based on Q2 customer feedback and engineering capacity...",
  "ranked_items": [
    {
      "item_id": "item-uuid-1",
      "rank": 1,
      "rationale": "Highest customer impact, clear path to execution"
    },
    {
      "item_id": "item-uuid-2",
      "rank": 2,
      "rationale": "Required for regulatory compliance in Q3"
    }
  ],
  "constraints": [
    "Engineering capacity limited to 4 team-weeks in Q3",
    "Item 3 has a hard dependency on infrastructure work not in this pool"
  ]
}
```

**Request:**

```bash
curl -X POST "$PAI_BASE/catchball/proposals" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "loop_id": "loop-uuid",
    "submitter_id": "team-lead-user-uuid",
    "content": { ... }
  }'
```

---

## Get a proposal

```
GET /v1/catchball/proposals/:id
```

**Scopes:** `catchball:read`

Returns the proposal and its full revision history.

---

## Accept a proposal

```
POST /v1/catchball/proposals/:id/accept
```

**Scopes:** `catchball:write`

Routes through `catchball_accept_packet` RPC. The actor must hold the decision authority for the target loop. Auto-records a `convergence` decision.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actor_id` | uuid | **required** | Authority accepting the proposal |
| `rationale` | string | **required** | Acceptance rationale — recorded in decision log |
| `provisional` | boolean | | If `true`, advances to `accepted_provisional` (default: `false`) |

**Request:**

```bash
curl -X POST "$PAI_BASE/catchball/proposals/proposal-uuid/accept" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "actor_id": "vp-user-uuid",
    "rationale": "Proposal aligns with Q3 strategic objectives. Approved.",
    "provisional": false
  }'
```

**Response:**

```json
{
  "data": {
    "proposal_id": "proposal-uuid",
    "loop_state": "accepted",
    "decision_id": "decision-uuid",
    "accepted_at": "2026-04-01T14:00:00Z"
  },
  "meta": { ... }
}
```

---

## Reject a proposal

```
POST /v1/catchball/proposals/:id/reject
```

**Scopes:** `catchball:write`

Routes through `catchball_reject_proposal` RPC. Atomically updates proposal status and appends a `proposal.rejected` governance event. The proposal must be in `pending`, `submitted`, or `under_review` status.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actor_id` | uuid | **required** | Authority rejecting the proposal |
| `note` | string | **required** | Reason for rejection — recorded in governance log |

---

## Return a proposal

```
POST /v1/catchball/proposals/:id/return
```

**Scopes:** `catchball:write`

Routes through `catchball_return_proposal` RPC. Atomically updates proposal status to `returned` and appends a `proposal.returned` governance event. The submitting team may revise and resubmit.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actor_id` | uuid | **required** | Authority returning the proposal |
| `note` | string | **required** | Guidance for the submitting team — what to revise |

---

## Get proposal thread

```
GET /v1/catchball/threads?proposal_id=:id
```

**Scopes:** `catchball:read`

Returns the discussion thread (structured comments) on a proposal — the exchange between the submitting team and the reviewing authority.

---

## What's next

- [Concepts: Catchball and authority](/docs/concepts/catchball-and-authority)
- [Guide: run a headless session](/docs/guides/run-headless-session)
