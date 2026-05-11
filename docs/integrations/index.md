---
title: Integrations — Priorities.ai
description: Connect Priorities.ai to your Systems of Record, Systems of Execution, identity providers, and analytical warehouse.
audience: Developers, enterprise architects
status: published
---

# Integrations

Priorities.ai sits between your existing enterprise systems. This section documents every integration point — how to connect, what data flows, and the current status of each connector.

---

## Integration model

```
Signal in (from Systems of Record)
  ─→ enriches item pools, surfaces dependencies, tracks constraints

Commitment out (to Systems of Execution)
  ─→ creates epics/milestones, attaches rationale, syncs priority order

Identity (from identity providers)
  ─→ provisions users, manages roles, enforces authority lanes

Insight (to analytical warehouse)
  ─→ pipes decision log, governance events, published lists

AI agent access (via MCP)
  ─→ AI agents call Priorities.ai tools natively
```

---

## Integration catalog

### Systems of Record

Signal sources — data that informs what is prioritized and how.

| Integration | Direction | Status |
|-------------|-----------|--------|
| [Salesforce](/docs/integrations/systems-of-record/salesforce) | Import | ✅ Shipped |
| [Workday](/docs/integrations/systems-of-record/workday) | Import | Planned |
| [ServiceNow](/docs/integrations/systems-of-record/servicenow) | Import | Planned |

### Systems of Execution

Commitment targets — where prioritization outputs go.

| Integration | Direction | Status |
|-------------|-----------|--------|
| [Jira](/docs/integrations/systems-of-execution/jira) | Export | ✅ Shipped |
| [Azure DevOps](/docs/integrations/systems-of-execution/azure-devops) | Export | ✅ Shipped |
| [Asana](/docs/integrations/systems-of-execution/asana) | Export | ✅ Shipped |
| [Linear](/docs/integrations/systems-of-execution/linear) | Export | ✅ Shipped |

### Systems of Insight

Decision warehouse — where the decision log goes for analysis.

| Integration | Direction | Status |
|-------------|-----------|--------|
| [Snowflake](/docs/integrations/systems-of-insight/snowflake) | Export | Planned |
| [Databricks](/docs/integrations/systems-of-insight/databricks) | Export | Planned |

### Identity

User provisioning and SSO.

| Integration | Direction | Status |
|-------------|-----------|--------|
| [Okta](/docs/integrations/identity/okta) | SSO + provisioning | ✅ Shipped (SSO) / Planned (SCIM) |
| [Entra ID](/docs/integrations/identity/entra-id) | SSO + provisioning | ✅ Shipped (SSO) / Planned (SCIM) |
| [SCIM](/docs/integrations/identity/scim) | Provisioning | Planned |

### AI Agents

MCP-native access for AI agent tooling.

| Integration | Direction | Status |
|-------------|-----------|--------|
| [MCP](/docs/integrations/ai-agents/mcp) | Bidirectional | ✅ Shipped |

---

## Adding a connector

Connectors are configured in **Settings → Integrations** or via the workspace API:

```bash
GET  /v1/workspace/connectors              # List all connectors + configuration status
PATCH /v1/workspace/connectors/:id         # Configure a connector
```

[Workspace API →](/docs/api/workspace)
