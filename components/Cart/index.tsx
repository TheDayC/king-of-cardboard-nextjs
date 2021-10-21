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

    const fetchMatchingSkuItems = useCallback(async (token: string, cartItems: CartItemType[]) => {
        const fetchedSkuItems = await getSkus(
            token,
            cartItems.map((item) => item.sku_code)
        );

        if (fetchedSkuItems) {
            setSkuItems(fetchedSkuItems);
            dispatch(setUpdatingCart(false));
        }
    }, []);

    useEffect(() => {
        dispatch(resetConfirmationDetails());
    }, []);

    useEffect(() => {
        if (accessToken && items) {
            dispatch(setUpdatingCart(true));
            fetchMatchingSkuItems(accessToken, items);
        }
    }, [accessToken, items]);

    return (
        <div className="flex flex-col">
            <h1 className="mb-8">{`Your basket (${cartItemCount} ${itemPlural})`}</h1>
            {cartItemCount > 0 ? (
                <div className="overflow-x-auto relative">
                    <Loading show={isUpdatingCart} />
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th className="text-center rounded-none">Remove</th>
                                <th className="text-center">Product</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                            image_url={item.image_url || null}
                                            unitAmount={item.formatted_unit_amount || null}
                                            totalAmount={item.formatted_total_amount || null}
                                            quantity={item.quantity || null}
                                            key={item.name}
                                        />
                                    );
                                })}
                            <CartTotals isConfirmation={false} />
                            <tr>
                                <td align="right" colSpan={5}>
                                    <Link href="/checkout" passHref>
                                        <button
                                            className={`btn btn-primary btn-lg${
                                                isUpdatingCart ? ' loading btn-square' : ''
                                            }`}
                                        >
                                            {isUpdatingCart ? '' : 'Checkout'}
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>
                    You have no items in your basket, start shopping <Link href="/shop">here</Link>.
                </p>
            )}
        </div>
    );
};

export default Cart;
