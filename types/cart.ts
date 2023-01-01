import { Order } from '@commercelayer/sdk';
import { ImageItem } from '../types/contentful';
import { Product } from './products';

export interface CartItem
    extends Omit<Product, 'created' | 'lastUpdated' | 'userId' | 'content' | 'mainImage' | 'gallery' | 'isInfinite'> {
    mainImage: ImageItem;
    stock: number;
    cartQty: number;
}

export interface Totals {
    subTotal: number;
    shipping: number;
    discount: number;
    total: number;
}

export interface FetchCartItems {
    id: string;
    quantity: number;
}
