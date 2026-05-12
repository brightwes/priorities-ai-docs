---
title: Reports
description: Analytics, audit artifacts, and decision records across cycles, sessions, and items.
sidebar_label: Reports
sidebar_position: 14
---

# Reports

The Reports section provides structured views of what has happened in your workspace — cycle execution health, session outputs, item readiness status, and decision records. Reports are organized by visibility: required, default, and custom.

---

## Reports Hub

**Route:** `/prioritization/reports`

The Reports Hub is the index page for all reports. It shows:
- **Stats strip** — workspace-level counts (total cycles, sessions, items, item pools) with sub-stats
- **Required reports** — always-on reports the system provides (e.g., cycle execution, session results)
- **Default reports** — reports that are on by default but can be toggled by an admin
- **Custom reports** — reports you or your workspace has created

### Actions

| Action | How |
|---|---|
| Open a report | Click the report card |
| Create a custom report | Click **New Report** → goes to `/prioritization/reports/custom/new` |

---

## Cycle Reports

**Route:** `/prioritization/reports/cycles`

Cycle Reports give you an analytics view across all cycles — completion rates, timeline adherence, and participation metrics.

### What you see
- A list of cycles with their stats
- Completion rate (sessions completed vs. planned)
- Participation rate (participants who submitted vs. invited)
- Timeline adherence (did the cycle finish on schedule?)

---

## Cycle Execution Report

**Route:** `/prioritization/reports/execution`

The Cycle Execution Report is a detailed health report for a specific cycle's delivery progress. It shows whether items committed in the Plan of Record are on track.

### What you see
- Items in the plan, grouped by status (On Track, At Risk, Off Track, Complete)
- Owner-level rollups
- Timeline deviation (how far items have slipped from their committed dates)
- A red/amber/green summary by team or track

### When to use
Use this report in weekly or monthly steering reviews to give leadership a real-time view of delivery health against the committed plan.

---

## Item Readiness Report

**Route:** `/prioritization/reports/item-readiness`

The Item Readiness Report shows the state of item completeness across the workspace — how many items are ready for sessions and how many have gaps.

### What you see
- Overall readiness percentage
- Breakdown by readiness dimension (description, attributes, strategic alignment, etc.)
- Per-item detail with the specific dimensions that are failing

### When to use
Run this report before starting a cycle's sessions to identify items that need enrichment. Items with low readiness should be prioritized for data entry before sessions begin.

---

## Session Reports

**Route:** `/prioritization/reports/sessions`

Session Reports provide cross-session analytics — not the results of a single session, but aggregate patterns across multiple sessions.

### What you see
- Response rates by session
- Method distribution (which methods were used across sessions)
- Participant engagement trends
- Quality signals (consistency scores for AHP sessions, etc.)

---

## Session Results Report

**Route:** `/prioritization/reports/session-results`

The Session Results Report is a detailed, printable view of a specific session's output — suitable for distributing to stakeholders who were not in the session.

### What you see
- The full ranked list with aggregate scores
- Participant breakdown (how each person ranked each item)
- Statistical summary (mean, median, standard deviation per item where applicable)
- Confidence indicators

---

## Priority Set Report

**Route:** `/prioritization/reports/priorities` (or accessed from within a cycle)

See [Priority Lists & Plans → Priority Set Report](./priorities-and-plans.md) for full documentation.

---

## Custom Reports

**Route:** `/prioritization/reports/custom`

Custom Reports let you build tailored views of workspace data — filtered, grouped, and formatted to your needs. Once created, a custom report is saved and available to the whole workspace (or just you, depending on visibility settings).

### Custom Report Builder

**Route:** `/prioritization/reports/custom/new`

The report builder gives you:
- **Data source** — choose what object type to report on (items, cycles, sessions, etc.)
- **Columns** — pick which fields to include
- **Filters** — narrow the report to a specific subset
- **Grouping** — group rows by a field (owner, status, category, etc.)
- **Sort** — define the sort order
- **Visibility** — set whether the report is personal or shared with the workspace

### Actions

| Action | How |
|---|---|
| Create a custom report | Click **New Report** from the Reports Hub |
| Edit a custom report | Open the report and click **Edit** |
| Delete a custom report | Use the report's action menu |
| Export a report | Click **Export** inside the report (CSV or PDF) |

---

## Decisions

**Route:** `/prioritization/decisions`

The Decisions page is a log of all significant decisions made in the workspace — priority publications, ratifications, major scope changes, and governance events. It is the audit trail for the prioritization process.

### What you see
A chronological log of decisions with:
- Decision type (publication, ratification, rejection, scope change)
- The actor who made the decision
- The items or cycles affected
- A timestamp and any attached rationale

### When to use
- Responding to "why did we decide to prioritize X over Y?"
- Regulatory or compliance audits requiring a documented decision trail
- Retrospectives and process improvement analysis

---

## Tips

- Required and default reports cannot be deleted, but you can choose which ones appear on the Reports Hub by toggling defaults in **Settings → Content & Structure → Reports**.
- Custom reports are saved in your workspace and accessible to anyone with appropriate permissions.
- The Decisions log is append-only — it cannot be edited, only read. This is by design.
