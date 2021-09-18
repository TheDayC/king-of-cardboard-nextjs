import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';
import PricingBreakdown from './PricingBreakdown';
import { ccyFormat } from '../../../utils/cart';

export const Summary: React.FC = () => {
    const { total } = useSelector(selector);

    return (
        <div className="flex flex-col">
            <div className="w-100">
                <h3>Order summary:</h3>
                <h3>&pound;{ccyFormat(total)}</h3>
            </div>
            <div className="w-100">{/* TODO: Add product summary */}</div>
            <div className="w-100">{/* TODO: Add coupon entry */}</div>
            <div className="w-100">
                <PricingBreakdown />
            </div>
        </div>
    );
};

export default Summary;
