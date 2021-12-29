import { get } from 'lodash';

import {
    BreakSlot,
    BreakSlotWithSku,
    ContentfulBreak,
    ContentfulBreaksResponse,
    ContentfulBreakTypes,
    SingleBreak,
} from '../types/breaks';
import { SkuInventory, SkuItem, SkuOption, SkuProduct } from '../types/commerce';
import { ImageCollection, ImageItem } from '../types/products';
import { fetchContent } from './content';
import { parseAsArrayOfBreakTypeItems, parseAsArrayOfContentfulBreaks, parseAsNumber, safelyParse } from './parsers';

export async function fetchContentfulBreaks(
    limit: number,
    skip: number,
    productType: string
): Promise<ContentfulBreaksResponse> {
    // Chain filters, entire object can't be stringified but arrays can for a quick win.
    const where = productType.length > 0 ? `, where: {types: "${productType}"}` : '';

    // Piece together query.
    const query = `
        query {
            breaksCollection (limit: ${limit}, skip: ${skip}${where}) {
                total
                items {
                    title
                    slug
                    description
                    cardImage {
                        title
                        description
                        url
                    }
                    imagesCollection {
                        items {
                            title
                            description
                            url
                        }
                    }
                    types
                    breakSlotsCollection {
                        items {
                            name
                            productLink
                            slotIdentifier
                                image {
                                    title
                                    description
                                    url
                                }
                        }
                    }
                    breakDate
                    tags
                    format
                    isLive
                    isComplete
                    vodLink
                }
            }
        }
    `;

    // Make the contentful request.
    const response = await fetchContent(query);

    // On a successful request get the total number of items for pagination.
    const total = safelyParse(response, 'data.content.breaksCollection.total', parseAsNumber, 0);

    // On success get the item data for products.
    const breaksCollection = safelyParse(
        response,
        'data.content.breaksCollection.items',
        parseAsArrayOfContentfulBreaks,
        null
    );

    return {
        total,
        breaksCollection,
    };
}

export async function fetchContentfulBreakTypes(): Promise<ContentfulBreakTypes[] | null> {
    const query = `
        query {
            breakTypesCollection {
                items {
                    title
                    link
                }
            }
        }
    `;

    const response = await fetchContent(query);
    const breakTypesCollection = safelyParse(
        response,
        'data.content.breakTypesCollection.items',
        parseAsArrayOfBreakTypeItems,
        null
    );

    if (!breakTypesCollection) {
        return null;
    }

    return breakTypesCollection.map((type) => ({
        title: type.title,
        link: type.link,
    }));
}

export async function fetchBreakBySlug(slug: string): Promise<ContentfulBreak | null> {
    // Piece together query.
    const query = `
        query {
            breaksCollection (limit: 1, skip: 0, where: {slug: ${JSON.stringify(slug)}}) {
                items {
                    title
                    slug
                    description
                    cardImage {
                        title
                        description
                        url
                    }
                    imagesCollection {
                        items {
                            title
                            description
                            url
                        }
                    }
                    types
                    breakSlotsCollection {
                        items {
                            name
                            productLink
                            slotIdentifier
                                image {
                                    title
                                    description
                                    url
                                }
                        }
                    }
                    breakDate
                    tags
                    format
                    isLive
                    isComplete
                    vodLink
                }
            }
        }
    `;

    // Make the contentful request.
    const response = await fetchContent(query);

    // On success get the item data for products.
    const breaksCollection = safelyParse(
        response,
        'data.content.breaksCollection.items',
        parseAsArrayOfContentfulBreaks,
        null
    );

    if (!breaksCollection) {
        return null;
    }

    return breaksCollection[0];
}

export function mergeBreakSlotData(breaks: BreakSlot[], skuItems: SkuItem[]): BreakSlotWithSku[] {
    return breaks.map((breakSlot) => {
        const { productLink: sku_code } = breakSlot;
        const skuItem = skuItems.find((s) => s.sku_code === sku_code) || null;

        const id: string = get(skuItem, 'id', '');
        const name: string = get(breakSlot, 'slotIdentifier', '');
        const image: ImageItem | null = get(breakSlot, 'image', null);
        const amount: string = get(skuItem, 'amount', '');
        const compare_amount: string = get(skuItem, 'compare_amount', '');

        return {
            id,
            name,
            sku_code,
            image,
            amount,
            compare_amount,
        };
    });
}

export function mergeSkuBreakData(product: ContentfulBreak, skuItem: SkuItem, skuData: SkuProduct): SingleBreak {
    const id: string = get(skuItem, 'id', '');
    const title: string = get(product, 'title', '');
    const slug: string = get(product, 'slug', '');
    const sku_code: string | null = get(product, 'productLink', null);
    const description: string | null = get(product, 'description', null);
    const types: string | null = get(product, 'types', null);
    const cardImage: ImageItem | null = get(product, 'cardImage', null);
    const images: ImageCollection | null = get(product, 'imagesCollection', null);
    const tags: string[] | null = get(product, 'tags', null);
    const amount: string | null = get(skuData, 'formatted_amount', null);
    const compare_amount: string | null = get(skuData, 'formatted_compare_at_amount', null);
    const inventory: SkuInventory | null = get(skuData, 'inventory', null);
    const options: SkuOption[] | null = get(skuData, 'options', null);

    return {
        id,
        title,
        slug,
        sku_code,
        description,
        types,
        images,
        cardImage,
        tags,
        amount,
        compare_amount,
        inventory,
        options,
    };
}
