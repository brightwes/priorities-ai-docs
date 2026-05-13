---
title: Subscribe to Decisions — Priorities.ai
description: React to session publications, priority list approvals, and Catchball acceptances in real time using webhooks.
audience: Developers
status: published
---

# Subscribe to decision events

Priorities.ai emits webhook events for every major governance action. This guide shows you how to:

1. Register a webhook endpoint
2. Receive and verify delivery
3. React to `session.published` and `priority_list.approved` events
4. Write decision data to your warehouse or analytics system

**Time:** ~20 minutes

**Prerequisites:**
- An API key with `webhooks:write` scope
- An HTTPS endpoint that can receive POST requests (use [ngrok](https://ngrok.com) for local development)

---

## The events you care about

| Event | When it fires | What it tells you |
|-------|--------------|------------------|
| `session.published` | Session transitions to `PUBLISHED` | A ranked list is ready. Decision class: `force_ranking`. |
| `priority_list.approved` | Cycle Owner ratifies the list | The organizational commitment is set. |
| `catchball.accepted` | Catchball proposal accepted | An alignment convergence occurred. Decision class: `convergence`. |

---

## Step 1 — Build a receiver

```javascript
// Node.js / Express example
const express = require('express');
const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.PAI_WEBHOOK_SECRET;

app.post('/webhook/priorities', (req, res) => {
  // Verify the bearer secret
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    console.error('Invalid webhook secret');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const event = req.body;
  console.log(`Received: ${event.event} at ${event.timestamp}`);

  // Route by event type
  switch (event.event) {
    case 'session.published':
      handleSessionPublished(event.data);
      break;
    case 'priority_list.approved':
      handlePriorityListApproved(event.data);
      break;
    case 'catchball.accepted':
      handleCatchballAccepted(event.data);
      break;
  }

  // Always respond 200 immediately — process async
  res.status(200).json({ received: true });
});

function handleSessionPublished(data) {
  console.log(`Session "${data.session_name}" published`);
  console.log('Rankings:', data.results.map(r => `${r.rank}. ${r.item_id}`).join(', '));
  // Sync to Jira, notify Slack, write to warehouse...
}

function handlePriorityListApproved(data) {
  console.log(`Priority list approved for cycle ${data.cycle_id}`);
  console.log(`${data.item_count} items committed`);
  // Create Jira epics, update roadmap tool...
}

function handleCatchballAccepted(data) {
  console.log(`Catchball loop ${data.loop_id} accepted`);
  console.log(`Decision: ${data.decision_id} (convergence)`);
}

app.listen(3000, () => console.log('Webhook receiver running on port 3000'));
```

---

## Step 2 — Expose your endpoint

For local development, use ngrok:

```bash
ngrok http 3000
# → Forwarding https://abc123.ngrok.io -> localhost:3000
```

For production, deploy your receiver behind a domain you control and serve HTTPS.

---

## Step 3 — Register the webhook

```bash
export PAI_BASE="https://<project>.supabase.co/functions/v1/api/v1"
export PAI_KEY="pk_live_..."

WEBHOOK_ID=$(curl -s -X POST "$PAI_BASE/webhooks" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Decision Event Subscriber",
    "url": "https://abc123.ngrok.io/webhook/priorities",
    "events": [
      "session.published",
      "priority_list.approved",
      "catchball.accepted"
    ],
    "secret": "your-webhook-secret-here"
  }' | jq -r '.data.id')

echo "Webhook registered: $WEBHOOK_ID"
```

---

## Step 4 — Test the connection

```bash
curl -s -X POST "$PAI_BASE/webhooks/$WEBHOOK_ID/test" \
  -H "Authorization: Bearer $PAI_KEY"
```

You should see a `workspace.updated` test event arrive at your endpoint within a few seconds.

---

## Step 5 — Publish a session to trigger the event

If you completed the [quickstart](/start/quickstart), publish the session you created:

```bash
curl -s -X POST "$PAI_BASE/sessions/your-session-id/transition" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to_state": "PUBLISHED"}'
```

Check your receiver logs:

```
Received: session.published at 2026-04-01T14:00:00.000Z
Session "Initiative Ranking" published
Rankings: 1. item-id-2, 2. item-id-1, 3. item-id-3
```

---

## Step 6 — Write decisions to your warehouse

The `session.published` event carries enough data to write a decision record to your analytics system:

```javascript
function handleSessionPublished(data) {
  const decisionRecord = {
    decision_id: data.decision_id,
    decision_class: data.decision_class,       // "force_ranking"
    session_id: data.session_id,
    session_name: data.session_name,
    cycle_id: data.cycle_id,
    ranked_at: new Date().toISOString(),
    results: data.results.map(r => ({
      item_id: r.item_id,
      rank: r.rank,
      score: r.score
    }))
  };

  // Write to your warehouse (Snowflake, BigQuery, Databricks, etc.)
  writeToWarehouse('priorities_decisions', decisionRecord);

  // Or write to Slack
  notifySlack(`#product-strategy`, 
    `*${data.session_name}* published.\n` +
    data.results.slice(0, 3).map(r => `${r.rank}. Item ${r.item_id} (score: ${r.score})`).join('\n')
  );
}
```

---

## Handling delivery failures

If your endpoint returns a non-2xx response, Priorities.ai retries up to 3 times with exponential backoff. If all retries fail, the event is marked as failed.

**Best practices:**

1. **Respond 200 immediately.** Do your processing asynchronously. If processing takes more than a few seconds, queue the event and process it in a background job.
2. **Be idempotent.** Your handler may receive the same event more than once. Use the `decision_id` or the event timestamp as a deduplication key.
3. **Log all events.** Even events you don't process yet. You may want the data later.

```javascript
// Idempotent handler with deduplication
const processedEvents = new Set();

app.post('/webhook/priorities', (req, res) => {
  // Validate secret...
  
  const event = req.body;
  const eventKey = `${event.event}:${event.data.session_id || event.data.list_id}`;

  if (processedEvents.has(eventKey)) {
    console.log('Duplicate event — skipping:', eventKey);
    return res.status(200).json({ received: true, duplicate: true });
  }

  processedEvents.add(eventKey);
  processEvent(event);
  res.status(200).json({ received: true });
});
```

---

## What's next

- [Webhook payloads reference](/reference/webhook-payloads) — full payload schemas
- [Webhooks API](/api/webhooks) — manage registrations
- [Integrate with Jira](/guides/integrate-with-jira) — use decision events to create Jira epics
- [Build a Slack notifier](/guides/build-a-slack-notifier) — send priority updates to Slack channels
