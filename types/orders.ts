import { PaymentMethods } from '../enums/checkout';
import { Status, Payment, Fulfillment } from '../enums/orders';
import { CartItem } from './cart';
import { Address, CustomerDetails } from './checkout';

export interface Order {
    _id: string;
    userId: string;
    email: string;
    orderStatus: Status;
    paymentStatus: Payment;
    fulfillmentStatus: Fulfillment;
    items: CartItem[];
    created: string;
    lastUpdated: string;
    subTotal: number;
    discount: number;
    shipping: number;
    total: number;
    customerDetails: CustomerDetails;
    shippingAddress: Address;
    billingAddress: Address;
    paymentId: string;
    paymentMethod: PaymentMethods;
    orderNumber: number;
    shippingMethodId: string;
}

export interface ListOrders {
    orders: Order[];
    count: number;
}
