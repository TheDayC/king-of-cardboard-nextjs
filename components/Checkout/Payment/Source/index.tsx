import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

import { PaymentMethods } from '../../../../enums/checkout';

interface SourceProps {
    paymentMethod: PaymentMethods;
    isCurrentlyDisplayed: boolean;
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

export const Source: React.FC<SourceProps> = ({ paymentMethod, isCurrentlyDisplayed }) => {
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
            return null;
    }
};

export default Source;
