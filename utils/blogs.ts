import * as contentful from 'contentful';

import { errorHandler } from '../middleware/errors';
import { parseAsDocument, parseAsString, safelyParse } from './parsers';
import { Blog, ListBlog } from '../types/blogs';

export async function listBlogs(limit: number, skip: number): Promise<ListBlog[]> {
    try {
        const client = contentful.createClient({
            space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
            accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
            environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
        });

        const res = await client.getEntries({
            content_type: 'blogPost',
            limit,
            skip,
            select: 'fields.title,fields.slug,fields.preview,fields.image',
        });

        if (res.items.length === 0) return [];

        return res.items.map(({ fields }) => {
            return {
                title: safelyParse(fields, 'title', parseAsString, ''),
                slug: safelyParse(fields, 'slug', parseAsString, ''),
                preview: safelyParse(fields, 'preview', parseAsString, null),
                image: {
                    title: safelyParse(fields, 'image.fields.title', parseAsString, ''),
                    description: safelyParse(fields, 'image.fields.description', parseAsString, ''),
                    url: safelyParse(fields, 'image.fields.file.url', parseAsString, ''),
                },
            };
        });
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch blog lists.');
    }

    return [];
}

export async function getBlog(limit: number, skip: number): Promise<Blog> {
    try {
        const client = contentful.createClient({
            space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
            accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
            environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
        });

        const res = await client.getEntries({
            content_type: 'blogPost',
            limit,
            skip,
            select: 'fields.title,fields.slug,fields.preview',
        });
        console.log('🚀 ~ file: blogs.ts:21 ~ listBlogs ~ res:', res.items);

        if (res.items.length === 0) return [];

        return res.items.map(({ fields }) => {
            return {
                title: safelyParse(fields, 'title', parseAsString, ''),
                slug: safelyParse(fields, 'slug', parseAsString, ''),
                preview: safelyParse(fields, 'preview', parseAsString, null),
                content: safelyParse(fields, 'content', parseAsDocument, null),
                banner: {
                    title: safelyParse(fields, 'title', parseAsString, ''),
                    description: safelyParse(fields, 'description', parseAsString, ''),
                    url: safelyParse(fields, 'file.url', parseAsString, ''),
                },
                youtubeEmbedId: safelyParse(fields, 'youtubeEmbedId', parseAsString, null),
            };
        });
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch blog lists.');
    }

    return [];
}
