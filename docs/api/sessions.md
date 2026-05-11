---
title: Sessions API
description: Prioritization sessions — the execution units that produce ranked outputs.
sidebar_label: Sessions API
sidebar_position: 4
audience: Developers
status: published
---

# Sessions

A Session is the execution unit within a Cycle. It owns criteria, eligibility, tool configuration, and outputs. It produces an immutable result record when published.

Sessions are the boundary between the Frame (criteria, participants, pool) and the output (ranked results).

---

## Session state machine

```
DRAFT → CRITERIA_FINALIZED → RUN_COMPLETE → PUBLISHED
```

| State | Description |
|-------|-------------|
| `DRAFT` | Session created, not yet configured |
| `CRITERIA_FINALIZED` | Criteria locked — auto-records a `selection` decision |
| `RUN_COMPLETE` | At least one tool session has been finalized |
| `PUBLISHED` | Results locked — auto-records a `force_ranking` decision |

**State transitions are orthogonal to cycle phases.** Session publication does not advance the cycle phase. They are independent state machines.

All state transitions use `POST /v1/sessions/:id/transition`.

---

## List sessions

```
GET /v1/sessions
```

**Scopes:** `sessions:read`

**Query parameters:**

| Name | Type | Description |
|------|------|-------------|
| `cycle_id` | uuid | Filter by cycle |
| `state` | string | Filter by session state |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

---

## Create a session

```
POST /v1/sessions
```

**Scopes:** `sessions:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | | Session display name |
| `cycle_id` | uuid | | Owning cycle |
| `facilitator_id` | uuid | | Facilitating user |
| `criteria_config` | object | | Criteria configuration |
| `mode_config` | object | | Tool mode configuration |

**Request:**

```bash
curl -X POST "$PAI_BASE/sessions" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q3 Initiative Ranking",
    "cycle_id": "cycle-uuid",
    "facilitator_id": "user-uuid"
  }'
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "session-uuid",
    "workspace_id": "...",
    "name": "Q3 Initiative Ranking",
    "cycle_id": "cycle-uuid",
    "facilitator_id": "user-uuid",
    "state": "DRAFT",
    "created_at": "2026-04-01T12:00:00Z"
  },
  "meta": { ... }
}
```

---

## Get a session

```
GET /v1/sessions/:id
```

**Scopes:** `sessions:read`

---

## Update a session

```
PATCH /v1/sessions/:id
```

**Scopes:** `sessions:write`

---

## Get session results

```
GET /v1/sessions/:id/results
```

**Scopes:** `sessions:read`

Returns all result records for the session. Only available when `state` is `RUN_COMPLETE` or `PUBLISHED`.

**Response:**

```json
{
  "data": [
    {
      "id": "result-uuid",
      "session_id": "session-uuid",
      "item_id": "item-uuid",
      "rank": 1,
      "score": 87.5,
      "tool_type": "dot_voting",
      "created_at": "2026-04-01T12:05:00Z"
    },
    {
      "id": "result-uuid-2",
      "session_id": "session-uuid",
      "item_id": "item-uuid-2",
      "rank": 2,
      "score": 74.0,
      "tool_type": "dot_voting",
      "created_at": "2026-04-01T12:05:00Z"
    }
  ],
  "meta": { ... }
}
```

---

## Transition session state

```
POST /v1/sessions/:id/transition
```

**Scopes:** `sessions:write`

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to_state` | string | **required** | Target state |

**Valid transitions:**

| From | To | Auto-records |
|------|----|-------------|
| `DRAFT` | `CRITERIA_FINALIZED` | `selection` decision |
| `CRITERIA_FINALIZED` | `RUN_COMPLETE` | — |
| `RUN_COMPLETE` | `PUBLISHED` | `force_ranking` decision |

**Request (publish a session):**

```bash
curl -X POST "$PAI_BASE/sessions/session-uuid/transition" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to_state": "PUBLISHED"}'
```

**Response:**

```json
{
  "data": { "id": "session-uuid", "state": "PUBLISHED" },
  "meta": { ... }
}
```

---

## Delete a session

```
DELETE /v1/sessions/:id
```

**Scopes:** `sessions:write`

---

## Close a session

```
POST /v1/sessions/:id/close
```

**Scopes:** `sessions:write`

Explicit alias for publishing a session. Calls the `publish_session` RPC — identical governance path to `POST /v1/sessions/:id/transition` with `to_state: "PUBLISHED"`. Use whichever is clearer in your integration. Returns a `snapshot_id` referencing the immutable session report created.

---

## Participants

Effective session participants are the union of: cycle + track + session direct users + session groups.

### List participants

```
GET /v1/sessions/:id/participants
```

**Scopes:** `sessions:read`

Returns `{ direct: [...], groups: [...] }`.

### Add a participant

```
POST /v1/sessions/:id/participants
```

**Scopes:** `sessions:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | uuid | one of | Direct user participant |
| `group_id` | uuid | one of | Group participant |
| `role` | string | | `contributor` (default) or `facilitator` |
| `added_by` | uuid | **required** | Actor performing the addition |

### Remove a participant

```
DELETE /v1/sessions/:id/participants/:uid
```

**Scopes:** `sessions:write`

`:uid` is either a `user_id` or `group_id`.

---

## Messages

Persistent chat log for a live session. Messages are ordered chronologically and survive page reloads.

### List messages

```
GET /v1/sessions/:id/messages
```

**Scopes:** `sessions:read`

### Post a message

```
POST /v1/sessions/:id/messages
```

**Scopes:** `sessions:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | uuid | **required** | Sending user |
| `user_name` | string | | Display name (cached at write time) |
| `body` | string | **required** | Message text |

---

## Artifacts

Artifacts are attachments associated with a session's provenance — AI transcripts, video recordings, and linked documents. They appear in the session timeline and bubble up to the parent track and cycle provenance views.

### List artifacts

```
GET /v1/sessions/:id/artifacts
```

**Scopes:** `sessions:read`

### Attach an artifact

```
POST /v1/sessions/:id/artifacts
```

**Scopes:** `sessions:write`

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `artifact_type` | string | **required** | `ai_transcript`, `video_link`, or `document_link` |
| `title` | string | **required** | Display label in the session timeline |
| `url` | string | | External URL (for hosted transcripts, video recordings, or documents) |
| `content` | string | | Pasted transcript body (for `ai_transcript` without a hosted URL) |
| `notes` | string | | Optional annotation |
| `created_by` | uuid | | Author user ID |

**Request:**

```bash
curl -X POST "$PAI_BASE/sessions/session-uuid/artifacts" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "artifact_type": "ai_transcript",
    "title": "Session transcript — Q3 Initiative Ranking",
    "content": "Facilitator: Let us begin with the top-ranked item...",
    "notes": "Auto-generated by Scribe"
  }'
```

---

## Auto-recorded decisions

Publishing a session writes a decision record automatically:

| Transition | Decision class | Impact |
|-----------|----------------|--------|
| → `CRITERIA_FINALIZED` | `selection` | medium |
| → `PUBLISHED` | `force_ranking` | high |

These appear in `GET /v1/decisions` (coming soon) and are delivered via `session.published` webhook events.

---

## What's next

- [Tool sessions](/docs/api/tool-sessions) — run the actual prioritization tool within a session
- [Reports](/docs/api/reports) — pull session reports with full provenance
- [Subscribe to decision events](/docs/guides/subscribe-to-decisions) — react to session publication
