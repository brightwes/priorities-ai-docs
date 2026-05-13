---
title: Methodology Connections API
description: Link clarity tool artifacts to prioritization objects.
sidebar_label: Methodology Connections
sidebar_position: 4
audience: Developers
status: published
---

# Methodology Connections

A Methodology Connection is a typed, directional link between a clarity tool artifact (the *source*) and a prioritization object (the *target*). These connections make explicit *why* an item, cycle, session, or track exists — grounding it in the methodology.

**Base path:** `/v1/methodology-connections`

**Scopes:**
- `methodology-connections:read` — GET
- `methodology-connections:write` — POST, DELETE

---

## Source entity types

| Type | Description |
|------|-------------|
| `outcome_driver` | An outcome driver artifact |
| `desired_outcome` | A desired outcome specification |
| `backplan_node` | A node in a back plan |
| `ost_node` | A node in an Opportunity Solution Tree |
| `open_question` | An open question |
| `objective` | A strategic objective |
| `goal` | A strategic goal (metric) |

## Target entity types

| Type | Description |
|------|-------------|
| `item` | A prioritization item |
| `cycle` | A planning cycle |
| `session` | A prioritization session |
| `track` | A cycle track |

## Connection types

| Type | Meaning |
|------|---------|
| `informs` | The source provides context that shapes the target |
| `motivates` | The source is the reason the target exists |
| `addresses` | The target works toward resolving the source |
| `answers` | The target is the answer to a question in the source |
| `derives_from` | The target was derived from the source |

---

## Endpoints

### List connections

```
GET /v1/methodology-connections
```

**Query params:**

| Param | Description |
|-------|-------------|
| `source_entity_type` | Filter by source type |
| `source_entity_id` | Filter by specific source |
| `target_entity_type` | Filter by target type |
| `target_entity_id` | Filter by specific target |
| `connection_type` | Filter by connection type |
| `page`, `per_page` | Pagination |

**Example — what items does this outcome driver inform?**

```bash
curl "$PAI_BASE/methodology-connections?source_entity_type=outcome_driver&source_entity_id=<uuid>&connection_type=informs" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Example — what clarity artifacts inform this item?**

```bash
curl "$PAI_BASE/methodology-connections?target_entity_type=item&target_entity_id=<uuid>" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

### Create a connection

```
POST /v1/methodology-connections
```

Backed by the `create_methodology_connection` RPC — idempotent: creating the same connection twice returns the existing record.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source_entity_type` | string | **required** | Source type (see table above) |
| `source_entity_id` | uuid | **required** | Source entity ID |
| `target_entity_type` | string | **required** | Target type |
| `target_entity_id` | uuid | **required** | Target entity ID |
| `connection_type` | string | | Defaults to `informs` |
| `created_by` | uuid | | User creating the connection |

**Response:** `201 Created` (new) or `200 OK` (already existed).

---

### Delete a connection

```
DELETE /v1/methodology-connections/:id
```

---

## See also

- [Export API](/api/clarity-tools/export) — export connections as JSON or CSV
- [Items API](/api/items/items) — relationships between items use a separate endpoint
