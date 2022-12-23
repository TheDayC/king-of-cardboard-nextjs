import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import Loading from '../Loading';
import { clearUpdateQuantities, setUpdatingCart, updateItemQty } from '../../store/slices/cart';
import UseCoins from '../UseCoins';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { updateLineItem } from '../../utils/commerce';
import { getPrettyPrice } from '../../utils/account/products';

export const Cart: React.FC = () => {
    const { itemCount, items, isUpdatingCart, orderId, shouldUpdateCart, balance, updateQuantities } =
        useSelector(selector);
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [shouldFetch, setShouldFetch] = useState(true);
    const itemPlural = itemCount === 1 ? 'item' : 'items';
    const status = safelyParse(session, 'status', parseAsString, 'unauthenticated');
    const shouldShowCoins = status === 'authenticated' && balance > 0;

    const handleUpdateQuantities = async () => {
        if (updateQuantities.length <= 0) return;

        dispatch(setUpdatingCart(true));

        for (const item of updateQuantities) {
            dispatch(updateItemQty(item));
        }

        dispatch(clearUpdateQuantities());
        dispatch(setUpdatingCart(false));
    };

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
                                        id={item._id}
                                        sku={item.sku}
                                        name={item.title}
                                        slug={item.slug}
                                        image={item.mainImage}
                                        price={item.price}
                                        salePrice={item.salePrice}
                                        unitAmount={getPrettyPrice(item.price)}
                                        totalAmount={getPrettyPrice(item.price * item.quantity)}
                                        quantity={item.quantity}
                                        stock={item.stock}
                                        key={`cart-item-${item.title}`}
                                    />
                                ))}
                        </div>
                        {<CartTotals />}
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
