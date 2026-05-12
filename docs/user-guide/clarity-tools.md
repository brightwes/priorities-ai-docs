---
title: Clarity Tools
description: Structured thinking tools — open questions, outcome drivers, desired outcomes, and back plans.
sidebar_label: Clarity Tools
sidebar_position: 6
---

# Clarity Tools

The Clarity Tools section contains four pages designed to help your team get clear on the problem before jumping to solutions. These tools help you surface uncertainty, articulate outcomes, and reason backward from success.

---

## Open Questions

**Route:** `/prioritization/open-questions`

Open Questions is a facilitation tool based on the Harry Max prioritized-questions framework. The premise is simple: before you can prioritize work well, you need to know what you are trying to learn. Your most important open question — the one you would answer first if you could — sits at position #1 and is called your **Focusing Question**.

### What you see

The page adapts to how many questions you have:
- **Zero questions** — an empty state with guidance on getting started
- **1–7 questions** — shown as individual cards you can drag to reorder
- **8+ questions** — defaults to a compact table, though drag-to-reorder is still available

Each question shows its priority position, status, and any items linked to it.

### Question statuses

| Status | Meaning |
|---|---|
| **Open** | Not yet being actively investigated |
| **In Progress** | Actively being worked |
| **Answered** | The question has been resolved |
| **Deferred** | Intentionally set aside for now |

### Actions

| Action | How |
|---|---|
| Add a question | Click **Add Question** |
| Reorder questions | Drag cards or rows to change priority rank |
| Change status | Click the status badge on a question |
| Filter by status | Use the status filter at the top |
| Link a question to items | Open the question and use the **Link to items** panel |
| Sync from an external source | Use the **EntitySyncPanel** (sync icon near the top) |
| Show the guide | Toggle the **Guide** button to see the framework explanation inline |

### Tips
- The question at position #1 is your Focusing Question — keep it honest about what you genuinely do not know.
- Answering a question does not delete it; answered questions remain as a decision record.

---

## Outcome Drivers

**Route:** `/prioritization/outcome-drivers`

Outcome Drivers are the structured reasons why a particular outcome matters. They help teams articulate the "why" behind initiatives and connect work back to business value.

### What you see
A list of outcome driver artifacts for the workspace. Each artifact describes a driver, what outcome it supports, and which items are linked to it.

### Actions

| Action | How |
|---|---|
| Create a driver | Click **New Driver** or navigate to `/prioritization/outcome-drivers/new` |
| Edit a driver | Click its name in the list |
| Sync from an external source | Use the **EntitySyncPanel** |

---

## Desired Outcomes

**Route:** `/prioritization/desired-outcomes`

Desired Outcomes are explicit articulations of the end state your team is trying to reach. They sit below objectives in the strategy chain and above individual items — making the link between strategic intent and day-to-day work concrete.

### What you see
A list of desired outcomes. Each outcome shows which objective or strategy it belongs to, a description of the end state, and the items that contribute to it.

### Actions

| Action | How |
|---|---|
| Create a desired outcome | Click **New Desired Outcome** |
| Link to an objective | Set the objective field in the editor |
| Link items to an outcome | From an item's detail page, connect it to the desired outcome |

---

## Back Plans

**Route:** `/prioritization/backplan`

Back Plans are a planning tool that starts from a desired end state and works backward to today's actions. Instead of asking "what should we build next?", a back plan asks "given where we need to be, what has to be true at each step before that?".

### What you see
A list of back plan artifacts. Each back plan has a goal state (the desired end), a set of prerequisite milestones working backward, and the items that map to each milestone.

### Back Plan Editor

**Route:** `/prioritization/backplan/:id`

Opening a back plan opens the editor — a visual timeline running right-to-left from the goal state to today. Each column represents a time horizon, and you drag items into the appropriate milestone.

### Actions

| Action | How |
|---|---|
| Create a back plan | Click **New Back Plan** from the list |
| Edit the goal state | Click the rightmost column in the editor |
| Add milestones | Click **Add milestone** between columns |
| Add items to a milestone | Drag items from the unassigned panel into a milestone column |
| Export or sync | Use the export controls in the editor toolbar |

### Tips
- Back Plans work best when you start with a Desired Outcome — use the link to pull the outcome in as the goal state.
- The visual timeline makes it easy to spot gaps where no work has been planned for a critical milestone.
