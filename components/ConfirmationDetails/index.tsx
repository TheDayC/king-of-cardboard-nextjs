import React from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoLocationSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import selector from './selector';

export const ConfirmationDetails: React.FC = () => {
    const { customerDetails, billingAddress, shippingAddress } = useSelector(selector);
    const { firstName, lastName, email, phone } = customerDetails;

    return (
        <div className="card shadow-md rounded-md p-2 lg:p-8">
            <div className="flex justify-center items-center">
                <BsCheck2Circle className="text-success w-24 h-24" />
            </div>
            <div className="card-body justify-center p-2">
                <h1 className="card-tite text-center text-3xl mb-4">Thank you {firstName}!</h1>
                <p className="text-sm text-center text-base-300">
                    Your order has been confirmed and will be shipped as soon as possible.
                </p>
                <div className="divider"></div>
                <div className="flex flex-col">
                    <div className="flex-1 flex-col mb-4">
                        <h4 className="text-lg font-bold">Email Address:</h4>
                        <p>{email}</p>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between">
                        <div className="flex mb-4 lg:mb-0 flex-col">
                            <h4 className="text-lg font-bold">Billing Address:</h4>
                            <div className="flex flex-row justify-start align-start space-x-2">
                                <IoLocationSharp className="mt-1 text-secondary" />
                                <div className="text-sm">
                                    <p>
                                        {firstName} {lastName}
                                    </p>
                                    <p>{billingAddress.lineOne}</p>
                                    {billingAddress.lineTwo.length > 0 && <p>{billingAddress.lineTwo}</p>}
                                    <p>{billingAddress.city}</p>
                                    <p>{billingAddress.postcode}</p>
                                    <p>{billingAddress.county}</p>
                                    <p>{phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-lg font-bold">Shipping Address:</h4>
                            <div className="flex flex-row justify-start align-start space-x-2">
                                <IoLocationSharp className="mt-1 text-secondary" />
                                <div className="text-sm">
                                    <p>
                                        {firstName} {lastName}
                                    </p>
                                    <p>{shippingAddress.lineOne}</p>
                                    {shippingAddress.lineTwo.length > 0 && <p>{shippingAddress.lineTwo}</p>}
                                    <p>{shippingAddress.city}</p>
                                    <p>{shippingAddress.postcode}</p>
                                    <p>{shippingAddress.county}</p>
                                    <p>{phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDetails;
