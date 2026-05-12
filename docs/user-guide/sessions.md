---
title: Sessions
description: Facilitated ranking events where participants compare and rank items to produce priority decisions.
sidebar_label: Sessions
sidebar_position: 11
---

# Sessions

Sessions are the decision-producing events in Priorities.ai. A session brings a group of participants together — synchronously or asynchronously — to compare and rank items using a structured method. The result is an immutable record of how participants judged the items.

---

## Sessions List

**Route:** `/prioritization/sessions`

The Sessions list shows all sessions in the workspace — active, completed, and draft.

### What you see
Sessions are grouped by status:
- **Active** — currently running or ready to start
- **Completed** — all participants have submitted; awaiting result processing or approval
- **Draft** — configured but not yet launched

Each session shows its name, the method used, the cycle it belongs to (if any), participant count, and response rate.

### Actions

| Action | How |
|---|---|
| Create a session from scratch | Click **Start from scratch** and use the session wizard |
| Create a session from a tool | Click **Start with tool** to pick a specific prioritization method |
| Quick-create a session | Click **New Session** for a streamlined creation flow |
| Open a session | Click the session name |
| View as a participant | Click **Participant View** (top right) |

---

## Session Types

Sessions are built around a **method** — the comparison mechanism participants use:

| Method | How it works |
|---|---|
| **Stack ranking** | Participants drag items into priority order |
| **Pairwise comparison** | Two items are shown at a time; participants pick the higher-priority one |
| **Weighted scoring** | Participants score items against defined criteria |
| **Eisenhower matrix** | Participants place items in a 2×2 grid (urgency vs. importance) |
| **Dot voting** | Participants allocate a fixed number of votes across items |
| **AHP** | Analytic Hierarchy Process — pairwise comparison with calculated consistency |
| **Custom matrix** | A configurable scoring matrix for specialized use cases |

The method is set at session creation and cannot be changed once the session is launched.

---

## Session Detail

**Route:** `/prioritization/sessions/:sessionId`

The Session Detail page is the management surface for a single session.

### Tabs

| Tab | What it contains |
|---|---|
| **Overview** | Session name, method, scope, cycle link, and status |
| **Participants** | Who is invited, who has responded, and response rate |
| **Items** | Which items are in scope for this session |
| **Results** | Aggregate and individual ranking results (available after submission) |
| **Settings** | Session configuration (deadline, method parameters, etc.) |

### Actions

| Action | How |
|---|---|
| Launch a session | Click **Launch** (moves status from Draft to Active) |
| Close a session | Click **Close** (stops accepting submissions) |
| Add a participant | Click **Add participant** in the Participants tab |
| Send a reminder | Click **Send reminder** to participants who have not responded |
| Approve results | Click **Approve results** to promote session results to cycle-level rankings |
| Export results | Click **Export** in the Results tab |

---

## Running a Session (Participant View)

When a participant opens a session link, they see the session interface for the configured method. The UI is optimized for the method:
- **Stack ranking** — a drag-and-drop list
- **Pairwise** — a side-by-side card comparison
- **Scoring** — a table with score entry for each item/criterion

Participants can save progress and return before the deadline. Once they submit, their inputs are locked.

---

## TV Mode (Presentation)

**Route:** `/prioritization/sessions/:sessionId/present`

TV Mode is a full-screen display designed for projecting session results in a room. It shows the current rankings in a clean, large-format layout suitable for team review or facilitation.

### When to use
- During a live facilitated session to show results as they come in
- In a review meeting after a session closes to walk through the results with stakeholders

---

## Session Results

**Route:** `/prioritization/sessions/:sessionId/results`

The Session Results page shows the final output of a session — the aggregated rankings from all participants, individual breakdowns, and statistical summaries.

### What you see
- **Aggregate ranking** — items sorted by their aggregate score or position
- **Participant breakdown** — how each participant ranked each item (where the method allows)
- **Consistency score** — for methods like AHP, a measure of how internally consistent each participant's inputs were

---

## Session Reports

**Route:** `/prioritization/reports/sessions`

The Session Reports page is a cross-session analytics view — not just one session, but trends across multiple sessions: response rates, completion rates, method usage, and aggregate quality metrics.

---

## Tips

- Sessions within a cycle should be run after items reach acceptable readiness — unready items produce lower-quality results.
- You can run multiple sessions in parallel across different tracks within the same cycle.
- Sessions produce immutable results — once results are approved and rolled up into cycle rankings, they cannot be retroactively changed. This is by design; it is the basis for decision provenance.
- TV Mode requires a modern browser and works best on a laptop connected to a display or projector.
