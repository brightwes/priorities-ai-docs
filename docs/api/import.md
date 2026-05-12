---
title: Import API
description: Bulk import items, relationships, and other entities via JSON or CSV.
sidebar_label: Import API
sidebar_position: 21
audience: Developers
status: published
---

# Import API

Bulk import any supported entity in a single call. Accepts JSON arrays or RFC 4180 CSV with a header row. Maximum 1000 rows per request.

**Base path:** `POST /v1/import/:entity`

---

## Idempotency

All import endpoints support `Idempotency-Key: <uuid>`. Pass a stable key (e.g. a UUID derived from your sync job run ID) to make re-runs safe — the first response is cached for 24 hours.

```bash
curl -X POST "$PAI_BASE/import/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '[{"name":"Feature A","external_id":"JIRA-001"},{"name":"Feature B","external_id":"JIRA-002"}]'
```

---

## Response format

Every import returns a summary:

```json
{
  "data": {
    "entity": "items",
    "total": 150,
    "inserted": 142,
    "updated": 8,
    "errors": [
      { "row": 12, "message": "name is required" }
    ]
  },
  "meta": { "workspace_id": "uuid", "request_id": "uuid" }
}
```

Row-level errors do not abort the import — valid rows are still processed.

---

## Import items

```
POST /v1/import/items
```

**Scope:** `items:write`

Items with `external_id` are **upserted** (matched on `workspace_id + external_id`). Items without `external_id` are always **inserted** as new rows.

**Accepted fields:**

| Field | Required | Notes |
|---|---|---|
| `name` | **required** | Item name |
| `description` | | |
| `category` | | Maps to `item_category` |
| `status` | | Maps to `lifecycle_state`. Default: `active` |
| `external_id` | | Enables upsert. Unique per workspace. |
| `altitude_level` | | |

**JSON request:**

```json
[
  { "name": "Redesign onboarding", "category": "product", "external_id": "JIRA-101" },
  { "name": "Fix checkout bug",    "category": "engineering", "status": "active" }
]
```

**CSV request:**

```
Content-Type: text/csv

name,description,category,external_id
"Redesign onboarding","Reduce TTFR","product","JIRA-101"
"Fix checkout bug","","engineering","JIRA-102"
```

---

## Import item relationships

```
POST /v1/import/item-relationships
```

**Scope:** `items:write`

Creates relationship edges between items. All rows are inserted; no upsert logic.

**Required fields per row:** `source_item_id`, `target_item_id`, `relationship_type`

Valid `relationship_type` values: `related`, `dependency`, `aggregation`, `elaboration`, `breakdown`

```json
[
  {
    "source_item_id": "uuid-a",
    "target_item_id": "uuid-b",
    "relationship_type": "dependency",
    "subtype": "blocks"
  }
]
```

---

## Import desired outcomes

```
POST /v1/import/desired-outcomes
```

**Scope:** `desired-outcomes:write`

**Required per row:** `title`. Max 500 rows per request.

```json
[
  {
    "title": "Users complete onboarding in under 10 minutes",
    "metric": "Completion rate > 80%",
    "time_bound": "Q3 2026"
  }
]
```

---

## Import open questions

```
POST /v1/import/open-questions
```

**Scope:** `open-questions:write`

**Required per row:** `question`. Max 500 rows per request.

```json
[
  {
    "question": "What does success look like for the redesign?",
    "category": "product",
    "priority": "high",
    "created_by": "user-uuid"
  }
]
```

---

## Limits

| Entity | Max rows |
|---|---|
| `items` | 1,000 |
| `item-relationships` | 1,000 |
| `desired-outcomes` | 500 |
| `open-questions` | 500 |

For larger imports, split into batches and use `Idempotency-Key` per batch.

---

## SDK

```typescript
import { PrioritiesClient } from '@priorities-ai/sdk';

const client = new PrioritiesClient({ apiKey: 'pk_live_...' });

// JSON import with idempotency
const result = await client.import.items([
  { name: 'Feature A', external_id: 'JIRA-001' },
  { name: 'Feature B', external_id: 'JIRA-002' },
], crypto.randomUUID());

console.log(result.data.inserted, 'new items');
console.log(result.data.updated,  'updated items');
console.log(result.data.errors);

// CSV import
const csv = `name,external_id\nFeature A,JIRA-001\nFeature B,JIRA-002`;
await client.import.itemsFromCsv(csv);
```
