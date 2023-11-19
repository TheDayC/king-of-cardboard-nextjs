import * as contentful from 'contentful';
import { get } from 'lodash';

import { errorHandler } from '../middleware/errors';
import { ContentfulPage, PageWithHero } from '../types/pages';
import { parseAsArrayOfDocuments, parseAsArrayOfHeroes, parseAsDocument, parseAsString, safelyParse } from './parsers';

export async function getPageBySlug(slug: string | null, path: string): Promise<ContentfulPage> {
    try {
        const client = contentful.createClient({
            space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
            accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
            environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
        });

        const res = await client.getEntries({
            content_type: 'pages',
            limit: 1,
            skip: 0,
            'fields.slug': `${path}${slug}`,
        });

        if (res.items.length === 0) {
            return {
                title: '',
                slug: '',
                content: null,
                sliderImages: null,
                hero: [],
            };
        }

        const pageItems = res.items[0];

        const sliderItems: unknown[] = get(pageItems, 'fields.slider', []);

        return {
            title: safelyParse(pageItems, 'fields.title', parseAsString, ''),
            slug: safelyParse(pageItems, 'fields.slug', parseAsString, ''),
            content: safelyParse(pageItems, 'fields.content', parseAsDocument, null),
            sliderImages: sliderItems.map((item: unknown) => ({
                title: safelyParse(item, 'fields.title', parseAsString, ''),
                description: safelyParse(item, 'fields.description', parseAsString, ''),
                contentType: safelyParse(item, 'fields.file.contentType', parseAsString, ''),
                fileName: safelyParse(item, 'fields.file.fileName', parseAsString, ''),
                url: safelyParse(item, 'fields.file.url', parseAsString, ''),
            })),
            hero: [],
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch page.');
    }

    return {
        title: '',
        slug: '',
        content: null,
        sliderImages: null,
        hero: [],
    };
}

export async function pageWithHeroBySlug(slug: string, path: string): Promise<PageWithHero> {
    const client = contentful.createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
        environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
    });

    const res = await client.getEntries({
        content_type: 'pages',
        limit: 1,
        skip: 0,
        'fields.slug': `${path}${slug}`,
    });

    if (res.items.length === 0) {
        return {
            content: null,
            heroes: null,
            sliderImages: [],
        };
    }

    const pageItems = res.items[0];
    const sliderItems: unknown[] = get(pageItems, 'fields.slider', []);

    return {
        content: safelyParse(pageItems, 'fields.content.json.content', parseAsArrayOfDocuments, null),
        heroes: safelyParse(pageItems, 'fields.hero', parseAsArrayOfHeroes, null),
        sliderImages: sliderItems.map((item: unknown) => ({
            title: safelyParse(item, 'fields.title', parseAsString, ''),
            description: safelyParse(item, 'fields.description', parseAsString, ''),
            contentType: safelyParse(item, 'fields.file.contentType', parseAsString, ''),
            fileName: safelyParse(item, 'fields.file.fileName', parseAsString, ''),
            url: safelyParse(item, 'fields.file.url', parseAsString, ''),
        })),
    };
}
