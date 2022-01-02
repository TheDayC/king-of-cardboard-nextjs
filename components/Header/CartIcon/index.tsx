import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Link from 'next/link';

import selector from './selector';
import { fetchItemCount } from '../../../store/slices/cart';

export const CartIcon: React.FC = () => {
    const { accessToken, itemCount, orderId } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && orderId && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchItemCount({ accessToken, orderId }));
        }
    }, [dispatch, accessToken, orderId, shouldFetch]);

    return (
        <Link href="/cart" passHref>
            <div className="flex justify-start items-center indicator cursor-pointer rounded-md hover:bg-neutral-focus relative mr-4 lg:mr-2">
                <div className="p-2 text-2xl">
                    <AiOutlineShoppingCart />
                </div>
                {itemCount > 0 && <div className="indicator-item badge badge-primary p-1.5 m-1.5">{itemCount}</div>}
            </div>
        </Link>
    );
};

export default CartIcon;
