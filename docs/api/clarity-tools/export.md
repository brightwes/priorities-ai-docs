---
title: Export API
description: Universal paginated export for all entities. Supports JSON and CSV.
sidebar_label: Export
sidebar_position: 5
audience: Developers
status: published
---

# Export

The Export API provides a single generalized endpoint for bulk data extraction. It supports up to 1,000 rows per page (vs. 100 for the regular API), field projection, and CSV output — making it the right tool for data pipelines, sync jobs, and spreadsheet exports.

**Base path:** `/v1/export`

---

## Endpoint

```
GET /v1/export/:entity
```

**Auth:** The API key must hold the read scope for the requested entity (e.g. `items:read` for `items`). See the entity table below.

---

## Supported entities

| Entity slug | Scope required | Filters supported |
|-------------|----------------|-------------------|
| `items` | `items:read` | `status`, `category`, `search` |
| `sessions` | `sessions:read` | `cycle_id`, `state` |
| `cycles` | `cycles:read` | `status` |
| `tracks` | `cycles:read` | `cycle_id` |
| `catchball-proposals` | `catchball:read` | `cycle_id`, `loop_id`, `status` |
| `outcome-drivers` | `outcome-drivers:read` | `cycle_id`, `search` |
| `outcome-driver-sets` | `outcome-drivers:read` | `cycle_id` |
| `backplan` | `backplan:read` | `search` |
| `open-questions` | `open-questions:read` | `status`, `context_entity_type`, `context_entity_id` |
| `methodology-connections` | `methodology-connections:read` | `source_entity_type`, `source_entity_id`, `target_entity_type`, `target_entity_id` |

---

## Common query params

| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `page` | `1` | — | Page number |
| `per_page` | `100` | `1000` | Rows per page (higher limit than the regular API) |
| `format` | `json` | — | `json` or `csv` |
| `fields` | (all) | — | Comma-separated list of columns to include in JSON output |

You can also request CSV by sending `Accept: text/csv`.

---

## Examples

**Export all items as JSON:**

```bash
curl "$PAI_BASE/export/items" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Export items as CSV (download):**

```bash
curl "$PAI_BASE/export/items?format=csv" \
  -H "Authorization: Bearer $PAI_KEY" \
  -o items.csv
```

**Project specific fields:**

```bash
curl "$PAI_BASE/export/items?fields=id,name,status,external_id" \
  -H "Authorization: Bearer $PAI_KEY"
```

**Paginate a large dataset:**

```bash
# Page 1
curl "$PAI_BASE/export/items?per_page=1000&page=1" -H "Authorization: Bearer $PAI_KEY"
# Page 2
curl "$PAI_BASE/export/items?per_page=1000&page=2" -H "Authorization: Bearer $PAI_KEY"
```

**Export open questions filtered by context:**

```bash
curl "$PAI_BASE/export/open-questions?status=open&context_entity_type=outcome_driver" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

## JSON response format

```json
{
  "data": [ { "id": "...", "name": "...", ... }, ... ],
  "meta": { "workspace_id": "...", "request_id": "..." },
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 843,
    "total_pages": 9
  }
}
```

---

## CSV response format

When `?format=csv` (or `Accept: text/csv`) is requested:

- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="<entity>-export.csv"`
- Columns: all columns (field projection is a JSON-only feature for CSV)
- Values: RFC 4180 compliant — fields with commas, quotes, or newlines are double-quoted

---

## See also

- [Items API](/api/items/items) — CRUD for individual items
- [Outcome Drivers API](/api/clarity-tools/outcome-drivers) — driver and set CRUD
- [Back Plans API](/api/clarity-tools/backplan) — back plan CRUD
