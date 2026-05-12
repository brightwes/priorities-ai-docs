---
title: Items
description: Create, enrich, and manage the work candidates that flow through prioritization.
sidebar_label: Items
sidebar_position: 8
---

# Items

Items are the core work objects in Priorities.ai — the candidates your team evaluates, compares, and prioritizes. Item management is always-on: items exist at the workspace level independently of any cycle. They are brought into cycles and sessions when you are ready to compare them.

---

## All Items

**Route:** `/prioritization/items`

All Items is the primary list view for every item in the workspace. It is a full-featured management surface with filtering, grouping, and bulk actions.

### What you see
A filterable, sortable list or table of items. Each row shows the item name, its category, status, owner, readiness signal, and key scoring attributes if configured.

### Views
- **List view** — a dense table with sortable columns
- **Card view** — a visual card layout showing item attributes at a glance
- **Grouped view** — items grouped by category, status, owner, or any attribute

### Actions

| Action | How |
|---|---|
| Create an item | Click **New Item** |
| Import items | Click **Import** (CSV or integration source) |
| Export items | Click **Export** |
| Filter the list | Use the filter bar at the top |
| Bulk edit | Select multiple items with checkboxes, then use the bulk action bar |
| Open an item | Click the item name |
| Star/pin a view | Save your current filter configuration and star it — it appears in the sidebar |

---

## Item Detail

**Route:** `/prioritization/items/:itemId`

The item detail page is the full record for a single item. It is a tabbed surface with all information related to that item.

### Tabs

| Tab | What it contains |
|---|---|
| **Overview** | Title, description, category, status, owner, and all attributes |
| **Attributes** | Structured scoring frames (RICE, T-shirt size, custom dimensions) |
| **Relationships** | All relationships to other items (dependencies, elaborations, clusters, etc.) |
| **Activity** | Full edit history and comments |
| **Lineage** | How this item has moved through cycles over time |
| **Impact** | Business impact evidence and linked goals |
| **Commitments** | Any commitments made about this item |

### Actions on the detail page

| Action | How |
|---|---|
| Edit any field | Click the field inline or use the edit panel |
| Add a comment | Use the comment box in the Activity tab |
| Create a task | Click **New Task** (tasks are linked to the item) |
| Watch / unwatch | Click the watch toggle to receive notifications for this item |
| Link to a relationship | Use the Relationships tab |
| Add to a list | Click **Add to list** from the action menu |

---

## Item Pools (Lists)

**Route:** `/prioritization/lists`

Item Pools (also called Lists) are curated subsets of items you create for a specific purpose — a comparison exercise, a stakeholder review, or a planning session that sits outside a formal cycle.

### What you see
A list of all your item pools. Each pool shows its name, the number of items in it, and when it was last updated.

### Item Pool Editor

**Route:** `/prioritization/lists/:listId`

Opening a pool takes you to the editor, where you can:
- Add and remove items from the pool
- Set the comparison lens for the pool
- Run lightweight scoring or ranking within the pool without a full cycle

---

## Completeness

**Route:** `/prioritization/items/readiness`

The Completeness page (also called Item Readiness) shows which items have the minimum information needed to participate in a prioritization session, and which are missing key data.

### What you see
A list of items with a readiness score and a breakdown of which readiness dimensions are passing or failing. Dimensions are configured in **Settings → Content & Structure → Readiness**.

### Actions

| Action | How |
|---|---|
| See what is missing | Click an item to see its readiness breakdown |
| Filter to incomplete items | Use the "Incomplete only" filter |
| Bulk-enrich items | Select multiple items and use the bulk edit panel to fill in missing fields |

---

## Item Classes

**Route:** `/prioritization/items/types`

Item Classes (also called Item Types) define the categories of work your team tracks — for example, Initiative, Feature, Bug, Spike, or Experiment. An item's class determines which Track Cell it belongs to inside a cycle.

### What you see
A list of all item classes configured in the workspace. Each class shows its name, icon, and the track configuration it maps to.

### Actions

| Action | How |
|---|---|
| Create a class | Click **New Item Class** |
| Edit a class | Click the class name |
| Assign a class to an item | Set the category field when creating or editing the item |

:::note
Item Classes are a workspace-level setting. Changes here affect all items in the workspace. Full configuration is also available in **Settings → Content & Structure → Item Categories**.
:::

---

## Values (Scoring)

**Route:** `/prioritization/scoring`

The Values page (also referred to as Scoring) is a dashboard for seeing how items are scored across all configured scoring dimensions. It helps you identify where scoring is consistent versus where there are gaps or disagreements.

### What you see
A scoring matrix showing items (rows) against scoring dimensions (columns). Cells show the current value or a "needs score" indicator.

### Item Scoring Detail

**Route:** `/prioritization/scoring/:itemId`

Opening an item from the scoring dashboard takes you to that item's full scoring detail — all its attribute frames, the values entered, and which session results contributed.

---

## Input Rounds

**Route:** `/prioritization/input-rounds`

Input Rounds are a crowd-sourcing mechanism for gathering quantitative or qualitative input from a group of stakeholders — without running a full facilitated session. A round defines the question and the items to evaluate; participants score or rank them independently.

### What you see
A list of input rounds. Each round shows its title, the items included, the deadline for responses, and the response rate so far.

### Input Round Detail

**Route:** `/prioritization/input-rounds/:roundId`

Opening a round shows the full detail: which items are included, who has responded, aggregate results, and the ability to close the round and roll up results.

### Submitting input

**Route:** `/prioritization/input-rounds/submit`

Participants who receive a link to a round see a clean submission form where they can score or rank each item.

---

## Graph (Relationships)

**Route:** `/prioritization/shape/relationships`

The Graph page shows the full item relationship graph as a network visualization — nodes are items, edges are the relationships between them (dependencies, elaborations, clusters, etc.).

### What you see
An interactive graph where you can:
- Pan and zoom to explore the network
- Click a node to see the item detail panel
- Filter the graph by relationship type or item category

This is a read-optimized view; to edit relationships, use the Relationships tab on individual item detail pages or the Relationships section of the sidebar.

---

## Lineage

**Route:** `/prioritization/lineage`

The Lineage page shows the historical provenance of items — how each item has moved through cycles, been renamed, split, merged, or transformed over time. It is the global lineage view; individual item lineage is also available on each item's detail page.

### What you see
A timeline or tree view of lineage events for all items in the workspace, filterable by item, date range, or event type.

---

## Scenario Planner

**Route:** `/prioritization/tools/relationship-scenario-planner`

The Scenario Planner is a tool for modeling "what if" scenarios around item relationships. It lets you propose a set of relationship changes — adding, removing, or swapping dependencies — and see the downstream impact on your prioritization without committing those changes to the live data.

### Actions
- Add or remove relationships in the scenario canvas
- See which items would be affected by the change
- Save a scenario for later review or discard it without any impact to live items
