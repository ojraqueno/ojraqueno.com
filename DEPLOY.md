# Deploy ojraqueno.com on Cloudflare

Cloudflare now steers new Git deploys through **Workers** (static assets via Wrangler), not the classic Pages “output directory” form. That is fine for this Astro site.

## Dashboard settings (Workers + Git)

| Field | Value |
| --- | --- |
| Project name | `ojraqueno-com` (or similar) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` (default is fine) |
| Path (advanced) | `/` |

**Output directory:** not in the UI — it lives in `wrangler.toml` as `[assets] directory = "./dist"`.

**Env var** (scroll to Advanced → Variable name / value):

| Name | Value |
| --- | --- |
| `NODE_VERSION` | `24` |

Then click **Deploy**.

## Custom domain (Namecheap → Cloudflare)

1. Cloudflare → **Add a site** → `ojraqueno.com` (Free plan)
2. Copy the two Cloudflare **nameservers**
3. Namecheap → Manage → **Nameservers** → **Custom DNS** → paste → Save
4. When the domain is **Active**, open the Worker → **Settings** / **Domains & Routes** (or Custom domains) → add `ojraqueno.com` and `www`

## Local deploy (optional)

```bash
npm run build
npx wrangler deploy
```

(Requires `wrangler login` once.)
