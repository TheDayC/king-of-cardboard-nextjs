import { Order } from '@commercelayer/sdk/lib/resources/orders';

import { Product } from './products';

export interface FullCartItem extends Product {
    quantity: number;
}

export interface CartStaticProps {
    order: Order | null;
}
