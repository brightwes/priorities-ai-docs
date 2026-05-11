---
title: Item Relationships API
description: Read the relationship graph for any item. Cluster, Bloc, Dependency, Aggregation, Elaboration, Lineage.
sidebar_label: Item Relationships API
sidebar_position: 2
audience: Developers
status: published
---

# Item Relationships

Items in Priorities.ai participate in a typed, mutation-governed relationship graph. This graph carries semantic meaning that affects prioritization logic — a hard Dependency blocks commitment-quality decisions; a Bloc enforces atomicity; Aggregation propagates dependencies from children at parent commitment time.

Seven relationship types. Seven semantics. Not one overloaded "link."

---

## Relationship types

| Type | Axis | Subtypes | Semantic |
|------|------|----------|---------|
| `cluster` | Horizontal | `duplicate`, `variant` | Identity or near-identity |
| `related` | Horizontal | — | Proximity — worth considering together |
| `bloc` | Horizontal | — | Atomicity — all-or-nothing selection |
| `dependency` | Horizontal | `informational`, `soft`, `hard` | Prioritization constraint |
| `aggregation` | Vertical | — | Composition — parent rolls up children |
| `elaboration` | Vertical | `solution_spectrum`, `solution_variant` | Response — children are alternative approaches |
| `lineage` | Temporal | `split`, `merge`, `supersede`, `retire`, `fork` | Structural transformation over time |

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
      "relationship_type": "bloc",
      "relationship_subtype": null,
      "status": "confirmed",
      "workspace_id": "..."
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Relationship object fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Relationship record ID |
| `source_item_id` | uuid | Source item (for directed relationships) |
| `target_item_id` | uuid | Target item |
| `relationship_type` | string | One of the seven types listed above |
| `relationship_subtype` | string | Subtype where applicable (e.g. `hard`, `duplicate`, `split`) |
| `status` | string | `candidate` — surfaced by system, not yet confirmed; `confirmed` — active; `dismissed` — reviewed and dismissed |
| `direction` | string | `source_to_target`, `target_to_source`, or `bidirectional` |
| `rationale` | string | Human-provided rationale for the relationship |
| `created_at` | timestamptz | When the relationship was recorded |

---

## Enforcement rules

These rules apply at commitment-quality decision time and are surfaced in API responses when relevant:

### Dependency rules

| Subtype | Enforcement |
|---------|-------------|
| `informational` | No gate — context only |
| `soft` | Warning surfaced — selecting one without the other may reduce expected value |
| `hard` | Blocks commitment-quality disposition until the dependency condition is explicitly addressed |

> **Note:** Dependency rules govern prioritization legitimacy, not execution order. A hard dependency on item B does not mean "build A before B." It means "selecting A for commitment without explicitly addressing the dependency condition involving B is not legitimate."

### Bloc rules

A Bloc member cannot receive a commitment-quality disposition unless all Bloc members are present in the comparison scope. Partial Bloc representation in a comparison scope is a **block**, not a warning.

### Aggregation rules

When an aggregation parent is committed, the system walks the aggregation tree and surfaces all hard dependencies found on any aggregation child.

### Lineage rules

Every `split`, `merge`, `supersede`, `retire`, and `fork` must trigger explicit review of all active relationships on the affected item. Lineage does not auto-inherit relationships.

---

## Relationship status values

| Status | Meaning |
|--------|---------|
| `candidate` | Surfaced by the system as a potential relationship — not yet confirmed. Carries no enforcement weight until confirmed. |
| `confirmed` | Declared or confirmed by a human. Enforcement weight is active. |
| `dismissed` | Reviewed and dismissed. Remains as a historical record. |

---

## Protection rings

Relationships on items in protected contexts (active sessions or tracks) are subject to mutation rules:

| Ring | Context | Relationship mutation rules |
|------|---------|---------------------------|
| Ring 3 | Not in track or session | Fully mutable |
| Ring 2 | In track, not in active session | Comparability-affecting changes require approval |
| Ring 1 | In active session | Admin approval + session disposition declaration required |

The most-restrictive-ring rule applies when an item is in multiple contexts simultaneously.

---

## What's next

- [Item attributes](/docs/api/items-attributes) — RICE frames, sizing, custom scoring
- [Concepts: item relationships in depth](/docs/concepts/item-relationships) — full taxonomy with examples
- [Concepts: protection rings](/docs/concepts/protection-rings) — mutation governance
- [Guide: run a headless session](/docs/guides/run-headless-session) — working with relationships in a session context
