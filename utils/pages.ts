import { Document } from '@contentful/rich-text-types';

import { ContentfulPage } from '../types/pages';
import { fetchContent } from './content';
import { parseAsArrayOfContentfulPages, parseAsArrayOfDocuments, safelyParse } from './parsers';

export async function pageBySlug(slug: string | null, path: string): Promise<Document[] | null> {
    if (!slug) return null;

    const query = `
        query {
            pagesCollection (limit: 1, skip: 0, where: {slug: "${path}${slug}"}){
                items {
                    content {
                        json
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

    return safelyParse(contentfulPage, 'content.json.content', parseAsArrayOfDocuments, null);
}

export async function fetchPageCollection(query: string): Promise<ContentfulPage[] | null> {
    const pages = await fetchContent(query);

    return safelyParse(pages, 'data.content.pagesCollection.items', parseAsArrayOfContentfulPages, null);
}
