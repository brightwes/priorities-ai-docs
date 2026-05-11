---
title: Idempotency — Priorities.ai
description: Idempotency key support for safe retries. Planned.
audience: Developers
status: planned
---

> **Note (Coming soon):** Idempotency key support is planned and not yet shipped. The guidance below describes the planned interface.

---

# Idempotency *(planned)*

Idempotency keys allow you to safely retry POST requests without creating duplicate resources. This is especially important for governance-critical operations — session publications, cycle transitions, and catchball acceptances — where a duplicate request could produce incorrect state.

---

## Planned interface

When idempotency ships, you will pass an `Idempotency-Key` header on POST requests:

```bash
curl -X POST "$PAI_BASE/sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: your-unique-key-here" \
  -d '{ "name": "Q3 Ranking", "cycle_id": "..." }'
```

The key can be any string up to 64 characters. Use a UUID or a content hash.

**Behavior:**
- First request with a given key: processed normally
- Subsequent requests with the same key within 24 hours: return the original response without re-processing
- After 24 hours: the key expires and the request is treated as new

---

## In the meantime

For operations where duplicate-request safety is critical:

1. **Check before creating.** For sessions and cycles, list existing resources before creating — `GET /v1/sessions?cycle_id=...` before `POST /v1/sessions`.
2. **State machine guards.** Published sessions cannot be published again (409 CONFLICT). Accepted proposals cannot be accepted again. The state machines provide natural idempotency at terminal states.
3. **Reports are immutable.** Report reads are inherently idempotent.

---

## What's next

- [API versioning](/docs/reference/api-versioning) — planned
- [Changelog](/docs/reference/changelog)
