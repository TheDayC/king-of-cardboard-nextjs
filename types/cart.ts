import { CommerceLayerObject } from './api';
import { ImageItem, Product } from './products';

export interface FullCartItem extends Product {
    quantity: number;
}

export interface CartStaticProps {
    order: Order | null;
}

export interface Order {
    id: string;
    number: number;
    sku_count: number;
    formatted_subtotal_amount: string;
    formatted_discount_amount: string;
    formatted_shipping_amount: string;
    formatted_total_tax_amount: string;
    formatted_gift_card_amount: string;
    formatted_total_amount_with_taxes: string;
    status: string;
    payment_status: string;
    fulfillment_status: string;
    line_items: string[];
    included: IncludedData[];
}

export interface IncludedData {
    id: string;
    type: string;
    attributes: CommerceLayerObject | null;
}

export interface CartTotals {
    subTotal: string;
    shipping: string;
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
