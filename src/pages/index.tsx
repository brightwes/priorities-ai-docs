import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

// ── Task columns — mirrors Stripe's "Payments / Revenue / Developers" ──
const TASK_COLUMNS = [
  {
    heading: 'Get started',
    links: [
      { href: '/start/quickstart',    label: 'Run your first prioritization session' },
      { href: '/concepts/system-of-decision', label: 'Understand the System of Decision' },
      { href: '/start/authentication', label: 'Set up API authentication' },
    ],
  },
  {
    heading: 'Guides',
    links: [
      { href: '/guides/run-headless-session',     label: 'Run a session entirely via the API' },
      { href: '/guides/subscribe-to-decisions',   label: 'Subscribe to decisions via webhooks' },
      { href: '/guides/integrate-with-jira',      label: 'Integrate with Jira' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { href: '/start/sdks',                     label: 'Set up your development environment' },
      { href: '/guides/build-an-agent-with-mcp', label: 'Build with an AI agent (MCP)' },
      { href: '/start/quickstart',               label: 'API quickstarts' },
    ],
  },
];

// ── Browse by area ──
const AREAS = [
  {
    heading: 'Prioritization logic',
    description: 'Cycles, sessions, tool sessions, and catchball — the mechanics of running a governed prioritization process end to end.',
    links: [
      { href: '/api/cycles',                    label: 'Cycles API' },
      { href: '/api/sessions',                  label: 'Sessions API' },
      { href: '/api/tool-sessions',             label: 'Tool sessions' },
      { href: '/api/catchball',                 label: 'Catchball API' },
      { href: '/guides/run-headless-session',   label: 'Run a headless session' },
    ],
    color: '#D4A017',
  },
  {
    heading: 'Item relationship graph',
    description: 'Typed, mutation-governed relationships between items. Dependency, contribution, decomposition — all auditable and queryable.',
    links: [
      { href: '/api/items/items',                    label: 'Items API' },
      { href: '/api/items/items-relationships',      label: 'Relationships API' },
      { href: '/api/items/items-attributes',         label: 'Attributes API' },
      { href: '/concepts/item-relationships',  label: 'Relationship types' },
      { href: '/concepts/protection-rings',    label: 'Protection rings' },
    ],
    color: '#3A7D56',
  },
  {
    heading: 'Decision traceability',
    description: 'Every priority queryable to its rationale. Governance events, audit events, and decision records — the permanent record.',
    links: [
      { href: '/api/events/decisions',                 label: 'Decisions API' },
      { href: '/api/events/governance-events',         label: 'Governance events' },
      { href: '/api/events/audit-events',              label: 'Audit events' },
      { href: '/guides/subscribe-to-decisions', label: 'Subscribe to decisions' },
      { href: '/concepts/decision-classes',     label: 'Decision classes' },
    ],
    color: '#C0533A',
  },
  {
    heading: 'Integrations',
    description: 'Pre-built connectors for systems of record, execution, insight, identity, and AI agents.',
    links: [
      { href: '/integrations/systems-of-execution/jira',   label: 'Jira' },
      { href: '/integrations/systems-of-record/salesforce', label: 'Salesforce' },
      { href: '/integrations/identity/okta',               label: 'Okta' },
      { href: '/integrations/systems-of-insight/snowflake', label: 'Snowflake' },
      { href: '/integrations/ai-agents/mcp',               label: 'MCP (AI agents)' },
    ],
    color: '#3D4B6F',
  },
  {
    heading: 'Webhooks & events',
    description: 'React to decisions in real time. Push priority changes to Jira, Slack, Snowflake, or any downstream system.',
    links: [
      { href: '/api/webhooks',                     label: 'Webhooks API' },
      { href: '/reference/webhook-payloads',       label: 'Payload schemas' },
      { href: '/guides/build-a-slack-notifier',    label: 'Build a Slack notifier' },
      { href: '/guides/pipe-decisions-to-snowflake', label: 'Pipe to Snowflake' },
    ],
    color: '#9BA5BC',
  },
  {
    heading: 'Reference',
    description: 'Error codes, rate limits, idempotency keys, API versioning, and the full changelog.',
    links: [
      { href: '/reference/errors',         label: 'Error codes' },
      { href: '/reference/rate-limits',    label: 'Rate limits' },
      { href: '/reference/idempotency',    label: 'Idempotency' },
      { href: '/reference/api-versioning', label: 'API versioning' },
      { href: '/reference/changelog',      label: 'Changelog' },
    ],
    color: '#6B7A96',
  },
];

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Documentation"
      description="Explore our guides and integration recipes to build on the System of Decision."
      wrapperClassName={styles.homepageWrapper}
    >
      <main className={styles.main}>

        {/* ── Hero — split layout like docs.stripe.com ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroH1}>Documentation</h1>
              <p className={styles.heroSub}>
                Explore our guides and examples to build on the System of Decision.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/start/quickstart" className={styles.heroCta}>
                  Get started with Priorities.ai →
                </Link>
                <Link href="/start/core-concepts" className={styles.heroCtaSecondary}>
                  Explore all concepts
                </Link>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.mockPanel}>
                <div className={styles.mockPanelHeader}>
                  <span className={styles.mockDot} style={{ background: '#ff5f57' }} />
                  <span className={styles.mockDot} style={{ background: '#febc2e' }} />
                  <span className={styles.mockDot} style={{ background: '#28c840' }} />
                  <span className={styles.mockPanelTitle}>Decision record</span>
                </div>
                <pre className={styles.mockCode}>{`POST /v1/sessions/{id}/close

{
  "decision": "Fund OST milestone #3",
  "rationale": "4 of 5 sponsors approved",
  "cycle": "Q2-2026",
  "record_id": "dr_8xKmPqR..."
}`}</pre>
                <div className={styles.mockResponse}>
                  <span className={styles.mockStatus}>200 OK</span>
                  <span className={styles.mockMessage}>Decision recorded &amp; broadcast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Task entry points — 3 named columns like Stripe ── */}
        <section className={styles.tasks}>
          <div className={styles.tasksInner}>
            {TASK_COLUMNS.map(col => (
              <div key={col.heading} className={styles.taskCol}>
                <h2 className={styles.taskColHeading}>{col.heading}</h2>
                <ul className={styles.taskList}>
                  {col.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.taskLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Browse by area ── */}
        <section className={styles.browse}>
          <div className={styles.inner}>
            <h2 className={styles.browseHeading}>Browse by area</h2>
            <div className={styles.browseGrid}>
              {AREAS.map(area => (
                <div key={area.heading} className={styles.areaCard}>
                  <div className={styles.areaAccent} style={{ background: area.color }} />
                  <h3 className={styles.areaHeading}>{area.heading}</h3>
                  <p className={styles.areaDesc}>{area.description}</p>
                  <ul className={styles.areaLinks}>
                    {area.links.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} className={styles.areaLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
