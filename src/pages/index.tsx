import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

// ── Task-based entry points (mirrors docs.stripe.com "Explore our guides") ──
const TASKS = [
  {
    href: '/start/quickstart',
    label: 'Run your first prioritization session',
  },
  {
    href: '/guides/run-headless-session',
    label: 'Run a session entirely via the API',
  },
  {
    href: '/guides/subscribe-to-decisions',
    label: 'Subscribe to decisions via webhooks',
  },
  {
    href: '/guides/integrate-with-jira',
    label: 'Integrate with Jira',
  },
  {
    href: '/guides/build-an-agent-with-mcp',
    label: 'Build on Priorities.ai with an AI agent',
  },
  {
    href: '/start/authentication',
    label: 'Set up API authentication',
  },
  {
    href: '/guides/build-a-slack-notifier',
    label: 'Push decisions to Slack',
  },
  {
    href: '/integrations/identity/okta',
    label: 'Configure Okta SSO',
  },
];

// ── Browse by area (mirrors "Browse by product") ──
const AREAS = [
  {
    heading: 'Prioritization logic',
    description: 'Cycles, sessions, tool sessions, and catchball — the mechanics of running a governed prioritization process end to end.',
    links: [
      { href: '/api/cycles', label: 'Cycles API' },
      { href: '/api/sessions', label: 'Sessions API' },
      { href: '/api/tool-sessions', label: 'Tool sessions' },
      { href: '/api/catchball', label: 'Catchball API' },
      { href: '/guides/run-headless-session', label: 'Run a headless session' },
    ],
    color: '#D4A017',
  },
  {
    heading: 'Item relationship graph',
    description: 'Typed, mutation-governed relationships between items. Dependency, contribution, decomposition — all auditable and queryable.',
    links: [
      { href: '/api/items', label: 'Items API' },
      { href: '/api/items-relationships', label: 'Relationships API' },
      { href: '/api/items-attributes', label: 'Attributes API' },
      { href: '/concepts/item-relationships', label: 'Relationship types' },
      { href: '/concepts/protection-rings', label: 'Protection rings' },
    ],
    color: '#3A7D56',
  },
  {
    heading: 'Decision traceability',
    description: 'Every priority queryable to its rationale. Governance events, audit events, and decision records — the permanent record.',
    links: [
      { href: '/api/decisions', label: 'Decisions API' },
      { href: '/api/governance-events', label: 'Governance events' },
      { href: '/api/audit-events', label: 'Audit events' },
      { href: '/guides/subscribe-to-decisions', label: 'Subscribe to decisions' },
      { href: '/concepts/decision-classes', label: 'Decision classes' },
    ],
    color: '#C0533A',
  },
  {
    heading: 'Integrations',
    description: 'Pre-built connectors for systems of record, execution, insight, identity, and AI agents.',
    links: [
      { href: '/integrations/systems-of-execution/jira', label: 'Jira' },
      { href: '/integrations/systems-of-record/salesforce', label: 'Salesforce' },
      { href: '/integrations/identity/okta', label: 'Okta' },
      { href: '/integrations/systems-of-insight/snowflake', label: 'Snowflake' },
      { href: '/integrations/ai-agents/mcp', label: 'MCP (AI agents)' },
    ],
    color: '#3D4B6F',
  },
  {
    heading: 'Webhooks & events',
    description: 'React to decisions in real time. Push priority changes to Jira, Slack, Snowflake, or any downstream system.',
    links: [
      { href: '/api/webhooks', label: 'Webhooks API' },
      { href: '/reference/webhook-payloads', label: 'Payload schemas' },
      { href: '/guides/build-a-slack-notifier', label: 'Build a Slack notifier' },
      { href: '/guides/pipe-decisions-to-snowflake', label: 'Pipe to Snowflake' },
    ],
    color: '#9BA5BC',
  },
  {
    heading: 'Reference',
    description: 'Error codes, rate limits, idempotency keys, API versioning, and the full changelog.',
    links: [
      { href: '/reference/errors', label: 'Error codes' },
      { href: '/reference/rate-limits', label: 'Rate limits' },
      { href: '/reference/idempotency', label: 'Idempotency' },
      { href: '/reference/api-versioning', label: 'API versioning' },
      { href: '/reference/changelog', label: 'Changelog' },
    ],
    color: '#6B7A96',
  },
];

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Documentation"
      description="Explore our guides and examples to build on Priorities.ai."
    >
      <main className={styles.main}>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.inner}>
            <h1 className={styles.heroH1}>Documentation</h1>
            <p className={styles.heroSub}>
              Explore our guides and integration recipes to build on the System of Decision.
            </p>
          </div>
        </section>

        {/* ── Task entry points ── */}
        <section className={styles.tasks}>
          <div className={styles.inner}>
            <ul className={styles.taskList}>
              {TASKS.map(task => (
                <li key={task.href} className={styles.taskItem}>
                  <Link href={task.href} className={styles.taskLink}>
                    {task.label}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
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
