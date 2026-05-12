import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    // ── USER GUIDE ───────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'User guide',
      collapsed: false,
      items: [
        'user-guide/index',
        'user-guide/dashboard',
        'user-guide/tasks',
        'user-guide/search',
        'user-guide/strategy',
        'user-guide/clarity-tools',
        'user-guide/intake',
        'user-guide/items',
        'user-guide/relationships',
        'user-guide/cycles',
        'user-guide/tracks',
        'user-guide/sessions',
        'user-guide/catchball',
        'user-guide/priorities-and-plans',
        'user-guide/reports',
        'user-guide/settings',
      ],
    },

    // ── GET STARTED ─────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: [
        'start/quickstart',
        'start/core-concepts',
        'start/authentication',
        'start/sandbox',
        'start/sdks',
      ],
    },

    // ── CONCEPTS ────────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Concepts',
      collapsed: true,
      items: [
        'concepts/system-of-decision',
        'concepts/comparability-and-tracks',
        'concepts/item-relationships',
        'concepts/protection-rings',
        'concepts/decision-classes',
        'concepts/catchball-and-authority',
        'concepts/governance-vs-audit-events',
        'concepts/state-machines',
      ],
    },

    // ── GUIDES ──────────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/run-headless-session',
        'guides/subscribe-to-decisions',
        'guides/integrate-with-jira',
        'guides/ingest-from-workday',
        'guides/pipe-decisions-to-snowflake',
        'guides/build-a-slack-notifier',
        'guides/provision-with-scim',
        'guides/build-an-agent-with-mcp',
      ],
    },

    // ── API REFERENCE ────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'API reference',
      collapsed: true,
      items: [
        'api/index',
        'api/items/items',
        'api/items/items-classification',
        'api/items/items-relationships',
        'api/items/items-attributes',
        'api/items/items-activity',
        'api/cycles',
        'api/tracks',
        'api/sessions',
        'api/tool-sessions',
        'api/catchball',
        {
          type: 'category',
          label: 'Decisions & Events',
          link: { type: 'doc', id: 'api/events/decisions' },
          items: [
            'api/events/governance-events',
            'api/events/audit-events',
          ],
        },
        {
          type: 'category',
          label: 'Planning Layer',
          items: [
            'api/plan-cycles',
            'api/decision-rights',
            'api/stakeholder-pulses',
            'api/ost',
            'api/workflows',
          ],
        },
        {
          type: 'category',
          label: 'Strategy',
          link: { type: 'doc', id: 'api/strategies' },
          items: [
            'api/objectives',
            'api/goals',
            'api/desired-outcomes',
          ],
        },
        {
          type: 'category',
          label: 'Clarity Tools',
          items: [
            'api/clarity-tools/outcome-drivers',
            'api/clarity-tools/backplan',
            'api/clarity-tools/open-questions',
            'api/clarity-tools/methodology-connections',
            'api/clarity-tools/export',
          ],
        },
        'api/import',
        'api/reports',
        'api/webhooks',
        'api/workspace',
      ],
    },

    // ── INTEGRATIONS ─────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Integrations',
      collapsed: true,
      items: [
        'integrations/index',
        {
          type: 'category',
          label: 'Systems of execution',
          items: [
            'integrations/systems-of-execution/jira',
            'integrations/systems-of-execution/azure-devops',
            'integrations/systems-of-execution/asana',
            'integrations/systems-of-execution/linear',
          ],
        },
        {
          type: 'category',
          label: 'Systems of record',
          items: [
            'integrations/systems-of-record/salesforce',
            'integrations/systems-of-record/workday',
            'integrations/systems-of-record/servicenow',
          ],
        },
        {
          type: 'category',
          label: 'Systems of insight',
          items: [
            'integrations/systems-of-insight/snowflake',
            'integrations/systems-of-insight/databricks',
          ],
        },
        {
          type: 'category',
          label: 'Identity',
          items: [
            'integrations/identity/okta',
            'integrations/identity/entra-id',
            'integrations/identity/scim',
          ],
        },
        {
          type: 'category',
          label: 'AI agents',
          items: [
            'integrations/ai-agents/mcp',
          ],
        },
      ],
    },

    // ── REFERENCE ────────────────────────────────────────────────────────
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/errors',
        'reference/rate-limits',
        'reference/idempotency',
        'reference/webhook-payloads',
        'reference/api-versioning',
        'reference/changelog',
      ],
    },
  ],
};

export default sidebars;
