import { ContentfulPage, Page } from '../types/pages';
import { fetchContent } from './content';
import { parseAsArrayOfContentfulPages, parseAsArrayOfDocuments, parseAsString, safelyParse } from './parsers';

export async function pageBySlug(slug: string | null, path: string): Promise<Page> {
    if (!slug) {
        return {
            title: '',
            content: null,
        };
    }

    const query = `
        query {
            pagesCollection (limit: 1, skip: 0, where: {slug: "${path}${slug}"}){
                items {
                    title
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

    return {
        title: safelyParse(contentfulPage, 'title', parseAsString, ''),
        content: safelyParse(contentfulPage, 'content.json.content', parseAsArrayOfDocuments, null),
    };
}

export async function fetchPageCollection(query: string): Promise<ContentfulPage[] | null> {
    const pages = await fetchContent(query);

    return safelyParse(pages, 'data.content.pagesCollection.items', parseAsArrayOfContentfulPages, null);
}
