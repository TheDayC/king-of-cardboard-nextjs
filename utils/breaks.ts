import { join } from 'lodash';
import {
    BreakSlot,
    BreakSlotWithSku,
    ContentfulBreak,
    ContentfulBreaksResponse,
    ContentfulBreakTypes,
    SingleBreak,
} from '../types/breaks';
import { SkuItem, SkuProduct } from '../types/commerce';
import { authClient } from './auth';
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
    parseAsBoolean,
    parseAsBreakSlotsCollection,
    parseAsArrayOfCommerceResponse,
    parseAsCommerceResponse,
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

export async function getSingleBreak(accessToken: string, slug: string): Promise<SingleBreak> {
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
    const breaksRes = await fetchContent(query);

    // On success get the item data for products.
    const contentfulBreak = safelyParse(
        breaksRes,
        'data.content.breaksCollection.items',
        parseAsArrayOfContentfulBreaks,
        []
    )[0];

    const cl = authClient(accessToken);

    // Need to find the product by SKU first.
    const sku_code = safelyParse(contentfulBreak, 'productLink', parseAsString, '');
    const skuByCodeRes = await cl.get(`/api/skus?filter[q][code_eq]=${sku_code}&fields[skus]=id`);

    const skuByCodeData = safelyParse(skuByCodeRes, 'data.data', parseAsArrayOfCommerceResponse, [])[0];

    // Next pull it by id so we can fetch inventory information.
    const id = safelyParse(skuByCodeData, 'id', parseAsString, '');
    const fields = '&fields[skus]=id,inventory&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount';
    const skuRes = await cl.get(`/api/skus/${id}?include=prices${fields}`);
    const skuData = safelyParse(skuRes, 'data.data', parseAsCommerceResponse, null);
    const included = safelyParse(skuRes, 'data.included', parseAsArrayOfCommerceResponse, []);
    const prices = included.find((i) => i.attributes.sku_code === sku_code && i.type === 'prices');

    // We need to do a little bit of extra work here to find the break's sub products.
    const breakSlotsCollection = safelyParse(contentfulBreak, 'breakSlotsCollection', parseAsBreakSlotsCollection, {
        items: [],
    });
    const breakSlotSkus = breakSlotsCollection.items
        .map((bS) => safelyParse(bS, 'productLink', parseAsString, ''))
        .filter((bS) => bS.length > 0);
    const breakSlotsString = join(breakSlotSkus, ',');
    const breakSkusByCodesRes = await cl.get(
        `/api/skus?filter[q][code_in]=${breakSlotsString}&include=prices&fields[skus]=id,&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount`
    );
    const breakSkusByCodesIncluded = safelyParse(
        breakSkusByCodesRes,
        'data.included',
        parseAsArrayOfCommerceResponse,
        []
    );
    const breakSlots = breakSlotsCollection.items.map((slot) => {
        const sku_code = safelyParse(slot, 'productLink', parseAsString, '');
        const slotPrices = breakSkusByCodesIncluded.find(
            (i) => i.attributes.sku_code === sku_code && i.type === 'prices'
        );

        return {
            id: safelyParse(slotPrices, 'id', parseAsString, ''),
            name: slot.name,
            image: slot.image,
            sku_code,
            amount: safelyParse(slotPrices, 'attributes.formatted_amount', parseAsString, '£0.00'),
            compare_amount: safelyParse(prices, 'attributes.formatted_compare_at_amount', parseAsString, '£0.00'),
        };
    });
    const imageCollection = safelyParse(contentfulBreak, 'imageCollection', parseAsImageCollection, { items: [] });
    const images = imageCollection.items.map((iC) => ({
        title: safelyParse(iC, 'cardImage.title', parseAsString, ''),
        description: safelyParse(iC, 'cardImage.description', parseAsString, ''),
        url: safelyParse(iC, 'cardImage.url', parseAsString, ''),
    }));

    return {
        id,
        sku_code,
        title: safelyParse(contentfulBreak, 'title', parseAsString, ''),
        slug: safelyParse(contentfulBreak, 'slug', parseAsString, ''),
        description: safelyParse(contentfulBreak, 'description', parseAsString, ''),
        cardImage: {
            title: safelyParse(contentfulBreak, 'cardImage.title', parseAsString, ''),
            description: safelyParse(contentfulBreak, 'cardImage.description', parseAsString, ''),
            url: safelyParse(contentfulBreak, 'cardImage.url', parseAsString, ''),
        },
        images,
        types: safelyParse(contentfulBreak, 'types', parseAsString, ''),
        breakSlots,
        breakDate: safelyParse(contentfulBreak, 'breakDate', parseAsString, ''),
        tags: safelyParse(contentfulBreak, 'tags', parseAsArrayOfStrings, []),
        format: safelyParse(contentfulBreak, 'format', parseAsString, ''),
        isLive: safelyParse(contentfulBreak, 'isLive', parseAsBoolean, false),
        isComplete: safelyParse(contentfulBreak, 'isComplete', parseAsBoolean, false),
        vodLink: safelyParse(contentfulBreak, 'vodLink', parseAsString, ''),
        amount: safelyParse(prices, 'attributes.formatted_amount', parseAsString, '£0.00'),
        compare_amount: safelyParse(prices, 'attributes.formatted_compare_at_amount', parseAsString, '£0.00'),
        inventory: safelyParse(skuData, 'attributes.inventory', parseAsSkuInventory, {
            available: false,
            quantity: 0,
            levels: [],
        }),
    };
}
