---
title: Comparability and Tracks — Priorities.ai
description: Track Cell = Item Category × Altitude. Why comparability geometry is the foundation of defensible ranking.
audience: Developers
source-canon: DOCS_V4/00-canon/02-canonical-domain-model.md
status: published
---

# Comparability and Tracks

The most common failure in prioritization is not bad judgment — it is comparing things that are not legitimately comparable.

A corporate strategic initiative should not be ranked against a team-level bug fix. A five-year bet should not be ranked against a two-week task. Forcing those comparisons produces rankings that collapse under any analytical scrutiny, because every ranking implies a unit of comparison, and ranking things of different units produces a list that cannot answer *why*.

Track Cells enforce that items are only compared against their peers.

---

## Track Cell geometry

The comparison boundary in Priorities.ai is the **Track Cell**:

```
Track Cell = Item Category × Altitude
```

**Item Category** is the type classification of an item — `initiative`, `feature`, `technical`, `risk`, `compliance`, `customer_commitment`, or any custom category your organization defines.

**Altitude** is the decision significance of the item — a 1–5 measure of the organizational level at which the item is being evaluated.

```
Altitude 5: Enterprise / board-level strategic bets
Altitude 4: Division or portfolio-level investments
Altitude 3: Program or product-level initiatives
Altitude 2: Team-level features and projects
Altitude 1: Task-level work items
```

A Track Cell is the intersection of these two axes. Items in the same Track Cell are legitimately comparable against each other. Items in different Track Cells are not — without explicit Track Cell Range configuration.

---

## Examples

| Item | Category | Altitude | Track Cell |
|------|----------|---------|------------|
| FY26 International Expansion | initiative | 4 | (initiative, 4) |
| Q3 Product Investment | initiative | 3 | (initiative, 3) |
| Onboarding flow redesign | feature | 2 | (feature, 2) |
| MFA enforcement | compliance | 2 | (compliance, 2) |
| Auth library upgrade | technical | 1 | (technical, 1) |

An item in `(initiative, 4)` cannot be ranked against an item in `(feature, 2)`. They are not the same kind of thing at the same organizational level.

---

## Track Instances

In the context of a Cycle, a **Track Instance** is the realization of a Track Cell for that specific cycle. It carries:

- The Track Cell definition (Category × Altitude)
- The item pool (which items are eligible for this track)
- The readiness state (S1–S6, see below)
- Participant configuration
- Criteria configuration

Track Instances are what you see when you call `GET /v1/cycles/:id/tracks`.

---

## Track Readiness states

A Track Instance must reach S6 before ranking is legitimate.

| State | Condition |
|-------|-----------|
| S1 | Participation configured |
| S2 | Item pool assembled |
| S3 | Criteria selected |
| S4 | Scales defined |
| S5 | Values complete (all required attribute values collected for all items in pool) |
| S6 | Ready for ranking (all above satisfied) |

Most tools start at S6 and assume the rest happened somewhere else. In Priorities.ai, readiness is tracked explicitly and the system surfaces which stages are incomplete before any ranking session is started.

---

## Track Cell Range

Some organizations want to rank across adjacent Track Cells in a single track — for example, ranking all `initiative` items at Altitude 2–3 together rather than in separate tracks.

A **Track Cell Range** is a configured set of two or more Track Cells that a single Track Instance covers. This is an explicit configuration choice — not an automatic behavior.

---

## Classification State

Track Cell assignment on an item has its own state machine:

```
empty → proposed → approved
```

| State | Description |
|-------|-------------|
| `empty` | No Track Cell assigned — item not eligible for any comparison |
| `proposed` | A Category + Altitude has been asserted (by human or agent) — not yet confirmed |
| `approved` | Human-confirmed assignment — item is eligible for comparisons in matching Track Cells |

Every Track Cell assignment is audited. When a Classification Proposal is accepted, the system records: who proposed it, when, what the values were, and whether it was accepted or superseded.

---

## Developer patterns

```bash
# Create a session scoped to a specific track
POST /v1/sessions
{
  "cycle_id": "...",
  "name": "Q3 Initiative Ranking",
  "track_cell": {
    "category": "initiative",
    "altitude": 3
  }
}

# Get all tracks and their readiness states for a cycle
GET /v1/cycles/:id/tracks
```

**When building integrations:**

When you ingest items from a System of Record (Workday headcount, Salesforce commitments), set the `category` and request altitude classification. Items with `classification_state: empty` will not appear in Track-scoped sessions.

When you export priority lists to a System of Execution (Jira), the exported item carries its Track Cell as metadata — giving the receiving system the organizational context of the decision.

---

## What's next

- [Item relationships](/concepts/item-relationships) — typed relationship graph
- [Protection rings](/concepts/protection-rings) — mutation rules for items in active contexts
- [State machines](/concepts/state-machines) — the cycle and session state machines
