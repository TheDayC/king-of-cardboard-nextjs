import { SkuInventory, SkuOption } from './commerce';

export interface Product {
    id: string | null;
    name: string | null;
    slug: string | null;
    sku_code: string | null;
    description: string | null;
    types: string[] | null;
    categories: string[] | null;
    images: ImageCollection | null;
    cardImage: ImageItem | null;
    tags: string[] | null;
    amount: string | null;
    compare_amount: string | null;
}

export interface SingleProduct {
    id: string;
    name: string;
    slug: string;
    sku_code: string;
    description: string;
    types: string[];
    categories: string[];
    images: ImageCollection;
    cardImage: ImageItem;
    tags: string[];
    amount: string;
    compare_amount: string;
    inventory: SkuInventory;
    options: SkuOption[];
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

export interface ImageCollection {
    items: ImageItem[];
}

export interface ImageItem {
    title: string;
    description: string;
    url: string;
}
