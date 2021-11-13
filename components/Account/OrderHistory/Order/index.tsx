import React from 'react';
import Link from 'next/link';
import { DateTime } from 'luxon';

import { statusColour, paymentStatusColour, fulfillmentStatusColour } from '../../../../utils/account';

interface OrderProps {
    orderNumber: number | null;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    itemCount: number;
    shipmentsCount: number;
    total: string;
    placedAt: string;
    updatedAt: string;
}

export const Order: React.FC<OrderProps> = ({
    orderNumber,
    status,
    paymentStatus,
    fulfillmentStatus,
    itemCount,
    shipmentsCount,
    total,
    placedAt,
    updatedAt,
}) => {
    const placedAtDate = DateTime.fromISO(placedAt, { zone: 'Europe/London' });
    const updatedAtDate = DateTime.fromISO(updatedAt, { zone: 'Europe/London' });

    return (
        <div className="card card-side bordered rounded-md mb-4">
            <div className="card-body p-4">
                <h3 className="card-title mb-2">
                    {orderNumber && (
                        <Link href={`/account/orderHistory/${orderNumber}`}>{`Order #${orderNumber}`}</Link>
                    )}
                </h3>
                <div className="flex flex-row mb-2">
                    <p className="text-xs text-gray-400">Placed on: {placedAtDate.toFormat('MMM dd, y')}</p>
                    <p className="text-xs text-gray-400 ml-2">Updated on: {updatedAtDate.toFormat('MMM dd, y')}</p>
                </div>
                <div className="flex flex-row mb-2">
                    <p className="text-xs text-gray-400 mr-2">
                        <b>Items:</b> {itemCount}
                    </p>
                    <p className="text-xs text-gray-400">
                        <b>Shipments:</b> {shipmentsCount}
                    </p>
                </div>
                <div className="flex flex-row mb-2">
                    <div className="flex flex-row justify-center items-center mr-4">
                        <div className={`rounded-full w-3 h-3 bg-${statusColour(status)}-400 mr-2`}></div>
                        <p className="capitalize">{status}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center mr-4">
                        <div className={`rounded-full w-3 h-3 bg-${paymentStatusColour(paymentStatus)}-400 mr-2`}></div>
                        <p className="capitalize">{paymentStatus}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center mr-4">
                        <div
                            className={`rounded-full w-3 h-3 bg-${fulfillmentStatusColour(fulfillmentStatus)}-400 mr-2`}
                        ></div>
                        <p className="capitalize">{fulfillmentStatus}</p>
                    </div>
                </div>
                <div className="flex flex-row">
                    <p className="text-xl">
                        <b>Total:</b> {total}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Order;
