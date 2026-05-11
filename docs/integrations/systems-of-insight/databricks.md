---
title: Databricks Integration — Priorities.ai
description: Pipe the decision log and priority outputs to Databricks. Planned.
audience: Developers
status: planned
---

> **Note (Coming soon):** The Databricks integration is planned. See [Snowflake](/docs/integrations/systems-of-insight/snowflake) for the same pattern.

---

# Databricks *(planned)*

Export decision log data to Databricks for analytical workloads, AI/ML pipelines built on decision history, and cross-system executive reporting.

**Direction:** Export
**Planned:** Delta Lake write via Unity Catalog, triggered by webhook events.

In the meantime, subscribe to `priority_list.approved` webhooks and write payloads to your Databricks landing zone.

[Subscribe to decisions guide →](/docs/guides/subscribe-to-decisions)
