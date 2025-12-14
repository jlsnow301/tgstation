import * as z from 'zod';

const pageSchema = z.object({
  isMain: z.boolean(),
  id: z.string(),
  name: z.string(),
  acceptedTypes: z.record(z.string(), z.boolean()),
  unreadCount: z.number(),
  hideUnreadCount: z.boolean(),
  createdAt: z.number(),
});

export const chatpagesSchema = z.object({
  chatPages: z.record(z.string(), pageSchema),
});

export type Page = z.infer<typeof pageSchema>;
