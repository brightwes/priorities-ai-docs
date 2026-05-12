---
title: Settings
description: Workspace configuration, access control, integrations, and developer tools.
sidebar_label: Settings
sidebar_position: 15
---

# Settings

Settings is where workspace administrators and users configure Priorities.ai to match their organization's structure, data model, and access policies. Settings are organized into six groups.

The Settings overview page (`/prioritization/settings`) shows all groups and individual settings pages you have permission to access.

---

## My Account

**Route:** `/prioritization/settings/my-account`

Personal settings that apply only to you.

### Pages in this group

| Page | Route | What it does |
|---|---|---|
| **My Profile** | `/settings/my-account/profile` | Edit your display name, avatar, and contact details |
| **My Connectors** | `/settings/my-account/connectors` | Manage your personal integration connections (e.g., your personal Jira or Miro auth) |
| **Customize Dashboard** | `/settings/my-account/home` | Choose which widgets appear on your Dashboard and in what order |

---

## People & Access

**Route:** `/prioritization/settings/people`

Manage who is in the workspace and what they can do.

### Pages in this group

| Page | Route | What it does |
|---|---|---|
| **Users** | `/settings/people/users` | View all workspace members, invite new users, deactivate accounts |
| **Groups** | `/settings/people/groups` | Create and manage user groups (used to assign permissions at scale) |
| **Roles** | `/settings/people/roles` | Define named roles with a set of permissions |
| **Permissions** | `/settings/people/permissions` | Configure which roles can perform which actions |
| **Policies** | `/settings/people/policies` | Set workspace-level access policies (e.g., who can create cycles) |
| **Identity** | `/settings/people/identity` | Configure SSO / SAML settings for enterprise identity providers |
| **Agents** | `/settings/people/agents` | Manage AI agent accounts and their permissions |
| **Scribe** | `/settings/people/scribe` | Configure the Scribe natural-language intake agent |
| **Classification Report** | `/settings/people/classification` | Audit report showing how users are classified and what access they have |

---

## Workspace Setup

**Route:** `/prioritization/settings/workspace`

Configure the fundamental structure of your workspace.

### Pages in this group

| Page | Route | What it does |
|---|---|---|
| **Configurations** | `/settings/workspace/configurations` | Top-level workspace settings (name, timezone, default behaviors) |
| **Planning Objects** | `/settings/workspace/planning-objects` | Define the types of planning artifacts used in the workspace |
| **Org Hierarchy** | `/settings/workspace/hierarchy` | Set up the organizational layers (strategic, portfolio, team) |
| **Workflows** | `/settings/workspace/workflows` | Configure item status workflows and transition rules |
| **Templates** | `/settings/workspace/templates` | Create reusable templates for cycles, sessions, and items |

---

## Content & Structure

**Route:** `/prioritization/settings/content`

Define the data model for items and the rules that govern their quality.

### Pages in this group

| Page | Route | What it does |
|---|---|---|
| **Attributes** | `/settings/content/attributes` | Create and configure item attributes (scoring dimensions, metadata fields) |
| **Attribute Permissions** | `/settings/content/attribute-permissions` | Control who can view or edit each attribute |
| **Value Scales** | `/settings/content/value-scales` | Define the scales used for scoring attributes (e.g., 1–5, T-shirt sizes, Fibonacci) |
| **Custom Fields** | `/settings/content/custom-fields` | Add free-form custom fields to items beyond the built-in attribute model |
| **Definition** | `/settings/content/definition` | Configure the "definition of ready" — what an item needs before it is ready for a session |
| **Readiness** | `/settings/content/readiness` | Configure readiness dimensions and thresholds |
| **Item Categories** | `/settings/content/categories` | Define the item classes (Feature, Initiative, Bug, etc.) and map them to track cells |
| **Idea Sources** | `/settings/content/idea-sources` | Configure the sources intake submissions can be tagged with |
| **Queues** | `/settings/content/queues` | Configure triage queues and their routing rules |
| **Archived Items** | `/settings/content/archived` | View and restore archived items |
| **Reports** | `/settings/content/reports` | Toggle which default reports are visible in the Reports Hub |

---

## Sync & Integrations

**Route:** `/prioritization/settings/sync`

Configure connections to external tools and manage data synchronization.

### Pages in this group

| Page | Route | What it does |
|---|---|---|
| **Connectors** | `/settings/sync/connectors` | Set up workspace-level integrations (Jira, Azure DevOps, Linear, Salesforce, etc.) |
| **Field Mappings** | `/settings/sync/field-mappings` | Map fields between Priorities.ai items and external records |
| **Entity Linker** | `/settings/sync/entity-linker` | Manually link Priorities.ai items to external records that were not auto-matched |
| **Sync Health** | `/settings/sync/health` | Monitor the overall health of active sync connections |
| **Sync Event Log** | `/settings/sync/event-log` | A detailed log of all sync events, errors, and conflicts |
| **Conflict Queue** | `/settings/sync/conflicts` | Review and resolve data conflicts between Priorities.ai and external systems |

### Supported integrations

Priorities.ai can connect to:
- **Project management tools** — Jira, Azure DevOps, Asana, Linear
- **CRM & HR** — Salesforce, Workday, ServiceNow
- **Data warehouses** — Snowflake, Databricks
- **Identity** — Okta, Microsoft Entra ID (Azure AD), SCIM-compatible providers
- **Collaboration** — Miro (for visual planning surfaces)

---

## Developer & Admin

**Route:** `/prioritization/settings/developer`

Advanced configuration for workspace administrators and technical users.

### Pages in this group

| Page | Route | What it does |
|---|---|---|
| **Modules** | `/settings/developer/modules` | Enable or disable feature modules (Strategy Canvas, Catchball, etc.) |
| **API Keys** | `/settings/developer/api-keys` | Create and manage API keys for the Priorities.ai REST API |
| **Feature Flags** | `/settings/developer/flags` | Enable experimental or early-access features |
| **Workspace Status** | `/settings/developer/status` | Health check for the workspace — database, sync connections, module states |
| **Data Diagnostics** | `/settings/developer/diagnostics` | Tooling for diagnosing data integrity issues |
| **Authorization Demo** | `/settings/developer/auth-demo` | A test harness for verifying permission configurations |
| **Platform Admin** | `/settings/platform-admin` | Superadmin tooling for managing multiple workspaces (visible only to platform admins) |

---

## Tips

- Changes to **Attributes**, **Item Categories**, and **Readiness** dimensions affect all items in the workspace immediately — plan changes carefully.
- **API Keys** are used to authenticate the Priorities.ai REST API. A key is shown only once at creation; store it in a secret manager.
- **Modules** control which sections of the sidebar appear. If a feature you expect is missing, check that its module is enabled here.
- The **Sync Event Log** is the first place to look when a sync connection appears to have stopped working.
