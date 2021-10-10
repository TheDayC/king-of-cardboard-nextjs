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
    name: string;
    image_url: string;
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
