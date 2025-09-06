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
  url: z.string(),
  alt: z.string().max(200).optional()
});

const LandingBlock = z.object({
    type: z.literal('object'),
    objectives: z.array(z.string()).default([]),
    wiki: z.array(z.object({name:z.string(),link:z.string()})).default([]),
    nextSessionAt: z.string().optional()
})

export const BlockSchema = z.discriminatedUnion('type', [
  TextBlock,
  ImageBlock,
  LandingBlock
]);

export type Block = z.infer<typeof BlockSchema>

export const PageScheme = z.object({
  // id univoco (usato come documentId in Firestore e negli URL)
  id: z.string(),

  title: z.string().min(1).max(120),
  summary: z.string().max(280).optional(),
  coverImage: z.string().optional().nullable(),

  content: z.array(BlockSchema).default([]),
  masterId:z.string(),
  ownerId: z.string().min(1), // impostato lato server
});

export type Page = z.infer<typeof PageScheme>;
