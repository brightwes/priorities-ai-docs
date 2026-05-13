---
title: Item Relationships — Priorities.ai
description: The full relationship taxonomy. Ten types, their subtypes, and their enforcement logic.
audience: Developers
source-canon: DOCS_V4/00-canon/07-item-relationship-taxonomy-and-mutation-rules.md
status: published
---

# Item Relationships

This page is the technical reference for the item relationship taxonomy. For the API, see [Item Relationships API](/api/items/items-relationships).

---

## Overview

The relationship graph on an item has four axes:

- **Horizontal** — relationships between items at the same organizational level (Cluster, Package, Dependency, Prerequisite)
- **Vertical** — relationships between items at different organizational levels (Aggregation, Breakdown, Elaboration)
- **Framing** — perspective relationships between items (Reframe)
- **Temporal** — relationships that record structural transformation over time (Lineage)
- **Curatorial** — user-curated groupings with no governance weight (Collection)

---

## Cluster

Cluster relationships identify near-identical items.

| Subtype | Meaning |
|---|---|
| `duplicate` | Materially the same item — only one should proceed as an independent prioritization object |
| `variant` | Share a core but differ in scope, implementation, or framing |

**Cluster resolution is Gate 1.** Before any other relationship type can be evaluated for an item, any open Cluster `candidate` relationships on that item must be resolved (`confirmed` or `dismissed`). This prevents comparing near-duplicates as if they are independent options.

**System-surfaced clusters** appear as `status: candidate`. They carry no enforcement weight until confirmed by a human.

---

## Package

Package is the atomicity relationship. Formerly called *Bloc* — that term is deprecated.

A Package is a set of items that must be treated as an all-or-nothing prioritization grouping. Selecting one Package member for commitment requires selecting all Package members.

**Enforcement rules:**

1. A Package member cannot receive a commitment-quality disposition unless all Package members are present in the comparison scope. This is a **block** (not a warning).
2. When a Package is de-selected, all items outside the Package with hard Dependencies on any Package member are surfaced. De-selection has downstream effects that cannot be silent.
3. A Package member that enters a Track Cell must be compared as part of its full Package grouping. Partial Package representation is flagged before any force-ranking session involving Package members begins.
4. When a Package member's primary frame changes, the system checks whether the new Track Cell (category × altitude) remains compatible with the other Package members.

**When Packages make sense:**

Use Packages when items only deliver value together — a migration that requires both a backend change and a client update, a compliance implementation that requires both a data change and a configuration change.

---

## Dependency

Dependency is the prioritization-constraint relationship, asserted by the **downstream** item (B): "I depend on A."

| Subtype | Meaning | Enforcement |
|---|---|---|
| `informational` | Context — worth knowing | None — displayed as context |
| `soft` | Selecting one without the other may reduce expected value | Warning displayed at comparison time |
| `hard` | Commitment on the dependent item is not fully legitimate until the dependency condition is explicitly addressed | **Block** at commitment-quality decision time |

**Critical design intent:**

Dependency is about **prioritization legitimacy**, not execution order. A hard Dependency does not mean "build A before B." It means "selecting B for commitment-quality disposition without explicitly addressing the dependency condition involving A is not legitimate."

**Mirror of Prerequisite.** If both a Dependency edge (B→A) and a Prerequisite edge (A→B) exist on the same pair, the system warns of redundant mirror edges. Dissolve the less authoritative one.

**Composition children:** Hard Dependencies on Aggregation and Breakdown children surface at parent commitment time. Hard Dependencies on Elaboration children surface only when that specific child is selected as the committed approach.

---

## Prerequisite

Prerequisite is the prioritization-constraint relationship, asserted by the **upstream** item (A): "I must be resolved before B can proceed."

The semantic constraint is identical to Dependency — only the asserter differs. Dependency is asserted by the dependent item; Prerequisite is asserted by the required item.

| Subtype | Enforcement |
|---|---|
| `informational` | Context only |
| `soft` | Warning at comparison time |
| `hard` | Blocks commitment-quality disposition on B until the condition is addressed |

**Mirror of Dependency.** Rule `PRE-DEP-1` warns when both exist on the same pair.

**Semantic conflict:** A Prerequisite edge from C to P is incompatible with a Breakdown edge from P to C. A constituent part cannot also be a precondition for the whole it composes. This is a hard block.

---

## Aggregation

Aggregation is the vertical composition relationship, asserted by the **child** item (C): "I am a constituent part of P."

An Aggregation parent rolls up child items. Children are constituent parts — they exist at a lower altitude and express how the parent is implemented.

**Enforcement rules:**

1. Hard Dependencies on any child surface at parent commitment time
2. An item may simultaneously be an Aggregation child and an Elaboration parent
3. If a Mirror Breakdown edge also exists on the same parent-child pair, the system warns (redundant mirror edges — rule `BD-AGG-1`)

**API representation:** `source_item_id` = parent, `target_item_id` = child.

---

## Breakdown

Breakdown is the vertical decomposition relationship, asserted by the **parent** item (P): "My constituent parts are C1, C2, …"

Breakdown is the top-down counterpart of Aggregation. Both produce the same directed parent→child composition tree — but the intent of authorship is inverted. Breakdown children carry identical enforcement semantics to Aggregation children.

**Enforcement rules:**

1. Hard Dependencies on Breakdown children surface at parent commitment time (same as Aggregation)
2. Partial Breakdown representation in a scope produces a warning (not a block)
3. A Breakdown edge from P to C is incompatible with a Prerequisite edge from C to P (semantic conflict — rule `BD-PRE-1`)

---

## Elaboration

Elaboration is the vertical response relationship — children express alternative approaches to the parent need.

| Subtype | Meaning |
|---|---|
| `solution_spectrum` | Children differ in ambition, altitude, or investment level (minimal fix vs. platform bet) |
| `solution_variant` | Children differ in approach while addressing the same need |

Elaboration children are **options**, not constituent parts. Their dependencies surface only when that specific child is selected as the committed approach.

**Enforcement rules:**

1. An Elaboration parent is not fully committed until a specific child approach has been selected
2. Hard Dependencies on the Elaboration parent propagate to all children as informational context
3. An item that is simultaneously a composition parent (via Aggregation or Breakdown) and an Elaboration parent must declare its **track role** before Track entry

---

## Reframe

Reframe is the perspective relationship.

One item is reinterpreted or reclassified relative to another without replacing or retiring either item. A Reframe captures that the same underlying reality can be validly described from multiple viewpoints. Neither item is the "primary" one — there is no canonical direction.

Reframe carries no enforcement weight and does not trigger governance gates. It is a declared, informational relationship.

---

## Lineage

Lineage records structural transformation — not an active relationship, but provenance.

| Subtype | Event |
|---|---|
| `split` | One item became multiple successors; original retired |
| `merge` | Multiple items became one successor; originals retired |
| `supersede` | One item replaced another; replaced item closed with a pointer |
| `retire` | Item ended with no successor |
| `fork` | One item branched into a successor; original remains active |

**Critical distinction:**

`fork` differs from `split` because the original item remains active after a `fork`. `split` retires the original; only successors remain active.

**Post-transformation rules:**

Every `split`, `merge`, `supersede`, `retire`, and `fork` fires a review obligation — all active relationships on the affected item(s) must be explicitly reviewed and remapped. Lineage does **not** auto-inherit relationships.

**Dissolution sequence (ordered):** When a lineage event fires, active relationships must be reviewed in this order:
1. Cluster → 2. Package → 3. Aggregation/Breakdown → 4. Elaboration → 5. Dependency/Prerequisite → 6. Collection → 7. Reframe

---

## Collection (as relationship type)

Collection is the curatorial relationship — a lightweight, user-curated grouping for any organizational purpose.

Collections carry no governance weight, no ranking semantics, and are never locked. Items may belong to any number of Collections simultaneously. A Collection may be promoted to an Item Pool via an explicit action — this does not alter the Collection itself.

---

## Status values

| Status | Enforcement weight |
|---|---|
| `candidate` | None — context only, surfaced by system |
| `confirmed` | Active — full enforcement weight |
| `dismissed` | None — historical record only |

---

## Mirror pairs

| Pair | Downstream assertion | Upstream assertion | Semantic |
|---|---|---|---|
| Dependency / Prerequisite | B: "I depend on A" | A: "I enable B" | A must precede B |
| Aggregation / Breakdown | C: "I compose P" (bottom-up) | P: "My parts are C1, …" (top-down) | C is a constituent of P |

When both sides of a mirror pair exist on the same item pair, a warning fires. The structural fact is valid — it is just asserted twice. Dissolve the less authoritative edge.

---

## Protection rings and relationship mutations

See [Protection Rings](/concepts/protection-rings) for the rules governing when relationship mutations are blocked.

---

## What's next

- [Protection rings](/concepts/protection-rings) — mutation governance in active contexts
- [Item Relationships API](/api/items/items-relationships) — endpoints and parameters
