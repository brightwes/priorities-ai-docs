---
title: SDKs — Priorities.ai
description: TypeScript, Python, and Go SDKs. Planned — install snippets are placeholders.
audience: Developers
status: planned
---

> **Note (Coming soon):** The Priorities.ai SDKs are planned and not yet shipped. The install snippets and usage examples below represent the intended interface. Until they ship, use the REST API directly — the API surface is stable and all examples in these docs use `curl` for this reason.

---

# SDKs *(planned)*

Official SDKs for TypeScript/Node.js, Python, and Go. Each SDK wraps the REST API with typed request/response objects, automatic retry, and ergonomic async patterns.

---

## TypeScript / Node.js *(planned)*

```bash
npm install @priorities-ai/sdk
# or
yarn add @priorities-ai/sdk
```

```typescript
import { PrioritiesAI } from '@priorities-ai/sdk';

const pai = new PrioritiesAI({
  apiKey: process.env.PAI_API_KEY,
  baseUrl: 'https://<project>.supabase.co/functions/v1/api',
});

// Create an item
const item = await pai.items.create({
  name: 'Improve onboarding flow',
  category: 'initiative',
});

// Create a cycle
const cycle = await pai.cycles.create({
  name: 'Q3 2026 Prioritization',
});

// Create a session
const session = await pai.sessions.create({
  cycleId: cycle.id,
  name: 'Initiative Ranking',
});

// Publish the session
await pai.sessions.transition(session.id, { toState: 'PUBLISHED' });

// Get the report
const report = await pai.reports.getSession(session.id);
console.log(report.results);
```

---

## Python *(planned)*

```bash
pip install priorities-ai
```

```python
from priorities_ai import PrioritiesAI

pai = PrioritiesAI(
    api_key=os.environ["PAI_API_KEY"],
    base_url="https://<project>.supabase.co/functions/v1/api"
)

# Create an item
item = pai.items.create(
    name="Improve onboarding flow",
    category="initiative"
)

# Create and run a session
cycle = pai.cycles.create(name="Q3 2026 Prioritization")
session = pai.sessions.create(cycle_id=cycle.id, name="Initiative Ranking")

# Publish
pai.sessions.transition(session.id, to_state="PUBLISHED")

# Report
report = pai.reports.get_session(session.id)
for result in report.results:
    print(f"{result.rank}. {result.item_id} (score: {result.score})")
```

---

## Go *(planned)*

```bash
go get github.com/priorities-ai/sdk-go
```

```go
package main

import (
    "context"
    "fmt"
    pai "github.com/priorities-ai/sdk-go"
)

func main() {
    client := pai.NewClient(pai.Config{
        APIKey:  os.Getenv("PAI_API_KEY"),
        BaseURL: "https://<project>.supabase.co/functions/v1/api",
    })

    ctx := context.Background()

    item, err := client.Items.Create(ctx, &pai.CreateItemInput{
        Name:     "Improve onboarding flow",
        Category: "initiative",
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Created item: %s\n", item.ID)
}
```

---

## In the meantime

Use the REST API directly. All examples in these docs use `curl` to ensure they work with no SDK dependency. The API surface is stable — code you write against `v1` today will not need to change when the SDKs ship.

[Quickstart →](/docs/start/quickstart)   [Authentication →](/docs/start/authentication)

---

## Notify me when SDKs ship

[Contact us →] to be added to the SDK early access list.
