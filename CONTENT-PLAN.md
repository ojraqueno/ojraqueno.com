# ojraqueno.com — 90-day content plan

Target roles: **.NET backend** and **full-stack** (equal priority), open to staff/architect framing. Azure as a **developer** who ships on Azure, not as an admin specialty. Time budget: **a few hours per week**.

Cadence: **one shipped post every 2–3 weeks** (about 4–5 posts in 90 days), each ideally paired with a small GitHub repo. Quality over volume.

## Themes that match the portfolio

| Theme | Why it helps hiring |
| --- | --- |
| Design tradeoffs (.NET) | Shows senior judgment (vertical slices, boundaries, when *not* to abstract) |
| Full-stack delivery | End-to-end ownership: API + UI + deploy |
| Azure as a developer | App Service, Static Web Apps, storage, identity — things you *used* |
| AI-assisted engineering | Relevant in 2026; differentiate with process + tests, not hype |
| Adaptable / maintainable systems | Continuity with your strongest older essays |

## AI workflow (keep this)

1. **You** write the one-sentence thesis and the outline.
2. Scaffold the companion repo (you or AI); **you** run it and fix it.
3. Ask AI for a draft from *your* notes + *your* code.
4. Rewrite in your voice; cut generic filler.
5. Publish with real dates, tags, and repo link.

Do **not** outsource the opinion. Employers read for judgment.

## Days 1–14 — foundation

- [ ] Finish migrating the best Blogger posts (see `MIGRATION.md`)
- [ ] Pick a domain (`ojdevelops.dev` or reclaim `ojdevelops.com`)
- [ ] Deploy to Cloudflare Pages or GitHub Pages
- [ ] Link GitHub + LinkedIn to the new site
- [ ] Pin 3 “best of” posts on LinkedIn / resume

**Suggested first new post (already drafted):** *From OJ Develops to ojraqueno.com* (meta, ships credibility for the relaunch).

## Days 15–45 — prove the stack

Ship **two** post+repo pairs:

1. **“.NET minimal APIs + vertical slice starter”**  
   Small template: one feature folder, tests, README. Ties to your MediatR / slices history, updated for today’s templates.

2. **“Full-stack slice on Azure”**  
   Tiny API + simple frontend on Azure Static Web Apps / App Service. Focus on the deploy path and one tradeoff you made.

## Days 46–90 — staff/architect signal + AI angle

Ship **two** more:

3. **“Adaptable software, revisited”**  
   Short essay updating your 2023 ideas for AI-era teams: what still holds, what changes when codegen is cheap.

4. **“AI as a junior pair on a .NET feature”**  
   Walk through one real feature: prompt → review → tests → what you rejected. Companion repo with the final code *and* a short `NOTES.md` of decisions.

Optional fifth if time allows: a debugging / production story (auth, observability, a nasty Azure publish issue — you already write these well).

## What not to prioritize

- Generic “what is X” tutorials with no repo
- High-volume AI SEO posts
- Azure admin / certification dump content unless you actually want that role

## Definition of done for each post

- [ ] Clear thesis in the first paragraph  
- [ ] Original `publishedAt` (or today for new posts)  
- [ ] Tags + description  
- [ ] Companion repo when code is involved  
- [ ] You ran the code / checked the claims  
- [ ] Edited in your voice (AI draft is fine; AI-final is not)
