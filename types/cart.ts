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
    line_items: string[];
    included: IncludedData[];
}

export interface IncludedData {
    id: string;
    type: string;
    attributes: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
