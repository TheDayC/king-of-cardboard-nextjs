import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';

interface CartTotalsProps {
    isConfirmation: boolean;
}

export const Totals: React.FC<CartTotalsProps> = ({ isConfirmation }) => {
    const {
        cartSubTotal,
        cartShipping,
        cartDiscount,
        cartTotal,
        confirmationSubTotal,
        confirmationShipping,
        confirmationTotal,
        confirmationDiscount,
    } = useSelector(selector);
    const subTotal = isConfirmation ? confirmationSubTotal : cartSubTotal;
    const shipping = isConfirmation ? confirmationShipping : cartShipping;
    const discount = isConfirmation ? confirmationDiscount : cartDiscount;
    const total = isConfirmation ? confirmationTotal : cartTotal;

    return (
        <div className="flex flex-col">
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b border-gray-300 p-2 lg:p-4">
                <p className="text-xl">Subtotal</p>
                <p className="text-xl">{subTotal}</p>
            </div>
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b border-gray-300 p-2 lg:p-4">
                <p className="text-xl">Shipping</p>
                <p className="text-xl">{shipping}</p>
            </div>
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b border-gray-300 p-2 lg:p-4">
                <p className="text-xl">Discount</p>
                <p className="text-xl">{discount}</p>
            </div>
            <div className="flex flex-row w-full justify-end align-center space-x-2 p-2 lg:p-4">
                <p className="text-xl lg:text-3xl font-semibold">Total</p>
                <p className="text-xl lg:text-3xl font-semibold">{total}</p>
            </div>
        </div>
    );
};

export default Totals;
