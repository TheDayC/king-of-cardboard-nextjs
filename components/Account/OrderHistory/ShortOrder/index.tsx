import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DateTime } from 'luxon';
import { BsBoxSeam, BsCalendarCheck, BsCalendarDate } from 'react-icons/bs';

import {
    getStatusColor,
    getStatusTitle,
    getPaymentStatusColor,
    getPaymentStatusTitle,
    getFulfillmentStatusColor,
    getFulfillmentStatusTitle,
} from '../../../../utils/account';
import { Status, Payment, Fulfillment } from '../../../../enums/orders';
import { CartItem } from '../../../../types/cart';
import { formatOrderNumber } from '../../../../utils/checkout';
import Badge from '../../Badge';

interface OrderProps {
    orderNumber: number;
    orderStatus: Status;
    paymentStatus: Payment;
    fulfillmentStatus: Fulfillment;
    total: string;
    created: string;
    lastUpdated: string;
    lineItems: CartItem[];
    itemCount: number;
}

export const ShortOrder: React.FC<OrderProps> = ({
    orderNumber,
    orderStatus,
    paymentStatus,
    fulfillmentStatus,
    total,
    created,
    lastUpdated,
    lineItems,
    itemCount,
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
        <div className="card card-side bordered rounded-md w-full">
            <div className="card-body p-2 md:p-4">
                <div className="flex flex-row justify-between items-center space-x-4">
                    <div className="flex flex-col space-y-4">
                        {orderNumber > 0 && (
                            <Link
                                href={{
                                    pathname: '/account/order-history/[orderNumber]',
                                    query: { orderNumber },
                                }}
                                passHref
                            >
                                <h3 className="card-title text-xl hover:underline">
                                    Order {formatOrderNumber(orderNumber)}
                                </h3>
                            </Link>
                        )}
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
                        <div className="flex flex-row space-x-4">
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
                        <div className="flex flex-row">
                            <p className="text-xl">
                                <b>Total:</b> {total}
                            </p>
                        </div>
                    </div>
                    {lineItems && (
                        <div className="flex">
                            <div className="stack">
                                {lineItems
                                    .filter((item) => item.sku)
                                    .map((lineItem) => (
                                        <div className="relative w-32 h-32" key={lineItem._id}>
                                            <Image
                                                src={lineItem.mainImage.url || 'http://placeimg.com/128/128/tech'}
                                                alt="order item image"
                                                width={128}
                                                height={128}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShortOrder;
