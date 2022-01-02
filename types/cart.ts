import { CommerceLayerObject } from './api';
import { Product } from './products';

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
    subTotal: string | null;
    shipping: string | null;
    total: string | null;
}
