---
title: Tracks
description: How tracks define comparability boundaries and how to configure and run them inside a cycle.
sidebar_label: Tracks
sidebar_position: 11
---

# Tracks

A **track** is the unit of comparability inside a cycle. It defines which items can be meaningfully ranked against each other, who participates, what criteria apply, and what the results look like. Nothing gets prioritized without a track — it is the boundary that makes ranking decisions valid.

---

## Two distinct constructs

### Track Cell

A track cell is pure geometry: **Item Category × Altitude**. It has no time, no scope, no governance, and no sessions. It simply answers the question: "Which items belong in the same comparison space?"

For example, a track cell might cover *Opportunities at altitude 3 (Initiative)* or *Problems at altitude 2 (Feature)*. Items in different track cells are structurally incomparable — this is enforced by the system, not a policy choice.

### Track Instance

A track instance is a track cell brought to life inside a specific cycle and organizational scope. It owns:

- A **participation set** (who ranks in this track)
- An **item pool** (which items are in scope for ranking)
- **Criteria and scales** (the attributes and value types used to score items)
- **Sessions** (the prioritization sessions that run within this track)
- **Results** (the ranked output, published at cycle close)
- A **governance posture** (derived from the latest catchball proposal)

Multiple track instances can run in parallel inside the same cycle. Each is independent — sessions, results, and governance outcomes in one track do not affect another.

### Track Cohort *(reporting only)*

A track cohort groups track instances that share the same track cell across different cycles or scopes. It is a reporting and analytics construct — it has no governance state and does not affect execution.

| Construct | Layer | What it is | Has governance? |
|---|---|---|---|
| Track Cell | Geometry | Category × Altitude boundary. Timeless, scopeless. | No |
| Track Instance | Execution | Track cell + cycle + scope. Owns sessions, results, proposals. | Yes |
| Track Cohort | Reporting | Track instances sharing a track cell across cycles. Analytics only. | No |

---

## Finding and opening tracks

Tracks are accessed through a cycle. Navigate to **Cycles**, open a cycle, and select the **Tracks** tab. Each track instance in the cycle is listed with its category, altitude, scope, and current readiness status. Click any track to open its detail view.

---

## Track detail tabs

When you open a track instance, you see a tabbed workspace organized around the conditions that must be met before sessions can run.

### Overview

The conditions dashboard. Shows the readiness status of every configuration area (participation, item pool, criteria, value ranges, values) and provides direct action buttons for each. This is the primary entry point — you can complete areas in any order; the system tracks what is done.

### Participation

Defines who participates in sessions within this track. Participants can be:

- **Inherited from the cycle** — participants added at the cycle level flow down automatically
- **Track-specific** — you can add or remove people for this track only

Participants are assigned roles (voter, observer, facilitator). The participation step can be locked by a facilitator to prevent late changes before sessions begin.

### Item Pool

The set of items assigned to this track for ranking. You can:

- **Add items manually** — search and add items from the workspace
- **Apply filters** — filter by category, altitude, tags, or strategic bucket to populate the pool
- **Lock the pool** — once locked, no items can be added or removed without unlocking first

Only items in the pool participate in sessions and appear in the ranked output.

### Criteria & Scales

Configures the scoring dimensions used in sessions within this track:

- **Attributes** — the evaluation criteria (e.g. business value, effort, risk, strategic alignment)
- **Value types** — the scale or input method for each attribute (numeric, ranked choice, WSJF, etc.)

Changes here propagate to all new sessions in this track. Criteria can be locked to prevent mid-cycle modifications.

### Value Ranges

Sets the expected value ranges for each scoring attribute. Ranges are used to normalize scores across participants and catch outlier inputs. Once ranges are converged and locked, session results become comparable.

### Values

The consolidated value matrix — the aggregated attribute scores for each item in the pool, drawn from session results. Shows provenance (which session contributed which scores) and allows reviewing outliers or abstentions before publishing.

### Relationships

The relationships tab shows cross-track and cross-cycle dependencies for the items in this track's pool. Dependency conflicts (e.g. an item ranked above-the-line that depends on an item ranked below) are surfaced here and must be resolved before publishing results.

### Sessions

Lists all prioritization sessions that have run or are scheduled within this track. From here you can:

- **Create a new session** — inherits the track's configuration as defaults
- **Open an existing session** — view results, replay, or continue if still open

Sessions run inside the track boundary — participants, criteria, and item pool are all scoped to this track instance.

### Results

The published ranked output for this track. Results are immutable once published. The results tab shows:

- The ranked list of items (above-the-line and below-the-line)
- The publishing date and the session(s) that contributed
- Any governance notes or rationale attached to the result

### Defaults

The session configuration template for this track. When you create a new session inside this track, it inherits the values set here:

- **Workflow preset** — the session type and flow (e.g. dot voting, stack ranking, criteria scoring)
- **Session-level defaults** — timer settings, anonymous voting, tiebreaker rules, and other session parameters

Changing defaults does not affect sessions that have already been created.

### Provenance

A lineage timeline showing the full history of this track instance — configuration changes, session events, lock/unlock actions, and governance transitions. Useful for auditing and understanding how the track evolved over the cycle.

### Discussion

A threaded comment channel attached to this track instance. Use it to record context, flag issues, or communicate with other participants without leaving the track workspace.

---

## Readiness model

Tracks use a **conditions-met model**, not a wizard. There is no required sequence — you can configure participation, the item pool, criteria, and value ranges in any order. The Overview tab tracks which conditions are satisfied. Sessions cannot start until the minimum required conditions are met (participation set, pool locked, criteria confirmed).

---

## Creating a track instance

1. **Open a cycle** and navigate to the **Tracks** tab
2. Click **Add Track**
3. Select the **Item Category** and **Altitude** that define the track cell
4. Set the **scope** — which organizational units or teams are included
5. Click **Create** — the track instance is created in configuring state
6. Work through the Overview conditions to prepare the track for sessions

Tracks can be added at any point during the cycle's design phase.

---

## Parallel tracks

A cycle can have multiple active track instances running simultaneously. Common patterns:

- **By altitude** — one track for initiatives (altitude 3), one for features (altitude 2)
- **By category** — separate tracks for problems, opportunities, and investments
- **By scope** — one track per business unit or product area, all in the same cycle

Each track runs independently. Participants, sessions, and results do not cross track boundaries within a cycle.

---

## Track governance posture

The governance posture is a derived field that reflects where a track instance stands in the catchball process. It is automatically updated as proposals move through the catchball loop and does not require manual input. The posture is visible on the track list in the cycle and on the track's Overview tab.

See [Catchball](./catchball.md) for how proposals and governance states connect to tracks.
