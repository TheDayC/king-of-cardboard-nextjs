import React from 'react';
import { DateTime } from 'luxon';
import { IoLocationSharp } from 'react-icons/io5';

import { statusColour, paymentStatusColour, fulfillmentStatusColour, cardLogo } from '../../../../utils/account';
import {
    OrderHistoryAddress,
    OrderHistoryPaymentMethod,
    OrderHistoryLineItemWithSkuData,
} from '../../../../types/account';
import LineItem from './LineItem';

interface OrderProps {
    orderNumber: string | null;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    itemCount: number;
    shipmentsCount: number;
    subTotal: string;
    shippingTotal: string;
    discountTotal: string;
    total: string;
    placedAt: string;
    updatedAt: string;
    lineItems: OrderHistoryLineItemWithSkuData[] | null;
    shippingAddress: OrderHistoryAddress;
    billingAddress: OrderHistoryAddress;
    paymentMethodDetails: OrderHistoryPaymentMethod | null;
}

export const LongOrder: React.FC<OrderProps> = ({
    orderNumber,
    status,
    paymentStatus,
    fulfillmentStatus,
    itemCount,
    shipmentsCount,
    subTotal,
    shippingTotal,
    discountTotal,
    total,
    placedAt,
    updatedAt,
    lineItems,
    shippingAddress,
    billingAddress,
    paymentMethodDetails,
}) => {
    const placedAtDate = DateTime.fromISO(placedAt, { zone: 'Europe/London' });
    const updatedAtDate = DateTime.fromISO(updatedAt, { zone: 'Europe/London' });

    return (
        <div className="flex w-full flex-col">
            <h1 className="text-3xl mb-2">{`Order #${orderNumber}`}</h1>
            <div className="flex flex-row mb-2">
                <p className="text-xs text-gray-400">Placed on: {placedAtDate.toFormat('MMM dd, y')}</p>
                <p className="text-xs text-gray-400 ml-2">Updated on: {updatedAtDate.toFormat('MMM dd, y')}</p>
            </div>
            <div className="flex flex-row">
                <p className="text-xs text-gray-400 mr-2">
                    <b>Items:</b> {itemCount}
                </p>
                <p className="text-xs text-gray-400">
                    <b>Shipments:</b> {shipmentsCount}
                </p>
            </div>
            <div className="divider lightDivider"></div>
            <div className="flex flex-row w-full">
                <div className="flex flex-row justify-center items-center">
                    <h3 className="text-lg mr-2">Order:</h3>
                    <div className={`rounded-full w-3 h-3 bg-${statusColour(status)}-400 mr-2`}></div>
                    <p className="capitalize">{status}</p>
                </div>
                <div className="divider divider-vertical lightDivider"></div>
                <div className="flex flex-row justify-center items-center">
                    <h3 className="text-lg mr-2">Payment:</h3>
                    <div className={`rounded-full w-3 h-3 bg-${paymentStatusColour(paymentStatus)}-400 mr-2`}></div>
                    <p className="capitalize">{paymentStatus}</p>
                </div>
                <div className="divider divider-vertical lightDivider"></div>
                <div className="flex flex-row justify-center items-center">
                    <h3 className="text-lg mr-2">Fulfillment:</h3>
                    <div
                        className={`rounded-full w-3 h-3 bg-${fulfillmentStatusColour(fulfillmentStatus)}-400 mr-2`}
                    ></div>
                    <p className="capitalize">{fulfillmentStatus}</p>
                </div>
            </div>
            {paymentMethodDetails && (
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
            )}
            <div className="divider lightDivider"></div>
            <div className="flex flex-row justify-start items-start w-full">
                <div className="flex flex-col">
                    <h4 className="text-2xl mb-4">Billing Address</h4>
                    <div className="flex flex-row justify-start align-start space-x-2">
                        <IoLocationSharp className="mt-1 text-accent" />
                        {
                            <div className="text-md">
                                <p>
                                    {billingAddress.first_name || ''} {billingAddress.last_name || ''}
                                </p>
                                <p>{billingAddress.line_1 || ''}</p>
                                {billingAddress.line_2 && <p>{billingAddress.line_2}</p>}
                                <p>{billingAddress.city || ''}</p>
                                <p>{billingAddress.zip_code || ''}</p>
                                <p>{billingAddress.state_code || ''}</p>
                                <p>{billingAddress.phone || ''}</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="divider divider-vertical lightDivider"></div>
                <div className="flex flex-col">
                    <h4 className="text-2xl mb-4">Shipping Address</h4>
                    <div className="flex flex-row justify-start align-start space-x-2">
                        <IoLocationSharp className="mt-1 text-accent" />
                        {
                            <div className="text-md">
                                <p>
                                    {shippingAddress.first_name || ''} {shippingAddress.last_name || ''}
                                </p>
                                <p>{shippingAddress.line_1 || ''}</p>
                                {shippingAddress.line_2 && <p>{shippingAddress.line_2}</p>}
                                <p>{shippingAddress.city || ''}</p>
                                <p>{shippingAddress.zip_code || ''}</p>
                                <p>{shippingAddress.state_code || ''}</p>
                                <p>{shippingAddress.phone || ''}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="divider lightDivider"></div>
            <div className="flex flex-col justify-start items-start w-full">
                <h3 className="text-2xl mb-4">Items</h3>
                {lineItems &&
                    lineItems.map((lineItem) => (
                        <React.Fragment key={lineItem.lineItemId}>
                            <LineItem
                                name={lineItem.name}
                                imageUrl={lineItem.imageUrl}
                                skuCode={lineItem.skuCode}
                                quantity={lineItem.quantity}
                                amount={lineItem.amount}
                                //compareAmount={lineItem.compareAmount}
                            />

                            <div className="divider lightDivider w-full"></div>
                        </React.Fragment>
                    ))}
            </div>
            <div className="flex flex-col justify-end items-end">
                <p className="text-md mb-2">
                    <b>Shipping:</b> {shippingTotal}
                </p>
                <p className="text-md mb-2">
                    <b>Discount:</b> {discountTotal}
                </p>
                <p className="text-md mb-4">
                    <b>Subtotal:</b> {subTotal}
                </p>
                <p className="text-3xl">
                    <b>Total:</b> {total}
                </p>
            </div>
        </div>
    );
};

export default LongOrder;
