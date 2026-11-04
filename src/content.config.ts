import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const posts = defineCollection({
    loader: glob({pattern: '**/*.mdx', base: './src/data/posts'}),
    schema: z.object({
        number: z.int(),
        title: z.string(),
        description: z.string().optional(),
        author: z.enum(['Julien']).optional().default('Julien'),
        date: z.coerce.date(),
        label: z.enum(['DEV', 'MISC']).optional().default('MISC'),
        status: z.enum(['draft', 'published']).optional()
    }),
});

export const collections = {posts};
