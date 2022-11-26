import { Document } from '@contentful/rich-text-types';
import * as contentful from 'contentful';
import { errorHandler } from '../middleware/errors';

import { ContentfulPage, PageWithHero } from '../types/pages';
import { fetchContent } from './content';
import {
    parseAsArrayOfContentfulPages,
    parseAsArrayOfDocuments,
    parseAsArrayOfHeroes,
    parseAsArrayOfSliderImages,
    parseAsDocument,
    parseAsString,
    safelyParse,
} from './parsers';

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
                sliderCollection: null,
                hero: [],
            };
        }

        const pageItems = res.items[0];

        return {
            title: safelyParse(pageItems, 'fields.title', parseAsString, ''),
            slug: safelyParse(pageItems, 'fields.slug', parseAsString, ''),
            content: safelyParse(pageItems, 'fields.content', parseAsDocument, null),
            sliderCollection: null,
            hero: [],
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch page.');
    }

    return {
        title: '',
        slug: '',
        content: null,
        sliderCollection: null,
        hero: [],
    };
}

export async function pageWithHeroBySlug(slug: string, path: string): Promise<PageWithHero> {
    const query = `
        query {
            pagesCollection (limit: 1, skip: 0, where: {slug: "${path}${slug}"}){
                items {
                    content {
                        json
                    }
                    hero
                    sliderCollection {
                        items {
                            title
                            description
                            contentType
                            fileName
                            url
                            width
                            height
                        }
                    }
                }
            }
        }
    `;

    const pages = await fetchContent(query);
    const contentfulPage = safelyParse(
        pages,
        'data.content.pagesCollection.items',
        parseAsArrayOfContentfulPages,
        []
    )[0];

    return {
        content: safelyParse(contentfulPage, 'content.json.content', parseAsArrayOfDocuments, null),
        heroes: safelyParse(contentfulPage, 'hero', parseAsArrayOfHeroes, null),
        sliderImages: safelyParse(contentfulPage, 'sliderCollection.items', parseAsArrayOfSliderImages, []),
    };
}

export async function fetchPageCollection(query: string): Promise<ContentfulPage[] | null> {
    const pages = await fetchContent(query);

    return safelyParse(pages, 'data.content.pagesCollection.items', parseAsArrayOfContentfulPages, null);
}
