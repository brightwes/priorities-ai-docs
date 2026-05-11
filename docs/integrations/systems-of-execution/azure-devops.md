---
title: Azure DevOps Integration — Priorities.ai
description: Export published priority lists to Azure DevOps as work items with priority order and rationale.
audience: Developers
status: published
---

# Azure DevOps

Export published priority lists to Azure DevOps. Committed items become Epics (or Features, configurable) in Azure Boards, with rank and decision rationale attached.

**Direction:** Export
**Status:** ✅ Shipped

---

## Configuration

In **Settings → Integrations → Azure DevOps**, or via API:

```bash
curl -X PATCH "$PAI_BASE/workspace/connectors/azure-devops" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "organization": "your-org",
      "project": "YourProject",
      "personal_access_token": "your-pat-here",
      "work_item_type": "Epic",
      "area_path": "YourProject\\Product"
    }
  }'
```

**Configuration fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `organization` | ✓ | Azure DevOps organization name |
| `project` | ✓ | Project name |
| `personal_access_token` | ✓ | PAT with Work Items read/write scope |
| `work_item_type` | ✓ | Work item type (`Epic`, `Feature`, or `Story`) |
| `area_path` | | Area path for created work items |
| `iteration_path` | | Iteration path for created work items |

---

## What gets created

Each item in the published list generates an Azure DevOps work item with:

- **Title:** Item name
- **Description:** Item description + rationale from the decision record
- **Stack Rank** (or custom field): Priority rank
- **Tags:** `priorities-ai-managed`
- **Relations:** Predecessor/successor links for hard Dependencies

---

## Export trigger

Triggers on `priority_list.approved`. Manual sync also available:

```bash
POST /v1/workspace/connectors/azure-devops/sync
{ "priority_list_id": "list-uuid" }
```
