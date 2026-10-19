# Migrating posts from Blogger

## Best practice (what we're doing)

**Duplicate the content on this site and keep the original publish date.**

| Approach | Verdict |
| --- | --- |
| Excerpt + redirect to Blogger | Weak for portfolio — visitors leave your site; you don't own the presentation |
| Duplicate with original date + disclaimer + link | **Best** — you own the archive; chronology stays honest; Blogger remains the historical source |
| Republish with today's date | Misleading; avoid |

Each migrated post should have:

1. `publishedAt` set to the **Blogger date** (not the migration day)
2. `originalUrl` pointing at the Blogger permalink
3. The site shows: *This post first appeared on Blogger on {date}. View the original.*

Optional later: `updatedAt` if you revise the content substantially after migration.

## Export from Blogger

1. Blogger → Settings → Manage blog → **Back up content**
2. Download the XML export
3. Convert posts to Markdoc (`.mdoc`) under `src/content/posts/`

You can convert manually in Keystatic (`npm run dev` → http://127.0.0.1:4321/keystatic), or use a one-off script once the export is in hand.

## Priority order

Migrate **high-signal** posts first (design / architecture), then useful how-tos with repos, then leave or lightly archive dated tutorials.

**Strong candidates (from your archive):**

- Vertical slices / MediatR / horizontal architecture essays
- Adaptable Software
- Why Use ViewModels?
- Web API Without Controller *(sample already migrated)*
- ASP.NET MVC vs ASP.NET Core practical differences
- Azure + Svelte Static Web Apps deploy post
- Immutability / pure vs impure (good “how I think” pair)

**Lower priority:** generic “Getting Started with Python”-style intros unless you still want them for completeness.

## After migration

- Leave Blogger up as an archive for a while (inbound links)
- Prefer **ojraqueno.com** on LinkedIn, GitHub profile, and resume
- Leave Blogger up for old inbound links; new writing goes on the name domain
