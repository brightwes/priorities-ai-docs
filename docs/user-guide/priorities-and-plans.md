---
title: Priority Lists & Plans
description: Published prioritization results and the plans of record they produce.
sidebar_label: Priority Lists & Plans
sidebar_position: 13
---

# Priority Lists & Plans

This section contains the outputs of the prioritization process — the published ranked lists that represent what was decided, and the plans of record that formalize those decisions into execution commitments.

---

## Priority Lists

**Route:** `/prioritization/priorities`

Priority Lists are the immutable published output of a completed and ratified cycle. Once a cycle's results are approved and published, the ranked items become a Priority List — a permanent record of what was decided, in what order, and through what process.

### What you see
A list of all published Priority Lists in the workspace. Each list shows:
- The cycle it came from
- The track it covers
- The number of items in the ranked list
- The publication date
- The governance status (draft, ratified, published)

### What makes a Priority List immutable?
Once published, a Priority List cannot be edited. This is intentional — the list represents a decision that was made through a governed process. If priorities change, a new cycle produces a new list; the old list remains as a historical record.

### Actions

| Action | How |
|---|---|
| Open a Priority List | Click the list name |
| Export a list | Click **Export** inside the list detail |
| Share a list | Use the share link to give stakeholders read-only access |
| See decision provenance | Click any item in the list to see which sessions contributed to its rank |

---

## Priority Set Report

**Route:** `/prioritization/reports/priorities` (also accessible from within a cycle)

The Priority Set Report is a printable/exportable version of a Priority List with full decision provenance — suitable for stakeholder communication or archiving.

---

## Plans of Record (POR)

**Route:** `/prioritization/plans`

A Plan of Record is the execution-layer document that emerges from a Priority List. After priorities are set, the team commits to which items they will actually work on — with owners, timelines, and capacity constraints. The POR is that commitment, formalized.

### Relationship to cycles and Catchball
In a full Catchball loop:
1. A cycle produces a Priority List
2. Catchball proposals are made against that list
3. Ratified proposals become Commitments
4. The POR is the assembled view of all Commitments for a planning period

Without a full Catchball loop, a POR can also be created directly by a planning lead.

### What you see
A list of Plans of Record. Each POR shows:
- The cycle it is associated with
- The planning period (start and end dates)
- The number of committed items
- The overall health status (on track, at risk, off track)

### Plan of Record Detail

**Route:** `/prioritization/plans/:planCycleId`

Opening a POR shows the full commitment set:

| Section | What it shows |
|---|---|
| **Committed items** | All items formally committed to this period |
| **Owners** | Who is responsible for each item |
| **Timelines** | Target dates by item |
| **Health** | Current status of each commitment |
| **Capacity** | Team capacity allocation (if capacity tracking is configured) |
| **Changes** | Any scope changes made after the POR was baselined |

### Actions

| Action | How |
|---|---|
| Baseline a POR | Click **Baseline** — this locks the initial scope for change tracking |
| Add a commitment | Click **Add commitment** to include additional items |
| Update item status | Click any commitment row and update the health/status field |
| Export the POR | Click **Export** for CSV or PDF |

---

## Tips

- Priority Lists are the authoritative record of what was prioritized. When stakeholders ask "why are we working on this?", the Priority List is the answer.
- Plans of Record add the "how" and "when" to the "what" established by Priority Lists.
- Keep commitment statuses updated in the POR — this data drives the Cycle Execution Report and gives leadership real-time delivery visibility.
