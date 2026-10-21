import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const POSTS_DIR = path.resolve('src/content/posts');
const STAGING_DIR = path.resolve('.r2-staging');
const MANIFEST_PATH = path.join(STAGING_DIR, 'manifest.json');
const UPLOADED_PATH = path.join(STAGING_DIR, 'uploaded.json');
const BUCKET = 'ojraqueno-images';
const PUT_DELAY_MS = 1500;
const MAX_RETRIES = 5;
const IMAGE_RE = /https:\/\/blogger\.googleusercontent\.com\/[^)\s"'\\]+/g;

const command = process.argv[2] ?? 'help';

function collectUrls() {
  const urls = new Set();
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.mdoc')) continue;
    const text = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    for (const match of text.matchAll(IMAGE_RE)) {
      urls.add(match[0].replace(/[).,]+$/, ''));
    }
  }
  return [...urls];
}

function keyFor(url) {
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 12);
  const rawName = decodeURIComponent(url.split('/').pop() || 'image');
  const safeName = rawName
    .toLowerCase()
    .replace(/\+/g, '-')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/\.{2,}/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'image';
  return `posts/${hash}-${safeName}`;
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }[ext] ?? 'application/octet-stream';
}

async function download() {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
  const urls = collectUrls();
  const manifest = {};
  let ok = 0;
  let failed = 0;

  for (const url of urls) {
    const key = keyFor(url);
    const dest = path.join(STAGING_DIR, key);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    manifest[url] = key;

    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      ok += 1;
      continue;
    }

    process.stdout.write(`GET ${key}\n`);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ojraqueno.com image migration' },
    });
    if (!response.ok) {
      console.error(`FAIL ${response.status} ${url}`);
      failed += 1;
      continue;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    ok += 1;
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`downloaded ${ok}, failed ${failed}, unique ${urls.length}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function loadUploaded() {
  if (!fs.existsSync(UPLOADED_PATH)) return new Set();
  const data = readJson(UPLOADED_PATH);
  const list = Array.isArray(data) ? data : data.uploaded ?? [];
  return new Set(list);
}

function saveUploaded(uploaded) {
  fs.writeFileSync(UPLOADED_PATH, `${JSON.stringify([...uploaded], null, 2)}\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function putObject(key, file) {
  execFileSync(
    'npx',
    [
      'wrangler',
      'r2',
      'object',
      'put',
      `${BUCKET}/${key}`,
      '--file',
      file,
      '--content-type',
      mimeFor(file),
      '--remote',
    ],
    { stdio: 'inherit', shell: true },
  );
}

async function upload() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('Run `node scripts/migrate-images-to-r2.mjs download` first.');
  }
  const manifest = readJson(MANIFEST_PATH);
  const uploaded = loadUploaded();
  saveUploaded(uploaded);

  let manifestChanged = false;
  for (const [url, key] of Object.entries(manifest)) {
    if (uploaded.has(key)) continue;
    const next = key.replace(/\.{2,}/g, '-');
    if (next === key) continue;
    const from = path.join(STAGING_DIR, key);
    const to = path.join(STAGING_DIR, next);
    if (fs.existsSync(from) && !fs.existsSync(to)) {
      fs.renameSync(from, to);
    }
    manifest[url] = next;
    manifestChanged = true;
    console.log(`renamed key ${key} -> ${next}`);
  }
  if (manifestChanged) {
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  }

  const keys = [...new Set(Object.values(manifest))];
  let newlyUploaded = 0;
  let failed = 0;

  for (const key of keys) {
    if (uploaded.has(key)) continue;
    const file = path.join(STAGING_DIR, key);
    if (!fs.existsSync(file)) {
      console.error(`missing ${file}`);
      failed += 1;
      continue;
    }

    let ok = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      process.stdout.write(`PUT ${key}${attempt > 1 ? ` (retry ${attempt}/${MAX_RETRIES})` : ''}\n`);
      try {
        putObject(key, file);
        uploaded.add(key);
        saveUploaded(uploaded);
        newlyUploaded += 1;
        ok = true;
        break;
      } catch (error) {
        const waitMs = Math.min(90_000, 5_000 * 2 ** (attempt - 1));
        console.error(`FAIL ${key}: ${error.message}`);
        if (attempt === MAX_RETRIES) break;
        console.error(`waiting ${waitMs / 1000}s before retry`);
        await sleep(waitMs);
      }
    }
    if (!ok) failed += 1;
    else await sleep(PUT_DELAY_MS);
  }

  console.log(`uploaded ${newlyUploaded} new, ${uploaded.size} total, failed ${failed}`);
}

function rewrite() {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '');
  if (!base) {
    throw new Error('Set R2_PUBLIC_BASE_URL to the public bucket URL (no trailing slash).');
  }
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('Run download first.');
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  let filesChanged = 0;
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.mdoc')) continue;
    const full = path.join(POSTS_DIR, file);
    const original = fs.readFileSync(full, 'utf8');
    let next = original;
    for (const [url, key] of Object.entries(manifest)) {
      next = next.split(url).join(`${base}/${key}`);
    }
    if (next !== original) {
      fs.writeFileSync(full, next);
      filesChanged += 1;
    }
  }
  console.log(`rewrote ${filesChanged} posts to ${base}`);
}

if (command === 'download') {
  await download();
} else if (command === 'upload') {
  await upload();
} else if (command === 'rewrite') {
  rewrite();
} else {
  console.log(`Usage:
  node scripts/migrate-images-to-r2.mjs download
  node scripts/migrate-images-to-r2.mjs upload
  R2_PUBLIC_BASE_URL=https://pub-....r2.dev node scripts/migrate-images-to-r2.mjs rewrite`);
}
