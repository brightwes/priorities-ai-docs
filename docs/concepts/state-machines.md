---
title: State Machines — Priorities.ai
description: Session, Cycle, Catchball Loop, and Plan of Record state machines — fully specified.
audience: Developers
source-canon: DOCS_V4/00-canon/03-state-model-and-transitions.md
status: published
---

# State Machines

Priorities.ai has four primary state machines. They are **orthogonal** — advancing the state of one does not automatically advance any other. This is a deliberate design: the session and cycle lifecycles are independent, and the authority model must be satisfied separately for each.

---

## 1. Session state machine

```
DRAFT → CRITERIA_FINALIZED → RUN_COMPLETE → PUBLISHED
```

| State | Description | Auto-records |
|-------|-------------|-------------|
| `DRAFT` | Session created, not yet configured | — |
| `CRITERIA_FINALIZED` | Criteria locked — no further criteria changes without admin override | `selection` decision |
| `RUN_COMPLETE` | At least one tool session finalized, results available | — |
| `PUBLISHED` | Results locked, output immutable, available in reports | `force_ranking` decision |

**Rules:**
- `DRAFT → CRITERIA_FINALIZED`: All required criteria fields must be populated
- `CRITERIA_FINALIZED → RUN_COMPLETE`: At least one tool session must be in `finalized` state
- `RUN_COMPLETE → PUBLISHED`: Facilitator must trigger explicitly — system does not auto-advance
- `PUBLISHED` is terminal — no transitions out

**API:** `POST /v1/sessions/:id/transition` with `{"to_state": "PUBLISHED"}`

**Session state and cycle state are orthogonal.** A session reaching `PUBLISHED` does not advance the cycle phase.

---

## 2. Cycle state machine

Cycle phases are configurable per workspace, but the canonical sequence is:

```
draft → planning → execution → published → closed
```

| State | Description |
|-------|-------------|
| `draft` | Cycle created, not yet configured |
| `planning` | Cycle Readiness phase — participant configuration, pool assembly, criteria selection |
| `execution` | Cycle Execution phase — sessions running, Catchball active |
| `published` | Priority list published and ratified |
| `closed` | Cycle complete |

**Rules:**
- All transitions require the `transition_cycle_phase` RPC — direct status updates are rejected
- The RPC enforces that the Cycle Owner (or admin) is the actor
- Every transition records a governance event

**API:** `POST /v1/cycles/:id/transition` with `{"to_phase": "execution", "reason": "..."}`

**Track readiness is checked at `planning → execution` transition.** If any track has not reached S6 (ready for ranking), the transition surface a warning. The transition may still proceed but the warning is recorded.

---

## 3. Catchball Loop state machine

```
working → proposed → returned → accepted_provisional → accepted → closed
                   ↘                                ↗
                    rejected ──────────────────────→ closed
```

| State | Description | Auto-records |
|-------|-------------|-------------|
| `working` | Loop open, proposal in draft | — |
| `proposed` | Proposal submitted, awaiting review | — |
| `returned` | Authority returned with guidance | — |
| `accepted_provisional` | Accepted with conditions | — |
| `accepted` | Final acceptance | `convergence` decision |
| `rejected` | Rejected with rationale | — |
| `closed` | Terminal state | — |

**Multiple proposal iterations:** A returned proposal moves back to `working` for revision. Each submission is a new revision; the full revision history is preserved. The loop state follows the proposal.

**API:** Proposals are submitted via `POST /v1/catchball/proposals` (routes to `catchball_submit_proposal` RPC). Acceptance via `POST /v1/catchball/proposals/:id/accept` (routes to `catchball_accept_packet` RPC).

---

## 4. Tool Session state machine

```
collecting → revealed → finalized
```

| State | Description |
|-------|-------------|
| `collecting` | Open for participant submissions |
| `revealed` | All responses visible to participants; no new submissions |
| `finalized` | Responses aggregated, result locked |

**Rules:**
- `collecting → revealed`: Facilitator explicitly transitions
- `revealed → finalized`: Facilitator calls `POST /v1/tool-sessions/:id/finalize`
- `finalized` is terminal

In `hidden` vote mode, individual responses are not visible to other participants until `revealed`. In `live` vote mode, responses are visible to all participants in real time.

---

## 5. Classification State machine (Item)

```
empty → proposed → approved
```

| State | Description |
|-------|-------------|
| `empty` | No Track Cell assigned |
| `proposed` | Category + Altitude asserted, not yet confirmed |
| `approved` | Human-confirmed assignment — item is eligible for track-scoped sessions |

Track Cell assignment can be proposed by a human or by an AI agent. It becomes `approved` only after explicit human confirmation (a Classification Determination).

---

## State machine independence

```
                ORTHOGONAL — these do not share transitions

Session:    DRAFT → CRITERIA_FINALIZED → RUN_COMPLETE → PUBLISHED
                          ↕
Cycle:      draft → planning → execution → published → closed
                          ↕
Catchball:  working → proposed → returned → accepted → closed
```

**Common integration mistake:** Assuming that when a Session reaches `PUBLISHED`, the Cycle automatically advances to `published`. It does not. The Cycle Owner must explicitly transition the cycle phase, typically after reviewing all sessions in the cycle and ratifying the output as the Published Priority List.

---

## What's next

- [Sessions API](/api/sessions) — session lifecycle endpoints
- [Cycles API](/api/cycles) — cycle lifecycle endpoints
- [Catchball API](/api/catchball) — loop and proposal endpoints
