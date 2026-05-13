---
title: Item Relationships API
description: Read the relationship graph for any item. Ten canonical types — Cluster, Package, Dependency, Prerequisite, Aggregation, Breakdown, Elaboration, Reframe, Lineage, Collection.
sidebar_label: Item Relationships API
sidebar_position: 2
audience: Developers
status: published
---

# Item Relationships

Items in Priorities.ai participate in a typed, mutation-governed relationship graph. This graph carries semantic meaning that affects prioritization logic — a hard Dependency blocks commitment-quality decisions; a Package enforces atomicity; Aggregation propagates dependencies from children at parent commitment time.

Ten relationship types. Ten semantics. Not one overloaded "link."

---

## Relationship types

Ten canonical types, organized by axis and asserter perspective.

| Type | Axis | Asserter | Subtypes | Semantic |
|---|---|---|---|---|
| `cluster` | Horizontal | Either | `duplicate`, `variant` | Identity — items are the same or nearly the same |
| `package` | Horizontal | Either | — | Atomicity — all-or-nothing selection |
| `dependency` | Horizontal | Downstream | `informational`, `soft`, `hard` | B depends on A — asserted by the dependent item |
| `prerequisite` | Horizontal | Upstream | `informational`, `soft`, `hard` | A enables B — asserted by the required item |
| `aggregation` | Vertical | Child | — | Composition bottom-up — "I am a constituent part of P" |
| `breakdown` | Vertical | Parent | — | Decomposition top-down — "My parts are C1, C2, …" |
| `elaboration` | Vertical | Parent | `solution_spectrum`, `solution_variant` | Response — children are alternative approaches to the parent need |
| `reframe` | Framing | Either | — | Perspective — same underlying reality seen from a different lens |
| `lineage` | Temporal | Either | `split`, `merge`, `supersede`, `retire`, `fork` | Structural transformation over time |
| `collection` | Curatorial | Either | — | User-curated grouping — no governance weight |

### Mirror pairs

Two pairs express the same underlying constraint from opposite asserter perspectives:

| Pair | Downstream assertion | Upstream assertion |
|---|---|---|
| Dependency / Prerequisite | B: "I depend on A" | A: "I enable B" |
| Aggregation / Breakdown | C: "I am part of P" (bottom-up) | P: "My parts are C1, C2, …" (top-down) |

If both sides of a mirror pair exist on the same item pair, the system surfaces a warning. The structural fact is valid — it is just asserted twice. Dissolve the less authoritative edge.

---

## Relationship storage

Relationship records are stored in two tables depending on type:

| Types | Table | Key fields |
|---|---|---|
| `dependency`, `prerequisite`, `aggregation`, `breakdown`, `elaboration`, `reframe`, `lineage` | `item_relationship_edges` | `source_item_id`, `target_item_id`, `relationship_type`, `subtype`, `status`, `directionality`, `rationale` |
| `cluster`, `package`, `collection` | `item_relationship_groups` + `item_relationship_group_memberships` | `group_type`, `status`, member `item_id` rows |

The API normalizes both into a unified response shape.

---

## List relationships for an item

```
GET /v1/items/:id/relationships
```

**Scopes:** `items:read`

Returns all relationships where this item is either the source or the target.

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../relationships" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "rel-uuid",
      "source_item_id": "a1b2c3d4-...",
      "target_item_id": "b2c3d4e5-...",
      "relationship_type": "dependency",
      "relationship_subtype": "hard",
      "status": "confirmed",
      "direction": "source_to_target",
      "rationale": "Item B requires authentication infrastructure from Item A",
      "workspace_id": "...",
      "created_at": "2026-03-20T10:00:00Z"
    },
    {
      "id": "rel-uuid-2",
      "source_item_id": "c3d4e5f6-...",
      "target_item_id": "a1b2c3d4-...",
      "relationship_type": "package",
      "relationship_subtype": null,
      "status": "confirmed",
      "workspace_id": "..."
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Declare a relationship

```
POST /v1/items/:id/relationships
```

**Scopes:** `items:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `target_item_id` | uuid | **required** | The other item |
| `relationship_type` | string | **required** | One of the ten types |
| `relationship_subtype` | string | | Subtype where applicable |
| `direction` | string | | `outbound` (default), `inbound`, or `bidirectional` |
| `rationale` | string | | Human-provided reason for this relationship |

---

## Remove a relationship

```
DELETE /v1/items/relationships/:id
```

**Scopes:** `items:write`

Removes a relationship by its own record ID.

---

## Relationship object fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid | Relationship record ID |
| `source_item_id` | uuid | Source item |
| `target_item_id` | uuid | Target item |
| `relationship_type` | string | One of the ten canonical types |
| `relationship_subtype` | string | Subtype where applicable |
| `status` | string | `candidate`, `confirmed`, or `dismissed` |
| `direction` | string | `source_to_target`, `target_to_source`, or `bidirectional` |
| `rationale` | string | Human-provided rationale |
| `created_at` | timestamptz | When the relationship was recorded |

---

## Relationship status values

| Status | Meaning |
|---|---|
| `candidate` | Surfaced by the system — not yet confirmed. Carries no enforcement weight. |
| `confirmed` | Declared or confirmed by a human. Enforcement weight is active. |
| `dismissed` | Reviewed and dismissed. Retained as a historical record. |

---

## Enforcement rules

These rules apply at commitment-quality decision time.

### Dependency / Prerequisite rules

| Subtype | Enforcement |
|---|---|
| `informational` | No gate — surfaces context only |
| `soft` | Warning — selecting one without the other may reduce coherence or value |
| `hard` | Blocks commitment-quality disposition until the dependency condition is explicitly addressed |

Dependency rules govern prioritization legitimacy, not execution order. A hard dependency on item A does not mean "build A before B" — it means "committing to B without explicitly addressing the condition involving A is not legitimate."

Dependency and Prerequisite express the same directional constraint from different asserters. Hard dependencies on both types walk the composition tree: Aggregation and Breakdown children's hard dependencies always surface when the parent is committed.

### Package rules

A Package member cannot receive a commitment-quality disposition unless all Package members are present in the comparison scope. Partial Package representation is a **block**, not a warning.

When a Package member's primary frame changes, the system checks whether the new Track Cell (category × altitude) remains compatible with other Package members.

### Aggregation / Breakdown rules

When a composition parent (via Aggregation or Breakdown) is committed, the system walks the full composition tree and surfaces all hard dependencies on any child. Composition children's dependencies always surface at parent commitment time.

An item may be both a composition parent and an Elaboration parent simultaneously — but it must declare its **track role** before Track entry. The two roles imply different commitment semantics.

### Elaboration rules

Elaboration children are alternatives, not constituent parts. Their dependencies surface only when that specific child is selected as the committed approach — not at parent commitment time.

At least one child must be selected if the item has declared `elaboration` as its track role.

### Lineage rules

Every `split`, `merge`, `supersede`, `retire`, and `fork` must trigger explicit review of all active relationships on the affected item.

| Event | Source item | Target items | Notes |
|---|---|---|---|
| `split` | Retired | N successors | Source item closes; relationships must be explicitly re-homed |
| `merge` | N retired | 1 successor | All source relationships must be reviewed |
| `supersede` | Closes with pointer | 1 successor | Relationships do **not** automatically inherit |
| `retire` | Closes | None | All active relationships must be explicitly resolved |
| `fork` | Remains active | 1 new item | Relationship inheritance requires explicit review per type |

Lineage does not auto-inherit relationships. Each active relationship on an affected item must be explicitly resolved before the lineage event completes.

### Cluster rules

Cluster resolution must produce an explicit decision — `duplicate`, `variant`, or item-native reframe. Silent canonicalization is not permitted.

Cluster resolution is Gate 1: no other relationship type (Package, Aggregation, Dependency, etc.) can be meaningfully evaluated for an item while an unresolved cluster candidate exists involving it.

---

## Protection rings

Relationships on items in protected contexts are subject to mutation rules:

| Ring | Context | Relationship mutation rules |
|---|---|---|
| Ring 3 | Not in track or session | Fully mutable |
| Ring 2 | In track, not in active session | Comparability-affecting changes require approval |
| Ring 1 | In active session | Admin approval + session disposition declaration required |

The most-restrictive-ring rule applies when an item participates in multiple contexts simultaneously.

---

## What's next

- [Item frames](/api/items/items-attributes) — interpretive frames and altitude
- [Concepts: item relationships in depth](/concepts/item-relationships) — full taxonomy with examples and gate engine rules
- [Concepts: protection rings](/concepts/protection-rings) — mutation governance
