---
title: Build a Slack Notifier — Priorities.ai
description: Send Slack notifications when sessions are published and priority lists are approved.
audience: Developers
status: published
---

# Build a Slack notifier

Send formatted Slack notifications to your product, engineering, or leadership channels when a priority session is published or a list is approved.

**Time:** ~20 minutes

**Prerequisites:**
- A Slack app with `chat:write` scope and an incoming webhook URL
- API key with `webhooks:write` scope

---

## Step 1 — Create a Slack app

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App → From scratch
2. Navigate to **Incoming Webhooks** → Activate → Add to workspace
3. Choose the target channel
4. Copy the **Webhook URL** (format: `https://hooks.slack.com/services/T.../B.../...`)

---

## Step 2 — Build the handler

```javascript
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const PAI_WEBHOOK_SECRET = process.env.PAI_WEBHOOK_SECRET;

app.post('/webhook/priorities', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${PAI_WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ received: true });

  const event = req.body;
  const message = buildSlackMessage(event);
  if (message) {
    await axios.post(SLACK_WEBHOOK, message);
  }
});

function buildSlackMessage(event) {
  switch (event.event) {
    case 'session.published':
      return buildSessionPublishedMessage(event.data);
    case 'priority_list.approved':
      return buildListApprovedMessage(event.data);
    case 'catchball.accepted':
      return buildCatchballMessage(event.data);
    default:
      return null;
  }
}

function buildSessionPublishedMessage(data) {
  const topItems = data.results
    .slice(0, 5)
    .map(r => `${r.rank}. ${r.item_id} _(score: ${r.score})_`)
    .join('\n');

  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 Session Published' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.session_name}* has been published.\n${data.results.length} items ranked.`
        }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Top items:*\n${topItems}` }
      },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `Cycle: ${data.cycle_id} | Decision: ${data.decision_id}`
        }]
      }
    ]
  };
}

function buildListApprovedMessage(data) {
  const items = data.items
    .slice(0, 10)
    .map(i => `${i.rank}. ${i.item_name}`)
    .join('\n');

  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '✅ Priority List Approved' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `The priority list for *${data.cycle_name}* has been approved.\n${data.item_count} items committed.`
        }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Committed items:*\n${items}` }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View in Priorities.ai' },
            url: `https://app.priorities.ai/cycles/${data.cycle_id}`
          }
        ]
      }
    ]
  };
}

function buildCatchballMessage(data) {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Catchball loop accepted* for cycle ${data.cycle_id}.\n_${data.rationale}_`
        }
      }
    ]
  };
}

app.listen(3000, () => console.log('Slack notifier running'));
```

---

## Step 3 — Register the webhook

```bash
curl -s -X POST "$PAI_BASE/webhooks" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Slack Notifier",
    "url": "https://your-service.example.com/webhook/priorities",
    "events": [
      "session.published",
      "priority_list.approved",
      "catchball.accepted"
    ],
    "secret": "your-webhook-secret"
  }'
```

---

## What's next

- [Subscribe to decisions](/docs/guides/subscribe-to-decisions) — full webhook handling guide
- [Integrate with Jira](/docs/guides/integrate-with-jira) — create Jira epics from the same events
