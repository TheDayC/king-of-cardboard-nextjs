import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';

export const CartTotals: React.FC = () => {
    const { subTotal, shipping, discount, total } = useSelector(selector);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b p-4">
                <p className="text-sm lg:text-xl">Subtotal</p>
                <p className="text-sm lg:text-xl">{subTotal}</p>
            </div>
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b p-4">
                <p className="text-sm lg:text-xl">Shipping</p>
                <p className="text-sm lg:text-xl">{shipping}</p>
            </div>
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b p-4">
                <p className="text-sm lg:text-xl">Discount</p>
                <p className="text-sm lg:text-xl">{discount}</p>
            </div>
            <div className="flex flex-row w-full justify-end align-center space-x-2 border-b p-4">
                <p className="text-xl lg:text-3xl font-semibold">Total</p>
                <p className="text-xl lg:text-3xl font-semibold">{total}</p>
            </div>
        </div>
    );
};

export default CartTotals;
