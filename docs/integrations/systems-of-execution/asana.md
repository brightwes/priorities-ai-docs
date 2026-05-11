---
title: Asana Integration — Priorities.ai
description: Export published priority lists to Asana as projects or tasks.
audience: Developers
status: published
---

# Asana

Export published priority lists to Asana. Committed items become tasks or projects in Asana with rank and rationale attached.

**Direction:** Export
**Status:** ✅ Shipped

---

## Configuration

```bash
curl -X PATCH "$PAI_BASE/workspace/connectors/asana" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "access_token": "your-asana-personal-access-token",
      "workspace_gid": "your-workspace-gid",
      "project_gid": "optional-target-project-gid",
      "assignee_gid": "optional-default-assignee"
    }
  }'
```

**Configuration fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `access_token` | ✓ | Asana personal access token |
| `workspace_gid` | ✓ | Asana workspace GID |
| `project_gid` | | Target project GID. If omitted, items are added to inbox. |
| `assignee_gid` | | Default assignee for created tasks |

---

## What gets created

Each item in the published list generates an Asana task with:

- **Name:** Item name
- **Notes:** Description + decision rationale
- **Custom field (Priority Rank):** Rank in the list
- **Tags:** `priorities-ai-managed`

---

## Export trigger

Triggers on `priority_list.approved`. Manual sync:

```bash
POST /v1/workspace/connectors/asana/sync
{ "priority_list_id": "list-uuid" }
```
