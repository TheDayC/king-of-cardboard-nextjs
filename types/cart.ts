import { Order } from '@commercelayer/sdk';
import { ImageItem } from '../types/contentful';
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

export interface CartItem
    extends Omit<Product, 'created' | 'lastUpdated' | 'userId' | 'content' | 'mainImage' | 'gallery'> {
    mainImage: ImageItem;
    stock: number;
}

export interface UpdateQuantity {
    id: string;
    quantity: number;
}

export interface FetchOrder extends Omit<Order, 'line_items'> {
    line_items: CartItem[];
}

export interface Totals {
    subTotal: number;
    shipping: number;
    discount: number;
    total: number;
}

export interface FetchCartTotals {
    id: string;
    quantity: number;
}
