---
title: Jira Integration — Priorities.ai
description: Export published priority lists to Jira as epics with priority order and decision rationale attached.
audience: Developers
status: published
---

# Jira

Export published priority lists to Jira. Each committed item becomes a Jira epic (or project, configurable) with the item's rank, rationale, and relationship context attached.

**Direction:** Export (Priorities.ai → Jira)
**Status:** ✅ Shipped

---

## What this integration does

When a `priority_list.approved` event fires, the Jira connector:

1. Creates or updates a Jira epic for each item in the list
2. Sets a `Priority Rank` custom field to the item's rank
3. Attaches the decision rationale to the epic description
4. Links related epics where Priorities.ai Package or Dependency relationships exist

---

## Prerequisites

- A Jira Cloud account with API access
- A Jira API token ([create one here](https://id.atlassian.com/manage-profile/security/api-tokens))
- A Priorities.ai workspace admin token with `workspace:write` scope

---

## Configuration

In **Settings → Integrations → Jira**, or via API:

```bash
curl -X PATCH "$PAI_BASE/workspace/connectors/jira" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "base_url": "https://your-org.atlassian.net",
      "email": "your-email@example.com",
      "api_token": "your-jira-api-token",
      "project_key": "PROD",
      "issue_type": "Epic",
      "priority_rank_field": "customfield_10030"
    }
  }'
```

**Configuration fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `base_url` | ✓ | Jira Cloud URL |
| `email` | ✓ | Email associated with the API token |
| `api_token` | ✓ | Jira API token |
| `project_key` | ✓ | Target Jira project key |
| `issue_type` | ✓ | Issue type for created items (`Epic` recommended) |
| `priority_rank_field` | | Custom field ID for priority rank (create in Jira → Project settings → Fields) |

---

## External identity mapping

To ensure that Jira issues are assigned to the correct users, map Priorities.ai users to their Jira email addresses:

```bash
curl -X POST "$PAI_BASE/workspace/external-identities" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "priorities-user-uuid",
    "system": "jira",
    "external_id": "jira-user@example.com"
  }'
```

---

## Export trigger

The Jira connector triggers on `priority_list.approved`. You can also trigger a manual sync:

```bash
POST /v1/workspace/connectors/jira/sync
{
  "priority_list_id": "list-uuid"
}
```

---

## What gets created in Jira

Each item in the published list generates a Jira issue with:

- **Summary:** Item name
- **Description:** Item description + rationale from the decision record
- **Custom field (Priority Rank):** Rank in the published list (1 = highest)
- **Labels:** `priorities-ai-managed`, cycle name
- **Links:** Jira issue links for Package members and hard Dependencies

---

## Sync behavior

| Scenario | Behavior |
|----------|----------|
| Item already has a Jira key (via external identity mapping) | Updates the existing issue |
| Item is new | Creates a new Jira epic |
| Item rank changes in a new cycle | Updates the `Priority Rank` field |
| Item is removed from the list | Adds a comment to the Jira issue noting it is no longer in the active priority list |

---

## Guide: full end-to-end integration

[→ Integrate with Jira guide](/docs/guides/integrate-with-jira)
