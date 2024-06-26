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
