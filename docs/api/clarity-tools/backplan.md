---
title: Back Plans API
description: Create and manage back plan documents with nodes, edges, swimlanes, and milestones.
sidebar_label: Back Plans
sidebar_position: 2
audience: Developers
status: published
---

# Back Plans

A Back Plan works backward from a desired outcome to identify what must be true at each stage. The API exposes the full graph structure: documents, nodes, directed edges (cycle-safe), swimlanes, and milestone columns.

**Base path:** `/v1/backplan`

**Scopes:**
- `backplan:read` — all GET endpoints
- `backplan:write` — all POST, PATCH, DELETE endpoints

---

## Documents

### List back plans

```
GET /v1/backplan
```

**Query params:** `search`, `page`, `per_page`

---

### Create a back plan

```
POST /v1/backplan
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **required** | Plan title |
| `description` | string | | Plan summary |
| `cycle_id` | uuid | | Link to a Plan of Record (cycle) |
| `objective_id` | uuid | | Link to a strategic objective |

---

### Get a back plan (full)

```
GET /v1/backplan/:id
```

Returns the document plus inline arrays for `nodes`, `edges`, `swimlanes`, and `milestones` — all sub-resources in a single call.

**Example response:**

```json
{
  "data": {
    "id": "bp-uuid",
    "title": "Launch readiness",
    "cycle_id": null,
    "nodes": [
      { "id": "node-1", "label": "Signed contracts", "node_type": "milestone", "swimlane_id": "lane-1" }
    ],
    "edges": [
      { "id": "edge-1", "from_node_id": "node-2", "to_node_id": "node-1" }
    ],
    "swimlanes": [
      { "id": "lane-1", "title": "Legal", "position": 0 }
    ],
    "milestones": [
      { "id": "ms-1", "title": "Q3 Readiness", "position": 0 }
    ]
  }
}
```

---

### Update a back plan

```
PATCH /v1/backplan/:id
```

---

### Delete a back plan

```
DELETE /v1/backplan/:id
```

---

## Nodes

### List nodes

```
GET /v1/backplan/:id/nodes
```

Ordered by `position` ascending.

---

### Create a node

```
POST /v1/backplan/:id/nodes
```

**Body:**

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Node label |
| `node_type` | string | e.g. `condition`, `milestone`, `blocker` |
| `swimlane_id` | uuid | Swimlane this node belongs to |
| `milestone_column_id` | uuid | Milestone column for grid placement |
| `position` | integer | Display order within swimlane |
| `item_id` | uuid | Link to a prioritization item |

---

### Update a node

```
PATCH /v1/backplan/:id/nodes/:nodeId
```

---

### Delete a node

```
DELETE /v1/backplan/:id/nodes/:nodeId
```

---

## Edges

Edges are directional and cycle-safe (backed by the `create_backplan_edge` RPC).

### List edges

```
GET /v1/backplan/:id/edges
```

---

### Create an edge

```
POST /v1/backplan/:id/edges
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from_node_id` | uuid | **required** | Source node |
| `to_node_id` | uuid | **required** | Target node |
| `note` | string | | Optional annotation |

Returns `400` with `"would_create_cycle"` if the edge would introduce a directed cycle.

---

### Delete an edge

```
DELETE /v1/backplan/:id/edges/:edgeId
```

---

## Swimlanes

Swimlanes are horizontal rows grouping related nodes (e.g. by team or function).

### List swimlanes

```
GET /v1/backplan/:id/swimlanes
```

---

### Create a swimlane

```
POST /v1/backplan/:id/swimlanes
```

**Body:** `title`, `description`, `position`

---

### Update a swimlane

```
PATCH /v1/backplan/:id/swimlanes/:laneId
```

---

### Delete a swimlane

```
DELETE /v1/backplan/:id/swimlanes/:laneId
```

---

## Milestone Columns

Milestone columns define the vertical time/stage dimension of the grid.

### List milestones

```
GET /v1/backplan/:id/milestones
```

---

### Create a milestone column

```
POST /v1/backplan/:id/milestones
```

**Body:** `title`, `description`, `position`, `target_date`

---

### Update a milestone column

```
PATCH /v1/backplan/:id/milestones/:msId
```

---

### Delete a milestone column

```
DELETE /v1/backplan/:id/milestones/:msId
```

---

## See also

- [Export API](/docs/api/export) — export back plan documents as JSON or CSV
- [Items API](/docs/api/items) — nodes can be linked to prioritization items via `item_id`
