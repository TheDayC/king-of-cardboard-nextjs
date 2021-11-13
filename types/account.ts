import { CommerceLayerMeta, CommerceLayerResponse } from './api';

export interface GetOrders {
    orders: CommerceLayerResponse[] | null;
    included: CommerceLayerResponse[] | null;
    meta: CommerceLayerMeta | null;
}

export interface OrderHistoryLineItem {
    id: string;
    type: string;
    sku_code: string | null;
    image_url: string | null;
    quantity: number;
}
