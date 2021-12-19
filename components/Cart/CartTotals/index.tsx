import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';

interface CartTotalsProps {
    isConfirmation: boolean;
}

export const CartTotals: React.FC<CartTotalsProps> = ({ isConfirmation }) => {
    const { cartOrder, confirmationOrder } = useSelector(selector);
    const order = isConfirmation ? confirmationOrder : cartOrder;

    const subTotal = order && order.formatted_subtotal_amount ? order.formatted_subtotal_amount : null;
    // const discount = order && order.formatted_discount_amount ? order.formatted_discount_amount : null;
    const shipping = order && order.formatted_shipping_amount ? order.formatted_shipping_amount : null;
    const total = order && order.formatted_total_amount_with_taxes ? order.formatted_total_amount_with_taxes : null;

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
                <p className="text-xl lg:text-3xl font-semibold">Total</p>
                <p className="text-xl lg:text-3xl font-semibold">{total}</p>
            </div>
        </div>
    );
};

export default CartTotals;
