import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from '@paypal/paypal-js';

import { PaymentMethods } from '../../../../enums/checkout';

interface SourceProps {
    paymentMethod: PaymentMethods;
    isCurrentlyDisplayed: boolean;
    handleCreateOrder: (data: CreateOrderData, actions: CreateOrderActions) => Promise<string>;
    handleOnApprove: (data: OnApproveData, actions: OnApproveActions) => Promise<void>;
}

const STRIPE_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#676767',
            '::placeholder': {
                color: '#cccccc',
            },
            padding: '2px',
        },
        invalid: {
            color: '#ff5724',
        },
    },
    hidePostalCode: true,
};

export const Source: React.FC<SourceProps> = ({
    paymentMethod,
    isCurrentlyDisplayed,
    handleCreateOrder,
    handleOnApprove,
}) => {
    switch (paymentMethod) {
        case PaymentMethods.Stripe:
            return isCurrentlyDisplayed ? (
                <div className="card bordered rounded-md">
                    <div className="card-body p-2 ">
                        <CardElement options={STRIPE_OPTIONS} />
                    </div>
                </div>
            ) : null;
        case PaymentMethods.PayPal:
        default:
            return (
                <div className="flex flex-col items-end w-full">
                    <PayPalButtons
                        style={{ layout: 'vertical', label: 'checkout', height: 48 }}
                        fundingSource="paypal"
                        className="w-full lg:w-1/4"
                        createOrder={handleCreateOrder}
                        onApprove={handleOnApprove}
                    />
                </div>
            );
    }
};

export default Source;
