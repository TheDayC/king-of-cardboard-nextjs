import { CommerceLayerMeta, CommerceLayerResponse } from './api';

export interface GetOrders {
    orders: CommerceLayerResponse[] | null;
    included: CommerceLayerResponse[] | null;
    meta: CommerceLayerMeta | null;
}
