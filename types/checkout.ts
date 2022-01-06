export interface FormErrors {
    [x: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PaymentAttributes {
    [x: string]: string;
}

export interface ShippingMethods {
    id: string;
    name: string;
    price_amount_cents: number;
    price_amount_float: number;
    price_amount_for_shipment_cents: number;
    price_amount_for_shipment_float: number;
    currency_code: string;
    formatted_price_amount: string;
    formatted_price_amount_for_shipment: string;
}

export interface DeliveryLeadTimes {
    id: string;
    minHours: number;
    maxHours: number;
    minDays: number;
    maxDays: number;
}

export interface MergedShipmentMethods extends ShippingMethods {
    leadTimes: DeliveryLeadTimes | null;
}
