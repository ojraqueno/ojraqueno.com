import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const optionalUrl = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.string().url().optional(),
);

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.mdoc' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    githubRepo: optionalUrl,
    originalUrl: optionalUrl,
  }),
});

export const collections = { posts };
