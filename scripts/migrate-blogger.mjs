import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const FEED_PATH =
  'C:/Users/ojraq/.cursor/projects/c-Users-ojraq-Development-ojdevelops/agent-tools/5d72c5c5-ec24-42a8-a068-b514a665112f.txt';
const OUT_DIR = path.resolve('src/content/posts');
const SKIP_SLUGS = new Set(['web-api-without-controller']);

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  bulletListMarker: '-',
});

turndown.addRule('preCode', {
  filter: (node) =>
    node.nodeName === 'PRE' &&
    node.firstChild?.nodeName === 'CODE',
  replacement: (_content, node) => {
    const code = node.firstChild;
    const language = (code.getAttribute('class') || '')
      .replace(/^brush:/i, '')
      .split(/\s+/)
      .find((item) => item && item !== 'code') ?? '';
    const text = code.textContent ?? '';
    return `\n\n\`\`\`${language}\n${text.replace(/\n$/, '')}\n\`\`\`\n\n`;
  },
});

function decode(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(html) {
  return decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function yamlValue(value) {
  const text = String(value);
  if (text === '') return '""';
  if (/[:#&*?|>!%@`'"{}\[\],\n]/.test(text) || text !== text.trim()) {
    return JSON.stringify(text);
  }
  return text;
}

function slugFromUrl(url) {
  const file = url.split('/').pop() ?? '';
  return file.replace(/\.html$/, '');
}

function tagSlug(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/c#/g, 'c-sharp')
    .replace(/f#/g, 'f-sharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function descriptionFromHtml(html) {
  const match = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  const source = match ? match[1] : html;
  const text = stripHtml(source);
  if (text.length <= 220) return text;
  return `${text.slice(0, 217).replace(/\s+\S*$/, '')}…`;
}

function companionRepo(html) {
  const matches = [
    ...html.matchAll(/https:\/\/github\.com\/ojraqueno\/[A-Za-z0-9._-]+/g),
  ].map((item) => item[0].replace(/[).,]+$/, ''));
  return matches[0];
}

function rewriteInternalLinks(markdown, pathToSlug) {
  return markdown.replace(
    /https?:\/\/(?:www\.)?ojdevelops\.(?:blogspot\.com|com)\/(\d{4}\/\d{2}\/[\w-]+)\.html/g,
    (all, pathPart) => {
      const slug = pathToSlug.get(pathPart);
      return slug ? `/blog/${slug}/` : all;
    },
  );
}

function uniqueSlug(url, used) {
  const base = slugFromUrl(url);
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  const parts = url.match(/\/(\d{4})\/(\d{2})\//);
  const extra = parts ? `${base}-${parts[1]}-${parts[2]}` : `${base}-2`;
  used.add(extra);
  return extra;
}

function pathKey(url) {
  const match = url.match(/\/(\d{4}\/\d{2}\/[\w-]+)\.html$/);
  return match?.[1];
}

function toFrontmatter({ title, description, publishedAt, tags, githubRepo, originalUrl }) {
  const lines = [
    '---',
    `title: ${yamlValue(title)}`,
    'description: >-',
    `  ${description.replace(/\n/g, ' ')}`,
    `publishedAt: ${publishedAt}`,
    'draft: false',
    'tags:',
    ...(tags.length ? tags.map((tag) => `  - ${yamlValue(tag)}`) : ['  []']),
  ];

  if (githubRepo) lines.push(`githubRepo: ${githubRepo}`);
  lines.push(`originalUrl: ${originalUrl}`);
  lines.push('---', '');
  return lines.join('\n');
}

const data = JSON.parse(fs.readFileSync(FEED_PATH, 'utf8'));
const entries = [...(data.feed.entry ?? [])].sort(
  (a, b) => a.published.$t.localeCompare(b.published.$t),
);

const usedSlugs = new Set(SKIP_SLUGS);
const pathToSlug = new Map();
for (const entry of entries) {
  const url = (entry.link ?? []).find((item) => item.rel === 'alternate')?.href;
  if (!url) continue;
  const key = pathKey(url);
  const slug = SKIP_SLUGS.has(slugFromUrl(url))
    ? slugFromUrl(url)
    : uniqueSlug(url, usedSlugs);
  if (key) pathToSlug.set(key, slug);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let skipped = 0;

for (const entry of entries) {
  const originalUrl = (entry.link ?? []).find((item) => item.rel === 'alternate')?.href;
  if (!originalUrl) {
    skipped += 1;
    continue;
  }

  const slug = pathToSlug.get(pathKey(originalUrl));
  if (!slug || SKIP_SLUGS.has(slugFromUrl(originalUrl))) {
    skipped += 1;
    continue;
  }

  const html = (entry.content?.$t ?? '')
    .replace(/<h3\b/gi, '<h2')
    .replace(/<\/h3>/gi, '</h2>');

  let markdown = turndown.turndown(html).trim();
  markdown = rewriteInternalLinks(markdown, pathToSlug).replace(/\n{3,}/g, '\n\n');

  const tags = (entry.category ?? [])
    .map((item) => item.term)
    .filter((term) => term && !term.includes('http'))
    .map(tagSlug)
    .filter(Boolean);

  const body =
    toFrontmatter({
      title: entry.title.$t.trim(),
      description: descriptionFromHtml(html) || entry.title.$t.trim(),
      publishedAt: entry.published.$t.slice(0, 10),
      tags,
      githubRepo: companionRepo(html),
      originalUrl,
    }) + markdown + '\n';

  fs.writeFileSync(path.join(OUT_DIR, `${slug}.mdoc`), body, 'utf8');
  written += 1;
}

console.log(`wrote ${written}, skipped ${skipped}`);
