import { SkuInventory } from './commerce';

export interface Product {
    id: string;
    name: string;
    slug: string;
    sku_code: string;
    description: string;
    types: string[];
    categories: string[];
    images: ImageItem[];
    cardImage: ImageItem;
    tags: string[];
    amount: string;
    compare_amount: string;
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
