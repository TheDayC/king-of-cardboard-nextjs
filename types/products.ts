import { SkuInventory } from './commerce';

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
}

interface ImageCollection {
    items: ImageItem[];
}

interface Description {
    json: DescriptionJSON;
}

interface DescriptionJSON {
    nodeType: string;
    content: DescriptionContent[];
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface DescriptionContent {
    nodeType: string;
    value: string;
    marks: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface ImageItem {
    title: string;
    description: string;
    url: string;
}
