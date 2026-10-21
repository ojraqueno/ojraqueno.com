---
name: oj-writing-style
description: >-
  Writes and rewrites OJ Raqueño blog posts in his established voice from the
  OJ Develops / ojraqueno.com archive. Use when drafting, editing, or rewriting
  posts, titles, descriptions, or when the user asks to write in his style.
---

# OJ Raqueño writing style

Source of truth: `src/content/posts/*.mdoc` (especially 2016–2018 essays). Do not copy the voice of `from-oj-develops-to-ojraqueno-com.mdoc` as it existed before the rewrite; that draft was AI.

## Voice

- Talk to a fellow developer. Use I / you / we. Not a keynote, not a changelog, not a résumé.
- Pedagogical: state the topic, explain it, then land the point. Assume the reader is smart but does not already share the thesis.
- Opinion comes from experience ("I find that", "I once experienced", "Recently I was looking at"). Do not invent anecdotes.
- Hedging is fine: probably, I think, I strongly believe. Avoid swagger and thought-leadership slogans.
- Slightly formal, complete sentences. Playful titles and the occasional :) are allowed. Slang, hype, and LinkedIn cadence are not.
- Bold a term on first definition. Italic for light emphasis (*not*, *my* site).
- Rhetorical questions as headings are native: "So Why Am I Not Using It?", "Is It Worth It?"

## Structure

1. Open with what the post is about, or a concrete scene the reader has lived ("You've seen it before…").
2. Walk through an example (code, a bug, a task list) *then* name the lesson.
3. Use `##` headings that say something, not "Overview" / "Key takeaways" / "What stays the same".
4. Bullets are for steps, examples, or symptoms — not the whole argument.
5. Close with the formula: "In this post I talked about X. We looked at Y." Then a short sign-off, often inviting a comment or pointing to a related post.

How-to posts often start: "Today I'm going to talk about…" / "Let's talk about a simple but important topic…"

## Frontmatter

- `description` is a real sentence (or two), not an em-dash résumé.
- Tags are lowercase topic words (`design`, `entity-framework`, `writing-code`), not marketing labels.
- Keep original `publishedAt` on migrated posts. Do not backdate new posts.

## Do

- Repeat a punchy sentence when it earns it ("The good thing about writing software is that you can do anything you like. The bad thing…").
- Show before/after code. Ask the reader what they notice.
- Link to an earlier post when it actually continues the thought.
- Name tools only when the reader needs them to follow. Explain *why*, not the stack for its own sake.
- Prefer "that is" / periods / commas over a chain of em dashes.

## Do not

- Product-changelog sections, "so this is the new home", "a steadier cadence aimed at…"
- Resume stacks in the lede (Astro, Keystatic, Cloudflare) unless the post is actually about that tooling.
- "In today's fast-paced world", "leverage", "surface" as a noun for a website, "unlock", "empower", "delve into" (except he *does* sometimes say "let's delve").
- Fragment sentences as design. He writes paragraphs.
- Outsource the opinion. If the thesis is not in the user's notes, stop and ask.
- Sanitize his voice into generic "clear professional English." Later posts (2018) are cleaner than 2014; follow the 2016–2018 essays, not an ESL stereotype and not a brand deck.

## Quick contrast

Bad (AI draft):

> I wrote for years as **OJ Develops** on Blogger. Free hosting, low friction — but as a job-hunting and portfolio surface it fights back.

Good (his voice):

> For years I wrote under the name **OJ Develops** on Blogger. It was free, it was easy to start, and for a long time that was enough.

Bad:

> ## What changes
> - Brand is my name, aligned with GitHub and LinkedIn
> - Look and feel we control

Good:

> I wanted a site that looked like *my* site — something I could point to from GitHub and LinkedIn without a second brand in the way.

## Reference posts

Read these before drafting if the shape is unclear:

- Essay: `the-tyranny-of-horizontal-architectures.mdoc`, `dont-make-me-think-about-your-code.mdoc`, `developer-mindset-software-as-system.mdoc`
- Opinion: `why-i-dont-use-repository-pattern-when.mdoc`, `the-good-and-bad-of-writing-software.mdoc`, `be-very-very-lazy-new-perspective-on.mdoc`
- How-to: `why-use-viewmodels.mdoc`, `libraries-and-frameworks.mdoc`, `some-tips-on-organizing-code.mdoc`
