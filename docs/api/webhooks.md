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

Events are grouped by domain. Subscribe to any combination.

### Item events

| Event | When it fires |
|-------|--------------|
| `item.created` | An item is created via `POST /v1/items` |
| `item.updated` | An item is updated via `PATCH /v1/items/:id` |
| `item.deleted` | An item is deleted via `DELETE /v1/items/:id` |
| `items.bulk_imported` | A bulk upsert completes via `POST /v1/items/bulk` |

### Decision events

| Event | When it fires |
|-------|--------------|
| `decision.created` | A decision record is created via `POST /v1/decisions` |
| `decision.status_changed` | A decision's status changes via `PATCH /v1/decisions/:id/status` |

### Open question events

| Event | When it fires |
|-------|--------------|
| `open-question.created` | A question is posted via `POST /v1/open-questions` |
| `open-question.updated` | A question is updated via `PATCH /v1/open-questions/:id` |
| `open-question.deleted` | A question is deleted via `DELETE /v1/open-questions/:id` |
| `open-question.resolved` | A question is resolved via `POST /v1/open-questions/:id/resolve` |
| `open-question.reopened` | A resolved question is reopened via `POST /v1/open-questions/:id/reopen` |

### Outcome driver events

| Event | When it fires |
|-------|--------------|
| `outcome-driver.created` | An outcome driver is created via `POST /v1/outcome-drivers` |
| `outcome-driver.updated` | An outcome driver is updated via `PATCH /v1/outcome-drivers/:id` |
| `outcome-driver.deleted` | An outcome driver is deleted via `DELETE /v1/outcome-drivers/:id` |

### Catchball events

| Event | When it fires |
|-------|--------------|
| `catchball.proposal.returned` | A proposal is returned to the submitting team via `POST /v1/catchball/proposals/:id/return` |
| `catchball.accepted` | A Catchball loop reaches `accepted` state |

### Governance events

| Event | When it fires |
|-------|--------------|
| `session.published` | Session reaches `PUBLISHED` state |
| `cycle.transition` | Cycle changes phase |
| `priority_list.approved` | Published priority list ratified by Cycle Owner |
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

## Example payloads

### `item.created`

```json
{
  "event": "item.created",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T12:00:00Z",
  "data": {
    "id": "item-uuid",
    "title": "Improve onboarding flow",
    "description": "Reduce time-to-value for new users",
    "status": "active",
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T12:00:00Z",
    "updated_at": "2026-04-01T12:00:00Z"
  }
}
```

### `decision.created`

```json
{
  "event": "decision.created",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T14:00:00Z",
  "data": {
    "id": "decision-uuid",
    "title": "Deprioritize feature X in favor of infrastructure",
    "decision_kind": "manual",
    "decision_class": "tradeoff",
    "status": "active",
    "impact": "high",
    "rationale": "Engineering capacity is needed for Q3 infrastructure work.",
    "item_id": "item-uuid",
    "cycle_id": "cycle-uuid",
    "session_id": null,
    "workspace_id": "workspace-uuid",
    "created_at": "2026-04-01T14:00:00Z"
  }
}
```

### `catchball.proposal.returned`

```json
{
  "event": "catchball.proposal.returned",
  "workspace_id": "workspace-uuid",
  "timestamp": "2026-04-01T11:00:00Z",
  "data": {
    "proposal_id": "proposal-uuid",
    "loop_id": "loop-uuid",
    "cycle_id": "cycle-uuid",
    "returned_by": "user-uuid",
    "note": "Please revise to account for the Q3 engineering freeze in July."
  }
}
```

See [Webhook Payloads reference](/reference/webhook-payloads) for full schemas of all events.

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
    "events": ["item.created", "item.updated", "decision.created", "session.published"],
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

[Webhook payloads reference →](/reference/webhook-payloads)

---

## What's next

- [Guide: subscribe to decisions](/guides/subscribe-to-decisions)
- [Guide: integrate with Jira](/guides/integrate-with-jira)
- [Reference: webhook payloads](/reference/webhook-payloads)
