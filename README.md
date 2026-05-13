# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Access control (Vercel)

The production site can require **HTTP Basic Auth** via Edge middleware (`middleware.ts`). This is separate from app login (Supabase): use a **shared team user/password** you keep in Vercel env vars so it matches whatever you use for other internal-only surfaces.

On the **priorities-ai-docs** Vercel project, set:

| Variable | Required | Description |
|----------|----------|-------------|
| `DOCS_SITE_ACCESS_PASSWORD` | To enable the gate | If set, every request must authenticate. Omit locally and on Vercel to leave the site public. |
| `DOCS_SITE_ACCESS_USER` | No | Defaults to `priorities`. Must match the username the browser sends. |

After deploy, the browser prompts once per session for that user and password.

**Note:** Vercel’s dashboard **Deployment Protection → Password** is a different mechanism; you can use either that *or* this middleware—not both for the same behavior unless you intend layered gates. To mirror a password you already use in Vercel’s protection UI on another project, set `DOCS_SITE_ACCESS_USER` / `DOCS_SITE_ACCESS_PASSWORD` to the same values your team uses for that shared gate (or use only Vercel Password Protection on this project and remove `DOCS_SITE_ACCESS_PASSWORD`).
