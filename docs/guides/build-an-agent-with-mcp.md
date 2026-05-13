---
title: Build an Agent with MCP — Priorities.ai
description: Create an AI agent that uses Priorities.ai as a native tool via the Model Context Protocol.
audience: Developers, AI engineers
status: published
---

# Build an agent with MCP

This guide shows you how to build an AI agent that uses Priorities.ai natively via the Model Context Protocol (MCP). By the end, your agent will be able to:

- Ingest items from an external source
- Create a prioritization cycle and session
- Score items using synthesized signals
- Publish a session and return the ranked output

**Time:** ~30 minutes

**Prerequisites:**
- An MCP-compatible agent framework (Claude, OpenAI Assistants API, LangGraph, Autogen)
- API key with full scopes (or `items:write`, `cycles:write`, `sessions:write`, `tool_sessions:write`, `reports:read`)

---

## The MCP endpoint

```
https://<project>.supabase.co/functions/v1/mcp
Authorization: Bearer pk_live_<key>
```

The MCP endpoint mirrors the REST API. Every operation available via REST is available as an MCP tool call.

---

## Pattern 1 — Automated intake agent

An agent monitors a Slack channel or intake form, extracts work requests, creates Priorities.ai items, and classifies them.

```python
# Using the Anthropic Claude API with MCP tools
import anthropic

client = anthropic.Anthropic()

# Define the MCP connection
mcp_server = {
    "name": "priorities_ai",
    "url": "https://<project>.supabase.co/functions/v1/mcp",
    "headers": {
        "Authorization": f"Bearer {PRIORITIES_API_KEY}"
    }
}

# Process an intake request
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    mcp_servers=[mcp_server],
    messages=[{
        "role": "user",
        "content": """
        A customer submitted this feature request:
        "We need the ability to export our priority list to a CSV file 
        and share it with stakeholders who don't have access to the platform."

        Please:
        1. Create a Priorities.ai item for this request with appropriate metadata
        2. Classify it as category: feature
        3. Attach a RICE estimate based on the description
        4. Return the item ID
        """
    }]
)

print(response.content)
```

---

## Pattern 2 — Headless facilitation agent

The agent runs a complete prioritization session: creates the cycle, configures the session, scores items, and publishes.

```python
# Step-by-step headless facilitation
system_prompt = """
You are a prioritization facilitator for Priorities.ai. 
You have access to the Priorities.ai API via MCP tools.
When asked to run a prioritization session, you should:
1. Create a cycle for the given scope
2. Create a session within that cycle
3. Create a tool session with the provided items
4. Score items based on the provided signals and criteria
5. Finalize and publish the session
6. Return the ranked results

Always explain your scoring rationale briefly for each item.
"""

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8192,
    system=system_prompt,
    mcp_servers=[mcp_server],
    messages=[{
        "role": "user",
        "content": """
        Run a dot-voting-style prioritization for these items:
        
        Items:
        - "Onboarding flow redesign" (item_id: abc-123)
        - "API rate limiting dashboard" (item_id: def-456)
        - "Multi-workspace SSO" (item_id: ghi-789)
        
        Signals to use for scoring:
        - Onboarding flow: 3 recent customer complaints, 40% trial-to-paid conversion rate
        - API rate limiting: 12 developer requests in last month, high strategic value
        - SSO: 2 enterprise deals blocked on this feature, high ARR impact
        
        Target cycle: Q3 Infrastructure
        Facilitator ID: your-user-uuid
        
        Return the final ranked list.
        """
    }]
)
```

---

## Pattern 3 — Decision query agent

The agent answers questions about past prioritization decisions.

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    system="You help executives understand prioritization decisions using Priorities.ai data.",
    mcp_servers=[mcp_server],
    messages=[{
        "role": "user",
        "content": """
        A board member asked: "Why was the API rate limiting dashboard prioritized 
        above the onboarding flow in Q3?"
        
        Please look up the relevant session and decision records and provide
        a clear, evidence-based answer.
        """
    }]
)
```

---

## Available MCP tools

The full tool list is available from the manifest:

```bash
GET https://<project>.supabase.co/functions/v1/mcp/manifest
Authorization: Bearer pk_live_...
```

Key tools:
- `priorities_ai_create_item`, `priorities_ai_update_item`, `priorities_ai_list_items`
- `priorities_ai_create_cycle`, `priorities_ai_transition_cycle_phase`
- `priorities_ai_create_session`, `priorities_ai_transition_session`
- `priorities_ai_create_tool_session`, `priorities_ai_submit_response`, `priorities_ai_finalize_tool_session`
- `priorities_ai_get_session_report`, `priorities_ai_get_cycle_report`
- `priorities_ai_submit_catchball_proposal`, `priorities_ai_accept_proposal`

---

## Security considerations

- Create a dedicated API key with minimum required scopes for your agent
- For agents that submit Catchball proposals, the `submitter_id` must be a real workspace user with the appropriate role — the RPC enforces the authority model
- For headless sessions where the "participants" are synthetic, use agent-created user records with clear naming (`agent-participant-1`, etc.)
- Log all agent tool calls for auditability

---

## What's next

- [MCP integration reference](/integrations/ai-agents/mcp) — full tool catalog
- [Run a headless session guide](/guides/run-headless-session) — the same flow via REST API
- [Catchball API](/api/catchball) — authority model for agent-submitted proposals
