import { chunk, join } from 'lodash';

import { CommerceLayerResponse } from '../types/api';
import { Break, BreaksWithCount, SingleBreak } from '../types/breaks';
import { authClient } from './auth';
import { fetchContent } from './content';
import {
    parseAsArrayOfContentfulBreaks,
    parseAsArrayOfStrings,
    parseAsNumber,
    parseAsString,
    safelyParse,
    parseAsImageCollection,
    parseAsBoolean,
    parseAsBreakSlotsCollection,
    parseAsArrayOfCommerceResponse,
    parseAsCommerceResponse,
    parseAsArrayOfDocuments,
} from './parsers';

export async function getBreaks(accessToken: string, limit: number, skip: number): Promise<BreaksWithCount> {
    // Piece together query.
    const query = `
        query {
            breaksCollection (limit: ${limit}, skip: ${skip}, order: [breakNumber_DESC]) {
                total
                items {
                    breakNumber
                    title
                    slug
                    cardImage {
                        title
                        description
                        url
                    }
                    types
                    breakDate
                    tags
                    format
                    breakSlotsCollection {
                      total
                    }
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
        []
    );

    return {
        breaks: breaksCollection.map((bC) => ({
            cardImage: {
                title: safelyParse(bC, 'cardImage.title', parseAsString, ''),
                description: safelyParse(bC, 'cardImage.description', parseAsString, ''),
                url: safelyParse(bC, 'cardImage.url', parseAsString, ''),
            },
            breakNumber: safelyParse(bC, 'breakNumber', parseAsNumber, 1),
            title: safelyParse(bC, 'title', parseAsString, ''),
            tags: safelyParse(bC, 'tags', parseAsArrayOfStrings, []),
            types: safelyParse(bC, 'types', parseAsString, ''),
            slug: safelyParse(bC, 'slug', parseAsString, ''),
            slots: safelyParse(bC, 'breakSlotsCollection.total', parseAsNumber, 0),
            format: safelyParse(bC, 'format', parseAsString, ''),
            breakDate: safelyParse(bC, 'breakDate', parseAsString, ''),
            isLive: safelyParse(bC, 'isLive', parseAsBoolean, false),
            isComplete: safelyParse(bC, 'isComplete', parseAsBoolean, false),
            vodLink: safelyParse(bC, 'vodLink', parseAsString, ''),
        })),
        count: safelyParse(response, 'data.content.breaksCollection.total', parseAsNumber, 0),
    };
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
                    description {
                        json
                    }
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
    const fields = '&fields[skus]=id,code&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount';
    const skuRes = await cl.get(`/api/skus/${id}?include=prices${fields}`);
    const included = safelyParse(skuRes, 'data.included', parseAsArrayOfCommerceResponse, []);
    const prices = included.find((i) => i.attributes.sku_code === sku_code && i.type === 'prices');

    // We need to do a little bit of extra work here to find the break's sub products.
    const breakSlotsCollection = safelyParse(contentfulBreak, 'breakSlotsCollection', parseAsBreakSlotsCollection, {
        items: [],
    });
    const breakSlotSkus = breakSlotsCollection.items
        .map((bS) => safelyParse(bS, 'productLink', parseAsString, ''))
        .filter((bS) => bS.length > 0);
    const slotSkuChunks = chunk(breakSlotSkus, 25);
    const breakSkusByCodesIncluded: CommerceLayerResponse[] = [];
    const unavailableSlots: string[] = [];
    const skuIdsWithSkus: unknown[] = [];

    for (const chunk of slotSkuChunks) {
        const breakSlotsString = join(chunk, ',');
        const breakSkusByCodesRes = await cl.get(
            `/api/skus?filter[q][code_in]=${breakSlotsString}&include=prices&fields[skus]=id,code&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount&page[size]=25&page[number]=1`
        );
        const unavailableSkusRes = await cl.get(
            `/api/skus?filter[q][code_in]=${breakSlotsString}&fields[skus]=code&page[size]=25&page[number]=1&filter[q][stock_items_quantity_gt]=0`
        );
        const included = safelyParse(
            breakSkusByCodesRes,
            'data.included',
            parseAsArrayOfCommerceResponse,
            [] as CommerceLayerResponse[]
        );
        const unavailableSkus = safelyParse(
            unavailableSkusRes,
            'data.data',
            parseAsArrayOfCommerceResponse,
            [] as CommerceLayerResponse[]
        );
        const data = safelyParse(
            breakSkusByCodesRes,
            'data.data',
            parseAsArrayOfCommerceResponse,
            [] as CommerceLayerResponse[]
        );

        included.forEach((i) => breakSkusByCodesIncluded.push(i));
        unavailableSkus.forEach((i) => unavailableSlots.push(safelyParse(i, 'attributes.code', parseAsString, '')));
        data.forEach((i) => {
            skuIdsWithSkus.push({
                id: safelyParse(i, 'id', parseAsString, ''),
                code: safelyParse(i, 'attributes.code', parseAsString, ''),
            });
        });
    }

    const breakSlots = breakSlotsCollection.items.map((slot) => {
        const sku_code = safelyParse(slot, 'productLink', parseAsString, '');
        const slotPrices = breakSkusByCodesIncluded.find(
            (i) => i.attributes.sku_code === sku_code && i.type === 'prices'
        );
        const sku = skuIdsWithSkus.find((skuData) => safelyParse(skuData, 'code', parseAsString, '') === sku_code);

        return {
            id: safelyParse(sku, 'id', parseAsString, ''),
            name: slot.name,
            image: slot.image,
            sku_code,
            amount: safelyParse(slotPrices, 'attributes.formatted_amount', parseAsString, '£0.00'),
            compare_amount: safelyParse(prices, 'attributes.formatted_compare_at_amount', parseAsString, '£0.00'),
            isAvailable: unavailableSlots.includes(sku_code),
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
        description: safelyParse(contentfulBreak, 'description.json.content', parseAsArrayOfDocuments, []),
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
    };
}
