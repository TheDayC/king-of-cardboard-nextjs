import React from 'react';
import { useSelector } from 'react-redux';

import Steps from './Steps';
import selector from './selector';
import Summary from './Summary';

export const Checkout: React.FC = () => {
    const { fullCartItemData } = useSelector(selector);

    return (
        <div className="grid grid-cols-2">
            <div className="card">
                <div className="card-body">
                    <Steps />
                </div>
            </div>
            <Summary />
        </div>
    );
};

export default Checkout;
