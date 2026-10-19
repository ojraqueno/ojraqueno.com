// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Keystatic's admin UI needs server routes. Enable it in `astro dev` only so
// `astro build` stays a pure static site (Cloudflare Pages / GitHub Pages).
const enableKeystatic =
  process.argv.includes('dev') || process.env.npm_lifecycle_event === 'dev';

// https://astro.build/config
export default defineConfig({
  site: 'https://ojraqueno.com',
  integrations: [
    react(),
    markdoc(),
    ...(enableKeystatic ? [keystatic()] : []),
  ],
  output: 'static',
});
