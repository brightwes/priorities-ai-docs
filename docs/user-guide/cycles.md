---
title: Cycles
description: Configure and run a structured prioritization effort from setup through published results.
sidebar_label: Cycles
sidebar_position: 10
---

# Cycles

A cycle is the primary governance container in Priorities.ai. It is the structured envelope inside which items are compared, sessions are run, and decisions are made. Every published priority list traces back to a cycle.

---

## Cycles List

**Route:** `/prioritization/cycles`

The Cycles list is the starting point for all cycle work. It shows every cycle in the workspace — past, active, and upcoming.

### What you see
A list of cycles with their name, status, start/end dates, and key stats (number of items in scope, sessions run, completion percentage).

### Cycle statuses

| Status | Meaning |
|---|---|
| **Draft** | Cycle is being configured; no sessions have started |
| **Active** | Cycle is running; sessions can be created and run |
| **Closed** | All sessions are complete; awaiting result publication |
| **Published** | Results have been published and are final |
| **Archived** | Cycle has been moved to archive |

### Actions

| Action | How |
|---|---|
| Create a cycle | Click **New Cycle** |
| Open a cycle | Click the cycle name |
| Pin a cycle | Use the pin action — this adds cycle-specific shortcuts to the sidebar |

---

## Cycle Detail

**Route:** `/prioritization/cycles/:cycleId`

The Cycle Detail page is the full management surface for a single cycle. It is tabbed:

| Tab | What it contains |
|---|---|
| **Overview** | Summary stats, timeline, and status |
| **Scope** | Items included in this cycle |
| **Tracks** | Track configuration for this cycle |
| **Sessions** | Sessions associated with this cycle |
| **Governance** | Proposals and ratification activity |
| **Results** | Priority rankings as they emerge |
| **Settings** | Cycle-level configuration |

---

## Cycle Dashboard (Workspace)

**Route:** `/prioritization/cycles/:cycleId?tab=workspace` or via the pinned cycle shortcut

When a cycle is pinned, the sidebar shows a **Workspace** link that opens the Cycle Dashboard — a focused view showing the current state of that cycle: readiness, outstanding sessions, items waiting for review, and next steps.

### What you see
- Readiness signals — how many items are ready for sessions vs. still missing data
- Session status — which sessions are scheduled, in progress, or done
- Outstanding actions — items that need triage, scoring, or governance decisions
- Quick links into the cycle's tracks and sessions

---

## Tracks (within a cycle)

**Route:** `/prioritization/cycles/:cycleId/tracks`

Tracks define the comparability geometry for a cycle — they determine which items are compared to each other and by what lens. Items can only be meaningfully ranked within a track, because a track sets the scope of comparison.

For full documentation on configuring and running tracks, see [Tracks](./tracks.md).

### What is a track?
A **Track Cell** is a combination of item category (e.g., Feature) and organizational altitude (e.g., Portfolio). Items that share the same track cell can be compared; items in different track cells are not put head-to-head.

A **Track Instance** is the activation of a track cell inside a specific cycle, with a defined scope of items.

### What you see on the Track list
- All track instances for this cycle
- The item count per track and readiness percentage
- Links to open each track's workspace or item list

---

## Readiness

**Route:** `/prioritization/readiness`

The Readiness page (sometimes "Cycle Readiness") shows which items in the current cycle scope are ready to enter a session — and which need more work before they can be fairly compared.

### Readiness dimensions
Readiness is not a single flag; it is a composite of configured dimensions such as:
- Description completeness
- Attribute/scoring frames filled in
- Strategic alignment (linked to an objective or goal)
- Relationship graph completeness

An item is "ready" when it passes all dimensions configured for the workspace.

### Actions
- Filter to items that are not ready
- Click through to an item's detail page to fill in missing data
- Use the bulk edit tool to resolve common gaps across many items at once

---

## Sessions (cycle-linked)

Sessions that belong to a cycle are accessible from the Cycle Detail's Sessions tab, or from the **Sessions** page filtered to a cycle. See [Sessions](./sessions.md) for full documentation.

---

## Cycle Results

**Route:** `/prioritization/cycles/:cycleId/results`

The Results page shows the aggregated priority ranking that emerges from all sessions run inside the cycle. It is a live view that updates as sessions are completed and approved.

### What you see
- Items ranked by their aggregated session scores
- Track-level rankings (each track has its own ranked list)
- Which sessions contributed to each item's score
- Governance status (pending ratification vs. approved)

---

## Cycle Design Hub

**Route:** `/prioritization/cycle-design`

The Cycle Design Hub (module-gated) is a visual planning surface for designing your cycles before activating them — mapping out tracks, scoping items, and planning the session sequence.

:::note
This page appears in the sidebar only when the Cycle Design module is enabled for your workspace.
:::

---

## Priority Lists

**Route:** `/prioritization/priorities`

Priority Lists are the published output of a cycle. Once a cycle's results are ratified and published, the ranked list of items becomes a Priority List — an immutable record of what was decided and why.

### What you see
A list of all published priority lists across all cycles. Each list shows the cycle it came from, the track, the number of items, and the publication date.

### Actions
- Click a priority list to see the full ranked list with decision provenance
- Export a priority list to CSV or share a link

---

## Plans of Record (POR)

**Route:** `/prioritization/plans`

Plans of Record are the commitments your team makes after reviewing a priority list. A POR takes the top-ranked items from a cycle and formalizes them into an execution plan with owners, timelines, and dependencies.

### POR Detail

**Route:** `/prioritization/plans/:planCycleId`

Opening a plan shows the full commitment set — which items are in, who owns them, target dates, and the rollup of item-level commitments.

---

## Tips

- Pin the active cycle from the Cycles list to get cycle-specific shortcuts in the sidebar.
- Readiness should be at or near 100% before you start sessions — items with missing data produce lower-quality ranking results.
- Track configuration is set at the workspace level (in Settings → Content & Structure) and instantiated per cycle.
