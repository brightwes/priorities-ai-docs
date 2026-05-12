---
title: Intake
description: Collect, review, and triage incoming ideas before they become items.
sidebar_label: Intake
sidebar_position: 7
---

# Intake

The Intake section is the front door of the prioritization pipeline. It lets anyone in your organization (or outside it, via an embed) submit ideas, and gives the right people a structured queue for reviewing and triaging those submissions before they become full items.

---

## Submit Idea

**Route:** `/prioritization/intake/submit`

The submission form is a simple, guided form for capturing a new idea or work request. It is designed to be low-friction — submitters do not need to be experts in the item model.

### What you fill in
- **Title** — a short, clear name for the idea
- **Description** — what the idea is and why it matters
- **Category / type** — the kind of work (feature, bug, initiative, etc.) if configured
- **Supporting context** — any relevant links, files, or customer evidence

### Notes
- Submitting creates a record in the **My Submissions** list and the **Triage Queue**.
- If your workspace uses a custom intake form, the fields may differ from the defaults above.

---

## My Submissions

**Route:** `/prioritization/intake/mine`

My Submissions shows everything you have submitted — including its current triage status, so you can follow up or add information if requested.

### What you see
A list of your own intake submissions. Each row shows the title, the date submitted, and the current status (Pending, Under Review, Accepted, Declined, Converted to Item).

### Actions

| Action | How |
|---|---|
| View a submission detail | Click the submission row |
| Add more context | Open the submission and use the notes/comments field |
| Withdraw a submission | Use the row actions menu |

---

## Triage Queue

**Route:** `/prioritization/intake/triage`

The Triage Queue is where intake submissions land when they are ready for review. Triagers assess each submission and decide what to do with it.

### Who sees this
Only users with triage permissions see this page. The sidebar badge shows the number of pending submissions waiting for review.

### What you see
A prioritized list of unreviewed submissions. Each row shows the submission title, the submitter, the date received, and the category.

### Triage actions

| Action | Meaning |
|---|---|
| **Accept** | Approve the idea and convert it to a full item |
| **Decline** | Reject the submission (the submitter is notified) |
| **Request info** | Send the submission back to the submitter for clarification |
| **Defer** | Keep it in the queue without a decision for now |

### Tips
- Clicking **Accept** creates a new item pre-populated with the submission's title and description. You can enrich it further from the item detail page.
- The triage queue supports bulk actions — select multiple submissions and accept or decline them together.
- The sidebar badge clears as you process submissions, giving your team a real-time signal of queue depth.

---

## Embedded Intake

**Route:** `/prioritization/intake/embed` (for configuration)

The embedded intake form is a version of the submission form you can embed in other tools — an internal wiki, a Slack tab, a customer portal, or any web page that can accept an iframe.

To set up the embed:
1. Go to **Settings → Workspace Setup → Queues** (or wherever your workspace admin has configured intake)
2. Copy the embed URL or iframe code
3. Paste it into the destination tool

Submissions made through the embedded form land in the same Triage Queue and are indistinguishable from submissions made directly in the app.
