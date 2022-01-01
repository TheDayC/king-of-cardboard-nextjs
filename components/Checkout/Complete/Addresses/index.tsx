import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import selector from './selector';

export const Addresses: React.FC = () => {
    const { customerDetails, billingAddress, shippingAddress } = useSelector(selector);

    return (
        <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex mb-4 lg:mb-0 flex-col">
                <h4 className="text-lg font-bold">Billing Address:</h4>
                <div className="flex flex-row justify-start align-start space-x-2">
                    <IoLocationSharp className="mt-1 text-secondary" />
                    <div className="text-sm">
                        <p>
                            {customerDetails.first_name || ''} {customerDetails.last_name || ''}
                        </p>
                        <p>{billingAddress.line_1 || ''}</p>
                        {billingAddress.line_2 && <p>{billingAddress.line_2}</p>}
                        <p>{billingAddress.city || ''}</p>
                        <p>{billingAddress.zip_code || ''}</p>
                        <p>{billingAddress.state_code || ''}</p>
                        <p>{customerDetails.phone || ''}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <h4 className="text-lg font-bold">Shipping Address:</h4>
                <div className="flex flex-row justify-start align-start space-x-2">
                    <IoLocationSharp className="mt-1 text-secondary" />
                    <div className="text-sm">
                        <p>
                            {customerDetails.first_name || ''} {customerDetails.last_name || ''}
                        </p>
                        <p>{shippingAddress.line_1 || ''}</p>
                        {shippingAddress.line_2 && <p>{shippingAddress.line_2}</p>}
                        <p>{shippingAddress.city || ''}</p>
                        <p>{shippingAddress.zip_code || ''}</p>
                        <p>{shippingAddress.state_code || ''}</p>
                        <p>{customerDetails.phone || ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addresses;
