import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import { resetConfirmationDetails } from '../../store/slices/confirmation';
import Loading from '../Loading';
import { getSkus } from '../../utils/commerce';
import { SkuItem } from '../../types/commerce';
import { CartItem as CartItemType } from '../../store/types/state';
import { setUpdatingCart } from '../../store/slices/cart';

export const Cart: React.FC = () => {
    const { cartItemCount, items, isUpdatingCart, accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const [skuItems, setSkuItems] = useState<SkuItem[] | null>(null);

    const itemPlural = cartItemCount === 1 ? 'item' : 'items';

    const fetchMatchingSkuItems = useCallback(
        async (token: string, cartItems: CartItemType[]) => {
            const fetchedSkuItems = await getSkus(
                token,
                cartItems.map((item) => item.sku_code)
            );

            if (fetchedSkuItems) {
                setSkuItems(fetchedSkuItems);
                dispatch(setUpdatingCart(false));
            }
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(resetConfirmationDetails());
    }, [dispatch]);

    useEffect(() => {
        if (accessToken && items) {
            dispatch(setUpdatingCart(true));
            fetchMatchingSkuItems(accessToken, items);
        }
    }, [accessToken, items, dispatch, fetchMatchingSkuItems]);

    return (
        <div className="flex flex-col">
            <h1 className="mb-4 text-2xl lg:mb-8 lg:text-4xl">{`Cart (${cartItemCount} ${itemPlural})`}</h1>
            {cartItemCount > 0 ? (
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
                                skuItems &&
                                items.map((item) => {
                                    const matchingSkuItem =
                                        skuItems.find((skuItem) => skuItem.sku_code === item.sku_code) || null;

                                    return (
                                        <CartItem
                                            id={item.id}
                                            skuId={matchingSkuItem ? matchingSkuItem.id : null}
                                            sku={item.sku_code || null}
                                            name={item.name || null}
                                            //image_url={item.image_url || null}
                                            unitAmount={item.formatted_unit_amount || null}
                                            totalAmount={item.formatted_total_amount || null}
                                            quantity={item.quantity || null}
                                            key={item.name}
                                        />
                                    );
                                })}
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
