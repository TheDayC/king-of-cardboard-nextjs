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
    imageId: string;
    galleryIds: string[] | null;
    productType: ProductType;
    quantity: number | null;
    cost: number;
    isInfinite: boolean;
}

export interface ListProducts {
    products: Product[];
    count: number;
}
