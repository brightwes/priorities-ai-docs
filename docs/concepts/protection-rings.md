---
title: Protection Rings — Priorities.ai
description: Three rings govern how items can be mutated when they are in active prioritization contexts.
audience: Developers
source-canon: DOCS_V4/00-canon/07-item-relationship-taxonomy-and-mutation-rules.md
status: published
---

# Protection Rings

When an item participates in a prioritization context — a track, an active session — it is subject to protection rules that govern what can change and how. These rules prevent mid-session mutations from silently invalidating an active comparison.

---

## The three rings

| Ring | Context | Mutation behavior |
|------|---------|------------------|
| **Ring 3** | Not in any track or active session | Fully mutable — any field can be changed without constraint |
| **Ring 2** | In a track but not in an active session | Comparability-affecting changes require approval and are audited |
| **Ring 1** | In an active session (locked comparison context) | Comparability-affecting changes require admin approval **plus** session disposition declaration |

**The most-restrictive-ring rule:** When an item participates in multiple contexts simultaneously (e.g., in a track and in an active session), the most restrictive ring applies.

---

## What counts as a comparability-affecting change

A change is comparability-affecting if it would meaningfully change how this item compares to other items in the current session or track. These include:

**Always comparability-affecting:**
- Item Category change
- Altitude change
- Any change to a scored attribute that is a criterion in an active session
- Adding or removing a Package membership
- Adding a hard Dependency to or from this item
- Lineage transformation (split, merge, supersede)

**Not comparability-affecting (Ring 2/1 mutation rules do not apply):**
- Name change (display only — does not affect comparison)
- Description change
- Status change to `archived` (treated as pool removal)
- Adding a `Related` relationship
- Adding an `informational` Dependency

---

## Ring 1: session disposition requirement

When a comparability-affecting change is requested on a Ring 1 item, the system requires an **admin-level approval** plus a **session disposition declaration** that specifies how the active session should proceed:

| Disposition | Meaning |
|-------------|---------|
| `continue_with_updated_data` | Proceed with the change applied — participants see the updated item in the session |
| `invalidate_and_restart` | Mark the session result as invalid and restart |
| `defer_until_session_closes` | Block the change until this session is published or cancelled |

The disposition choice is recorded in the governance events table with the requesting actor, approving admin, timestamp, and rationale.

> **This prevents:** A product manager changing an item's RICE score mid-session — after some participants have already submitted their scoring — without the system detecting and recording the change.

---

## Ring 2: approval requirement

For Ring 2 items, comparability-affecting changes require:
1. A human approval (track owner or workspace admin)
2. An audit record of what changed, who approved it, and when

No session disposition is required for Ring 2 because there is no active session to disrupt. But the approval and audit trail enforce that Track-level comparability changes are not silent.

---

## Ring 3: unrestricted

Ring 3 items have no mutation restrictions. Create, update, delete, add any relationship, change any attribute.

When you first create items via `POST /v1/items`, they are Ring 3. They become Ring 2 when associated with a track, Ring 1 when that track has an active session.

---

## API behavior

In Ring 1, a `PATCH /v1/items/:id` with a comparability-affecting field change returns:

```json
{
  "error": {
    "code": "RING_1_PROTECTED",
    "message": "This item is in an active session. A comparability-affecting change requires admin approval and a session disposition declaration.",
    "details": {
      "item_id": "...",
      "active_session_id": "...",
      "protection_ring": 1,
      "required_fields": ["admin_approval", "session_disposition"]
    }
  }
}
```

In Ring 2, the same request returns:

```json
{
  "error": {
    "code": "RING_2_PROTECTED",
    "message": "This item is in a track. A comparability-affecting change requires approval.",
    "details": {
      "item_id": "...",
      "track_id": "...",
      "protection_ring": 2,
      "required_fields": ["approval"]
    }
  }
}
```

To make a Ring 1 change, use the admin override endpoint:

```bash
POST /v1/items/:id/admin-override
{
  "change": { "category": "technical" },
  "session_disposition": "defer_until_session_closes",
  "rationale": "Category was misclassified at creation"
}
```

---

## What's next

- [State machines](/concepts/state-machines) — session and cycle state machines
- [Item relationships](/concepts/item-relationships) — the full relationship taxonomy
