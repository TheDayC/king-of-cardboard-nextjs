import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCartTotals } from '../../../store/slices/cart';
import selector from './selector';

interface CartTotalsProps {
    isConfirmation: boolean;
}

export const CartTotals: React.FC<CartTotalsProps> = ({ isConfirmation }) => {
    const { accessToken, orderId, subTotal, shipping, total } = useSelector(selector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && orderId) {
            dispatch(fetchCartTotals({ accessToken, orderId }));
        }
    }, [dispatch, accessToken, orderId]);

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
