---
title: Salesforce Integration — Priorities.ai
description: Ingest customer commitment data and opportunity signals from Salesforce to inform prioritization.
audience: Developers
status: published
---

# Salesforce

Import customer commitment data and opportunity signals from Salesforce to enrich item pools and surface customer-impact context during prioritization.

**Direction:** Import (signal in)
**Status:** ✅ Shipped

---

## What this integration does

When connected, the Salesforce connector:

1. Imports open opportunities and their associated feature requests as items or item attributes
2. Surfaces customer commitment signals as soft Dependencies on relevant items
3. Provides customer count and ARR context as attribute frames for scoring sessions

---

## Prerequisites

- Salesforce account with API access
- Connected App with OAuth 2.0 (recommended) or API username/password + security token

---

## Configuration

```bash
curl -X PATCH "$PAI_BASE/workspace/connectors/salesforce" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "instance_url": "https://your-org.salesforce.com",
      "client_id": "your-connected-app-client-id",
      "client_secret": "your-connected-app-client-secret",
      "refresh_token": "your-oauth-refresh-token",
      "opportunity_stage_filter": ["Closed Won", "Negotiation"]
    }
  }'
```

**Configuration fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `instance_url` | ✓ | Salesforce org URL |
| `client_id` | ✓ | Connected App consumer key |
| `client_secret` | ✓ | Connected App consumer secret |
| `refresh_token` | ✓ | OAuth refresh token |
| `opportunity_stage_filter` | | Opportunity stages to include in signals (default: all) |

---

## What signals are imported

| Salesforce object | Priorities.ai output |
|-------------------|---------------------|
| Opportunity custom field `Product_Feature_Request__c` | Creates or enriches an item with the feature request |
| Opportunity `Amount` × count | Adds `reach` and `impact` estimates to the item's RICE frame |
| Customer commitment data | Adds a soft Dependency relationship linking the item to the customer record |

---

## Identity mapping

Map Salesforce account IDs to Priorities.ai items for direct customer-to-item relationship tracking:

```bash
POST /v1/workspace/external-identities
{
  "user_id": "item-uuid",
  "system": "salesforce",
  "external_id": "salesforce-account-id"
}
```
