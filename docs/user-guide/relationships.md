---
title: Relationships
description: Model dependencies, clusters, hierarchies, and other connections between items.
sidebar_label: Relationships
sidebar_position: 9
---

# Relationships

The Relationships section gives you a set of specialized views for managing the different types of connections between items. While individual item relationships are visible on each item's detail page, these pages let you manage relationships in bulk, browse by type, and assess overall relationship health.

---

## Relationship Types

Priorities.ai supports seven structural relationship types:

| Type | Direction | Meaning |
|---|---|---|
| **Depends on** | Directional | This item cannot progress until the target item is complete |
| **Enables** | Directional | Completing this item creates conditions for the target to succeed |
| **Elaborates** | Directional | This item adds detail or scope to a parent item |
| **Reframes** | Bidirectional | This item is an alternative approach to the same problem |
| **Clusters with** | Bidirectional | Items belong together thematically with no execution dependency |
| **Aggregates** | Directional | This item is the rollup parent of multiple child items |
| **Breaks down** | Directional | This item is decomposed into the target (inverse of aggregates) |

---

## Relationship Hub

**Route:** `/prioritization/relationships`

The Relationship Hub is the home page for the Relationships section. It shows summary counts for each relationship type and provides quick navigation into each typed view.

---

## Typed Relationship Views

Each relationship type has its own list page:

| Page | Route |
|---|---|
| Dependencies | `/prioritization/relationships/dependencies` |
| Prerequisites | `/prioritization/relationships/prerequisites` |
| Aggregations | `/prioritization/relationships/aggregations` |
| Breakdowns | `/prioritization/relationships/breakdowns` |
| Elaborations | `/prioritization/relationships/elaborations` |
| Reframes | `/prioritization/relationships/reframes` |
| Clusters | `/prioritization/relationships/clusters` |
| Packages | `/prioritization/relationships/packages` |

### What you see on each typed page
- A list of all relationships of that type in the workspace
- The source item, the target item, and any metadata (e.g. dependency type, strength)
- A filter bar for narrowing by item, category, or status

### Actions

| Action | How |
|---|---|
| Add a relationship | Click **New relationship** or add it from an item's detail page |
| Remove a relationship | Use the row actions menu |
| View an item in context | Click either item name to open its detail page |

---

## Collections

**Route:** `/prioritization/collections`

Collections are manually curated groups of items. Unlike clusters (which are semantic groupings via relationships), a collection is an arbitrary grouping you create — for example, "Q3 candidates" or "Executive review set."

### What you see
A list of collections. Each collection shows its name, item count, and last modified date.

### Actions
- **New Collection** — create a named collection and add items to it
- Open a collection to see its items in a list/card view
- Add or remove items using drag-and-drop or the item picker

---

## Lineage

**Route:** `/prioritization/lineage`

See [Items → Lineage](./items.md#lineage) — the Lineage page appears in both sections of the sidebar.

---

## Relationship Health

**Route:** `/prioritization/relationships/health`

The Relationship Health page surfaces potential issues in your relationship graph: broken dependencies (where a dependency target no longer exists), circular dependencies, or orphaned items with no relationships at all.

### What you see
A health report broken into categories:
- **Broken links** — relationships pointing to deleted or archived items
- **Circular dependencies** — chains that loop back on themselves
- **Orphaned items** — items with no relationships (may or may not be intentional)

### Actions
- Click any flagged item to navigate to its detail page and repair the relationship
- Use the bulk repair tool to resolve common issues automatically

---

## Tips

- Relationship data feeds the **Graph view** (`/prioritization/shape/relationships`) — use the typed list views for bulk management and the graph for visual exploration.
- Dependencies and prerequisites are the most commonly used types in engineering and product organizations; clusters and collections are more useful for communication and alignment work.
- Relationship health should be reviewed before locking a cycle scope to avoid including items with broken dependencies.
