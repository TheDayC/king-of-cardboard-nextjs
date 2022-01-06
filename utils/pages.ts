import { ContentfulPage } from '../types/pages';
import { fetchContent } from './content';
import { parseAsArrayOfContentfulPages, safelyParse } from './parsers';

export async function fetchPageCollection(query: string): Promise<ContentfulPage[] | null> {
    const pages = await fetchContent(query);

    return safelyParse(pages, 'data.content.pagesCollection.items', parseAsArrayOfContentfulPages, null);
}
