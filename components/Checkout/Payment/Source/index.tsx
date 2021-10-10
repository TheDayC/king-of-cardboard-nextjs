import { CardElement } from '@stripe/react-stripe-js';
import React from 'react';

interface SourceProps {
    sourceType: string;
}

export const Source: React.FC<SourceProps> = ({ sourceType }) => {
    switch (sourceType) {
        case 'stripe_payments':
            return (
                <CardElement
                    options={{
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
                    }}
                />
            );
        default:
            return null;
    }
};

export default Source;
