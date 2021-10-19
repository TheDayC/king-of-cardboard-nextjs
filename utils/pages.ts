import { get } from 'lodash';

import { ContentfulPage } from '../types/pages';
import { fetchContent } from './content';

export async function fetchPageCollection(query: string): Promise<ContentfulPage[] | null> {
    const pages = await fetchContent(query);

    if (pages) {
        const productCollection: ContentfulPage[] | null = get(pages, 'data.data.pagesCollection.items', null);

        return productCollection;
    }

    return null;
}
