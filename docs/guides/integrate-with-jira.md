---
title: Integrate with Jira — Priorities.ai
description: Complete end-to-end Jira integration — configure the connector, map external identities, subscribe to priority_list.approved, create epics.
audience: Developers
status: published
---

# Integrate with Jira

This guide shows you the complete end-to-end Jira integration: configure the connector, map user identities, subscribe to `priority_list.approved`, and create or update Jira epics with rank and rationale.

**Time:** ~25 minutes

**Prerequisites:**
- API key with `workspace:write`, `webhooks:write`, `reports:read` scopes
- Jira Cloud account with API access
- An HTTPS endpoint for webhook delivery

---

## Architecture

```
Priorities.ai                         Your service                      Jira
      │                                      │                            │
      │  priority_list.approved              │                            │
      │─────────────────────────────────────▶│                            │
      │  (webhook payload)                   │                            │
      │                                      │  Create/update epics       │
      │                                      │───────────────────────────▶│
      │                                      │  with rank + rationale     │
```

---

## Step 1 — Create a Jira API token

1. Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Create a new token and save it securely

---

## Step 2 — Configure the Jira connector

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
      "issue_type": "Epic"
    }
  }'
```

---

## Step 3 — Map external identities

For items that correspond to existing Jira issues, create external identity mappings:

```bash
# Map a Priorities.ai item to a Jira issue key
curl -X POST "$PAI_BASE/workspace/external-identities" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "item-uuid",
    "system": "jira",
    "external_id": "PROD-142"
  }'
```

Items without an external identity mapping will have a new Jira epic created on sync.

---

## Step 4 — Register the webhook

```bash
WEBHOOK_ID=$(curl -s -X POST "$PAI_BASE/webhooks" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jira Priority Sync",
    "url": "https://your-service.example.com/webhook/priorities",
    "events": ["priority_list.approved"],
    "secret": "your-webhook-secret"
  }' | jq -r '.data.id')
```

---

## Step 5 — Build the webhook handler

```javascript
const axios = require('axios');

const JIRA_BASE = 'https://your-org.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT = 'PROD';

const jiraAuth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

app.post('/webhook/priorities', async (req, res) => {
  // Validate bearer secret
  if (req.headers['authorization'] !== `Bearer ${process.env.PAI_WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const event = req.body;

  if (event.event !== 'priority_list.approved') {
    return res.status(200).json({ received: true });
  }

  res.status(200).json({ received: true }); // Respond immediately

  // Process asynchronously
  await syncToJira(event.data);
});

async function syncToJira(data) {
  console.log(`Syncing ${data.item_count} items to Jira for cycle ${data.cycle_id}`);

  for (const item of data.items) {
    await upsertJiraEpic(item, data.cycle_id);
  }
}

async function upsertJiraEpic(item, cycleId) {
  // Check for existing Jira key via external identity lookup
  // (in production, cache this — or use the connector's built-in sync)

  const epicData = {
    fields: {
      project: { key: JIRA_PROJECT },
      summary: item.item_name,
      issuetype: { name: 'Epic' },
      description: {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: `Priority Rank: ${item.rank}\nManaged by Priorities.ai | Cycle ID: ${cycleId}`
          }]
        }]
      },
      labels: ['priorities-ai-managed'],
      // Priority rank custom field — set yours here
      // customfield_10030: item.rank
    }
  };

  try {
    const response = await axios.post(
      `${JIRA_BASE}/rest/api/3/issue`,
      epicData,
      {
        headers: {
          'Authorization': `Basic ${jiraAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Created Jira epic ${response.data.key} for item ${item.item_id}`);
  } catch (err) {
    console.error(`Failed to create epic for item ${item.item_id}:`, err.response?.data);
  }
}
```

---

## Step 6 — Test end-to-end

1. Run a prioritization session in Priorities.ai (or use the quickstart)
2. Approve the priority list: in the app, go to the cycle and click "Approve list"
3. Check your service logs for the webhook receipt
4. Verify the Jira project for newly created or updated epics

---

## What's next

- [Jira integration reference](/integrations/systems-of-execution/jira) — all configuration options
- [Build a Slack notifier](/guides/build-a-slack-notifier) — notify your team when the list is published
- [Subscribe to decisions](/guides/subscribe-to-decisions) — handle more event types
