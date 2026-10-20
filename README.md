# ojraqueno.com

Personal site for **OJ Raqueño** — software design and .NET writing, rebuilt from the old [OJ Develops](https://ojdevelops.blogspot.com) Blogger archive for portfolio use.

## Stack

- **Astro** — static site
- **Keystatic** — local admin UI for composing/editing posts (Markdoc)
- Content lives in git under `src/content/posts/`

Keystatic runs only during `npm run dev` so production builds stay fully static (no server needed).

## Commands

```bash
npm install
npm run dev      # site + Keystatic editor
npm run build    # static output in dist/
npm run preview
```

- Site: http://127.0.0.1:4321  
- Editor: http://127.0.0.1:4321/keystatic  

Edit posts in the Keystatic UI, save, then commit the `.mdoc` files like normal code.

## Content

- `CONTENT-PLAN.md` — 90-day topics and AI workflow  
- `MIGRATION.md` — how to bring Blogger posts over (keep original dates)

## Deploy

**Cloudflare Workers (static assets)** — see `DEPLOY.md`. Output dir is in `wrangler.toml`. Node version comes from `.node-version` (`24`); you can also set `NODE_VERSION=24` in the dashboard.

`astro.config.mjs` sets `site` to `https://ojraqueno.com`.

**Node:** Active LTS (24). Local install via nvm-windows: `nvm use 24.22.0`.
