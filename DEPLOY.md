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

## Blog images (Cloudflare R2)

Post images live in the `ojraqueno-images` R2 bucket (free tier: 10 GB). Staging copies are local-only in `.r2-staging/` (gitignored).

```bash
npx wrangler login
npx wrangler r2 bucket create ojraqueno-images
npx wrangler r2 bucket dev-url enable ojraqueno-images
node scripts/migrate-images-to-r2.mjs download
node scripts/migrate-images-to-r2.mjs upload
```

The current public `r2.dev` URL:

```bash
$env:R2_PUBLIC_BASE_URL = "https://pub-4554d0a898c2418f8c8a64458c42d6fa.r2.dev"
node scripts/migrate-images-to-r2.mjs rewrite
```

After `ojraqueno.com` is on Cloudflare DNS, attach a custom domain such as `images.ojraqueno.com` on the bucket (R2 → Settings → Custom Domains) and rewrite again with that base URL. `r2.dev` is fine until then; Cloudflare rate-limits it for production traffic.
