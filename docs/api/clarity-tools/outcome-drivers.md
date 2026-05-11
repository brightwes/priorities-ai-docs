---
title: Outcome Drivers API
description: CRUD for outcome driver artifacts and named sets.
sidebar_label: Outcome Drivers
sidebar_position: 1
audience: Developers
status: published
---

# Outcome Drivers

Outcome Drivers capture *why* change is needed — the current-state gaps that frame a clarification effort. Each driver can be organized into named Sets for structured presentation.

**Base path:** `/v1/outcome-drivers`

**Scopes:**
- `outcome-drivers:read` — all GET endpoints
- `outcome-drivers:write` — all POST, PATCH, DELETE endpoints

---

## Drivers

### List drivers

```
GET /v1/outcome-drivers
```

**Query params:**

| Param | Description |
|-------|-------------|
| `cycle_id` | Filter by planning cycle |
| `search` | Full-text search on `title` |
| `page` | Page number (default 1) |
| `per_page` | Results per page (default 50, max 100) |

**Example:**

```bash
curl "$PAI_BASE/outcome-drivers?cycle_id=<uuid>" \
  -H "Authorization: Bearer $PAI_KEY"
```

---

### Create a driver

```
POST /v1/outcome-drivers
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **required** | Short label for the driver |
| `description` | string | | Full narrative |
| `cycle_id` | uuid | | Associated planning cycle |
| `category` | string | | Driver category/type |
| `source` | string | | Origin of the driver (e.g. "customer feedback") |

**Webhook fired:** `outcome-driver.created`

---

### Get a driver

```
GET /v1/outcome-drivers/:id
```

---

### Update a driver

```
PATCH /v1/outcome-drivers/:id
```

Send only fields you want to change. `id` and `workspace_id` are ignored.

**Webhook fired:** `outcome-driver.updated`

---

### Delete a driver

```
DELETE /v1/outcome-drivers/:id
```

**Webhook fired:** `outcome-driver.deleted`

---

## Sets

A **Set** is a named ordered collection of drivers — useful for presenting a curated list to stakeholders.

### List sets

```
GET /v1/outcome-drivers/sets
```

**Query params:** `cycle_id`, `page`, `per_page`

---

### Create a set

```
POST /v1/outcome-drivers/sets
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **required** | Set name |
| `description` | string | | Set summary |
| `cycle_id` | uuid | | Associated cycle |

---

### Get a set (with drivers)

```
GET /v1/outcome-drivers/sets/:setId
```

Returns the set metadata plus an inline `drivers` array ordered by `position`.

---

### Update a set

```
PATCH /v1/outcome-drivers/sets/:setId
```

---

### Delete a set

```
DELETE /v1/outcome-drivers/sets/:setId
```

---

### Add a driver to a set

```
POST /v1/outcome-drivers/sets/:setId/drivers
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `driver_id` | uuid | **required** | Driver to add |
| `position` | integer | | Display order (default 0) |

Idempotent: re-adding an existing driver updates its position.

---

### Remove a driver from a set

```
DELETE /v1/outcome-drivers/sets/:setId/drivers/:driverId
```

---

## See also

- [Export API](/docs/api/export) — bulk export outcome drivers as JSON or CSV
- [Methodology Connections API](/docs/api/methodology-connections) — link drivers to prioritization items
