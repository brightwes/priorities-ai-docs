---
title: Ingest from Workday — Priorities.ai
description: Import headcount and org structure from Workday to inform cycle configuration. Planned.
audience: Developers
status: planned
---

> **Note (Coming soon):** The Workday integration is planned and not yet shipped. This guide will be updated with working code examples when it ships.
>
> The pattern described below shows the intended flow. In the meantime, use the [items API](/api/items/items) and [attributes API](/api/items/items-attributes) to manually enter capacity data.

---

# Ingest from Workday *(planned)*

Import headcount and organizational structure from Workday to automatically configure capacity constraints and authority lanes for each prioritization cycle.

---

## Intended flow

```
Workday (RAAS report or REST API)
  → Headcount by team
  → Manager hierarchy
  → Cost center data
                    ↓
Priorities.ai:
  → Item attribute frames: effort capacity by team
  → Cycle configuration: authority lane mapping from manager hierarchy
  → Catchball configuration: who has approval rights for which tracks
```

---

## Manual workaround (available today)

Until the Workday connector ships, you can replicate the core value manually:

```bash
# Set capacity context as item attributes
curl -X PATCH "$PAI_BASE/items/item-uuid/attributes" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      {
        "frame_type": "capacity_context",
        "available_team_weeks": 40,
        "team_name": "Platform Engineering",
        "headcount": 6
      }
    ]
  }'
```

```bash
# Configure workspace members manually
POST /v1/workspace/members/invite
{
  "email": "...",
  "role": "facilitator",
  "name": "..."
}
```

[Contact us →] to be notified when the Workday integration ships.
