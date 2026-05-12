---
title: Catchball & Governance
description: Bidirectional negotiation, proposals, ratification, and commitment tracking.
sidebar_label: Catchball & Governance
sidebar_position: 12
---

# Catchball & Governance

The Catchball and Governance section covers the structured decision processes that sit on top of prioritization results — the negotiation, approval, and commitment work that turns ranked items into binding organizational commitments.

---

## What is Catchball?

Catchball is a planning methodology from Toyota's Hoshin Kanri system. The name refers to a ball being thrown back and forth between organizational levels: leadership sets direction, teams respond with proposals, leadership ratifies or refines, and so on until both sides align.

In Priorities.ai, Catchball is implemented as a structured proposal-and-response loop:
1. Leadership or a planning authority publishes a priority list or direction
2. Teams (or individuals) respond with proposals — commitments they are willing to make
3. The authority reviews, negotiates, and either ratifies or returns for revision
4. Ratified proposals become Commitments

---

## Catchball Dashboard

**Route:** `/prioritization/catchball`

The Catchball Dashboard is the entry point for all Catchball activity. It shows the current state of all active Catchball loops — which ones are waiting for a response, which are awaiting ratification, and which are complete.

### What you see
- A summary of open loops by status
- Badges showing how many items need your attention ("ball in your court")
- Quick links into each active loop

:::note
The sidebar badge on the Catchball nav link counts items where the "ball is in your court" — meaning you need to take action.
:::

---

## Catchball by Cycle

When you have a pinned cycle, the Catchball link in the sidebar points directly into that cycle's Catchball workspace:

**Route:** `/prioritization/cycles/:cycleId/workspace`

This workspace shows the Catchball activity for the current cycle — the proposals submitted, their status, and the items under negotiation.

---

## Executive Inbox

**Route:** `/prioritization/catchball/executive-inbox`

The Executive Inbox is a focused view for senior leaders and planning authorities who need to review and act on incoming proposals. It aggregates all proposals addressed to them across all cycles into one surface.

### What you see
- Proposals awaiting your review
- The items each proposal covers, with rankings and supporting rationale
- Your response options for each proposal

### Actions

| Action | How |
|---|---|
| Ratify a proposal | Click **Ratify** — converts the proposal to a Commitment |
| Return for revision | Click **Return** and add a note explaining what needs to change |
| Reject a proposal | Click **Reject** with a required rationale |
| Request a meeting | Flag the proposal for a synchronous discussion |

---

## Proposals

**Route:** `/prioritization/governance/proposals`

The Proposals page shows all proposals in the workspace — submitted, under review, ratified, returned, and rejected.

### What is a proposal?
A proposal is a team's response to a priority list or planning directive. It says: "Given what has been ranked, here is what we are willing to commit to." A proposal typically covers a set of items, target dates, owners, and capacity assumptions.

### Actions

| Action | How |
|---|---|
| Create a proposal | Click **New Proposal** |
| Open a proposal | Click the proposal name |
| Submit a proposal | Open the proposal and click **Submit** (moves it to the authority's inbox) |
| Revise a returned proposal | Open the returned proposal, make changes, and resubmit |

---

## Ratification

**Route:** `/prioritization/governance/ratification`

The Ratification page is where authorities formally approve or reject proposals. It is a queue of proposals that are ready for a ratification decision.

### Actions
- **Ratify** — approve the proposal and create the resulting Commitments
- **Return** — send back with revision notes
- **Reject** — close the proposal without creating Commitments

---

## Commitments

**Route:** `/prioritization/commitments`

Commitments are the binding outputs of ratified proposals. A Commitment says: "We agreed that this item will be done, by this person, by this date." Commitments are the formal record of what was decided.

### What you see
A list of all Commitments in the workspace. Each commitment shows the item, the owner, the due date, and the current status (On Track, At Risk, Complete, etc.).

### Actions

| Action | How |
|---|---|
| View a commitment | Click it to see the full detail, history, and rationale |
| Update commitment status | Open the commitment and change the status field |
| Link evidence | Attach links or notes showing progress or completion |

:::note
The Commitments page is module-gated and appears in the sidebar only when the module is enabled.
:::

---

## Tips

- Catchball is most effective when cycles have a clear scope and the priority list is finalized before proposals are requested.
- The Executive Inbox is designed for asynchronous review — leaders can respond to proposals on their own schedule rather than requiring a live meeting.
- Commitment status should be kept current; it feeds the Cycle Execution Report and gives leadership real-time visibility into delivery health.
