import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import AuthProviderContext from '../../context/context';
import { createOrder } from '../../store/slices/cart';

export const Cart: React.FC = () => {
    const { cartItemCount, items } = useSelector(selector);
    const dispatch = useDispatch();

    const itemPlural = cartItemCount === 1 ? 'item' : 'items';

    return (
        <div className="flex flex-col">
            <h1 className="mb-8">{`Your basket (${cartItemCount} ${itemPlural})`}</h1>
            {cartItemCount > 0 ? (
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
                            {items &&
                                items.map((item) => (
                                    <CartItem
                                        id={item.id}
                                        sku={item.sku_code || null}
                                        name={item.name || null}
                                        unitAmount={item.formatted_unit_amount || null}
                                        totalAmount={item.formatted_total_amount || null}
                                        quantity={item.quantity || null}
                                        key={item.name}
                                    />
                                ))}
                            <CartTotals />
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
