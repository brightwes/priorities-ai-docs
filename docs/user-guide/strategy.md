---
title: Strategy
description: Define the strategic context that guides prioritization — strategies, objectives, goals, and kernels.
sidebar_label: Strategy
sidebar_position: 5
---

# Strategy

The Strategy section is where you define and maintain the strategic context that your prioritization work is meant to serve. Items evaluated inside cycles are compared against the strategic frame you set here.

The section contains five interconnected pages:

---

## Strategies

**Route:** `/prioritization/strategy`

The Strategies page is the hub for your strategy objects. A strategy is the top-level anchor — the articulation of where you are going and why. Everything else (objectives, goals, items) can be linked back to a strategy to show alignment.

### What you see
A list of strategies with their status, time horizon, and summary. You can filter and search across all strategies in the workspace.

### Actions

| Action | How |
|---|---|
| Create a strategy | Click **New Strategy** |
| Edit name, description, or horizon | Click the edit icon on a strategy row |
| Activate or archive a strategy | Use the row actions menu |
| Open strategy detail | Click the strategy name |

### Strategy detail
Opening a strategy shows the full strategy narrative — North Star goal, guiding principles, key choices, and the items and objectives linked to it.

The detail page also surfaces three frameworks you can use to structure your strategy:
- **Classic** — a hierarchical strategy chain (strategy → objectives → goals → items)
- **Opportunity Solution Tree (OST)** — an outcome-driven tree for product discovery
- **Strategy Kernel** — a Rumelt-style kernel (diagnosis, guiding policy, coherent actions)

---

## Objectives

**Route:** `/prioritization/strategy/objectives`

Objectives are qualitative targets that sit beneath a strategy. They answer the question: "What must be true for this strategy to succeed?" — without specifying a number or a deadline.

### What you see
A list of all objectives in the workspace. Each objective shows which strategy it belongs to, a short description, and its linked goals and desired outcomes.

### Actions

| Action | How |
|---|---|
| Create an objective | Click **New Objective** |
| Filter by strategy | Use the strategy filter chips at the top of the page |
| Link to a strategy | Set the strategy field when creating or editing an objective |
| View linked goals | Expand the objective row or open its detail |

---

## Goals

**Route:** `/prioritization/strategy/goals`

Goals are measurable, time-bound targets that sit beneath objectives. Where an objective says *what* must be true, a goal says *how much* and *by when*.

### What you see
A list of goals across all strategies and objectives. Goals show their target metric, target value, due date, and the objective they belong to.

### Actions

| Action | How |
|---|---|
| Create a goal | Click **New Goal** |
| Link to an objective | Set the objective field when creating or editing a goal |
| Track progress | Update the current value field as work progresses |
| Link items to a goal | From an item's detail page, connect it to goals it contributes to |

---

## Strategy Kernel

**Route:** `/prioritization/strategy/kernel`

The Strategy Kernel is a structured strategy format based on Richard Rumelt's *Good Strategy / Bad Strategy*. It breaks a strategy down into three mandatory components:

| Component | What it captures |
|---|---|
| **Diagnosis** | The critical challenge or constraint the strategy addresses |
| **Guiding Policy** | The overall approach — what you will and won't do |
| **Coherent Actions** | The specific, coordinated moves that implement the policy |

### What you see
A list of kernel artifacts, each one representing a fully formed strategy kernel. You can create multiple kernels for different strategic problems.

### Actions
- **New Kernel** — creates a blank kernel and opens the editor
- Clicking a kernel opens the detail view, where you fill in the three components

:::note
The Strategy Kernel page is module-gated. It appears in the sidebar only when the module is enabled for your workspace.
:::

---

## Strategy Canvas

**Route:** `/prioritization/strategy/canvas`

The Strategy Canvas is a one-page narrative tool for communicating strategy. It follows a structure adapted from the HP-style strategy canvas, capturing six elements on a single surface:

| Section | What it captures |
|---|---|
| **Vision** | Where you are going in the long term |
| **Purpose** | Why the organization exists |
| **Mission** | What you are doing right now to pursue the vision |
| **Guiding Principles** | The beliefs and rules that guide every decision |
| **Core Competencies** | The unique capabilities you are building on |
| **Assumptions** | The bets you are making about the world |

### What you see
A list of canvases as cards. Each card previews which sections are filled in. With a single canvas, the card takes the full width; with multiple, they appear in a grid.

### Actions

| Action | How |
|---|---|
| Create a canvas | Click **New Canvas** |
| Edit a canvas | Click the canvas card to open the editor |
| Delete a canvas | Use the card's action menu |

:::note
The Strategy Canvas is module-gated and appears in the sidebar only when the module is enabled.
:::
