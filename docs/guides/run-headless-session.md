---
title: Run a Headless Session — Priorities.ai
description: Create a cycle, configure a session with criteria and participants, run a tool session, finalize, and publish — entirely via the REST API.
audience: Developers
status: published
---

# Run a headless session

This guide shows you how to run a complete prioritization session entirely via API — no human interaction required in the UI. This is the integration pattern for:

- Automated cycle setup (bootstrapped from your project management or CRM data)
- AI-agent-driven facilitation
- Scheduled prioritization runs in CI/CD pipelines
- Testing and staging environments

**Time:** ~15 minutes

**Prerequisites:**
- API key with `items:write`, `cycles:write`, `sessions:write`, `tool_sessions:write`, `reports:read` scopes
- At least 3 existing items in your workspace (or created in this guide)

---

## Overview

```
1. Create items (or use existing ones)
2. Classify items (Track Cell assignment)
3. Create a cycle
4. Create a session with criteria
5. Lock criteria → CRITERIA_FINALIZED
6. Create a tool session
7. Submit participant responses
8. Finalize the tool session
9. Publish the session → PUBLISHED
10. Pull the session report
11. (Optional) Submit a Catchball proposal
```

---

## Step 1 — Create and classify items

```bash
export PAI_BASE="https://<project>.supabase.co/functions/v1/api/v1"
export PAI_KEY="pk_live_..."

# Create items
ITEM_1=$(curl -s -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unified billing portal",
    "description": "Self-serve billing management for enterprise customers",
    "category": "initiative"
  }' | jq -r '.data.id')

ITEM_2=$(curl -s -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Multi-workspace SSO",
    "description": "SAML/OIDC for enterprise accounts managing multiple workspaces",
    "category": "initiative"
  }' | jq -r '.data.id')

ITEM_3=$(curl -s -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API rate limit dashboard",
    "description": "Visibility into current usage vs. limits for API consumers",
    "category": "initiative"
  }' | jq -r '.data.id')

echo "Items: $ITEM_1, $ITEM_2, $ITEM_3"
```

---

## Step 2 — Attach RICE attributes

For a scored session, attach attribute frames before session creation:

```bash
for ITEM_ID in $ITEM_1 $ITEM_2 $ITEM_3; do
  curl -s -X PATCH "$PAI_BASE/items/$ITEM_ID/attributes" \
    -H "Authorization: Bearer $PAI_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "frames": [
        {"frame_type": "rice", "reach": 500, "impact": 2, "confidence": 80, "effort": 4}
      ]
    }'
done
```

---

## Step 3 — Create a cycle

```bash
CYCLE_ID=$(curl -s -X POST "$PAI_BASE/cycles" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q3 Infrastructure Initiatives",
    "description": "Headless API-driven cycle"
  }' | jq -r '.data.id')

echo "Cycle: $CYCLE_ID"
```

---

## Step 4 — Create a session with criteria

```bash
SESSION_ID=$(curl -s -X POST "$PAI_BASE/sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Initiative Ranking — Q3\",
    \"cycle_id\": \"$CYCLE_ID\",
    \"facilitator_id\": \"your-facilitator-user-id\",
    \"criteria_config\": {
      \"criteria\": [
        {\"name\": \"Customer Impact\", \"weight\": 3},
        {\"name\": \"Engineering Effort\", \"weight\": 2, \"invert\": true},
        {\"name\": \"Strategic Alignment\", \"weight\": 2}
      ]
    }
  }" | jq -r '.data.id')

echo "Session: $SESSION_ID"
```

---

## Step 5 — Lock the criteria

This auto-records a `selection` decision:

```bash
curl -s -X POST "$PAI_BASE/sessions/$SESSION_ID/transition" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to_state": "CRITERIA_FINALIZED"}'
```

```json
{"data": {"id": "...", "state": "CRITERIA_FINALIZED"}}
```

---

## Step 6 — Create a tool session

Use `weighted_scoring` for criteria-weighted ranking:

```bash
TOOL_SESSION_ID=$(curl -s -X POST "$PAI_BASE/tool-sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"tool_type\": \"weighted_scoring\",
    \"tool_name\": \"Weighted Criteria Scoring\",
    \"facilitator_id\": \"your-facilitator-user-id\",
    \"items\": [
      {\"id\": \"$ITEM_1\", \"name\": \"Unified billing portal\"},
      {\"id\": \"$ITEM_2\", \"name\": \"Multi-workspace SSO\"},
      {\"id\": \"$ITEM_3\", \"name\": \"API rate limit dashboard\"}
    ],
    \"participant_ids\": [\"participant-a\", \"participant-b\"],
    \"vote_mode\": \"hidden\"
  }" | jq -r '.data.id')

echo "Tool session: $TOOL_SESSION_ID"
```

---

## Step 7 — Submit participant responses

```bash
# Participant A
curl -s -X POST "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID/responses" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"participant_id\": \"participant-a\",
    \"results\": [
      {\"item_id\": \"$ITEM_1\", \"Customer Impact\": 8, \"Engineering Effort\": 5, \"Strategic Alignment\": 7},
      {\"item_id\": \"$ITEM_2\", \"Customer Impact\": 9, \"Engineering Effort\": 7, \"Strategic Alignment\": 9},
      {\"item_id\": \"$ITEM_3\", \"Customer Impact\": 5, \"Engineering Effort\": 3, \"Strategic Alignment\": 4}
    ],
    \"is_complete\": true
  }"

# Participant B — similar structure
curl -s -X POST "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID/responses" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"participant_id\": \"participant-b\",
    \"results\": [
      {\"item_id\": \"$ITEM_1\", \"Customer Impact\": 7, \"Engineering Effort\": 4, \"Strategic Alignment\": 8},
      {\"item_id\": \"$ITEM_2\", \"Customer Impact\": 8, \"Engineering Effort\": 6, \"Strategic Alignment\": 9},
      {\"item_id\": \"$ITEM_3\", \"Customer Impact\": 6, \"Engineering Effort\": 4, \"Strategic Alignment\": 5}
    ],
    \"is_complete\": true
  }"
```

---

## Step 8 — Reveal and finalize

```bash
# Reveal
curl -s -X PATCH "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phase": "revealed"}'

# Finalize
curl -s -X POST "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID/finalize" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Step 9 — Publish the session

This auto-records a `force_ranking` decision:

```bash
curl -s -X POST "$PAI_BASE/sessions/$SESSION_ID/transition" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to_state": "PUBLISHED"}'
```

---

## Step 10 — Pull the session report

```bash
curl -s "$PAI_BASE/reports/sessions/$SESSION_ID" \
  -H "Authorization: Bearer $PAI_KEY" | jq '.data.results'
```

Expected output:

```json
[
  {"item_id": "...", "item_name": "Multi-workspace SSO", "rank": 1, "score": 95.4},
  {"item_id": "...", "item_name": "Unified billing portal", "rank": 2, "score": 81.2},
  {"item_id": "...", "item_name": "API rate limit dashboard", "rank": 3, "score": 58.7}
]
```

---

## Step 11 (Optional) — Submit a Catchball proposal

If your cycle uses Catchball, submit the session result as a proposal to the authority loop:

```bash
# First, get the loop for this cycle
LOOP_ID=$(curl -s "$PAI_BASE/catchball/loops?cycle_id=$CYCLE_ID" \
  -H "Authorization: Bearer $PAI_KEY" | jq -r '.data[0].id')

# Submit proposal
curl -s -X POST "$PAI_BASE/catchball/proposals" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"loop_id\": \"$LOOP_ID\",
    \"submitter_id\": \"your-facilitator-user-id\",
    \"content\": {
      \"rationale\": \"Based on weighted scoring across 2 participants, Multi-workspace SSO ranked highest due to strong strategic alignment and high customer impact.\",
      \"ranked_items\": [
        {\"item_id\": \"$ITEM_2\", \"rank\": 1, \"rationale\": \"Highest strategic alignment score\"},
        {\"item_id\": \"$ITEM_1\", \"rank\": 2, \"rationale\": \"Strong customer impact, manageable effort\"},
        {\"item_id\": \"$ITEM_3\", \"rank\": 3, \"rationale\": \"Lower impact, smaller strategic contribution\"}
      ]
    }
  }"
```

---

## What's next

- [Subscribe to decisions](/guides/subscribe-to-decisions) — react to this session's publication event
- [Integrate with Jira](/guides/integrate-with-jira) — sync the ranked output to Jira epics
- [Catchball API](/api/catchball) — full authority exchange API
