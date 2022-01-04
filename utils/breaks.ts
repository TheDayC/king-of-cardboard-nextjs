import { join } from 'lodash';

import { Break, SingleBreak } from '../types/breaks';
import { authClient } from './auth';
import { fetchContent } from './content';
import {
    parseAsArrayOfContentfulBreaks,
    parseAsArrayOfStrings,
    parseAsNumber,
    parseAsString,
    safelyParse,
    parseAsImageCollection,
    parseAsSkuInventory,
    parseAsBoolean,
    parseAsBreakSlotsCollection,
    parseAsArrayOfCommerceResponse,
    parseAsCommerceResponse,
    parseAsArrayOfBreakSlots,
} from './parsers';

export async function getBreaks(accessToken: string, limit: number, skip: number): Promise<Break[]> {
    // Piece together query.
    const query = `
        query {
            breaksCollection (limit: ${limit}, skip: ${skip}) {
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
    const cl = authClient(accessToken);

    // On success get the item data for products.
    const breaksCollection = safelyParse(
        response,
        'data.content.breaksCollection.items',
        parseAsArrayOfContentfulBreaks,
        []
    );

    return await Promise.all(
        breaksCollection.map(async (bC) => {
            const breakSlots = safelyParse(bC, 'breakSlotsCollection.items', parseAsArrayOfBreakSlots, []);
            const sku_codes = breakSlots.map((bS) => safelyParse(bS, 'sku_code', parseAsArrayOfStrings, []));
            const skuFilter = join(sku_codes, ',');
            const res = await cl.get(
                `/api/skus?filter[q][code_in]=${skuFilter}&filter[q][stock_items_quantity_gt]=0&fields[skus]=id`
            );
            const slots = safelyParse(res, 'data.meta.record_count', parseAsNumber, 0);

            return {
                cardImage: {
                    title: safelyParse(bC, 'cardImage.title', parseAsString, ''),
                    description: safelyParse(bC, 'cardImage.description', parseAsString, ''),
                    url: safelyParse(bC, 'cardImage.url', parseAsString, ''),
                },
                title: safelyParse(bC, 'title', parseAsString, ''),
                tags: safelyParse(bC, 'tags', parseAsArrayOfStrings, []),
                types: safelyParse(bC, 'types', parseAsString, ''),
                slug: safelyParse(bC, 'slug', parseAsString, ''),
                slots,
                format: safelyParse(bC, 'format', parseAsString, ''),
                breakDate: safelyParse(bC, 'breakDate', parseAsString, ''),
                isLive: safelyParse(bC, 'isLive', parseAsBoolean, false),
                isComplete: safelyParse(bC, 'isComplete', parseAsBoolean, false),
                vodLink: safelyParse(bC, 'vodLink', parseAsString, ''),
            };
        })
    );
}

export async function getBreaksTotal(): Promise<number> {
    // Piece together query.
    const query = `
        query {
            breaksCollection (limit: 1, skip: 0) {
                total
            }
        }
    `;

    // Make the contentful request.
    const response = await fetchContent(query);

    // On a successful request get the total number of items for pagination.
    return safelyParse(response, 'data.content.breaksCollection.total', parseAsNumber, 0);
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
