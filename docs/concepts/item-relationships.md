---
title: Item Relationships — Priorities.ai
description: The full relationship taxonomy. Seven types, their subtypes, and their enforcement logic.
audience: Developers
source-canon: DOCS_V4/00-canon/07-item-relationship-taxonomy-and-mutation-rules.md
status: published
---

# Item Relationships

This page is the technical reference for the item relationship taxonomy. For the conceptual overview, see [platform/relationships](/platform/relationships). For the API, see [Item Relationships API](/docs/api/items-relationships).

---

## Overview

The relationship graph on an item has three axes:

- **Horizontal** — relationships between items at the same organizational level (Cluster, Related, Bloc, Dependency)
- **Vertical** — relationships between items at different organizational levels (Aggregation, Elaboration)
- **Temporal** — relationships that record structural transformation over time (Lineage)

---

## Cluster

Cluster relationships identify near-identical items.

| Subtype | Meaning |
|---------|---------|
| `duplicate` | Materially the same item — only one should proceed as an independent prioritization object |
| `variant` | Share a core but differ in scope, implementation, or framing |

**Cluster resolution is Gate 1.** Before any other relationship type can be evaluated for an item, any open Cluster `candidate` relationships on that item must be resolved (`confirmed` or `dismissed`). This prevents comparing near-duplicates as if they are independent options.

**System-surfaced clusters** appear as `status: candidate`. They carry no enforcement weight until confirmed by a human.

---

## Related

Related is the lowest-weight relationship — a human-declared annotation of meaningful proximity.

There are no subtypes. There are no enforcement gates. Related is purely informational context — these items are worth considering together, but the relationship imposes no constraints on what can be done with either of them.

---

## Bloc

Bloc is the atomicity relationship.

A Bloc is a set of items that must be treated as an all-or-nothing prioritization grouping. Selecting one Bloc member for commitment requires selecting all Bloc members.

**Enforcement rules:**

1. A Bloc member cannot receive a commitment-quality disposition unless all Bloc members are present in the comparison scope. This is a **block** (not a warning).
2. When a Bloc is de-selected, all items outside the Bloc with hard Dependencies on any Bloc member are surfaced. De-selection of a Bloc has downstream effects that cannot be silent.
3. A Bloc member that enters a Track Cell must be compared as part of its full Bloc grouping. Partial Bloc representation is flagged before any force-ranking session involving Bloc members begins.

**When Blocs make sense:**

Use Blocs when items only deliver value together — a migration that requires both a backend change and a client update, a compliance implementation that requires both a data change and a configuration change.

---

## Dependency

Dependency is the prioritization-constraint relationship. It is directed, typed, and enforcement-weight graded.

| Subtype | Meaning | Enforcement |
|---------|---------|-------------|
| `informational` | Context — worth knowing | None — displayed as context |
| `soft` | Selecting one without the other may reduce expected value | Warning displayed at comparison time |
| `hard` | Commitment on the dependent item is not fully legitimate until the dependency condition is explicitly addressed | **Block** at commitment-quality decision time |

**Critical design intent:**

Dependency in this system is about **prioritization legitimacy**, not execution order. A hard Dependency does not mean "build A before B." It means "selecting A for commitment-quality disposition without explicitly addressing the dependency condition involving B is not legitimate."

The "dependency condition" is the explicit reason the relationship was declared. It must be stated at declaration time and evaluated at commitment time.

**Aggregation children with hard Dependencies:**

When an Aggregation parent is committed, all hard Dependencies on any Aggregation child surface at parent commitment time. These must be explicitly evaluated before the parent commitment is legitimate.

**Elaboration children with hard Dependencies:**

Hard Dependencies on Elaboration children surface only when that specific child is selected as the committed approach. Dependencies on unselected Elaboration children are displayed as context but do not block the parent selection.

---

## Aggregation

Aggregation is the vertical composition relationship.

An Aggregation parent rolls up child items. Children are constituent parts of the parent — they exist at a lower altitude and express how the parent is implemented.

**Enforcement rules:**

1. Hard Dependencies on any child surface at parent commitment time
2. A child in an Aggregation relationship cannot be independently committed at a higher altitude than the parent
3. An item may simultaneously be an Aggregation child and an Elaboration parent

**API representation:** Aggregation is directed (`source_item_id` = parent, `target_item_id` = child).

---

## Elaboration

Elaboration is the vertical response relationship — children express alternative approaches to the parent need.

| Subtype | Meaning |
|---------|---------|
| `solution_spectrum` | Children differ in ambition, altitude, or investment level (a small, medium, and large version of the same solution) |
| `solution_variant` | Children differ in approach while addressing the same parent need |

**Enforcement rules:**

1. An Elaboration parent is not fully committed until a specific child approach has been selected
2. Hard Dependencies on a selected Elaboration child surface at child selection time
3. Hard Dependencies on the parent propagate to all children as informational context

---

## Lineage

Lineage records structural transformation — not an active relationship, but provenance.

| Subtype | Event |
|---------|-------|
| `split` | One item became multiple successors; original retired |
| `merge` | Multiple items became one successor; originals retired |
| `supersede` | One item replaced another; replaced item closed with a pointer |
| `retire` | Item ended with no successor |
| `fork` | One item branched into a successor; original remains active |

**Post-transformation rules:**

Every `split`, `merge`, `supersede`, and `fork` fires a review obligation: all active relationships on the affected item(s) must be explicitly reviewed and remapped. Lineage does **not** auto-inherit relationships.

---

## Status values

| Status | Enforcement weight |
|--------|-------------------|
| `candidate` | None — context only, surfaced by system |
| `confirmed` | Active — full enforcement weight |
| `dismissed` | None — historical record only |

---

## Protection rings and relationship mutations

See [Protection Rings](/docs/concepts/protection-rings) for the rules governing when relationship mutations are blocked.

---

## What's next

- [Protection rings](/docs/concepts/protection-rings) — mutation governance in active contexts
- [Item Relationships API](/docs/api/items-relationships) — endpoints and parameters
