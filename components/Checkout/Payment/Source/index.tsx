import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import Loading from '../../../Loading';

interface SourceProps {
    sourceType: string;
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

export const Source: React.FC<SourceProps> = ({ sourceType }) => {
    switch (sourceType) {
        case 'stripe_payments':
            return (
                <div className="card bordered rounded-md">
                    <div className="card-body p-2 ">
                        <CardElement options={STRIPE_OPTIONS} />
                    </div>
                </div>
            );
        case 'paypal_payments':
        default:
            return null;
    }
};

export default Source;
