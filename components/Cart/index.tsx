import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import AuthProviderContext from '../../context/context';
import { createOrder } from '../../store/slices/cart';
import { orderQueryParams } from '../../utils/commerce';

export const Cart: React.FC = () => {
    const { cartItemCount, orderId, order } = useSelector(selector);
    const dispatch = useDispatch();

    const itemPlural = cartItemCount === 1 ? 'item' : 'items';
    // const hasCartItems = fullCartItemData.length > 0;
    const hasCartItems = true;

    return (
        <div className="flex flex-col">
            <h1 className="mb-8">{`Your basket (${cartItemCount} ${itemPlural})`}</h1>
            {hasCartItems ? (
                <div className="overflow-x-auto">
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
                            {/* fullCartItemData.map((item) => (
                                <CartItem {...item} key={item.name} />
                            )) <CartTotals />*/}

                            <tr>
                                <td align="right" colSpan={5}>
                                    <Link href="/checkout" passHref>
                                        <button className="btn btn-primary btn-lg">Checkout</button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>
                    You have no items in your basket, start shopping <a href="/shop">here</a>.
                </p>
            )}
        </div>
    );
};

export default Cart;
