---
title: System of Decision — Priorities.ai
description: The category model. Why prioritization is infrastructure. What a System of Decision does that no existing tool does.
audience: Developers
source-canon: F1_Canonical_Problem_Document, M2_The_POV_Document
status: published
---

# System of Decision

Priorities.ai is the API layer between your Systems of Record (Workday, Salesforce, SAP) and your Systems of Execution (Jira, Azure DevOps, Asana). It fills the structural gap that every organization has but almost none have named.

---

## The gap in every enterprise stack

Enterprise organizations have two categories of mature infrastructure:

**Systems of Record** hold organizational truth. Workday holds headcount and org structure. Salesforce holds customer data. SAP holds financial position. These systems are durable, auditable, authoritative.

**Systems of Execution** track work in progress. Jira tracks features and bugs. Azure DevOps tracks sprints. Asana tracks task completion. These systems hold the mechanics of motion.

Between them — nothing durable.

How does a strategic objective in Workday become a Jira epic? The honest answer: it passes through a meeting, a slide deck, a spreadsheet, and an informal conversation. The rationale for why one initiative was chosen over another lives in the fading memories of whoever was in the room.

When the meeting ends, the decision begins to drift.

---

## What a System of Decision does

A System of Decision holds three things:

**Before the decision:** The Frame — who participates, what is eligible, what criteria apply.

**During the decision:** The Exchange — the governed process through which every organizational level contributes what it carries.

**After the decision:** The Plan of Record — what was decided, how it was decided, why, and what changed and why.

These are not features. They are the three structural requirements for a decision that is defensible, durable, and evaluable.

---

## The developer model

From a developer perspective, a System of Decision is:

1. A **governance layer** built on database RPCs that enforce the authority model — no governance transition can be made by direct table write
2. An **event system** that captures every lifecycle event as an immutable governance or audit record
3. An **API surface** that makes every decision, relationship, and state change queryable
4. An **integration layer** that connects to Systems of Record (read: signal in) and Systems of Execution (write: commitment out)

```
                      THE SYSTEM OF DECISION
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ITEMS              governance layer            OUTPUTS │
│  /v1/items     ──→  RPCs + state machines  ──→  reports │
│  /v1/items/...       (enforced authority)      webhooks │
│  /relationships                                  events │
│  /attributes                                            │
│                                                          │
│  CYCLES / SESSIONS                                       │
│  /v1/cycles    ──→  phase gates + audit  ──→  decisions │
│  /v1/sessions  ──→  criteria locks       ──→  gov events│
│  /v1/tool-sessions   ↕                   ──→  audit log │
│                  catchball                               │
│                  /v1/catchball                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Why infrastructure, not tooling

The distinction matters.

**Tooling** is what you use. It improves a workflow. You can swap it out.

**Infrastructure** is what you build on. It holds data that other systems depend on. It generates records that must be durable. Its behavior must be authoritative and auditable. You do not swap it out any more than you swap out your accounting system.

Priorities.ai captures decision rationale, governance events, and priority outputs that need to hold over time — across personnel changes, across system migrations, across strategy pivots. That is not tooling behavior. That is infrastructure behavior.

---

## What's next

- [Comparability and tracks](/concepts/comparability-and-tracks) — Track Cells and the comparison geometry
- [Catchball and authority](/concepts/catchball-and-authority) — The Exchange as a developer API
- [State machines](/concepts/state-machines) — Session, Cycle, Catchball Loop state machines
- [Quickstart](/start/quickstart) — build a working integration in 10 minutes
