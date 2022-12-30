import { DateTime } from 'luxon';
import Link from 'next/link';
import React from 'react';
import { BiEdit } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { BsBoxSeam, BsCalendarCheck, BsCalendarDate } from 'react-icons/bs';

import { Order as OrderObject } from '../../../types/orders';
import { formatOrderNumber } from '../../../utils/checkout';
import Badge from '../Badge';
import {
    getStatusColor,
    getStatusTitle,
    getPaymentStatusColor,
    getPaymentStatusTitle,
    getFulfillmentStatusColor,
    getFulfillmentStatusTitle,
} from '../../../utils/account';

interface OrderProps {
    order: OrderObject;
}

export const Order: React.FC<OrderProps> = ({ order }) => {
    const dispatch = useDispatch();
    const { _id: id, orderNumber, lastUpdated, created, items, orderStatus, paymentStatus, fulfillmentStatus } = order;
    const lastUpdatedDate = DateTime.fromISO(lastUpdated, { zone: 'Europe/London' });
    const createdDate = DateTime.fromISO(created, { zone: 'Europe/London' });

    const statusColor = getStatusColor(orderStatus);
    const statusTitle = getStatusTitle(orderStatus);
    const paymentColor = getPaymentStatusColor(paymentStatus);
    const paymentTitle = getPaymentStatusTitle(paymentStatus);
    const fulfillmentColor = getFulfillmentStatusColor(fulfillmentStatus);
    const fulfillmentTitle = getFulfillmentStatusTitle(fulfillmentStatus);

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <div className="card-body justify-between space-y-4">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl">Order {formatOrderNumber(orderNumber)}</h2>
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
                            Items: {items.length}
                        </p>
                    </div>
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
                <div className="card-actions justify-start">
                    <Link
                        href={{
                            pathname: '/account/orders/edit/[id]',
                            query: { id },
                        }}
                        passHref
                    >
                        <button className="btn btn-neutral rounded-md shadow-md">
                            <BiEdit className="inline-block text-xl mr-2" />
                            Edit
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Order;
