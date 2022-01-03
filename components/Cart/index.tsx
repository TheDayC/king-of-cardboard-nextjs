import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import { resetConfirmationDetails } from '../../store/slices/confirmation';
import Loading from '../Loading';
import {
    fetchCartItems,
    fetchCartTotals,
    fetchItemCount,
    setShouldUpdateCart,
    setUpdatingCart,
} from '../../store/slices/cart';

export const Cart: React.FC = () => {
    const { itemCount, items, isUpdatingCart, accessToken, orderId, shouldUpdateCart } = useSelector(selector);
    const dispatch = useDispatch();
    const [shouldFetch, setShouldFetch] = useState(true);
    const itemPlural = itemCount === 1 ? 'item' : 'items';

    // Catch all function to update the primary aspects of the cart.
    const updateCart = useCallback(() => {
        if (!accessToken || !orderId) return;
        dispatch(fetchCartItems({ accessToken, orderId }));
        dispatch(fetchCartTotals({ accessToken, orderId }));
        dispatch(fetchItemCount({ accessToken, orderId }));
        dispatch(setUpdatingCart(false));
    }, [dispatch, accessToken, orderId]);

    useEffect(() => {
        dispatch(resetConfirmationDetails());
    }, [dispatch]);

    useEffect(() => {
        if (shouldFetch) {
            setShouldFetch(false);
            updateCart();
        }
    }, [dispatch, shouldFetch, updateCart]);

    useEffect(() => {
        if (shouldUpdateCart) {
            dispatch(setShouldUpdateCart(false));
            updateCart();
        }
    }, [dispatch, updateCart, shouldUpdateCart]);

    return (
        <div className="flex flex-col">
            <h1 className="mb-4 text-2xl lg:mb-8 lg:text-4xl">{`Cart (${itemCount} ${itemPlural})`}</h1>
            {itemCount > 0 ? (
                <div className="overflow-x-auto relative">
                    <Loading show={isUpdatingCart} />
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-3 bg-neutral text-neutral-content p-2 rounded-md text-sm lg:text-md lg:p-4 lg:grid-cols-5">
                            <div className="text-center hidden lg:table-cell">Remove</div>
                            <div className="text-center">Product</div>
                            <div className="text-center hidden lg:table-cell">Price</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-center">Total</div>
                        </div>
                        <div className="flex flex-col w-full">
                            {items &&
                                items.map((item) => (
                                    <CartItem
                                        id={item.id}
                                        sku={item.sku_code}
                                        name={item.name}
                                        image={item.image}
                                        unitAmount={item.formatted_unit_amount}
                                        totalAmount={item.formatted_total_amount}
                                        quantity={item.quantity}
                                        stock={item.stock}
                                        key={item.name}
                                    />
                                ))}
                        </div>
                        <CartTotals isConfirmation={false} />
                        <div className="flex flex-col items-end mt-4 lg:mt-6">
                            <Link href="/checkout" passHref>
                                <button
                                    className={`btn btn-primary btn-block rounded-md lg:btn-wide${
                                        isUpdatingCart ? ' loading btn-square' : ''
                                    }`}
                                >
                                    {isUpdatingCart ? '' : 'Checkout'}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <p>
                    You have no items in your cart, start shopping <Link href="/shop">here</Link>.
                </p>
            )}
        </div>
    );
};

export default Cart;
