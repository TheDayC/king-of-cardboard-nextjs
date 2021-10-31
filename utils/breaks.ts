import { get } from 'lodash';

import {
    Break,
    BreakSlotsCollection,
    ContentfulBreak,
    ContentfulBreaksResponse,
    ContentfulBreakTypes,
    SingleBreak,
} from '../types/breaks';
import { SkuInventory, SkuItem, SkuOption, SkuProduct } from '../types/commerce';
import { ImageCollection, ImageItem, SingleProduct } from '../types/products';
import { fetchContent } from './content';

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
                }
            }
        }
    `;

    // Make the contentful request.
    const response = await fetchContent(query);

    if (response) {
        // On a successful request get the total number of items for pagination.
        const total: number = get(response, 'data.data.breaksCollection.total', 0);

        // On success get the item data for products.
        const breaksCollection: ContentfulBreak[] | null = get(response, 'data.data.breaksCollection.items', null);

        // Return both.
        return {
            total,
            breaksCollection,
        };
    }

    // Return both defaults if unsuccessful.
    return { total: 0, breaksCollection: null };
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

    if (response) {
        const breakTypesCollection: any | null = get(response, 'data.data.breakTypesCollection.items', null);

        // Return both.
        return breakTypesCollection.map((type: any) => ({
            title: type.title,
            link: type.link,
        }));
    }

    return null;
}

export async function fetchBreakBySlug(slug: string): Promise<ContentfulBreak | null> {
    // Piece together query.
    const query = `
        query {
            breaksCollection (where: {slug: ${JSON.stringify(slug)}}) {
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
                }
            }
        }
    `;

    // Make the contentful request.
    const response = await fetchContent(query);

    if (response) {
        // On success get the item data for products.
        const breaksCollection: ContentfulBreak[] | null = get(response, 'data.data.breaksCollection.items', null);

        return breaksCollection ? breaksCollection[0] : null;
    }

    // Return both defaults if unsuccessful.
    return null;
}

export function mergeBreakData(products: ContentfulBreak[], skuItems: SkuItem[]): Break[] {
    return products.map((product) => {
        const { productLink: sku_code } = product;
        const skuItem = skuItems.find((s) => s.sku_code === sku_code) || null;

        const id: string = get(skuItem, 'id', '');
        const title: string = get(product, 'title', '');
        const slug: string = get(product, 'slug', '');
        const description: string | null = get(product, 'description', null);
        const types: string | null = get(product, 'types', null);
        const cardImage: ImageItem | null = get(product, 'cardImage', null);
        const breakSlotsCollection: BreakSlotsCollection | null = get(product, 'breakSlotsCollection', null);
        const imagesCollection: ImageCollection | null = get(product, 'imagesCollection', null);
        const tags: string[] | null = get(product, 'tags', null);

        return {
            id,
            title,
            slug,
            sku_code,
            description,
            types,
            cardImage,
            imagesCollection,
            tags,
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
