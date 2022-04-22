import { Document } from '@contentful/rich-text-types';

import { SkuInventory } from './commerce';

export interface Product {
    id: string;
    name: string;
    slug: string;
    sku_code: string;
    description: Document[] | null;
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
    description: Document[] | null;
    types: string[];
    categories: string[];
    images: ImageCollection;
    cardImage: ImageItem;
    tags: string[];
    amount: string;
    compare_amount: string;
    inventory: SkuInventory;
    skuOptions: SkuOptions[];
}

interface SkuOptions {
    id: string;
    name: string;
    amount: string;
    description: string;
}

export interface ProductsWithCount {
    products: Product[];
    count: number;
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

export interface CartImage extends ImageItem {
    sku_code: string;
}

export interface SavedSkuOptions {
    id: string;
    name: string;
    amount: string;
    quantity: number;
}
