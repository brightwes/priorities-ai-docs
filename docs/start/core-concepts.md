---
title: Core Concepts — Priorities.ai
description: The three primitives and the mental model you need before building a deeper integration.
audience: Developers
status: published
nav-order: 2
---

# Core Concepts

This page explains the three primitives that Priorities.ai exposes as API surfaces. If you completed the quickstart, you've already touched all three. This page explains the model underneath them.

---

## The system in one sentence

Priorities.ai is the capability layer between your Systems of Record (Workday, Salesforce) and your Systems of Execution (Jira, Azure DevOps) — the System of Decision that produces auditable, queryable, defensible prioritization outputs from structured, governed processes.

---

## Primitive 1: Prioritization Logic

The API for running a complete prioritization process — from item intake to published priority list.

**Key resources:**

| Resource | What it represents |
|----------|-------------------|
| `Item` | A work object, idea, initiative, or request. Exists independently of any cycle. Accumulates attributes and relationships over time. |
| `Cycle` | The governance container for a prioritization effort. Has phases, owners, and ratified outcomes. Phase transitions require the authority model to be satisfied. |
| `Track` | A comparability boundary: `Track Cell = Item Category × Altitude`. Items in the same Track Cell can be ranked against each other. Items in different Track Cells cannot without explicit configuration. |
| `Session` | The execution unit within a Cycle. Owns criteria, eligibility, tool configuration, and outputs. |
| `Tool Session` | A collaborative run of a single prioritization tool (RICE, dot voting, weighted scoring, force ranking, buy-a-feature, etc.). Lifecycle: `collecting → revealed → finalized`. |
| `Catchball Loop` | A bidirectional alignment exchange between organizational tiers within a Cycle. State machine: `working → proposed → returned → accepted_provisional → accepted → rejected → closed`. |
| `Published Priority List` | The only authoritative priority output. Immutable once published. Every future cycle produces a new list. |

**The state machines are orthogonal.** Session completion does not advance Cycle phases. Catchball acceptance does not advance Cycle phases. Each state machine governs its own transitions independently.

**All authority transitions go through RPCs.** Cycle phase transitions, session state transitions, and Catchball acceptances are all routed through server-side RPCs that enforce the authority model. Direct table writes for these operations are rejected.

---

## Primitive 2: Item Relationship Graph

Items in most tools are flat — a list of tickets or a backlog row. Priorities.ai maintains a typed, mutation-governed relationship graph on every item.

**Ten relationship types:**

| Type | Axis | What it means |
|------|------|---------------|
| `Cluster` (duplicate, variant) | Horizontal | Identity or near-identity — items that may be the same thing |
| `Package` | Horizontal | Atomicity — these items must be selected together or not at all |
| `Dependency` (informational, soft, hard) | Horizontal | Constraint asserted by the dependent item — B depends on A |
| `Prerequisite` (informational, soft, hard) | Horizontal | Constraint asserted by the required item — A enables B |
| `Aggregation` | Vertical | Composition bottom-up — child asserts "I am part of P" |
| `Breakdown` | Vertical | Decomposition top-down — parent asserts "My parts are C1, C2, …" |
| `Elaboration` (spectrum, variant) | Vertical | Response — children are alternative approaches to a parent need |
| `Reframe` | Framing | Perspective — same reality described from a different lens |
| `Lineage` (split, merge, supersede, retire, fork) | Temporal | Structural transformation — where an item came from or went |
| `Collection` | Curatorial | User-curated grouping — no governance weight |

**Why this matters for integrations:**

When you write a priority output back to Jira, you need to know if an item is a Package member (the whole Package must be committed together), has hard Dependencies (those must be addressed before the commitment is fully legitimate), or is part of an Aggregation (child dependencies surface at parent commitment time).

A flat list of ranked items is not enough information to produce a correct execution plan. The relationship graph is the information that makes the ranked list safe to act on.

**Enforcement rules:**

Relationships are not passive labels. A `hard` Dependency blocks commitment-quality prioritization disposition until the dependency condition is explicitly addressed. A `Package` with only some members in the comparison scope blocks commitment-quality decisions on any Package member. These rules are enforced by the platform and surfaced via API responses.

---

## Primitive 3: Decision Traceability

Every decision the platform makes or records is available as a typed, queryable resource.

**Decision classes:**

| Class | Description | Typical trigger |
|-------|-------------|----------------|
| `force_ranking` | Strict total ordering produced | Session published, Priority list approved |
| `selection` | Bounded set chosen from candidates | Criteria finalized, Item pool curated |
| `convergence` | Uncertain/disputed values resolved | Catchball proposal accepted |
| `range_selection` | Ranges, bands, or thresholds set | Scale definitions confirmed |
| `review` | Structured comparison without total ordering | Review sessions |

**Auto-recorded decisions:**

The platform automatically writes a `decisions` row for:
- Session published → `force_ranking`, impact `high`
- Criteria finalized → `selection`, impact `medium`
- Priority list approved → `force_ranking`, impact `high`
- Catchball proposal accepted → `convergence`, impact `medium`

Each auto-decision carries the source event ID, linked session/cycle/item objects, the actor, and a generated title and body.

**Manual decisions:**

Users can record any organizational decision — with rationale, decision class, impact, related objects, and tags — independently of any system event. These appear alongside auto-decisions in the decision log.

**The event hierarchy:**

```
decisions          ← typed, human-readable, manually + auto-recorded
governance_events  ← major lifecycle actions (publish, lock, phase transitions)
audit_events       ← full per-item trail (every event that happened to an item)
```

> **Note (Coming soon):** `GET /v1/governance-events` and `GET /v1/audit-events` are planned. `GET /v1/decisions` is also planned. Webhook delivery for `session.published`, `cycle.transition`, and `priority_list.approved` is available today.

---

## Items and their lifecycle

Items exist independently of any Cycle. The lifecycle has three operating domains:

```
Item Management (always-on)
  └── Item created → enriched → clustered → attributed → classified

Cycle Readiness (pre-execution)
  └── Participant configuration → Item pool → Criteria selection → Scale definition → Value assignment

Cycle Execution (governed)
  └── Force ranking → Catchball → Governance transitions → Published Priority List
```

**Exit status** is separate from cycle participation. An item's `status` field (`intake`, `active`, `shaping`, `deferred`, `archived`) reflects its lifecycle in Item Management. Whether it is in a Cycle, a Track, or a Session is tracked separately.

---

## Track Cells and comparability

You cannot rank a corporate strategic initiative against a team-level bug fix. They are not the same kind of thing. Trying to do so produces rankings that collapse under any scrutiny.

Track Cells enforce that items are only compared against their actual peers:

```
Track Cell = Item Category × Altitude

Examples:
  (initiative, altitude: 3) — strategic initiative
  (feature, altitude: 2)    — customer-facing feature
  (technical, altitude: 1)  — engineering work
```

When you create a Session via the API, you configure which Track Cell(s) it covers. Items that don't belong to those cells are not eligible for that session.

---

## Authentication model

All API requests use workspace-scoped Bearer API keys. Keys carry explicit scopes. An empty scopes array grants full access.

```
Authorization: Bearer pk_live_<64 hex chars>
```

See [Authentication](/docs/start/authentication) for key formats, scopes reference, and key rotation.

---

## What's next

- [Authentication](/docs/start/authentication) — key formats, scopes, rate limits
- [Item relationships in depth](/docs/concepts/item-relationships) — the full taxonomy and mutation rules
- [Comparability and tracks](/docs/concepts/comparability-and-tracks) — Track Cells explained in detail
- [State machines](/docs/concepts/state-machines) — all four orthogonal state machines
- [Decision classes](/docs/concepts/decision-classes) — the typed decision registry
