---
title: Rate Limits — Priorities.ai
description: 120 requests per 60-second window. Headers, backoff guidance, and bulk alternatives.
audience: Developers
status: published
---

# Rate Limits

**120 requests per 60-second rolling window** per API key.

---

## Response headers

Every API response includes:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1743508860
```

| Header | Value |
|--------|-------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |

---

## When you hit the limit

**Status:** `429 Too Many Requests`

**Error code:** `RATE_LIMITED`

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again after 2026-04-01T12:01:00Z.",
    "details": { "reset_at": "2026-04-01T12:01:00Z" }
  }
}
```

**Remedy:** Wait until the `reset_at` timestamp, then resume. Do not retry immediately — the limit is enforced per window, and retrying before reset will continue to return 429.

---

## Backoff strategy

For automations and integrations that may encounter 429s, implement exponential backoff:

```javascript
async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 429) {
        const resetAt = err.headers['x-ratelimit-reset'];
        const waitMs = (parseInt(resetAt) * 1000) - Date.now() + 100;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.max(waitMs, 1000)));
          continue;
        }
      }
      throw err;
    }
  }
}
```

---

## Bulk alternatives

If your integration needs to read many items, do not loop on `GET /v1/items/:id`. Use the reports endpoint:

```bash
# Up to 500 items per request
GET /v1/reports/items?per_page=500&page=1

# Or export as CSV for large sets
GET /v1/reports/items?per_page=500
Accept: text/csv
```

For event-driven workflows, use webhooks instead of polling session or cycle state:

```bash
# Register once — receive events when they happen
POST /v1/webhooks
{
  "events": ["session.published", "priority_list.approved"],
  "url": "https://your-endpoint.example.com/webhook"
}
```

---

## Rate limit scope

Rate limits are **per API key**. If you have multiple systems integrating with the same workspace, give each system its own API key. Each key gets its own 120/min window.

---

## Planned rate limit increases

High-volume enterprise use cases (bulk imports, warehouse syncs, large automated reporting pipelines) may require higher limits. Contact us to discuss.
