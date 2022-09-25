import { LineItemOption, Order } from '@commercelayer/sdk';

import { ImageItem } from './contentful';

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

export interface CartItem {
    id: string;
    sku_code: string;
    name: string;
    quantity: number;
    formatted_unit_amount: string;
    formatted_total_amount: string;
    image: ImageItem;
    metadata?: {
        categories: string[];
        types: string[];
    };
    stock: number;
    line_item_options: LineItemOption[];
}

export interface UpdateQuantity {
    id: string;
    quantity: number;
}

export interface FetchOrder extends Omit<Order, 'line_items'> {
    line_items: CartItem[];
}
