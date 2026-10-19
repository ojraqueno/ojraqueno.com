# Deploy ojraqueno.com on Cloudflare Pages

## 1. GitHub (done when this repo is pushed)

Repo should be public or private on your GitHub account.

## 2. Create the Pages project

1. Sign up / log in at [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize Cloudflare for GitHub and select this repository
4. Build settings:
   - **Framework preset:** Astro (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave default)
   - **Environment variable:** `NODE_VERSION` = `22`
5. Save and deploy — you’ll get a `*.pages.dev` URL first

## 3. Point ojraqueno.com at Cloudflare (Namecheap)

**Recommended:** use Cloudflare DNS (full setup).

1. In Cloudflare, **Add a site** → enter `ojraqueno.com`
2. Choose the **Free** plan
3. Cloudflare shows two **nameservers** (e.g. `ada.ns.cloudflare.com`)
4. In [Namecheap](https://www.namecheap.com) → Domain List → **Manage** `ojraqueno.com` → **Nameservers** → **Custom DNS**
5. Paste Cloudflare’s two nameservers → Save  
   Propagation can take from minutes up to ~24–48 hours (often under an hour)
6. Back in Cloudflare, wait until the domain status is **Active**
7. Pages project → **Custom domains** → add `ojraqueno.com` and `www.ojraqueno.com`  
   Cloudflare will create the DNS records and issue HTTPS

### Alternative (keep Namecheap DNS)

Only if you don’t want to move nameservers: in Pages → Custom domains, follow Cloudflare’s instructions and add the exact A/CNAME records they show under Namecheap → **Advanced DNS**. Apex domains are harder this way; nameserver move is simpler.

## 4. After it works

- Visit `https://ojraqueno.com`
- Set LinkedIn / GitHub website to that URL
- Each push to `main` redeploys automatically
