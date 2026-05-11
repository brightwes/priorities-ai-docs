---
title: Snowflake Integration — Priorities.ai
description: Pipe the decision log, governance events, and published priority lists to Snowflake. Planned.
audience: Developers
status: planned
---

> **Note (Coming soon):** The Snowflake integration is planned and not yet shipped. The decision data is captured today. The warehouse export surface is on the roadmap.

---

# Snowflake *(planned)*

Export the Priorities.ai decision log, governance events, and published priority lists to Snowflake for cross-system reporting, executive dashboards, and compliance audits.

**Direction:** Export (decision data out)
**Tables planned for export:**

| Table | Contents |
|-------|----------|
| `pai_decisions` | Typed decision log (all auto + manual decisions) |
| `pai_governance_events` | Lifecycle event record for cycles, sessions, proposals |
| `pai_published_lists` | Each published priority list with full item rank data |
| `pai_session_results` | Session result records with scores and ranks |
| `pai_items` | Item snapshot at time of each list publication |

---

## Planned mechanism

The export will use Priorities.ai webhooks — `session.published` and `priority_list.approved` — to trigger incremental writes to Snowflake via a Snowpipe-compatible endpoint, or via direct connector configuration.

---

## In the meantime

Subscribe to `session.published` and `priority_list.approved` webhooks and write the event payloads to Snowflake using your existing ingestion infrastructure (Fivetran, Airbyte, a custom Lambda/Cloud Function, etc.).

See [Subscribe to decisions guide](/docs/guides/subscribe-to-decisions) and [Guide: pipe decisions to Snowflake](/docs/guides/pipe-decisions-to-snowflake) *(planned)*.
