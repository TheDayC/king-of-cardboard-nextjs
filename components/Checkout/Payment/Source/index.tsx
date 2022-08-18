import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

interface SourceProps {
    sourceType: string;
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

export const Source: React.FC<SourceProps> = ({ sourceType, isCurrentlyDisplayed }) => {
    switch (sourceType) {
        case 'stripe_payments':
            return isCurrentlyDisplayed ? (
                <div className="card bordered rounded-md">
                    <div className="card-body p-2 ">
                        <CardElement options={STRIPE_OPTIONS} />
                    </div>
                </div>
            ) : null;
        case 'paypal_payments':
        default:
            return null;
    }
};

export default Source;
