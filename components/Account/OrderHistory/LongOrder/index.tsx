import React from 'react';
import { DateTime } from 'luxon';
import { IoLocationSharp } from 'react-icons/io5';
import { BsBoxSeam, BsCalendarCheck, BsCalendarDate } from 'react-icons/bs';

import {
    getStatusColor,
    getPaymentStatusColor,
    getFulfillmentStatusColor,
    getStatusTitle,
    getPaymentStatusTitle,
    getFulfillmentStatusTitle,
} from '../../../../utils/account';
import LineItem from './LineItem';
import { Status, Payment, Fulfillment } from '../../../../enums/orders';
import { CartItem } from '../../../../types/cart';
import { Address } from '../../../../types/checkout';
import { PaymentMethods } from '../../../../enums/checkout';
import { getPrettyPrice } from '../../../../utils/account/products';
import { formatOrderNumber } from '../../../../utils/checkout';
import Badge from '../Badge';

interface OrderProps {
    orderNumber: number;
    orderStatus: Status;
    paymentStatus: Payment;
    fulfillmentStatus: Fulfillment;
    subTotal: number;
    shipping: number;
    discount: number;
    total: number;
    created: string;
    lastUpdated: string;
    items: CartItem[];
    itemCount: number;
    shippingAddress: Address;
    billingAddress: Address;
    paymentId: string;
    paymentMethod: PaymentMethods;
}

export const LongOrder: React.FC<OrderProps> = ({
    orderNumber,
    orderStatus,
    paymentStatus,
    fulfillmentStatus,
    subTotal,
    shipping,
    discount,
    total,
    created,
    lastUpdated,
    items,
    itemCount,
    shippingAddress,
    billingAddress,
    /*  paymentId,
    paymentMethod, */
}) => {
    const createdDate = DateTime.fromISO(created, { zone: 'Europe/London' });
    const lastUpdatedDate = DateTime.fromISO(lastUpdated, { zone: 'Europe/London' });

    const statusColor = getStatusColor(orderStatus);
    const statusTitle = getStatusTitle(orderStatus);
    const paymentColor = getPaymentStatusColor(paymentStatus);
    const paymentTitle = getPaymentStatusTitle(paymentStatus);
    const fulfillmentColor = getFulfillmentStatusColor(fulfillmentStatus);
    const fulfillmentTitle = getFulfillmentStatusTitle(fulfillmentStatus);

    return (
        <div className="flex w-full flex-col space-y-4">
            <h1 className="text-5xl">Order {formatOrderNumber(orderNumber)}</h1>
            <div className="flex flex-row items-start justify-start space-x-4">
                <p className="text-sm text-gray-400">
                    <BsCalendarDate className="w-5 h-5 inline mr-2 -mt-1" />
                    Placed on: {createdDate.toFormat('MMM dd, y')}
                </p>
                <p className="text-sm text-gray-400">
                    <BsCalendarCheck className="w-5 h-5 inline mr-2 -mt-1" />
                    Last updated on: {lastUpdatedDate.toFormat('MMM dd, y')}
                </p>
                <p className="text-sm text-gray-400">
                    <BsBoxSeam className="w-5 h-5 inline mr-2 -mt-1" />
                    Items: {itemCount}
                </p>
            </div>
            <div className="divider lightDivider"></div>
            <div className="flex flex-row w-full space-x-6">
                <div className="flex flex-row justify-start items-center text-lg space-x-2">
                    <Badge color={statusColor} />
                    <h3 className="font-bold">Order:</h3>
                    <p className="capitalize">{statusTitle}</p>
                </div>
                <div className="flex flex-row justify-start items-center text-lg space-x-2">
                    <Badge color={paymentColor} />
                    <h3 className="font-bold">Payment:</h3>
                    <p className="capitalize">{paymentTitle}</p>
                </div>
                <div className="flex flex-row justify-start items-center mr-0 text-lg space-x-2">
                    <Badge color={fulfillmentColor} />
                    <h3 className="font-bold">Fulfillment:</h3>
                    <p className="capitalize">{fulfillmentTitle}</p>
                </div>
            </div>
            {/* paymentMethodDetails && (
                <React.Fragment>
                    <div className="divider lightDivider"></div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl mb-4">Payment Method</h3>
                        <div className="flex flex-row justify-start items-start">
                            <div className="brand text-3xl text-secondary mr-2">
                                {cardLogo(paymentMethodDetails.brand)}
                            </div>
                            <p className="mr-2">**** {paymentMethodDetails.last4}</p>
                            <p className="text-gray-300">
                                ({paymentMethodDetails.exp_month}/{paymentMethodDetails.exp_year})
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            ) */}
            <div className="divider lightDivider"></div>
            <div className="flex flex-row justify-start items-start w-full space-x-10">
                <div className="flex flex-col space-y-4">
                    <h4 className="text-2xl font-bold">Billing Address</h4>
                    <div className="flex flex-row justify-start align-start space-x-2">
                        <IoLocationSharp className="mt-1 text-accent" />
                        {
                            <div className="text-md">
                                <p>{billingAddress.lineOne}</p>
                                {billingAddress.lineTwo.length > 0 && <p>{billingAddress.lineTwo}</p>}
                                <p>{billingAddress.city}</p>
                                <p>{billingAddress.postcode}</p>
                                <p>{billingAddress.county}</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h4 className="text-2xl font-bold">Shipping Address</h4>
                    <div className="flex flex-row justify-start align-start space-x-2">
                        <IoLocationSharp className="mt-1 text-accent" />
                        {
                            <div className="text-md">
                                <p>{shippingAddress.lineOne}</p>
                                {shippingAddress.lineTwo.length > 0 && <p>{shippingAddress.lineTwo}</p>}
                                <p>{shippingAddress.city}</p>
                                <p>{shippingAddress.postcode}</p>
                                <p>{shippingAddress.county}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="divider lightDivider"></div>
            <div className="flex flex-col justify-start items-start w-full space-y-4">
                <h3 className="text-2xl font-bold">Items</h3>
                {items.length > 0 &&
                    items.map((lineItem) => (
                        <React.Fragment key={lineItem._id}>
                            <LineItem
                                name={lineItem.title}
                                slug={lineItem.slug}
                                imageUrl={lineItem.mainImage.url}
                                skuCode={lineItem.sku}
                                quantity={lineItem.quantity}
                                amount={getPrettyPrice(lineItem.price)}
                            />

                            <div className="divider lightDivider w-full"></div>
                        </React.Fragment>
                    ))}
            </div>
            <div className="flex flex-col justify-end items-end space-y-4">
                <p className="text-2xl border-b border-gray-400 pb-4 w-1/4 text-right">
                    <b>Shipping:</b> {getPrettyPrice(shipping)}
                </p>
                <p className="text-2xl border-b border-gray-400 pb-4 w-1/4 text-right">
                    <b>Discount:</b> {getPrettyPrice(discount)}
                </p>
                <p className="text-2xl border-b border-gray-400 pb-4 w-1/4 text-right">
                    <b>Subtotal:</b> {getPrettyPrice(subTotal)}
                </p>
                <p className="text-5xl">
                    <b>Total:</b> {getPrettyPrice(total)}
                </p>
            </div>
        </div>
    );
};

export default LongOrder;
