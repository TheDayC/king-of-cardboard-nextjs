import { Category, Configuration, Interest } from '../enums/products';

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
    quantity: number;
    price: number;
    salePrice: number;
    isInfinite: boolean;
}

export interface ListProducts {
    products: Product[];
    count: number;
}
