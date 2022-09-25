import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import { resetConfirmationDetails } from '../../store/slices/confirmation';
import Loading from '../Loading';
import {
    clearUpdateQuantities,
    fetchCartItems,
    fetchCartTotals,
    fetchItemCount,
    setShouldUpdateCart,
    setUpdatingCart,
} from '../../store/slices/cart';
import UseCoins from '../UseCoins';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { updateLineItem } from '../../utils/commerce';

interface CartProps {
    accessToken: string | null;
}

export const Cart: React.FC<CartProps> = ({ accessToken }) => {
    const { itemCount, items, isUpdatingCart, orderId, shouldUpdateCart, balance, updateQuantities } =
        useSelector(selector);
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const router = useRouter();
    const [shouldFetch, setShouldFetch] = useState(true);
    const itemPlural = itemCount === 1 ? 'item' : 'items';
    const status = safelyParse(session, 'status', parseAsString, 'unauthenticated');
    const shouldShowCoins = status === 'authenticated' && balance > 0;

    // Catch all function to update the primary aspects of the cart.
    const updateCart = useCallback(() => {
        if (!accessToken || !orderId) return;
        dispatch(fetchCartItems({ accessToken, orderId }));
        dispatch(fetchCartTotals({ accessToken, orderId }));
        dispatch(fetchItemCount({ accessToken, orderId }));
    }, [dispatch, accessToken, orderId]);

    const handleUpdateQuantities = async () => {
        if (!accessToken || updateQuantities.length <= 0) return;

        dispatch(setUpdatingCart(true));

        for (const item of updateQuantities) {
            await updateLineItem(accessToken, item.id, item.quantity);
        }
        dispatch(clearUpdateQuantities());
        updateCart();
        dispatch(setUpdatingCart(false));
    };

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

    useEffect(() => {
        if (itemCount <= 0) {
            //dispatch(clearUpdateQuantities());
        }
    }, [dispatch, itemCount]);

    // Pre-fetch the checkout page for a better transition.
    /*     useEffect(() => {
        router.prefetch('/checkout');
    }, [router]); */

    return (
        <div className="flex flex-col">
            <h1 className="mb-4 text-2xl lg:mb-8 lg:text-5xl">{`Cart (${itemCount} ${itemPlural})`}</h1>
            {itemCount > 0 ? (
                <div className="block w-full relative">
                    <Loading show={isUpdatingCart} />
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-4 bg-neutral text-neutral-content p-2 rounded-md text-sm lg:text-md lg:p-4 lg:grid-cols-6">
                            <div className="text-center lg:table-cell">Remove</div>
                            <div className="text-center hidden lg:table-cell">&nbsp;</div>
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
                                        lineItemOptions={item.line_item_options}
                                        key={item.name}
                                    />
                                ))}
                        </div>
                        <CartTotals />
                        {shouldShowCoins && <UseCoins />}
                        <div className="flex flex-col justify-center items-center lg:flex-row lg:justify-end lg:items-end mt-4 lg:mt-6">
                            <button
                                className={`btn bg-green-400 hover:bg-green-600 border-none btn-wide rounded-md mb-4 lg:mb-0 lg:mr-4 w-full lg:btn-wide${
                                    isUpdatingCart ? ' loading btn-square' : ''
                                }${updateQuantities.length <= 0 ? ' btn-disabled' : ''}`}
                                disabled={updateQuantities.length <= 0}
                                onClick={handleUpdateQuantities}
                                role="button"
                            >
                                {isUpdatingCart ? '' : 'Update quantities'}
                            </button>
                            <Link href="/checkout" passHref>
                                <button
                                    className={`btn btn-primary w-full rounded-md lg:btn-wide${
                                        isUpdatingCart ? ' loading btn-square' : ''
                                    }`}
                                    role="button"
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
