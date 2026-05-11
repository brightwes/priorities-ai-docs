---
title: MCP — AI Agent Integration — Priorities.ai
description: Native AI agent access via the Model Context Protocol. Priorities.ai as a tool in your AI agent's toolbox.
audience: Developers, AI engineers
status: published
---

# MCP — AI Agents

Priorities.ai exposes a Model Context Protocol (MCP) endpoint that mirrors the REST API. This allows any MCP-compatible AI agent to call Priorities.ai tools natively — without a custom HTTP integration layer.

**Status:** ✅ Shipped

---

## What MCP enables

With the MCP endpoint, an AI agent can:

- Create and populate items from external data sources
- Create a cycle, configure a session, and run a tool session programmatically
- Submit participant responses (simulated or synthesized)
- Finalize and publish a session
- Query the decision log and reports
- Register webhooks
- Manage workspace members and connectors

The MCP endpoint surface mirrors the REST API exactly. Everything you can do via REST, you can do via MCP tool call.

---

## Endpoint

```
https://<project>.supabase.co/functions/v1/mcp
```

Authentication: same Bearer API key as the REST API

---

## MCP tool examples

```python
# Create an item
{
  "tool": "priorities_ai_create_item",
  "arguments": {
    "name": "Unified observability platform",
    "description": "Consolidate metrics, logs, and traces under one pane of glass",
    "category": "initiative"
  }
}

# Create a cycle
{
  "tool": "priorities_ai_create_cycle",
  "arguments": {
    "name": "Q3 Infrastructure Ranking",
    "description": "Agent-driven prioritization cycle"
  }
}

# Run a dot voting session
{
  "tool": "priorities_ai_create_tool_session",
  "arguments": {
    "session_id": "...",
    "tool_type": "dot_voting",
    "items": [...],
    "participant_ids": ["agent-participant-1", "agent-participant-2"]
  }
}

# Publish session
{
  "tool": "priorities_ai_transition_session",
  "arguments": {
    "session_id": "...",
    "to_state": "PUBLISHED"
  }
}

# Get session report
{
  "tool": "priorities_ai_get_session_report",
  "arguments": {
    "session_id": "..."
  }
}
```

---

## Use cases

### Automated intake processing

An AI agent subscribes to a Slack channel or email inbox, extracts work requests, creates Priorities.ai items with structured metadata, and classifies them for the next cycle.

### Synthetic participant scoring

For automated triage sessions, the agent scores items against defined criteria using available signals (usage data, customer feedback, competitive analysis) and submits responses on behalf of a synthetic participant.

### Headless facilitation

An agent facilitates a complete prioritization cycle: creates the cycle, configures sessions, invites participants via API, collects responses, finalizes, and publishes — posting summaries to Slack at each step.

### Decision log query

An agent answers questions from executives like "why was item X ranked above item Y in Q3?" by querying the reports and decision log.

---

## Guide: build an agent with MCP

[→ Build an agent with MCP guide](/docs/guides/build-an-agent-with-mcp)

---

## Tool catalog

The full list of MCP tools mirrors the REST API endpoint surface. For the authoritative list:

```bash
# Get the MCP tool manifest
GET https://<project>.supabase.co/functions/v1/mcp/manifest
Authorization: Bearer pk_live_...
```
