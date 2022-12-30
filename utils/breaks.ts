import { chunk, join } from 'lodash';
import CommerceLayer from '@commercelayer/sdk';

import { BreakStatuses } from '../types/breaks';
import { fetchContent } from './content';
import { parseAsArrayOfContentfulBreaks, safelyParse, parseAsBoolean } from './parsers';

export async function getBreakStatus(slug: string | null): Promise<BreakStatuses> {
    if (!slug) return { isLive: true, isComplete: true };

    const query = `
        query {
            breaksCollection (limit: 1, skip: 0, where: {slug: ${JSON.stringify(slug)}}) {
                items {
                    slug
                    isLive
                    isComplete
                }
            }
        }
    `;

    // Make the contentful request.
    // Make the contentful request.
    const res = await fetchContent(query);

    // On success get the item data for products.
    const contentfulBreak = safelyParse(
        res,
        'data.content.breaksCollection.items',
        parseAsArrayOfContentfulBreaks,
        []
    )[0];

    const isLive = safelyParse(contentfulBreak, 'isLive', parseAsBoolean, true);
    const isComplete = safelyParse(contentfulBreak, 'isComplete', parseAsBoolean, true);

    return { isLive, isComplete };
}
