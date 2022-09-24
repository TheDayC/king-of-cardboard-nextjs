export interface CreateToken {
    token: string | null;
    expires: string;
}

export interface CommerceAuthProps {
    accessToken: string;
    expires: string;
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
    description: string;
    amount: string;
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

export interface PricesWithSku {
    sku: string;
    amount: string;
    compareAmount: string;
}
