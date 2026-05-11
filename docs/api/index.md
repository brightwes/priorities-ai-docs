---
title: API Reference
description: Complete REST API reference. One page per resource.
sidebar_label: Overview
sidebar_position: 1
audience: Developers
status: published
---

# API Reference

**Base URL:** `https://<project>.supabase.co/functions/v1/api`
**Version prefix:** `/v1`
**Full base path:** `https://<project>.supabase.co/functions/v1/api/v1`

---

## Request format

- All request bodies: JSON with `Content-Type: application/json`
- Path parameters: UUID strings unless noted
- Query parameters: `snake_case`
- Authentication: `Authorization: Bearer pk_live_<key>`

## Response envelope

Every successful response:

```json
{
  "data": { ... },
  "meta": {
    "workspace_id": "uuid",
    "request_id": "uuid"
  },
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 243,
    "total_pages": 5
  }
}
```

`pagination` appears only on list endpoints.

## Error format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": null
  }
}
```

See [Error codes](/docs/reference/errors) for the full table.

## Pagination

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | `1` | — | Page number (1-indexed) |
| `per_page` | `50` | `100` | Results per page |

---

## Resources

**Items**

| Resource | Endpoints | Shipped |
|----------|-----------|---------|
| [Items](/docs/api/items/items) | List, create, get, update, delete, bulk import | ✅ |
| [Item Relationships](/docs/api/items/items-relationships) | List, create, delete | ✅ |
| [Item Attributes](/docs/api/items/items-attributes) | Get, upsert attribute frames | ✅ |

**Prioritization lifecycle**

| Resource | Endpoints | Shipped |
|----------|-----------|---------|
| [Cycles](/docs/api/cycles) | List, create, get, update, phase transition | ✅ |
| [Sessions](/docs/api/sessions) | List, create, get, update, results, state transition | ✅ |
| [Tool Sessions](/docs/api/tool-sessions) | List, create, get, update, responses, finalize | ✅ |
| [Catchball](/docs/api/catchball) | Proposals, loops, threads, accept, return, reject | ✅ |
| [Reports](/docs/api/reports) | Session report, cycle report, items export | ✅ |

**Decisions & events**

| Resource | Endpoints | Shipped |
|----------|-----------|---------|
| [Decisions](/docs/api/events/decisions) | List, get, create manual, update status | ✅ |
| [Governance Events](/docs/api/events/governance-events) | List, filtered by entity | ✅ |
| [Audit Events](/docs/api/events/audit-events) | List workspace-wide or per item | ✅ |

**Clarity tools**

| Resource | Endpoints | Shipped |
|----------|-----------|---------|
| [Outcome Drivers](/docs/api/clarity-tools/outcome-drivers) | Drivers CRUD + sets + set membership | ✅ |
| [Back Plans](/docs/api/clarity-tools/backplan) | Documents, nodes, edges, swimlanes, milestones | ✅ |
| [Open Questions](/docs/api/clarity-tools/open-questions) | CRUD, resolve, reopen | ✅ |
| [Methodology Connections](/docs/api/clarity-tools/methodology-connections) | Link clarity tools to prioritization objects | ✅ |
| [Export](/docs/api/clarity-tools/export) | Universal paginated export (JSON + CSV, up to 1000/page) | ✅ |

**Platform**

| Resource | Endpoints | Shipped |
|----------|-----------|---------|
| [Webhooks](/docs/api/webhooks) | Register, list, delete, test | ✅ |
| [Workspace](/docs/api/workspace) | Settings, members, connectors, API keys | ✅ |

---

## Scopes quick reference

See [Authentication](/docs/start/authentication) for the full scopes table.

| Scope | Grants access to |
|-------|----------------|
| `items:read` | Items, relationships, attributes |
| `items:write` | Create/update/delete items and attributes |
| `sessions:read` | Sessions and results |
| `sessions:write` | Session lifecycle |
| `tool_sessions:read` | Tool sessions and responses |
| `tool_sessions:write` | Tool session lifecycle |
| `cycles:read` | Cycles and tracks |
| `cycles:write` | Cycles and phase transitions |
| `catchball:read` | Proposals, loops, threads |
| `catchball:write` | Submit and resolve proposals |
| `workspace:read` | Settings, members, connectors |
| `workspace:write` | Settings mutations, key management |
| `reports:read` | All reports (JSON + CSV) |
| `webhooks:read` | Webhook list |
| `webhooks:write` | Register, delete, test webhooks |
| `outcome-drivers:read` | Outcome drivers and sets |
| `outcome-drivers:write` | Create/update/delete outcome drivers and sets |
| `backplan:read` | Back plan documents and sub-resources |
| `backplan:write` | Create/update/delete back plans |
| `open-questions:read` | Open questions |
| `open-questions:write` | Create/update/delete/resolve questions |
| `methodology-connections:read` | Methodology connections |
| `methodology-connections:write` | Create/delete connections |
| `decisions:read` | Decisions log |
| `decisions:write` | Create manual decisions, update status |
| `governance:read` | Governance events |
| `audit:read` | Audit events |
