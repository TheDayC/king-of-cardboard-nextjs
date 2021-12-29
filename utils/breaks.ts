import {
    BreakSlot,
    BreakSlotWithSku,
    ContentfulBreak,
    ContentfulBreaksResponse,
    ContentfulBreakTypes,
    SingleBreak,
} from '../types/breaks';
import { SkuItem, SkuProduct } from '../types/commerce';
import { fetchContent } from './content';
import {
    parseAsArrayOfBreakTypeItems,
    parseAsArrayOfContentfulBreaks,
    parseAsArrayOfStrings,
    parseAsImageItem,
    parseAsNumber,
    parseAsString,
    safelyParse,
    parseAsImageCollection,
    parseAsSkuInventory,
    parseAsArrayOfSkuOptions,
} from './parsers';

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

        const id = safelyParse(skuItem, 'id', parseAsString, '');
        const name = safelyParse(breakSlot, 'slotIdentifier', parseAsString, '');
        const image = safelyParse(breakSlot, 'image', parseAsImageItem, null);
        const amount = safelyParse(skuItem, 'amount', parseAsString, '');
        const compare_amount = safelyParse(skuItem, 'compare_amount', parseAsString, '');

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
    const id = safelyParse(skuItem, 'id', parseAsString, '');
    const title = safelyParse(product, 'title', parseAsString, '');
    const slug = safelyParse(product, 'slug', parseAsString, '');
    const sku_code = safelyParse(product, 'productLink', parseAsString, null);
    const description = safelyParse(product, 'description', parseAsString, null);
    const types = safelyParse(product, 'types', parseAsString, null);
    const cardImage = safelyParse(product, 'cardImage', parseAsImageItem, null);
    const images = safelyParse(product, 'imagesCollection', parseAsImageCollection, null);
    const tags = safelyParse(product, 'tags', parseAsArrayOfStrings, null);
    const amount = safelyParse(skuData, 'formatted_amount', parseAsString, null);
    const compare_amount = safelyParse(skuData, 'formatted_compare_at_amount', parseAsString, null);
    const inventory = safelyParse(skuData, 'inventory', parseAsSkuInventory, null);
    const options = safelyParse(skuData, 'options', parseAsArrayOfSkuOptions, null);

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
