---
title: Webhooks API
description: Register endpoints to receive real-time event notifications from Priorities.ai.
sidebar_label: Webhooks API
sidebar_position: 8
audience: Developers
status: published
---

# Webhooks

Webhooks deliver real-time event notifications to your endpoints when significant governance events occur in Priorities.ai. React to session publications, cycle transitions, and priority list approvals without polling.

---

## Delivery model

- HTTPS POST to your registered URL
- `Content-Type: application/json`
- `X-Priorities-Event: <event-type>` header on every delivery
- `X-Priorities-Signature: sha256=<hmac>` header when a secret is configured (HMAC-SHA256 of the full JSON body)
- Retries: up to 3 attempts with exponential backoff (1 s, then 2 s) on non-2xx responses or network errors
- Every attempt is recorded in the delivery log

---

## Events

| Event | When it fires |
|-------|--------------|
| `session.published` | Session reaches `PUBLISHED` state |
| `cycle.transition` | Cycle changes phase |
| `priority_list.approved` | Published priority list ratified by Cycle Owner |
| `catchball.accepted` | Catchball proposal accepted (loop reaches `accepted`) |
| `catchball.returned` | Catchball proposal returned to submitting team |
| `workspace.updated` | Workspace settings changed |

---

## Payload envelope

All webhook payloads use this envelope:

```json
{
  "event": "session.published",
  "workspace_id": "...",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": { ... }
}
```

---

## Event payloads

### `session.published`

```json
{
  "event": "session.published",
  "workspace_id": "...",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "session_id": "session-uuid",
    "session_name": "Q3 Initiative Ranking",
    "cycle_id": "cycle-uuid",
    "decision_id": "decision-uuid",
    "decision_class": "force_ranking",
    "results": [
      {"item_id": "item-1", "rank": 1, "score": 87.5},
      {"item_id": "item-2", "rank": 2, "score": 74.0},
      {"item_id": "item-3", "rank": 3, "score": 45.0}
    ]
  }
}
```

### `cycle.transition`

```json
{
  "event": "cycle.transition",
  "workspace_id": "...",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "cycle_id": "cycle-uuid",
    "cycle_name": "Q3 2026 Prioritization",
    "from_phase": "planning",
    "to_phase": "execution",
    "actor_id": "user-uuid",
    "reason": "All tracks ready. Execution phase beginning."
  }
}
```

### `priority_list.approved`

```json
{
  "event": "priority_list.approved",
  "workspace_id": "...",
  "timestamp": "2026-04-02T09:00:00Z",
  "data": {
    "list_id": "list-uuid",
    "cycle_id": "cycle-uuid",
    "approved_by": "user-uuid",
    "decision_id": "decision-uuid",
    "items": [
      {"item_id": "item-1", "rank": 1},
      {"item_id": "item-2", "rank": 2},
      {"item_id": "item-3", "rank": 3}
    ]
  }
}
```

---

## Register a webhook

```
POST /v1/webhooks
```

**Scopes:** `webhooks:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **required** | Descriptive name |
| `url` | string | **required** | HTTPS endpoint URL |
| `events` | array | **required** | List of event types to receive |
| `secret` | string | | Signing secret. When set, deliveries include `X-Priorities-Signature: sha256=<hmac>` |

**Request:**

```bash
curl -X POST "$PAI_BASE/webhooks" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jira Priority Sync",
    "url": "https://your-service.example.com/webhook/priorities",
    "events": ["session.published", "priority_list.approved"],
    "secret": "your-bearer-secret-here"
  }'
```

**Response:** `201 Created` with webhook object including `id`.

---

## List webhooks

```
GET /v1/webhooks
```

**Scopes:** `webhooks:read`

---

## Delete a webhook

```
DELETE /v1/webhooks/:id
```

**Scopes:** `webhooks:write`

---

## Test a webhook

```
POST /v1/webhooks/:id/test
```

**Scopes:** `webhooks:write`

Sends a `test.ping` event to the registered URL. Use to verify connectivity and signature validation before going live.

---

## Receiving webhooks securely

Validate the `X-Priorities-Signature` header on every incoming webhook:

```javascript
// Node.js example (using crypto built-in)
const crypto = require('crypto');

app.post('/webhook/priorities', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-priorities-signature'];
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);
  console.log('Event received:', event.event, event.data);

  if (event.event === 'session.published') {
    syncResultsToJira(event.data.results);
  }

  res.status(200).json({ received: true });
});
```

---

## See full webhook payloads reference

[Webhook payloads reference →](/docs/reference/webhook-payloads)

---

## What's next

- [Guide: subscribe to decisions](/docs/guides/subscribe-to-decisions)
- [Guide: integrate with Jira](/docs/guides/integrate-with-jira)
- [Reference: webhook payloads](/docs/reference/webhook-payloads)
