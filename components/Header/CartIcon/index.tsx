import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Link from 'next/link';

import selector from './selector';

export const CartIcon: React.FC = () => {
    const { cartItemCount } = useSelector(selector);

    return (
        <Link href="/cart" passHref>
            <div className="flex justify-start items-center indicator cursor-pointer rounded-md hover:bg-neutral-focus relative mr-4 lg:mr-2">
                <div className="p-2 text-2xl">
                    <AiOutlineShoppingCart />
                </div>
                {cartItemCount > 0 && (
                    <div className="indicator-item badge badge-primary p-1.5 m-1.5">{cartItemCount}</div>
                )}
            </div>
        </Link>
    );
};

export default CartIcon;
