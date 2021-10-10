import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

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
            return <CardElement options={STRIPE_OPTIONS} />;
        default:
            return null;
    }
};

export default Source;
