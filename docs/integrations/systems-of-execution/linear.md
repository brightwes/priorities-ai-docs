---
title: Linear Integration — Priorities.ai
description: Export published priority lists to Linear as projects with priority order.
audience: Developers
status: published
---

# Linear

Export published priority lists to Linear. Committed items become Linear issues in your configured team, with priority rank and rationale attached.

**Direction:** Export
**Status:** ✅ Shipped

---

## Configuration

```bash
curl -X PATCH "$PAI_BASE/workspace/connectors/linear" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "api_key": "lin_api_your_key_here",
      "team_id": "your-linear-team-id",
      "project_id": "optional-target-project-id",
      "label_ids": ["priorities-ai-label-id"]
    }
  }'
```

**Configuration fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `api_key` | ✓ | Linear API key |
| `team_id` | ✓ | Target team ID |
| `project_id` | | Target project ID. If omitted, issues are unassigned to a project. |
| `label_ids` | | Label IDs to apply to created issues |

---

## What gets created

Each item becomes a Linear issue with:

- **Title:** Item name
- **Description:** Item description + decision rationale (markdown)
- **Priority:** Mapped from Priorities.ai rank to Linear priority (1=Urgent, 2=High, 3=Medium, 4=Low)
- **Labels:** `priorities-ai-managed`

---

## Export trigger

Triggers on `priority_list.approved`. Manual sync:

```bash
POST /v1/workspace/connectors/linear/sync
{ "priority_list_id": "list-uuid" }
```
