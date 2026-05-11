---
title: Quickstart — Priorities.ai
description: Get a published priority list with full decision provenance in under 10 minutes.
audience: Developers
status: published
nav-order: 1
---

# Quickstart

Get a published priority list with full decision provenance in under 10 minutes, using only the REST API.

## Before you begin

You need:
- A Priorities.ai workspace (sign up at priorities.ai)
- An API key — create one in **Settings → API Keys** inside the app
- `curl` installed (or your HTTP client of choice)

## Find your base URL and create a key

Both are available in one place: open the app and go to **Settings → API Keys**.

- The **API base URL** is displayed at the bottom of that page with a copy button. It looks like:
  ```
  https://<your-project>.supabase.co/functions/v1/api/v1
  ```
- Click **Create Key** to generate a `pk_live_` key. The raw key is shown exactly once — copy it immediately.

## Test your connection

No authentication required for the health endpoint. Substitute your project's base:

```bash
curl https://<your-project>.supabase.co/functions/v1/api/health
```

```json
{
  "status": "ok",
  "version": "1",
  "timestamp": "2026-04-01T12:00:00.000Z"
}
```

All other endpoints require `Authorization: Bearer pk_live_<key>`. Set both as environment variables before running the rest of this guide:

```bash
export PAI_KEY="pk_live_your_key_here"
export PAI_BASE="https://<your-project>.supabase.co/functions/v1/api/v1"
```

Both values come from **Settings → API Keys** in the app.

---

## Step 1 — Create items

Items are the primary work objects. Create three candidates:

```bash
curl -s -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Improve onboarding flow", "category": "initiative"}' \
  | jq '.data.id'
# → "item-id-1"

curl -s -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Migrate authentication to SSO", "category": "initiative"}' \
  | jq '.data.id'
# → "item-id-2"

curl -s -X POST "$PAI_BASE/items" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Reduce API latency p99", "category": "technical"}' \
  | jq '.data.id'
# → "item-id-3"
```

**Response shape:**

```json
{
  "data": {
    "id": "a1b2c3d4-...",
    "workspace_id": "...",
    "name": "Improve onboarding flow",
    "category": "initiative",
    "status": "intake",
    "created_at": "2026-04-01T12:00:00Z"
  },
  "meta": { "workspace_id": "...", "request_id": "..." }
}
```

> **Note:** Items enter at `status: intake` by default. They are shaped and enriched before they participate in a cycle. For this quickstart we move them directly into a session.

---

## Step 2 — Create a cycle

A Cycle is the governance container for a prioritization effort.

```bash
export CYCLE_ID=$(curl -s -X POST "$PAI_BASE/cycles" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q3 2026 Prioritization",
    "description": "Quickstart demo cycle"
  }' | jq -r '.data.id')

echo "Cycle: $CYCLE_ID"
```

---

## Step 3 — Create a session

A Session is the execution unit that owns criteria, tool configuration, and outputs.

```bash
export SESSION_ID=$(curl -s -X POST "$PAI_BASE/sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Initiative Ranking\",
    \"cycle_id\": \"$CYCLE_ID\"
  }" | jq -r '.data.id')

echo "Session: $SESSION_ID"
```

---

## Step 4 — Create a tool session

A Tool Session runs a specific prioritization tool within the session context. Here we use `dot_voting` — each participant allocates a budget of votes across items.

```bash
export TOOL_SESSION_ID=$(curl -s -X POST "$PAI_BASE/tool-sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"tool_type\": \"dot_voting\",
    \"tool_name\": \"Initiative Vote\",
    \"facilitator_id\": \"your-user-id\",
    \"items\": [
      {\"id\": \"item-id-1\", \"name\": \"Improve onboarding flow\"},
      {\"id\": \"item-id-2\", \"name\": \"Migrate authentication to SSO\"},
      {\"id\": \"item-id-3\", \"name\": \"Reduce API latency p99\"}
    ],
    \"participant_ids\": [\"user-a\", \"user-b\"],
    \"vote_mode\": \"hidden\"
  }" | jq -r '.data.id')

echo "Tool session: $TOOL_SESSION_ID"
```

Tool session lifecycle: `collecting → revealed → finalized`

---

## Step 5 — Submit participant responses

Each participant submits their votes:

```bash
# Participant A
curl -s -X POST "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID/responses" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_id": "user-a",
    "results": [
      {"item_id": "item-id-1", "votes": 5},
      {"item_id": "item-id-2", "votes": 3},
      {"item_id": "item-id-3", "votes": 2}
    ],
    "is_complete": true
  }'

# Participant B
curl -s -X POST "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID/responses" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_id": "user-b",
    "results": [
      {"item_id": "item-id-1", "votes": 2},
      {"item_id": "item-id-2", "votes": 6},
      {"item_id": "item-id-3", "votes": 2}
    ],
    "is_complete": true
  }'
```

---

## Step 6 — Reveal and finalize the tool session

Advance the tool session from `collecting` to `revealed`, then to `finalized`:

```bash
# Reveal votes
curl -s -X PATCH "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phase": "revealed"}'

# Finalize (aggregates responses, records result)
curl -s -X POST "$PAI_BASE/tool-sessions/$TOOL_SESSION_ID/finalize" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Step 7 — Publish the session

Advancing the session to `PUBLISHED` locks the result, writes a `force_ranking` decision record, and makes the output available in reports.

```bash
curl -s -X POST "$PAI_BASE/sessions/$SESSION_ID/transition" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to_state": "PUBLISHED"}'
```

```json
{"data": {"id": "...", "state": "PUBLISHED"}, "meta": {...}}
```

> **What just happened:** Publishing the session automatically writes a `decisions` record with `decision_kind: auto`, `decision_class: force_ranking`, `source: session_published`. This is the first entry in the decision provenance trail for this cycle.

---

## Step 8 — Pull the session report

```bash
curl -s "$PAI_BASE/reports/sessions/$SESSION_ID" \
  -H "Authorization: Bearer $PAI_KEY" | jq '.data'
```

```json
{
  "session": {
    "id": "...",
    "name": "Initiative Ranking",
    "state": "PUBLISHED",
    "cycle_id": "..."
  },
  "results": [
    {"item_id": "item-id-2", "rank": 1, "score": 9.0},
    {"item_id": "item-id-1", "rank": 2, "score": 7.0},
    {"item_id": "item-id-3", "rank": 3, "score": 4.0}
  ],
  "generated_at": "2026-04-01T12:10:00Z"
}
```

You now have a published priority list with full provenance — from item creation through session execution through ranked output — accessible via API.

---

## What's next

- [Authentication and API keys](/docs/start/authentication) — scopes, key rotation, rate limits
- [Core concepts](/docs/start/core-concepts) — understand the three primitives before building deeper
- [Run a headless session](/docs/guides/run-headless-session) — a more complete end-to-end guide with criteria and catchball
- [Subscribe to decision events](/docs/guides/subscribe-to-decisions) — react to `session.published` and `priority_list.approved` in real time
- [Item relationships](/docs/api/items-relationships) — model dependencies, blocs, and aggregations between items
