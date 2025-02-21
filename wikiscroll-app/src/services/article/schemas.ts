import { z } from "zod";

export const ArticleSchema = z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
    images: z.object({
        original: z.string(),
        thumbnail: z.string(),
    }),
    description: z.string(),
    coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }).nullable(),
    article_type: z.enum(['Other', 'Location'])
});

export type Article = z.infer<typeof ArticleSchema>;
