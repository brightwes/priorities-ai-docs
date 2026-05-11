---
title: Item Attributes API
description: Read and write attribute frames (RICE, sizing, custom) on items.
sidebar_label: Item Attributes API
sidebar_position: 3
audience: Developers
status: published
---

# Item Attributes

Attribute frames are typed collections of scoring and measurement values attached to an item. They represent the evidence and estimates that inform a prioritization decision — RICE scores, t-shirt sizing, custom criteria values, or any other measurement your organization tracks.

Attributes are the raw material for Stage 5 (Value Assignment) of the prioritization process.

---

## Attribute frames

Each frame has a `frame_type` that identifies what set of fields it contains. Standard types:

| Frame type | Fields |
|------------|--------|
| `rice` | `reach`, `impact`, `confidence`, `effort` |
| `sizing` | `t_shirt` (`XS`, `S`, `M`, `L`, `XL`, `XXL`) |
| `weighted` | Custom weighted criteria — fields vary by workspace configuration |

Multiple frames can coexist on an item. An item might carry both a `rice` frame and a `sizing` frame.

---

## Get attributes for an item

```
GET /v1/items/:id/attributes
```

**Scopes:** `items:read`

**Request:**

```bash
curl "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "frame-uuid-1",
      "item_id": "a1b2c3d4-...",
      "frame_type": "rice",
      "reach": 1000,
      "impact": 3,
      "confidence": 80,
      "effort": 5,
      "created_by": "user-uuid",
      "created_at": "2026-03-20T10:00:00Z",
      "updated_at": "2026-03-22T14:00:00Z"
    },
    {
      "id": "frame-uuid-2",
      "item_id": "a1b2c3d4-...",
      "frame_type": "sizing",
      "t_shirt": "M",
      "created_by": "user-uuid",
      "created_at": "2026-03-20T10:00:00Z"
    }
  ],
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

---

## Upsert attribute frames

```
PATCH /v1/items/:id/attributes
```

**Scopes:** `items:write`

Upserts attribute frames. Existing frames with the same `frame_type` are replaced. Frames with different `frame_type` values are preserved.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `frames` | array | **required** | Array of frame objects. Each must include `frame_type`. |

**Request:**

```bash
curl -X PATCH "$PAI_BASE/items/a1b2c3d4-.../attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "rice",
        "reach": 1000,
        "impact": 3,
        "confidence": 80,
        "effort": 5
      },
      {
        "frame_type": "sizing",
        "t_shirt": "M"
      }
    ]
  }'
```

**Response:** `200 OK` with the upserted frames.

---

## RICE scoring

RICE (Reach, Impact, Confidence, Effort) is a common prioritization scoring framework.

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `reach` | integer | ≥ 0 | Number of users or customers affected per period |
| `impact` | integer | 0.25, 0.5, 1, 2, 3 | Relative impact per user |
| `confidence` | integer | 0–100 | Confidence percentage |
| `effort` | number | > 0 | Estimated effort in person-months |

RICE score = `(reach × impact × confidence) / effort`

The platform computes and stores this score automatically when a RICE frame is submitted with all four fields.

---

## Custom frames

Workspaces can define custom frame types with arbitrary field names. The `frame_type` string is the identifier. Fields outside the known standard types are stored as freeform key-value pairs.

```json
{
  "frame_type": "strategic_alignment",
  "revenue_impact": "high",
  "compliance_required": true,
  "customer_commitment": "public_roadmap",
  "strategic_theme": "platform_scalability"
}
```

---

## What's next

- [Sessions API](/docs/api/sessions) — configure criteria that consume attribute values
- [Concepts: comparability and tracks](/docs/concepts/comparability-and-tracks) — how attributes feed into session scoring
