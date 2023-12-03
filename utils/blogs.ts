import * as contentful from 'contentful';
import { DateTime } from 'luxon';

import { errorHandler } from '../middleware/errors';
import { parseAsDocument, parseAsNumber, parseAsString, safelyParse } from './parsers';
import { Blog, Blogs } from '../types/blogs';

const DEFAULT_BLOGS = {
    total: 0,
    blogs: [],
};

export async function listBlogs(limit: number, skip: number, q: string | null): Promise<Blogs> {
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
            select: 'fields.title,fields.slug,fields.preview,fields.image,fields.publishDate',
            query: q,
        });

        if (res.items.length === 0) return DEFAULT_BLOGS;

        return {
            total: res.total,
            blogs: res.items.map(({ fields }) => {
                const rawPublishDate = safelyParse(fields, 'publishDate', parseAsString, '1970-01-01T00:00+00:00');

                return {
                    title: safelyParse(fields, 'title', parseAsString, ''),
                    slug: safelyParse(fields, 'slug', parseAsString, ''),
                    preview: safelyParse(fields, 'preview', parseAsString, null),
                    image: {
                        title: safelyParse(fields, 'image.fields.title', parseAsString, ''),
                        description: safelyParse(fields, 'image.fields.description', parseAsString, ''),
                        url: safelyParse(fields, 'image.fields.file.url', parseAsString, ''),
                    },
                    publishDate: DateTime.fromISO(rawPublishDate).toFormat('dd/MM/yyyy'),
                };
            }),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch blog lists.');
    }

    return DEFAULT_BLOGS;
}

export async function getBlog(slug: string): Promise<Blog | null> {
    try {
        const client = contentful.createClient({
            space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
            accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
            environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
        });

        const res = await client.getEntries({
            content_type: 'blogPost',
            limit: 1,
            skip: 0,
            'fields.slug[in]': slug,
            select: 'fields.title,fields.slug,fields.image,fields.banner,fields.publishDate,fields.youtubeEmbedId,fields.content,fields.reviewTitle,fields.reviewSummary,fields.reviewScore',
        });

        if (res.items.length === 0) return null;

        const blog = res.items[0];
        const rawPublishDate = safelyParse(blog, 'fields.publishDate', parseAsString, '1970-01-01T00:00+00:00');

        return {
            title: safelyParse(blog, 'fields.title', parseAsString, ''),
            slug: safelyParse(blog, 'fields.slug', parseAsString, ''),
            publishDate: DateTime.fromISO(rawPublishDate).toFormat('dd/MM/yyyy'),
            content: safelyParse(blog, 'fields.content', parseAsDocument, null),
            image: {
                title: safelyParse(blog, 'fields.image.fields.title', parseAsString, ''),
                description: safelyParse(blog, 'fields.image.fields.description', parseAsString, ''),
                url: safelyParse(blog, 'fields.image.fields.file.url', parseAsString, ''),
            },
            banner: {
                title: safelyParse(blog, 'fields.banner.fields.title', parseAsString, ''),
                description: safelyParse(blog, 'fields.banner.fields.description', parseAsString, ''),
                url: safelyParse(blog, 'fields.banner.fields.file.url', parseAsString, ''),
            },
            youtubeEmbedId: safelyParse(blog, 'fields.youtubeEmbedId', parseAsString, null),
            reviewTitle: safelyParse(blog, 'fields.reviewTitle', parseAsString, ''),
            reviewSummary: safelyParse(blog, 'fields.reviewSummary', parseAsString, ''),
            reviewScore: safelyParse(blog, 'fields.reviewScore', parseAsNumber, 0),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch blog lists.');
    }

    return null;
}
