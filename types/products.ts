import { Category, Configuration, Interest, StockStatus } from '../enums/products';

export interface Product {
    _id: string;
    sku: string;
    created: string;
    lastUpdated: string;
    userId: string;
    title: string;
    slug: string;
    content: string;
    mainImage: string;
    gallery: string[] | null;
    category: Category;
    interest: Interest;
    configuration: Configuration;
    stockStatus: StockStatus;
    quantity: number;
    price: number;
    salePrice: number;
    priceHistory: PriceHistory[];
    releaseDate: string | null;
    isInfinite: boolean;
    metaTitle: string;
    metaDescription: string;
}

export interface ListProducts {
    products: Product[];
    count: number;
}

export interface SelectOptions {
    key: string;
    value: string | number;
}

export interface PriceHistory {
    timestamp: string;
    price: number;
}

export interface ProductFacets {
    baseball: Product[];
    basketball: Product[];
    football: Product[];
    soccer: Product[];
    ufc: Product[];
    wrestling: Product[];
    tcg: Product[];
    other: Product[];
    f1: Product[];
}
