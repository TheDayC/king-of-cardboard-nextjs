import { ImageItem } from './products';

export interface CartTotals {
    subTotal: string;
    shipping: string;
    discount: string;
    total: string;
}

export interface CreateOrder {
    orderId: string | null;
    orderNumber: number | null;
}

export interface CartItem {
    id: string;
    sku_code: string;
    name: string;
    quantity: number;
    formatted_unit_amount: string;
    formatted_total_amount: string;
    image: ImageItem;
    metadata: {
        categories: string[];
        types: string[];
    };
    stock: number;
}
