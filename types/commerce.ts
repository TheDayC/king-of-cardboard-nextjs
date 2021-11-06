import { CartStaticProps } from './cart';
import { Product } from './products';

export interface CreateToken {
    token: string | null;
    expires: string | null;
}

export interface CommerceAuthProps {
    accessToken: string;
    expires: string;
}

export interface CommerceProductProps {
    products: Product[] | null;
}

export interface CommerceStaticProps extends CommerceAuthProps, CommerceProductProps, CartStaticProps {}

export interface StockItem {
    id: string;
    attributes: StockItemAttributes;
}

interface StockItemAttributes {
    sku_code: string;
    reference: string;
    quantity: number;
    created_at: string;
}

export interface SkuItem {
    id: string;
    sku_code: string;
    image_url: string;
    name: string;
    amount: string;
    compare_amount: string;
}

export interface SkuProduct {
    formatted_amount: string | null;
    formatted_compare_at_amount: string | null;
    inventory: SkuInventory | null;
    options: SkuOption[];
}

export interface SkuInventory {
    available: boolean;
    quantity: number;
    levels: SkuInventoryLevel[];
}

interface SkuInventoryLevel {
    quantity: number;
    delivery_lead_times: SkuInventoryLeadTime[];
}

interface SkuInventoryLeadTime {
    max: SkuInventoryDeliveryTime;
    min: SkuInventoryDeliveryTime;
    shipping_method: SkuInventoryShippingMethod;
}

interface SkuInventoryDeliveryTime {
    hours: number | null;
    days: number | null;
}

interface SkuInventoryShippingMethod {
    formatted_free_over_amount: string | null;
    formatted_price_amount: string | null;
    free_over_amount_cents: number | null;
    name: string | null;
    price_amount_cents: number | null;
}

export interface SkuOption {
    id: string;
    name: string;
    formatted_price_amount: string;
    description: string;
    reference: string;
    price_amount_cents: number;
    price_amount_float: number;
    sku_code_regex: string;
    delay_days: number;
    delay_hours: number;
}

export interface Price {
    id: string;
    attributes: PriceAttributes;
}

interface PriceAttributes {
    sku_code: string;
    created_at: string;
    formatted_amount: string;
    currency_code: string;
    amount_float: number;
    amount_cents: number;
}

export interface LineItemAttributes {
    quantity: number;
    sku_code: string;
    name?: string;
    image_url?: string;
    _external_price: boolean;
    _update_quantity: boolean;
}

export interface LineItemRelationships {
    order: LineItemRelationshipsData;
    item?: LineItemRelationshipsData;
}

interface LineItemRelationshipsData {
    data: {
        type: string;
        id: string;
    };
}
