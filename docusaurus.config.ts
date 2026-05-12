import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Priorities.ai Docs',
  tagline: 'Prioritization infrastructure for the modern enterprise.',
  favicon: 'img/favicon.svg',

  url: 'https://priorities-ai-docs.vercel.app',
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
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/priorities-ai/priorities-ai/edit/main/',
          showLastUpdateTime: false,
          breadcrumbs: true,
          // index.md is handled by src/pages/index.tsx (custom home, like docs.stripe.com)
          exclude: ['index.md'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-card.png',

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    // Search is provided by @easyops-cn/docusaurus-search-local (registered as plugin below)

    navbar: {
      title: 'Priorities.ai',
      logo: {
        alt: 'Priorities.ai',
        src: 'img/logo.svg',
        href: '/',
      },
      items: [
        {
          href: 'https://priorities.ai',
          label: 'Create account',
          position: 'right',
          className: 'navbar__link-muted',
        },
        {
          href: 'https://app.priorities.ai',
          label: 'Sign in',
          position: 'right',
          className: 'navbar__link-signin',
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

  } satisfies Preset.ThemeConfig,

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: false,
        searchBarPosition: 'left',
      },
    ],
  ],
};

export default config;
