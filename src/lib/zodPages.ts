import { z } from 'zod';

export const PageStatus = z.enum(['draft', 'published', 'archived']);
export const PageVisibility = z.enum(['public', 'private', 'unlisted']);

// Blocchi di contenuto
const TextBlock = z.object({
  type: z.literal('text'),
  text: z.string().max(20_000)
});

const ImageBlock = z.object({
  type: z.literal('image'),
  url: z.string().url(),
  alt: z.string().max(200).optional()
});

export const BlockSchema = z.discriminatedUnion('type', [
  TextBlock,
  ImageBlock
]);

export const PageScheme = z.object({
  // id univoco (usato come documentId in Firestore e negli URL)
  id: z.string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'usa solo minuscole, numeri e trattini'),

  title: z.string().min(1).max(120),
  summary: z.string().max(280).optional(),
  coverImage: z.string().url().optional().nullable(),

  content: z.array(BlockSchema).default([]),
  tags: z.array(z.string().min(1).max(30)).max(20).default([]),

  ownerId: z.string().min(1), // impostato lato server
  visibility: PageVisibility.default('private'),
  status: PageStatus.default('draft'),

  createdAt: z.number().int(),
  updatedAt: z.number().int(),

  version: z.number().int().min(1).default(1)
});

export type Page = z.infer<typeof PageScheme>;
