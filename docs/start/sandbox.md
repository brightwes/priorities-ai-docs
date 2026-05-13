---
title: Sandbox and Test Mode — Priorities.ai
description: Test workspaces, fixture data, and safe API experimentation. Planned.
audience: Developers
status: planned
---

> **Note (Coming soon):** Sandbox / test mode is planned and not yet shipped. The guidance below describes the intended interface. In the meantime, use a dedicated staging workspace.

---

# Sandbox *(planned)*

A sandbox environment allows you to safely develop and test your Priorities.ai integrations without affecting production data. Sandbox workspaces are isolated, support fixture data, and can be reset without consequence.

---

## What sandbox will provide

- **Isolated test workspace** — a workspace created for development, prefixed with `test_`
- **Test API keys** — keys prefixed `pk_test_` that only work against the test workspace
- **Fixture data** — pre-populated items, cycles, sessions, and published lists for common test scenarios
- **Reset endpoint** — `POST /v1/sandbox/reset` to wipe all test data and restart with fixtures
- **Identical API** — every endpoint that works in production works identically in sandbox

---

## Planned: test key format

```
pk_test_<64 hex chars>
```

Test keys are distinguished from live keys by the `pk_test_` prefix. A test key cannot access a production workspace, and a live key cannot access a test workspace.

---

## In the meantime: staging workspace

Until sandbox ships, the recommended approach is to use a separate staging workspace:

1. Create a new workspace for development
2. Create API keys in that workspace for development
3. Use the same API endpoints — the staging workspace is a full workspace with no sandboxing behavior, so test with care

```bash
# Staging workspace base URL (same pattern as production)
export PAI_STAGING="https://<staging-project>.supabase.co/functions/v1/api/v1"
export PAI_STAGING_KEY="pk_live_your_staging_key"

# Test connection
curl "$PAI_STAGING/../health"
```

**Staging workspace checklist:**

- Use a different workspace name so it's obvious in the dashboard
- Create dedicated test items, not copies of production items
- Do not configure production system connectors (Jira, Salesforce, etc.) in the staging workspace
- Keep staging API keys separate from production keys in your secret manager

---

## What's next

- [SDKs](/start/sdks) — planned TypeScript, Python, Go SDKs (also planned)
- [Quickstart](/start/quickstart) — build a working integration using the live API
