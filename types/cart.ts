import { LineItemOption, Order } from '@commercelayer/sdk';
import { Category, Configuration, Interest } from '../enums/products';

import { ImageItem } from './contentful';
import { Product } from './productsNew';

export interface CartTotals {
    subTotal: string;
    shipping: string;
    discount: string;
    total: string;
}

export interface CreateOrder {
    orderId: string | null;
    orderNumber: number | null;
    expiry: string | null;
}

/* export interface CartItem {
    _id: string;
    sku: string;
    title: string;
    slug: string;
    mainImage: string;
    category: Category;
    interest: Interest;
    configuration: Configuration;
    quantity: number;
    price: number;
    salePrice: number;
    isInfinite: boolean;
} */

export type CartItem = Omit<Product, 'created' | 'lastUpdated' | 'userId' | 'content' | 'gallery'>;

export interface UpdateQuantity {
    id: string;
    quantity: number;
}

export interface FetchOrder extends Omit<Order, 'line_items'> {
    line_items: CartItem[];
}
