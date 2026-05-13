---
title: Pipe Decisions to Snowflake — Priorities.ai
description: Write the decision log, published priority lists, and session results to Snowflake via webhooks. Planned native connector; manual pattern available today.
audience: Developers, data engineers
status: planned
---

> **Note:** The native Snowflake connector is planned. The webhook-based pattern below works today.

---

# Pipe Decisions to Snowflake

Get every Priorities.ai decision event, session result, and published priority list into your Snowflake data warehouse.

**Today:** Use webhooks + a serverless function to write events to Snowflake.
**When the Snowflake connector ships:** Direct configuration via the integrations panel.

---

## Pattern: Webhook → Snowflake via Snowpipe

```
Priorities.ai
  session.published / priority_list.approved
         ↓
  AWS Lambda / Cloud Function
         ↓
  S3 / GCS staging bucket
         ↓
  Snowpipe (auto-ingest)
         ↓
  Snowflake table
```

---

## Step 1 — Create Snowflake tables

```sql
-- Decision events table
CREATE TABLE IF NOT EXISTS priorities_decisions (
  decision_id        VARCHAR(36) NOT NULL PRIMARY KEY,
  decision_class     VARCHAR(50),
  decision_kind      VARCHAR(20),
  session_id         VARCHAR(36),
  cycle_id           VARCHAR(36),
  workspace_id       VARCHAR(36),
  ranked_at          TIMESTAMP_TZ,
  item_count         INTEGER,
  results            VARIANT,
  raw_payload        VARIANT,
  ingested_at        TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP
);

-- Priority list table
CREATE TABLE IF NOT EXISTS priorities_published_lists (
  list_id            VARCHAR(36) NOT NULL PRIMARY KEY,
  cycle_id           VARCHAR(36),
  cycle_name         VARCHAR(500),
  approved_by        VARCHAR(36),
  approved_at        TIMESTAMP_TZ,
  item_count         INTEGER,
  items              VARIANT,
  decision_id        VARCHAR(36),
  ingested_at        TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## Step 2 — Build the webhook handler

```javascript
const { createClient } = require('@snowflake-sdk/snowflake');

const crypto = require('crypto');

exports.handler = async (event) => {
  const rawBody = event.body;
  const body = JSON.parse(rawBody);

  // Validate HMAC-SHA256 signature
  const sig = event.headers['x-priorities-signature'] || event.headers['X-Priorities-Signature'] || '';
  const expected = 'sha256=' + crypto.createHmac('sha256', process.env.PAI_WEBHOOK_SECRET).update(rawBody).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const payload = body;

  if (payload.event === 'session.published') {
    await writeDecisionToSnowflake(payload.data);
  } else if (payload.event === 'priority_list.approved') {
    await writeListToSnowflake(payload.data);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

async function writeDecisionToSnowflake(data) {
  // Connect to Snowflake and insert
  const conn = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: 'PRIORITIES',
    schema: 'PUBLIC',
    warehouse: 'COMPUTE_WH'
  });

  await new Promise((resolve, reject) => conn.connect((err) => err ? reject(err) : resolve()));

  conn.execute({
    sqlText: `INSERT INTO priorities_decisions 
      (decision_id, decision_class, session_id, cycle_id, workspace_id, ranked_at, item_count, results, raw_payload)
      SELECT :1, :2, :3, :4, :5, :6, :7, PARSE_JSON(:8), PARSE_JSON(:9)`,
    binds: [
      data.decision_id,
      data.decision_class,
      data.session_id,
      data.cycle_id,
      data.workspace_id || '',
      data.ranked_at || new Date().toISOString(),
      data.results?.length || 0,
      JSON.stringify(data.results || []),
      JSON.stringify(data)
    ],
    complete: (err) => { if (err) console.error(err); }
  });
}
```

---

## Step 3 — Register the webhook

```bash
curl -X POST "$PAI_BASE/webhooks" \
  -H "Authorization: Bearer $PAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Snowflake Decision Warehouse",
    "url": "https://your-function.example.com/snowflake-sink",
    "events": ["session.published", "priority_list.approved"],
    "secret": "your-webhook-secret"
  }'
```

---

## Querying in Snowflake

```sql
-- Last 30 days of force-ranking decisions
SELECT 
  decision_id,
  session_id,
  cycle_id,
  ranked_at,
  item_count,
  f.value:item_id::string as item_id,
  f.value:rank::integer as rank,
  f.value:score::float as score
FROM priorities_decisions,
LATERAL FLATTEN(input => results) f
WHERE decision_class = 'force_ranking'
  AND ranked_at >= DATEADD(day, -30, CURRENT_TIMESTAMP)
ORDER BY ranked_at DESC, rank ASC;
```

---

## What's next

- [Snowflake integration reference](/integrations/systems-of-insight/snowflake) — native connector details (planned)
- [Subscribe to decisions](/guides/subscribe-to-decisions) — full webhook setup guide
