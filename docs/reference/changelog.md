---
title: API Changelog — Priorities.ai
description: Every API change, dated. No undocumented breaking changes.
audience: Developers
status: published
---

# API Changelog

Every significant change to the Priorities.ai API is documented here. Breaking changes are marked **[Breaking]**. New resources and fields are marked **[New]**.

This is a first-class document — not an afterthought. The difference between Stripe-comparable docs and aspirational ones is that Stripe never ships a change without documenting it.

---

## 2026-04-01 — Baseline v1

**[New]** Initial public API release at `/v1`.

Resources shipped:
- `GET /v1/health`
- Items: CRUD + relationships + attributes
- Cycles: CRUD + phase transition + tracks
- Sessions: CRUD + results + state transition
- Tool sessions: CRUD + responses + finalize
- Catchball: loops, proposals, threads, accept, reject, return
- Reports: sessions, cycles, items (JSON + CSV)
- Webhooks: register, list, delete, test
- Workspace: settings, members, external identities, connectors, API keys

**[New]** Webhook events: `session.published`, `cycle.transition`, `priority_list.approved`, `catchball.accepted`, `catchball.returned`, `workspace.updated`

**[New]** Decisions table: active with auto-recording on `session.published`, `criteria.finalized`, `priority_list.approved`, `catchball.accepted`

**[New]** MCP endpoint mirroring REST API — available at `/functions/v1/mcp`

---

## 2026-05-11 — Decisions, events, clarity tools, external IDs

**[New]** Decisions API: `GET /v1/decisions`, `GET /v1/decisions/:id`, `POST /v1/decisions`, `PATCH /v1/decisions/:id/status`

**[New]** Governance Events API: `GET /v1/governance-events` with filters for `event_type`, `actor_id`, `object_type`, `object_id`, `after`, `before`

**[New]** Audit Events API: `GET /v1/audit-events` and `GET /v1/items/:id/audit-events`

**[New]** Item relationships CRUD: `POST /v1/items/:id/relationships`, `DELETE /v1/items/relationships/:id`

**[New]** `external_id` field on items — stable ID from an external system (e.g. `JIRA-1234`). Unique per workspace. Queryable via `GET /v1/items?external_id=`.

**[New]** HMAC-SHA256 webhook signing — every delivery now includes `X-Priorities-Signature: sha256=<hmac>` when a `secret` is configured. Verify the signature instead of the raw bearer token.

**[New]** Catchball `reject` and `return` transitions are now RPC-backed with atomic governance event logging.

---

## Planned additions (not yet shipped)

These are on the roadmap. The `[Planned]` designation means the data is captured today; the public API surface is not yet available.

| Feature | Expected impact |
|---------|----------------|
| `Idempotency-Key` header support | New capability — no breaking changes |
| TypeScript SDK | New package — no API changes |
| Python SDK | New package — no API changes |
| Go SDK | New package — no API changes |
| SCIM `/v2/` endpoint | New endpoint — no breaking changes to REST API |
| Native Snowflake connector | New integration — no API changes |
| Native Workday connector | New integration — no API changes |
| Sandbox / test mode | New environment — no API changes |

---

## Versioning policy

The API is at `/v1`. Non-breaking additions happen continuously. Breaking changes require a 6-month deprecation notice and a migration path before the `/v1` endpoint is removed or changed.

See [API versioning](/reference/api-versioning) for the full policy.
