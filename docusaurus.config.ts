import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Priorities.ai Docs',
  tagline: 'Prioritization infrastructure for the modern enterprise.',
  favicon: 'img/favicon.svg',

  url: 'https://docs.priorities.ai',
  baseUrl: '/',

  organizationName: 'priorities-ai',
  projectName: 'priorities-ai',

  future: {
    v4: true,
  },

  onBrokenLinks: 'warn',

  markdown: {
    // Treat .md files as standard Markdown (not MDX) so HTML comments
    // and other non-MDX syntax don't cause compile errors.
    format: 'detect',
    mermaid: false,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../website/content/docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/priorities-ai/priorities-ai/edit/main/',
          showLastUpdateTime: false,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social card
    image: 'img/og-card.png',

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Priorities.ai',
      logo: {
        alt: 'Priorities.ai',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/integrations',
          label: 'Integrations',
          position: 'left',
        },
        {
          href: 'https://priorities.ai',
          label: 'priorities.ai',
          position: 'right',
        },
        {
          href: 'https://priorities.ai/sign-up',
          label: 'Get started',
          position: 'right',
          className: 'navbar--cta',
        },
      ],
    },

    footer: {
      style: 'light',
      links: [
        {
          title: 'Get Started',
          items: [
            { label: 'Quickstart', to: '/start/quickstart' },
            { label: 'Core concepts', to: '/start/core-concepts' },
            { label: 'Authentication', to: '/start/authentication' },
            { label: 'SDKs', to: '/start/sdks' },
          ],
        },
        {
          title: 'API Reference',
          items: [
            { label: 'Overview', to: '/api' },
            { label: 'Items', to: '/api/items' },
            { label: 'Sessions', to: '/api/sessions' },
            { label: 'Webhooks', to: '/api/webhooks' },
          ],
        },
        {
          title: 'Integrations',
          items: [
            { label: 'Jira', to: '/integrations/systems-of-execution/jira' },
            { label: 'Salesforce', to: '/integrations/systems-of-record/salesforce' },
            { label: 'Okta', to: '/integrations/identity/okta' },
            { label: 'MCP (AI agents)', to: '/integrations/ai-agents/mcp' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'priorities.ai', href: 'https://priorities.ai' },
            { label: 'Changelog', to: '/reference/changelog' },
            { label: 'Errors', to: '/reference/errors' },
            { label: 'Rate limits', to: '/reference/rate-limits' },
          ],
        },
      ],
      copyright: `&copy; ${new Date().getFullYear()} Peak Priorities, Inc.`,
    },

    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'typescript', 'python', 'ruby'],
    },

    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
