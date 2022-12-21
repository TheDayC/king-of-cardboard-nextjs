import { ProductType } from '../enums/products';

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
    productType: ProductType;
    quantity: number | null;
    price: number;
    salePrice: number;
    isInfinite: boolean;
}

export interface ListProducts {
    products: Product[];
    count: number;
}
