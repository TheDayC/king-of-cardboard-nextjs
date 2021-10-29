import { SkuInventory, SkuOption } from './commerce';

export interface Product {
    id: string;
    name: string;
    slug: string;
    sku_code: string | null;
    description: string | null;
    types: string[];
    categories: string[];
    images: ImageCollection | null;
    cardImage: ImageItem | null;
    tags: string[] | null;
    amount: string;
    compare_amount: string;
}

export interface SingleProduct {
    id: string;
    name: string;
    slug: string;
    sku_code: string | null;
    description: string | null;
    types: string[];
    categories: string[];
    images: ImageCollection | null;
    cardImage: ImageItem | null;
    tags: string[] | null;
    amount: string | null;
    compare_amount: string | null;
    inventory: SkuInventory | null;
    options: SkuOption[] | null;
}

export interface ContentfulProductResponse {
    total: number;
    productCollection: ContentfulProduct[] | null;
}

export interface ContentfulProduct {
    name: string;
    slug: string;
    productLink: string;
    description: string | null;
    types: string[];
    categories: string[];
    imageCollection: ImageCollection;
    cardImage: ImageItem;
    tags: string[];
}

export interface ContentfulProductShort {
    name: string;
    slug: string;
    productLink: string;
    types: string[];
    categories: string[];
    cardImage: ImageItem;
}

interface ImageCollection {
    items: ImageItem[];
}

export interface ImageItem {
    title: string;
    description: string;
    url: string;
}
