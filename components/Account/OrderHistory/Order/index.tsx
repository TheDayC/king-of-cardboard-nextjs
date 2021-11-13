import React from 'react';
import Link from 'next/link';

import { statusColour, paymentStatusColour, fulfillmentStatusColour } from '../../../../utils/account';

interface OrderProps {
    orderNumber: number | null;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    itemCount: number;
    shipmentsCount: number;
    total: string;
}

export const Order: React.FC<OrderProps> = ({
    orderNumber,
    status,
    paymentStatus,
    fulfillmentStatus,
    itemCount,
    shipmentsCount,
    total,
}) => {
    return (
        <div className="card card-side bordered rounded-md mb-4">
            <div className="card-body p-4">
                <h3 className="card-title">
                    {orderNumber && <Link href={`/account/orderHistory/${orderNumber}`}>{`#${orderNumber}`}</Link>}
                </h3>
                <div className="flex flex-row mb-2">
                    <div className="flex flex-row justify-center items-center mr-4">
                        <div className={`rounded-full w-3 h-3 bg-${statusColour(status)}-500 mr-2`}></div>
                        <p>{status}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center mr-4">
                        <div className={`rounded-full w-3 h-3 bg-${paymentStatusColour(paymentStatus)}-500 mr-2`}></div>
                        <p>{paymentStatus}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center mr-4">
                        <div
                            className={`rounded-full w-3 h-3 bg-${fulfillmentStatusColour(fulfillmentStatus)}-500 mr-2`}
                        ></div>
                        <p>{fulfillmentStatus}</p>
                    </div>
                </div>
                <div className="flex flex-row">
                    <p>
                        <b>Items:</b> {itemCount}
                    </p>
                    <span className="mx-2">-</span>
                    <p>
                        <b>Shipments:</b> {shipmentsCount}
                    </p>
                    <span className="mx-2">-</span>
                    <p>
                        <b>Total:</b> {total}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Order;
