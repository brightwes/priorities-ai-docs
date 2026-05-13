---
title: Priorities.ai — Developer Documentation
description: Build on the System of Decision. API reference, guides, concepts, and integration recipes.
audience: Developers, architects, integration engineers
status: published
nav-order: 1
---

# Priorities.ai Developer Docs

Priorities.ai is the API for running auditable, cross-functional prioritization. It sits between your Systems of Record (Workday, Salesforce) and your Systems of Execution (Jira, Azure DevOps) as the capability layer that was always missing.

Three primitives. One consistent API. Full decision provenance on every output.

---

## The three primitives

| Primitive | What it does | Start here |
|-----------|--------------|-----------|
| **Prioritization Logic** | Create cycles, run sessions, collect tool responses, publish ranked outputs with full governance | [Items](/api/items/items) → [Cycles](/api/cycles) → [Sessions](/api/sessions) |
| **Item Relationship Graph** | Typed, mutation-governed, auditable relationship graph: Cluster, Package, Dependency, Prerequisite, Aggregation, Breakdown, Elaboration, Reframe, Lineage, Collection | [Item Relationships](/api/items/items-relationships) |
| **Decision Traceability** | Typed decision stream — every priority queryable to its rationale, criteria, and governance events | [Decisions](/api/events/decisions) (coming soon) |

---

## Get started in 10 minutes

The quickstart walks through the complete flow — from first item to published priority list — using only the REST API.

[→ Read the quickstart](/start/quickstart)

```bash
# Test your connection — no auth required
curl https://<project>.supabase.co/functions/v1/api/health

# {"status":"ok","version":"1","timestamp":"2026-04-01T12:00:00.000Z"}
```

---

## Navigate the docs

### [Get started](/start/quickstart)
Authentication, quickstart, core concepts, SDKs.

### [Concepts](/concepts/system-of-decision)
The system model explained for developers — comparability geometry, item relationships, state machines, decision classes, catchball authority.

### [Guides](/guides/run-headless-session)
Task-framed recipes: run a headless session, subscribe to decision events, integrate with Jira, build an MCP agent, provision with SCIM.

### [API reference](/api/index)
Every endpoint, every parameter, every response shape. One page per resource.

### [Integrations](/integrations/index)
Systems of Record (Workday, Salesforce), Systems of Execution (Jira, Azure DevOps), Identity (Okta, Entra ID), Insight (Snowflake), AI Agents (MCP).

### [Reference](/reference/errors)
Error codes, rate limits, webhook payloads, changelog.

---

## Infrastructure architecture

```
┌────────────────────┐       ┌──────────────────────────┐       ┌─────────────────────┐
│  SYSTEMS OF RECORD │       │   PRIORITIES.AI API       │       │ SYSTEMS OF EXECUTION│
│                    │──────▶│                           │──────▶│                     │
│  Workday           │signal │  POST /v1/items           │commit │  Jira               │
│  Salesforce        │  in   │  POST /v1/cycles          │  out  │  Azure DevOps       │
│  ServiceNow        │       │  POST /v1/sessions        │       │  Asana / Linear     │
└────────────────────┘       │  POST /v1/tool-sessions   │       └─────────────────────┘
                             │  GET  /v1/decisions       │
                             │  GET  /v1/reports/*       │
                             └───────────┬───────────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │                             │
               ┌──────────┴──────────┐     ┌───────────┴───────────┐
               │  IDENTITY           │     │  INSIGHT              │
               │  Okta, Entra, SCIM  │     │  Snowflake, Databricks│
               └─────────────────────┘     └───────────────────────┘
```

---

## What ships today

- REST API v1 — items, cycles, sessions, tool sessions, catchball, reports, webhooks, workspace, connectors, API keys
- Webhook events with bearer-secret delivery
- Connector registry — 30+ definitions (Jira, Salesforce, HubSpot, Zendesk, Intercom, Snowflake, Datadog, and more)
- MCP endpoint — mirrors the REST API for AI agent access
- Decisions table with manual + auto-recording
- Item relationship graph — 7 types, 26 mutation rules

> **Note (Coming soon):** `GET /v1/decisions`, `GET /v1/governance-events`, and `GET /v1/audit-events` are in the roadmap. TypeScript, Python, and Go SDKs are planned. [See the full roadmap →](/reference/changelog)

---

## Base URL

```
https://<project>.supabase.co/functions/v1/api
```

Version prefix: `/v1`

Full base path: `https://<project>.supabase.co/functions/v1/api/v1`

[Authentication →](/start/authentication)
