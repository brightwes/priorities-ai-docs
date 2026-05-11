---
title: Workday Integration — Priorities.ai
description: Ingest headcount, org structure, and capacity constraints from Workday to inform prioritization.
audience: Developers
status: planned
---

> **Note (Coming soon):** The Workday integration is planned and not yet shipped. This page documents the intended configuration and data flows when it is available.

---

# Workday *(planned)*

Import headcount, organizational structure, and capacity constraints from Workday to inform the Frame for each prioritization cycle.

**Direction:** Import (signal in)
**Planned signals:**
- Headcount by department/team → capacity constraints on item pools
- Manager hierarchy → authority lane configuration for Catchball
- Cost center data → budget context for effort scoring
- Open requisitions → signals for technical capacity planning

---

## Planned configuration

```json
{
  "config": {
    "tenant": "your-workday-tenant",
    "client_id": "workday-client-id",
    "client_secret": "workday-client-secret",
    "raas_endpoint": "https://wd3-services1.workday.com/...",
    "sync_types": ["headcount", "hierarchy", "cost_centers"]
  }
}
```

---

## In the meantime

Capacity and headcount data can be entered manually as item attributes or imported via the items CSV:

```bash
# Import items with capacity context via CSV
GET /v1/reports/items
Accept: text/csv
# Edit and re-import with PATCH /v1/items/:id/attributes
```

[Contact us →] to be notified when the Workday integration ships.

[Guide: ingest from Workday →](/docs/guides/ingest-from-workday) *(planned)*
