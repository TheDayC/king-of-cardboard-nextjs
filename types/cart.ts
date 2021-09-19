import { Order } from '@commercelayer/sdk/lib/resources/orders';

export interface FullCartItem {
    amount: number;
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
}

export interface CartStaticProps {
    order: Order | null;
}
