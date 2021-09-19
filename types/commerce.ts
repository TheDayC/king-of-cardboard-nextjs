import { CartStaticProps } from './cart';
import { Product } from './products';

export interface CommerceAuthProps {
    accessToken: string;
    expires: string;
}

export interface CommerceProductProps {
    products: Product[] | null;
}

export interface CommerceStaticProps extends CommerceAuthProps, CommerceProductProps, CartStaticProps {}

export interface ShippingMethods {
    id: string;
    name?: string;
    currency_code?: string;
    formatted_price_amount?: string;
    formatted_price_amount_for_shipment?: string;
    price_amount_cents?: number;
    price_amount_float?: number;
    price_amount_for_shipment_cents?: number;
    price_amount_for_shipment_float?: number;
    type: string;
}
