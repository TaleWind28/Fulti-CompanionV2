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

const LandingBlock = z.object({
    type: z.literal('object'),
    objectives: z.array(z.string()),
    wiki: z.array(z.object({name:z.string(),link:z.string()})),
})

export const BlockSchema = z.discriminatedUnion('type', [
  TextBlock,
  ImageBlock,
  LandingBlock
]);

export const PageScheme = z.object({
  // id univoco (usato come documentId in Firestore e negli URL)
  id: z.number(),

  title: z.string().min(1).max(120),
  summary: z.string().max(280).optional(),
  coverImage: z.string().optional().nullable(),

  content: z.array(BlockSchema).default([]),
  tags: z.array(z.string().min(1).max(30)).max(20).default([]),

  ownerId: z.string().min(1), // impostato lato server
  visibility: PageVisibility.default('private'),
  status: PageStatus.default('draft'),

//   createdAt: z.number().int(),
//   updatedAt: z.number().int(),

  version: z.number().int().min(1).default(1)
});

export type Page = z.infer<typeof PageScheme>;
