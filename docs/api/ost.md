---
title: Opportunity Solution Trees API
description: Build and navigate Opportunity Solution Trees (OSTs).
sidebar_label: OST API
sidebar_position: 19
---

# Opportunity Solution Trees API

An **Opportunity Solution Tree (OST)** is a hierarchical structure that maps opportunities to solutions and experiments. Trees are workspace-scoped; nodes within a tree can represent `opportunity`, `solution`, or `experiment` types with optional parent linkage.

**Scope:** `items:read` / `items:write`

---

## OST Trees

### `GET /v1/ost`

Lists all OST trees for this workspace.

**Query params:** `page`, `per_page`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "workspace_id": "uuid",
      "name": "Onboarding Improvement",
      "description": "Opportunities and solutions for the new user onboarding flow",
      "created_at": "2026-05-01T00:00:00Z"
    }
  ]
}
```

### `POST /v1/ost`

Creates an OST tree. **Required:** `name`

```json
// Request
{
  "name": "Onboarding Improvement",
  "description": "Opportunities and solutions for the new user onboarding flow"
}
```

### `GET /v1/ost/:id`

Returns a single tree (without nodes). Fetch nodes separately via `/nodes`.

### `PATCH /v1/ost/:id`

Updates a tree. Updatable: `name`, `description`, and any other mutable columns.

### `DELETE /v1/ost/:id`

Deletes a tree. Deleting a tree cascades to all its nodes (handled by the database foreign key).

---

## OST Nodes

Nodes are the elements of a tree. Each node has a `node_type` and an optional `parent_node_id` for hierarchical nesting.

### `GET /v1/ost/:id/nodes`

Returns all nodes for this tree.

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "tree_id": "uuid",
      "node_type": "opportunity",
      "label": "Users struggle to understand the value during signup",
      "description": null,
      "parent_node_id": null,
      "metadata": {},
      "created_at": "2026-05-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "tree_id": "uuid",
      "node_type": "solution",
      "label": "Guided setup wizard",
      "parent_node_id": "opportunity-node-uuid",
      "created_at": "2026-05-02T00:00:00Z"
    }
  ]
}
```

### `POST /v1/ost/:id/nodes`

Creates a node in this tree.

**Required:** `node_type`, `label`

**Optional:** `parent_node_id`, `description`, `metadata`

Valid `node_type` values: `opportunity`, `solution`, `experiment`

```json
// Request — add a solution node beneath an opportunity
{
  "node_type": "solution",
  "label": "Guided setup wizard",
  "parent_node_id": "opportunity-node-uuid",
  "description": "A step-by-step onboarding wizard that highlights key value moments"
}
```

### `GET /v1/ost/:id/nodes/:nid`

Returns a single node.

### `PATCH /v1/ost/:id/nodes/:nid`

Updates a node. Updatable: `label`, `description`, `parent_node_id`, `metadata`, and any other mutable columns.

### `DELETE /v1/ost/:id/nodes/:nid`

Deletes a node. Child nodes referencing this node as `parent_node_id` will need to be re-parented or deleted separately.

---

## Node type reference

| Type | Role in the tree |
|------|-----------------|
| `opportunity` | A user need, pain point, or gap — the "why" of a solution |
| `solution` | A proposed response to an opportunity |
| `experiment` | A specific test or bet to validate a solution |

Trees typically have opportunities at the root, with solutions and experiments nested beneath them.
